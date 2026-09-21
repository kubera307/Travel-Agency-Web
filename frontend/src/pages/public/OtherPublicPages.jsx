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
  Award
} from 'lucide-react';

// UPCOMING DEPARTURES PAGE
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Fixed Departure Schedules
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 mt-1">
          Upcoming Scheduled Tours
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Confirmed group &amp; private departures across the next 90 days. Guarantee your seat directly with Sarathi chauffeurs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {departures.map((tour) => (
          <div key={tour.id} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-2">
              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Confirmed Departure
              </span>
              <h3 className="font-bold text-base text-slate-900 line-clamp-1">{tour.title}</h3>
              <p className="text-xs text-slate-500">{tour.destination_name} • {tour.duration_days} Days</p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Fare</p>
                <p className="font-display font-black text-lg text-slate-900">₹{Number(tour.sale_price).toLocaleString('en-IN')}</p>
              </div>
              <Link
                to={`/booking?tour=${tour.slug || tour.id}`}
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Book Seat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// OFFERS & COUPONS PAGE
export function OffersPage() {
  const offers = [
    { code: 'WELCOME10', title: 'First Trip Discount', desc: 'Get 10% instant off on your first tour booking with NammaYathra.', max: 'Save up to ₹2,000' },
    { code: 'BHARAT500', title: 'Bharat Mobility Flat Off', desc: 'Flat ₹500 discount on any day tour or weekend safari.', max: 'Flat ₹500 Off' },
    { code: 'FESTIVE20', title: 'Festive Holiday Special', desc: 'Enjoy 20% discount on multi-day family holiday packages.', max: 'Save up to ₹4,000' }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Special Promotions
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 mt-1">
          Exclusive Offers &amp; Promo Codes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Apply these verified coupon codes during checkout to enjoy transparent, direct savings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((o) => (
          <div key={o.code} className="bg-white rounded-3xl p-6 border-2 border-dashed border-orange-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-orange-600 bg-orange-50 px-3 py-1 rounded-xl border border-orange-200">
                {o.code}
              </span>
              <span className="text-xs font-bold text-emerald-600">{o.max}</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">{o.title}</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">{o.desc}</p>
            </div>
            <Link
              to="/tours"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline"
            >
              <span>Browse Eligible Tours</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// ABOUT US PAGE
export function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">About Agency</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 mt-1">
          NammaYathra — Bharat Open Mobility &amp; Tours
        </h1>
      </div>

      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
        <p>
          <strong>NammaYathra</strong> is a next-generation open mobility travel network inspired
          by the grassroots success of Mana Yatri in Hyderabad and Namma Yatri in Bengaluru.
          We were established with a clear mission: eliminate exploitative 30% aggregator brokerage
          cuts, empower local Sarathi chauffeurs, and offer travelers authentic, high-quality,
          transparent Indian holiday experiences.
        </p>

        <h3 className="font-display font-bold text-lg text-slate-900 pt-2">The 0% Commission Ethos</h3>
        <p>
          On traditional booking aggregators, drivers lose nearly one-third of every rupee you spend.
          At NammaYathra, 100% of the tour base fare is transferred directly to the Sarathi driver partner
          via instant UPI. In return, our Sarathis provide unmatched hospitality, acting as certified
          cultural storytellers and guardians of local heritage.
        </p>

        <h3 className="font-display font-bold text-lg text-slate-900 pt-2">Comprehensive A-to-Z Planning</h3>
        <p>
          From doorstep pickup, comfortable sanitized vehicles, and monument fast-track passes to regional
          culinary trails and 24x7 trip coordination, our bureau takes care of every fine detail so you
          travel across Incredible India with peace of mind.
        </p>
      </div>
    </div>
  );
}

// CONTACT US PAGE
export function ContactPage() {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/enquiries', {
        ...formData,
        tripType: 'general',
        destination: 'General Enquiry'
      });
      if (res.success) {
        showToast('Enquiry sent! Our officers will get back to you.', 'success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Get in Touch</span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 mt-1">
          Contact NammaYathra Helpline
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Have questions about your upcoming trip or custom itinerary? We are available around the clock.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm space-y-6">
          <h3 className="font-display font-bold text-xl text-slate-900">Send an Enquiry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message / Query *</label>
              <textarea
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs py-3 rounded-xl transition-colors shadow-md"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6">
            <h3 className="font-display font-bold text-xl text-white">24x7 Helplines &amp; Hubs</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <PhoneCall className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Toll-Free Tourist SOS</p>
                  <p className="text-slate-300">1800-BHARAT (1800-242-728)</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Email Support</p>
                  <p className="text-slate-300">support@travelindia.org</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0" />
                <div>
                  <p className="font-bold text-white">Headquarters</p>
                  <p className="text-slate-300">Open Mobility Bureau, Connaught Place, New Delhi - 110001</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// POLICIES & TERMS
export function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-sm text-slate-600">
      <h1 className="font-display font-black text-3xl text-slate-900">Privacy Policy</h1>
      <p>Your privacy is paramount. NammaYathra does not sell customer information to third parties.</p>
    </div>
  );
}

export function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-sm text-slate-600">
      <h1 className="font-display font-black text-3xl text-slate-900">Terms &amp; Conditions</h1>
      <p>All bookings made through the NammaYathra platform are subject to standard tourism guidelines.</p>
    </div>
  );
}

export function CancellationPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-sm text-slate-600">
      <h1 className="font-display font-black text-3xl text-slate-900">Cancellation &amp; Refund Policy</h1>
      <p>100% full refund for cancellations requested 24 hours prior to scheduled departure.</p>
    </div>
  );
}

