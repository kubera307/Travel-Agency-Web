import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Mountain, 
  Landmark, 
  Waves, 
  Trees, 
  HeartHandshake, 
  Compass, 
  UtensilsCrossed, 
  Maximize2, 
  Clock, 
  Star, 
  MapPin, 
  ArrowRight, 
  Check, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Camera,
  ShieldCheck
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Experiences', icon: Compass },
  { id: 'himalayan', label: 'Himalayan & Peaks', icon: Mountain },
  { id: 'heritage', label: 'Royal Heritage & Forts', icon: Landmark },
  { id: 'coastal', label: 'Coastal & Backwaters', icon: Waves },
  { id: 'wildlife', label: 'Wildlife & Safaris', icon: Trees },
  { id: 'spiritual', label: 'Spiritual Quests', icon: Sparkles },
  { id: 'wellness', label: 'Wellness & Ayurveda', icon: HeartHandshake },
  { id: 'culinary', label: 'Culinary Trails', icon: UtensilsCrossed }
];

const EXPERIENCES = [
  {
    id: 'exp-dal-lake',
    title: 'Sunset Shikara Stillness & Floating Markets on Dal Lake',
    category: 'himalayan',
    categoryLabel: 'Himalayan & Mountain',
    destination: 'Kashmir',
    tourCategory: 'adventure',
    duration: '2 Hours • Sunset Hour',
    rating: 4.9,
    reviews: 142,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Sony α7R V • 24mm f/2.8 • 7680×4320 HDR',
    desc: 'Glide past century-old cedarwood houseboats and floating water lotus gardens as sunset paints the Pir Panjal mountain ridges in amber and violet.',
    highlights: [
      'Private hand-carved cedar Shikara with traditional kangri warmth',
      'Quiet glide through interior Mughal canal channels off the tourist grid',
      'Freshly brewed saffron Kehwa served on tranquil lotus water'
    ],
    chauffeurTip: 'Chauffeur Bilal suggests departing from Ghat 12 at 4:45 PM to catch the mirror reflection on serene water.'
  },
  {
    id: 'exp-vembanad-houseboat',
    title: 'Vembanad Lake Private Teakwood Houseboat Cruise',
    category: 'coastal',
    categoryLabel: 'Coastal & Backwaters',
    destination: 'Kerala',
    tourCategory: 'coastal',
    duration: 'Overnight • All Meals',
    rating: 4.9,
    reviews: 210,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Hasselblad X2D • 38mm f/2.5 • 7680×4320 HDR',
    desc: 'Drift along emerald palm-canopied canals, observe traditional toddy tappers and village coir artisans, and dine on authentic Karimeen Pollichathu.',
    highlights: [
      'Private slow-motor solar teakwood Kettuvallam with master chef',
      'Sunset mooring by peaceful Kumarakom bird sanctuary reeds',
      'Fresh coconut water and farm-to-deck Malabar breakfast'
    ],
    chauffeurTip: 'Request an early 6:00 AM slow drift near R-Block for surreal pink water lily blooms.'
  },
  {
    id: 'exp-thar-stargazing',
    title: 'Thar Desert Stargazing & Royal Sam Dune Camp',
    category: 'heritage',
    categoryLabel: 'Royal Heritage & Forts',
    destination: 'Rajasthan',
    tourCategory: 'heritage',
    duration: 'Full Evening & Night',
    rating: 4.9,
    reviews: 178,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Nikon Z8 • 14-24mm f/2.8 • 7680×4320 HDR',
    desc: 'Traverse golden rippling sand ridges on desert 4x4s, witness blazing desert sunsets, and listen to Manganiyar folk melodies under pristine unpolluted night skies.',
    highlights: [
      'Private sunset champagne setup over untouched deep sand dunes',
      'Astronomy telescope session guided by local desert stargazers',
      'Generational Kalbelia dance and live Thar acoustic musicians'
    ],
    chauffeurTip: 'Travel 15 km past commercial Sam dunes to Khuri village for genuine silence and zero light pollution.'
  },
  {
    id: 'exp-varanasi-aarti',
    title: 'Subah-e-Banaras Dawn Wooden Boat & Assi Ghat Aarti',
    category: 'spiritual',
    categoryLabel: 'Spiritual Quests',
    destination: 'Varanasi',
    tourCategory: 'spiritual',
    duration: '3 Hours • Dawn Chants',
    rating: 5.0,
    reviews: 195,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Canon R5 C • 50mm f/1.2 • 7680×4320 HDR',
    desc: 'Experience the 3,000-year-old living spirit of Kashi from the holy Ganga as classical Vedic hymns, temple conch shells, and rising sun warm the stone ghats.',
    highlights: [
      'Private wooden rowboat navigating morning river ceremonies',
      'Spiritual commentary by generational Sanskrit scholar',
      'VIP front-row access for the evening Dashashwamedh Maha Aarti'
    ],
    chauffeurTip: 'Begin at Assi Ghat at 5:15 AM for morning ragas and the famous piping hot kulhad chai at Pappu Tea Stall.'
  },
  {
    id: 'exp-periyar-wildlife',
    title: 'Periyar Tiger Reserve Bamboo Rafting & Elephant Corridor',
    category: 'wildlife',
    categoryLabel: 'Wildlife & Safaris',
    destination: 'Kerala',
    tourCategory: 'adventure',
    duration: 'Full Day • Forest Ranger',
    rating: 4.8,
    reviews: 114,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Sony α1 • 100-400mm f/4.5-5.6 GM • 7680×4320 HDR',
    desc: 'Hike through dense evergreen cardamom rainforests and raft silently on highland reservoir lakes alongside indigenous tribal trackers.',
    highlights: [
      'Silent bamboo rafting past submerged deadwood trees with kingfishers',
      'Tracking wild elephant herds, gaurs, and Nilgiri langurs',
      'Packed indigenous tribal organic lunch wrapped in banana leaf'
    ],
    chauffeurTip: 'Wear dull olive or earthy khaki clothes; bright colors distract wild herds along river banks.'
  },
  {
    id: 'exp-ayurveda-wellness',
    title: 'Classical Ayurvedic Rejuvenation & Herbal Sanctuaries',
    category: 'wellness',
    categoryLabel: 'Wellness & Ayurveda',
    destination: 'Kerala',
    tourCategory: 'coastal',
    duration: 'Multi-Day Retreat • Doctor Guided',
    rating: 4.9,
    reviews: 88,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Leica SL2 • 35mm f/2.0 • 7680×4320 HDR',
    desc: 'Authentic panchakarma therapies, classical warm medicinal oil Shirodhara, and mindful silent pranayama in a tranquil valley retreat.',
    highlights: [
      'Personalized pulse diagnostic consultation with certified Vaidya',
      'Abhyanga dual-therapist massage using hand-pressed herbal oils',
      'Organic satvik culinary masterclass and herbal tea tastings'
    ],
    chauffeurTip: 'Book early morning slots before 8:00 AM when your body and energy meridians are most receptive.'
  },
  {
    id: 'exp-pangong-lake',
    title: 'Pangong Tso Azure Lake & Chang La Pass Crossing',
    category: 'himalayan',
    categoryLabel: 'Himalayan & Mountain',
    destination: 'Ladakh',
    tourCategory: 'adventure',
    duration: 'Full Day / Overnight Camp',
    rating: 5.0,
    reviews: 164,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Sony α7R V • 16-35mm f/2.8 GM • 7680×4320 HDR',
    desc: 'Ascend over the 17,688 ft Chang La mountain pass to gaze upon the shifting blue-to-turquoise hues of high-altitude Pangong Lake.',
    highlights: [
      'Drive across world-renowned mountain pass with certified Himalayan chauffeur',
      'Luxury heated lakeside geodesic dome stay with uninterrupted view',
      'Sunset reflections over mirror waters reflecting barren mountain ridges'
    ],
    chauffeurTip: 'Acclimatize in Leh for at least 48 hours before crossing Chang La Pass.'
  },
  {
    id: 'exp-kapu-coastal',
    title: 'Kapu Granite Lighthouse & Arabian Sea Sunset Cliffs',
    category: 'coastal',
    categoryLabel: 'Coastal & Backwaters',
    destination: 'Karnataka',
    tourCategory: 'coastal',
    duration: 'Half Day • Coastline',
    rating: 4.8,
    reviews: 122,
    resolutionBadge: '8K Ultra-HD',
    image: '/hero-lighthouse.jpg',
    cameraSpec: 'Sony α7 IV • 24-70mm f/2.8 GM • 7680×4320 HDR',
    desc: 'Climb the 1901 stone maritime beacon overlooking massive dark granite boulders and golden Arabian Sea surf in coastal Udupi.',
    highlights: [
      'Private sunset climb to the original lighthouse balcony for 360° vistas',
      'Coastal walk along secluded sand stretches lined with coconut groves',
      'Authentic fresh Mangalorean ghee roast dinner at a heritage coastal diner'
    ],
    chauffeurTip: 'Arrive at 4:30 PM to explore the tide pools before the lighthouse opens its spiral stone stairway at 5:00 PM.'
  },
  {
    id: 'exp-wazwan-culinary',
    title: 'Kashmiri Wazwan Masterclass & Saffron Field Harvest',
    category: 'culinary',
    categoryLabel: 'Culinary Trails',
    destination: 'Kashmir',
    tourCategory: 'adventure',
    duration: 'Half Day • Masterclass',
    rating: 4.9,
    reviews: 76,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Fujifilm GFX 100 II • 45mm f/2.8 • 7680×4320 HDR',
    desc: 'Join hereditary Kashmiri Ustaad waza chefs to witness pounding of fresh lamb, saffron infusion, and simmering in traditional tinned copper degs.',
    highlights: [
      'Interactive 7-course Wazwan tasting including Rista, Rogan Josh & Gushtaba',
      'Visit to Pampore saffron farmers with genuine GI-tagged saffron tasting',
      'Authentic walnut wood carving workshop in downtown Srinagar'
    ],
    chauffeurTip: 'Pair the meal with authentic kehwa prepared in a classic brass samovar.'
  },
  {
    id: 'exp-amer-fort',
    title: 'Amer Palace Royal Private Entry & Nahargarh Sunset',
    category: 'heritage',
    categoryLabel: 'Royal Heritage & Forts',
    destination: 'Rajasthan',
    tourCategory: 'heritage',
    duration: 'Full Day • Royal Guide',
    rating: 4.9,
    reviews: 230,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Nikon Z9 • 24-70mm f/2.8 • 7680×4320 HDR',
    desc: 'Private access through sandstone ramparts, mirror-inlaid Sheesh Mahal, and evening tea atop Nahargarh Fort overlooking the entire illuminated Pink City.',
    highlights: [
      'Historian-escorted walk exploring hidden water harvesting tunnels',
      'Private candlelit chamber demonstration inside the Sheesh Mahal mirror palace',
      'Panoramic sunset views over Jaipur from the royal fortress ramparts'
    ],
    chauffeurTip: 'Enter through the Suraj Pol gate at 8:00 AM before tourist coaches arrive.'
  },
  {
    id: 'exp-goa-latin-quarter',
    title: 'Fontainhas Portuguese Heritage Walk & Latin Mansions',
    category: 'heritage',
    categoryLabel: 'Royal Heritage & Forts',
    destination: 'Goa',
    tourCategory: 'coastal',
    duration: '3 Hours • Heritage Specialist',
    rating: 4.8,
    reviews: 145,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Sony α7R V • 35mm f/1.4 GM • 7680×4320 HDR',
    desc: 'Stroll past yellow, indigo, and terracotta 18th-century mansions, azulejo tile galleries, and vintage bakeries with a Goan architectural custodian.',
    highlights: [
      'Exclusive entry into a restored private colonial mansion parlor',
      'Warm freshly baked bebinca and Goan poee tasting at an 80-year-old wood bakery',
      'Traditional fado music performance at a private veranda salon'
    ],
    chauffeurTip: 'Early mornings between 7:30 AM and 9:00 AM have the quietest streets and the warmest natural photography light.'
  },
  {
    id: 'exp-spiti-monastery',
    title: 'Key Monastery Dawn Puja & Spiti Valley Stargazing',
    category: 'himalayan',
    categoryLabel: 'Himalayan & Mountain',
    destination: 'Himachal',
    tourCategory: 'adventure',
    duration: 'Full Day • High Mountain',
    rating: 5.0,
    reviews: 92,
    resolutionBadge: '8K Ultra-HD',
    image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=2400&q=90',
    cameraSpec: 'Canon EOS R5 • 28-70mm f/2.0 • 7680×4320 HDR',
    desc: 'Perched at 13,668 ft, attend morning butter-lamp ceremonies and prayer chanting inside this 1,000-year-old Tibetan Buddhist monastic fortress.',
    highlights: [
      'Silent morning prayer attendance with Tibetan monks over herbal salt tea',
      'Ancient thangka scrolls and thousand-year-old mural viewing',
      'Astrophotography night session capturing the Milky Way core over Key Gompa'
    ],
    chauffeurTip: 'Carry warm thermals even during mid-summer; high mountain winds drop temperatures rapidly after dusk.'
  }
];

