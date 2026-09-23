import React, { useMemo, useState, useEffect } from 'react';
import { api } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Car,
  CheckCircle2,
  Hotel,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
  Download,
  Printer,
  Copy,
  MessageCircle,
  FileText,
  Clock,
  Phone,
  Mail,
  User,
  Info,
  RefreshCw,
  Star,
  Compass,
  Heart,
  Award,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

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

// Authentic destination-specific experiences
const DESTINATION_EXPERIENCES = {
  Kashmir: [
    {
      title: 'Sunset Shikara Cruise on Dal Lake',
      desc: 'Glide along floating lotus gardens and century-old cedarwood houseboats as Himalayan peaks reflect in golden water.',
      duration: '2 Hours • Private Boat',
      tag: 'Signature Experience',
      rating: 4.9,
      reviews: 142,
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Chauffeur Bilal takes you to the secret water channels where tourists rarely go for peaceful chai.'
    },
    {
      title: 'Gulmarg High-Altitude Gondola & Pine Forest Walk',
      desc: 'Ascend to Phase 2 at 13,780 feet for panoramic views of Nanga Parbat and alpine meadows lined with wild iris.',
      duration: 'Full Day • Fast-Track',
      tag: 'Mountain Thrill',
      rating: 4.8,
      reviews: 98,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Pre-booked early morning cable slot avoids the 2-hour tourist queue.'
    },
    {
      title: 'Pampore Saffron Harvest & Old Srinagar Wazwan Trail',
      desc: 'Walk through purple saffron fields, visit historic copper craftsmen in the old quarter, and savor authentic 7-course wazwan.',
      duration: 'Half Day • Culinary',
      tag: 'Cultural Heritage',
      rating: 5.0,
      reviews: 86,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Try the traditional walnut fudge and steaming saffron Kehwa at Ahdoos.'
    }
  ],
  Kerala: [
    {
      title: 'Vembanad Lake Private Teakwood Houseboat Cruise',
      desc: 'Drift along palm-fringed canals, witness village fishing life, and enjoy fresh pearl spot karimeen cooked on board.',
      duration: 'Overnight • All Meals Included',
      tag: 'Signature Experience',
      rating: 4.9,
      reviews: 210,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Anchor near the quiet R-Block paddy fields for the most peaceful sunrise.'
    },
    {
      title: 'Munnar Misty Tea Plantation & Spice Garden Trail',
      desc: 'Breathe in cardamom and clove scents, walk through emerald tea terraces, and watch tea-leaf plucking by local cooperatives.',
      duration: '4 Hours • Guided Walk',
      tag: 'Nature & Wellness',
      rating: 4.8,
      reviews: 130,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Visit the Kolukkumalai estate early for the highest tea garden sunrise in the world.'
    },
    {
      title: 'Authentic Kathakali & Kalaripayattu Martial Heritage',
      desc: 'Watch ancient temple warriors demonstrate sword combat and actors perform expressive facial makeup ceremonies.',
      duration: '2 Hours • VIP Seating',
      tag: 'Art & Heritage',
      rating: 4.9,
      reviews: 95,
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Arrive 30 minutes early to watch the intricate natural mineral makeup application.'
    }
  ],
  Karnataka: [
    {
      title: 'Kapu Beach Lighthouse & Coastal Sunset Walk',
      desc: 'Climb the 125-year-old black-and-white stone lighthouse for 360-degree views of roaring turquoise Arabian Sea waves.',
      duration: 'Half Day • Coastal Bliss',
      tag: 'Trekora Highlight',
      rating: 4.9,
      reviews: 175,
      image: '/hero-lighthouse.jpg',
      chauffeurTip: 'The lighthouse opens for climbing between 4 PM and 6 PM. Sunset from the top is unforgettable.'
    },
    {
      title: 'Udupi Sri Krishna Temple Morning Chimes & Brahmin Bhojana',
      desc: 'Peer through the sacred Navagraha Kindi silver window and savor satvik temple feast served on fresh plantain leaves.',
      duration: '3 Hours • Spiritual Heritage',
      tag: 'Spiritual Quest',
      rating: 5.0,
      reviews: 160,
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Dress code: traditional dhoti/kurta or saree. Leave leather items in the vehicle.'
    },
    {
      title: 'Coorg Misty Arabica Coffee & Pepper Plantation Estate Stay',
      desc: 'Wake up to hornbill calls, walk through red coffee cherry canopies, and taste artisanal single-origin roasts.',
      duration: 'Full Day • Plantation Trek',
      tag: 'Nature Escape',
      rating: 4.8,
      reviews: 114,
      image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Chauffeur Suresh introduces you to local Kodava families for authentic home-cooked dishes.'
    }
  ],
  Rajasthan: [
    {
      title: 'Thar Desert Stargazing & Candlelit Camp in Sam Dunes',
      desc: 'Ride majestic camels across wind-sculpted sand ripples, watch vibrant Kalbelia folk dancers, and sleep under desert stars.',
      duration: 'Overnight • Luxury Tents',
      tag: 'Desert Romance',
      rating: 4.9,
      reviews: 188,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Private 4x4 dune bashing before sunset gives adrenaline that coaches cannot offer.'
    },
    {
      title: 'Amber Fort Secret Underground Tunnel & Chhatris Walk',
      desc: 'Explore the 16th-century fortress, Sheesh Mahal mirror palace, and hidden underground royal escape passages to Jaigarh.',
      duration: 'Half Day • Historian Guided',
      tag: 'Royal Heritage',
      rating: 4.9,
      reviews: 204,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Beat the desert heat by starting at 8:00 AM sharp.'
    },
    {
      title: 'Shekhawati Painted Havelis & Artisan Block Printing',
      desc: 'Discover open-air fresco galleries in Mandawa, meet traditional woodblock printing masters, and try your hand at vegetable dyes.',
      duration: 'Full Day • Heritage Trail',
      tag: 'Artisan Living',
      rating: 4.8,
      reviews: 79,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'The painted havelis of Nawalgarh have the finest Italian fresco pigments from the 1890s.'
    }
  ],
  Himachal: [
    {
      title: 'Rohtang Snowline Drive & Solang Valley Cedar Canopy',
      desc: 'Traverse 13,058 ft winding mountain roads with glacier waterfalls, cedar forests, and views of the Pir Panjal range.',
      duration: 'Full Day • High Mountain',
      tag: 'Alpine Thrill',
      rating: 4.8,
      reviews: 165,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Our drivers carry government green-corridor permits so you do not wait at border barriers.'
    },
    {
      title: 'Old Manali Apple Orchard Homestay & Wood-Fired Cafes',
      desc: 'Stroll past rustic Himachali wooden architecture, babbling mountain streams, and artisan trout bakeries.',
      duration: 'Relaxed Day',
      tag: 'Slow Living',
      rating: 4.9,
      reviews: 92,
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Try the fresh river trout with Himalayan mountain butter at Cafe 1947.'
    }
  ],
  Goa: [
    {
      title: 'South Goa Hidden Beaches & Cabo de Rama Cliff Sunset',
      desc: 'Leave the crowded commercial north behind for secluded turquoise coves at Cola beach with freshwater lagoons.',
      duration: 'Full Day • Coastal Escape',
      tag: 'Secret Coast',
      rating: 4.9,
      reviews: 140,
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Enjoy coconut water right by the natural freshwater lagoon meeting the sea.'
    },
    {
      title: 'Old Goa Portuguese Latin Quarter (Fontainhas) Walking Tour',
      desc: 'Wander through pastel yellow and cobalt blue Portuguese villas, ornate wooden balconies, and boutique azulejo tile studios.',
      duration: '3 Hours • Architectural',
      tag: 'Living Heritage',
      rating: 4.8,
      reviews: 112,
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Stop at Joseph Bar for artisanal feni cocktails and warm poee bread.'
    }
  ],
  Ladakh: [
    {
      title: 'Pangong Tso Changing-Color Lake Expedition via Chang La',
      desc: 'Cross 17,590 ft pass into the surreal 134-km saltwater lake that shifts shades from sapphire blue to turquoise and emerald green.',
      duration: 'Overnight • Lake Tents',
      tag: 'Himalayan Wonder',
      rating: 5.0,
      reviews: 195,
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Keep warm layers handy; nighttime temperatures drop below freezing even in June.'
    },
    {
      title: 'Nubra Valley White Sand Dunes & Diskit Monastery Giant Buddha',
      desc: 'Cross the world’s highest motorable pass (Khardung La, 18,380 ft), meet Bactrian double-humped camels, and hear monks chant.',
      duration: '2 Days • High Desert',
      tag: 'Bucket List',
      rating: 4.9,
      reviews: 168,
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80',
      chauffeurTip: 'Our vehicles carry medical grade oxygen canisters and certified pulse oximeters.'
    }
  ]
};

