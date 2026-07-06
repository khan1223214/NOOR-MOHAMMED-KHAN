import { useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken } from './utils';
import { PriceRecord, ProjectRecord, GalleryItem, PickupRequest, BusinessInfo, Testimonial, FAQ } from './types';

// Import Views
import HomeView from './components/views/HomeView';
import ServicesView from './components/views/ServicesView';
import PricesView from './components/views/PricesView';
import ProjectsView from './components/views/ProjectsView';
import GalleryView from './components/views/GalleryView';
import ContactView from './components/views/ContactView';
import AdminLoginView from './components/views/AdminLoginView';
import AdminDashboardView from './components/views/AdminDashboardView';

// Import Components
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import PickupModal from './components/PickupModal';
import { ShieldAlert, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [isPickupOpen, setIsPickupOpen] = useState(false);

  // Database lists
  const [prices, setPrices] = useState<PriceRecord[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  
  // Default fallback info in case API is loading
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: 'NK Prestige Steel Corporation',
    phone: '+91-9930472834',
    whatsapp: '+91-9930472834',
    email: 'info@nkprestigesteel.com',
    address: 'Office No. 704, Platina Tower, Bandra Kurla Complex, Bandra (East), Mumbai, Maharashtra, India - 400051',
    website: 'https://nkprestigesteel.com',
    googleMapsIframe: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.8016484379237!2d72.86178821489785!3d19.072461987089457!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e65e4fffff%3A0xe5452d37c8621437!2sBandra%20Kurla%20Complex!5e0!3m2!1sen!2sin!4v1655674589254!5m2!1sen!2sin',
    businessHours: 'Monday - Saturday: 9:00 AM - 7:00 PM',
    seoTitle: 'NK Prestige Steel Corporation - High Grade Industrial Scrap Metals & Demolition',
    seoDescription: 'Leading Scrap Metal Trading, Industrial Factory Demolition, Plant Dismantling, and Heavy Rigging Shifting Services in India.',
    seoKeywords: 'NK Prestige Steel, scrap metal trading, factory dismantling Mumbai'
  });

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all basic corporate public datasets
  const fetchPublicData = async () => {
    try {
      const [settingsRes, pricesRes, projectsRes, galleryRes] = await Promise.all([
        api.getSettings(),
        api.getPrices(),
        api.getProjects(),
        api.getGallery()
      ]);

      setBusinessInfo(settingsRes.businessInfo);
      setTestimonials(settingsRes.testimonials);
      setFaqs(settingsRes.faqs);
      setPrices(pricesRes);
      setProjects(projectsRes);
      setGallery(galleryRes);
    } catch (err: any) {
      console.error('Error fetching public dataset:', err);
      setError('Connection timeout. Please verify backend server is active.');
    }
  };

  // Fetch admin-only pickup requests
  const fetchAdminData = async () => {
    try {
      const pickupsRes = await api.getPickups();
      setPickups(pickupsRes);
    } catch (err) {
      console.error('Failed to fetch admin dashboard payload:', err);
    }
  };

  // Run global initial bootstrap
  useEffect(() => {
    const initApp = async () => {
      setLoading(true);
      setError(null);

      // 1. Load public state
      await fetchPublicData();

      // 2. Auth session verification
      const savedToken = getStoredToken();
      if (savedToken) {
        try {
          const authMe = await api.me();
          setIsAdmin(true);
          setMustChangePassword(authMe.mustChangePassword);
          // 3. Load admin-only queues
          await fetchAdminData();
        } catch (_) {
          // Token expired or invalid
          setStoredToken(null);
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };

    initApp();

    // Listen for global standard unauthorized logout signals
    const handleLogoutSignal = () => {
      setIsAdmin(false);
      setPickups([]);
      setCurrentTab('admin-login');
    };

    window.addEventListener('admin-logout', handleLogoutSignal);
    return () => window.removeEventListener('admin-logout', handleLogoutSignal);
  }, []);

  // Update dynamic SEO configurations based on fetched settings
  useEffect(() => {
    if (businessInfo) {
      document.title = businessInfo.seoTitle || 'NK Prestige Steel Corporation';
      
      // Update SEO meta descriptions dynamically
      let metaDesc = document.querySelector("meta[name='description']");
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', businessInfo.seoDescription || '');

      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', businessInfo.seoKeywords || '');
    }
  }, [businessInfo]);

  // Auth logins trigger
  const handleLoginSuccess = async (token: string, mustChange: boolean, user: any) => {
    setStoredToken(token);
    setIsAdmin(true);
    setMustChangePassword(mustChange);
    await fetchAdminData();
    setCurrentTab('dashboard');
  };

  // Logout trigger
  const handleLogout = () => {
    setStoredToken(null);
    setIsAdmin(false);
    setPickups([]);
    setCurrentTab('home');
  };

  const handleDataRefresh = async () => {
    await fetchPublicData();
    if (isAdmin) {
      await fetchAdminData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-gold-500 selection:text-industrial-black">
      
      {/* 1. TOP NAVIGATION HEADER */}
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      {/* 2. MAIN CORE CONTENT ROUTER FRAME */}
      <main className="flex-grow">
        {loading ? (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 text-gray-400 font-mono text-xs">
            <RefreshCw className="w-8 h-8 text-gold-500 animate-spin" />
            <span>Establishing secure environment. Loading corporate datasets...</span>
          </div>
        ) : error ? (
          <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-4 p-6 text-center">
            <ShieldAlert className="w-12 h-12 text-red-500 animate-bounce" />
            <h2 className="text-xl font-bold font-display text-white uppercase tracking-tight">System Connection Failure</h2>
            <p className="text-xs text-gray-500 max-w-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-6 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase rounded"
            >
              Retry Connection Bridge
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in duration-500">
            {currentTab === 'home' && (
              <HomeView
                onTabChange={setCurrentTab}
                onOpenPickup={() => setIsPickupOpen(true)}
                prices={prices}
                projects={projects}
                testimonials={testimonials}
              />
            )}
            
            {currentTab === 'services' && (
              <ServicesView onOpenPickup={() => setIsPickupOpen(true)} />
            )}
            
            {currentTab === 'prices' && (
              <PricesView
                prices={prices}
                onOpenPickup={() => setIsPickupOpen(true)}
              />
            )}
            
            {currentTab === 'projects' && (
              <ProjectsView projects={projects} />
            )}
            
            {currentTab === 'gallery' && (
              <GalleryView gallery={gallery} />
            )}
            
            {currentTab === 'contact' && (
              <ContactView
                businessInfo={businessInfo}
                onOpenPickup={() => setIsPickupOpen(true)}
              />
            )}
            
            {currentTab === 'admin-login' && (
              <AdminLoginView onLoginSuccess={handleLoginSuccess} />
            )}
            
            {currentTab === 'dashboard' && isAdmin && (
              <AdminDashboardView
                prices={prices}
                projects={projects}
                gallery={gallery}
                pickups={pickups}
                businessInfo={businessInfo}
                testimonials={testimonials}
                faqs={faqs}
                onDataRefresh={handleDataRefresh}
              />
            )}
          </div>
        )}
      </main>

      {/* 3. CORPORATE RICH FOOTER */}
      {!loading && !error && (
        <Footer businessInfo={businessInfo} onTabChange={setCurrentTab} />
      )}

      {/* 4. CONVERSION FLOATING WHATSAPP BUTTON */}
      {!loading && !error && (
        <WhatsAppWidget businessInfo={businessInfo} />
      )}

      {/* 5. INTERACTIVE COMPLIMENTARY PICKUP PORTAL MODAL */}
      <PickupModal
        isOpen={isPickupOpen}
        onClose={() => setIsPickupOpen(false)}
      />

    </div>
  );
}
