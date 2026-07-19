'use client';
import { usePathname } from 'next/navigation';
import HotstarSidebar from './HotstarSidebar';
import Footer from './Footer';

export default function MainLayoutWrapper({ children }) {
  const pathname = usePathname();
  const isWatchPage = pathname && pathname.startsWith('/watch/');

  // Import hooks to determine admin status
  const { isAdmin } = require('../../hooks/useAuth').useAuth();

  if (isWatchPage) {
    return (
      <div className="flex-1 w-full min-h-screen flex flex-col bg-black">
        <main className="flex-1 w-full relative">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // If user is admin, completely hide sidebar offsets and render clean fullscreen page content layout
  if (isAdmin) {
    return (
      <div className="flex-1 relative z-20 w-full min-h-screen flex flex-col">
        <main className="flex-1 w-full relative">
          {children}
        </main>
      </div>
    );
  }

  return (
    <>
      <HotstarSidebar />
      <div className="flex-1 pl-0 md:pl-20 pb-20 md:pb-0 relative z-20 w-full min-h-screen flex flex-col">
        <main className="flex-1 w-full relative">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