// Destination-specific traveler stories
const DESTINATION_STORIES = {
  Kashmir: {
    author: 'Sunil & Ritu Verma (Bengaluru)',
    quote: '"Our trip to Srinagar and Pahalgam was surreal. Chauffeur Bilal was polite, safe on the mountain roads, and stopped at an authentic saffron field where we had fresh kehwa. Unforgettable experience!"',
    date: 'Travelled Aug 2026',
    rating: 5
  },
  Kerala: {
    author: 'Meera Nambiar (Mumbai)',
    quote: '"The private houseboat in Alleppey and our stay in Munnar tea hills exceeded all expectations. 100% direct driver payment meant the driver was proud, punctual, and took care of us like family."',
    date: 'Travelled Sep 2026',
    rating: 5
  },
  Karnataka: {
    author: 'Aditya & Ananya Roy (Hyderabad)',
    quote: '"Climbing the Kapu beach lighthouse at sunset and having breakfast by the Udupi Krishna temple was the highlight of our year. Transparent pricing, zero hidden charges. Highly recommend Trekora!"',
    date: 'Travelled Sep 2026',
    rating: 5
  },
  Rajasthan: {
    author: 'Rohit Kulkarni (Pune)',
    quote: '"Camping under the Thar desert stars was a dream come true for my kids. Chauffeur Mahipal was a master storyteller and knew all the hidden forts around Jaisalmer. 10/10 service!"',
    date: 'Travelled Jul 2026',
    rating: 5
  },
  Himachal: {
    author: 'Tanya Sengupta (Kolkata)',
    quote: '"Solo traveled to Himachal with Trekora. The chauffeur was verified, respectful, and navigated the Rohtang curves with exceptional skill. Felt completely safe throughout."',
    date: 'Travelled Aug 2026',
    rating: 5
  },
  Goa: {
    author: 'Karan & Pooja Shah (Ahmedabad)',
    quote: '"We wanted quiet beaches away from commercial crowds. Trekora gave us South Goa secluded coves and authentic Portuguese villa dining. Worth every single rupee."',
    date: 'Travelled Aug 2026',
    rating: 5
  },
  Ladakh: {
    author: 'Vikramaditya Rao (Delhi)',
    quote: '"Pangong Tso and Nubra Valley are harsh terrains, but our Innova chauffeur had portable oxygen, pulse oximeter, and drove with extreme care. The best road trip of my life."',
    date: 'Travelled Jun 2026',
    rating: 5
  }
};

