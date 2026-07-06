import { Hammer, ArrowRight, ShieldCheck, Zap, TrendingUp, Users, Target, Ship, Sparkles } from 'lucide-react';
import ParticleCanvas from '../ParticleCanvas';
import { PriceRecord, ProjectRecord, Testimonial } from '../../types';
import { formatINR } from '../../utils';

interface HomeViewProps {
  onTabChange: (tab: string) => void;
  onOpenPickup: () => void;
  prices: PriceRecord[];
  projects: ProjectRecord[];
  testimonials: Testimonial[];
}

export default function HomeView({ onTabChange, onOpenPickup, prices, projects, testimonials }: HomeViewProps) {
  // Take top 3 prominent prices to show as ticker/cards
  const spotlightMetals = prices.filter(p => ['copper_4', 'steel_8', 'brass_6'].includes(p.id)) || prices.slice(0, 3);
  
  // Dynamic stats
  const stats = [
    { label: 'Tons Recycled', value: '75,000+', icon: Hammer },
    { label: 'Industrial Site Clearances', value: '450+', icon: Target },
    { label: 'Safety Rating', value: '100%', icon: ShieldCheck },
    { label: 'Corporate Partners', value: '120+', icon: Users },
  ];

  return (
    <div className="relative">
      {/* 1. HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-black border-b border-industrial-border">
        {/* Particle Overlay */}
        <ParticleCanvas />

        {/* Golden glow gradient background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/5 rounded-full filter blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-20 text-center">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/30 bg-gold-500/10 text-gold-400 text-xs font-semibold tracking-widest uppercase mb-8 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Industrial Demolition & Metal Trading Leaders</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display tracking-tight text-white uppercase leading-none mb-6">
            NK PRESTIGE <br />
            <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent">
              STEEL CORPORATION
            </span>
          </h1>

          {/* Subtext description */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-400 leading-relaxed font-sans mb-10">
            Engineered Industrial Dismantling, Controlled Plant Demolition, Heavy Rigging Shifting, and Transparency-Led Scrap Metal Liquidation. Certified Grade-A Contractors.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenPickup}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-xs rounded shadow-2xl shadow-gold-500/20 hover:shadow-gold-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              Book Corporate Scrap Pickup
            </button>
            <button
              onClick={() => onTabChange('prices')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent hover:bg-white/5 text-white border border-gray-600 hover:border-gold-400 font-bold uppercase tracking-wider text-xs rounded transition-all cursor-pointer"
            >
              View Daily Price Board
            </button>
          </div>

          {/* Mini-ticker of highlight prices */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {spotlightMetals.slice(0, 3).map((item) => {
              const diff = item.priceToday - item.priceYesterday;
              const isPositive = diff >= 0;
              return (
                <div key={item.id} className="glass-panel border-l-4 border-l-gold-500/80 p-3 flex items-center justify-between rounded">
                  <div className="text-left">
                    <span className="block text-[10px] uppercase font-bold text-gray-400 font-display">{item.name.split(' ')[0]} Scrap</span>
                    <span className="text-sm font-mono font-bold text-white">{formatINR(item.priceToday)}/{item.unit.split('/')[1]}</span>
                  </div>
                  <div className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${isPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                    {isPositive ? '+' : ''}{diff.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 text-xs font-mono flex flex-col items-center gap-2 animate-bounce">
          <span>Explore Capabilities</span>
          <ArrowRight className="w-4 h-4 rotate-90" />
        </div>
      </section>

      {/* 2. CORPORATE METRICS */}
      <section className="bg-[#0c0c0e] py-16 border-b border-industrial-border relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center group">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-gold-500/5 text-gold-400 border border-gold-500/10 mb-4 group-hover:bg-gold-500/15 group-hover:border-gold-400/30 transition-all">
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-tight mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-gray-500 uppercase tracking-widest font-display font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. BUSINESS INTRODUCTION */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Col - Graphic/Image */}
            <div className="relative">
              <div className="absolute -inset-2 rounded bg-gradient-to-r from-gold-500/20 to-steel-gray/20 filter blur-xl opacity-70" />
              <div className="relative border border-industrial-border rounded-lg overflow-hidden shadow-2xl shadow-black/80 aspect-video lg:aspect-square">
                <img
                  src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80"
                  alt="Scrap metal trading infrastructure"
                  className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 hover:scale-105 transition-all duration-700 referrerPolicy='no-referrer'"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="inline-block px-2.5 py-0.5 bg-gold-500 text-industrial-black text-[10px] font-bold uppercase tracking-widest mb-2 rounded font-mono">
                    Yard No. 4
                  </span>
                  <h4 className="text-lg font-bold text-white font-display">Navi Mumbai Processing Center</h4>
                  <p className="text-xs text-gray-400">Equipped with 1000-ton hydraulic shearing systems and high speed balers.</p>
                </div>
              </div>
            </div>

            {/* Right Col - Corporate pitch */}
            <div className="space-y-6">
              <span className="text-xs font-bold tracking-widest uppercase text-gold-400 font-mono">
                Corporate Profile
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold font-display text-white uppercase tracking-tight">
                NK PRESTIGE STEEL: <br />
                <span className="text-gray-400">Pioneers of Salvage Engineering</span>
              </h2>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                NK Prestige Steel Corporation delivers enterprise-grade services spanning heavy scrap iron and non-ferrous alloy trading, controlled mechanical demolition of tall industrial silos, factories and steel chimneys, and heavy machinery rigging.
              </p>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                By integrating real-time price indexing, rigorous safety audits, and deep logistics fleets, we provide manufacturing giants, maritime companies, and infrastructure developers with high-yield clearances and unmatched operational speed.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onTabChange('services')}
                  className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-xs px-6 py-3.5 rounded hover:scale-[1.01] transition-transform cursor-pointer"
                >
                  <span>Explore 24+ Core Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onTabChange('contact')}
                  className="inline-flex items-center justify-center px-6 py-3.5 border border-industrial-border hover:border-gold-400 text-gray-300 hover:text-white font-bold uppercase text-xs rounded transition-colors cursor-pointer"
                >
                  Get Consultation
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US - GOLD & STEEL GRID */}
      <section className="py-24 bg-[#0a0a0c] border-y border-industrial-border relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-500/2 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-gold-400 font-mono">
              Operational Benchmarks
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white uppercase mt-2">
              Why Corporate Giants Choose NK Prestige
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-gold-500 to-gold-600 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <div className="glass-panel hover:border-gold-500/30 p-8 rounded-xl transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-3">High Yield Liquidation</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Get premium cash valuations for your manufacturing residues, turn generators, obsolete copper coils, and steel structures. Linked directly to daily global indexes.
              </p>
            </div>

            {/* Box 2 */}
            <div className="glass-panel hover:border-gold-500/30 p-8 rounded-xl transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-3">Engineered Safety (HSE)</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Demolition and dismantling require strict risk mitigation. We execute jobs using detailed safety files, risk assessment plans, and fully licensed rigging crews.
              </p>
            </div>

            {/* Box 3 */}
            <div className="glass-panel hover:border-gold-500/30 p-8 rounded-xl transition-all duration-300 group">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gold-500/10 text-gold-400 border border-gold-500/20 rounded mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-display text-white mb-3">Turnkey Heavy Logistics</h3>
              <p className="text-sm text-gray-400 leading-relaxed font-sans">
                Our fleet includes hydraulic cranes ranging up to 500 tons capacity, lowbed trailers, metal grabbers, and plasma shears. We handle your logistics entirely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section className="py-24 bg-black relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-widest uppercase text-gold-400 font-mono">
              Corporate Affiliations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-display text-white uppercase mt-2">
              Endorsed by Industry Leaders
            </h2>
            <div className="h-1 w-20 bg-gradient-to-r from-gold-500 to-gold-600 mx-auto mt-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((test) => (
              <div key={test.id} className="glass-panel p-6 rounded-xl border border-industrial-border relative flex flex-col justify-between">
                <div>
                  {/* Rating */}
                  <div className="flex gap-1 text-gold-400 text-sm mb-4">
                    {Array.from({ length: test.rating }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 italic font-sans leading-relaxed mb-6">
                    "{test.comment}"
                  </p>
                </div>
                
                <div className="border-t border-industrial-border/60 pt-4 mt-auto">
                  <div className="font-bold text-white text-sm font-display">{test.name}</div>
                  <div className="text-xs text-gold-400">{test.designation}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{test.company}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION SECTION */}
      <section className="py-20 bg-[#0c0c0e] border-t border-industrial-border text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold-500/2 filter blur-3xl rounded-full" />
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold font-display uppercase tracking-tight text-white mb-4">
            Liquidate Your Industrial Waste Today
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xl mx-auto mb-8 font-sans">
            Schedule a site clearance survey or secure an immediate trade appraisal for your ferrous and non-ferrous residues. Our specialists will inspect gate limits and issue direct bank guarantees.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onOpenPickup}
              className="px-8 py-4 bg-gradient-to-r from-gold-500 via-gold-400 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-xs rounded shadow-lg shadow-gold-500/10 cursor-pointer"
            >
              Get Logistics Appraisal
            </button>
            <button
              onClick={() => onTabChange('contact')}
              className="px-8 py-4 border border-industrial-border hover:border-gold-400 text-gray-300 hover:text-white font-bold uppercase text-xs rounded transition-colors cursor-pointer"
            >
              Consult Estimator Office
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
