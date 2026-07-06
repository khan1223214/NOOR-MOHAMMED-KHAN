import { MessageSquare, MessageCircle } from 'lucide-react';
import { BusinessInfo } from '../types';

interface WhatsAppWidgetProps {
  businessInfo: BusinessInfo;
}

export default function WhatsAppWidget({ businessInfo }: WhatsAppWidgetProps) {
  const cleanPhone = businessInfo.whatsapp.replace(/[^0-9+]/g, '');
  const encodedText = encodeURIComponent(
    `Hello NK Prestige Steel Corporation, I am interested in your scrap metal trading and industrial services. Please contact me.`
  );
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedText}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 group">
      {/* Ripple Animation circles */}
      <span className="absolute inset-0 rounded-full bg-emerald-500/25 animate-ping duration-1000 scale-125 pointer-events-none" />
      <span className="absolute inset-0 rounded-full bg-gold-500/10 animate-pulse duration-1000 scale-150 pointer-events-none" />

      {/* Main button link */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-emerald-600 text-white shadow-2xl shadow-emerald-900/30 border border-emerald-400/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300"
        aria-label="Contact NK Prestige Steel on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white stroke-none" />
      </a>

      {/* Floating tooltip */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-industrial-card text-xs text-white px-3 py-1.5 rounded-lg border border-industrial-border shadow-xl opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap font-medium pointer-events-none">
        <span className="text-gold-400 font-bold font-display mr-1">WhatsApp Us:</span>
        <span className="font-mono">{businessInfo.whatsapp}</span>
      </div>
    </div>
  );
}