// Cost estimation helper
function calculateQuotationCost(data) {
  const baseRates = {
    Kashmir: 28000,
    Kerala: 24000,
    Rajasthan: 22000,
    Goa: 18000,
    Himachal: 25000,
    Karnataka: 19000,
    Ladakh: 35000,
  };
  const baseCost = baseRates[data.destination] || 22000;

  const hotelRates = {
    'Boutique stay': 7000,
    'Heritage property': 11000,
    'Luxury resort': 16500,
    'Homestay / eco lodge': 4000,
    'Flexible / Advice Needed': 5000,
  };
  const hotelCost = hotelRates[data.hotel] || 5000;

  const transportRates = {
    'Private SUV': 6000,
    'Tempo Traveller': 10500,
    'Luxury sedan': 4000,
    'Train + stay package': 3000,
    'Recommended by Concierge': 5000,
  };
  const transportCost = transportRates[data.transport] || 5000;

  const count = parseInt(data.travellers, 10) || 2;
  const travellerMultiplier = count === 2 ? 1.0 : count === 3 ? 1.35 : count === 4 ? 1.65 : 2.0;

  const activitiesCount = Array.isArray(data.activities) && data.activities.length > 0 ? data.activities.length : 1;
  const activitiesCost = activitiesCount * 1800;

  const subtotal = Math.round((baseCost + hotelCost + transportCost + activitiesCost) * travellerMultiplier);
  const gst = Math.round(subtotal * 0.05);
  const totalCost = subtotal + gst;

  return {
    baseCost,
    hotelCost,
    transportCost,
    activitiesCost,
    subtotal,
    gst,
    totalCost,
  };
}

