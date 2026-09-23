import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import LuxuryNavbar from '../Navbar/LuxuryNavbar';
import LuxuryFooter from '../Footer/LuxuryFooter';
import FloatingCompareBar from '../common/FloatingCompareBar';
import { MessageCircle } from 'lucide-react';

export default function PublicLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E7] text-[#1D1B18] selection:bg-[#B99762] selection:text-white relative font-sans">
      <LuxuryNavbar />
      <main className={`flex-1 ${isHome ? '' : 'pt-20'}`}>
        <Outlet />
      </main>
      <FloatingCompareBar />
      <LuxuryFooter />

      {/* Floating Quiet Concierge WhatsApp Widget */}
      <aside aria-label="Concierge Assistance" className="fixed bottom-6 right-6 z-30 flex items-center gap-3 group">
        <div className="hidden sm:flex bg-[#1D1B18] text-[#F7F1E7] text-[11px] font-medium tracking-wide px-3 py-1.5 shadow-xl border border-[#EFE4D2]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none items-center gap-1.5">
          <span>Concierge Desk</span>
        </div>
        <a
          href="https://wa.me/919876543210?text=Hi%20Trekora!%20I%20would%20like%20assistance%20planning%20my%20journey."
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-[#131417] hover:bg-[#B68D40] text-white border border-[#B68D40]/40 shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 rounded-full"
          title="Chat with a Trekora Travel Designer"
        >
          <MessageCircle className="w-5 h-5 text-[#B68D40] group-hover:text-white transition-colors" />
        </a>
      </aside>
    </div>
  );
}
