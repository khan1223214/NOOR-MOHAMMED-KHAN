import { useState } from 'react';
import { Shield, Check, Hammer, Truck, Zap, Activity, HelpCircle, HardHat, FileCheck } from 'lucide-react';

interface ServicesViewProps {
  onOpenPickup: () => void;
}

export default function ServicesView({ onOpenPickup }: ServicesViewProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'metals' | 'salvage' | 'recyclables' | 'specialized'>('all');

  const categories = [
    { id: 'all', label: 'All Services' },
    { id: 'metals', label: 'Metallic Scrap Trading' },
    { id: 'salvage', label: 'Industrial Demolition & Dismantling' },
    { id: 'recyclables', label: 'E-Waste & Machinery Salvage' },
    { id: 'specialized', label: 'Specialized Industrial Works' },
  ];

  const serviceItems = [
    // 1. Metals
    {
      id: 'ms-scrap',
      title: 'MS Scrap (Heavy Melting Steel)',
      category: 'metals',
      description: 'Buying and bulk trading of heavy structural steel beams, girders, rails, off-cuts, and plate residues from fabrication sites.',
      details: ['Includes HMS 1 & 2 grades', 'Immediate weighbridge auditing', 'Complies with LME baseline indices']
    },
    {
      id: 'ferrous-scrap',
      title: 'Ferrous Scrap',
      category: 'metals',
      description: 'Liquidation of carbon-steels, cast-iron chunks, stamping matrices, and automotive shell materials in industrial volumes.',
      details: ['Grade certification provided', 'Direct melting furnace supply', 'Efficient scrap container placing']
    },
    {
      id: 'non-ferrous-scrap',
      title: 'Non Ferrous Scrap',
      category: 'metals',
      description: 'Custom recycling of high-value non-magnetic alloys, nickel, titanium, cobalt, and aerospace grades.',
      details: ['Spectrometer grading verified', 'Baling and packaging services', 'Environmentally compliant logistics']
    },
    {
      id: 'copper-scrap',
      title: 'Copper Scrap',
      category: 'metals',
      description: 'Procuring Millberry copper, berry copper wire, heavy busbars, and insulated wiring cores from electrical retrofits.',
      details: ['Highest payout rates in MH', 'In-house automated stripping', 'Electrolytic grade evaluation']
    },
    {
      id: 'aluminium-scrap',
      title: 'Aluminium Scrap',
      category: 'metals',
      description: 'Purchasing alloy wheels, clean extrusions, tension cables, castings, and sheet cuttings from structural factories.',
      details: ['Pre-bale sorting protocols', 'Volumetric press processing', 'High-purity recycled ingot feed']
    },
    {
      id: 'brass-scrap',
      title: 'Brass Scrap',
      category: 'metals',
      description: 'Trading plumbing components, honey brass cuttings, turnings, bronze propellers, and naval alloy residues.',
      details: ['Accurate copper-zinc ratios', 'Immediate cash-backed settlement', 'Bulk shipping containers supplied']
    },
    {
      id: 'iron-scrap',
      title: 'Iron Scrap',
      category: 'metals',
      description: 'Bulk clearance of cast iron boilers, heavy industrial molds, counterweights, and municipal steel residues.',
      details: ['Heavy crane grabs loaded', 'Hydraulic shearing on site', 'Secure factory clearances']
    },
    {
      id: 'steel-scrap',
      title: 'Steel Scrap',
      category: 'metals',
      description: 'Buying high-alloy stainless steel grades (304, 316, duplex) from chemical process vessels and piping installations.',
      details: ['Exact chemical testing', 'Clean sorting of mixed metals', 'Immediate transaction clearing']
    },

    // 2. Salvage
    {
      id: 'factory-dismantling',
      title: 'Factory Dismantling & Decommissioning',
      category: 'salvage',
      description: 'Turnkey decommissioning of older processing complexes. Complete extraction of steel, assembly lines, and heavy furnaces.',
      details: ['Asset recovery plans drafted', 'Active site protection systems', 'Structural integrity engineering']
    },
    {
      id: 'industrial-demolition',
      title: 'Industrial Demolition',
      category: 'salvage',
      description: 'Safety-first demolition of steel chimneys, blast furnaces, cooling structures, and tall manufacturing complexes.',
      details: ['Specialized high-reach shears', 'Licensed crane rigging crews', 'Comprehensive insurance coverage']
    },
    {
      id: 'building-demolition',
      title: 'Building Demolition',
      category: 'salvage',
      description: 'Dismantling high-rise concrete offices, obsolete warehouses, and maritime structures with strict noise and dust guidelines.',
      details: ['Water-mist dust suppression', 'Recycled aggregates crushed', 'Local municipal approvals managed']
    },

    // 3. Recyclables / E-waste
    {
      id: 'electrical-scrap',
      title: 'Electrical Scrap',
      category: 'recyclables',
      description: 'Bulk clearing of heavy industrial switchgears, obsolete transformers, substations, and electrical conductors.',
      details: ['PCB coolant safely removed', 'Copper and steel cores salvaged', 'Full environmental clearance']
    },
    {
      id: 'electronic-scrap',
      title: 'Electronic Scrap',
      category: 'recyclables',
      description: 'Disposal of server frames, telecom rack components, and industrial control systems following zero-landfill principles.',
      details: ['Data security shredded', 'Material tracking files issued', 'State pollution board approved']
    },
    {
      id: 'ups-batteries',
      title: 'UPS Lead Acid Batteries',
      category: 'recyclables',
      description: 'Buying obsolete lead-acid cells, datacenter standby batteries, and industrial vehicle battery arrays.',
      details: ['Certified safe transport', 'Eco-compliant smelting', 'Pollution board credit certificates']
    },
    {
      id: 'generator-scrap',
      title: 'Generator Scrap',
      category: 'recyclables',
      description: 'Purchasing obsolete standby gensets (100kVA to 2500kVA), heavy alternators, and diesel engine blocks.',
      details: ['Immediate flatbed crane load', 'Decommissioning files provided', 'Cash valuation by kW rating']
    },
    {
      id: 'computer-scrap',
      title: 'Computer Scrap',
      category: 'recyclables',
      description: 'E-waste salvage of server panels, monitors, office IT hardware, and communications switchboards.',
      details: ['ISO 14001 green processes', 'Metals and plastics separation', 'Compliance log documentation']
    },
    {
      id: 'cable-scrap',
      title: 'Cable Scrap',
      category: 'recyclables',
      description: 'Stripping thick multi-core underground cabling, steel-armored cables, and communication lines.',
      details: ['High speed stripping lines', 'Copper/aluminium sorting', 'Certified processing yards']
    },
    {
      id: 'old-machinery',
      title: 'Old Machinery & Plant Salvage',
      category: 'recyclables',
      description: 'Systematic extraction of obsolete stamping presses, lathe systems, conveyor mills, and packaging equipment.',
      details: ['Crane lifting included', 'Partial machinery re-sale', 'Volumetric scrap pressing']
    },
    {
      id: 'paper-scrap',
      title: 'Paper Scrap (Bulk Office & Factory)',
      category: 'recyclables',
      description: 'Procurement and baling of industrial packaging boxes, corporate document scrap, and paper mill waste.',
      details: ['High security document shred', 'Hydraulic baler packing', 'Direct supply to paper pulp mills']
    },
    {
      id: 'plastic-scrap',
      title: 'Plastic Scrap (HDPE / Industrial)',
      category: 'recyclables',
      description: 'Shredding and trading industrial plastic pallets, chemical barrels, structural PVC elements, and drums.',
      details: ['Sorted by resin types', 'Pre-wash grinding lines', 'Virgin plastic manufacturer feeds']
    },
    {
      id: 'wood-scrap',
      title: 'Wood Scrap & Pallet Waste',
      category: 'recyclables',
      description: 'Recycling of obsolete wood pallets, packaging crates, and structural wood scrap from shipping terminals.',
      details: ['Wood chipper conversion', 'Bio-fuel pellet supplies', 'Clearance logs generated']
    },

    // 4. Specialized
    {
      id: 'civil-works',
      title: 'Industrial Civil Works',
      category: 'specialized',
      description: 'Post-demolition site leveling, road repair, reinforced foundation crushing, and environmental remediation.',
      details: ['Soil compaction audits', 'Debris carting logistics', 'Silt fencing and site prep']
    },
    {
      id: 'welding-works',
      title: 'Heavy Structural Welding Works',
      category: 'specialized',
      description: 'Industrial oxygen welding, plasma arc metal slicing, and structural reinforcing of active steel towers.',
      details: ['AWS certified welders', 'Oxygen-fuel torch systems', 'Rigorous quality check checks']
    },
    {
      id: 'lifting-shifting',
      title: 'Lifting & Shifting Services',
      category: 'specialized',
      description: 'Engineered heavy rigging of critical assets: boilers, turbine motors, and transformer boxes using hydraulic cranes.',
      details: ['Rigging safety profiles', 'Up to 500-ton hydraulic fleet', 'Wind-loading lift maps']
    }
  ];

  const filteredServices = serviceItems.filter(
    (item) => activeCategory === 'all' || item.category === activeCategory
  );

  return (
    <div className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 font-mono">
            NK Prestige Capabilities
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white uppercase mt-2 tracking-tight">
            Our 24 Core Industrial Services
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mt-4 font-sans">
            We operate fully equipped processing yards, a massive heavy crane fleet, and a skilled crew of certified structural engineers to deliver seamless, high-yield scrap liquidation and dismantling services.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-all duration-300 border focus:outline-none cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black border-gold-500 shadow-lg shadow-gold-500/10'
                  : 'bg-industrial-card text-gray-400 border-industrial-border hover:border-gold-500/30 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services Bento-style grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="glass-panel border border-industrial-border rounded-xl p-6 hover:border-gold-500/30 transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle visual gold corner detail */}
              <div className="absolute top-0 right-0 w-8 h-8 bg-gold-500/5 group-hover:bg-gold-500/10 rounded-bl-full transition-all" />

              <div>
                <span className="text-[9px] font-mono font-bold tracking-widest text-gold-400 uppercase bg-gold-500/5 px-2 py-1 rounded border border-gold-500/10 inline-block mb-4">
                  {service.category === 'metals' 
                    ? 'Metal Trade' 
                    : service.category === 'salvage' 
                    ? 'Dismantling & Demolition' 
                    : service.category === 'recyclables' 
                    ? 'E-Waste & Machinery' 
                    : 'Specialized Works'}
                </span>
                
                <h3 className="text-lg font-bold font-display text-white mb-3 group-hover:text-gold-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-xs text-gray-400 leading-relaxed font-sans mb-6">
                  {service.description}
                </p>
              </div>

              {/* Benefits list */}
              <div className="border-t border-industrial-border/60 pt-4 space-y-2 mt-auto">
                {service.details.map((detail, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-gray-400">
                    <Check className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Safety standards callout */}
        <div className="mt-20 p-8 sm:p-12 bg-gradient-to-br from-industrial-card to-black border border-industrial-border rounded-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-gold-500/5 rounded-full filter blur-[80px]" />
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-500/20 bg-gold-500/5 text-gold-400 text-xs font-mono">
              <HardHat className="w-4 h-4 text-gold-400 animate-pulse" />
              <span>HSE Health, Safety & Environment Compliance</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-tight">
              Safety and Environmental Auditing is Our Benchmark
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              We operate strictly under OHSAS safety guidelines. We issue comprehensive pollution clearance files, hazardous waste disposal logs, and structural clearance certificates for all factories we decommission.
            </p>
          </div>
          <button
            onClick={onOpenPickup}
            className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black font-bold uppercase tracking-wider text-xs rounded shadow-lg hover:shadow-gold-500/20 shrink-0 cursor-pointer"
          >
            Initiate Site Feasibility Survey
          </button>
        </div>

      </div>
    </div>
  );
}
