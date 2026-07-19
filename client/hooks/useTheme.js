'use client';
import { useState, useEffect, createContext, useContext } from 'react';

const ThemeContext = createContext();

export const fontOptions = [
  { id: 'geist', name: 'Geist Sans (Modern Clean)', family: "'Geist', system-ui, -apple-system, sans-serif", url: 'https://fonts.googleapis.com/css2?family=Geist:wght@300;400;600;800;900&display=swap' },
  { id: 'inter', name: 'Inter (Cinematic)', family: "'Inter', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;800;900&display=swap' },
  { id: 'outfit', name: 'Outfit (Luxury Display)', family: "'Outfit', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800;900&display=swap' },
  { id: 'roboto', name: 'Roboto (Ultra Bold)', family: "'Roboto', sans-serif", url: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700;900&display=swap' },
  { id: 'cinzel', name: 'Cinzel (Royal Serif)', family: "'Cinzel', serif", url: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800;900&display=swap' },
  { id: 'geist-mono', name: 'Geist Mono (Tech Code)', family: "'Geist Mono', monospace", url: 'https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;600;800&display=swap' }
];

export const colorOptions = [
  { id: 'cyan', name: 'Neon Cyan', primary: '#06b6d4', secondary: '#38bdf8', shadow: 'rgba(6, 182, 212, 0.4)' },
  { id: 'violet', name: 'Electric Violet', primary: '#8b5cf6', secondary: '#a855f7', shadow: 'rgba(139, 92, 246, 0.4)' },
  { id: 'gold', name: 'Sunset Gold', primary: '#f59e0b', secondary: '#fbbf24', shadow: 'rgba(245, 158, 11, 0.4)' },
  { id: 'emerald', name: 'Matrix Emerald', primary: '#10b981', secondary: '#34d399', shadow: 'rgba(16, 185, 129, 0.4)' },
  { id: 'ruby', name: 'Ruby Crimson', primary: '#f43f5e', secondary: '#fb7185', shadow: 'rgba(244, 63, 94, 0.4)' }
];

export const bgThemeOptions = [
  { id: 'dark-slate', name: 'Ultra Dark Slate', bg: '#050508' },
  { id: 'midnight-cyber', name: 'Midnight Cyber', bg: '#020617' },
  { id: 'deep-space', name: 'Deep Space Black', bg: '#000000' },
  { id: 'obsidian-purple', name: 'Obsidian Night', bg: '#090514' }
];

export function ThemeProvider({ children }) {
  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);
  const [selectedColor, setSelectedColor] = useState(colorOptions[0]);
  const [selectedBg, setSelectedBg] = useState(bgThemeOptions[0]);

  useEffect(() => {
    const savedFont = localStorage.getItem('cineverse_font');
    const savedColor = localStorage.getItem('cineverse_color');
    const savedBg = localStorage.getItem('cineverse_bg');

    if (savedFont) {
      const found = fontOptions.find((f) => f.id === savedFont);
      if (found) setSelectedFont(found);
    }
    if (savedColor) {
      const found = colorOptions.find((c) => c.id === savedColor);
      if (found) setSelectedColor(found);
    }
    if (savedBg) {
      const found = bgThemeOptions.find((b) => b.id === savedBg);
      if (found) setSelectedBg(found);
    }
  }, []);

  // Dynamically Apply CSS Variables & Inject Web Fonts
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Inject Google Font link if not present
    let fontLink = document.getElementById('dynamic-google-font');
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = 'dynamic-google-font';
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    fontLink.href = selectedFont.url;

    // Apply CSS Variables
    const root = document.documentElement;
    root.style.setProperty('--font-main', selectedFont.family);
    root.style.setProperty('--accent-cyan', selectedColor.primary);
    root.style.setProperty('--accent-secondary', selectedColor.secondary);
    root.style.setProperty('--accent-shadow', selectedColor.shadow);
    root.style.setProperty('--bg-main', selectedBg.bg);
    document.body.style.fontFamily = selectedFont.family;
    document.body.style.backgroundColor = selectedBg.bg;

    // Save to LocalStorage
    localStorage.setItem('cineverse_font', selectedFont.id);
    localStorage.setItem('cineverse_color', selectedColor.id);
    localStorage.setItem('cineverse_bg', selectedBg.id);
  }, [selectedFont, selectedColor, selectedBg]);

  return (
    <ThemeContext.Provider value={{
      selectedFont,
      setSelectedFont,
      selectedColor,
      setSelectedColor,
      selectedBg,
      setSelectedBg
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
