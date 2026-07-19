'use client';
import { useState, useEffect } from 'react';
import { HardDrive, Check, Save, ShieldCheck, Key } from 'lucide-react';
import { storageService } from '../../../services/storageService';

export default function AdminStoragePage() {
  const [activeProvider, setActiveProvider] = useState('local');
  const [gdriveConfig, setGdriveConfig] = useState({ clientId: '', clientSecret: '', refreshToken: '', folderId: '' });
  const [megaConfig, setMegaConfig] = useState({ email: '', password: '' });
  const [cloudinaryConfig, setCloudinaryConfig] = useState({ cloudName: '', apiKey: '', apiSecret: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const config = await storageService.getConfig();
        if (config) {
          setActiveProvider(config.activeProvider || 'local');
          if (config.gdrive) setGdriveConfig(config.gdrive);
          if (config.mega) setMegaConfig(config.mega);
          if (config.cloudinary) setCloudinaryConfig(config.cloudinary);
        }
      } catch (err) {
        console.warn('Storage config fetch fallback');
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      await storageService.updateConfig(activeProvider, {
        gdrive: gdriveConfig,
        mega: megaConfig,
        cloudinary: cloudinaryConfig
      });
      setMessage(`Storage provider switched to ${activeProvider.toUpperCase()} successfully!`);
    } catch (err) {
      setMessage('Failed to update storage provider configuration.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen space-y-8">
      <div>
        <h1 className="text-3xl md:text-5xl font-black text-white">Storage Provider Settings</h1>
        <p className="text-gray-400 text-sm">Dynamically switch active storage engine without modifying source code</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs text-center">
          {message}
        </div>
      )}

      {/* Provider Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: 'local', title: 'Local Server Storage', desc: 'Fast local NVMe streaming pipeline (Default)' },
          { id: 'gdrive', title: 'Google Drive API', desc: 'Enterprise Google Workspace Drive storage' },
          { id: 'mega', title: 'Mega.nz API', desc: 'Encrypted cloud storage with high bandwidth' }
        ].map((p) => {
          const selected = activeProvider === p.id;
          return (
            <div
              key={p.id}
              onClick={() => setActiveProvider(p.id)}
              className={`p-6 rounded-3xl cursor-pointer border transition-all ${
                selected
                  ? 'glass-panel border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/20'
                  : 'glass-card border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <HardDrive className={`w-6 h-6 ${selected ? 'text-cyan-400' : 'text-gray-400'}`} />
                {selected && <Check className="w-5 h-5 text-cyan-400" />}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">{p.title}</h3>
              <p className="text-xs text-gray-400">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Credentials Input Form */}
      <form onSubmit={handleSave} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Key className="w-5 h-5 text-cyan-400" /> API Credentials & Token Store
        </h3>

        {/* Google Drive Credentials */}
        {activeProvider === 'gdrive' && (
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-cyan-400 uppercase">Google Drive API Configuration</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                value={gdriveConfig.clientId}
                onChange={(e) => setGdriveConfig({ ...gdriveConfig, clientId: e.target.value })}
                placeholder="Google Client ID"
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
              />
              <input
                type="password"
                value={gdriveConfig.clientSecret}
                onChange={(e) => setGdriveConfig({ ...gdriveConfig, clientSecret: e.target.value })}
                placeholder="Google Client Secret"
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
              />
              <input
                type="text"
                value={gdriveConfig.refreshToken}
                onChange={(e) => setGdriveConfig({ ...gdriveConfig, refreshToken: e.target.value })}
                placeholder="Refresh Token"
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white md:col-span-2"
              />
            </div>
          </div>
        )}

        {/* Mega Credentials */}
        {activeProvider === 'mega' && (
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-bold text-cyan-400 uppercase">Mega.nz Credentials</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="email"
                value={megaConfig.email}
                onChange={(e) => setMegaConfig({ ...megaConfig, email: e.target.value })}
                placeholder="Mega Email Account"
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
              />
              <input
                type="password"
                value={megaConfig.password}
                onChange={(e) => setMegaConfig({ ...megaConfig, password: e.target.value })}
                placeholder="Mega Password"
                className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
              />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={saving}
          className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20"
        >
          <Save className="w-4 h-4" /> {saving ? 'Saving Provider...' : 'Save & Switch Active Provider'}
        </button>
      </form>
    </div>
  );
}
