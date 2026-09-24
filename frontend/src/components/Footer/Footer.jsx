import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Instagram, Facebook, Twitter, Youtube, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const destinations = ['Kashmir', 'Kerala', 'Rajasthan', 'Goa', 'Himachal', 'Karnataka'];
  const companyLinks = [
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'Offers', to: '/offers' },
    { label: 'Careers', to: '/' },
  ];
  const supportLinks = [
    { label: 'FAQ', to: '/faqs' },
    { label: 'Cancellation', to: '/cancellation-policy' },
    { label: 'Terms', to: '/terms' },
    { label: 'Privacy', to: '/privacy-policy' },
  ];

  return (
    <footer className="border-t border-slate-800 bg-[#0d1727] text-white">
      <div className="section-shell py-16">
        <div className="grid gap-10 pb-12 text-left md:grid-cols-2 lg:grid-cols-[1.5fr_0.8fr_0.8fr_0.8fr_1fr] lg:items-start">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d97706] text-white shadow-[0_14px_28px_rgba(217,119,6,0.24)]">
                <Compass className="h-5 w-5" />
              </div>
              <div className="leading-none text-left">
                <div className="text-2xl font-extrabold tracking-[-0.08em]">NammaYatra</div>
                <div className="mt-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f3b96a]">curated escapes</div>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-left text-sm leading-7 text-slate-300">
              Premium journeys across India and beyond — crafted for slow travel, unforgettable stays, and meaningful experiences.
            </p>

            <div className="mt-6 flex items-center gap-3">
              {[
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Facebook, href: 'https://facebook.com' },
                { icon: Twitter, href: 'https://twitter.com' },
                { icon: Youtube, href: 'https://youtube.com' },
              ].map(({ icon: Icon, href }) => (
                <a key={href} href={href} target="_blank" rel="noreferrer" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-900 text-slate-300 transition-colors hover:border-[#d97706] hover:bg-[#d97706] hover:text-white">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Explore</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li><Link to="/tours" className="hover:text-white">Tours</Link></li>
              <li><Link to="/destinations" className="hover:text-white">Destinations</Link></li>
              <li><Link to="/experiences" className="hover:text-white">Experiences</Link></li>
              <li><Link to="/offers" className="hover:text-white">Offers</Link></li>
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Company</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {companyLinks.map((item) => (
                <li key={item.label}><Link to={item.to} className="hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Support</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {supportLinks.map((item) => (
                <li key={item.label}><Link to={item.to} className="hover:text-white">{item.label}</Link></li>
              ))}
            </ul>
          </div>

          <div className="text-left">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Contact</h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-[#f3b96a]" /> +91 98765 43210</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-[#f3b96a]" /> hello@travelindia.in</li>
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-[#f3b96a]" /> Bengaluru, India</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-4 border-t border-slate-800 pt-6 text-sm text-slate-400 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Trusted by travellers across India</span>
          </div>
          <div className="flex items-center gap-3">
            <span>© 2026 NammaYatra</span>
            <span className="hidden h-1 w-1 rounded-full bg-slate-600 md:block" />
            <span>{destinations.slice(0, 3).join(' • ')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
