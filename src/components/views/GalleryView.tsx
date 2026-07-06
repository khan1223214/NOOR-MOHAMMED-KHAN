import { useState } from 'react';
import { Play, Image as ImageIcon, Eye, X, ZoomIn, Info } from 'lucide-react';
import { GalleryItem } from '../../types';

interface GalleryViewProps {
  gallery: GalleryItem[];
}

export default function GalleryView({ gallery }: GalleryViewProps) {
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Extract unique categories from gallery
  const categories = ['all', ...Array.from(new Set(gallery.map(item => item.category)))];

  const filteredGallery = gallery.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    return matchesType && matchesCategory;
  });

  return (
    <div className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 font-mono">
            On-Site Media Records
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white uppercase mt-2 tracking-tight">
            Photo & Video Media Gallery
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mt-4 font-sans">
            A curated photographic audit of our processing yards, high-performance machinery, controlled building drops, and crane shifting logistics.
          </p>
        </div>

        {/* Media Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12 border-b border-industrial-border pb-6">
          
          {/* Format Selection (All / Images / Videos) */}
          <div className="flex gap-1.5 bg-industrial-card border border-industrial-border/60 p-1 rounded-lg">
            <button
              onClick={() => setFilterType('all')}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-gold-500 text-industrial-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setFilterType('image')}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterType === 'image' ? 'bg-gold-500 text-industrial-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Photos
            </button>
            <button
              onClick={() => setFilterType('video')}
              className={`px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filterType === 'video' ? 'bg-gold-500 text-industrial-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              Videos
            </button>
          </div>

          {/* Category Filter tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded text-[11px] font-bold uppercase tracking-widest transition-colors cursor-pointer ${
                  filterCategory === cat
                    ? 'text-gold-400 border border-gold-500/30 bg-gold-500/10'
                    : 'text-gray-500 hover:text-gray-300 border border-transparent hover:border-industrial-border'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry-style fluid grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxItem(item)}
              className="group relative overflow-hidden rounded-xl bg-industrial-card border border-industrial-border cursor-pointer shadow-xl transition-all hover:scale-[1.01] hover:border-gold-500/20"
            >
              {/* Image element */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500 referrerPolicy='no-referrer'"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
                
                {/* Format Indicator Icon */}
                <div className="absolute top-4 right-4 p-2 rounded-lg bg-black/60 border border-white/10 text-white shadow">
                  {item.type === 'video' ? (
                    <Play className="w-4 h-4 fill-white text-white" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-white" />
                  )}
                </div>

                {/* Center Hover icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-3 rounded-full bg-gold-500 text-industrial-black shadow-lg scale-90 group-hover:scale-100 transition-transform">
                    {item.type === 'video' ? <Play className="w-5 h-5 fill-industrial-black text-industrial-black" /> : <Eye className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Title Block */}
              <div className="p-5 space-y-1.5 bg-black/40">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-gold-400 bg-gold-500/5 px-2 py-0.5 rounded border border-gold-500/10">
                    {item.category}
                  </span>
                  <span className="text-[9px] text-gray-500 font-mono">ID: {item.id}</span>
                </div>
                <h3 className="text-sm font-bold text-white font-display group-hover:text-gold-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-gray-400 leading-normal font-sans line-clamp-2">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {filteredGallery.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-sans">
            No media matching current filter settings found.
          </div>
        )}

        {/* LIGHTBOX MODAL */}
        {lightboxItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setLightboxItem(null)} />

            {/* Modal Content container */}
            <div className="relative max-w-4xl w-full bg-industrial-card border border-gold-500/30 rounded-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded bg-black/60 hover:bg-gold-500/10 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Media view frame */}
                <div className="md:col-span-8 bg-black flex items-center justify-center aspect-video relative">
                  {lightboxItem.type === 'video' ? (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900 p-8 text-center space-y-4">
                      <Play className="w-14 h-14 text-gold-500 fill-gold-500 animate-pulse" />
                      <div>
                        <span className="text-xs font-mono text-gray-400 uppercase tracking-widest">Streaming Demolition Log</span>
                        <h4 className="text-white font-bold font-display mt-1">{lightboxItem.title}</h4>
                      </div>
                      <p className="text-xs text-gray-500 max-w-sm">For security, video logs are archived. For active video site feeds, contact NK Prestige corporate surveyor lines.</p>
                      <a
                        href="https://www.youtube.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-[10px] font-bold uppercase tracking-wider rounded"
                      >
                        Play Archived Demo Film
                      </a>
                    </div>
                  ) : (
                    <img
                      src={lightboxItem.url}
                      alt={lightboxItem.title}
                      className="w-full h-full object-contain referrerPolicy='no-referrer'"
                    />
                  )}
                </div>

                {/* Details description column */}
                <div className="md:col-span-4 p-6 sm:p-8 flex flex-col justify-between border-t md:border-t-0 md:border-l border-industrial-border">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-gold-400 bg-gold-500/5 px-2.5 py-1 rounded border border-gold-500/10">
                        {lightboxItem.category}
                      </span>
                      <span className="text-[10px] font-mono text-gray-500 uppercase">{lightboxItem.type === 'video' ? 'Video Log' : 'Photo Stills'}</span>
                    </div>

                    <h3 className="text-xl font-bold font-display text-white uppercase tracking-tight">
                      {lightboxItem.title}
                    </h3>
                    
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {lightboxItem.description}
                    </p>
                  </div>

                  {/* Informational badge */}
                  <div className="pt-6 border-t border-industrial-border/60 mt-8 flex gap-2 text-[10px] text-gray-500 font-mono">
                    <Info className="w-4 h-4 text-gold-400 shrink-0" />
                    <span>NK Prestige verified photograph records. All media copyrighted.</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
