import React, { useState } from 'react';
import { X, Calendar, MapPin, Scale, Phone, User, Trash, Hammer, ShieldAlert } from 'lucide-react';
import { api } from '../utils';
import confetti from 'canvas-confetti';

interface PickupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PickupModal({ isOpen, onClose }: PickupModalProps) {
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    scrapType: '',
    quantity: '',
    preferredTime: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const scrapTypes = [
    'MS Scrap (Heavy Melting Steel)',
    'Ferrous Scrap (HMS 1 & 2)',
    'Copper Millberry / Insulated Cable Scrap',
    'Aluminium Extrusion / Profile Scrap',
    'Brass Honey / Utensil Scrap',
    'Factory Demolition Metal & Silos',
    'Industrial UPS Lead Acid Batteries',
    'Heavy Obsolete Machinery & Engines',
    'E-Waste (Computer, Servers, PCB)',
    'Other Recyclable Bulk Waste'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName || !formData.phone || !formData.scrapType) {
      setError('Please provide at least Name, Phone and Scrap Type.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.createPickup({
        customerName: formData.customerName,
        phone: formData.phone,
        address: formData.address,
        scrapType: formData.scrapType,
        quantity: formData.quantity,
        preferredTime: formData.preferredTime
      });

      setSuccess(true);
      
      // Trigger gold corporate confetti splash!
      confetti({
        particleCount: 120,
        spread: 80,
        colors: ['#ab833c', '#e7d8b3', '#be9c54', '#ffffff'],
        origin: { y: 0.6 }
      });

      // Clear form
      setFormData({
        customerName: '',
        phone: '',
        address: '',
        scrapType: '',
        quantity: '',
        preferredTime: ''
      });
    } catch (err: any) {
      setError(err.message || 'Failed to file your pickup request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg glass-panel-gold rounded-xl overflow-hidden shadow-2xl shadow-gold-500/5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Border Glow Accents */}
        <div className="h-1.5 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600" />

        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded bg-steel-gray/50 hover:bg-gold-500/10 text-gray-400 hover:text-gold-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {!success ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded bg-gold-500/10 text-gold-400">
                  <Hammer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-white">
                    Request Scrap Pickup
                  </h3>
                  <p className="text-xs text-gray-400">
                    Complimentary heavy lifting, loading, and pricing for bulk traders.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/25 rounded text-xs text-red-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Customer Name */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Contact Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Malhotra"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-black border border-industrial-border rounded-lg text-sm text-white focus:outline-none focus:border-gold-500 transition-colors font-sans"
                    />
                  </div>
                </div>

                {/* Phone & Address */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 9930472834"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-black border border-industrial-border rounded-lg text-sm text-white focus:outline-none focus:border-gold-500 transition-colors font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                      Estimated Weight / Quantity
                    </label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        placeholder="e.g. 5.4 Tons or 18 Bales"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-black border border-industrial-border rounded-lg text-sm text-white focus:outline-none focus:border-gold-500 transition-colors font-sans"
                      />
                    </div>
                  </div>
                </div>

                {/* Scrap Type */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Select Scrap Category *
                  </label>
                  <select
                    required
                    value={formData.scrapType}
                    onChange={(e) => setFormData({ ...formData, scrapType: e.target.value })}
                    className="w-full px-3 py-2 bg-black border border-industrial-border rounded-lg text-sm text-white focus:outline-none focus:border-gold-500 transition-colors cursor-pointer"
                  >
                    <option value="" disabled>-- Select Category --</option>
                    {scrapTypes.map((t) => (
                      <option key={t} value={t} className="bg-industrial-card text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Pickup Address */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Corporate Site Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <textarea
                      rows={2}
                      placeholder="e.g. Plot No. 12, MIDC Industrial Area, Pune"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-black border border-industrial-border rounded-lg text-sm text-white focus:outline-none focus:border-gold-500 transition-colors font-sans resize-none"
                    />
                  </div>
                </div>

                {/* Preferred Date & Time */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">
                    Preferred Time & Logistics Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g. Next Wednesday Morning or 15th July"
                      value={formData.preferredTime}
                      onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                      className="w-full pl-10 pr-4 py-2 bg-black border border-industrial-border rounded-lg text-sm text-white focus:outline-none focus:border-gold-500 transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg shadow-gold-500/10 hover:shadow-gold-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    {loading ? 'Submitting Form...' : 'Schedule Logistics & Valuation'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-500/10 text-gold-400 mb-4 border border-gold-500/20">
                <Hammer className="w-8 h-8 animate-bounce" />
              </div>
              <h3 className="text-2xl font-bold font-display text-white mb-2">
                Logistics Booked!
              </h3>
              <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
                Our logistics coordinators and materials surveyors have received your scrap pickup request. We will contact you at <strong className="text-white">{formData.phone}</strong> shortly to confirm gate passes.
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase tracking-wider rounded shadow-lg hover:shadow-gold-500/15 cursor-pointer"
              >
                Close Portal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