export default function ExperiencesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [active8kImage, setActive8kImage] = useState(null);
  const navigate = useNavigate();

  const filteredExperiences = selectedCategory === 'all'
    ? EXPERIENCES
    : EXPERIENCES.filter((exp) => exp.category === selectedCategory);

  const openLightbox = (exp) => {
    setActive8kImage(exp);
  };

  const closeLightbox = () => {
    setActive8kImage(null);
  };

  const handleNextImage = () => {
    if (!active8kImage) return;
    const currentIndex = EXPERIENCES.findIndex((e) => e.id === active8kImage.id);
    const nextIndex = (currentIndex + 1) % EXPERIENCES.length;
    setActive8kImage(EXPERIENCES[nextIndex]);
  };

  const handlePrevImage = () => {
    if (!active8kImage) return;
    const currentIndex = EXPERIENCES.findIndex((e) => e.id === active8kImage.id);
    const prevIndex = (currentIndex - 1 + EXPERIENCES.length) % EXPERIENCES.length;
    setActive8kImage(EXPERIENCES[prevIndex]);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-slate-900 pb-20">
      
      {/* 1. EDITORIAL HERO BANNER */}
      <section className="relative bg-[#131417] text-white pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle 8K Ambient Background Glow */}
        <div className="absolute inset-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2400&q=90"
            alt="8K Himalaya background"
            className="w-full h-full object-cover scale-105 filter blur-xs"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#131417] via-[#131417]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto text-left space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#B68D40]">
              The NammaYatra Anthology
            </span>
            <span className="flex items-center gap-1 bg-amber-500/15 text-amber-300 text-[10.5px] font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30">
              <Camera className="w-3 h-3 text-amber-400" />
              8K Ultra-HD Photography
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white max-w-4xl leading-tight">
            Curated Experiences Across India
          </h1>

          <p className="text-sm sm:text-base text-white/80 font-light max-w-2xl leading-relaxed">
            Move beyond conventional tourism. Every journey is hand-shaped around personal passions — from dawn chanting at sacred ghats to silent high-altitude Himalayan mountain passes.
          </p>

          {/* Quick Stats Strip */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-white/70 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-400 text-sm">12+</span>
              <span>Signature Travel Styles</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-400 text-sm">100%</span>
              <span>Verified Local Custodians</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-amber-400 text-sm">8K</span>
              <span>Ultra-HD Verified Routes</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CATEGORY FILTER TABS */}
      <section className="sticky top-[72px] z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-3.5 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 shrink-0 ${
                    isActive
                      ? 'bg-[#131417] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B68D40]' : 'text-slate-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCES SHOWCASE GRID */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 text-left">
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-semibold text-slate-900">
              {CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'All Experiences'}
            </h2>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Showing {filteredExperiences.length} handpicked authentic encounters across regional Bharat.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Click any card to inspect in 8K Lightbox
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredExperiences.map((exp) => (
            <article
              key={exp.id}
              className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* 8K Photo Preview with Lightbox Trigger */}
                <div
                  className="relative h-60 w-full overflow-hidden bg-slate-900 cursor-pointer"
                  onClick={() => openLightbox(exp)}
                  title="Click to view in 8K Ultra-HD Lightbox"
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-85 group-hover:opacity-65 transition-opacity" />

                  {/* Top Left: Destination & Category Tag */}
                  <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 flex-wrap">
                    <span className="bg-[#131417]/85 backdrop-blur-xs text-[#E5C989] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-[#E5C989]/30 flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {exp.destination}
                    </span>
                    <span className="bg-black/50 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded-full">
                      {exp.categoryLabel}
                    </span>
                  </div>

                  {/* Top Right: 8K Resolution Badge Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(exp);
                    }}
                    className="absolute top-3.5 right-3.5 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-400/40 text-[10px] font-bold text-amber-300 tracking-wider hover:bg-amber-500 hover:text-black transition shadow-sm"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>{exp.resolutionBadge}</span>
                  </button>

                  {/* Bottom Strip: Duration & Quick Lightbox prompt */}
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#B68D40]" />
                      <span className="text-[11.5px] font-medium">{exp.duration}</span>
                    </div>
                    <span className="text-[10.5px] font-semibold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                      <Camera className="w-3 h-3" /> View 8K
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 sm:p-6 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs font-bold text-slate-900">{exp.rating}</span>
                      <span className="text-[11px] text-slate-400">({exp.reviews} reviews)</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Sarathi Verified
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-semibold text-slate-900 leading-snug group-hover:text-[#B68D40] transition-colors line-clamp-2">
                    {exp.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-light">
                    {exp.desc}
                  </p>

                  {/* Curated Highlights List */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                      Curated Highlights
                    </span>
                    {exp.highlights.slice(0, 2).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-light">
                        <Check className="w-3.5 h-3.5 text-[#B68D40] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{hl}</span>
                      </div>
                    ))}
                  </div>

                  {/* Chauffeur Insider Tip */}
                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 space-y-0.5">
                    <span className="font-bold uppercase tracking-wider text-[9px] text-amber-800 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Chauffeur Insider Tip
                    </span>
                    <p className="text-slate-700 italic text-[11px] line-clamp-2">
                      "{exp.chauffeurTip}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="p-5 sm:p-6 pt-0 border-t border-slate-100 mt-2 flex items-center gap-2">
                <Link
                  to={`/tours?category=${exp.tourCategory}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition"
                >
                  <span>Explore Tours</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={() => navigate(`/custom-trip-planner?destination=${encodeURIComponent(exp.destination)}`)}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#B68D40] hover:bg-[#a77f34] text-white text-xs font-bold rounded-xl transition shadow-xs"
                >
                  <span>Plan Trip</span>
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* 4. BESPOKE TRIP CALL TO ACTION */}
        <section className="mt-16 bg-[#131417] text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-[#B68D40]/30 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">
            <div className="space-y-3 max-w-xl">
              <span className="text-[11px] uppercase font-bold tracking-[0.24em] text-[#B68D40] block">
                Tailored Specifically for You
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-white font-normal leading-tight">
                Want to combine multiple experiences into one seamless journey?
              </h3>
              <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                Use our interactive custom trip planner. Pick your private vehicle, choose accommodations, add experiences, and receive a transparent official quotation with zero middleman commissions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                to="/custom-trip-planner"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#B68D40] hover:bg-[#a77f34] text-white font-semibold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl transition shadow-md"
              >
                <span>Design Custom Itinerary</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tours"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium text-xs uppercase tracking-wider py-3.5 px-5 rounded-xl transition border border-white/20"
              >
                <span>All Pre-Crafted Tours</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 5. FULLSCREEN 8K LIGHTBOX MODAL */}
      {active8kImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="relative max-w-5xl w-full bg-[#131417] text-white rounded-3xl overflow-hidden border border-white/20 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-[#131417]">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-4">
                <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full border border-amber-400/40 shrink-0">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  8K Ultra-HD Preview
                </span>
                <div className="min-w-0">
                  <h3 className="font-serif text-sm sm:text-base text-white font-medium truncate">
                    {active8kImage.title}
                  </h3>
                  <p className="text-[11px] text-white/60 truncate font-mono">
                    {active8kImage.cameraSpec || '7680×4320 Resolution • Ultra-HD Hasselblad / Sony α7R V'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition"
                  title="Close 8K Lightbox"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Area with Left/Right Arrows */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px] sm:min-h-[440px]">
              <img
                src={active8kImage.image}
                alt={active8kImage.title}
                className="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain mx-auto"
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition shadow-lg"
                title="Previous 8K Photo"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-white border border-white/20 transition shadow-lg"
                title="Next 8K Photo"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Modal Footer: Description & Action */}
            <div className="p-4 sm:p-6 bg-[#181A1F] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-bold text-[#E5C989]">{active8kImage.destination}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/80">{active8kImage.duration}</span>
                  <span className="text-white/40">•</span>
                  <span className="text-amber-400 font-medium">★ {active8kImage.rating}</span>
                </div>
                <p className="text-xs text-white/70 line-clamp-2 font-light">
                  {active8kImage.desc}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    closeLightbox();
                    navigate(`/custom-trip-planner?destination=${encodeURIComponent(active8kImage.destination)}`);
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 bg-[#B68D40] hover:bg-[#a77f34] text-white text-xs font-bold rounded-xl transition shadow-md whitespace-nowrap"
                >
                  Plan Trip with this Experience
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

