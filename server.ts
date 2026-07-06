import express, { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  readDb,
  writeDb,
  hashPassword,
  generateSalt,
  signToken,
  verifyToken,
  PriceRecord,
  ProjectRecord,
  GalleryItem,
  PickupRequest,
  Testimonial,
  FAQ
} from './server/dbStore';

interface AuthenticatedRequest extends Request {
  user?: { email: string; role: string };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Use JSON and URL encoded body parsers
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Middleware: Log requests
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Middleware: Authenticate Admin via custom secure HMAC token
  function authenticateAdmin(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(412).json({ error: 'Authorization header is missing or malformed' });
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return res.status(401).json({ error: 'Invalid or expired authorization token' });
    }
    req.user = decoded;
    next();
  }

  // API Route: Login
  app.post('/api/auth/login', (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const db = readDb();
      if (email.toLowerCase() !== db.adminSettings.email.toLowerCase()) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const hash = hashPassword(password, db.adminSettings.salt);
      if (hash !== db.adminSettings.passwordHash) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // Generate secure token (valid for 8 hours)
      const exp = Date.now() + 8 * 60 * 60 * 1000;
      const token = signToken({ email: db.adminSettings.email, role: 'admin', exp });

      res.json({
        token,
        mustChangePassword: db.adminSettings.mustChangePassword,
        user: {
          email: db.adminSettings.email,
          role: 'admin'
        }
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API Route: Change Password (required on first login)
  app.post('/api/auth/change-password', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { oldPassword, newPassword } = req.body;
      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Old password and new password are required' });
      }

      const db = readDb();
      const currentHash = hashPassword(oldPassword, db.adminSettings.salt);
      if (currentHash !== db.adminSettings.passwordHash) {
        return res.status(400).json({ error: 'The current password entered is incorrect' });
      }

      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
      }

      const newSalt = generateSalt();
      const newHash = hashPassword(newPassword, newSalt);

      db.adminSettings.passwordHash = newHash;
      db.adminSettings.salt = newSalt;
      db.adminSettings.mustChangePassword = false;

      writeDb(db);
      res.json({ message: 'Password changed successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API Route: Forgot Password (mock helper for demonstration with credentials reset trigger)
  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const db = readDb();
    if (email.toLowerCase() !== db.adminSettings.email.toLowerCase()) {
      return res.status(400).json({ error: 'No administrator registered with that email' });
    }
    // Set a safety reset code or trigger password change requirement
    db.adminSettings.mustChangePassword = true;
    writeDb(db);
    res.json({
      message: 'Password reset instructions sent. For local preview, you can reset to default: Admin@12345.'
    });
  });

  // API Route: Reset credentials helper
  app.post('/api/auth/reset-credentials', (req: Request, res: Response) => {
    try {
      const db = readDb();
      const defaultSalt = generateSalt();
      const defaultHash = hashPassword('Admin@12345', defaultSalt);
      db.adminSettings.passwordHash = defaultHash;
      db.adminSettings.salt = defaultSalt;
      db.adminSettings.mustChangePassword = true;
      writeDb(db);
      res.json({ message: 'Credentials reset to default: admin@nkprestigesteel.com / Admin@12345 successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // API Route: Get User Session (Verify token)
  app.get('/api/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ error: 'Session expired or invalid' });
    }
    const db = readDb();
    res.json({
      user: decoded,
      mustChangePassword: db.adminSettings.mustChangePassword
    });
  });

  // --- BUSINESS INFO / SETTINGS API ---
  app.get('/api/settings', (req: Request, res: Response) => {
    const db = readDb();
    res.json({
      businessInfo: db.businessInfo,
      testimonials: db.testimonials,
      faqs: db.faqs
    });
  });

  app.put('/api/settings', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const db = readDb();
      if (req.body.businessInfo) {
        db.businessInfo = { ...db.businessInfo, ...req.body.businessInfo };
      }
      if (req.body.testimonials) {
        db.testimonials = req.body.testimonials;
      }
      if (req.body.faqs) {
        db.faqs = req.body.faqs;
      }
      writeDb(db);
      res.json({ message: 'Settings updated successfully', data: db.businessInfo });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- PRICES API ---
  app.get('/api/prices', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.prices);
  });

  app.put('/api/prices', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { updatedPrices } = req.body; // Array of PriceRecord
      if (!Array.isArray(updatedPrices)) {
        return res.status(400).json({ error: 'Invalid data format. Expected updatedPrices array.' });
      }

      const db = readDb();
      const todayStr = new Date().toISOString().split('T')[0];

      db.prices = db.prices.map((existing) => {
        const found = updatedPrices.find((u) => u.id === existing.id);
        if (!found) return existing;

        const newPrice = Number(found.priceToday);
        if (isNaN(newPrice)) return existing;

        const priceYesterday = existing.priceToday; // Store today as yesterday when updating

        // Manage history
        let history = [...existing.history];
        // If last history point is today, update it, otherwise push new day
        const lastIdx = history.length - 1;
        if (lastIdx >= 0 && history[lastIdx].date === todayStr) {
          history[lastIdx].price = newPrice;
        } else {
          history.push({ date: todayStr, price: newPrice });
          if (history.length > 15) {
            history.shift(); // Keep last 15 days
          }
        }

        return {
          ...existing,
          priceToday: newPrice,
          priceYesterday,
          history,
        };
      });

      writeDb(db);
      res.json({ message: 'Scrap metal prices updated successfully', data: db.prices });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- PROJECTS API ---
  app.get('/api/projects', (req: Request, res: Response) => {
    const db = readDb();
    res.json(db.projects);
  });

  app.post('/api/projects', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const project: Omit<ProjectRecord, 'id'> = req.body;
      if (!project.title || !project.category || !project.imageUrl) {
        return res.status(400).json({ error: 'Title, category, and image URL are required' });
      }

      const db = readDb();
      const newProject: ProjectRecord = {
        ...project,
        id: `proj_${Date.now()}`,
        details: Array.isArray(project.details) ? project.details : []
      };

      db.projects.unshift(newProject);
      writeDb(db);
      res.status(201).json(newProject);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/projects/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updatedFields: Partial<ProjectRecord> = req.body;

      const db = readDb();
      const idx = db.projects.findIndex((p) => p.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }

      db.projects[idx] = {
        ...db.projects[idx],
        ...updatedFields,
        id, // Prevent ID overwrite
      };

      writeDb(db);
      res.json(db.projects[idx]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/projects/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      const initialLength = db.projects.length;
      db.projects = db.projects.filter((p) => p.id !== id);

      if (db.projects.length === initialLength) {
        return res.status(404).json({ error: 'Project not found' });
      }

      writeDb(db);
      res.json({ message: 'Project deleted successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- GALLERY API ---
  app.get('/api/gallery', (req: Request, res: Response) => {
    const db = readDb();
    const sorted = [...db.gallery].sort((a, b) => a.sortOrder - b.sortOrder);
    res.json(sorted);
  });

  app.post('/api/gallery', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const item: Omit<GalleryItem, 'id' | 'sortOrder'> = req.body;
      if (!item.title || !item.url || !item.type) {
        return res.status(400).json({ error: 'Title, URL, and Type (image/video) are required' });
      }

      const db = readDb();
      const maxSort = db.gallery.reduce((max, cur) => cur.sortOrder > max ? cur.sortOrder : max, 0);

      const newItem: GalleryItem = {
        ...item,
        id: `gal_${Date.now()}`,
        sortOrder: maxSort + 1
      };

      db.gallery.push(newItem);
      writeDb(db);
      res.status(201).json(newItem);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/gallery/reorder', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { orderedIds } = req.body; // Array of item IDs
      if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ error: 'Expected orderedIds array' });
      }

      const db = readDb();
      db.gallery = db.gallery.map((item) => {
        const index = orderedIds.indexOf(item.id);
        if (index !== -1) {
          return { ...item, sortOrder: index + 1 };
        }
        return item;
      });

      writeDb(db);
      res.json({ message: 'Gallery reordered successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/gallery/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const updatedFields: Partial<GalleryItem> = req.body;

      const db = readDb();
      const idx = db.gallery.findIndex((g) => g.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Gallery item not found' });
      }

      db.gallery[idx] = {
        ...db.gallery[idx],
        ...updatedFields,
        id, // Secure id
      };

      writeDb(db);
      res.json(db.gallery[idx]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/gallery/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.gallery = db.gallery.filter((g) => g.id !== id);
      writeDb(db);
      res.json({ message: 'Gallery item deleted successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- PICKUP REQUESTS API ---
  app.get('/api/pickup', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    const db = readDb();
    // Sort pickup requests: most recent first
    const sorted = [...db.pickupRequests].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(sorted);
  });

  app.post('/api/pickup', (req: Request, res: Response) => {
    try {
      const { customerName, phone, address, scrapType, quantity, preferredTime } = req.body;
      if (!customerName || !phone || !scrapType) {
        return res.status(400).json({ error: 'Customer Name, Phone and Scrap Type are required fields.' });
      }

      const db = readDb();
      const newRequest: PickupRequest = {
        id: `pickup_${Date.now()}`,
        customerName,
        phone,
        address: address || 'No address provided',
        scrapType,
        quantity: quantity || 'Unspecified',
        preferredTime: preferredTime || 'Flexible',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      db.pickupRequests.unshift(newRequest);
      writeDb(db);
      res.status(201).json({ message: 'Pickup request submitted successfully', data: newRequest });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put('/api/pickup/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Invalid pickup status' });
      }

      const db = readDb();
      const idx = db.pickupRequests.findIndex((r) => r.id === id);
      if (idx === -1) {
        return res.status(404).json({ error: 'Pickup request not found' });
      }

      db.pickupRequests[idx].status = status as PickupRequest['status'];
      writeDb(db);
      res.json(db.pickupRequests[idx]);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete('/api/pickup/:id', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { id } = req.params;
      const db = readDb();
      db.pickupRequests = db.pickupRequests.filter((r) => r.id !== id);
      writeDb(db);
      res.json({ message: 'Pickup request deleted successfully' });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- BACKUP & EXPORT/IMPORT SERVICES ---
  app.get('/api/admin/backup', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const db = readDb();
      res.setHeader('Content-disposition', 'attachment; filename=nk_prestige_backup.json');
      res.setHeader('Content-type', 'application/json');
      res.write(JSON.stringify(db, null, 2), 'utf-8');
      res.end();
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post('/api/admin/restore', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const payload = req.body;
      if (!payload.adminSettings || !payload.businessInfo || !payload.prices) {
        return res.status(400).json({ error: 'Invalid database backup. Mandatory fields missing.' });
      }

      writeDb(payload);
      res.json({ message: 'Database restored successfully', data: payload.businessInfo });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get('/api/admin/export-csv/:type', authenticateAdmin, (req: AuthenticatedRequest, res: Response) => {
    try {
      const { type } = req.params;
      const db = readDb();

      res.setHeader('Content-disposition', `attachment; filename=nk_prestige_${type}_export.csv`);
      res.setHeader('Content-type', 'text/csv');

      if (type === 'prices') {
        let csv = 'ID,Scrap Metal Name,Category,Price Today,Price Yesterday,Unit\n';
        db.prices.forEach((p) => {
          csv += `"${p.id}","${p.name.replace(/"/g, '""')}","${p.category}",${p.priceToday},${p.priceYesterday},"${p.unit}"\n`;
        });
        return res.send(csv);
      } else if (type === 'pickups') {
        let csv = 'ID,Customer Name,Phone,Address,Scrap Type,Quantity,Preferred Time,Status,Created At\n';
        db.pickupRequests.forEach((r) => {
          csv += `"${r.id}","${r.customerName.replace(/"/g, '""')}","${r.phone.replace(/"/g, '""')}","${r.address.replace(/"/g, '""')}","${r.scrapType.replace(/"/g, '""')}","${r.quantity.replace(/"/g, '""')}","${r.preferredTime.replace(/"/g, '""')}","${r.status}","${r.createdAt}"\n`;
        });
        return res.send(csv);
      }

      res.status(400).send('Invalid export type requested');
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- INTEGRATED VITE / PRODUCTION FLOW ---

  // Vite middleware in Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Running in DEVELOPMENT mode with Vite dev middleware');
  } else {
    // In Production: Serve the compiled frontend code in `dist/`
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Running in PRODUCTION mode, serving static files from dist/');
  }

  // Fallback handler for Express 5 compatibility
  app.get('*all', (req, res) => {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
    } else {
      res.status(404).send('Not Found');
    }
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server successfully booted and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error('Critical failure starting Express server:', error);
});
