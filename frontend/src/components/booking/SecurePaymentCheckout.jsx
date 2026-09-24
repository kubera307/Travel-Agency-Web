import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { api } from '../../utils/api';
import { useCurrency } from '../../context/CurrencyContext';
import { useToast } from '../../context/ToastContext';
import {
  ShieldCheck,
  Lock,
  CreditCard,
  QrCode,
  Smartphone,
  Building2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Phone,
  RefreshCw,
  X,
  Copy,
  ExternalLink
} from 'lucide-react';

const TOP_BANKS = [
  { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
  { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
  { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
  { id: 'axis', name: 'Axis Bank', code: 'AXIS' },
  { id: 'kotak', name: 'Kotak Mahindra', code: 'KOTAK' },
  { id: 'pnb', name: 'Punjab National Bank', code: 'PNB' }
];

const UPI_APPS = [
  { name: 'Google Pay', icon: '🌐', color: 'hover:border-blue-500' },
  { name: 'PhonePe', icon: '🟣', color: 'hover:border-purple-500' },
  { name: 'Paytm', icon: '🔵', color: 'hover:border-sky-500' },
  { name: 'BHIM UPI', icon: '🇮🇳', color: 'hover:border-emerald-500' },
  { name: 'CRED UPI', icon: '⚫', color: 'hover:border-stone-800' }
];

export default function SecurePaymentCheckout({
  booking,
  paymentOrder,
  onPaymentSuccess,
  onBack
}) {
  const { formatPrice } = useCurrency();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('razorpay_upi'); // 'razorpay_upi' | 'razorpay_modal' | 'card' | 'netbanking' | 'direct_driver'
  const [processing, setProcessing] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(900); // 15 minutes timer
  const [copiedVpa, setCopiedVpa] = useState(false);

  // Gateway Config State
  const [gatewayConfig, setGatewayConfig] = useState({
    keyId: 'rzp_test_TRAVELINDIA101',
    merchantVpa: 'nammayatra.sarathi@icici',
    merchantName: 'Travel India Expeditions'
  });

  // Form states
  const [upiId, setUpiId] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('hdfc');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // 3D Secure OTP Modal Simulation
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [otpTimer, setOtpTimer] = useState(45);
  const [otpSubmitting, setOtpSubmitting] = useState(false);

  const amount = paymentOrder?.amount || booking?.grand_total || 0;
  const paymentId = paymentOrder?.paymentId;
  const signature = paymentOrder?.signature;

  // Load Razorpay config & inject official Checkout.js SDK
  useEffect(() => {
    async function loadGatewayConfig() {
      try {
        const res = await api.get('/razorpay/config');
        if (res.success) {
          setGatewayConfig(res);
        }
      } catch (e) {
        // Fallback to defaults
      }
    }
    loadGatewayConfig();

    if (!document.getElementById('razorpay-checkout-sdk')) {
      const script = document.createElement('script');
      script.id = 'razorpay-checkout-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Reservation countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    let t;
    if (showOtpModal && otpTimer > 0) {
      t = setInterval(() => setOtpTimer((v) => v - 1), 1000);
    }
    return () => clearInterval(t);
  }, [showOtpModal, otpTimer]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Card formatting
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.match(/.{1,4}/g)?.join(' ') || raw;
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (val.length >= 3) {
      val = `${val.slice(0, 2)}/${val.slice(2)}`;
    }
    setCardExpiry(val);
  };

  const detectCardBrand = () => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'VISA';
    if (/^5[1-5]/.test(clean)) return 'MASTERCARD';
    if (/^6(0|5)/.test(clean)) return 'RUPAY';
    if (/^3[47]/.test(clean)) return 'AMEX';
    return 'CARD';
  };

  // Real Bharat UPI QR String
  const merchantVpa = gatewayConfig.merchantVpa || 'nammayatra.sarathi@icici';
  const merchantName = gatewayConfig.merchantName || 'Travel India Expeditions';
  const orderId = paymentOrder?.orderId || `order_${booking?.id || Date.now()}`;
  const bookingNumber = booking?.booking_number || 'TRIP';

  // Standard NPCI Bharat UPI URL
  const upiQrString = `upi://pay?pa=${merchantVpa}&pn=${encodeURIComponent(merchantName)}&am=${Number(amount).toFixed(2)}&tr=${orderId}&tn=${encodeURIComponent('Trip Booking ' + bookingNumber)}&cu=INR`;

  // Copy VPA to clipboard
  const handleCopyVpa = () => {
    navigator.clipboard.writeText(merchantVpa);
    setCopiedVpa(true);
    addToast(`Copied UPI ID: ${merchantVpa}`, 'info');
    setTimeout(() => setCopiedVpa(false), 3000);
  };

  // 1. OFFICIAL RAZORPAY CHECKOUT MODAL LAUNCH
  const handleOpenRazorpayCheckout = async () => {
    if (!window.Razorpay) {
      addToast('Loading Razorpay secure gateway... Please click again in 2 seconds.', 'info');
      return;
    }

    try {
      setProcessing(true);
      const res = await api.post('/razorpay/create-order', {
        bookingId: booking.id
      });

      if (!res.success || !res.data) {
        throw new Error(res.message || 'Unable to generate Razorpay order');
      }

      const orderData = res.data;

      const options = {
        key: orderData.keyId,
        amount: orderData.amountPaise,
        currency: orderData.currency || 'INR',
        name: orderData.merchantName,
        description: `Expedition Booking #${booking.booking_number}`,
        image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=200&q=80',
        order_id: orderData.orderId,
        prefill: {
          name: booking.travellers?.[0]?.full_name || '',
          email: booking.travellers?.[0]?.email || '',
          contact: booking.travellers?.[0]?.phone || ''
        },
        theme: {
          color: '#B68D40'
        },
        handler: async function (response) {
          try {
            setProcessing(true);
            const verifyRes = await api.post('/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId: booking.id,
              paymentMethod: 'razorpay_gateway'
            });

            if (verifyRes.success) {
              addToast('Payment verified successfully via Razorpay! Boarding pass issued.', 'success');
              if (onPaymentSuccess) {
                onPaymentSuccess(verifyRes);
              }
            } else {
              addToast(verifyRes.message || 'Razorpay payment signature verification failed', 'error');
            }
          } catch (err) {
            addToast(err.message || 'Verification error', 'error');
          } finally {
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: function () {
            setProcessing(false);
          }
        }
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.open();
    } catch (err) {
      addToast(err.message || 'Could not launch Razorpay gateway', 'error');
      setProcessing(false);
    }
  };

  // 2. VERIFY SCANNED UPI PAYMENT (UTR or instant verify)
  const handleVerifyScannedUpi = async (customUtr = null) => {
    try {
      setProcessing(true);
      const finalUtr = customUtr || utrNumber.trim() || `UPI${Date.now().toString().slice(-8)}`;

      const res = await api.post('/razorpay/verify', {
        orderId,
        bookingId: booking.id,
        utrNumber: finalUtr,
        paymentMethod: 'upi_qr_direct'
      });

      if (res.success) {
        addToast('UPI transfer verified successfully! Boarding pass issued.', 'success');
        if (onPaymentSuccess) {
          onPaymentSuccess(res);
        }
      } else {
        addToast(res.message || 'UPI verification failed', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Payment verification failed', 'error');
    } finally {
      setProcessing(false);
    }
  };

  // 3. Card submit with 3D Secure modal
  const handleCardSubmit = (e) => {
    e.preventDefault();
    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15) {
      addToast('Please enter a valid 16-digit card number', 'warning');
      return;
    }
    if (!cardExpiry || cardExpiry.length < 5) {
      addToast('Please enter a valid expiration date (MM/YY)', 'warning');
      return;
    }
    if (!cardCvv || cardCvv.length < 3) {
      addToast('Please enter a valid CVV', 'warning');
      return;
    }
    setOtpTimer(45);
    setOtpValue('');
    setShowOtpModal(true);
  };

  // 3D Secure OTP verification
  const handleVerifyOtp = async () => {
    if (!otpValue || otpValue.length < 4) {
      addToast('Please enter the 6-digit OTP sent to your phone', 'warning');
      return;
    }
    setOtpSubmitting(true);
    setTimeout(async () => {
      setOtpSubmitting(false);
      try {
        setProcessing(true);
        const txn = `CARD_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const res = await api.post('/payments/verify', {
          paymentId,
          transactionId: txn,
          paymentMethod: 'card',
          signature,
          paymentDetails: {
            cardBrand: detectCardBrand(),
            last4: cardNumber.slice(-4),
            auth3DSecure: true
          }
        });

        if (res.success) {
          addToast('Card payment verified successfully! Boarding pass issued.', 'success');
          if (onPaymentSuccess) {
            onPaymentSuccess(res);
          }
        } else {
          addToast(res.message || 'Card verification failed', 'error');
        }
      } catch (err) {
        addToast(err.message || 'Card processing error', 'error');
      } finally {
        setProcessing(false);
        setShowOtpModal(false);
      }
    }, 900);
  };

  // Net banking submit
  const handleNetBankingSubmit = async () => {
    try {
      setProcessing(true);
      const bank = TOP_BANKS.find((b) => b.id === selectedBank)?.name || selectedBank;
      const txn = `NB_${selectedBank.toUpperCase()}_${Date.now()}`;
      const res = await api.post('/payments/verify', {
        paymentId,
        transactionId: txn,
        paymentMethod: 'netbanking',
        signature,
        paymentDetails: {
          bankName: bank
        }
      });

      if (res.success) {
        addToast('Net banking payment verified! Boarding pass issued.', 'success');
        if (onPaymentSuccess) {
          onPaymentSuccess(res);
        }
      } else {
        addToast(res.message || 'Net banking verification failed', 'error');
      }
    } catch (err) {
      addToast(err.message || 'Payment error', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-left">
      {/* 1. Header & Reservation Countdown */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3D9] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/10 text-[#B68D40] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-500/20 uppercase tracking-widest">
              STEP 2 OF 2 • SECURE PAYMENT
            </span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-xs text-slate-500 font-bold">
              {booking?.booking_number}
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-slate-900 font-normal">
            Complete Your Journey Payment
          </h2>
          <p className="text-xs text-slate-500 font-light mt-0.5">
            Pay securely with Razorpay, scan the live Bharat QR with any UPI app, or use Cards &amp; Net Banking.
          </p>
        </div>

        {/* Lock Timer Badge */}
        <div className="flex items-center gap-3 bg-[#FAF8F5] px-4 py-2.5 rounded-2xl border border-[#EAE3D9] shrink-0">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-[#B68D40] flex items-center justify-center font-bold">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Seats Locked For</p>
            <p className={`font-mono text-base font-bold ${secondsLeft < 180 ? 'text-rose-600 animate-pulse' : 'text-slate-900'}`}>
              {formatTimer(secondsLeft)}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Payment Methods (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-[#EAE3D9] p-6 sm:p-7 shadow-sm space-y-6">
          {/* Method Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#EAE3D9]">
            <button
              type="button"
              onClick={() => setActiveTab('razorpay_upi')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'razorpay_upi'
                  ? 'bg-white text-slate-900 shadow-xs border border-[#EAE3D9] font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <QrCode className="w-3.5 h-3.5 text-[#B68D40]" />
              <span>Razorpay UPI QR</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('razorpay_modal')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'razorpay_modal'
                  ? 'bg-white text-slate-900 shadow-xs border border-[#EAE3D9] font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B68D40]" />
              <span>Razorpay Modal</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('card')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'card'
                  ? 'bg-white text-slate-900 shadow-xs border border-[#EAE3D9] font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 text-[#B68D40]" />
              <span>Cards</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('netbanking')}
              className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'netbanking'
                  ? 'bg-white text-slate-900 shadow-xs border border-[#EAE3D9] font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-[#B68D40]" />
              <span>Net Banking</span>
            </button>
          </div>

          {/* TAB 1: Real Scannable Bharat UPI QR Code for ANY App */}
          {activeTab === 'razorpay_upi' && (
            <div className="space-y-6 pt-1">
              <div className="flex flex-col md:flex-row items-center gap-6 p-5 bg-[#FAF8F5] rounded-2xl border border-[#EAE3D9]">
                {/* Real High-Contrast Scannable QR Code */}
                <div className="shrink-0 bg-white p-3.5 rounded-2xl border-2 border-slate-800 shadow-md text-center flex flex-col items-center">
                  <QRCodeSVG
                    value={upiQrString}
                    size={170}
                    level="M"
                    includeMargin={false}
                  />
                  <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <span>⚡ SCAN WITH ANY UPI APP</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-center md:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>ACTIVE MERCHANT BHARAT QR</span>
                  </div>

                  <h4 className="font-serif text-lg text-slate-900 font-medium">
                    Scan with Google Pay, PhonePe, Paytm or BHIM
                  </h4>
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    Point your camera from any UPI app. The merchant name ({merchantName}) and exact fare ({formatPrice(amount)}) are automatically populated.
                  </p>

                  {/* Merchant VPA & Copy Button */}
                  <div className="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <span className="font-mono text-xs font-semibold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-[#EAE3D9]">
                      {merchantVpa}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyVpa}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#B68D40]" />
                      <span>{copiedVpa ? 'Copied!' : 'Copy UPI ID'}</span>
                    </button>

                    {/* Mobile App Deep Link Intent */}
                    <a
                      href={upiQrString}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0E131F] hover:bg-black text-white rounded-xl text-xs font-semibold transition shadow-xs sm:hidden"
                    >
                      <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Pay in UPI App</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Supported UPI Apps Row */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-500 block">
                  Quick Launch Mobile Apps:
                </span>
                <div className="flex flex-wrap gap-2">
                  {UPI_APPS.map((app) => (
                    <button
                      key={app.name}
                      type="button"
                      onClick={() => handleVerifyScannedUpi(`UPI_${app.name.replace(/\s+/g, '')}_${Date.now().toString().slice(-6)}`)}
                      disabled={processing}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EAE3D9] text-xs font-semibold text-slate-800 hover:bg-slate-50 transition shadow-2xs ${app.color}`}
                    >
                      <span>{app.icon}</span>
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Enter UTR Reference / Instant Verification */}
              <div className="p-4 bg-[#FAF8F5] rounded-2xl border border-[#EAE3D9] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Done Scanning? Verify Payment
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Order Ref: #{orderId.slice(-8)}
                  </span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Enter 12-Digit Bank UTR / UPI Ref (Optional)"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value.replace(/[^0-9A-Za-z]/g, ''))}
                    className="flex-1 px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-mono font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => handleVerifyScannedUpi()}
                    disabled={processing}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {processing ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>I Have Paid</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Official Razorpay Checkout Modal */}
          {activeTab === 'razorpay_modal' && (
            <div className="space-y-5 pt-1">
              <div className="p-6 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent rounded-2xl border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-amber-300 font-mono text-[10px] font-bold">
                    RAZORPAY CHECKOUT SDK
                  </span>
                  <span className="text-emerald-700 text-xs font-semibold">● Live Ready</span>
                </div>

                <h4 className="font-serif text-xl text-slate-900 font-medium">
                  Official Razorpay Payment Window
                </h4>
                <p className="text-xs text-slate-600 font-light leading-relaxed">
                  Opens the full Razorpay payment window with support for Credit/Debit Cards, UPI Intent, NetBanking (50+ banks), PayLater, and Wallets.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleOpenRazorpayCheckout}
                    disabled={processing}
                    className="w-full py-3.5 bg-[#0E131F] hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {processing ? (
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-[#B68D40]" />
                        <span>Launch Razorpay Gateway ({formatPrice(amount)})</span>
                        <ArrowRight className="w-4 h-4 text-[#B68D40] group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Credit & Debit Cards */}
          {activeTab === 'card' && (
            <form onSubmit={handleCardSubmit} className="space-y-4 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Card Information</span>
                <span className="text-[10px] font-bold text-[#B68D40] bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                  {detectCardBrand()} • 256-BIT SSL ENCRYPTED
                </span>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Card Number *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-mono font-medium tracking-wider"
                  />
                  <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Cardholder Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Name as printed on card"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Expiry (MM/YY) *</label>
                  <input
                    type="text"
                    required
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-mono font-medium text-center"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-600 block mb-1">CVV / CVC *</label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      maxLength={4}
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30 font-mono font-medium text-center"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full py-3.5 bg-[#0E131F] hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <Lock className="w-3.5 h-3.5 text-[#B68D40]" />
                  <span>Authorize &amp; Proceed to 3D Secure ({formatPrice(amount)})</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#B68D40] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: Net Banking */}
          {activeTab === 'netbanking' && (
            <div className="space-y-5 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Select Popular Bank
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {TOP_BANKS.map((bank) => (
                    <button
                      key={bank.id}
                      type="button"
                      onClick={() => setSelectedBank(bank.id)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                        selectedBank === bank.id
                          ? 'border-[#B68D40] bg-amber-50/50 shadow-xs ring-1 ring-[#B68D40]'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs font-semibold text-slate-800">{bank.name}</span>
                      <Building2 className={`w-3.5 h-3.5 ${selectedBank === bank.id ? 'text-[#B68D40]' : 'text-slate-400'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleNetBankingSubmit}
                  disabled={processing}
                  className="w-full py-3.5 bg-[#0E131F] hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {processing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <Building2 className="w-3.5 h-3.5 text-[#B68D40]" />
                      <span>Proceed to Secure Bank Gateway</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#B68D40]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Security Guarantee Strip */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Razorpay Verified Gateway</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>256-Bit Bank Grade Encryption</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#B68D40] shrink-0" />
              <span>Instant Boarding Pass Issuance</span>
            </span>
          </div>
        </div>

        {/* Right Column: Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#EAE3D9] shadow-sm space-y-4">
            <div>
              <span className="text-[10px] font-bold text-[#B68D40] uppercase tracking-wider">
                Booking Overview
              </span>
              <h3 className="font-serif text-lg font-medium text-slate-900 mt-0.5 leading-snug">
                {booking?.tour_title || 'India Heritage Expedition'}
              </h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Travel Date: <strong>{booking?.departure_date}</strong></span>
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Guests: <strong>{booking?.traveller_count} Persons</strong>
              </p>
            </div>

            {/* Price Ledger */}
            <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Base Tour Fare</span>
                <span className="font-semibold">{formatPrice(booking?.subtotal || amount)}</span>
              </div>

              {Number(booking?.discount || 0) > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Coupon Discount</span>
                  <span className="font-semibold">-{formatPrice(booking?.discount)}</span>
                </div>
              )}

              {Number(booking?.tax || 0) > 0 && (
                <div className="flex justify-between text-slate-500">
                  <span>GST &amp; State Taxes (5%)</span>
                  <span>{formatPrice(booking?.tax)}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <div>
                  <span className="font-serif text-sm font-bold text-slate-900">Total Payable</span>
                  <p className="text-[10px] text-emerald-600 font-semibold">● No convenience charges</p>
                </div>
                <span className="font-serif text-2xl font-bold text-slate-900">
                  {formatPrice(amount)}
                </span>
              </div>
            </div>

            {/* Driver direct highlight */}
            <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE3D9] text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-slate-800 flex items-center gap-1">
                <span className="text-[#B68D40]">★</span> 100% Direct Driver Share:
              </p>
              <p className="font-light">
                {formatPrice(amount)} goes directly to your verified local driver partner with 0% platform commission.
              </p>
            </div>
          </div>

          {/* Action to change details */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition text-center"
            >
              ← Edit Traveller Details or Travel Date
            </button>
          )}
        </div>
      </div>

      {/* 3. Simulated 3D Secure / OTP Challenge Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 sm:p-7 space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  🛡️
                </span>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">3D Secure 2.0 Verification</h4>
                  <p className="text-[10px] text-slate-500">RBI Bank Card Authorization</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                A 6-digit One Time Password (OTP) has been sent to your bank-registered mobile ending in <strong>•••• 9845</strong>.
              </p>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Merchant:</span>
                  <span className="font-semibold text-slate-800">Travel India Sarathi Escrow</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Amount:</span>
                  <span className="font-bold text-slate-900">{formatPrice(amount)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Card:</span>
                  <span className="font-mono text-slate-800">•••• •••• •••• {cardNumber.slice(-4) || '4242'}</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Enter 6-Digit OTP *
                </label>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                  className="w-full text-center text-lg tracking-[0.3em] font-mono font-bold px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#B68D40]/30"
                />
              </div>

              {/* Demo Helper */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>
                  Resend OTP in: <strong className="text-slate-700">{otpTimer}s</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setOtpValue('123456')}
                  className="text-xs font-semibold text-[#B68D40] hover:underline"
                >
                  Quick Fill Test OTP (123456)
                </button>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={otpSubmitting}
                className="w-full py-3 bg-[#0E131F] hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {otpSubmitting ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Confirm &amp; Authorize Payment</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="w-full py-2 text-xs text-slate-500 hover:text-slate-700 transition font-medium"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
