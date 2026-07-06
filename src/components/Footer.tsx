import { Hammer, Mail, Phone, MapPin, Clock, Award, Shield, CheckCircle } from 'lucide-react';
import { BusinessInfo } from '../types';

interface FooterProps {
  businessInfo: BusinessInfo;
  onTabChange: (tab: string) => void;
}

export default function Footer({ businessInfo, onTabChange }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLinkClick = (id: string) => {
    onTabChange(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-industrial-border pt-16 pb-8 relative overflow-hidden">
      {/* Dynamic Background subtle accents */}
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-gold-500/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Col */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleLinkClick('home')}>
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600">
                <Hammer className="w-5 h-5 text-industrial-black" />
              </div>
              <div>
                <span className="block text-base font-bold font-display tracking-tight text-white group-hover:text-gold-400 transition-colors">
                  NK PRESTIGE
                </span>
                <span className="block text-[9px] font-semibold tracking-widest text-gold-400 uppercase leading-none">
                  STEEL CORPORATION
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              NK Prestige Steel Corporation is India's leading tier-1 provider of scrap metal liquidation, engineered industrial dismantling, safety-first demolition, and heavy machinery shifting.
            </p>
            <div className="flex flex-col gap-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Shield className="w-4 h-4 text-gold-400 shrink-0" />
                <span>ISO 9001:2015 Certified Operator</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Award className="w-4 h-4 text-gold-400 shrink-0" />
                <span>Government Approved Salvage Contractor</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-white border-b border-industrial-border pb-3 mb-6">
              Quick Navigation
            </h3>
            <ul className="space-y-3.5 text-sm text-gray-400">
              <li>
                <button onClick={() => handleLinkClick('home')} className="hover:text-gold-400 transition-colors text-left cursor-pointer">
                  Corporate Home
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('services')} className="hover:text-gold-400 transition-colors text-left cursor-pointer">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('prices')} className="hover:text-gold-400 transition-colors text-left cursor-pointer">
                  Scrap Prices Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('projects')} className="hover:text-gold-400 transition-colors text-left cursor-pointer">
                  Portfolio Projects
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('gallery')} className="hover:text-gold-400 transition-colors text-left cursor-pointer">
                  Photo & Video Media
                </button>
              </li>
              <li>
                <button onClick={() => handleLinkClick('contact')} className="hover:text-gold-400 transition-colors text-left cursor-pointer">
                  Contact & Support
                </button>
              </li>
            </ul>
          </div>

          {/* Core Services */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-white border-b border-industrial-border pb-3 mb-6">
              Core Capabilities
            </h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Heavy Melting Steel Trading</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Non-Ferrous Alloy Liquidation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Chemical Plant Dismantling</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Boiler & Silo Demolition</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>Heavy Generator Crane Lifting</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                <span>E-Waste & Battery Recycling</span>
              </li>
            </ul>
          </div>

          {/* Corporate Office */}
          <div>
            <h3 className="text-sm font-bold tracking-widest uppercase text-white border-b border-industrial-border pb-3 mb-6">
              Contact Channels
            </h3>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex gap-3">
                <MapPin className="w-5 h-5 text-gold-400 shrink-0 pt-0.5" />
                <span>
                  Office 704, Platina Tower, Bandra Kurla Complex, Bandra (E), Mumbai, MH - 400051
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${businessInfo.phone}`} className="hover:text-gold-400 transition-colors">
                  {businessInfo.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${businessInfo.email}`} className="hover:text-gold-400 transition-colors break-all">
                  {businessInfo.email}
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="text-xs leading-relaxed">
                  {businessInfo.businessHours}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-industrial-border/60 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 font-mono">
          <p>© {currentYear} NK Prestige Steel Corporation. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gold-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-400 transition-colors">Terms of Service</a>
            <button onClick={() => handleLinkClick('admin-login')} className="hover:text-gold-400 transition-colors cursor-pointer">
              Admin Area
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
