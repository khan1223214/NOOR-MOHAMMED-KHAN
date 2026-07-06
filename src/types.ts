export interface PriceRecord {
  id: string;
  name: string;
  category: 'ferrous' | 'non-ferrous' | 'machinery' | 'recyclables' | 'demolition' | 'other';
  priceToday: number;
  priceYesterday: number;
  unit: string;
  history: { date: string; price: number }[];
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
  scale: string;
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

export interface SiteSettings {
  businessInfo: BusinessInfo;
  testimonials: Testimonial[];
  faqs: FAQ[];
}

export interface AuthState {
  token: string | null;
  user: { email: string; role: string } | null;
  mustChangePassword: boolean;
  loading: boolean;
}
