'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Languages } from 'lucide-react';

const languages = [
  { name: 'Hindi Dubbed', native: 'हिन्दी', gradient: 'from-amber-600 to-orange-900', lang: 'Hindi Dubbed' },
  { name: 'South Hindi Dubbed', native: 'தெலுங்கு', gradient: 'from-rose-600 to-red-900', lang: 'Hindi Dubbed (South)' },
  { name: 'Korean Hindi Dubbed', native: '한국어', gradient: 'from-purple-600 to-indigo-900', lang: 'Hindi Dubbed (Korean)' },
  { name: 'Bhojpuri', native: 'भोजपुरी', gradient: 'from-emerald-600 to-teal-900', lang: 'Bhojpuri' }
];

export default function LanguageRow() {
  return (
    <div className="w-full px-4 sm:px-8 md:px-20 my-8 md:my-16 space-y-3 sm:space-y-4 select-none">
      <h2 className="text-xl sm:text-3xl font-black text-white flex items-center gap-2.5 tracking-tight">
        <Languages className="w-5 h-5 sm:w-7 sm:h-7 text-cyan-400" />
        Popular Languages
      </h2>

      {/* Larger layout cards: 2 cols on mobile, 4 cols on desktop for bigger layout size */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {languages.map((item) => (
          <Link key={item.name} href={`/search?language=${item.lang}`}>
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
              className={`relative aspect-[16/9] rounded-2xl overflow-hidden cursor-pointer border border-white/10 bg-gradient-to-br ${item.gradient} p-6 flex flex-col items-center justify-center text-center shadow-lg hover:border-cyan-400/80 hover:shadow-[0_0_35px_rgba(6,182,212,0.3)] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] group`}
            >
              {/* Native script label — extremely large and centered */}
              <span className="text-2xl sm:text-4xl md:text-6xl font-black text-white tracking-wide group-hover:text-cyan-300 transition-colors duration-300">
                {item.native}
              </span>
              {/* English name label — styled underneath */}
              <span className="text-[10px] sm:text-xs md:text-sm font-black text-white/80 group-hover:text-white uppercase tracking-widest mt-1 sm:mt-2 transition-colors duration-300">
                {item.name}
              </span>
              {/* Subtle glass reflection overlay */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white-[0.03] transition-colors duration-300 pointer-events-none" />
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