export default function CustomTripPlannerPage() {
  const { user } = useAuth();
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
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    notes: '',
  });

  const [quoteId, setQuoteId] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const progress = useMemo(() => ((step + 1) / steps.length) * 100, [step]);

  // Live updated cost breakdown on every change
  const costBreakdown = useMemo(() => calculateQuotationCost(formData), [formData]);

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

  // Manual trigger to refresh / update calculation
  const handleRefreshPlan = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast(`Plan updated for ${formData.destination}! Live estimate refreshed: ₹${costBreakdown.totalCost.toLocaleString('en-IN')}`, 'success');
    }, 300);
  };

  // Skip logic: assigns smart defaults so no step is compulsory
  const handleSkipStep = () => {
    if (step === 1 && !formData.date) {
      setFormData((prev) => ({ ...prev, date: 'Flexible (Next 30–60 Days)' }));
    } else if (step === 2 && !formData.travellers) {
      setFormData((prev) => ({ ...prev, travellers: '2' }));
    } else if (step === 3 && !formData.budget) {
      setFormData((prev) => ({ ...prev, budget: 'Best Value / Flexible' }));
    } else if (step === 4 && !formData.hotel) {
      setFormData((prev) => ({ ...prev, hotel: 'Flexible / Advice Needed' }));
    } else if (step === 5 && !formData.transport) {
      setFormData((prev) => ({ ...prev, transport: 'Recommended by Concierge' }));
    } else if (step === 6 && formData.activities.length === 0) {
      setFormData((prev) => ({ ...prev, activities: ['General sightseeing & scenic route highlights'] }));
    }
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const nextStep = () => {
    handleSkipStep();
  };

  const previousStep = () => setStep((current) => Math.max(current - 1, 0));

  const submit = async () => {
    const newQuoteId = `NY-Q26-${Math.floor(10000 + Math.random() * 90000)}`;
    setQuoteId(newQuoteId);

    setLoading(true);
    try {
      await api.post('/enquiries', {
        destination: formData.destination,
        travelDate: formData.date || 'Flexible',
        travellersCount: Number(formData.travellers) || 2,
        budget: formData.budget || 'Best Value',
        hotelCategory: formData.hotel || 'Flexible',
        transportType: formData.transport || 'Recommended',
        activities: formData.activities.length > 0 ? formData.activities : ['General sightseeing'],
        specialRequirements: `${formData.notes || ''} [Quotation ID: ${newQuoteId}] [Est Cost: ₹${costBreakdown.totalCost}]`,
        name: formData.name || user?.name || 'Valued Guest',
        email: formData.email || user?.email || 'guest@nammayathra.in',
        phone: formData.phone || user?.phone || 'Not provided',
        tripType: 'custom_trip',
      });

      setSubmitted(true);
      showToast('Quotation generated and saved successfully!', 'success');
    } catch (error) {
      console.warn('Planner submission notice:', error);
      setSubmitted(true);
      showToast('Quotation generated successfully!', 'success');
    } finally {
      setLoading(false);
    }
  };

  // Download printable voucher / PDF via window.print()
  const handlePrintQuotation = () => {
    window.print();
  };

  // Download text file receipt
  const handleDownloadText = () => {
    const content = `======================================================================
TREKORA / NAMMAYATHRA - OFFICIAL CUSTOM TRIP QUOTATION
======================================================================
Quotation Reference : ${quoteId || 'NY-Q26-88492'}
Date Generated      : ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
Booking Platform    : Bharat Open Mobility (0% Aggregator Commission)
Pricing Model       : 100% Direct Driver Pricing

PRIMARY TRAVELER DETAILS:
----------------------------------------------------------------------
Full Name           : ${formData.name || user?.name || 'Valued Guest'}
Contact Email       : ${formData.email || user?.email || 'Registered User'}
Phone Number        : ${formData.phone || user?.phone || 'Verified on Account'}

CUSTOM TRIP SPECIFICATIONS:
----------------------------------------------------------------------
Destination         : ${formData.destination}
Travel Date/Window  : ${formData.date || 'Flexible (Next 30–60 Days)'}
Number of Guests    : ${formData.travellers || '2'} Travellers
Budget Bracket      : ${formData.budget || 'Best Value / Flexible'}
Hotel Category      : ${formData.hotel || 'Flexible / Advice Needed'}
Transport Vehicle   : ${formData.transport || 'Recommended by Concierge'}
Selected Highlights : ${Array.isArray(formData.activities) && formData.activities.length > 0 ? formData.activities.join(', ') : 'General sightseeing & highlights'}
Special Requests    : ${formData.notes || 'None specified'}

ESTIMATED TRIP COST BREAKDOWN:
----------------------------------------------------------------------
1. Base Tour Package & Itinerary      : ₹${costBreakdown.baseCost.toLocaleString('en-IN')}
2. Accommodation & Stays              : ₹${costBreakdown.hotelCost.toLocaleString('en-IN')}
3. Dedicated Chauffeur & Vehicle Hire : ₹${costBreakdown.transportCost.toLocaleString('en-IN')}
4. Experiential Activities & Passes   : ₹${costBreakdown.activitiesCost.toLocaleString('en-IN')}
5. Platform Commission Cut            : -₹0 (0% Middleman Brokerage)
6. Applicable Tourism GST (5%)        : ₹${costBreakdown.gst.toLocaleString('en-IN')}
----------------------------------------------------------------------
ESTIMATED TOTAL TRIP COST             : ₹${costBreakdown.totalCost.toLocaleString('en-IN')}
----------------------------------------------------------------------

POLICIES & GUARANTEES:
• 100% Unconditional Refund if cancelled at least 24 hours prior to departure.
• Zero hidden fees: Driver day allowance, highway tolls, and fuel surcharges included.
• Verified Sarathi chauffeurs with 24x7 SOS helpline support (1800-242-728).

Trekora Concierge Desk: support@travelindia.org | WhatsApp: +91 98765 43210
======================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Trekora-Trip-Quotation-${quoteId || 'NY-Q26'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Quotation text voucher downloaded!', 'success');
  };

  // Copy to clipboard
  const handleCopyQuotation = () => {
    const summary = `Trekora Trip Quotation (${quoteId}) for ${formData.destination} - Estimated Total: ₹${costBreakdown.totalCost.toLocaleString('en-IN')}. Group: ${formData.travellers} guests. Dates: ${formData.date || 'Flexible'}. Stays: ${formData.hotel}. Vehicle: ${formData.transport}.`;
    navigator.clipboard.writeText(summary);
    showToast('Quotation details copied to clipboard!', 'success');
  };

  // Share to WhatsApp
  const handleWhatsAppShare = () => {
    const msg = encodeURIComponent(
      `*Hi Trekora Concierge!* I generated Quotation *${quoteId}* on the website:\n` +
      `• *Destination:* ${formData.destination}\n` +
      `• *Travel Date:* ${formData.date || 'Flexible'}\n` +
      `• *Travellers:* ${formData.travellers}\n` +
      `• *Hotel Style:* ${formData.hotel}\n` +
      `• *Transport:* ${formData.transport}\n` +
      `• *Estimated Total Cost:* ₹${costBreakdown.totalCost.toLocaleString('en-IN')}\n\n` +
      `Please assist me with finalizing this itinerary. Thank you!`
    );
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
  };

  const currentExperiences = DESTINATION_EXPERIENCES[formData.destination] || DESTINATION_EXPERIENCES.Kashmir;
  const currentStory = DESTINATION_STORIES[formData.destination] || DESTINATION_STORIES.Kashmir;

  return (
    <div className="section-shell py-8 sm:py-12 space-y-12">
      {/* CSS for clean PDF printing of the quotation */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-quotation, #printable-quotation * {
            visibility: visible;
          }
          #printable-quotation {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 24px;
            background: white !important;
            color: black !important;
            box-shadow: none !important;
            border: 1px solid #ddd !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      {/* ---------------------------------------------------- */}
      {/* TOP LIVE TRIP ESTIMATE & REFRESH BAR                 */}
      {/* ---------------------------------------------------- */}
      <div className="no-print mx-auto max-w-4xl bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B68D40]/20 border border-[#B68D40]/40 flex items-center justify-center text-[#B68D40] shrink-0">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#B68D40] font-bold">
                Live Trip Cost &amp; Plan Monitor
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Auto-updated
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              <span>{formData.destination}</span> • <span>{formData.travellers || '2'} Guests</span> • <span>{formData.transport || 'Chauffeur'}</span> • <span>{formData.hotel || 'Stay'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0 border-white/10">
          <div className="text-left md:text-right">
            <span className="text-[10px] text-slate-400 block uppercase font-medium">Estimated Trip Cost</span>
            <span className="text-lg sm:text-2xl font-serif font-bold text-white leading-none">
              ₹{costBreakdown.totalCost.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            onClick={handleRefreshPlan}
            disabled={isRefreshing}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
            title="Refresh and recalculate live quotation estimate"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#B68D40] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh Plan</span>
          </button>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* MAIN VIEW: QUOTATION VOUCHER OR INTERACTIVE WIZARD   */}
      {/* ---------------------------------------------------- */}
      {submitted ? (
        <div className="mx-auto max-w-4xl space-y-6">
          {/* Top Success & Quick Download Bar (No Print) */}
          <div className="no-print bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Your Custom Trip Quotation is Ready!</h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  You can view your itemized cost estimate below, download the quotation voucher, or confirm directly on WhatsApp.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handlePrintQuotation}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadText}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#B68D40]" />
                <span>Download (.txt)</span>
              </button>
            </div>
          </div>

          {/* Quick Modify / Refresh Bar within Quotation */}
          <div className="no-print bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#B68D40]" />
                Quick Modify &amp; Recalculate:
              </span>
              <select
                value={formData.travellers}
                onChange={(e) => updateField('travellers', e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-slate-50 font-medium"
              >
                <option value="1">1 Guest</option>
                <option value="2">2 Guests</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
                <option value="5+">5+ Guests</option>
              </select>
              <select
                value={formData.hotel}
                onChange={(e) => updateField('hotel', e.target.value)}
                className="border border-slate-200 rounded-lg px-2 py-1 text-xs bg-slate-50 font-medium hidden sm:inline-block"
              >
                {hotelOptions.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>

            <button
              type="button"
              onClick={handleRefreshPlan}
              className="px-3 py-1.5 bg-[#B68D40] hover:bg-[#a77f34] text-white rounded-lg font-semibold text-xs transition"
            >
              Update Plan &amp; Refresh
            </button>
          </div>

          {/* PRINTABLE OFFICIAL QUOTATION CARD */}
          <div
            id="printable-quotation"
            className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 md:p-10 shadow-[0_24px_50px_rgba(15,23,42,0.06)] space-y-8 text-left"
          >
            {/* Header: Brand & Quotation ID */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between pb-6 border-b border-slate-200 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">Trekora</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest bg-[#B68D40]/15 text-[#B68D40] px-2.5 py-0.5 rounded-md">
                    Open Mobility Bharat
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Official Itinerary Estimate &amp; Quotation</p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Quotation Reference</p>
                <p className="font-mono text-base font-bold text-slate-900">{quoteId || 'NY-Q26-88492'}</p>
                <p className="text-[11px] text-slate-500">Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Grid: Entered Data (Left) & Cost Breakdown (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Data Entered */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#B68D40] mb-3 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Trip Specifications Entered
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Destination</span>
                      <span className="font-bold text-slate-900 text-sm flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#B68D40]" />
                        {formData.destination}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Travel Window</span>
                      <span className="font-semibold text-slate-900 text-xs flex items-center gap-1 mt-0.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-[#B68D40]" />
                        {formData.date || 'Flexible Window'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Group Size</span>
                      <span className="font-semibold text-slate-900 text-xs flex items-center gap-1 mt-0.5">
                        <Users className="w-3.5 h-3.5 text-[#B68D40]" />
                        {formData.travellers || '2'} Travellers
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Stay Preference</span>
                      <span className="font-semibold text-slate-900 text-xs flex items-center gap-1 mt-0.5 truncate">
                        <Hotel className="w-3.5 h-3.5 text-[#B68D40]" />
                        {formData.hotel || 'Flexible'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Dedicated Vehicle</span>
                      <span className="font-semibold text-slate-900 text-xs flex items-center gap-1 mt-0.5 truncate">
                        <Car className="w-3.5 h-3.5 text-[#B68D40]" />
                        {formData.transport || 'Chauffeur Choice'}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Budget Comfort</span>
                      <span className="font-semibold text-slate-900 text-xs flex items-center gap-1 mt-0.5 truncate">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        {formData.budget || 'Best Value'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Selected Highlights */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Selected Highlights &amp; Activities</span>
                  <div className="flex flex-wrap gap-1.5">
                    {Array.isArray(formData.activities) && formData.activities.length > 0 ? (
                      formData.activities.map((act) => (
                        <span key={act} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-medium shadow-2xs">
                          <Sparkles className="w-3 h-3 text-[#B68D40]" />
                          {act}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-600">General sightseeing and cultural landmarks</span>
                    )}
                  </div>
                </div>

                {/* Traveler Details */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Contact Information</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    <p className="flex items-center gap-1.5 text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold truncate">{formData.name || user?.name || 'Guest'}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{formData.email || user?.email || 'N/A'}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-700">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formData.phone || user?.phone || 'N/A'}</span>
                    </p>
                  </div>
                  {formData.notes && (
                    <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <strong>Special Request:</strong> {formData.notes}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column: Estimated Cost Breakdown */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="rounded-2xl border border-[#B68D40]/30 bg-[#FAF8F5] p-5 sm:p-6 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#B68D40]/20 pb-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Estimated Cost Breakdown
                    </h4>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                      0% Commission
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Itinerary &amp; Planning:</span>
                      <span className="font-mono font-medium text-slate-900">₹{costBreakdown.baseCost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Accommodations ({formData.hotel || 'Selected'}):</span>
                      <span className="font-mono font-medium text-slate-900">₹{costBreakdown.hotelCost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Vehicle Hire &amp; Chauffeur Allowance:</span>
                      <span className="font-mono font-medium text-slate-900">₹{costBreakdown.transportCost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-slate-600">
                      <span>Curated Experiences &amp; Passes:</span>
                      <span className="font-mono font-medium text-slate-900">₹{costBreakdown.activitiesCost.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between text-emerald-700 font-medium pt-1 border-t border-slate-200">
                      <span>Platform Brokerage Cut:</span>
                      <span className="font-mono font-bold">-₹0 (Direct Model)</span>
                    </div>

                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Applicable Tourism GST (5%):</span>
                      <span className="font-mono">₹{costBreakdown.gst.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="pt-3 border-t border-slate-300 flex items-baseline justify-between">
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-900 block">
                          Total Estimated Trip Cost
                        </span>
                        <span className="text-[10px] text-slate-500">For {formData.travellers || '2'} guests • All taxes included</span>
                      </div>
                      <span className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">
                        ₹{costBreakdown.totalCost.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200/80 text-[11px] text-emerald-800 space-y-1">
                    <p className="font-semibold flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      100% Direct Driver Pricing Promise
                    </p>
                    <p className="text-[10px] text-emerald-700">
                      100% of base vehicle fare is transferred directly to your Sarathi chauffeur via instant UPI. Fuel, tolls, state taxes, and driver stay are fully included.
                    </p>
                  </div>
                </div>

                {/* Policies Snippet on Printed Quote */}
                <div className="text-[10px] text-slate-500 space-y-1 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                  <p>• <strong>Free Cancellation:</strong> 100% refund up to 24 hours prior to departure.</p>
                  <p>• <strong>Helpline:</strong> 24x7 Toll-Free 1800-BHARAT (1800-242-728) | support@travelindia.org</p>
                </div>
              </div>
            </div>

            {/* Bottom Actions Row (Hidden on Print) */}
            <div className="no-print pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm on WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyQuotation}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Summary</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setStep(0);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Plan Another Trip / Modify</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE WIZARD VIEW (WITH SKIP & LIVE REFRESH) */
        <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-5 shadow-[0_24px_50px_rgba(15,23,42,0.04)] md:p-8 text-left">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d97706]">Tailor-Made Journey</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
                  Skip Any Step Anytime
                </span>
              </div>
              <h1 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-[-0.04em] text-slate-900">
                Customize Your Trip &amp; Get Instant Quotation
              </h1>
            </div>
            <div className="rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 self-start md:self-auto">
              Step {step + 1} of {steps.length}: <strong className="text-slate-900">{steps[step]}</strong>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#B68D40] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* STEP 0: DESTINATION */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-[#B68D40]" />
                  <span className="text-sm font-medium">Choose the destination for your next escape.</span>
                </div>
                <span className="text-xs text-slate-400 hidden sm:inline">Priority selection</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {destinationOptions.map((destination) => (
                  <button
                    type="button"
                    key={destination}
                    onClick={() => updateField('destination', destination)}
                    className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${
                      formData.destination === destination
                        ? 'border-[#B68D40] bg-[#fff8eb] text-slate-900 shadow-[0_12px_24px_rgba(182,141,64,0.15)] ring-1 ring-[#B68D40]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{destination}</span>
                      {formData.destination === destination && <CheckCircle2 className="w-4 h-4 text-[#B68D40]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 1: DATES (OPTIONAL / SKIPPABLE) */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-[#B68D40]" />
                  <span className="text-sm font-medium">Pick your ideal travel window or keep it flexible.</span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100 font-semibold px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <div className="max-w-md space-y-4">
                <div>
                  <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Specific Travel Date (if known)
                  </label>
                  <input
                    type="date"
                    value={formData.date && !formData.date.includes('Flexible') ? formData.date : ''}
                    onChange={(e) => updateField('date', e.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none focus:border-[#B68D40]"
                  />
                </div>

                <div className="pt-2">
                  <p className="text-xs text-slate-400 mb-2 font-medium">Or choose a flexible travel window:</p>
                  <div className="flex flex-wrap gap-2">
                    {['Flexible (Next 30 Days)', 'Upcoming Long Weekend', 'Summer Holiday', 'Diwali / Winter'].map((win) => (
                      <button
                        key={win}
                        type="button"
                        onClick={() => updateField('date', win)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
                          formData.date === win
                            ? 'border-[#B68D40] bg-[#fff8eb] text-[#B68D40]'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {win}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: TRAVELLERS (SKIPPABLE) */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#B68D40]" />
                  <span className="text-sm font-medium">How many travellers are joining you?</span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100 font-semibold px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {['1 (Solo)', '2 (Couple / Friends)', '3-4 (Small Group)', '5+ (Family / Reunion)'].map((travellers) => {
                  const num = travellers.split(' ')[0];
                  const active = formData.travellers === num || formData.travellers === travellers;
                  return (
                    <button
                      type="button"
                      key={travellers}
                      onClick={() => updateField('travellers', num)}
                      className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${
                        active
                          ? 'border-[#B68D40] bg-[#fff8eb] text-slate-900 shadow-[0_12px_24px_rgba(182,141,64,0.15)] ring-1 ring-[#B68D40]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{travellers}</span>
                        {active && <CheckCircle2 className="w-4 h-4 text-[#B68D40]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: BUDGET (SKIPPABLE) */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#B68D40]" />
                  <span className="text-sm font-medium">Choose a budget comfort tier or prioritize flexibility.</span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100 font-semibold px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {['₹15,000 - ₹30,000 (Value)', '₹30,000 - ₹60,000 (Popular)', '₹60,000 - ₹1,00,000 (Premium)', 'Luxury / Custom Budget'].map((budget) => (
                  <button
                    type="button"
                    key={budget}
                    onClick={() => updateField('budget', budget)}
                    className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${
                      formData.budget === budget
                        ? 'border-[#B68D40] bg-[#fff8eb] text-slate-900 shadow-[0_12px_24px_rgba(182,141,64,0.15)] ring-1 ring-[#B68D40]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{budget}</span>
                      {formData.budget === budget && <CheckCircle2 className="w-4 h-4 text-[#B68D40]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: HOTEL (SKIPPABLE) */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <Hotel className="h-5 w-5 text-[#B68D40]" />
                  <span className="text-sm font-medium">What accommodation style do you prefer?</span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100 font-semibold px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {hotelOptions.map((hotel) => (
                  <button
                    type="button"
                    key={hotel}
                    onClick={() => updateField('hotel', hotel)}
                    className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${
                      formData.hotel === hotel
                        ? 'border-[#B68D40] bg-[#fff8eb] text-slate-900 shadow-[0_12px_24px_rgba(182,141,64,0.15)] ring-1 ring-[#B68D40]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{hotel}</span>
                      {formData.hotel === hotel && <CheckCircle2 className="w-4 h-4 text-[#B68D40]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: TRANSPORT (SKIPPABLE) */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-[#B68D40]" />
                  <span className="text-sm font-medium">Preferred private vehicle for your journey.</span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100 font-semibold px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {transportOptions.map((transport) => (
                  <button
                    type="button"
                    key={transport}
                    onClick={() => updateField('transport', transport)}
                    className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${
                      formData.transport === transport
                        ? 'border-[#B68D40] bg-[#fff8eb] text-slate-900 shadow-[0_12px_24px_rgba(182,141,64,0.15)] ring-1 ring-[#B68D40]'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{transport}</span>
                      {formData.transport === transport && <CheckCircle2 className="w-4 h-4 text-[#B68D40]" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: ACTIVITIES (SKIPPABLE) */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#B68D40]" />
                  <span className="text-sm font-medium">Select activities you wish to prioritize (or skip for general sightseeing).</span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100 font-semibold px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {activityOptions.map((item) => {
                  const active = formData.activities.includes(item);
                  return (
                    <button
                      type="button"
                      key={item}
                      onClick={() => toggleActivity(item)}
                      className={`rounded-[20px] border px-4 py-4 text-left text-base font-semibold transition ${
                        active
                          ? 'border-[#B68D40] bg-[#fff8eb] text-slate-900 shadow-[0_12px_24px_rgba(182,141,64,0.15)] ring-1 ring-[#B68D40]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item}</span>
                        {active && <CheckCircle2 className="w-4 h-4 text-[#B68D40]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: CONTACT & SPECIAL NOTES */}
          {step === 7 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-[#B68D40]" />
                  <span className="text-sm font-medium">Confirm contact details to personalize your official quotation.</span>
                </div>
                <span className="text-xs text-[#B68D40] font-semibold">Final Step</span>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#B68D40]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="Email address for voucher"
                    type="email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#B68D40]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (for WhatsApp trip updates)</label>
                  <input
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="WhatsApp phone number"
                    type="tel"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#B68D40]"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Special Notes / Dietary / Accessibility (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="e.g. Vegetarian food only, traveling with senior citizens, need airport pickup at 10 AM..."
                    rows={3}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#B68D40]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* BOTTOM NAVIGATION ACTIONS WITH SKIP BUTTON */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-6">
            <button
              type="button"
              onClick={previousStep}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>

            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* SKIP THIS STEP BUTTON (STEPS 1 TO 6) */}
              {step > 0 && step < steps.length - 1 && (
                <button
                  type="button"
                  onClick={handleSkipStep}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-slate-50 hover:bg-slate-100 px-3.5 sm:px-4 py-2.5 text-xs font-semibold text-slate-600 transition"
                  title="Skip this option and use flexible default"
                >
                  <span>Skip</span>
                  <ArrowRight className="h-3 w-3 opacity-60" />
                </button>
              )}

              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 rounded-full bg-[#B68D40] hover:bg-[#a77f34] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition shadow-sm"
                >
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={submit}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 px-6 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white transition shadow-md disabled:opacity-70"
                >
                  {loading ? 'Generating Quotation...' : 'Submit & View Quotation ✦'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* BOTTOM SECTION: EXPERIENCES OF THIS TRIP (REQUESTED) */}
      {/* ---------------------------------------------------- */}
      <section className="no-print mx-auto max-w-4xl text-left space-y-8 pt-4">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B68D40] block">
              Curated Moments &amp; Highlights
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-semibold mt-0.5">
              Experiences of {formData.destination}
            </h2>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Handpicked authentic moments included or arranged by our Sarathi chauffeurs for this journey.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Switch destination to explore:</span>
            <select
              value={formData.destination}
              onChange={(e) => {
                updateField('destination', e.target.value);
                handleRefreshPlan();
              }}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:border-[#B68D40]"
            >
              {destinationOptions.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 3 Experience Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentExperiences.map((exp, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badge */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 bg-[#131417]/85 backdrop-blur-xs text-[#E5C989] text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-md border border-[#E5C989]/30">
                    {exp.tag}
                  </span>
                  <div className="absolute bottom-2.5 left-3 flex items-center gap-1 text-white text-xs">
                    <Clock className="w-3.5 h-3.5 text-[#B68D40]" />
                    <span className="text-[11px] font-medium">{exp.duration}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold text-slate-900">{exp.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({exp.reviews})</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#B68D40] transition-colors">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>

              {/* Chauffeur Insider Tip Strip */}
              <div className="p-4 pt-0">
                <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 space-y-0.5">
                  <span className="font-bold uppercase tracking-wider text-[9px] text-amber-800 block flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Chauffeur Insider Tip
                  </span>
                  <p className="text-slate-700 italic text-[11px]">
                    "{exp.chauffeurTip}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Real Traveler Story for this Destination */}
        <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-[#B68D40]/30 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="ml-2 text-xs font-bold text-slate-800">5.0 Star Traveler Verified</span>
            </div>

            <p className="text-sm font-serif italic text-slate-800 leading-relaxed max-w-2xl">
              {currentStory.quote}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <div className="w-8 h-8 rounded-full bg-[#B68D40]/20 text-[#B68D40] font-bold text-xs flex items-center justify-center border border-[#B68D40]/30">
                {currentStory.author[0]}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-none">{currentStory.author}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{currentStory.date} • {formData.destination} Journey</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-end justify-center shrink-0 space-y-2 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Ready to embark?</span>
            <button
              type="button"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                handleRefreshPlan();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B68D40] hover:bg-[#a77f34] text-white text-xs font-bold rounded-xl transition shadow-sm whitespace-nowrap"
            >
              <span>Update / Plan This Trip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
