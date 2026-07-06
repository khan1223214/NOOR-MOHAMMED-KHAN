import { useState } from 'react';
import { MapPin, Calendar, Briefcase, Ruler, UserCheck, ShieldCheck, CheckCircle } from 'lucide-react';
import { ProjectRecord } from '../../types';
import { formatDate, classNames } from '../../utils';

interface ProjectsViewProps {
  projects: ProjectRecord[];
}

export default function ProjectsView({ projects }: ProjectsViewProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'Dismantling' | 'Demolition' | 'Lifting' | 'Trading'>('all');

  const filters = [
    { id: 'all', label: 'All Projects' },
    { id: 'Dismantling', label: 'Factory Dismantling' },
    { id: 'Demolition', label: 'Industrial Demolition' },
    { id: 'Lifting', label: 'Lifting & Shifting' },
    { id: 'Trading', label: 'Scrap Trading Contracts' },
  ];

  const filteredProjects = projects.filter((proj) => {
    if (activeFilter === 'all') return true;
    return proj.category.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="py-24 bg-black relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-widest uppercase text-gold-400 font-mono">
            Proven Operations
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold font-display text-white uppercase mt-2 tracking-tight">
            Our Industrial Portfolios
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mt-4 font-sans">
            NK Prestige Steel executes complex rigging, chemical plant decommissioning, and mechanical scrap sorting with standard engineering precision and safety clearances.
          </p>
        </div>

        {/* Filter Tab bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id as any)}
              className={classNames(
                'px-4 py-2 rounded text-xs font-bold uppercase tracking-wider transition-all border focus:outline-none cursor-pointer',
                activeFilter === f.id
                  ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black border-gold-500 shadow-md shadow-gold-500/10'
                  : 'bg-industrial-card text-gray-400 border-industrial-border hover:border-gold-500/30 hover:text-white'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Projects List with detailed expanded panels */}
        <div className="space-y-16">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={project.id}
                  className={classNames(
                    'grid grid-cols-1 lg:grid-cols-12 gap-10 items-center p-6 sm:p-8 bg-industrial-card/40 border border-industrial-border/60 rounded-2xl backdrop-blur-md relative overflow-hidden group',
                    isEven ? '' : 'lg:flex-row-reverse'
                  )}
                >
                  {/* Glowing background hint */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-gold-500/2 rounded-full filter blur-3xl" />

                  {/* Image Block (5 cols) */}
                  <div className={classNames(
                    'lg:col-span-5 relative overflow-hidden rounded-xl border border-industrial-border shadow-xl aspect-[4/3] w-full',
                    isEven ? 'lg:order-1' : 'lg:order-2'
                  )}>
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 referrerPolicy='no-referrer'"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    
                    {/* Floating Scale Badge */}
                    <div className="absolute top-4 left-4 px-3 py-1 bg-gold-500 text-industrial-black text-[10px] font-bold uppercase tracking-wider rounded font-mono shadow">
                      {project.scale}
                    </div>

                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-gold-400 font-semibold">{project.category}</span>
                      <h4 className="text-white font-bold text-base font-display">{project.title}</h4>
                    </div>
                  </div>

                  {/* Details Block (7 cols) */}
                  <div className={classNames(
                    'lg:col-span-7 space-y-5',
                    isEven ? 'lg:order-2' : 'lg:order-1'
                  )}>
                    <div className="space-y-2">
                      <span className="text-xs font-mono font-bold uppercase text-gold-400 bg-gold-500/5 px-2.5 py-1 rounded border border-gold-500/10 inline-block">
                        Contract Completed
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold font-display text-white uppercase tracking-tight group-hover:text-gold-400 transition-colors">
                        {project.title}
                      </h3>
                    </div>

                    {/* Metadata items */}
                    <div className="grid grid-cols-2 gap-4 pb-4 border-b border-industrial-border/60 text-xs text-gray-400 font-mono">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-gold-400 shrink-0" />
                        <span>Client: <strong className="text-gray-300">{project.client}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                        <span>Location: <strong className="text-gray-300">{project.location}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                        <span>Finished: <strong className="text-gray-300">{formatDate(project.date)}</strong></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-gold-400 shrink-0" />
                        <span>Scale: <strong className="text-gold-300">{project.scale}</strong></span>
                      </div>
                    </div>

                    {/* Description Paragraph */}
                    <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                      {project.description}
                    </p>

                    {/* Bullet Accomplishments */}
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-white font-display">Contractor Accomplishments:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400 font-sans">
                        {project.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-2">
                            <CheckCircle className="w-3.5 h-3.5 text-gold-500 shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="text-center py-16 text-gray-500">
              No industrial project cases found in this category.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
