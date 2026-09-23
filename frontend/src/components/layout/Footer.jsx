import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, PhoneCall, Mail, MapPin, MessageCircle, Heart, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0B192C] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Ethos */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-[#0B192C] rounded-[14px] flex items-center justify-center text-lg">
                  🧭
                </div>
              </div>
              <div>
                <span className="font-display font-black text-2xl text-white">TRAVEL </span>
                <span className="font-display font-black text-2xl text-orange-500">INDIA</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              India's premier direct-to-driver travel platform. We connect you directly with verified
              local chauffeurs and handpicked boutique stays across 28 states with 100% transparent pricing.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-3 py-1 rounded-full text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>0% Commission Model</span>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-950/80 text-amber-400 border border-amber-800/80 px-3 py-1 rounded-full text-xs font-semibold">
                <Award className="w-4 h-4" />
                <span>Verified Chauffeurs</span>
              </div>
            </div>
          </div>

          {/* Quick Links: Tours */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Tour Categories</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/tours?category=heritage" className="hover:text-amber-400 transition-colors">Royal Heritage &amp; Forts</Link></li>
              <li><Link to="/tours?category=spiritual" className="hover:text-amber-400 transition-colors">Spiritual &amp; Temple Ghats</Link></li>
              <li><Link to="/tours?category=adventure" className="hover:text-amber-400 transition-colors">Himalayan Treks &amp; Safaris</Link></li>
              <li><Link to="/tours?category=coastal" className="hover:text-amber-400 transition-colors">Backwaters &amp; Beaches</Link></li>
              <li><Link to="/tours?category=weekend" className="hover:text-amber-400 transition-colors">Weekend Road Trips</Link></li>
              <li><Link to="/tours?category=family" className="hover:text-amber-400 transition-colors">Family Special Tours</Link></li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Top Destinations</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/destinations/kashmir" className="hover:text-amber-400 transition-colors">Kashmir Valley</Link></li>
              <li><Link to="/destinations/himachal" className="hover:text-amber-400 transition-colors">Himachal Pradesh</Link></li>
              <li><Link to="/destinations/jaipur" className="hover:text-amber-400 transition-colors">Jaipur &amp; Rajasthan</Link></li>
              <li><Link to="/destinations/goa" className="hover:text-amber-400 transition-colors">Goa Coastline</Link></li>
              <li><Link to="/destinations/kerala" className="hover:text-amber-400 transition-colors">Kerala Backwaters</Link></li>
              <li><Link to="/destinations/ladakh" className="hover:text-amber-400 transition-colors">Leh &amp; Ladakh</Link></li>
            </ul>
          </div>

          {/* Support & Trust */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-4">Support &amp; Trust</h4>
            <ul className="space-y-2.5 text-xs text-slate-400 font-medium">
              <li><Link to="/why-choose-us" className="hover:text-amber-400 transition-colors">Why Choose Us</Link></li>
              <li><Link to="/faqs" className="hover:text-amber-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-amber-400 transition-colors">Cancellation &amp; Refunds</Link></li>
              <li><Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              <li className="pt-2">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-emerald-400 font-bold hover:underline"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: +91 98765 43210</span>
                </a>
              </li>
              <li className="pt-1">
                <a href="tel:1800-BHARAT" className="flex items-center gap-2 text-amber-400 font-bold hover:underline">
                  <PhoneCall className="w-4 h-4" />
                  <span>1800-BHARAT (24x7 Helpline)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NammaYathra. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Verified Chauffeur Network</span>
            <span>100% Direct Driver Pricing</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
