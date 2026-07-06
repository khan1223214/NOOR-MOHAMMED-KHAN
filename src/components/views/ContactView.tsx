import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, ShieldAlert, Award, Send, MessageCircle } from 'lucide-react';
import { BusinessInfo } from '../../types';
import confetti from 'canvas-confetti';

interface ContactViewProps {
  businessInfo: BusinessInfo;
  onOpenPickup: () => void;
}

export default function ContactView({ businessInfo, onOpenPickup }: ContactViewProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cleanPhone = businessInfo.phone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = businessInfo.whatsapp.replace(/[^0-9+]/g, '');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please provide your name, email address, and message details.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Simulate real API submission for general contact message
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 50,
        colors: ['#ab833c', '#ffffff']
      });
      // Clear
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setError('An error occurred submitting your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 font-mono">
            Direct Communications
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white uppercase mt-2 tracking-tight">
            Connect With Our Estimators
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mt-4 font-sans">
            Have bulk scrap quantities to trade or an upcoming factory dismantle contract? Send us direct specifications, call our desk lines, or book a complimentary pickup survey.
          </p>
        </div>

        {/* Contact info + Map layout (12 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-start">
          
          {/* Direct channels sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider border-b border-industrial-border pb-3 mb-6">
              Office Channels
            </h3>

            {/* Address */}
            <div className="glass-panel border border-industrial-border rounded-xl p-5 flex gap-4">
              <div className="p-2.5 rounded bg-gold-500/10 text-gold-400 h-fit">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest">HQ Address</span>
                <span className="block text-sm text-white font-medium leading-relaxed font-display">
                  NK Prestige Steel Corp
                </span>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {businessInfo.address}
                </p>
              </div>
            </div>

            {/* Phones */}
            <div className="glass-panel border border-industrial-border rounded-xl p-5 flex gap-4">
              <div className="p-2.5 rounded bg-gold-500/10 text-gold-400 h-fit">
                <Phone className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest">Direct Desk Lines</span>
                <a href={`tel:${cleanPhone}`} className="block text-sm font-mono font-bold text-white hover:text-gold-400 transition-colors">
                  {businessInfo.phone}
                </a>
                <span className="block text-[10px] text-gray-500 leading-none mt-1">Available Mon-Sat, 9am - 7pm</span>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="glass-panel border border-industrial-border rounded-xl p-5 flex gap-4">
              <div className="p-2.5 rounded bg-emerald-500/10 text-emerald-400 h-fit">
                <MessageCircle className="w-5 h-5 fill-emerald-500/10" />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest text-emerald-400">WhatsApp Corporate Chat</span>
                <a
                  href={`https://wa.me/${cleanWhatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-sm font-mono font-bold text-white hover:text-emerald-400 transition-colors"
                >
                  {businessInfo.whatsapp}
                </a>
                <span className="block text-[10px] text-gray-500 leading-none mt-1">Instant gate pass coordination</span>
              </div>
            </div>

            {/* Email */}
            <div className="glass-panel border border-industrial-border rounded-xl p-5 flex gap-4">
              <div className="p-2.5 rounded bg-gold-500/10 text-gold-400 h-fit">
                <Mail className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="block text-[10px] text-gray-500 font-mono font-bold uppercase tracking-widest">Email Enquiries</span>
                <a href={`mailto:${businessInfo.email}`} className="block text-xs font-mono font-bold text-white hover:text-gold-400 transition-colors break-all">
                  {businessInfo.email}
                </a>
                <span className="block text-[10px] text-gray-500 leading-none mt-1">Reply within 3 business hours</span>
              </div>
            </div>
          </div>

          {/* Map Embedding Frame (8 cols) */}
          <div className="lg:col-span-8 h-full space-y-6">
            <h3 className="text-lg font-bold font-display text-white uppercase tracking-wider border-b border-industrial-border pb-3 mb-6">
              Geographical Location Map
            </h3>

            <div className="relative rounded-2xl overflow-hidden border border-industrial-border shadow-2xl bg-industrial-card aspect-video w-full h-[340px]">
              <iframe
                title="NK Prestige Steel HQ Map"
                src={businessInfo.googleMapsIframe}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(1) invert(0.9) contrast(1.1) brightness(0.9)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

        </div>

        {/* Form sections divider grid (12 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-8 border-t border-industrial-border/60">
          
          {/* Left: General Inquiry Form (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight">
              Inquiry Message Form
            </h3>
            
            {submitted ? (
              <div className="glass-panel p-8 text-center rounded-2xl border border-gold-500/20">
                <div className="w-12 h-12 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
                  <Send className="w-5 h-5 animate-pulse" />
                </div>
                <h4 className="text-lg font-bold text-white font-display uppercase mb-2">Message Dispatched!</h4>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
                  Thank you for writing. Our materials bidding desk and plant estimators have received your inquiry. We will contact you shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase tracking-wider rounded"
                >
                  Write Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-500/10 border border-red-500/25 rounded text-xs text-red-400 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-1.5">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikram Singhania"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-industrial-card/40 border border-industrial-border rounded-lg text-xs text-white focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-1.5">Business Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. vikram@sterlingalloys.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-industrial-card/40 border border-industrial-border rounded-lg text-xs text-white focus:outline-none focus:border-gold-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-1.5">Subject Heading</label>
                  <input
                    type="text"
                    placeholder="e.g. Machinery scrap liquidation quote"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-industrial-card/40 border border-industrial-border rounded-lg text-xs text-white focus:outline-none focus:border-gold-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-1.5">Specification / Message details *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide detailed material descriptions, estimated weights, locations, or building demolition dimensions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-industrial-card/40 border border-industrial-border rounded-lg text-xs text-white focus:outline-none focus:border-gold-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg hover:shadow-gold-500/25 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Sending...' : 'Dispatch Message'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Direct Logistics CTA / Booking prompt (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-industrial-card/40 to-black p-6 sm:p-8 border border-industrial-border rounded-2xl space-y-6 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-gold-500/5 rounded-full filter blur-3xl" />
            
            <div className="space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase text-gold-400 bg-gold-500/5 px-2.5 py-1 rounded border border-gold-500/10 inline-block">
                Immediate Response
              </span>
              <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight">
                Bulk Scrap Pickup Service
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                For manufacturing scrap, demolished steel sections, copper conductors, and industrial machinery, we offer immediate logistics, loading crews, and on-site certified crane lifting.
              </p>
            </div>

            <div className="space-y-3.5 pt-4 text-xs text-gray-300 font-sans border-t border-industrial-border/60">
              <div className="flex gap-2.5">
                <span className="text-gold-500 font-bold">✓</span>
                <span>Complimentary logistics for volumes &gt; 1 Metric Ton</span>
              </div>
              <div className="flex gap-2.5">
                <span className="text-gold-500 font-bold">✓</span>
                <span>Full OHSAS safety clearance and work risk folders</span>
              </div>
              <div className="flex gap-2.5">
                <span className="text-gold-500 font-bold">✓</span>
                <span>Immediate bank-backed trade transaction clearing</span>
              </div>
            </div>

            <button
              onClick={onOpenPickup}
              className="w-full py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg hover:shadow-gold-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Book Scrap Pickup Surveyor
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
