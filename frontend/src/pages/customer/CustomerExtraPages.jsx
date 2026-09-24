import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../utils/api';
import TourCard from '../../components/tours/TourCard';
import {
  User,
  Phone,
  MapPin,
  Heart,
  MessageSquare,
  Clock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import FeedbackModal from '../../components/common/FeedbackModal';

// PROFILE PAGE
export function CustomerProfilePage() {
  const { user, updateProfile } = useAuth();
  const { showToast } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [dateOfBirth, setDateOfBirth] = useState(user?.dateOfBirth || '');
  const [gender, setGender] = useState(user?.gender || 'Male');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState(user?.city || '');
  const [state, setState] = useState(user?.state || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [emergencyContact, setEmergencyContact] = useState(user?.emergencyContact || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({
        name,
        phone,
        dateOfBirth,
        gender,
        address,
        city,
        state,
        pincode,
        emergencyContact
      });
      if (res.success) {
        showToast('Profile updated successfully.', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 text-left">
      {/* Page Header */}
      <div className="border-b border-[#1D1B18]/10 pb-6">
        <span className="text-[11px] font-bold text-[#B99762] uppercase tracking-[0.2em] flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#B99762]" />
          Membership Credentials &amp; Logistics
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] mt-1 font-normal tracking-tight">
          Profile &amp; Emergency Contacts
        </h1>
        <p className="text-xs text-[#1D1B18]/60 mt-1 max-w-xl font-light">
          Maintain your personal particulars for swift vehicle allocation, seamless airport meet-and-greets, and emergency Sarathi dispatch.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#1D1B18]/10 shadow-sm space-y-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 focus:border-[#B99762] focus:ring-1 focus:ring-[#B99762] rounded-xl px-4 py-2.5 text-xs text-[#1D1B18] transition-all outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1.5">Mobile Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 focus:border-[#B99762] focus:ring-1 focus:ring-[#B99762] rounded-xl px-4 py-2.5 text-xs text-[#1D1B18] transition-all outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1.5">Date of Birth</label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 focus:border-[#B99762] focus:ring-1 focus:ring-[#B99762] rounded-xl px-4 py-2.5 text-xs text-[#1D1B18] transition-all outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1.5">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 focus:border-[#B99762] focus:ring-1 focus:ring-[#B99762] rounded-xl px-4 py-2.5 text-xs text-[#1D1B18] transition-all outline-hidden"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1.5">Street Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Residential or Office address for doorstep pickup"
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 focus:border-[#B99762] focus:ring-1 focus:ring-[#B99762] rounded-xl px-4 py-2.5 text-xs text-[#1D1B18] transition-all outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1.5">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 focus:border-[#B99762] focus:ring-1 focus:ring-[#B99762] rounded-xl px-4 py-2.5 text-xs text-[#1D1B18] transition-all outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1.5">State</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 focus:border-[#B99762] focus:ring-1 focus:ring-[#B99762] rounded-xl px-4 py-2.5 text-xs text-[#1D1B18] transition-all outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-[#1D1B18]/80 mb-1.5">
                Emergency Contact (Name &amp; Phone)
              </label>
              <input
                type="text"
                placeholder="+91 98450 99999 (Spouse / Guardian / Parent)"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#1D1B18]/15 focus:border-[#B99762] focus:ring-1 focus:ring-[#B99762] rounded-xl px-4 py-2.5 text-xs text-[#1D1B18] transition-all outline-hidden"
              />
              <p className="text-[11px] text-[#1D1B18]/50 mt-1 font-light">
                Shared securely with your assigned chauffeur for instant communication if required during transit.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-white font-medium text-xs px-7 py-3 rounded-full transition-all duration-300 shadow-sm disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-[#B99762]" />
              <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>

        {/* Data Security Guarantee */}
        <div className="pt-4 border-t border-[#1D1B18]/10 flex items-center gap-3 text-xs text-[#1D1B18]/60 font-light">
          <ShieldCheck className="w-4 h-4 text-[#B99762] shrink-0" />
          <span>All traveler records are protected with 256-Bit SSL and strictly shared under ONDC privacy standards.</span>
        </div>
      </div>
    </div>
  );
}

// FAVOURITES PAGE
export function CustomerFavouritesPage() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/favourites');
        if (res.success) setFavourites(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 text-left">
      <div className="border-b border-[#1D1B18]/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#B99762] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B99762]" />
            Curated Wishlist
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] mt-1 font-normal tracking-tight">
            Saved &amp; Preferred Expeditions ({favourites.length})
          </h1>
          <p className="text-xs text-[#1D1B18]/60 mt-1 max-w-xl font-light">
            Keep track of the heritage corridors, wildlife retreats, and hill circuits you wish to explore next.
          </p>
        </div>

        <Link
          to="/tours"
          className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 shadow-sm self-start sm:self-auto shrink-0"
        >
          <span>Explore All Tours</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#B99762] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#1D1B18]/60 font-light">Loading your saved journeys...</p>
        </div>
      ) : favourites.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#1D1B18]/10 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#B99762]/30 flex items-center justify-center mx-auto text-[#B99762]">
            <Heart className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl text-[#1D1B18] font-normal">No Expeditions Saved Yet</h3>
          <p className="text-xs text-[#1D1B18]/60 max-w-md mx-auto font-light leading-relaxed">
            Click the heart icon on any tour itinerary to bookmark it here for effortless future planning and booking.
          </p>
          <div className="pt-2">
            <Link
              to="/tours"
              className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white font-medium text-xs px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {favourites.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      )}
    </div>
  );
}

// CUSTOM ENQUIRIES TRACKING
export function CustomerEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/enquiries/my');
        if (res.success) setEnquiries(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8 text-left">
      <div className="border-b border-[#1D1B18]/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#B99762] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B99762]" />
            Tailor-Made Itineraries
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] mt-1 font-normal tracking-tight">
            My Custom Trip Enquiries
          </h1>
          <p className="text-xs text-[#1D1B18]/60 mt-1 max-w-xl font-light">
            Track bespoke travel requests crafted specifically for your group with our dedicated tour coordinators.
          </p>
        </div>

        <Link
          to="/custom-trip-planner"
          className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 shadow-sm self-start sm:self-auto shrink-0"
        >
          <span>Plan New Custom Trip</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#B99762] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#1D1B18]/60 font-light">Loading custom enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#1D1B18]/10 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#B99762]/30 flex items-center justify-center mx-auto text-[#B99762]">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl text-[#1D1B18] font-normal">No Custom Enquiries Yet</h3>
          <p className="text-xs text-[#1D1B18]/60 max-w-md mx-auto font-light leading-relaxed">
            Design your dream travel route with our A-to-Z customized trip builder to collaborate directly with our travel architects.
          </p>
          <div className="pt-2">
            <Link
              to="/custom-trip-planner"
              className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white font-medium text-xs px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
            >
              <span>Launch Custom Trip Planner</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div
              key={e.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#1D1B18]/10 hover:border-[#B99762]/40 shadow-sm transition-all duration-300 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="font-serif text-xl sm:text-2xl text-[#1D1B18] font-normal">
                  {e.destination}
                </span>
                <span className="text-[10px] font-bold bg-[#FAF8F5] text-[#B99762] border border-[#B99762]/30 px-3 py-1 rounded-full uppercase tracking-wider self-start sm:self-auto">
                  {e.status}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-[#1D1B18]/70 font-light">
                <span>Budget: <strong className="font-medium text-[#1D1B18]">{e.budget || 'Flexible'}</strong></span>
                <span>•</span>
                <span>Party Size: <strong className="font-medium text-[#1D1B18]">{e.travellers_count} Guests</strong></span>
              </div>

              {e.admin_notes && (
                <div className="p-4 bg-[#FAF8F5] rounded-2xl text-xs text-[#1D1B18]/80 border border-[#B99762]/20 mt-3 space-y-1">
                  <p className="font-semibold text-[#B99762] text-[11px] uppercase tracking-wider">
                    Concierge Coordinator Note:
                  </p>
                  <p className="font-light italic text-[#1D1B18]/80 leading-relaxed">
                    "{e.admin_notes}"
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// CUSTOMER FEEDBACK PAGE
export function CustomerFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      const res = await api.get('/feedback/my');
      if (res.success) setFeedbacks(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, []);

  return (
    <div className="space-y-8 text-left">
      <div className="border-b border-[#1D1B18]/10 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#B99762] uppercase tracking-[0.2em] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#B99762]" />
            Continuous Excellence &amp; Voice
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1D1B18] mt-1 font-normal tracking-tight">
            Traveler Feedback &amp; Reviews
          </h1>
          <p className="text-xs text-[#1D1B18]/60 mt-1 max-w-xl font-light">
            Share ratings for your journeys, vehicles, and booking experience. Every submission is reviewed directly by our concierge directorate.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all duration-300 shadow-sm self-start sm:self-auto shrink-0"
        >
          <span>Share New Feedback</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#B99762] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-[#1D1B18]/60 font-light">Retrieving your feedback logs...</p>
        </div>
      ) : feedbacks.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 sm:p-16 text-center border border-[#1D1B18]/10 shadow-sm space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#B99762]/30 flex items-center justify-center mx-auto text-[#B99762]">
            <MessageSquare className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-2xl text-[#1D1B18] font-normal">No Feedback Submitted Yet</h3>
          <p className="text-xs text-[#1D1B18]/60 max-w-md mx-auto font-light leading-relaxed">
            Have you completed a tour or used our website recently? Let us know what you loved or how we can elevate your next expedition.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#1D1B18] hover:bg-[#B99762] text-[#F7F1E7] hover:text-white font-medium text-xs px-6 py-3 rounded-full transition-all duration-300 shadow-sm"
            >
              <span>Submit Your Experience</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {feedbacks.map((f) => (
            <div
              key={f.id}
              className="bg-white p-6 sm:p-7 rounded-3xl border border-[#1D1B18]/10 hover:border-[#B99762]/40 shadow-sm transition-all duration-300 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[#B68D40]">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-base ${i < f.rating ? 'text-[#B68D40]' : 'text-slate-200'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-serif text-lg text-[#1D1B18] font-normal">
                    {f.category}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold bg-[#FAF8F5] text-[#B99762] border border-[#B99762]/30 px-3 py-1 rounded-full uppercase tracking-wider">
                    {f.status}
                  </span>
                  <span className="text-[11px] text-[#1D1B18]/40 font-mono">
                    {f.created_at?.split(' ')[0]}
                  </span>
                </div>
              </div>

              {f.tour_title && (
                <p className="text-xs text-[#1D1B18]/60 font-light">
                  Trip Reference: <strong className="text-[#1D1B18] font-serif">{f.tour_title}</strong> ({f.booking_number})
                </p>
              )}

              <p className="text-xs text-[#1D1B18]/80 leading-relaxed font-light italic bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#1D1B18]/5">
                "{f.feedback}"
              </p>

              {f.admin_notes && (
                <div className="p-4 bg-emerald-50/70 rounded-2xl text-xs text-emerald-900 border border-emerald-200/80 space-y-1">
                  <p className="font-semibold text-emerald-800 text-[11px] uppercase tracking-wider">
                    Concierge Directorate Response:
                  </p>
                  <p className="font-light leading-relaxed">
                    {f.admin_notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Embedded Feedback Modal */}
      {modalOpen && (
        <FeedbackModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onFeedbackSubmitted={loadFeedback}
        />
      )}
    </div>
  );
}

