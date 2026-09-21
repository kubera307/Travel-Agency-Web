import React, { useMemo, useState } from 'react';
import { api } from '../../utils/api';
import { useToast } from '../../context/ToastContext';
import { ArrowLeft, ArrowRight, Calendar, Car, CheckCircle2, Hotel, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react';

const steps = [
  'Destination',
  'Dates',
  'Travellers',
  'Budget',
  'Hotel',
  'Transport',
  'Activities',
  'Contact',
];

const destinationOptions = ['Kashmir', 'Kerala', 'Rajasthan', 'Goa', 'Himachal', 'Karnataka', 'Ladakh'];
const hotelOptions = ['Boutique stay', 'Heritage property', 'Luxury resort', 'Homestay / eco lodge'];
const transportOptions = ['Private SUV', 'Tempo Traveller', 'Luxury sedan', 'Train + stay package'];
const activityOptions = ['Houseboat stay', 'Trekking', 'City heritage tour', 'Wildlife safari', 'Beach outing', 'Spiritual visit'];

export default function CustomTripPlannerPage() {
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    destination: 'Kashmir',
    date: '',
    travellers: '2',
    budget: '₹30,000 - ₹60,000',
    hotel: 'Boutique stay',
    transport: 'Private SUV',
    activities: ['Houseboat stay', 'City heritage tour'],
    name: '',
    email: '',
    phone: '',
    notes: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleActivity = (value) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(value);
      return {
        ...prev,
        activities: exists ? prev.activities.filter((item) => item !== value) : [...prev.activities, value],
      };
    });
  };

  const canContinue = () => {
    if (step === 0 && !formData.destination) return false;
    if (step === 1 && !formData.date) return false;
    if (step === 2 && !formData.travellers) return false;
    if (step === 3 && !formData.budget) return false;
    if (step === 4 && !formData.hotel) return false;
    if (step === 5 && !formData.transport) return false;
    if (step === 6 && formData.activities.length === 0) return false;
    if (step === 7) {
      if (!formData.name || !formData.email || !formData.phone) return false;
    }
    return true;
  };

  const nextStep = () => {
    if (!canContinue()) {
      showToast('Please complete your selection before continuing.', 'warning');
      return;
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const previousStep = () => setStep((current) => Math.max(current - 1, 0));

  const submit = async () => {
    if (!canContinue()) {
      showToast('Please add your contact details before submit.', 'warning');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/enquiries', {
        destination: formData.destination,
        travelDate: formData.date,
        travellersCount: Number(formData.travellers),
        budget: formData.budget,
        hotelCategory: formData.hotel,
        transportType: formData.transport,
        activities: formData.activities,
        specialRequirements: formData.notes,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        tripType: 'custom_trip',
      });

      if (res.success) {
        setSubmitted(true);
        showToast('Your trip planner request has been sent.', 'success');
      } else {
        showToast(res.message || 'Something went wrong while planning your trip.', 'error');
      }
    } catch (error) {
      console.error('Planner submission failed', error);
      showToast('Unable to send your itinerary request right now.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="section-shell py-16 md:py-20">
        <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-[0_24px_44px_rgba(15,23,42,0.04)]">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d97706]">Trip request sent</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-[-0.06em] text-slate-900 md:text-4xl">We’re building your journey.</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Our travel coordinator will reach out with a tailored itinerary and stay options for your chosen destination.
          </p>
          <button type="button" onClick={() => { setSubmitted(false); setStep(0); setFormData({ destination:'Kashmir', date:'', travellers:'2', budget:'₹30,000 - ₹60,000', hotel:'Boutique stay', transport:'Private SUV', activities:['Houseboat stay','City heritage tour'], name:'', email:'', phone:'', notes:'' }); }} className="mt-8 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800">Plan another trip</button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-shell py-10 md:py-12">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_24px_50px_rgba(15,23,42,0.04)] md:p-8">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d97706]">Tailor-made</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.06em] text-slate-900 md:text-5xl">Plan your custom trip</h1>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700">Step {step + 1} of {steps.length}</div>
        </div>

        <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-200">
          <div className="h-full rounded-full bg-[#d97706] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>

        {step === 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              <MapPin className="h-5 w-5 text-[#d97706]" />
              <span className="text-sm font-medium">Choose the destination that suits your next escape.</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {destinationOptions.map((destination) => (
                <button type="button" key={destination} onClick={() => updateField('destination', destination)} className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${formData.destination === destination ? 'border-[#d97706] bg-[#fff3e3] text-slate-900 shadow-[0_12px_24px_rgba(217,119,6,0.12)]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                  {destination}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              <Calendar className="h-5 w-5 text-[#d97706]" />
              <span className="text-sm font-medium">Pick your ideal travel window.</span>
            </div>
            <div className="max-w-md">
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Travel dates</label>
              <input type="date" value={formData.date} onChange={(e) => updateField('date', e.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              <Users className="h-5 w-5 text-[#d97706]" />
              <span className="text-sm font-medium">How many travellers are joining you?</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {['2', '3', '4', '5+'].map((travellers) => (
                <button type="button" key={travellers} onClick={() => updateField('travellers', travellers)} className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${formData.travellers === travellers ? 'border-[#d97706] bg-[#fff3e3] text-slate-900 shadow-[0_12px_24px_rgba(217,119,6,0.12)]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                  {travellers} travellers
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              <ShieldCheck className="h-5 w-5 text-[#d97706]" />
              <span className="text-sm font-medium">Choose a budget that matches your comfort level.</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {['₹15,000 - ₹30,000', '₹30,000 - ₹60,000', '₹60,000 - ₹1,00,000', 'Luxury / custom budget'].map((budget) => (
                <button type="button" key={budget} onClick={() => updateField('budget', budget)} className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${formData.budget === budget ? 'border-[#d97706] bg-[#fff3e3] text-slate-900 shadow-[0_12px_24px_rgba(217,119,6,0.12)]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                  {budget}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              <Hotel className="h-5 w-5 text-[#d97706]" />
              <span className="text-sm font-medium">What hotel style do you prefer?</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {hotelOptions.map((hotel) => (
                <button type="button" key={hotel} onClick={() => updateField('hotel', hotel)} className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${formData.hotel === hotel ? 'border-[#d97706] bg-[#fff3e3] text-slate-900 shadow-[0_12px_24px_rgba(217,119,6,0.12)]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                  {hotel}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              <Car className="h-5 w-5 text-[#d97706]" />
              <span className="text-sm font-medium">Preferred transport for the trip.</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {transportOptions.map((transport) => (
                <button type="button" key={transport} onClick={() => updateField('transport', transport)} className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${formData.transport === transport ? 'border-[#d97706] bg-[#fff3e3] text-slate-900 shadow-[0_12px_24px_rgba(217,119,6,0.12)]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                  {transport}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              <Sparkles className="h-5 w-5 text-[#d97706]" />
              <span className="text-sm font-medium">What experiences matter most on your trip?</span>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {activityOptions.map((item) => {
                const active = formData.activities.includes(item);
                return (
                  <button type="button" key={item} onClick={() => toggleActivity(item)} className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${active ? 'border-[#d97706] bg-[#fff3e3] text-slate-900 shadow-[0_12px_24px_rgba(217,119,6,0.12)]' : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'}`}>
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              <Users className="h-5 w-5 text-[#d97706]" />
              <span className="text-sm font-medium">Tell us how to reach you.</span>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <input value={formData.name} onChange={(e) => updateField('name', e.target.value)} placeholder="Full name" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input value={formData.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email address" type="email" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" />
              <input value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Phone number" type="tel" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none md:col-span-2" />
              <textarea value={formData.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Any special notes or requests" rows={4} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none md:col-span-2" />
            </div>
          </div>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-slate-200 pt-6">
          <button type="button" onClick={previousStep} disabled={step === 0} className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-40">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>

          {step < steps.length - 1 ? (
            <button type="button" onClick={nextStep} className="inline-flex items-center gap-2 rounded-full bg-[#d97706] px-5 py-3 text-sm font-semibold text-white hover:bg-[#c86a00]">
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button type="button" onClick={submit} disabled={loading} className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1a2538] disabled:opacity-70">
              {loading ? 'Sending...' : 'Submit plan'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

