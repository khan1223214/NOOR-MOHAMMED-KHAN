import { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, PhoneCall, Hammer, Award } from 'lucide-react';
import { classNames } from '../utils';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  isAdmin: boolean;
  onLogout: () => void;
}

export default function Header({ currentTab, onTabChange, isAdmin, onLogout }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'prices', label: 'Scrap Prices' },
    { id: 'projects', label: 'Our Projects' },
    { id: 'gallery', label: 'Media Gallery' },
    { id: 'contact', label: 'Contact Us' },
  ];

  const handleLinkClick = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={classNames(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        isScrolled
          ? 'bg-industrial-black/95 backdrop-blur-md py-4 border-industrial-border shadow-lg shadow-black/50'
          : 'bg-transparent py-6 border-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => handleLinkClick('home')}
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 shadow-lg shadow-gold-500/10">
              <Hammer className="w-6 h-6 text-industrial-black stroke-[2]" />
              <div className="absolute inset-0 rounded-lg border border-white/20 scale-90 group-hover:scale-100 transition-transform duration-300" />
            </div>
            <div>
              <span className="block text-lg font-bold font-display tracking-tight text-white group-hover:text-gold-400 transition-colors duration-300">
                NK PRESTIGE
              </span>
              <span className="block text-[10px] font-semibold tracking-widest text-gold-400 uppercase leading-none">
                STEEL CORPORATION
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={classNames(
                  'relative text-sm font-medium tracking-wide uppercase py-1.5 transition-all duration-300 focus:outline-none cursor-pointer',
                  currentTab === link.id
                    ? 'text-gold-400'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                {link.label}
                {currentTab === link.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Button & Admin Session state */}
          <div className="hidden md:flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleLinkClick('dashboard')}
                  className={classNames(
                    'flex items-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider text-gold-400 uppercase border rounded border-gold-500/40 hover:bg-gold-500/10 transition-all cursor-pointer',
                    currentTab === 'dashboard' ? 'bg-gold-500/15 border-gold-400' : ''
                  )}
                >
                  <ShieldCheck className="w-4 h-4 text-gold-400 animate-pulse" />
                  Admin Control
                </button>
                <button
                  onClick={onLogout}
                  className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-white transition-all hover:bg-white/5 rounded cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => onTabChange('admin-login')}
                className="text-xs text-gray-400 hover:text-gold-400 font-medium tracking-wide uppercase transition-colors py-2 cursor-pointer"
              >
                Admin Login
              </button>
            )}

            <button
              onClick={() => handleLinkClick('contact')}
              className="flex items-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-industrial-black text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded shadow-lg shadow-gold-500/15 hover:shadow-gold-500/25 transition-all cursor-pointer"
            >
              <PhoneCall className="w-4 h-4" />
              Get Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            {isAdmin && (
              <button
                onClick={() => handleLinkClick('dashboard')}
                className="p-1.5 rounded text-gold-400 border border-gold-500/30 bg-gold-500/5 cursor-pointer"
                title="Admin Dashboard"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-steel-gray/50 transition-colors focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-industrial-black border-b border-industrial-border/80 absolute top-full left-0 right-0 overflow-y-auto max-h-[85vh] shadow-2xl">
          <div className="px-4 pt-3 pb-6 space-y-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={classNames(
                  'w-full text-left px-4 py-3 rounded-md text-base font-medium uppercase tracking-wide transition-all cursor-pointer',
                  currentTab === link.id
                    ? 'bg-gold-500/10 text-gold-400 border-l-4 border-gold-500'
                    : 'text-gray-300 hover:bg-steel-gray/30 hover:text-white'
                )}
              >
                {link.label}
              </button>
            ))}

            {isAdmin ? (
              <div className="pt-4 border-t border-industrial-border space-y-2 px-4">
                <button
                  onClick={() => handleLinkClick('dashboard')}
                  className={classNames(
                    'w-full flex items-center gap-3 py-2.5 text-sm font-semibold text-gold-400 cursor-pointer',
                    currentTab === 'dashboard' ? 'underline' : ''
                  )}
                >
                  <ShieldCheck className="w-5 h-5" />
                  Access Admin Dashboard
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left py-2 text-sm font-medium text-red-400 cursor-pointer"
                >
                  Sign Out as Administrator
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-industrial-border px-4">
                <button
                  onClick={() => handleLinkClick('admin-login')}
                  className="w-full text-left py-2 text-sm font-medium text-gray-400 hover:text-gold-400 cursor-pointer"
                >
                  Administrator Portal
                </button>
              </div>
            )}

            <div className="pt-4 px-4">
              <button
                onClick={() => handleLinkClick('contact')}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black font-bold uppercase py-3 rounded tracking-wider cursor-pointer shadow-lg"
              >
                <PhoneCall className="w-4 h-4" />
                Contact Us Now
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
