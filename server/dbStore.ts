import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

export interface PriceRecord {
  id: string;
  name: string;
  category: 'ferrous' | 'non-ferrous' | 'machinery' | 'recyclables' | 'demolition' | 'other';
  priceToday: number;
  priceYesterday: number;
  unit: string;
  history: { date: string; price: number }[]; // 15-day history for charts
}

export interface ProjectRecord {
  id: string;
  title: string;
  category: string;
  client: string;
  location: string;
  description: string;
  details: string[];
  imageUrl: string;
  videoUrl?: string;
  date: string;
  scale: string; // e.g., "150 Tons", "12-Story"
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  sortOrder: number;
}

export interface PickupRequest {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  scrapType: string;
  quantity: string;
  preferredTime: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  company: string;
  comment: string;
  rating: number;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BusinessInfo {
  name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  website: string;
  googleMapsIframe: string;
  businessHours: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
}

export interface AppDatabase {
  adminSettings: {
    email: string;
    passwordHash: string;
    salt: string;
    mustChangePassword: boolean;
  };
  businessInfo: BusinessInfo;
  prices: PriceRecord[];
  projects: ProjectRecord[];
  gallery: GalleryItem[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  pickupRequests: PickupRequest[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

// Encryption utilities
export function hashPassword(password: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

export function generateSalt(): string {
  return crypto.randomBytes(16).toString('hex');
}

const JWT_SECRET = process.env.JWT_SECRET || 'nk-prestige-steel-corporate-gold-key-2026';

export function signToken(payload: { email: string; role: string; exp: number }): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const pay = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${pay}`).digest('base64url');
  return `${header}.${pay}.${signature}`;
}

export function verifyToken(token: string): { email: string; role: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, pay, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${pay}`).digest('base64url');
    if (signature !== expectedSignature) return null;
    const payload = JSON.parse(Buffer.from(pay, 'base64url').toString('utf8'));
    if (Date.now() > payload.exp) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

// Pre-seeded high fidelity data
const initialPrices = (): PriceRecord[] => {
  const categories: { name: string; category: PriceRecord['category']; basePrice: number; unit: string }[] = [
    { name: 'MS Scrap (Heavy Melting Steel)', category: 'ferrous', basePrice: 42.50, unit: 'INR/kg' },
    { name: 'Ferrous Scrap (HMS 1 & 2)', category: 'ferrous', basePrice: 38.00, unit: 'INR/kg' },
    { name: 'Non Ferrous Scrap Blend', category: 'non-ferrous', basePrice: 110.00, unit: 'INR/kg' },
    { name: 'Copper Millberry Scrap', category: 'non-ferrous', basePrice: 685.00, unit: 'INR/kg' },
    { name: 'Aluminium Extrusion Scrap', category: 'non-ferrous', basePrice: 172.00, unit: 'INR/kg' },
    { name: 'Brass Honey Scrap', category: 'non-ferrous', basePrice: 430.00, unit: 'INR/kg' },
    { name: 'Iron Cast Scrap', category: 'ferrous', basePrice: 36.50, unit: 'INR/kg' },
    { name: 'Steel Plate & Pipe Scrap', category: 'ferrous', basePrice: 52.00, unit: 'INR/kg' },
    { name: 'Electrical Cable Scrap (Heavy)', category: 'non-ferrous', basePrice: 240.00, unit: 'INR/kg' },
    { name: 'Electronic PCB Waste', category: 'recyclables', basePrice: 120.00, unit: 'INR/kg' },
    { name: 'Industrial UPS Batteries', category: 'recyclables', basePrice: 78.00, unit: 'INR/kg' },
    { name: 'Diesel Generator Scrap (Cast)', category: 'machinery', basePrice: 140.00, unit: 'INR/kg' },
    { name: 'Computer Server Waste', category: 'recyclables', basePrice: 190.00, unit: 'INR/kg' },
    { name: 'Old Machinery & Engines', category: 'machinery', basePrice: 46.00, unit: 'INR/kg' },
    { name: 'Office Document Paper Scrap', category: 'recyclables', basePrice: 12.00, unit: 'INR/kg' },
    { name: 'HDPE / Industrial Plastic', category: 'recyclables', basePrice: 22.00, unit: 'INR/kg' },
    { name: 'Industrial Wood Pallets', category: 'recyclables', basePrice: 8.00, unit: 'INR/kg' },
  ];

  const now = new Date();
  return categories.map((item, idx) => {
    const history: { date: string; price: number }[] = [];
    let rollingPrice = item.basePrice;

    // Generate 15 days of historical data
    for (let i = 14; i >= 0; i--) {
      const dateStr = new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      // Slight random walk (+/- 2%)
      const fluctuation = (Math.sin(idx + i) * 0.015) + (Math.cos(i) * 0.01);
      rollingPrice = Number((rollingPrice * (1 + fluctuation)).toFixed(2));
      history.push({ date: dateStr, price: rollingPrice });
    }

    const priceToday = rollingPrice;
    // Yesterday's price is the second to last element
    const priceYesterday = history[history.length - 2]?.price || priceToday * 0.98;

    return {
      id: `price_${idx + 1}`,
      name: item.name,
      category: item.category,
      priceToday,
      priceYesterday,
      unit: item.unit,
      history,
    };
  });
};

const initialProjects = (): ProjectRecord[] => [
  {
    id: 'proj_1',
    title: 'Automotive Factory Dismantling',
    category: 'Factory Dismantling',
    client: 'Apex Motors Ltd',
    location: 'Pune, Maharashtra',
    description: 'Complete decommissioning and systematic dismantling of a 150,000 sq ft vehicle assembly line, including retrieval of heavy stamping presses, conveyor lines, and heavy structural steels.',
    details: [
      'Successfully cleared 2,200 metric tons of mixed structural steel scrap.',
      'Surgically recovered 12 heavy industrial robotic arms for resale/re-purposing.',
      'Completed 4 days ahead of schedule with zero safety incidents.',
      'Zero interruption to nearby operational painting shop.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?auto=format&fit=crop&w=1200&q=80',
    date: '2026-03-15',
    scale: '2,200 Tons Scrap'
  },
  {
    id: 'proj_2',
    title: 'Thermal Power Plant Boiler Demolition',
    category: 'Industrial Demolition',
    client: 'National Power Grid Corp',
    location: 'Surat, Gujarat',
    description: 'Controlled hydraulic demolition and mechanical clearing of a defunct 80-meter tall cooling stack and steel boiler infrastructure using state-of-the-art heavy machinery and high-reach shears.',
    details: [
      'Controlled drop of the main structure using specialized heavy rigging.',
      'Sifted and sorted 1,500 tons of structural steel and high-carbon cast boiler tubes.',
      'Managed dust suppression using high-pressure mist cannons throughout the demolition.',
      'Recovered premium heavy copper bushings and thick alloy conductors.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80',
    date: '2026-04-22',
    scale: '1,500 Tons Steel'
  },
  {
    id: 'proj_3',
    title: 'Lifting & Shifting of 2000kVA Generators',
    category: 'Lifting & Shifting',
    client: 'Infratech Data Centers',
    location: 'Navi Mumbai, India',
    description: 'Precision lifting, complex rigging, and structural placement of 8 massive 2000kVA industrial diesel standby generators onto the high-density rooftop facility using our 500-ton hydraulic mobile cranes.',
    details: [
      'Engineered critical lift plans with detailed wind load and soil loading calculations.',
      'Executed rooftop delivery over active highway without disruptions.',
      'Secured and shifted obsolete gensets to our recycling facility.',
      'Full compliance with safety standards and zero-vibration directives.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    date: '2026-05-10',
    scale: '8 x 18-Ton Units'
  },
  {
    id: 'proj_4',
    title: 'Shipyard Decommissioning & Copper Salvage',
    category: 'Scrap Metal Trading',
    client: 'Coastal Maritime Marine',
    location: 'Veraval Port, Gujarat',
    description: 'Comprehensive marine salvage and dismantling of three decommissioned cargo vessels. High precision mechanical shear cutting and extraction of high-grade marine copper, bronze propellers, and naval brass.',
    details: [
      'Processed and baled over 4,500 tons of ship-breaking plates.',
      'Recovered 85 metric tons of premium marine-grade insulated copper cabling.',
      'Safely removed fuel oil and hazardous maritime chemicals prior to structural shearing.',
      'Immediate cash-backed trade logistics execution.'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505705694340-019e1e335916?auto=format&fit=crop&w=1200&q=80',
    date: '2026-06-02',
    scale: '4,500 Tons Metal'
  }
];

const initialGallery = (): GalleryItem[] => [
  {
    id: 'gal_1',
    title: 'Heavy Duty Scrap Shears in Action',
    description: 'Dismantling heavy structural beam steels at Navi Mumbai yard.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    category: 'Scrap Metal',
    sortOrder: 1
  },
  {
    id: 'gal_2',
    title: 'Precision Structural Cutting',
    description: 'Oxygen-acetylene surgical torch cut of an industrial container silo.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=800&q=80',
    category: 'Demolition',
    sortOrder: 2
  },
  {
    id: 'gal_3',
    title: 'Coil Yard Storage Area',
    description: 'Processed industrial steel sheets organized for domestic shipment.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    category: 'Scrap Metal',
    sortOrder: 3
  },
  {
    id: 'gal_4',
    title: 'Hydraulic Mobile Cranes',
    description: 'Our premium crane fleet executing structural lifting at high elevation.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1581092162384-8987c1794ed9?auto=format&fit=crop&w=800&q=80',
    category: 'Lifting & Shifting',
    sortOrder: 4
  },
  {
    id: 'gal_5',
    title: 'High-Grade Copper Wire Bales',
    description: 'Insulated cable cores stripped and prepared for specialized smelting plants.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
    category: 'Scrap Metal',
    sortOrder: 5
  },
  {
    id: 'gal_6',
    title: 'Excavator Demolition Attachments',
    description: 'Excavator fitted with high-pressure concrete pulverizer.',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1535732820275-9ffd998cac22?auto=format&fit=crop&w=800&q=80',
    category: 'Demolition',
    sortOrder: 6
  }
];

const initialTestimonials = (): Testimonial[] => [
  {
    id: 'test_1',
    name: 'Rajesh Singhania',
    designation: 'VP of Plant Operations',
    company: 'Sterling Alloys Ltd',
    comment: 'NK Prestige Steel dismantled our old foundry with impeccable precision. Their safety standards are strictly world-class, and they valued our metal scrap at extremely competitive rates.',
    rating: 5
  },
  {
    id: 'test_2',
    name: 'Vikram Malhotra',
    designation: 'Managing Director',
    company: 'Dynamic InfraTech',
    comment: 'Rigging and shifting 8 heavy generators onto our skyscraper rooftop felt effortless with NK Prestige. Their engineering crane operators are masters of their trade.',
    rating: 5
  },
  {
    id: 'test_3',
    name: 'Anjali Sharma',
    designation: 'Materials Procurement Head',
    company: 'Global Industries',
    comment: 'Extremely professional team. Their daily scrap pricing dashboard is highly accurate and transparent, making it very easy for us to forecast and liquidate our manufacturing waste.',
    rating: 5
  }
];

const initialFAQs = (): FAQ[] => [
  {
    id: 'faq_1',
    question: 'How do you calculate scrap metal prices?',
    answer: 'Our scrap prices are tied strictly to daily global metal exchanges (like LME) and local market conditions. We update our prices daily to guarantee transparency and provide maximum value.'
  },
  {
    id: 'faq_2',
    question: 'Are your industrial demolition services insured?',
    answer: 'Yes, NK Prestige Steel Corporation carries comprehensive third-party liability insurance, structural damage insurance, and workmen compensation coverage. Safety is our primary corporate directive.'
  },
  {
    id: 'faq_3',
    question: 'Do you charge for picking up scrap metal?',
    answer: 'For industrial quantities (typically over 1 metric ton), we provide complimentary crane lifting, loading, and container transportation. For smaller requests, nominal transport charges may apply.'
  },
  {
    id: 'faq_4',
    question: 'Do you handle e-waste and UPS battery recycling?',
    answer: 'Absolutely. We hold state environmental pollution control board approvals for ethical, green recycling of lead-acid batteries, computer hardware, servers, and heavy electrical scrap.'
  }
];

const initialPickupRequests = (): PickupRequest[] => [
  {
    id: 'req_1',
    customerName: 'Aditya Birla Transformers Ltd',
    phone: '+91-9865432109',
    address: 'Sector 3, MIDC Industrial Area, Taloja, Navi Mumbai',
    scrapType: 'Copper Scrap & Electrical Transformers',
    quantity: '5.4 Tons',
    preferredTime: '2026-07-12 morning',
    status: 'pending',
    createdAt: new Date().toISOString()
  },
  {
    id: 'req_2',
    customerName: 'Aries Precision Heavy Eng',
    phone: '+91-9922114455',
    address: 'GIDC Estate, Phase III, Vatva, Ahmedabad, Gujarat',
    scrapType: 'Ferrous Scrap (HMS 1 & 2)',
    quantity: '18 Metric Tons',
    preferredTime: '2026-07-15 afternoon',
    status: 'confirmed',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];

export function initializeDb(): AppDatabase {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }

  let db: AppDatabase;
  const defaultSalt = generateSalt();
  // Password is Admin@12345
  const defaultHash = hashPassword('Admin@12345', defaultSalt);

  const defaultDb: AppDatabase = {
    adminSettings: {
      email: 'admin@nkprestigesteel.com',
      passwordHash: defaultHash,
      salt: defaultSalt,
      mustChangePassword: true
    },
    businessInfo: {
      name: 'NK Prestige Steel Corporation',
      phone: '+91-9930472834',
      whatsapp: '+91-9930472834',
      email: 'info@nkprestigesteel.com',
      address: 'Office No. 704, Platina Tower, Bandra Kurla Complex, Bandra (East), Mumbai, Maharashtra, India - 400051',
      website: 'https://nkprestigesteel.com',
      googleMapsIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8016484379237!2d72.86178821489785!3d19.072461987089457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e65e4fffff%3A0xe5452d37c8621437!2sBandra%20Kurla%20Complex!5e0!3m2!1sen!2sin!4v1655674589254!5m2!1sen!2sin',
      businessHours: 'Monday - Saturday: 9:00 AM - 7:00 PM',
      seoTitle: 'NK Prestige Steel Corporation - High Grade Industrial Scrap Metals & Demolition',
      seoDescription: 'Leading Scrap Metal Trading, Industrial Factory Demolition, Plant Dismantling, and Heavy Rigging Shifting Services in India. Best daily prices for copper, steel, and brass.',
      seoKeywords: 'NK Prestige Steel, scrap metal trading, factory dismantling Mumbai, industrial demolition, copper scrap price India, heavy crane lifting, battery recycling',
      googleAnalyticsId: 'G-NKPRESTIGE123',
      googleSearchConsoleId: 'sc-domain:nkprestigesteel.com'
    },
    prices: initialPrices(),
    projects: initialProjects(),
    gallery: initialGallery(),
    testimonials: initialTestimonials(),
    faqs: initialFAQs(),
    pickupRequests: initialPickupRequests(),
  };

  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf-8');
    db = defaultDb;
  } else {
    try {
      const data = fs.readFileSync(DB_PATH, 'utf-8');
      db = JSON.parse(data);
      // Make sure adminSettings exist
      if (!db.adminSettings) {
        db.adminSettings = defaultDb.adminSettings;
        fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
      }
    } catch (e) {
      console.error('Error reading DB file, reinitializing', e);
      fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb, null, 2), 'utf-8');
      db = defaultDb;
    }
  }

  return db;
}

export function readDb(): AppDatabase {
  return initializeDb();
}

export function writeDb(db: AppDatabase): void {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf-8');
}
