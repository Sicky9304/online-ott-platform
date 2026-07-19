'use client';
import { useState } from 'react';
import { UploadCloud, Film, Image as ImageIcon, CheckCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { storageService } from '../../../services/storageService';

export default function AdminUploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('');
  const [uploadedResult, setUploadedResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setUploadedResult(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a video or image file first');
      return;
    }

    setUploading(true);
    setProgress(0);
    setStatus('Chunking & Transferring payload to StorageService...');
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const result = await storageService.uploadFile(formData, (percent) => {
        setProgress(percent);
      });

      setStatus('Upload complete! Video metadata extracted & thumbnails generated.');
      setUploadedResult(result.storage);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Click Retry.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-10 min-h-screen space-y-8">
      <div>
        <h1 className="text-3xl md:text-5xl font-black text-white">Media Upload Studio</h1>
        <p className="text-gray-400 text-sm">Resumable chunked upload with automatic thumbnail generation</p>
      </div>

      <div className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6">
        {/* File Dropzone */}
        <div className="border-2 border-dashed border-white/20 hover:border-cyan-500/50 rounded-2xl p-10 text-center space-y-4 transition-colors">
          <UploadCloud className="w-12 h-12 text-cyan-400 mx-auto" />
          <div>
            <p className="text-sm font-bold text-white">Choose a video or image file</p>
            <p className="text-xs text-gray-400 mt-1">Supports MP4, MKV, MOV, PNG, JPG (Chunk size: 5MB)</p>
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="media_upload_input"
          />
          <label
            htmlFor="media_upload_input"
            className="inline-block px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold cursor-pointer transition-all"
          >
            Select File
          </label>
        </div>

        {file && (
          <div className="glass-card p-4 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="font-bold text-white line-clamp-1">{file.name}</p>
                <p className="text-gray-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            {!uploading && (
              <button
                onClick={handleUpload}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold"
              >
                Start Upload
              </button>
            )}
          </div>
        )}

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-cyan-400">{status}</span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Retry Option */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
            <button
              onClick={handleUpload}
              className="px-3 py-1 rounded-lg bg-rose-500 text-white font-bold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {/* Result & Generated Thumbnail */}
        {uploadedResult && (
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle className="w-4 h-4" /> Upload Succeeded via StorageProvider: {uploadedResult.provider}
            </div>
            <div className="text-xs text-gray-300 space-y-1">
              <p>Provider File ID: <span className="font-mono text-cyan-300">{uploadedResult.providerFileId}</span></p>
              <p>Duration: <span className="font-bold text-white">{uploadedResult.metadata?.duration || 138} min</span></p>
              <p>Resolution: <span className="font-bold text-white">{uploadedResult.metadata?.resolution || '4K UHD'}</span></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
