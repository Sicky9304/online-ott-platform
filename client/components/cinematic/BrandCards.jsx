'use client';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const brands = [
  { name: 'Disney', logo: 'DISNEY', color: 'from-blue-600/30 to-indigo-900/60', hoverGlow: 'hover:shadow-blue-500/40' },
  { name: 'Pixar', logo: 'PIXAR', color: 'from-amber-600/30 to-orange-900/60', hoverGlow: 'hover:shadow-amber-500/40' },
  { name: 'Marvel', logo: 'MARVEL', color: 'from-red-600/30 to-rose-900/60', hoverGlow: 'hover:shadow-red-500/40' },
  { name: 'Star Wars', logo: 'STAR WARS', color: 'from-cyan-600/30 to-blue-900/60', hoverGlow: 'hover:shadow-cyan-500/40' },
  { name: 'Nat Geo', logo: 'NAT GEO', color: 'from-yellow-600/30 to-amber-900/60', hoverGlow: 'hover:shadow-yellow-500/40' },
  { name: 'Hotstar Specials', logo: 'SPECIALS', color: 'from-purple-600/30 to-pink-900/60', hoverGlow: 'hover:shadow-purple-500/40' }
];

export default function BrandCards() {
  const router = useRouter();

  const handleBrandClick = (name) => {
    const category = name === 'Hotstar Specials' ? 'Specials' : name;
    router.push(`/search?category=${encodeURIComponent(category)}`);
  };

  return (
    <div className="w-full px-6 sm:px-12 md:px-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 my-12 md:my-16 select-none">
      {brands.map((brand) => (
        <motion.div
          key={brand.name}
          onClick={() => handleBrandClick(brand.name)}
          whileHover={{ scale: 1.06, y: -6 }}
          transition={{ duration: 0.3 }}
          className={`relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer border border-white/15 bg-gradient-to-br ${brand.color} p-5 flex items-center justify-center shadow-xl ${brand.hoverGlow} backdrop-blur-md group transition-all`}
        >
          <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />

          {/* Shiny Studio Brand Logo */}
          <span className="relative z-10 text-lg sm:text-xl md:text-2xl font-black tracking-widest text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] group-hover:scale-110 transition-transform">
            {brand.logo}
          </span>

          {/* Light Reflection Sweep Effect */}
          <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12 group-hover:left-full transition-all duration-1000" />
        </motion.div>
      ))}
    </div>
  );
}
