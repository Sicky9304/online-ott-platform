import './globals.css';
import { AuthProvider } from '../hooks/useAuth';
import { ThemeProvider } from '../hooks/useTheme';
import HotstarSidebar from '../components/layout/HotstarSidebar';
import Footer from '../components/layout/Footer';
import MouseSpotlight from '../components/cinematic/MouseSpotlight';
import AuroraBackground from '../components/cinematic/AuroraBackground';
import ParticleCanvas from '../components/cinematic/ParticleCanvas';
import PageTransition from '../components/layout/PageTransition';
import ScrollProgress from '../components/layout/ScrollProgress';
import MainLayoutWrapper from '../components/layout/MainLayoutWrapper';

export const metadata = {
  title: 'CineVerse | Premium Hotstar Clone Streaming Experience',
  description: 'Stream premium 4K UHD movies and original series with custom audio, subtitles, and dynamic cloud storage.',
  openGraph: {
    title: 'CineVerse | Premium Hotstar Clone',
    description: 'An award-winning cinematic streaming experience.',
    images: ['https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80']
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Geist:wght@300;400;600;800;900&family=Inter:wght@400;600;800;900&family=Outfit:wght@400;600;800;900&family=Roboto:wght@400;700;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#050508] text-gray-100 antialiased min-h-screen flex flex-col selection:bg-cyan-500 selection:text-black">
        <ThemeProvider>
          <AuthProvider>
            {/* Top Glowing Gradient Scroll Reading Progress Bar */}
            <ScrollProgress />

            {/* Background Canvas Visuals */}
            <AuroraBackground />
            <ParticleCanvas />
            <MouseSpotlight />

            {/* Main Page Layout Wrapper */}
            <MainLayoutWrapper>
              <PageTransition>
                {children}
              </PageTransition>
            </MainLayoutWrapper>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
