import { PriceRecord, ProjectRecord, GalleryItem, PickupRequest, SiteSettings } from './types';

// API Client Wrapper using standard fetch
const TOKEN_KEY = 'nk_prestige_admin_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, { ...options, headers });
  
  if (!res.ok) {
    let errMsg = 'An unexpected error occurred';
    try {
      const errBody = await res.json();
      errMsg = errBody.error || errMsg;
    } catch (_) {}
    
    // Auto logout if unauthorized (session expired)
    if (res.status === 401 && !url.includes('/api/auth/login')) {
      setStoredToken(null);
      window.dispatchEvent(new Event('admin-logout'));
    }
    throw new Error(errMsg);
  }

  // Handle file downloads
  const contentType = res.headers.get('content-type');
  if (contentType && (contentType.includes('application/json') || contentType.includes('text/json'))) {
    return res.json() as Promise<T>;
  } else {
    return res.text() as unknown as Promise<T>;
  }
}

export const api = {
  // Authentication
  login: (credentials: any) => request<{ token: string; mustChangePassword: boolean; user: any }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  
  changePassword: (passwords: any) => request<{ message: string }>('/api/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(passwords)
  }),

  forgotPassword: (email: string) => request<{ message: string }>('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),
  
  resetCredentials: () => request<{ message: string }>('/api/auth/reset-credentials', {
    method: 'POST'
  }),
  
  me: () => request<{ user: any; mustChangePassword: boolean }>('/api/auth/me'),

  // Scrap Prices
  getPrices: () => request<PriceRecord[]>('/api/prices'),
  updatePrices: (updatedPrices: PriceRecord[]) => request<{ message: string; data: PriceRecord[] }>('/api/prices', {
    method: 'PUT',
    body: JSON.stringify({ updatedPrices })
  }),

  // Projects
  getProjects: () => request<ProjectRecord[]>('/api/projects'),
  createProject: (project: Omit<ProjectRecord, 'id'>) => request<ProjectRecord>('/api/projects', {
    method: 'POST',
    body: JSON.stringify(project)
  }),
  updateProject: (id: string, project: Partial<ProjectRecord>) => request<ProjectRecord>(`/api/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(project)
  }),
  deleteProject: (id: string) => request<{ message: string }>(`/api/projects/${id}`, {
    method: 'DELETE'
  }),

  // Gallery
  getGallery: () => request<GalleryItem[]>('/api/gallery'),
  createGalleryItem: (item: Omit<GalleryItem, 'id' | 'sortOrder'>) => request<GalleryItem>('/api/gallery', {
    method: 'POST',
    body: JSON.stringify(item)
  }),
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => request<GalleryItem>(`/api/gallery/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item)
  }),
  deleteGalleryItem: (id: string) => request<{ message: string }>(`/api/gallery/${id}`, {
    method: 'DELETE'
  }),
  reorderGallery: (orderedIds: string[]) => request<{ message: string }>('/api/gallery/reorder', {
    method: 'PUT',
    body: JSON.stringify({ orderedIds })
  }),

  // Pickup Requests
  getPickups: () => request<PickupRequest[]>('/api/pickup'),
  createPickup: (pickup: Omit<PickupRequest, 'id' | 'status' | 'createdAt'>) => request<{ message: string; data: PickupRequest }>('/api/pickup', {
    method: 'POST',
    body: JSON.stringify(pickup)
  }),
  updatePickupStatus: (id: string, status: string) => request<PickupRequest>(`/api/pickup/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  }),
  deletePickup: (id: string) => request<{ message: string }>(`/api/pickup/${id}`, {
    method: 'DELETE'
  }),

  // General Settings
  getSettings: () => request<SiteSettings>('/api/settings'),
  updateSettings: (settings: Partial<SiteSettings>) => request<{ message: string; data: any }>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settings)
  }),

  // Backup & Import/Export endpoints (returns raw text, handled differently in dashboard)
  getBackupUrl: () => {
    const token = getStoredToken() || '';
    return `/api/admin/backup?token=${encodeURIComponent(token)}`;
  },
  restoreBackup: (backupData: any) => request<{ message: string }>('/api/admin/restore', {
    method: 'POST',
    body: JSON.stringify(backupData)
  }),
  getExportUrl: (type: 'prices' | 'pickups') => {
    const token = getStoredToken() || '';
    return `/api/admin/export-csv/${type}?token=${encodeURIComponent(token)}`;
  }
};

// Formatting helpers
export function formatINR(value: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(value);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function classNames(...classes: any[]): string {
  return classes.filter(Boolean).join(' ');
}
