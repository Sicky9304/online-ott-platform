'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, HardDrive, UploadCloud, Eye, Activity, ShieldCheck, Trash2, Edit3, Plus, X, ListFilter, Globe, Clapperboard, MonitorPlay, LogOut } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../hooks/useAuth';

export default function AdminDashboardPage() {
  const { logout } = useAuth();
  
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalMovies: 0,
    totalSeries: 0,
    totalViews: 0,
    moviesWithTrailer: 0,
    seriesWithTrailer: 0,
    totalTitles: 0,
    activeStorageProvider: 'local'
  });

  const [activeTab, setActiveTab] = useState('movies'); // 'movies', 'series', 'trailers'
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [catalogItems, setCatalogItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form States
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tagline: '',
    releaseYear: 2026,
    duration: 120,
    rating: 'U/A 16+',
    imdbRating: 8.5,
    matchPercentage: 98,
    language: 'Hindi Dubbed',
    genres: '',
    posterUrl: '',
    bannerUrl: '',
    trailerUrl: '',
    videoUrl: '',
    seasonsCount: 1,
    episodesCount: 10,
    resolution: '4K UHD'
  });

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/analytics');
      if (res.data.data?.analytics) {
        setAnalytics(res.data.data.analytics);
      }
    } catch (err) {
      console.warn('Analytics failed to load');
    }
  };

  const fetchCatalog = async () => {
    setLoadingItems(true);
    try {
      let endpoint = '/movies';
      let params = { limit: 1000 }; // Pull all catalog elements to show all 374+ entries

      if (activeTab === 'trailers') {
        endpoint = '/trailers';
      } else if (activeTab === 'series') {
        params.type = 'series';
      } else if (activeTab === 'movies') {
        params.type = 'movie';
      }

      if (selectedLanguage !== 'All') {
        params.language = selectedLanguage;
      }

      const res = await api.get(endpoint, { params });
      const items = res.data.data?.movies || res.data.data?.trailers || [];
      setCatalogItems(items);
    } catch (err) {
      console.error('Failed to load admin catalog items');
      setCatalogItems([]);
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    fetchCatalog();
  }, [activeTab, selectedLanguage]);

  const handleDelete = async (id) => {
    if (!confirm(`Are you sure you want to permanently delete this ${activeTab.slice(0, -1)} from the catalog?`)) return;
    try {
      await api.delete(`/admin/${activeTab}/${id}`);
      setCatalogItems(catalogItems.filter((item) => item._id !== id));
      fetchAnalytics();
      alert(`${activeTab.slice(0, -1).toUpperCase()} successfully deleted!`);
    } catch (err) {
      alert('Failed to delete item');
    }
  };

  const handleOpenEdit = (item) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      description: item.description || '',
      tagline: item.tagline || '',
      releaseYear: item.releaseYear || 2026,
      duration: item.duration || 120,
      rating: item.rating || 'U/A 16+',
      imdbRating: item.imdbRating || 8.5,
      matchPercentage: item.matchPercentage || 98,
      language: item.language || 'Hindi Dubbed',
      genres: item.genres?.join(', ') || '',
      posterUrl: item.posterUrl || '',
      bannerUrl: item.bannerUrl || '',
      trailerUrl: item.trailerUrl || '',
      videoUrl: item.videoUrl || '',
      seasonsCount: item.seasonsCount || 1,
      episodesCount: item.episodesCount || 10,
      resolution: item.resolution || '4K UHD'
    });
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    setFormData({
      title: '',
      description: '',
      tagline: '',
      releaseYear: 2026,
      duration: 120,
      rating: 'U/A 16+',
      imdbRating: 8.5,
      matchPercentage: 98,
      language: selectedLanguage !== 'All' ? selectedLanguage : 'Hindi Dubbed',
      genres: '',
      posterUrl: '',
      bannerUrl: '',
      trailerUrl: '',
      videoUrl: '',
      seasonsCount: 1,
      episodesCount: 10,
      resolution: '4K UHD'
    });
    setIsAddModalOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        genres: formData.genres.split(',').map((g) => g.trim()).filter(Boolean)
      };
      await api.put(`/admin/${activeTab}/${selectedItem._id}`, payload);
      setIsEditModalOpen(false);
      fetchCatalog();
      alert('Record updated successfully!');
    } catch (err) {
      alert('Failed to update record');
    }
  };

  const handleSaveAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        genres: formData.genres.split(',').map((g) => g.trim()).filter(Boolean)
      };
      await api.post(`/admin/${activeTab}`, payload);
      setIsAddModalOpen(false);
      fetchCatalog();
      fetchAnalytics();
      alert('New record added successfully!');
    } catch (err) {
      alert('Failed to add record');
    }
  };

  // SaaS Live Analytics widgets
  return (
    <div className="w-full px-4 sm:px-8 md:px-12 pt-8 pb-24 min-h-screen space-y-6 select-none">
      
      {/* 2030 Futuristic SaaS Header */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-cyan-950/10 border border-cyan-500/10 p-5 sm:p-6 rounded-2xl backdrop-blur-md shadow-2xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-widest mb-1">
            <ShieldCheck className="w-4 h-4 text-cyan-400 animate-pulse" /> 
            <span>CINEVERSE ADMIN ENGINE v3.0</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-none">
            Control Center
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-1">
            Configure system configurations, manage catalog assets, and monitor active cloud quotas.
          </p>
        </div>

        {/* Global Action Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleOpenAdd}
            className="px-4 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_20px_rgba(6,182,212,0.25)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add {activeTab.slice(0, -1).toUpperCase()}
          </button>
          
          <Link
            href="/admin/upload"
            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs sm:text-sm font-black flex items-center gap-1.5 transition-colors"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" /> Upload Engine
          </Link>
          
          <Link
            href="/admin/storage"
            className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 text-xs sm:text-sm font-black flex items-center gap-1.5 transition-colors"
          >
            <HardDrive className="w-4 h-4 text-cyan-400" /> Storage Config
          </Link>

          <button
            onClick={logout}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 via-orange-600 to-rose-700 hover:opacity-90 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(220,38,38,0.35)] transition-all cursor-pointer transform hover:scale-105 active:scale-95"
            title="Log Out Session"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {/* SaaS Live Analytics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-between space-y-3 hover:border-cyan-500/20 transition-all">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Active Catalog Titles</span>
            <Film className="w-4.5 h-4.5 text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{analytics.totalTitles}</div>
            <p className="text-[10px] text-gray-400 font-extrabold mt-0.5">
              {analytics.totalMovies} Movies • {analytics.totalSeries} Web Series
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-between space-y-3 hover:border-purple-500/20 transition-all">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Subscribers Base</span>
            <Eye className="w-4.5 h-4.5 text-purple-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">{analytics.totalUsers}</div>
            <p className="text-[10px] text-emerald-400 font-black mt-0.5">
              Active concurrent nodes
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-between space-y-3 hover:border-amber-500/20 transition-all">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Default Storage</span>
            <HardDrive className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 uppercase truncate">
              {analytics.activeStorageProvider}
            </div>
            <p className="text-[10px] text-gray-400 font-extrabold mt-0.5">
              Multi-cloud integration active
            </p>
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-white/5 shadow-lg flex flex-col justify-between space-y-3 hover:border-emerald-500/20 transition-all">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-[10px] font-black uppercase tracking-wider">Aggregate Traffic Views</span>
            <Activity className="w-4.5 h-4.5 text-emerald-400" />
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-white">
              {(analytics.totalViews || 0).toLocaleString()}
            </div>
            <p className="text-[10px] text-gray-400 font-extrabold mt-0.5">
              {analytics.moviesWithTrailer} trailers buffered
            </p>
          </div>
        </div>
      </div>

      {/* Segmented Controller (Tabs) & Filtering Sub-bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/5 border border-white/10 p-4 rounded-3xl w-full">
        {/* Management Tabs (Separating Movies, Series, and Trailers) */}
        <div className="flex items-center gap-2 bg-[#090b14]/80 p-2 rounded-2xl border border-white/5 w-full lg:w-auto overflow-x-auto no-scrollbar scroll-smooth">
          {[
            { id: 'movies', label: 'Movies Catalog', icon: Film },
            { id: 'series', label: 'Web Series', icon: MonitorPlay },
            { id: 'trailers', label: 'Trailers Section', icon: Clapperboard }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSelectedLanguage('All'); }}
                className={`px-4 sm:px-6 py-3 rounded-xl text-sm sm:text-base font-black flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  isActive
                    ? 'bg-cyan-500 text-black shadow-md'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Language Filter Tag Selection */}
        <div className="flex items-center gap-3 w-full lg:w-auto flex-wrap lg:flex-nowrap">
          <div className="flex items-center gap-2 text-gray-400">
            <ListFilter className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-black uppercase tracking-wider whitespace-nowrap">Language:</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 no-scrollbar scroll-smooth">
            {[
              { label: '🌐 All', value: 'All' },
              { label: 'Hindi Dubbed', value: 'Hindi Dubbed' },
              { label: 'South', value: 'Hindi Dubbed (South)' },
              { label: 'Korean', value: 'Hindi Dubbed (Korean)' },
              { label: 'Bhojpuri', value: 'Bhojpuri' }
            ].map((lang) => (
              <button
                key={lang.value}
                onClick={() => setSelectedLanguage(lang.value)}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-black border transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                  selectedLanguage === lang.value
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Table Area */}
      <div className="glass-panel rounded-3xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 bg-[#090b14]/50 flex items-center justify-between">
          <h3 className="text-xl font-black text-white flex items-center gap-2">
            <span>Listing: {activeTab.toUpperCase()}</span>
            <span className="px-3.5 py-1 rounded-full bg-cyan-950 text-cyan-400 font-extrabold text-sm">
              {catalogItems.length} records
            </span>
          </h3>
        </div>

        {loadingItems ? (
          <div className="p-24 text-center text-cyan-400 font-black text-lg animate-pulse">
            Fetching catalog database records...
          </div>
        ) : catalogItems.length === 0 ? (
          <div className="p-24 text-center text-gray-500 font-bold space-y-3">
            <p className="text-lg">No records found in this section.</p>
            <button
              onClick={handleOpenAdd}
              className="text-sm font-black text-cyan-400 hover:underline"
            >
              + Create first record
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/2 text-gray-400 text-xs font-black uppercase">
                  <th className="p-3 pl-6">Poster</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Year</th>
                  <th className="p-3">Language</th>
                  <th className="p-3">Age Rating</th>
                  <th className="p-3">IMDb score</th>
                  <th className="p-3 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {catalogItems.map((item) => (
                  <tr key={item._id} className="hover:bg-white/2 transition-colors">
                    <td className="p-3 pl-6">
                      <img
                        src={item.posterUrl}
                        alt=""
                        referrerPolicy="no-referrer"
                        className="w-10 h-14 rounded-lg object-cover border border-white/10 shadow-sm"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/80x120?text=No+Poster'; }}
                      />
                    </td>
                    <td className="p-3 pl-6">
                      <div className="font-black text-white text-sm sm:text-base line-clamp-1 max-w-sm">{item.title}</div>
                      {item.genres && (
                        <div className="text-[10px] text-gray-400 font-extrabold mt-0.5 truncate max-w-sm">
                          {item.genres.join(' | ')}
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-gray-200 font-black text-xs sm:text-sm">{item.releaseYear}</td>
                    <td className="p-3">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 text-xs font-black">
                        {item.language || 'English'}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-white text-xs font-black">
                        {item.rating || 'U/A 16+'}
                      </span>
                    </td>
                    <td className="p-3 text-amber-300 font-black text-xs sm:text-sm">★ {item.imdbRating || '8.5'}</td>
                    <td className="p-3 pr-6 text-right space-x-1.5 sm:space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/40 hover:scale-105 transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Edit Record"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="p-2 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/40 hover:scale-105 transition-all cursor-pointer inline-flex items-center justify-center"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CRUD Edit/Add Modals (Futuristic overlay forms) */}
      {(isEditModalOpen || isAddModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="glass-panel w-full max-w-3xl bg-[#090b14] rounded-3xl border border-cyan-500/30 overflow-hidden shadow-2xl">
            <div className="p-5 sm:p-6 border-b border-white/5 flex items-center justify-between bg-white/2">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse" />
                <span>{isEditModalOpen ? `Modify ${activeTab.slice(0, -1).toUpperCase()}` : `Add New ${activeTab.slice(0, -1).toUpperCase()}`}</span>
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsAddModalOpen(false);
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            <form onSubmit={isEditModalOpen ? handleSaveEdit : handleSaveAdd} className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Tagline</label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Release Year</label>
                  <input
                    type="number"
                    required
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">
                    {activeTab === 'series' ? 'Seasons Count' : 'Duration (mins)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={activeTab === 'series' ? formData.seasonsCount : formData.duration}
                    onChange={(e) => {
                      if (activeTab === 'series') {
                        setFormData({ ...formData, seasonsCount: parseInt(e.target.value) });
                      } else {
                        setFormData({ ...formData, duration: parseInt(e.target.value) });
                      }
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Language Mapping</label>
                  <select
                    value={formData.language}
                    onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#090b14] border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    <option value="Hindi Dubbed">Hindi Dubbed</option>
                    <option value="Hindi Dubbed (South)">Hindi Dubbed (South)</option>
                    <option value="Hindi Dubbed (Korean)">Hindi Dubbed (Korean)</option>
                    <option value="Bhojpuri">Bhojpuri</option>
                    <option value="English">English</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Age Rating</label>
                  <input
                    type="text"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">IMDb score</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.imdbRating}
                    onChange={(e) => setFormData({ ...formData, imdbRating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Match Percentage (%)</label>
                  <input
                    type="number"
                    value={formData.matchPercentage}
                    onChange={(e) => setFormData({ ...formData, matchPercentage: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Genres (comma separated)</label>
                  <input
                    type="text"
                    value={formData.genres}
                    onChange={(e) => setFormData({ ...formData, genres: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="Action, Sci-Fi, Drama"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Poster Image URL</label>
                  <input
                    type="text"
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Banner backdrop URL</label>
                  <input
                    type="text"
                    value={formData.bannerUrl}
                    onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Youtube Video URL (Trailer or Movie link)</label>
                  <input
                    type="text"
                    value={formData.trailerUrl}
                    onChange={(e) => setFormData({ ...formData, trailerUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    placeholder="https://www.youtube.com/embed/..."
                  />
                </div>

                {activeTab !== 'trailers' && (
                  <div className="sm:col-span-2">
                    <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Full Video URL (Alternate file link)</label>
                    <input
                      type="text"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                )}

                <div className="sm:col-span-2">
                  <label className="text-xs font-black text-cyan-400 block mb-1 uppercase tracking-wider">Description</label>
                  <textarea
                    rows="3"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsAddModalOpen(false);
                  }}
                  className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 font-black text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs shadow-lg shadow-cyan-500/20 transition-all"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


