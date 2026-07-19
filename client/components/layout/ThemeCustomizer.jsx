'use client';
import { fontOptions, colorOptions, bgThemeOptions, useTheme } from '../../hooks/useTheme';
import { Type, Paintbrush, Moon, Check, Settings } from 'lucide-react';

export default function ThemeCustomizer() {
  const {
    selectedFont, setSelectedFont,
    selectedColor, setSelectedColor,
    selectedBg, setSelectedBg
  } = useTheme();

  return (
    <div className="w-full glass-panel p-6 sm:p-10 md:p-12 rounded-3xl border border-white/15 space-y-8 shadow-2xl">
      {/* Settings Header */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-6">
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/10">
          <Settings className="w-7 h-7 sm:w-9 sm:h-9" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">App Settings & Customization</h2>
          <p className="text-gray-300 text-xs sm:text-base font-semibold mt-1">Personalize font typography, neon accent lighting, and dark canvas themes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* 1. Font Family Picker */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-cyan-400 uppercase tracking-wider">
            <Type className="w-4 h-4 sm:w-5 sm:h-5" /> Font Typography
          </div>
          <div className="space-y-2">
            {fontOptions.map((font) => (
              <button
                key={font.id}
                onClick={() => setSelectedFont(font)}
                className={`w-full p-3.5 sm:p-4 rounded-2xl text-left text-xs sm:text-sm font-extrabold transition-all flex items-center justify-between cursor-pointer border ${
                  selectedFont.id === font.id
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-md shadow-cyan-500/20 scale-[1.01]'
                    : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                }`}
                style={{ fontFamily: font.family }}
              >
                <span>{font.name}</span>
                {selectedFont.id === font.id && <Check className="w-5 h-5 text-cyan-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Accent Color Picker */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-cyan-400 uppercase tracking-wider">
            <Paintbrush className="w-4 h-4 sm:w-5 sm:h-5" /> Neon Accent Lighting
          </div>
          <div className="grid grid-cols-5 gap-3">
            {colorOptions.map((color) => (
              <button
                key={color.id}
                onClick={() => setSelectedColor(color)}
                className={`h-14 sm:h-16 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                  selectedColor.id === color.id ? 'ring-4 ring-white scale-105 shadow-xl shadow-cyan-500/30' : 'hover:scale-105 opacity-80'
                }`}
                style={{ backgroundColor: color.primary }}
                title={color.name}
              >
                {selectedColor.id === color.id && <Check className="w-6 h-6 text-black stroke-[3]" />}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Dark Background Theme Presets */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-black text-cyan-400 uppercase tracking-wider">
            <Moon className="w-4 h-4 sm:w-5 sm:h-5" /> Dark Background Canvas
          </div>
          <div className="grid grid-cols-2 gap-3">
            {bgThemeOptions.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setSelectedBg(bg)}
                className={`p-4 rounded-2xl text-left text-xs sm:text-sm font-extrabold border transition-all cursor-pointer ${
                  selectedBg.id === bg.id
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-500/20 shadow-md shadow-cyan-500/20'
                    : 'border-white/10 text-gray-400 hover:text-white bg-black/40'
                }`}
              >
                {bg.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
