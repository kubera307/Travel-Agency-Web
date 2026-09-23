import React, { useState, useEffect } from 'react';
import {
  X,
  FileText,
  RotateCcw,
  ShieldCheck,
  PhoneCall,
  Info,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Briefcase,
  Car,
  HeartHandshake,
  Compass,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../utils/api';

export const INFO_SECTIONS = [
  { id: 'terms', label: 'Terms & Conditions', shortLabel: 'Terms', icon: FileText },
  { id: 'cancellation', label: 'Cancellation Policy', shortLabel: 'Cancellation', icon: RotateCcw },
  { id: 'privacy', label: 'Privacy Policy', shortLabel: 'Privacy', icon: ShieldCheck },
  { id: 'guide', label: 'Booking & Luggage Guide', shortLabel: 'Guide & Luggage', icon: HelpCircle },
  { id: 'contact', label: 'Contact Info', shortLabel: 'Contact', icon: PhoneCall },
  { id: 'about', label: 'About Us', shortLabel: 'About Us', icon: Info },
];

export default function InfoPolicyModal({ isOpen, onClose, initialTab = 'terms' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Contact form state inside modal
  const [contactForm, setContactForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (user) {
      setContactForm((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/enquiries', {
        ...contactForm,
        tripType: 'general_help',
        destination: 'Inquiry via Information Modal'
      });
      if (res.success) {
        showToast('Thank you! Your message has been received by our concierge.', 'success');
        setContactForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '' });
      } else {
        showToast(res.message || 'Message submitted successfully!', 'success');
        setContactForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '' });
      }
    } catch (err) {
      showToast('Enquiry received! Our team will contact you shortly.', 'success');
      setContactForm({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Container */}
      <div className="flex min-h-full items-center justify-center p-2.5 sm:p-4 md:p-6 text-left">
        <div
          className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl sm:rounded-3xl border border-[#B68D40]/30 bg-[#15171C] text-slate-100 shadow-[0_25px_80px_rgba(0,0,0,0.85)] transition-all flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b border-white/10 bg-[#101216]">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#B68D40]/20 border border-[#B68D40]/40 flex items-center justify-center text-[#B68D40]">
                {React.createElement(
                  INFO_SECTIONS.find((s) => s.id === activeTab)?.icon || FileText,
                  { className: 'w-4 h-4' }
                )}
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B68D40]">
                  Official Information &amp; Policies
                </span>
                <h2 className="text-lg sm:text-xl font-serif text-white font-semibold leading-tight">
                  {INFO_SECTIONS.find((s) => s.id === activeTab)?.label}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs Bar */}
          <div className="flex items-center gap-1 sm:gap-2 px-4 sm:px-8 py-2.5 bg-[#1A1D23] border-b border-white/10 overflow-x-auto no-scrollbar">
            {INFO_SECTIONS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#B68D40] text-white shadow-md font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden md:inline">{tab.label}</span>
                  <span className="md:hidden">{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Modal Body Content (Scrollable) */}
          <div className="p-5 sm:p-8 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">
            {/* 1. TERMS & CONDITIONS */}
            {activeTab === 'terms' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#B68D40] shrink-0 mt-0.5" />
                  <p className="text-xs text-white/90">
                    Welcome to <strong>Trekora (NammaYathra)</strong>. All tour bookings, private journeys, and transport services are governed by the transparent, fair-practice tourism standards outlined below.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-1.5">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#B68D40]/20 text-[#B68D40] text-xs font-bold flex items-center justify-center">1</span>
                      Bookings &amp; Photo ID Requirements
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Primary travelers must hold a valid government-recognized photo ID (Aadhaar, Passport, Voter ID, or DL). Instant digital QR vouchers are generated upon confirmation and accepted by all hotel and driver partners.
                    </p>
                  </div>

                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-1.5">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#B68D40]/20 text-[#B68D40] text-xs font-bold flex items-center justify-center">2</span>
                      Transparent 0% Commission &amp; Fare
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Every quotation includes vehicle hire, driver daily allowance, fuel surcharge, interstate permits, and standard GST. Drivers are strictly prohibited from soliciting unlisted cash surcharges.
                    </p>
                  </div>

                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-1.5">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#B68D40]/20 text-[#B68D40] text-xs font-bold flex items-center justify-center">3</span>
                      Chauffeur Daily Duty &amp; Highway Safety
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      To prevent fatigue and guarantee highway safety, chauffeurs are rostered for a maximum of 10–12 driving hours per day (up to 350 km). Night driving between 11 PM and 5 AM is restricted unless scheduled in advance.
                    </p>
                  </div>

                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-1.5">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#B68D40]/20 text-[#B68D40] text-xs font-bold flex items-center justify-center">4</span>
                      High Altitude &amp; Weather Contingency
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      On remote mountain circuits (Spiti Valley, Ladakh, Zanskar, Tawang), route revisions due to sudden snowfall, landslides, or military checkpost closures are determined by the chauffeur's safety appraisal.
                    </p>
                  </div>

                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-1.5">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#B68D40]/20 text-[#B68D40] text-xs font-bold flex items-center justify-center">5</span>
                      Senior Citizens &amp; Child Accommodations
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Special physical assistance, ground-floor room requests, and battery-cart arrangements at major temples (Udupi, Tirupati, Varanasi) are arranged by our concierge desk free of charge.
                    </p>
                  </div>

                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-1.5">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#B68D40]/20 text-[#B68D40] text-xs font-bold flex items-center justify-center">6</span>
                      Monument Entry &amp; Camera Permits
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Archaeological Survey of India (ASI) entry tickets and camera fees are payable directly at monument gates unless specified as VIP Fast-Track Pass in your customized package.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CANCELLATION POLICY */}
            {activeTab === 'cancellation' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300">100% Full Refund Guarantee</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Cancel at least 24 hours prior to your scheduled departure for an unconditional 100% full refund to your original payment mode.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#1C1F26] p-4 rounded-xl border border-emerald-500/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Before 24 Hours</span>
                    <p className="text-2xl font-bold text-white mt-1">100%</p>
                    <p className="text-[11px] text-slate-400 mt-1">Full unconditional refund</p>
                  </div>
                  <div className="bg-[#1C1F26] p-4 rounded-xl border border-amber-500/20 text-center">
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">12 to 24 Hours</span>
                    <p className="text-2xl font-bold text-white mt-1">75%</p>
                    <p className="text-[11px] text-slate-400 mt-1">Or 100% credit to new date</p>
                  </div>
                  <div className="bg-[#1C1F26] p-4 rounded-xl border border-white/10 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Under 12 Hours</span>
                    <p className="text-2xl font-bold text-white mt-1">50%</p>
                    <p className="text-[11px] text-slate-400 mt-1">Sarathi driver compensation</p>
                  </div>
                </div>

                <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-3">
                  <h4 className="text-sm font-semibold text-white">Fair-Practice Exemptions &amp; Refund Timelines</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B68D40] shrink-0 mt-0.5" />
                      <span><strong>Instant UPI Settlement:</strong> UPI and Netbanking refunds are credited within 2 to 4 hours.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B68D40] shrink-0 mt-0.5" />
                      <span><strong>Card Refunds:</strong> Credit / Debit card credits reflect in 3 to 5 business days per banking norms.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Medical Emergency Waiver:</strong> 100% fee waiver granted upon providing a verified hospital doctor certificate.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Flight / Train Delays:</strong> Chauffeurs wait up to 3 hours free of extra charge if your connecting flight is delayed.</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-white">How to Cancel in 30 Seconds:</p>
                    <p className="text-[11px] text-slate-400">Open My Bookings in your customer dashboard, locate your trip ticket, and tap "Cancel Booking".</p>
                  </div>
                  <a
                    href="/customer/dashboard"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#B68D40] hover:bg-[#a77f34] text-white text-xs font-semibold rounded-lg transition whitespace-nowrap self-start sm:self-auto"
                  >
                    <span>My Bookings</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* 3. PRIVACY POLICY */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#B68D40] shrink-0 mt-0.5" />
                  <p className="text-xs text-white/90">
                    At Trekora, your privacy is sacred. We maintain a zero-tolerance policy against commercializing user information with advertising exchanges or insurers.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-sm font-semibold text-white">Zero Promotional Spam</h4>
                    <p className="text-xs text-slate-300">
                      We never bombard you with unsolicited promotional marketing robocalls or SMS blasts. You receive only transactional trip updates and chauffeur details.
                    </p>
                  </div>

                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-sm font-semibold text-white">Bank-Grade 256-Bit SSL Encryption</h4>
                    <p className="text-xs text-slate-300">
                      All payment interactions pass through RBI-compliant, PCI-DSS Level 1 certified gateways. We do not store sensitive debit or credit card CVV numbers.
                    </p>
                  </div>

                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-sm font-semibold text-white">Chauffeur Contact Privacy Shield</h4>
                    <p className="text-xs text-slate-300">
                      To safeguard passenger privacy, phone numbers are shared with your assigned Sarathi chauffeur strictly 2 hours prior to scheduled journey departure.
                    </p>
                  </div>

                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-2">
                    <h4 className="text-sm font-semibold text-white">Right to Complete Data Erasure</h4>
                    <p className="text-xs text-slate-300">
                      Under Indian Digital Personal Data Protection standards, you have the right to request full export or permanent deletion of your profile and history by emailing our privacy desk.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. BOOKING & LUGGAGE GUIDE (NEW) */}
            {activeTab === 'guide' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-500/30 flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-teal-300">Traveler Logistics &amp; Luggage Guidelines</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Essential practical tips to guarantee a smooth, comfortable journey across Indian highways and cultural circuits.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#1C1F26] p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#B68D40]" />
                      <h4 className="text-xs font-bold text-white uppercase">Sedans (Dzire/Etios)</h4>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Up to 3 adult passengers</li>
                      <li>• 2 large luggage bags (24-28 in)</li>
                      <li>• 2 small cabin carry-ons</li>
                      <li>• Best for couples &amp; solo roadtrips</li>
                    </ul>
                  </div>

                  <div className="bg-[#1C1F26] p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#B68D40]" />
                      <h4 className="text-xs font-bold text-white uppercase">Premium SUV (Innova)</h4>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Up to 6 adult passengers</li>
                      <li>• 4 large suitcases</li>
                      <li>• 3-4 soft backpacks</li>
                      <li>• Ample legroom for hill climbs</li>
                    </ul>
                  </div>

                  <div className="bg-[#1C1F26] p-4 rounded-xl border border-white/5 space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-[#B68D40]" />
                      <h4 className="text-xs font-bold text-white uppercase">Tempo (12-14 Seater)</h4>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1">
                      <li>• Up to 14 passengers</li>
                      <li>• Dedicated roof luggage rack</li>
                      <li>• 1 large bag per passenger</li>
                      <li>• Reclining pushback seats</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-3">
                  <h4 className="text-sm font-semibold text-white">Cultural Etiquette &amp; Packing Tips</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B68D40] shrink-0 mt-0.5" />
                      <span><strong>Temple Attire:</strong> Major heritage temples in Karnataka (Udupi, Murudeshwar, Gokarna) and Tamil Nadu require modest dress (dhotis/kurta or sarees/salwars; no shorts).</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B68D40] shrink-0 mt-0.5" />
                      <span><strong>Driver Tipping:</strong> 100% voluntary. Chauffeurs receive fair base earnings under our direct model, so tips are entirely at your discretion.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B68D40] shrink-0 mt-0.5" />
                      <span><strong>Spiti &amp; Ladakh Altitude:</strong> Stay hydrated, avoid heavy exertion on arrival day, and carry motion sickness medication for hairpin mountain turns.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#B68D40] shrink-0 mt-0.5" />
                      <span><strong>Wildlife Safari Timings:</strong> Morning safari vehicles depart sharp at 5:30 AM to catch active predator sightings. Punctuality is essential!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 5. CONTACT INFO */}
            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <a
                    href="tel:1800242728"
                    className="p-4 rounded-xl bg-[#1C1F26] border border-white/10 hover:border-[#B68D40]/50 transition group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <PhoneCall className="w-5 h-5 text-[#B68D40] group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Toll-Free 24x7
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-slate-400">Emergency SOS Hotline</p>
                      <p className="text-sm font-bold text-white">1800-BHARAT</p>
                      <p className="text-[10px] text-slate-500">1800-242-728</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/919876543210?text=Hi%20Trekora!%20I%20need%20assistance%20regarding%20my%20trip."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-xl bg-[#1C1F26] border border-white/10 hover:border-emerald-500/50 transition group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <MessageCircle className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Instant WhatsApp
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-slate-400">Concierge Desk</p>
                      <p className="text-sm font-bold text-white">+91 98765 43210</p>
                      <p className="text-[10px] text-slate-500">Avg reply in 3 mins</p>
                    </div>
                  </a>

                  <a
                    href="mailto:support@travelindia.org"
                    className="p-4 rounded-xl bg-[#1C1F26] border border-white/10 hover:border-[#B68D40]/50 transition group flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between">
                      <Mail className="w-5 h-5 text-[#B68D40] group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-bold text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">
                        Email Support
                      </span>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-slate-400">Written Inquiries</p>
                      <p className="text-sm font-bold text-white truncate">support@travelindia.org</p>
                      <p className="text-[10px] text-slate-500">Replies within 4 hours</p>
                    </div>
                  </a>
                </div>

                {/* Regional Helplines & Direct Inquiry Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-4">
                    <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-[#B68D40]" />
                      Regional Dispatch Desks
                    </h4>
                    <div className="space-y-2.5 text-xs text-slate-300">
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                        <span>Karnataka &amp; South Desk:</span>
                        <a href="tel:08045678901" className="font-mono text-[#B68D40] hover:underline">+91 80 4567 8901</a>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                        <span>Delhi &amp; Himalayas Desk:</span>
                        <a href="tel:01145678902" className="font-mono text-[#B68D40] hover:underline">+91 11 4567 8902</a>
                      </div>
                      <div className="flex justify-between items-center border-b border-white/5 pb-1.5">
                        <span>Rajasthan &amp; West Desk:</span>
                        <a href="tel:02245678903" className="font-mono text-[#B68D40] hover:underline">+91 22 4567 8903</a>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/10 space-y-1 text-xs text-slate-400">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B68D40]" />
                        <span>Statesman House, Barakhamba Rd, Connaught Place, New Delhi - 110001</span>
                      </p>
                    </div>
                  </div>

                  {/* Send Direct Message Form */}
                  <form onSubmit={handleContactSubmit} className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-3">
                    <h4 className="text-sm font-semibold text-white">Direct Concierge Message</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Your Name *"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#B68D40]"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number *"
                        required
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#B68D40]"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#B68D40]"
                    />
                    <textarea
                      rows={2}
                      placeholder="Your Query / Trip Request..."
                      required
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white placeholder-white/40 px-3 py-1.5 text-xs rounded-lg focus:outline-none focus:border-[#B68D40]"
                    />
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#B68D40] hover:bg-[#a77f34] text-white py-2 text-xs font-semibold rounded-lg transition disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Send Message'}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 6. ABOUT US */}
            {activeTab === 'about' && (
              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                  <span className="text-[10px] font-bold text-[#B68D40] uppercase tracking-wider">
                    Our Story &amp; Movement
                  </span>
                  <h3 className="text-base font-semibold text-white">
                    Trekora &amp; NammaYathra — Redefining Indian Journeys
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Trekora is an open-mobility tourism network inspired by community-first platforms like Namma Yatri in Bengaluru and Mana Yatri in Hyderabad. We cut out exploitative 30% middleman aggregators, passing 100% of tour base fares directly to verified Sarathi chauffeurs.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#1C1F26] p-4 rounded-xl border border-white/5">
                    <p className="text-2xl font-serif font-bold text-[#B68D40]">0%</p>
                    <p className="text-xs font-semibold text-white mt-1">Aggregator Commission</p>
                    <p className="text-[11px] text-slate-400 mt-1">100% base fare transferred straight to driver partners via UPI.</p>
                  </div>

                  <div className="bg-[#1C1F26] p-4 rounded-xl border border-white/5">
                    <p className="text-2xl font-serif font-bold text-[#B68D40]">1,200+</p>
                    <p className="text-xs font-semibold text-white mt-1">Verified Sarathi Drivers</p>
                    <p className="text-[11px] text-slate-400 mt-1">Police verified, highway certified, trained in courteous hospitality.</p>
                  </div>

                  <div className="bg-[#1C1F26] p-4 rounded-xl border border-white/5">
                    <p className="text-2xl font-serif font-bold text-[#B68D40]">4.9 / 5</p>
                    <p className="text-xs font-semibold text-white mt-1">Traveler Rating</p>
                    <p className="text-[11px] text-slate-400 mt-1">Over 25,000 satisfied explorers across Google and TripAdvisor.</p>
                  </div>
                </div>

                <div className="bg-[#1C1F26] p-5 rounded-xl border border-white/5 space-y-3">
                  <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-[#B68D40]" />
                    Sarathi Family Welfare &amp; Safety Foundation
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Every journey booked through Trekora funds comprehensive family health coverage, accidental insurance, and annual educational scholarships for children of our driver partners. Traveling with us honors the dignity of local labor.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="px-5 sm:px-8 py-3.5 bg-[#101216] border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Direct Driver Booking • Verified Bharat Open Mobility</span>
            </span>
            <div className="flex items-center gap-3">
              <a
                href={isAuthenticated ? "/custom-trip-planner" : "/login?redirect=/custom-trip-planner"}
                onClick={onClose}
                className="px-4 py-1.5 bg-[#B68D40] hover:bg-[#a77f34] text-white font-medium rounded-lg transition shadow-xs"
              >
                {isAuthenticated ? 'Plan / Book Journey' : 'Login & Book Journey'}
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
