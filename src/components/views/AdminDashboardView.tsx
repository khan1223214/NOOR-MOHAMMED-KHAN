import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Briefcase,
  Users,
  ShieldCheck,
  FileCheck,
  Plus,
  Edit,
  Trash,
  Download,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Database,
  Search,
  Settings,
  ArrowUp,
  ArrowDown,
  Hammer,
  Clock,
  HardHat,
  HelpCircle,
  FileSpreadsheet
} from 'lucide-react';
import { PriceRecord, ProjectRecord, GalleryItem, PickupRequest, Testimonial, FAQ, BusinessInfo } from '../../types';
import { api, formatINR, formatDate, classNames } from '../../utils';
import confetti from 'canvas-confetti';

interface AdminDashboardViewProps {
  prices: PriceRecord[];
  projects: ProjectRecord[];
  gallery: GalleryItem[];
  pickups: PickupRequest[];
  businessInfo: BusinessInfo;
  testimonials: Testimonial[];
  faqs: FAQ[];
  onDataRefresh: () => void;
}

type SubTab = 'stats' | 'prices' | 'pickups' | 'projects' | 'gallery' | 'settings';

export default function AdminDashboardView({
  prices,
  projects,
  gallery,
  pickups,
  businessInfo,
  testimonials,
  faqs,
  onDataRefresh
}: AdminDashboardViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('stats');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ text: string; isError: boolean } | null>(null);

  // Stats Counters
  const pendingCount = pickups.filter((p) => p.status === 'pending').length;
  const confirmedCount = pickups.filter((p) => p.status === 'confirmed').length;
  const totalCompleted = pickups.filter((p) => p.status === 'completed').length;

  const alertMsg = (text: string, isError = false) => {
    setMsg({ text, isError });
    setTimeout(() => setMsg(null), 5000);
  };

  // --- PRICES SUITE STATES ---
  const [priceForm, setPriceForm] = useState<PriceRecord[]>([]);
  useEffect(() => {
    setPriceForm(JSON.parse(JSON.stringify(prices))); // deep copy
  }, [prices]);

  const handlePriceFieldChange = (idx: number, val: string) => {
    const num = Number(val);
    if (isNaN(num)) return;
    const copied = [...priceForm];
    copied[idx].priceToday = num;
    setPriceForm(copied);
  };

  const handleSavePrices = async () => {
    setLoading(true);
    try {
      await api.updatePrices(priceForm);
      confetti({ particleCount: 50, colors: ['#ab833c'] });
      alertMsg('Daily scrap metal price board updated successfully.');
      onDataRefresh();
    } catch (e: any) {
      alertMsg(e.message || 'Failed to save prices', true);
    } finally {
      setLoading(false);
    }
  };

  // --- PICKUPS SUITE ACTIONS ---
  const handleUpdatePickupStatus = async (id: string, status: string) => {
    try {
      await api.updatePickupStatus(id, status);
      alertMsg(`Pickup request status updated to: ${status}`);
      onDataRefresh();
    } catch (e: any) {
      alertMsg(e.message, true);
    }
  };

  const handleDeletePickup = async (id: string) => {
    if (!window.confirm('Delete this customer pickup request permanently?')) return;
    try {
      await api.deletePickup(id);
      alertMsg('Pickup record deleted successfully.');
      onDataRefresh();
    } catch (e: any) {
      alertMsg(e.message, true);
    }
  };

  // --- PROJECTS SUITE STATES & ACTIONS ---
  const [editingProject, setEditingProject] = useState<Partial<ProjectRecord> | null>(null);
  const [projForm, setProjForm] = useState({
    title: '',
    category: 'Factory Dismantling',
    client: '',
    location: '',
    description: '',
    scale: '',
    imageUrl: '',
    date: new Date().toISOString().split('T')[0],
    detailsInput: ''
  });

  const handleProjectSelectEdit = (p: ProjectRecord) => {
    setEditingProject(p);
    setProjForm({
      title: p.title,
      category: p.category,
      client: p.client,
      location: p.location,
      description: p.description,
      scale: p.scale,
      imageUrl: p.imageUrl,
      date: p.date,
      detailsInput: p.details.join('\n')
    });
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projForm.title || !projForm.client || !projForm.imageUrl) {
      alertMsg('Please fill in mandatory fields: Title, Client and Image URL', true);
      return;
    }

    setLoading(true);
    const details = projForm.detailsInput.split('\n').filter((l) => l.trim().length > 0);
    const payload = {
      title: projForm.title,
      category: projForm.category,
      client: projForm.client,
      location: projForm.location,
      description: projForm.description,
      scale: projForm.scale,
      imageUrl: projForm.imageUrl,
      date: projForm.date,
      details
    };

    try {
      if (editingProject && editingProject.id) {
        await api.updateProject(editingProject.id, payload);
        alertMsg('Industrial project portfolio updated.');
      } else {
        await api.createProject(payload);
        alertMsg('New project record created.');
      }
      setEditingProject(null);
      setProjForm({
        title: '',
        category: 'Factory Dismantling',
        client: '',
        location: '',
        description: '',
        scale: '',
        imageUrl: '',
        date: new Date().toISOString().split('T')[0],
        detailsInput: ''
      });
      onDataRefresh();
    } catch (err: any) {
      alertMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Erase this project from corporate portfolio?')) return;
    try {
      await api.deleteProject(id);
      alertMsg('Project erased.');
      onDataRefresh();
    } catch (e: any) {
      alertMsg(e.message, true);
    }
  };

  // --- GALLERY SUITE STATES & ACTIONS ---
  const [editingGal, setEditingGal] = useState<Partial<GalleryItem> | null>(null);
  const [galForm, setGalForm] = useState({
    title: '',
    description: '',
    type: 'image' as 'image' | 'video',
    url: '',
    category: 'Scrap Metal'
  });

  const handleGalSelectEdit = (g: GalleryItem) => {
    setEditingGal(g);
    setGalForm({
      title: g.title,
      description: g.description,
      type: g.type,
      url: g.url,
      category: g.category
    });
  };

  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galForm.title || !galForm.url) {
      alertMsg('Title and URL are required.', true);
      return;
    }
    setLoading(true);
    try {
      if (editingGal && editingGal.id) {
        await api.updateGalleryItem(editingGal.id, galForm);
        alertMsg('Gallery media details saved.');
      } else {
        await api.createGalleryItem(galForm);
        alertMsg('New gallery item appended.');
      }
      setEditingGal(null);
      setGalForm({
        title: '',
        description: '',
        type: 'image',
        url: '',
        category: 'Scrap Metal'
      });
      onDataRefresh();
    } catch (err: any) {
      alertMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGalItem = async (id: string) => {
    if (!window.confirm('Delete this gallery media item?')) return;
    try {
      await api.deleteGalleryItem(id);
      alertMsg('Gallery item removed.');
      onDataRefresh();
    } catch (e: any) {
      alertMsg(e.message, true);
    }
  };

  // Sort Gallery Items (Move Up / Down)
  const handleMoveGalleryItem = async (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= gallery.length) return;

    const orderedIds = gallery.map((g) => g.id);
    // Swap IDs
    const temp = orderedIds[idx];
    orderedIds[idx] = orderedIds[targetIdx];
    orderedIds[targetIdx] = temp;

    try {
      await api.reorderGallery(orderedIds);
      alertMsg('Gallery sorting sequence reordered.');
      onDataRefresh();
    } catch (e: any) {
      alertMsg(e.message, true);
    }
  };

  // --- BACKUP & EXPORTS SUITE ---
  const triggerDownloadBackup = () => {
    const token = localStorage.getItem('nk_prestige_admin_token') || '';
    window.open(`/api/admin/backup?token=${encodeURIComponent(token)}`, '_blank');
  };

  const triggerExportCSV = (type: 'prices' | 'pickups') => {
    const token = localStorage.getItem('nk_prestige_admin_token') || '';
    window.open(`/api/admin/export-csv/${type}?token=${encodeURIComponent(token)}`, '_blank');
  };

  const handleRestoreUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = JSON.parse(text);
        if (!window.confirm('Overwrite current database completely with backup file? This is irreversible.')) return;
        setLoading(true);
        await api.restoreBackup(parsed);
        alertMsg('Database restored successfully from backup.');
        onDataRefresh();
      } catch (err) {
        alertMsg('Invalid backup JSON file schema.', true);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  // --- GENERAL SETTINGS ---
  const [settingsForm, setSettingsForm] = useState<BusinessInfo>({ ...businessInfo });
  useEffect(() => {
    setSettingsForm({ ...businessInfo });
  }, [businessInfo]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.updateSettings({ businessInfo: settingsForm });
      alertMsg('General site configurations and SEO tags updated.');
      onDataRefresh();
    } catch (err: any) {
      alertMsg(err.message, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header Branding */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-industrial-border pb-6 mb-10 gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-gold-400 bg-gold-500/5 px-3 py-1 rounded border border-gold-500/10">
              Executive Console Core
            </span>
            <h1 className="text-3xl font-bold font-display text-white mt-2">
              NK Prestige Admin Panel
            </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={triggerDownloadBackup}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-industrial-card border border-industrial-border rounded text-xs text-gray-300 hover:text-white hover:border-gold-500/30 transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-gold-400" />
              Backup DB (JSON)
            </button>
            <label className="flex items-center gap-1.5 px-3 py-1.5 bg-industrial-card border border-industrial-border rounded text-xs text-gray-300 hover:text-white hover:border-gold-500/30 transition-all cursor-pointer">
              <Upload className="w-4 h-4 text-gold-400" />
              Restore DB
              <input type="file" accept=".json" onChange={handleRestoreUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Global notification alerts */}
        {msg && (
          <div className={classNames(
            'p-4 rounded-xl border mb-8 flex items-center gap-3 text-xs',
            msg.isError 
              ? 'bg-red-500/10 border-red-500/20 text-red-400' 
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          )}>
            <ShieldCheck className="w-5 h-5 shrink-0" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Outer Layout (Tabs Selector on Left, Action Pane on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* TAB BAR SIDEBAR (3 cols) */}
          <div className="lg:col-span-3 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-x-visible pb-3 lg:pb-0 scrollbar-none">
            {(
              [
                { id: 'stats', label: 'Dashboard Stats', icon: Database },
                { id: 'prices', label: 'Manage Scrap Prices', icon: TrendingUp },
                { id: 'pickups', label: 'Logistics Pickups', icon: FileCheck, badge: pendingCount },
                { id: 'projects', label: 'Corporate Projects', icon: Briefcase },
                { id: 'gallery', label: 'Media Gallery', icon: ImageIcon },
                { id: 'settings', label: 'SEO & Site Settings', icon: Settings },
              ] as { id: SubTab; label: string; icon: any; badge?: number }[]
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={classNames(
                  'w-full flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all focus:outline-none cursor-pointer border whitespace-nowrap',
                  activeSubTab === tab.id
                    ? 'bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black border-gold-500 font-extrabold shadow-md'
                    : 'bg-industrial-card border-industrial-border/60 text-gray-400 hover:text-white hover:border-gold-500/30'
                )}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className={classNames(
                    'px-2 py-0.5 rounded-full text-[10px] font-mono font-bold leading-none',
                    activeSubTab === tab.id ? 'bg-black text-gold-400' : 'bg-gold-500 text-black'
                  )}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ACTIONS CORE BOARD (9 cols) */}
          <div className="lg:col-span-9 glass-panel border border-industrial-border rounded-2xl p-6 sm:p-8 relative min-h-[460px]">
            
            {/* 1. VIEW: STATS OVERVIEW */}
            {activeSubTab === 'stats' && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <h3 className="text-lg font-bold font-display text-white border-b border-industrial-border pb-2">Operational Analytics</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Card 1 */}
                  <div className="bg-black/40 border border-industrial-border p-5 rounded-xl text-center space-y-1">
                    <span className="block text-[10px] uppercase text-gray-500 font-mono tracking-widest">Active Requests</span>
                    <span className="block text-4xl font-mono font-bold text-gold-400">{pendingCount + confirmedCount}</span>
                    <span className="block text-[11px] text-gray-400">{pendingCount} Pending Logistics</span>
                  </div>
                  {/* Card 2 */}
                  <div className="bg-black/40 border border-industrial-border p-5 rounded-xl text-center space-y-1">
                    <span className="block text-[10px] uppercase text-gray-500 font-mono tracking-widest">Metals Indexed</span>
                    <span className="block text-4xl font-mono font-bold text-white">{prices.length}</span>
                    <span className="block text-[11px] text-gray-400">All prices linked to LME</span>
                  </div>
                  {/* Card 3 */}
                  <div className="bg-black/40 border border-industrial-border p-5 rounded-xl text-center space-y-1">
                    <span className="block text-[10px] uppercase text-gray-500 font-mono tracking-widest">Decommission Cases</span>
                    <span className="block text-4xl font-mono font-bold text-white">{projects.length}</span>
                    <span className="block text-[11px] text-gray-400">Grade-A verified works</span>
                  </div>
                </div>

                {/* CSV Downloads */}
                <div className="p-6 bg-gold-500/5 border border-gold-500/10 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 font-display">Spreadsheet Downloads</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-sans">
                    Export raw platform analytics database tables. Format complies with global corporate spreadsheet pipelines.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => triggerExportCSV('pickups')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-industrial-card hover:bg-white/5 border border-industrial-border text-xs text-white font-bold rounded cursor-pointer transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      Export Pickups CSV
                    </button>
                    <button
                      onClick={() => triggerExportCSV('prices')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-industrial-card hover:bg-white/5 border border-industrial-border text-xs text-white font-bold rounded cursor-pointer transition-colors"
                    >
                      <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      Export Scrap Prices CSV
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 2. VIEW: PRICES MANAGER */}
            {activeSubTab === 'prices' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-industrial-border pb-2">
                  <h3 className="text-lg font-bold font-display text-white">Scrap Prices Manager</h3>
                  <button
                    onClick={handleSavePrices}
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase tracking-wider rounded shadow cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Archiving...' : 'Publish New Prices'}
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-industrial-border">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black text-[10px] uppercase font-mono tracking-widest text-gray-400 border-b border-industrial-border">
                        <th className="py-2.5 px-4">Scrap Category</th>
                        <th className="py-2.5 px-4 text-right">Last Price</th>
                        <th className="py-2.5 px-4 text-right">New Price (Today)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-industrial-border text-xs font-sans">
                      {priceForm.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-white/5">
                          <td className="py-2 px-4">
                            <span className="block text-white font-medium">{item.name}</span>
                            <span className="text-[10px] text-gray-500 font-mono">ID: {item.id} | Unit: {item.unit}</span>
                          </td>
                          <td className="py-2 px-4 text-right font-mono text-gray-400">
                            {formatINR(item.priceToday)}
                          </td>
                          <td className="py-2 px-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <input
                                type="number"
                                step="0.01"
                                value={item.priceToday}
                                onChange={(e) => handlePriceFieldChange(idx, e.target.value)}
                                className="w-24 text-right px-2 py-1 bg-black border border-industrial-border rounded font-mono text-white focus:outline-none focus:border-gold-500"
                              />
                              <span className="text-[10px] text-gray-500 font-mono">{item.unit.split('/')[1]}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. VIEW: PICKUP REQUESTS MANAGER */}
            {activeSubTab === 'pickups' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-industrial-border pb-2">
                  <h3 className="text-lg font-bold font-display text-white">Scrap Pickup Logistics</h3>
                  <button
                    onClick={() => triggerExportCSV('pickups')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-industrial-card hover:bg-white/5 border border-industrial-border text-xs text-white font-bold rounded cursor-pointer"
                  >
                    <Download className="w-4 h-4 text-emerald-400" />
                    Download CSV
                  </button>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {pickups.length > 0 ? (
                    pickups.map((req) => (
                      <div key={req.id} className="p-5 bg-black/40 border border-industrial-border rounded-xl space-y-4 relative">
                        {/* Title block */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                          <div>
                            <span className="text-[9px] font-mono text-gray-500 uppercase font-bold">Request: {req.id}</span>
                            <h4 className="text-sm font-bold text-white font-display uppercase">{req.customerName}</h4>
                          </div>

                          {/* Status buttons */}
                          <div className="flex flex-wrap items-center gap-1">
                            {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
                              <button
                                key={st}
                                onClick={() => handleUpdatePickupStatus(req.id, st)}
                                className={classNames(
                                  'px-2 py-1 rounded text-[9px] uppercase font-mono font-bold border cursor-pointer',
                                  req.status === st
                                    ? st === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                      : st === 'confirmed' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                                      : st === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                                    : 'bg-transparent text-gray-500 border-transparent hover:border-industrial-border'
                                )}
                              >
                                {st}
                              </button>
                            ))}

                            <button
                              onClick={() => handleDeletePickup(req.id)}
                              className="p-1 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 cursor-pointer ml-1"
                              title="Delete request"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Customer coordinates details */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono text-gray-400 border-t border-industrial-border/60 pt-3">
                          <div>
                            <span className="block text-[9px] text-gray-600 uppercase">Phone</span>
                            <strong className="text-white">{req.phone}</strong>
                          </div>
                          <div>
                            <span className="block text-[9px] text-gray-600 uppercase">Quantity</span>
                            <strong className="text-gray-300">{req.quantity}</strong>
                          </div>
                          <div>
                            <span className="block text-[9px] text-gray-600 uppercase">Scrap Type</span>
                            <strong className="text-gray-300">{req.scrapType}</strong>
                          </div>
                          <div>
                            <span className="block text-[9px] text-gray-600 uppercase">Submission Date</span>
                            <strong className="text-gray-400">{formatDate(req.createdAt)}</strong>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="bg-black/50 p-2.5 rounded border border-industrial-border/40 text-[11px] text-gray-400 font-sans">
                          <strong className="text-white block text-[9px] uppercase font-mono mb-0.5">Logistics Address & Time Frame:</strong>
                          <span>{req.address} — <strong className="text-gold-400 font-mono">{req.preferredTime}</strong></span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 font-sans">
                      No active customer pickup inquiries found in database.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. VIEW: PROJECTS CRUD */}
            {activeSubTab === 'projects' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-industrial-border pb-2">
                  <h3 className="text-lg font-bold font-display text-white">Project Case Portfolio</h3>
                  {editingProject ? (
                    <button
                      onClick={() => setEditingProject(null)}
                      className="px-3 py-1.5 border border-industrial-border text-gray-400 hover:text-white text-xs uppercase rounded cursor-pointer"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingProject({});
                        setProjForm({
                          title: '',
                          category: 'Factory Dismantling',
                          client: '',
                          location: '',
                          description: '',
                          scale: '',
                          imageUrl: '',
                          date: new Date().toISOString().split('T')[0],
                          detailsInput: ''
                        });
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase rounded shadow cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Project
                    </button>
                  )}
                </div>

                {/* FORM PANEL */}
                {editingProject ? (
                  <form onSubmit={handleSaveProject} className="space-y-4 bg-black/40 p-5 rounded-xl border border-industrial-border">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 font-display">
                      {editingProject.id ? 'Edit Project Entry' : 'Create New Project Case File'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Project Name *</label>
                        <input
                          type="text"
                          required
                          value={projForm.title}
                          onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Select Core Category</label>
                        <select
                          value={projForm.category}
                          onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        >
                          <option>Factory Dismantling</option>
                          <option>Industrial Demolition</option>
                          <option>Lifting & Shifting</option>
                          <option>Scrap Metal Trading</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="col-span-2">
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Client Name *</label>
                        <input
                          type="text"
                          required
                          value={projForm.client}
                          onChange={(e) => setProjForm({ ...projForm, client: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Operational Location</label>
                        <input
                          type="text"
                          placeholder="Pune, MH"
                          value={projForm.location}
                          onChange={(e) => setProjForm({ ...projForm, location: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Tonnage Scale</label>
                        <input
                          type="text"
                          placeholder="e.g. 150 Tons"
                          value={projForm.scale}
                          onChange={(e) => setProjForm({ ...projForm, scale: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Unsplash/Video Image URL *</label>
                        <input
                          type="text"
                          required
                          value={projForm.imageUrl}
                          onChange={(e) => setProjForm({ ...projForm, imageUrl: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Project Date</label>
                        <input
                          type="date"
                          value={projForm.date}
                          onChange={(e) => setProjForm({ ...projForm, date: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Project Description Overview</label>
                      <textarea
                        rows={2}
                        value={projForm.description}
                        onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white resize-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Accomplishments (one sentence per line)</label>
                      <textarea
                        rows={3}
                        placeholder="e.g. Safety audits logged successfully with zero incident cards."
                        value={projForm.detailsInput}
                        onChange={(e) => setProjForm({ ...projForm, detailsInput: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase rounded shadow"
                    >
                      {loading ? 'Saving to Database...' : 'Save Project File'}
                    </button>
                  </form>
                ) : (
                  /* LIST PANEL */
                  <div className="space-y-4 max-h-[500px] overflow-y-auto">
                    {projects.map((proj) => (
                      <div key={proj.id} className="p-4 bg-black/30 border border-industrial-border rounded-xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={proj.imageUrl}
                            alt=""
                            className="w-12 h-12 object-cover rounded border border-industrial-border shrink-0 referrerPolicy='no-referrer'"
                          />
                          <div>
                            <span className="text-[9px] font-mono text-gold-400 font-semibold uppercase">{proj.category}</span>
                            <h4 className="text-sm font-bold text-white font-display uppercase">{proj.title}</h4>
                            <span className="text-[10px] text-gray-500 font-mono">Client: {proj.client} | Scale: {proj.scale}</span>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          <button
                            onClick={() => handleProjectSelectEdit(proj)}
                            className="p-2 bg-industrial-card hover:bg-gold-500/10 text-gray-400 hover:text-gold-400 rounded transition-colors cursor-pointer"
                            title="Edit project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-2 bg-industrial-card hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                            title="Delete project"
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. VIEW: GALLERY CRUD + DRAG-DROP REORDER */}
            {activeSubTab === 'gallery' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-industrial-border pb-2">
                  <h3 className="text-lg font-bold font-display text-white">Media Gallery Manager</h3>
                  {editingGal ? (
                    <button
                      onClick={() => setEditingGal(null)}
                      className="px-3 py-1 bg-industrial-border text-gray-400 text-xs rounded uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingGal({});
                        setGalForm({
                          title: '',
                          description: '',
                          type: 'image',
                          url: '',
                          category: 'Scrap Metal'
                        });
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase rounded shadow cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      Add Media
                    </button>
                  )}
                </div>

                {editingGal ? (
                  <form onSubmit={handleSaveGalleryItem} className="space-y-4 bg-black/40 p-5 rounded-xl border border-industrial-border">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 font-display">
                      {editingGal.id ? 'Edit Media Metadata' : 'Append New Media File'}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Media Title *</label>
                        <input
                          type="text"
                          required
                          value={galForm.title}
                          onChange={(e) => setGalForm({ ...galForm, title: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Select Category Tag</label>
                        <select
                          value={galForm.category}
                          onChange={(e) => setGalForm({ ...galForm, category: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        >
                          <option>Scrap Metal</option>
                          <option>Demolition</option>
                          <option>Lifting & Shifting</option>
                          <option>Yard Operations</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Unsplash Photo/Video Thumbnail URL *</label>
                        <input
                          type="text"
                          required
                          value={galForm.url}
                          onChange={(e) => setGalForm({ ...galForm, url: e.target.value })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Format Type</label>
                        <select
                          value={galForm.type}
                          onChange={(e) => setGalForm({ ...galForm, type: e.target.value as any })}
                          className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white"
                        >
                          <option value="image">Still Photo</option>
                          <option value="video">Motion Video Log</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Short Description</label>
                      <textarea
                        rows={2}
                        value={galForm.description}
                        onChange={(e) => setGalForm({ ...galForm, description: e.target.value })}
                        className="w-full px-3 py-1.5 bg-black border border-industrial-border rounded text-xs text-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase rounded shadow"
                    >
                      Save Gallery Item
                    </button>
                  </form>
                ) : (
                  /* LIST PANEL + DRAG/DROP REORDER SIMULATION (Up / Down actions) */
                  <div className="space-y-4">
                    <div className="p-3 bg-gold-500/5 border border-gold-500/10 rounded-lg text-[11px] text-gray-400">
                      <strong>Reordering Capability:</strong> Use the <strong className="text-white">Move Up ↑</strong> and <strong className="text-white">Move Down ↓</strong> arrows to customize image hierarchy on the public page. Reordered layout sequences persist in JSON.
                    </div>

                    <div className="space-y-2.5 max-h-[460px] overflow-y-auto">
                      {gallery.map((item, idx) => (
                        <div key={item.id} className="p-3 bg-black/40 border border-industrial-border rounded-xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            {/* Grab handles & indexing */}
                            <div className="flex flex-col gap-1 text-gray-500">
                              <button
                                onClick={() => handleMoveGalleryItem(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 hover:text-gold-400 hover:bg-white/5 rounded disabled:opacity-20 cursor-pointer"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleMoveGalleryItem(idx, 'down')}
                                disabled={idx === gallery.length - 1}
                                className="p-1 hover:text-gold-400 hover:bg-white/5 rounded disabled:opacity-20 cursor-pointer"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <img
                              src={item.url}
                              alt=""
                              className="w-12 h-12 object-cover rounded border border-industrial-border shrink-0 referrerPolicy='no-referrer'"
                            />
                            <div>
                              <span className="text-[9px] font-mono text-gold-400 bg-gold-500/5 border border-gold-500/10 px-1.5 py-0.5 rounded uppercase font-semibold">
                                {item.category} ({item.type})
                              </span>
                              <h4 className="text-xs font-bold text-white uppercase mt-0.5">{item.title}</h4>
                              <span className="text-[10px] text-gray-500 font-mono">Sort Order Index: {item.sortOrder}</span>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <button
                              onClick={() => handleGalSelectEdit(item)}
                              className="p-1.5 bg-industrial-card hover:bg-gold-500/10 text-gray-400 hover:text-gold-400 rounded transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteGalItem(item.id)}
                              className="p-1.5 bg-industrial-card hover:bg-red-500/10 text-gray-400 hover:text-red-400 rounded transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 6. VIEW: SETTINGS & SEO */}
            {activeSubTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-6 animate-in fade-in duration-200">
                <div className="flex justify-between items-center border-b border-industrial-border pb-2">
                  <h3 className="text-lg font-bold font-display text-white">General SEO & Info Configurations</h3>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-gradient-to-r from-gold-500 to-gold-600 text-industrial-black text-xs font-bold uppercase rounded shadow cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Company Primary Email</label>
                    <input
                      type="email"
                      value={settingsForm.email}
                      onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-industrial-border rounded text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Primary Desk Line</label>
                    <input
                      type="text"
                      value={settingsForm.phone}
                      onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-industrial-border rounded text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Corporate WhatsApp Number</label>
                    <input
                      type="text"
                      value={settingsForm.whatsapp}
                      onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-industrial-border rounded text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Business Hours Overview</label>
                    <input
                      type="text"
                      value={settingsForm.businessHours}
                      onChange={(e) => setSettingsForm({ ...settingsForm, businessHours: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-industrial-border rounded text-xs text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3.5 border-t border-industrial-border/60 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gold-400 font-display">Metadata & SEO Audit Tags</h4>
                  
                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">SEO Page Title</label>
                    <input
                      type="text"
                      value={settingsForm.seoTitle}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-industrial-border rounded text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={settingsForm.seoDescription}
                      onChange={(e) => setSettingsForm({ ...settingsForm, seoDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-black border border-industrial-border rounded text-xs text-white resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Google Analytics Key ID</label>
                      <input
                        type="text"
                        placeholder="G-XXXXXX"
                        value={settingsForm.googleAnalyticsId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, googleAnalyticsId: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-industrial-border rounded text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono font-bold uppercase text-gray-500 mb-1">Google Search Console Verification</label>
                      <input
                        type="text"
                        placeholder="sc-domain:..."
                        value={settingsForm.googleSearchConsoleId}
                        onChange={(e) => setSettingsForm({ ...settingsForm, googleSearchConsoleId: e.target.value })}
                        className="w-full px-3 py-2 bg-black border border-industrial-border rounded text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
