import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import BookingTicketPass from './BookingTicketPass';
import {
  Calendar,
  Users,
  User,
  ShieldCheck,
  Tag,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  QrCode,
  Smartphone,
  Lock
} from 'lucide-react';

export default function BookingWizard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const queryParams = new URLSearchParams(location.search);
  const tourSlug = queryParams.get('tour');

  const [tour, setTour] = useState(null);
  const [addonsList, setAddonsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Flow Steps (1 to 6)
  const [step, setStep] = useState(1);

  // Form State
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [travellerCount, setTravellerCount] = useState(2);
  const [pickupPoint, setPickupPoint] = useState('');
  const [guideLanguage, setGuideLanguage] = useState('English & Hindi');
  const [specialNotes, setSpecialNotes] = useState('');
  const [travellers, setTravellers] = useState([
    { fullName: user?.name || '', phone: user?.phone || '', email: user?.email || '', dateOfBirth: '', gender: 'Male' },
    { fullName: '', phone: '', email: '', dateOfBirth: '', gender: 'Female' }
  ]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponError, setCouponError] = useState('');

  // Payment & Final Pass State
  const [paymentMethod, setPaymentMethod] = useState('upi_qr');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState(null);
  const [ticketData, setTicketData] = useState(null);

  // Fetch Tour details and Addons
  useEffect(() => {
    async function loadData() {
      if (!tourSlug) {
        showToast('Please select a tour package first', 'info');
        navigate('/tours');
        return;
      }

      try {
        setLoading(true);
        const [tourRes, addonsRes] = await Promise.all([
          api.get(`/tours/${tourSlug}`),
          api.get('/addons')
        ]);

        if (tourRes.success && tourRes.data) {
          setTour(tourRes.data);
          if (tourRes.data.departures && tourRes.data.departures.length > 0) {
            setSelectedDeparture(tourRes.data.departures[0]);
          }
          if (tourRes.data.popularPickups && tourRes.data.popularPickups.length > 0) {
            setPickupPoint(tourRes.data.popularPickups[0]);
          }
        }

        if (addonsRes.success && addonsRes.data) {
          setAddonsList(addonsRes.data);
        }
      } catch (err) {
        showToast(err.message || 'Failed to load tour details', 'error');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [tourSlug]);

  // Adjust travellers array when count changes
  const handleTravellerCountChange = (count) => {
    const num = Math.max(1, parseInt(count, 10));
    setTravellerCount(num);

    setTravellers((prev) => {
      const updated = [...prev];
      if (num > updated.length) {
        for (let i = updated.length; i < num; i++) {
          updated.push({ fullName: '', phone: '', email: '', dateOfBirth: '', gender: 'Adult' });
        }
      } else if (num < updated.length) {
        updated.splice(num);
      }
      return updated;
    });
  };

  const updateTravellerField = (index, field, value) => {
    setTravellers((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const toggleAddon = (addon) => {
    setSelectedAddons((prev) => {
      const exists = prev.find((a) => a.addonId === addon.id);
      if (exists) {
        return prev.filter((a) => a.addonId !== addon.id);
      } else {
        return [...prev, { addonId: addon.id, quantity: 1, price: addon.price, name: addon.name }];
      }
    });
  };

  // Pricing Calculations
  const subtotal = (tour?.sale_price || 0) * travellerCount;
  const addOnTotal = selectedAddons.reduce((sum, a) => sum + a.price * a.quantity, 0);
  const tax = Math.round((subtotal + addOnTotal) * 0.05);
  const grandTotal = Math.max(0, subtotal + addOnTotal + tax - couponDiscount);

  // Apply Coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const res = await api.post('/bookings/validate-coupon', {
        code: couponCode.trim(),
        amount: subtotal
      });
      if (res.success && res.data) {
        setCouponDiscount(res.data.discount);
        setCouponApplied(res.data.code);
        showToast(`Coupon ${res.data.code} applied! You saved ₹${res.data.discount}`, 'success');
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
      setCouponDiscount(0);
      setCouponApplied(null);
    }
  };

  // Submit Booking & Execute Payment
  const handleConfirmAndPay = async () => {
    if (!isAuthenticated) {
      showToast('Please sign in or register to complete your booking.', 'info');
      navigate('/login?redirect=' + encodeURIComponent(location.pathname + location.search));
      return;
    }

    if (!selectedDeparture) {
      showToast('Please select a departure date.', 'error');
      setStep(1);
      return;
    }

    // Validate travellers names
    for (let i = 0; i < travellers.length; i++) {
      if (!travellers[i].fullName.trim()) {
        showToast(`Please enter the full name for Traveller ${i + 1}.`, 'error');
        setStep(2);
        return;
      }
    }

    setIsProcessingPayment(true);

    try {
      // 1. Create Booking in Backend
      const bookingRes = await api.post('/bookings', {
        tourId: tour.id,
        departureId: selectedDeparture.id,
        departureDate: selectedDeparture.departure_date,
        pickupPoint,
        guideLanguage,
        travellerCount,
        travellers,
        selectedAddons,
        couponCode: couponApplied,
        specialNotes
      });

      if (!bookingRes.success || !bookingRes.data) {
        throw new Error(bookingRes.message || 'Failed to initialize booking');
      }

      const { bookingId, paymentOrder } = bookingRes.data;

      // 2. Complete Payment Verification (Mock Gateway)
      const verifyRes = await api.post('/payments/verify', {
        bookingId,
        transactionId: paymentOrder.transactionId,
        status: 'SUCCESSFUL',
        method: paymentMethod
      });

      if (verifyRes.success) {
        // 3. Load generated official ticket pass
        const ticketRes = await api.get(`/bookings/${bookingId}`);
        if (ticketRes.success && ticketRes.data) {
          setConfirmedBookingId(bookingId);
          setTicketData(ticketRes.data);
          setStep(6); // Final Confirmed Pass Step
          showToast('Payment successful! Booking confirmed.', 'success');
        }
      }
    } catch (err) {
      showToast(err.message || 'Payment processing failed', 'error');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600 font-semibold text-sm">Loading package booking wizard...</p>
      </div>
    );
  }

  if (!tour) return null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Wizard Step Progress Bar */}
      <div className="no-print mb-8">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-3">
          <span className={step >= 1 ? 'text-orange-600 font-black' : ''}>1. Departure</span>
          <span className={step >= 2 ? 'text-orange-600 font-black' : ''}>2. Travellers</span>
          <span className={step >= 3 ? 'text-orange-600 font-black' : ''}>3. Add-ons</span>
          <span className={step >= 4 ? 'text-orange-600 font-black' : ''}>4. Review &amp; Pay</span>
          <span className={step === 6 ? 'text-emerald-600 font-black' : ''}>5. Ticket Pass</span>
        </div>
        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* STEP 1: DEPARTURE & PICKUP SELECTION */}
      {step === 1 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Step 1 of 4</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Select Departure &amp; Pickup</h2>
            <p className="text-xs text-slate-500 mt-1">{tour.title} • {tour.duration_days} Days</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-3">
              Available Departure Dates ({tour.departures?.length || 0})
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tour.departures?.map((dep) => {
                const isSelected = selectedDeparture?.id === dep.id;
                return (
                  <button
                    key={dep.id}
                    type="button"
                    onClick={() => setSelectedDeparture(dep)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-sm text-slate-900">
                        {dep.departure_date}
                      </span>
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {dep.available_seats} Seats
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Return: {dep.return_date}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pickup Point Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
              Select Doorstep / Landmark Pickup Point
            </label>
            <select
              value={pickupPoint}
              onChange={(e) => setPickupPoint(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-orange-500/30 cursor-pointer"
            >
              {tour.popularPickups?.map((p, idx) => (
                <option key={idx} value={p}>{p}</option>
              ))}
              <option value="Custom Doorstep Pickup">Other (Coordinate with Sarathi via Call)</option>
            </select>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              <span>Next: Traveller Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: TRAVELLER DETAILS */}
      {step === 2 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Step 2 of 4</span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">Traveller Information</h2>
            </div>
            {/* Number of Travellers Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600">Travellers:</span>
              <select
                value={travellerCount}
                onChange={(e) => handleTravellerCountChange(e.target.value)}
                className="bg-slate-100 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-900 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((n) => (
                  <option key={n} value={n}>{n} Guests</option>
                ))}
              </select>
            </div>
          </div>

          {/* Form Fields per Traveller */}
          <div className="space-y-4">
            {travellers.map((trv, idx) => (
              <div key={idx} className="p-4 bg-slate-50/60 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Traveller {idx + 1} {idx === 0 ? '(Primary Lead)' : ''}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">ID Verification Required</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={trv.fullName}
                      onChange={(e) => updateTravellerField(idx, 'fullName', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      placeholder="+91 98450 12345"
                      value={trv.phone}
                      onChange={(e) => updateTravellerField(idx, 'phone', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 focus:ring-2 focus:ring-orange-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Gender</label>
                    <select
                      value={trv.gender}
                      onChange={(e) => updateTravellerField(idx, 'gender', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-800 cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              <span>Next: Optional Add-ons</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: OPTIONAL ADD-ONS */}
      {step === 3 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Step 3 of 4</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Upgrade Your Experience</h2>
            <p className="text-xs text-slate-500 mt-1">Add optional services to make your journey completely seamless.</p>
          </div>

          <div className="space-y-3">
            {addonsList.map((addon) => {
              const isSelected = selectedAddons.some((a) => a.addonId === addon.id);
              return (
                <div
                  key={addon.id}
                  onClick={() => toggleAddon(addon)}
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-4 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/50 ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="mt-1 rounded text-orange-600 focus:ring-orange-500 cursor-pointer"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{addon.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{addon.description}</p>
                    </div>
                  </div>
                  <span className="font-display font-bold text-xs text-slate-900 shrink-0">
                    +₹{Number(addon.price).toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              <span>Next: Review &amp; Payment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW, COUPON & PAYMENT GATEWAY */}
      {step === 4 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">Step 4 of 4</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">Review &amp; Pay Directly</h2>
            <p className="text-xs text-slate-500 mt-1">
              Zero commission to drivers • 100% fare reaches your verified Sarathi.
            </p>
          </div>

          {/* Coupon Code Input */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <label className="block text-xs font-bold text-slate-700 uppercase mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-orange-500" />
              <span>Apply Coupon Code</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. WELCOME10 or BHARAT500"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-800"
              />
              <button
                type="button"
                onClick={handleApplyCoupon}
                className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-xs text-emerald-600 font-semibold mt-1.5">
                ✓ Coupon {couponApplied} applied successfully!
              </p>
            )}
            {couponError && (
              <p className="text-xs text-rose-600 font-semibold mt-1.5">
                {couponError}
              </p>
            )}
          </div>

          {/* Complete Price Breakdown (Prompt Section 7) */}
          <div className="p-6 bg-slate-900 text-slate-300 rounded-2xl space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">Price Breakdown</h3>
            <div className="flex justify-between text-xs">
              <span>Tour Base Fare ({travellerCount} Guests × ₹{tour.sale_price}):</span>
              <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {addOnTotal > 0 && (
              <div className="flex justify-between text-xs">
                <span>Selected Add-ons:</span>
                <span className="font-bold text-white">+₹{addOnTotal.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-xs">
              <span>Taxes &amp; Statutory Tourism Levies (5%):</span>
              <span className="font-bold text-white">+₹{tax.toLocaleString('en-IN')}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Coupon Discount ({couponApplied}):</span>
                <span className="font-bold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-sm font-bold text-white">
              <span>Grand Total:</span>
              <span className="font-display font-black text-2xl text-amber-400">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-3">
              Select Direct Payment Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'upi_qr', name: 'Direct UPI QR', icon: QrCode, desc: 'Instant UPI to Driver' },
                { id: 'card', name: 'Credit / Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                { id: 'netbanking', name: 'Net Banking', icon: Smartphone, desc: 'All Major Indian Banks' }
              ].map((m) => {
                const isSelected = paymentMethod === m.id;
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/60 ring-2 ring-orange-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-orange-600 mb-2" />
                    <div className="font-bold text-xs text-slate-900">{m.name}</div>
                    <p className="text-[10px] text-slate-500 mt-0.5">{m.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mock Mode Notice */}
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Development Mock Gateway Active:</strong> No real money will be charged.
              Clicking Confirm will immediately process the transaction and generate your official travel pass.
            </span>
          </div>

          <div className="flex justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-4 py-2.5 rounded-xl border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              type="button"
              disabled={isProcessingPayment}
              onClick={handleConfirmAndPay}
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm px-8 py-3.5 rounded-xl shadow-lg transition-all disabled:opacity-50"
            >
              {isProcessingPayment ? (
                <span>Processing Payment...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Pay ₹{grandTotal.toLocaleString('en-IN')} &amp; Confirm</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STEP 6: BOOKING CONFIRMATION & OFFICIAL PASS */}
      {step === 6 && ticketData && (
        <BookingTicketPass ticket={ticketData} />
      )}
    </div>
  );
}

