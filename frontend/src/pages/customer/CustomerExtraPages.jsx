import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../utils/api';
import TourCard from '../../components/tours/TourCard';
import { User, Phone, MapPin, Heart, MessageSquare, Clock, ArrowRight } from 'lucide-react';

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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
          Account Settings
        </span>
        <h2 className="font-display font-black text-2xl text-slate-900 mt-1">
          Profile &amp; Emergency Contacts
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Keep your details updated for swift vehicle dispatch and emergency Sarathi coordination.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1">Emergency Contact</label>
            <input
              type="text"
              placeholder="+91 98450 99999 (Father / Spouse)"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-colors shadow-md"
        >
          {loading ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
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
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Wishlist</span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
          Saved / Favourite Tours ({favourites.length})
        </h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading saved tours...</div>
      ) : favourites.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">No Favourites Saved</h3>
          <p className="text-xs text-slate-500">Click the heart icon on any tour card to save it here for later.</p>
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
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Custom Trips</span>
        <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
          My Custom Trip Enquiries
        </h1>
      </div>

      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500">Loading enquiries...</div>
      ) : enquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-sm space-y-4">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-base text-slate-900">No Custom Enquiries Yet</h3>
          <p className="text-xs text-slate-500">Plan a custom trip with our A-to-Z trip builder to track it here.</p>
          <Link
            to="/custom-trip-planner"
            className="inline-block bg-orange-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl hover:bg-orange-700 transition-colors shadow-md"
          >
            Launch Planner
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((e) => (
            <div key={e.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-slate-900">{e.destination}</span>
                <span className="text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full uppercase">
                  {e.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">Budget: {e.budget} • Travellers: {e.travellers_count} Guests</p>
              {e.admin_notes && (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 border border-slate-100 mt-2">
                  <strong>Coordinator Note:</strong> {e.admin_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

