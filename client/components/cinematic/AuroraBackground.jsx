'use client';

export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40">
      {/* Cyan Light Blob */}
      <div 
        className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-cyan-500/20 blur-[140px] animate-aurora"
      />
      {/* Purple Light Blob */}
      <div 
        className="absolute top-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/15 blur-[160px] animate-aurora"
        style={{ animationDelay: '-10s' }}
      />
      {/* Deep Indigo Glow */}
      <div 
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-blue-600/15 blur-[150px] animate-aurora"
        style={{ animationDelay: '-15s' }}
      />
    </div>
  );
}
