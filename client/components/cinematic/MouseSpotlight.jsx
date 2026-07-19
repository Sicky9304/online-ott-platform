'use client';
import { useMousePosition } from '../../hooks/useMousePosition';

export default function MouseSpotlight() {
  const { x, y } = useMousePosition();

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px circle at ${x}px ${y}px, rgba(6, 182, 212, 0.08), rgba(139, 92, 246, 0.04) 40%, transparent 80%)`
      }}
    />
  );
}
