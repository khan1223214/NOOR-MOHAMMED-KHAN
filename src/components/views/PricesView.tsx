import { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, ArrowRight, ShieldAlert, BadgeInfo, Calendar, DollarSign, Activity } from 'lucide-react';
import { PriceRecord } from '../../types';
import { formatINR, formatDate, classNames } from '../../utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PricesViewProps {
  prices: PriceRecord[];
  onOpenPickup: () => void;
}

export default function PricesView({ prices, onOpenPickup }: PricesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ferrous' | 'non-ferrous' | 'machinery' | 'recyclables'>('all');
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(prices[0]?.id || null);

  const categories = [
    { id: 'all', label: 'All Metals' },
    { id: 'ferrous', label: 'Ferrous Scrap' },
    { id: 'non-ferrous', label: 'Non-Ferrous Alloys' },
    { id: 'machinery', label: 'Plant & Machinery' },
    { id: 'recyclables', label: 'Industrial Recyclables' },
  ];

  // Filter prices
  const filteredPrices = useMemo(() => {
    return prices.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [prices, searchTerm, selectedCategory]);

  // Selected Price for Chart rendering
  const activePriceItem = useMemo(() => {
    return prices.find((p) => p.id === selectedPriceId) || prices[0] || null;
  }, [prices, selectedPriceId]);

  // Compute trend metrics
  const activePriceDiff = activePriceItem ? activePriceItem.priceToday - activePriceItem.priceYesterday : 0;
  const activePricePct = activePriceItem ? (activePriceDiff / activePriceItem.priceYesterday) * 100 : 0;

  // Render chart data with formatted date strings
  const chartData = useMemo(() => {
    if (!activePriceItem || !activePriceItem.history) return [];
    return activePriceItem.history.map((h) => ({
      date: formatDate(h.date).split(',')[0], // e.g. "6 Jul"
      Price: h.price
    }));
  }, [activePriceItem]);

  return (
    <div className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 font-mono">
            Realtime Valuation Index
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white uppercase mt-2 tracking-tight">
            Daily Scrap Prices Dashboard
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mt-4 font-sans">
            Our materials index is linked directly to local recycling metrics and global commodity exchanges. Track transparent pricing and schedule liquidation at peak value.
          </p>
        </div>

        {/* Outer Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: Interactive line chart & Selected item summary (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            {activePriceItem ? (
              <div className="glass-panel border border-industrial-border rounded-2xl p-6 relative overflow-hidden">
                {/* Accent glow */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
                
                {/* Meta details */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-industrial-border/60 pb-6 mb-6">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-gold-400 font-semibold tracking-wider bg-gold-500/5 px-2.5 py-1 rounded border border-gold-500/10 inline-block mb-1">
                      Live Selected Index
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                      {activePriceItem.name}
                    </h3>
                  </div>

                  {/* Today Pricing detail */}
                  <div className="text-left sm:text-right">
                    <span className="block text-xs text-gray-500 uppercase font-mono tracking-widest leading-none mb-1">
                      Today's Price
                    </span>
                    <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                      {formatINR(activePriceItem.priceToday)}
                      <span className="text-sm font-sans text-gray-400 font-normal"> / {activePriceItem.unit.split('/')[1]}</span>
                    </span>
                  </div>
                </div>

                {/* Growth stats widgets */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-black/40 border border-industrial-border/50 rounded-lg p-3 text-center">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-display">Yesterday</span>
                    <span className="text-sm font-mono font-bold text-gray-300">{formatINR(activePriceItem.priceYesterday)}</span>
                  </div>
                  
                  <div className="bg-black/40 border border-industrial-border/50 rounded-lg p-3 text-center">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-display">Difference</span>
                    <span className={classNames(
                      'text-sm font-mono font-bold',
                      activePriceDiff >= 0 ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {activePriceDiff >= 0 ? '+' : ''}{activePriceDiff.toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-black/40 border border-industrial-border/50 rounded-lg p-3 text-center">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-display">Trend</span>
                    <span className={classNames(
                      'text-sm font-mono font-bold flex items-center justify-center gap-1',
                      activePriceDiff >= 0 ? 'text-emerald-400' : 'text-red-400'
                    )}>
                      {activePriceDiff >= 0 ? (
                        <>
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>+{activePricePct.toFixed(1)}%</span>
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-3.5 h-3.5" />
                          <span>{activePricePct.toFixed(1)}%</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* Chart Area */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-gold-400 animate-pulse" />
                      15-Day Historical Price Graph
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">Currency: INR (₹)</span>
                  </div>

                  <div className="h-[260px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ab833c" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#ab833c" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" vertical={false} />
                        <XAxis
                          dataKey="date"
                          stroke="#6b7280"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#6b7280"
                          fontSize={10}
                          tickLine={false}
                          axisLine={false}
                          domain={['auto', 'auto']}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#121215',
                            borderColor: '#ab833c',
                            borderRadius: '8px',
                            color: '#fff',
                            fontSize: '11px',
                            fontFamily: 'monospace'
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Price"
                          stroke="#ab833c"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>
            ) : (
              <div className="glass-panel text-center py-12 text-gray-500 rounded-2xl">
                Please select a commodity below to render history.
              </div>
            )}

            {/* Price Guarantee note */}
            <div className="p-4 bg-gold-500/5 border border-gold-500/10 rounded-xl flex gap-3">
              <BadgeInfo className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-400 leading-relaxed">
                <strong className="text-white">Fair Valuation Guarantee:</strong> These prices represent reference estimates for basic raw scrap structures. Bulk transactions exceeding 2 Metric Tons may qualify for customized contractual bonuses, direct shipyard transport clearances, and specialized loading offsets.
              </p>
            </div>
          </div>

          {/* RIGHT PANEL: Scrap metals lookup list (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Search & Filter Controls */}
            <div className="glass-panel border border-industrial-border rounded-xl p-4 space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search metals (e.g. Copper, Steel)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-black border border-industrial-border rounded-lg text-xs text-white focus:outline-none focus:border-gold-500 transition-colors"
                />
              </div>

              {/* Categorization tabs */}
              <div className="flex flex-wrap gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={classNames(
                      'px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider focus:outline-none cursor-pointer',
                      selectedCategory === cat.id
                        ? 'bg-gold-500/10 text-gold-400 border border-gold-500/25'
                        : 'bg-transparent text-gray-400 border border-transparent hover:border-industrial-border hover:text-white'
                    )}
                  >
                    {cat.label.split(' ')[0]} {/* short labels */}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Table List */}
            <div className="glass-panel border border-industrial-border rounded-xl overflow-hidden shadow-xl max-h-[500px] overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/60 border-b border-industrial-border font-display text-[10px] font-bold tracking-widest uppercase text-gray-400">
                    <th className="py-3 px-4">Scrap Metal</th>
                    <th className="py-3 px-4 text-right">Price Today</th>
                    <th className="py-3 px-4 text-right">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-industrial-border/40 text-xs font-sans">
                  {filteredPrices.length > 0 ? (
                    filteredPrices.map((item) => {
                      const diff = item.priceToday - item.priceYesterday;
                      const isPositive = diff >= 0;
                      const isSelected = item.id === selectedPriceId;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedPriceId(item.id)}
                          className={classNames(
                            'cursor-pointer transition-colors hover:bg-white/5',
                            isSelected ? 'bg-gold-500/5' : ''
                          )}
                        >
                          {/* Name */}
                          <td className="py-3 px-4">
                            <span className={classNames(
                              'font-medium transition-colors block',
                              isSelected ? 'text-gold-400 font-bold' : 'text-white'
                            )}>
                              {item.name}
                            </span>
                            <span className="text-[9px] text-gray-500 uppercase font-mono tracking-wider">
                              Category: {item.category}
                            </span>
                          </td>

                          {/* Price */}
                          <td className="py-3 px-4 text-right font-mono font-semibold text-white">
                            {formatINR(item.priceToday)}
                            <span className="text-[10px] text-gray-400 font-normal font-sans">/{item.unit.split('/')[1]}</span>
                          </td>

                          {/* Difference */}
                          <td className="py-3 px-4 text-right font-mono">
                            <span className={classNames(
                              'inline-flex items-center gap-1 font-semibold',
                              isPositive ? 'text-emerald-400' : 'text-red-400'
                            )}>
                              {isPositive ? '+' : ''}{diff.toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-gray-500 font-sans">
                        No scrap metals found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Quick action button */}
            <button
              onClick={onOpenPickup}
              className="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-xs rounded-lg shadow-lg shadow-gold-500/10 hover:shadow-gold-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              Lock In My Scrap Valuation Quote
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
