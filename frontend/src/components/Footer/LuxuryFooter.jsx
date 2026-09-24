import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Instagram, 
  Youtube, 
  Facebook, 
  Linkedin, 
  Twitter 
} from 'lucide-react';
import { NammayatraLogoIcon } from '../Navbar/LuxuryNavbar';
import { useToast } from '../../context/ToastContext';

export default function LuxuryFooter() {
  const [email, setEmail] = useState('');
  const toast = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      toast?.showSuccess ? toast.showSuccess('Thank you for subscribing to NammaYatra!') : alert('Thank you for subscribing!');
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#131417] text-white pt-14 pb-10 border-t border-white/10 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          
          {/* Col 1: Brand & Socials (Cols 1-4) */}
          <div className="lg:col-span-4 space-y-3.5">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <NammayatraLogoIcon className="w-8 h-6 text-[#B68D40]" />
              <div className="flex flex-col">
                <span className="text-xl tracking-tight font-semibold text-white leading-none font-serif">
                  NammaYatra
                </span>
                <span className="text-[7.5px] tracking-[0.24em] font-sans uppercase text-[#B68D40] font-medium mt-1">
                  Explore India Differently
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/60 font-light leading-relaxed max-w-xs">
              Curated travel experiences across India. For curious minds and meaningful travellers.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#B68D40] hover:text-white text-white/70 flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#B68D40] hover:text-white text-white/70 flex items-center justify-center transition"
                aria-label="YouTube"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#B68D40] hover:text-white text-white/70 flex items-center justify-center transition"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#B68D40] hover:text-white text-white/70 flex items-center justify-center transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-[#B68D40] hover:text-white text-white/70 flex items-center justify-center transition"
                aria-label="X / Twitter"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Col 2: Explore (Cols 5-6) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-white/60 font-light">
              <li><Link to="/destinations" className="hover:text-white transition">Destinations</Link></li>
              <li><Link to="/tours" className="hover:text-white transition">Tours</Link></li>
              <li><Link to="/experiences" className="hover:text-white transition">Experiences</Link></li>
              <li><Link to="/upcoming-departures" className="hover:text-white transition">Upcoming Departures</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Travel Journal</Link></li>
            </ul>
          </div>

          {/* Col 3: Support (Cols 7-8) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-white/60 font-light">
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
              <li><Link to="/feedback" className="hover:text-white transition text-[#B68D40]">Share Feedback</Link></li>
              <li><Link to="/booking-guide" className="hover:text-white transition">Booking &amp; Luggage Guide</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition">FAQs</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms &amp; Conditions</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-white transition">Cancellation Policy</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Col 4: Company (Cols 9-10) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-white/60 font-light">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition">Our Services</Link></li>
              <li><Link to="/why-choose-us" className="hover:text-white transition">Why Travel With Us</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Careers</Link></li>
            </ul>
          </div>

          {/* Col 5: Newsletter (Cols 11-12) */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="text-xs font-semibold text-white tracking-wide">
              Subscribe to Our Newsletter
            </h4>
            <p className="text-xs text-white/60 font-light leading-relaxed">
              Get travel inspiration, offers and updates.
            </p>

            <form onSubmit={handleSubscribe} className="relative pt-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full bg-white/5 border border-white/15 text-white placeholder-white/40 px-3 py-2 pr-9 text-xs rounded-lg focus:outline-none focus:border-[#B68D40] transition"
              />
              <button
                type="submit"
                aria-label="Submit newsletter"
                className="absolute right-1 top-2 w-7 h-7 rounded-md bg-[#B68D40] text-white flex items-center justify-center hover:bg-[#a77f34] transition shadow-xs"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/40 font-light">
          <p>© 2026 NammaYatra. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
}
