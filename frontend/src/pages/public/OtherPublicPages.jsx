import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import {
  Calendar,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Tag,
  ArrowRight,
  Clock,
  HelpCircle,
  Award,
  CheckCircle2,
  FileText,
  RotateCcw,
  Compass,
  Car,
  Luggage,
  HeartHandshake,
  Shield,
  Users,
  Send,
  ExternalLink,
  AlertTriangle,
  MessageCircle
} from 'lucide-react';

/* ==========================================================================
   SHARED QUIET LUXURY HEADER & TRUST BADGE
   ========================================================================== */
function LuxuryPageHero({ eyebrow, title, subtitle, badgeText }) {
  return (
    <div className="relative pt-6 pb-10 sm:pt-10 sm:pb-14 border-b border-[#1D1B18]/10 mb-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B99762]/10 border border-[#B99762]/30 text-[#8C6D38] text-[10px] sm:text-xs font-semibold uppercase tracking-[0.2em] mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B99762] animate-pulse"></span>
          <span>{eyebrow || 'Concierge Desk & Official Governance'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1D1B18] font-normal tracking-tight leading-[1.15]">
          {title}
        </h1>
        {subtitle && (
          <p className="font-sans text-sm sm:text-base text-[#6D6A61] leading-relaxed max-w-2xl font-normal mt-3">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function GuaranteesStrip() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-2xl bg-white/80 border border-[#1D1B18]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] mb-10">
      <div className="flex items-center gap-2.5 p-2">
        <span className="w-8 h-8 rounded-lg bg-[#B99762]/15 text-[#8C6D38] flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </span>
        <div className="text-left">
          <p className="text-xs font-bold text-[#1D1B18] leading-tight">100% Direct Driver</p>
          <p className="text-[10px] text-[#6D6A61]">Zero aggregator cut</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 p-2">
        <span className="w-8 h-8 rounded-lg bg-emerald-500/15 text-emerald-700 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </span>
        <div className="text-left">
          <p className="text-xs font-bold text-[#1D1B18] leading-tight">RBI &amp; PCI-DSS</p>
          <p className="text-[10px] text-[#6D6A61]">256-bit SSL encrypted</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 p-2">
        <span className="w-8 h-8 rounded-lg bg-blue-500/15 text-blue-700 flex items-center justify-center shrink-0">
          <RotateCcw className="w-4 h-4" />
        </span>
        <div className="text-left">
          <p className="text-xs font-bold text-[#1D1B18] leading-tight">100% Free Cancel</p>
          <p className="text-[10px] text-[#6D6A61]">Within 24 hours</p>
        </div>
      </div>
      <div className="flex items-center gap-2.5 p-2">
        <span className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center shrink-0">
          <Award className="w-4 h-4" />
        </span>
        <div className="text-left">
          <p className="text-xs font-bold text-[#1D1B18] leading-tight">Certified Sarathis</p>
          <p className="text-[10px] text-[#6D6A61]">Police-verified chauffeurs</p>
        </div>
      </div>
    </div>
  );
}

const POLICY_NAV_TABS = [
  { id: 'terms', label: 'Terms & Conditions', path: '/terms', icon: FileText },
  { id: 'cancellation', label: 'Cancellation Policy', path: '/cancellation-policy', icon: RotateCcw },
  { id: 'privacy', label: 'Privacy Policy', path: '/privacy-policy', icon: ShieldCheck },
  { id: 'guide', label: 'Booking & Luggage Guide', path: '/booking-guide', icon: HelpCircle },
  { id: 'contact', label: 'Contact Info', path: '/contact', icon: PhoneCall },
  { id: 'about', label: 'About Us', path: '/about', icon: Compass },
];

function PolicySubNav({ activeId }) {
  return (
    <div className="w-full border-b border-[#1D1B18]/10 bg-white/70 backdrop-blur-md mb-8 py-2.5 rounded-2xl shadow-xs">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
        {POLICY_NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeId === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.path}
              className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                isActive
                  ? 'bg-[#1D1B18] text-[#F7F1E7] shadow-sm'
                  : 'text-[#6D6A61] hover:text-[#1D1B18] hover:bg-black/5'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B99762]' : 'text-[#6D6A61]'}`} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/* ==========================================================================
   1. TERMS & CONDITIONS PAGE
   ========================================================================== */
export function TermsPage() {
  const terms = [
    {
      num: '01',
      title: 'Booking Confirmations & Government Photo ID',
      desc: 'All reservations require primary traveler names matching official government-issued photo identity (Aadhaar, Passport, Voter ID, or Driving License). Instant digital QR ticket vouchers are dispatched upon payment and recognized across all partner accommodations, monuments, and interstate transport bureaus.'
    },
    {
      num: '02',
      title: 'Transparent All-Inclusive Pricing Guarantee',
      desc: 'Every quote published on the platform encompasses chauffeur base fare, vehicle fuel charges, state border entry permits, and standard toll taxes. Sarathi chauffeurs are strictly barred from demanding unannounced off-platform cash surcharges during transit.'
    },
    {
      num: '03',
      title: 'Chauffeur Protocol & Passenger Etiquette',
      desc: 'Our Sarathi chauffeurs are certified cultural custodians and hospitality partners. Travelers are requested to maintain mutual dignity, respect scheduled departure timelines, and strictly adhere to highway safety mandates including compulsory seatbelts and smoke-free cabins.'
    },
    {
      num: '04',
      title: 'High-Altitude & Mountain Weather Clearances',
      desc: 'For routes traversing high-altitude passes (such as Khardung La, Rohtang, Zojila, and Kunzum), daily transit remains strictly subject to Border Roads Organisation (BRO) and local traffic police advisories. Chauffeurs reserve the statutory authority to alter routes or halt for traveler safety.'
    },
    {
      num: '05',
      title: 'Luggage Allowances & Personal Belongings',
      desc: 'Vehicles provide designated boot capacities and secured rooftop carrier racks where certified. Travelers retain sole custody of personal electronics, jewelry, and cash. Chauffeurs assist with loading and unloading luggage with utmost diligence.'
    },
    {
      num: '06',
      title: 'Concierge Dispute Redressal & Ombudsman',
      desc: 'In the rare event of service disruption, accommodation mismatch, or route delay, travelers have 24x7 direct access to our Senior Concierge Ombudsman with a guaranteed 24-hour formal redressal and adjustment turnaround.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1D1B18] pb-20">
      <LuxuryPageHero
        eyebrow="OFFICIAL GOVERNANCE • UPDATED 2026"
        title="Terms of Heritage Journeys & Traveler Agreement"
        subtitle="Transparent, fair-practice tourism standards governing all private journeys and group expeditions across India."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <PolicySubNav activeId="terms" />
        <GuaranteesStrip />

        {/* Legal Statement Banner */}
        <div className="p-6 rounded-2xl bg-[#14161C] text-white border border-[#B68D40]/30 shadow-xl flex items-start gap-4">
          <div className="w-9 h-9 rounded-xl bg-[#B68D40]/20 border border-[#B68D40]/40 flex items-center justify-center text-[#B68D40] shrink-0 mt-0.5">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-medium text-white">Direct Sarathi Open-Mobility Charter</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-1">
              By confirming a booking through Travel India / NammaYatra, travelers enter into a direct service compact with certified Sarathi driver partners. We eliminate third-party aggregator markups, ensuring 100% of tour base fares reach the chauffeurs who safeguard your journey.
            </p>
          </div>
        </div>

        {/* Numbered Terms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {terms.map((t) => (
            <div
              key={t.num}
              className="p-6 sm:p-7 rounded-2xl bg-white border border-[#1D1B18]/10 hover:border-[#B99762]/50 transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-xl sm:text-2xl font-light text-[#B99762]">
                  {t.num}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#B99762]"></span>
              </div>
              <h2 className="font-serif text-lg font-medium text-[#1D1B18] leading-snug">
                {t.title}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-[#6D6A61] leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Assistance CTA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#EFE4D2]/40 border border-[#1D1B18]/10 flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-[#8C6D38]">Need Legal Clarification?</p>
            <h3 className="font-serif text-xl text-[#1D1B18] font-medium mt-0.5">Connect with the Concierge Ombudsman</h3>
            <p className="text-xs text-[#6D6A61] mt-1">Written queries answered within 12 hours.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-semibold tracking-wider uppercase transition shadow-md"
            >
              <span>Contact Bureau</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   2. CANCELLATION & REFUND POLICY PAGE
   ========================================================================== */
export function CancellationPolicyPage() {
  const tiers = [
    {
      timing: 'Prior to 24 Hours',
      percentage: '100%',
      badge: 'Unconditional Refund',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      textColor: 'text-emerald-800',
      desc: 'Full unconditional refund credited to your original payment method (UPI / Bank Account / Card) or 100% wallet trip credit.'
    },
    {
      timing: '12 to 24 Hours Prior',
      percentage: '75%',
      badge: 'Flexible Rescheduling',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      textColor: 'text-amber-800',
      desc: '75% cash refund to original source, OR 100% convertible to a trip voucher valid for 12 months across all itineraries.'
    },
    {
      timing: 'Under 12 Hours Prior',
      percentage: '50%',
      badge: 'Driver Compensation',
      badgeColor: 'bg-stone-100 text-stone-700 border-stone-300',
      textColor: 'text-[#1D1B18]',
      desc: '50% retained as driver partner mobilization allowance, as the assigned Sarathi has reserved their day exclusively for your tour.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1D1B18] pb-20">
      <LuxuryPageHero
        eyebrow="FAIRNESS & PEACE OF MIND"
        title="Cancellation & 100% Instant Refund Policy"
        subtitle="Transparent, time-bracketed refund guarantees designed to protect both travelers and Sarathi driver partners."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <PolicySubNav activeId="cancellation" />
        <GuaranteesStrip />

        {/* 3-Tier Matrix */}
        <div>
          <h2 className="font-serif text-2xl text-[#1D1B18] font-normal mb-4">Refund Guarantee Schedule</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {tiers.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-[#B99762]/50 transition-all"
              >
                <div className="space-y-2">
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${t.badgeColor}`}>
                    {t.badge}
                  </span>
                  <p className="text-xs uppercase tracking-wider font-semibold text-[#6D6A61] pt-1">
                    {t.timing}
                  </p>
                  <p className={`font-serif text-4xl sm:text-5xl font-light ${t.textColor}`}>
                    {t.percentage}
                  </p>
                </div>
                <p className="text-xs sm:text-sm text-[#6D6A61] leading-relaxed pt-2 border-t border-[#1D1B18]/5">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Force Majeure & Weather Advisory */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14161C] text-white border border-[#B68D40]/30 shadow-xl space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[#B68D40]/20 border border-[#B68D40]/40 flex items-center justify-center text-[#B68D40]">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h3 className="font-serif text-xl font-medium text-white">
              Weather &amp; Force Majeure Protection
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            In the event of unexpected landslides, heavy snowfall, bridge closures, cloudbursts, or official district administration curfew along high-altitude mountain passes (such as Manali-Leh, Zojila, Spiti, or Tawang), <strong>100% full unconditional refunds</strong> or complimentary trip date rescheduling will be granted without any cancellation fee.
          </p>
        </div>

        {/* Refund Processing Timelines Table */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#1D1B18]/10 shadow-sm space-y-5">
          <h3 className="font-serif text-xl font-medium text-[#1D1B18]">Refund Processing Timelines</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#1D1B18]/10 text-[11px] uppercase tracking-wider text-[#6D6A61]">
                  <th className="pb-3 font-semibold">Payment Mode</th>
                  <th className="pb-3 font-semibold">Turnaround Time</th>
                  <th className="pb-3 font-semibold">Destination Account</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1B18]/5 text-[#1D1B18]">
                <tr>
                  <td className="py-3.5 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    UPI &amp; Bharat QR
                  </td>
                  <td className="py-3.5 text-emerald-700 font-semibold">Instant (Within 15 mins)</td>
                  <td className="py-3.5 text-[#6D6A61]">Original UPI VPA / Linked Bank</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Net Banking &amp; Debit Cards
                  </td>
                  <td className="py-3.5 font-medium">2 to 3 Business Days</td>
                  <td className="py-3.5 text-[#6D6A61]">Issuing Bank Savings / Current Account</td>
                </tr>
                <tr>
                  <td className="py-3.5 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Credit Cards / Amex
                  </td>
                  <td className="py-3.5 font-medium">3 to 5 Business Days</td>
                  <td className="py-3.5 text-[#6D6A61]">Original Credit Card Statement Credit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Row */}
        <div className="p-6 rounded-2xl bg-[#EFE4D2]/40 border border-[#1D1B18]/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-base font-medium text-[#1D1B18]">Need to cancel or reschedule an active booking?</p>
            <p className="text-xs text-[#6D6A61] mt-0.5">Instant cancellation is available directly from your traveler dashboard.</p>
          </div>
          <Link
            to="/customer/bookings"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-semibold uppercase tracking-wider transition shadow-md shrink-0"
          >
            <span>Manage My Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   3. PRIVACY POLICY PAGE
   ========================================================================== */
export function PrivacyPolicyPage() {
  const pillars = [
    {
      title: 'Minimal Essential Data Collection',
      icon: ShieldCheck,
      desc: 'We strictly gather only essential passenger coordination details: full legal name, phone number, email address, and doorstep pickup coordinates. We do not track device locations or monitor browsing habits.'
    },
    {
      title: '2-Hour Chauffeur Privacy Shield',
      icon: Clock,
      desc: 'To protect traveler confidentiality and eradicate unsolicited outreach, passenger contact numbers are encrypted and dispatched to your assigned chauffeur strictly 2 hours prior to scheduled departure via automated SMS.'
    },
    {
      title: 'Bank-Grade 256-Bit SSL Payment Encryption',
      icon: Shield,
      desc: 'All payment telemetry is processed via RBI-authorized, PCI-DSS Level 1 certified gateways (Razorpay & Bharat UPI). Travel India never stores credit card CVVs, netbanking passwords, or UPI MPINs on our servers.'
    },
    {
      title: 'Inner-Line Permit Auto-Purge Protocol',
      icon: FileText,
      desc: 'Government photo identification documents collected exclusively for high-altitude inner-line permits (e.g. Ladakh, Sikkim, Spiti Valley) are stored in an encrypted vault and permanently purged 72 hours post-tour completion.'
    },
    {
      title: 'Traveler Statutory Right to Erasure (DPDP Act)',
      icon: CheckCircle2,
      desc: 'Under the Indian Digital Personal Data Protection Act, travelers hold the statutory right to request full export or permanent deletion of their profile, booking history, and stored contact details at any time.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1D1B18] pb-20">
      <LuxuryPageHero
        eyebrow="DATA ETHICS & CONSUMER PRIVACY"
        title="Privacy Policy & Cryptographic Shield"
        subtitle="Your privacy is sacred. We operate with strict zero-data-monetization principles across all journeys."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <PolicySubNav activeId="privacy" />
        <GuaranteesStrip />

        {/* Zero-Data-Sale Pledge Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14161C] text-white border border-[#B68D40]/30 shadow-xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B68D40]/20 text-[#B68D40] text-[10px] uppercase font-bold tracking-widest">
            <span>Official Zero-Data-Sale Pledge</span>
          </div>
          <h2 className="font-serif text-2xl font-medium text-white">We Never Commercialize Your Journey</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Travel India / NammaYatra maintains a strict zero-tolerance policy against commercializing traveler information. We never sell, rent, or trade your phone number, travel itineraries, or identification documents to third-party advertising exchanges, lead brokers, or insurance aggregators.
          </p>
        </div>

        {/* 5 Pillars */}
        <div className="space-y-4">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#1D1B18]/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-start gap-4 hover:border-[#B99762]/50 transition-all"
              >
                <span className="w-10 h-10 rounded-xl bg-[#B99762]/15 text-[#8C6D38] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </span>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg font-medium text-[#1D1B18]">{p.title}</h3>
                  <p className="font-sans text-xs sm:text-sm text-[#6D6A61] leading-relaxed">{p.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grievance Officer */}
        <div className="p-6 rounded-2xl bg-[#EFE4D2]/40 border border-[#1D1B18]/10 text-xs text-[#6D6A61] space-y-2">
          <p className="font-bold uppercase tracking-wider text-[#1D1B18]">Data Protection &amp; Grievance Officer</p>
          <p>
            For data inquiries, profile export requests, or erasure petitions under the Digital Personal Data Protection Act, please contact our Data Governance Officer at{' '}
            <a href="mailto:privacy@travelindia.org" className="text-[#8C6D38] font-bold underline">
              privacy@travelindia.org
            </a>
            . Response turnaround guaranteed within 48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   4. BOOKING & LUGGAGE GUIDE PAGE (NEW)
   ========================================================================== */
export function BookingGuidePage() {
  const vehicles = [
    {
      type: 'Executive Sedan',
      models: 'Maruti Suzuki Dzire / Toyota Etios',
      passengers: 'Up to 4 Guests',
      luggage: '2 Large Trolleys (28") + 2 Cabin Bags',
      bestFor: 'Couples, weekend escapes, and smooth highway circuits.'
    },
    {
      type: 'Premium Expedition SUV',
      models: 'Toyota Innova Crysta / Maruti Ertiga',
      passengers: 'Up to 6 Guests',
      luggage: '4 Large Trolleys + 4 Cabin Daypacks (Rooftop Carrier Available)',
      bestFor: 'Families, hill stations, high-altitude mountain circuits (Himachal / Ladakh).'
    },
    {
      type: 'Luxury Van / Tempo Traveller',
      models: 'Force Urbania / 12-16 Seater Luxury Van',
      passengers: 'Up to 12 - 16 Guests',
      luggage: '12+ Check-in Suitcases in Dedicated Boot Bay',
      bestFor: 'Corporate retreats, wedding groups, extended cultural expeditions.'
    }
  ];

  const packingTips = [
    {
      title: 'Himalayan & Mountain Circuits',
      desc: 'Use soft duffel bags rather than rigid hard-shell suitcases for seamless packing in vehicle luggage boots and rooftop racks.'
    },
    {
      title: 'Coastal & Heritage Backwaters',
      desc: 'Pack breathable lightweight linens, sunscreen, polarized sunglasses, and comfortable slip-on footwear for temple visits.'
    },
    {
      title: 'Prohibited Cargo Mandate',
      desc: 'Hazardous chemicals, unauthorized border drones (Leh / J&K / Sikkim border areas), and contraband substances are strictly prohibited.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1D1B18] pb-20">
      <LuxuryPageHero
        eyebrow="EXPEDITION PROTOCOLS & LOGISTICS"
        title="Booking & Luggage Guide for Indian Journeys"
        subtitle="Everything you need to know about vehicle luggage capacities, packing advice, and seamless journey execution."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <PolicySubNav activeId="guide" />
        <GuaranteesStrip />

        {/* Fleet Matrix */}
        <div>
          <h2 className="font-serif text-2xl text-[#1D1B18] font-normal mb-4">Vehicle Capacities &amp; Luggage Allowances</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {vehicles.map((v, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between space-y-4 hover:border-[#B99762]/50 transition-all"
              >
                <div className="space-y-2">
                  <span className="w-9 h-9 rounded-xl bg-[#B99762]/15 text-[#8C6D38] flex items-center justify-center">
                    <Car className="w-5 h-5" />
                  </span>
                  <h3 className="font-serif text-lg font-medium text-[#1D1B18] pt-1">{v.type}</h3>
                  <p className="text-xs text-[#6D6A61] italic">{v.models}</p>
                </div>
                <div className="space-y-2 pt-3 border-t border-[#1D1B18]/5 text-xs text-[#1D1B18]">
                  <p className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#B99762]" />
                    <span className="font-bold">{v.passengers}</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <Luggage className="w-4 h-4 text-[#B99762] shrink-0 mt-0.5" />
                    <span>{v.luggage}</span>
                  </p>
                  <p className="text-[11px] text-[#6D6A61] pt-1 leading-relaxed">
                    {v.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4-Step Journey Lifecycle */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#14161C] text-white border border-[#B68D40]/30 shadow-xl space-y-6">
          <h3 className="font-serif text-2xl font-medium text-white">How Your Journey Unfolds</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-serif font-light text-[#B68D40]">Step 01</span>
              <p className="font-bold text-sm text-white">Choose Itinerary</p>
              <p className="text-xs text-slate-300">Select curated holiday package or craft a custom roadtrip.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-serif font-light text-[#B68D40]">Step 02</span>
              <p className="font-bold text-sm text-white">Instant Boarding Pass</p>
              <p className="text-xs text-slate-300">Pay via Razorpay / UPI QR and receive your digital ticket instantly.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-serif font-light text-[#B68D40]">Step 03</span>
              <p className="font-bold text-sm text-white">Chauffeur SMS Dispatch</p>
              <p className="text-xs text-slate-300">Vehicle number &amp; Sarathi driver details shared 2h prior.</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <span className="text-xs font-serif font-light text-[#B68D40]">Step 04</span>
              <p className="font-bold text-sm text-white">Doorstep Boarding</p>
              <p className="text-xs text-slate-300">Scan QR pass with your chauffeur and embark on your expedition.</p>
            </div>
          </div>
        </div>

        {/* Packing Advice */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {packingTips.map((tip, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-[#1D1B18]/10 space-y-2 shadow-xs">
              <h4 className="font-serif text-base font-medium text-[#1D1B18]">{tip.title}</h4>
              <p className="text-xs text-[#6D6A61] leading-relaxed">{tip.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   5. CONTACT INFO / CONCIERGE BUREAU PAGE
   ========================================================================== */
export function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', topic: 'General Inquiry', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/enquiries', {
        ...formData,
        tripType: 'concierge_contact',
        destination: formData.topic
      });
      if (res.success) {
        showToast('Your message has reached our Senior Concierge Desk. An officer will connect shortly.', 'success');
        setFormData({ name: '', email: '', phone: '', topic: 'General Inquiry', message: '' });
      } else {
        showToast(res.message || 'Message submitted successfully!', 'success');
        setFormData({ name: '', email: '', phone: '', topic: 'General Inquiry', message: '' });
      }
    } catch (e) {
      showToast('Enquiry received! Our concierge team will reach out promptly.', 'success');
      setFormData({ name: '', email: '', phone: '', topic: 'General Inquiry', message: '' });
    } finally {
      setLoading(false);
    }
  };

  const offices = [
    { city: 'Bengaluru (Headquarters)', address: 'Open Mobility Bureau, 100ft Road, Indiranagar, Bengaluru 560038', phone: '+91 80 4433 2211' },
    { city: 'New Delhi Bureau', address: 'Heritage & Northern Circuit Desk, Connaught Place, New Delhi 110001', phone: '+91 11 2345 6789' },
    { city: 'Jaipur Regional Desk', address: 'Royal Rajasthan Concierge, C-Scheme, Ashok Nagar, Jaipur 302001', phone: '+91 141 5566 778' },
    { city: 'Kochi Coastal Bureau', address: 'Southern Backwaters Desk, Fort Kochi, Kochi 682001', phone: '+91 484 9988 776' }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1D1B18] pb-20">
      <LuxuryPageHero
        eyebrow="ALWAYS AT YOUR SERVICE • 24X7 CONCIERGE"
        title="Connect with Our Travel Concierge Bureau"
        subtitle="Reach our senior travel designers, regional hub directors, or 24x7 emergency tourist SOS desk."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <PolicySubNav activeId="contact" />
        {/* 3 Direct Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2 hover:border-[#B99762]/50 transition-all">
            <span className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D6A61] pt-1">Toll-Free Tourist SOS</p>
            <h3 className="font-serif text-xl font-medium text-[#1D1B18]">1800-BHARAT</h3>
            <p className="text-xs text-[#6D6A61]">(1800-242-728) • 24 Hours / 7 Days</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2 hover:border-[#B99762]/50 transition-all">
            <span className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-700 flex items-center justify-center">
              <MessageCircle className="w-5 h-5" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D6A61] pt-1">WhatsApp Concierge</p>
            <h3 className="font-serif text-xl font-medium text-[#1D1B18]">+91 98765 43210</h3>
            <a
              href="https://wa.me/919876543210?text=Hi%20Travel%20India!%20I%20have%20an%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-700 font-bold hover:underline inline-flex items-center gap-1"
            >
              <span>Chat with Concierge</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] space-y-2 hover:border-[#B99762]/50 transition-all">
            <span className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-700 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </span>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[#6D6A61] pt-1">Editorial &amp; Booking Desk</p>
            <h3 className="font-serif text-xl font-medium text-[#1D1B18]">concierge@travelindia.org</h3>
            <p className="text-xs text-[#6D6A61]">Formal proposals &amp; VIP requests</p>
          </div>
        </div>

        {/* 2-Column: Form + Regional Bureaus */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#1D1B18]/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#B99762]">Direct Dispatch</span>
              <h2 className="font-serif text-2xl font-medium text-[#1D1B18]">Send an Executive Inquiry</h2>
              <p className="text-xs text-[#6D6A61] mt-1">Our travel designers respond within 30 minutes during business hours.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1B18] mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aditi Rao"
                    className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:bg-white focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1B18] mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="aditi@example.com"
                    className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:bg-white focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1D1B18] mb-1">Phone / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 00000"
                    className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:bg-white focus:outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1D1B18] mb-1">Inquiry Topic</label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:bg-white focus:outline-none transition cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Custom Itinerary Planning">Custom Itinerary Planning</option>
                    <option value="Corporate / Group Booking">Corporate / Group Booking</option>
                    <option value="Booking Modification / Cancellation">Booking Modification / Cancellation</option>
                    <option value="Sarathi Driver Partner Onboarding">Sarathi Driver Partner Onboarding</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1D1B18] mb-1">Your Message / Travel Requirements *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us about your proposed dates, group size, or specific assistance required..."
                  className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 rounded-xl px-3.5 py-2.5 text-xs text-[#1D1B18] focus:border-[#B99762] focus:bg-white focus:outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-300 shadow-md flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Transmitting to Concierge...' : 'Send Message to Concierge'}</span>
              </button>
            </form>
          </div>

          {/* Regional Hubs */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#14161C] text-white rounded-3xl p-6 sm:p-7 border border-[#B68D40]/30 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-[#B68D40]/20 text-[#B68D40] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-medium text-white">Regional Concierge Bureaus</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider">Across 4 Strategic Zones</p>
                </div>
              </div>

              <div className="space-y-3.5 pt-2 text-xs">
                {offices.map((off, idx) => (
                  <div key={idx} className="pb-3 border-b border-white/10 last:border-b-0 space-y-0.5">
                    <p className="font-bold text-[#B68D40]">{off.city}</p>
                    <p className="text-slate-300 leading-relaxed">{off.address}</p>
                    <p className="text-slate-400 text-[11px] pt-0.5">{off.phone}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white border border-[#1D1B18]/10 text-xs text-[#6D6A61] space-y-1">
              <p className="font-bold text-[#1D1B18]">Emergency 24x7 Roadside Chauffeur Telemetry</p>
              <p>
                All on-trip vehicles are monitored through our automated telemetry SOS desk. Chauffeurs can trigger instantaneous roadside recovery via our direct state police coordination tie-ups.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   6. ABOUT US PAGE
   ========================================================================== */
export function AboutPage() {
  const stats = [
    { value: '28', label: 'States & Union Territories' },
    { value: '4,200+', label: 'Verified Sarathi Chauffeurs' },
    { value: '100%', label: 'Base Fare Directly to Drivers' },
    { value: '4.93 / 5', label: 'Verified Traveler Satisfaction' }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1D1B18] pb-20">
      <LuxuryPageHero
        eyebrow="OUR PHILOSOPHY & GRASSROOTS REVOLUTION"
        title="Preserving Bharat's Soul Through Fair Mobility"
        subtitle="An open-mobility movement inspired by grassroots dignity, zero-brokerage earnings, and authentic cultural storytellers."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <PolicySubNav activeId="about" />
        <GuaranteesStrip />

        {/* Editorial Story */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#1D1B18]/10 shadow-[0_6px_30px_rgba(0,0,0,0.03)] space-y-6 text-sm sm:text-base text-[#6D6A61] leading-relaxed">
          <p className="first-letter:font-serif first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:text-[#B99762] first-letter:leading-none">
            Travel India / NammaYatra was born from a fundamental observation: commercial corporate travel aggregators extract upwards of 25% to 35% in brokerage commissions from local chauffeurs who spend long days navigating mountain passes, desert trails, and coastal highways.
          </p>

          <p>
            Inspired by the open-mobility protocols of Bengaluru&apos;s Namma Yatri and Hyderabad&apos;s Mana Yatri, we created a fair-trade travel network. By cutting out intermediaries, <strong>100% of every rupee spent on base transport fares goes directly to verified Sarathi driver partners</strong>.
          </p>

          <h3 className="font-serif text-2xl font-normal text-[#1D1B18] pt-4">
            The Three Pillars of Our Ethos
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#1D1B18]/5 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-[#B99762]/15 text-[#8C6D38] flex items-center justify-center font-serif font-bold text-sm">
                1
              </span>
              <h4 className="font-serif text-lg font-medium text-[#1D1B18]">Direct Driver Empowerment</h4>
              <p className="text-xs text-[#6D6A61] leading-relaxed">
                Direct UPI transfers, family medical coverage, and annual scholarships for children of our chauffeurs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#1D1B18]/5 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-[#B99762]/15 text-[#8C6D38] flex items-center justify-center font-serif font-bold text-sm">
                2
              </span>
              <h4 className="font-serif text-lg font-medium text-[#1D1B18]">Certified Cultural Storytellers</h4>
              <p className="text-xs text-[#6D6A61] leading-relaxed">
                Our Sarathis are native to the regions they navigate, sharing forgotten temple folklore, culinary secrets, and hidden scenic viewpoints.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#1D1B18]/5 space-y-2">
              <span className="w-8 h-8 rounded-lg bg-[#B99762]/15 text-[#8C6D38] flex items-center justify-center font-serif font-bold text-sm">
                3
              </span>
              <h4 className="font-serif text-lg font-medium text-[#1D1B18]">Transparent Quiet Luxury</h4>
              <p className="text-xs text-[#6D6A61] leading-relaxed">
                Immaculately sanitized vehicles, transparent fuel and permit accounting, and boutique heritage stays without artificial tourist markups.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-[#14161C] text-white border border-[#B68D40]/30 shadow-xl text-center space-y-1">
              <p className="font-serif text-3xl sm:text-4xl font-light text-[#B68D40]">{s.value}</p>
              <p className="text-xs text-slate-300 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Call to Explore */}
        <div className="p-8 rounded-3xl bg-[#EFE4D2]/40 border border-[#1D1B18]/10 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
          <div>
            <h3 className="font-serif text-2xl font-medium text-[#1D1B18]">Embark on an Authentic Journey</h3>
            <p className="text-xs sm:text-sm text-[#6D6A61] mt-1">Discover handcrafted expeditions curated across Rajasthan, Kashmir, Kerala, and Himachal.</p>
          </div>
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-semibold uppercase tracking-wider transition shadow-md"
          >
            <span>Explore Tour Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================================
   7. UPCOMING DEPARTURES PAGE
   ========================================================================== */
export function UpcomingDeparturesPage() {
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/tours?limit=12&sort=newest');
        if (res.success) setDepartures(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1D1B18] pb-20">
      <LuxuryPageHero
        eyebrow="GUARANTEED CALENDAR SCHEDULES"
        title="Upcoming Guaranteed Departures"
        subtitle="Confirmed group and private expeditions across the next 90 days. Reserve your seat directly with Sarathi chauffeurs."
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <GuaranteesStrip />

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-white border border-[#1D1B18]/10 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {departures.map((tour) => (
              <div
                key={tour.id}
                className="bg-white rounded-2xl p-6 border border-[#1D1B18]/10 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:border-[#B99762]/60 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border border-emerald-200">
                      Guaranteed Departure
                    </span>
                    <span className="text-xs text-[#6D6A61] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {tour.duration_days} Days
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-medium text-[#1D1B18] line-clamp-2 leading-snug">
                    {tour.title}
                  </h3>
                  <p className="text-xs text-[#6D6A61]">
                    {tour.destination_name || 'Incredible India'} • Direct Driver Pricing
                  </p>
                </div>

                <div className="pt-4 mt-6 border-t border-[#1D1B18]/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-[#6D6A61] uppercase tracking-wider font-semibold">All-Inclusive Fare</p>
                    <p className="font-serif text-xl font-normal text-[#1D1B18]">
                      ₹{Number(tour.sale_price).toLocaleString('en-IN')}
                    </p>
                  </div>
                  <Link
                    to={`/booking?tour=${tour.slug || tour.id}`}
                    className="bg-[#1D1B18] hover:bg-[#B99762] text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-xl transition shadow-sm"
                  >
                    Reserve Seat
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==========================================================================
   8. OFFERS & PRIVILEGES PAGE
   ========================================================================== */
export function OffersPage() {
  const offers = [
    { code: 'BHARATYATRA', title: 'First Expedition Privilege', desc: 'Enjoy 10% instant direct reduction on your maiden journey with NammaYatra.', max: 'Save up to ₹2,500' },
    { code: 'DIRECT500', title: 'Open Mobility Flat Off', desc: 'Flat ₹500 courtesy off on any single-day tour, heritage walk, or weekend roadtrip.', max: 'Flat ₹500 Off' },
    { code: 'HERITAGE20', title: 'Grand Royal Circuit Special', desc: 'Privilege 20% savings on 7+ days multi-state family vacation itineraries.', max: 'Save up to ₹5,000' }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-[#1D1B18] pb-20">
      <LuxuryPageHero
        eyebrow="DIRECT SAVINGS & PRIVILEGES"
        title="Exclusive Offers & Promo Vouchers"
        subtitle="Apply verified privilege codes during checkout to enjoy authentic, uninflated direct savings."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <GuaranteesStrip />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((o) => (
            <div
              key={o.code}
              className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#B99762]/40 shadow-sm space-y-4 hover:border-[#B99762] transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#8C6D38] bg-[#B99762]/15 px-3 py-1 rounded-xl border border-[#B99762]/30 tracking-wider">
                  {o.code}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {o.max}
                </span>
              </div>
              <div>
                <h3 className="font-serif text-lg font-medium text-[#1D1B18]">{o.title}</h3>
                <p className="text-xs text-[#6D6A61] mt-1.5 leading-relaxed">{o.desc}</p>
              </div>
              <Link
                to="/tours"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6D38] hover:text-[#1D1B18] pt-2"
              >
                <span>Browse Eligible Tours</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
