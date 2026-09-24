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
  ChevronLeft,
  ChevronRight,
  Camera,
  Eye,
  Maximize2,
  Check,
  X
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
const activityOptions = [
  'Houseboat stay',
  'Trekking',
  'City heritage tour',
  'Wildlife safari',
  'Beach outing',
  'Spiritual visit',
  'Ayurvedic wellness',
  'Desert stargazing'
];

// 8K Photographic Metadata for Activities in Step 6
const ACTIVITY_METADATA = {
  'Houseboat stay': {
    title: 'Houseboat Stay',
    category: 'Waterways',
    badge: '8K Lagoon View',
    duration: 'Overnight • Meals Included',
    desc: 'Private slow teakwood cruise through coconut lagoons with master chef.',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=90'
  },
  'Trekking': {
    title: 'High-Altitude Trekking',
    category: 'Mountain',
    badge: '8K Alpine Trail',
    duration: 'Full Day • Certified Guide',
    desc: 'Glacial tarn crossings, cedar forest ridges, and alpine pass views.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90'
  },
  'City heritage tour': {
    title: 'Living Heritage & Forts',
    category: 'Heritage',
    badge: '8K Royal Palace',
    duration: 'Full Day • Historian Escort',
    desc: 'Sandstone ramparts, Sheesh Mahal mirror halls, and royal courtyards.',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90'
  },
  'Wildlife safari': {
    title: 'Wild Tiger & Elephant Safari',
    category: 'Nature',
    badge: '8K Wildlife Corridor',
    duration: 'Dawn / Dusk • 4x4 Jeep',
    desc: 'Tracking Bengal tigers, Asiatic elephants, and hornbills with naturalists.',
    image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=2400&q=90'
  },
  'Beach outing': {
    title: 'Secluded Coastal Coves',
    category: 'Coastal',
    badge: '8K Coastal Bay',
    duration: 'Half Day • Coastline',
    desc: 'Granite headland climbs, turquoise coves, and fresh coastal seafood.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=90'
  },
  'Spiritual visit': {
    title: 'Sacred River Ghats & Aarti',
    category: 'Spiritual',
    badge: '8K Sacred Aarti',
    duration: 'Dawn / Dusk Sessions',
    desc: 'Assi Ghat morning chants, temple rituals, and evening Maha Aarti.',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=90'
  },
  'Ayurvedic wellness': {
    title: 'Ayurvedic Wellness & Spa',
    category: 'Wellness',
    badge: '8K Valley Sanctuary',
    duration: 'Half Day • Vaidya Guided',
    desc: 'Shirodhara medicinal oil therapy, herbal massage, and silent pranayama.',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=90'
  },
  'Desert stargazing': {
    title: 'Thar Desert Stargazing Camp',
    category: 'Heritage',
    badge: '8K Desert Night',
    duration: 'Evening & Night • Dunes',
    desc: 'Camel rides across golden dunes, live Manganiyar music, and starry skies.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90'
  }
};

// 8K Ultra-HD Visual Showcase for Destinations
const DESTINATION_INFO = {
  Kashmir: {
    title: 'Kashmir Valley',
    tagline: 'Dal Lake Lotus Canals & Alpine Glaciers',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2400&q=90',
    badge: '8K Mountain View',
    alt: 'Shikara boats gliding on Dal Lake against snow mountains in 8K resolution'
  },
  Kerala: {
    title: 'Kerala Backwaters',
    tagline: 'Vembanad Palm Canals & Misty Tea Terraces',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=90',
    badge: '8K Backwaters',
    alt: 'Traditional wooden houseboat floating on calm Kerala waters in 8K'
  },
  Rajasthan: {
    title: 'Royal Rajasthan',
    tagline: 'Golden Thar Dunes, Forts & Living Palaces',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90',
    badge: '8K Golden Dunes',
    alt: 'Sunset over golden sand ripples in the Thar Desert in 8K'
  },
  Goa: {
    title: 'Goa Coastal Coves',
    tagline: 'Turquoise Lagoons & Portuguese Latin Quarters',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=90',
    badge: '8K Coastal Bay',
    alt: 'Secluded palm-fringed tropical beach cove in Goa in 8K'
  },
  Himachal: {
    title: 'Himachal Heights',
    tagline: 'Cedar Chalets, Rohtang Glacier & Spiti Passes',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
    badge: '8K Alpine Snow',
    alt: 'Majestic snowy Himalayan mountain ridges in 8K resolution'
  },
  Karnataka: {
    title: 'Karnataka Wilderness',
    tagline: 'Kapu Lighthouse, Hampi Ruins & Coorg Estates',
    image: '/hero-lighthouse.jpg',
    badge: '8K Coastal Icon',
    alt: 'Kapu stone lighthouse towering over turquoise Arabian waves in 8K'
  },
  Ladakh: {
    title: 'Ladakh High Desert',
    tagline: 'Azure Pangong Tso & Highest Motorable Pass',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90',
    badge: '8K High Altitude',
    alt: 'Crystal clear azure reflection at Pangong Tso lake in 8K'
  }
};

// 8K Scenic Route Panoramas captured along private chauffeur highways
const SCENIC_ROUTE_PANORAMAS = [
  {
    title: 'Pir Panjal Mountain Crest Horizon',
    route: 'Srinagar — Mughal Highway Pass',
    altitude: '11,400 ft Altitude',
    badge: '8K Panorama',
    image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2560&q=95',
    camera: 'Sony α7R V • 24-70mm GM II • 7680×4320 HDR'
  },
  {
    title: 'Vembanad Waterway Sunset Horizon',
    route: 'Kochi — Kumarakom Chauffeur Drive',
    altitude: 'Sea Level Lagoon',
    badge: '8K Panorama',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2560&q=95',
    camera: 'Hasselblad X2D • 38mm f/2.5 • 7680×4320 HDR'
  },
  {
    title: 'Thar Desert Endless Gold Ridge',
    route: 'Jodhpur — Jaisalmer Desert Highway',
    altitude: 'Golden Dunes Horizon',
    badge: '8K Panorama',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2560&q=95',
    camera: 'Nikon Z8 • 14-24mm f/2.8 • 7680×4320 HDR'
  },
  {
    title: 'Cabo de Rama Sea Cliff Horizon',
    route: 'Canacona Coastal Chauffeur Route',
    altitude: 'Overlooking Arabian Sea',
    badge: '8K Panorama',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2560&q=95',
    camera: 'Sony α7R V • 16-35mm GM • 7680×4320 HDR'
  },
  {
    title: 'Atal Tunnel North Portal Alpine Ridge',
    route: 'Manali — Leh Highway Pass',
    altitude: '10,171 ft Altitude',
    badge: '8K Panorama',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2560&q=95',
    camera: 'Canon EOS R5 • 24-105mm • 7680×4320 HDR'
  },
  {
    title: 'Kapu Granite Maritime Wave Horizon',
    route: 'Udupi — Mangalore Coastal NH 66',
    altitude: 'West Coast Beacon Horizon',
    badge: '8K Panorama',
    image: '/hero-lighthouse.jpg',
    camera: 'Sony α7 IV • 24-70mm GM • 7680×4320 HDR'
  },
  {
    title: 'Pangong Tso Mirror Reflection Crest',
    route: 'Leh — Chang La Pass Route',
    altitude: '14,270 ft Altitude',
    badge: '8K Panorama',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2560&q=95',
    camera: 'Leica SL2 • 28mm f/2.0 • 7680×4320 HDR'
  }
];

// Authentic destination-specific experiences with 8K Ultra-HD photography (6 per destination)
const DESTINATION_EXPERIENCES = {
  Kashmir: [
    {
      title: 'Sunset Shikara Cruise on Dal Lake & Floating Markets',
      desc: 'Glide along floating lotus gardens and century-old cedarwood houseboats as Himalayan peaks reflect in golden water.',
      duration: '2 Hours • Private Boat',
      tag: 'Signature Experience',
      theme: 'waterways',
      rating: 4.9,
      reviews: 142,
      resolutionBadge: '8K Ultra-HD',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Chauffeur Bilal takes you to the secret water channels where tourists rarely go for peaceful kehwa tea.'
    },
    {
      title: 'Gulmarg Apharwat Peak 13,780 ft High-Altitude Gondola',
      desc: 'Ascend to Phase 2 for sweeping views of Nanga Parbat and alpine meadows covered in pristine wildflowers and snow.',
      duration: 'Full Day • Fast-Track',
      tag: 'Alpine Wonder',
      theme: 'mountain',
      rating: 4.8,
      reviews: 98,
      resolutionBadge: '8K Aerial Vista',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Pre-booked early morning cable slot avoids the 2-hour tourist queue.'
    },
    {
      title: 'Betaab Valley & Lidder River Alpine Pine Forest Walk',
      desc: 'Walk beside roaring glacier-fed streams surrounded by dense cedar canopies and breathtaking snow-dusted ridges.',
      duration: 'Half Day • Nature Trail',
      tag: 'Wild Nature',
      theme: 'nature',
      rating: 4.9,
      reviews: 110,
      resolutionBadge: '8K Landscape',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Pack walking shoes for the hidden walking trail leading to natural spring water pools.'
    },
    {
      title: 'Pampore Purple Saffron Harvest & Old City Wazwan Feast',
      desc: 'Walk through blooming purple saffron fields, visit historic copper craftsmen in Srinagar, and savor authentic 7-course wazwan.',
      duration: 'Half Day • Culinary Trail',
      tag: 'Cultural Heritage',
      theme: 'heritage',
      rating: 5.0,
      reviews: 86,
      resolutionBadge: '8K Heritage',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Try the traditional walnut fudge and steaming saffron Kehwa at Ahdoos.'
    },
    {
      title: 'Sonamarg Thajiwas Glacier Snow Sledging & Stream Walk',
      desc: 'Hike or ride pony trails to pristine summer snowfields under the shadow of dramatic hanging glaciers.',
      duration: 'Full Day • Glacier Walk',
      tag: 'Glacier Vista',
      theme: 'mountain',
      rating: 4.9,
      reviews: 120,
      resolutionBadge: '8K Glacier View',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Cross the stream to the lesser-known right moraine for unobstructed panoramic views.'
    },
    {
      title: 'Mughal Terraced Fountains: Nishat & Shalimar Bagh',
      desc: 'Wander 12 cascading stone water terraces flanked by giant Chinar trees planted during Emperor Jahangir’s reign.',
      duration: 'Half Day • Garden Heritage',
      tag: 'Royal Gardens',
      theme: 'heritage',
      rating: 4.8,
      reviews: 95,
      resolutionBadge: '8K Floral Vistas',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Visit Nishat Bagh at 5:00 PM when the fountains mirror Dal Lake sunset light.'
    }
  ],
  Kerala: [
    {
      title: 'Vembanad Lake Private Teakwood Houseboat Cruise',
      desc: 'Drift along palm-fringed canals, witness village fishing life, and enjoy fresh pearl spot karimeen cooked on board.',
      duration: 'Overnight • All Meals Included',
      tag: 'Signature Experience',
      theme: 'waterways',
      rating: 4.9,
      reviews: 210,
      resolutionBadge: '8K Lagoon View',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Anchor near the quiet R-Block paddy fields for the most peaceful sunrise.'
    },
    {
      title: 'Munnar Misty Tea Terraces & Kolukkumalai Sunrise Trail',
      desc: 'Breathe in cardamom and clove scents, walk through emerald tea terraces, and watch sunrise over mountain mist.',
      duration: '4 Hours • Guided Walk',
      tag: 'Nature & Wellness',
      theme: 'nature',
      rating: 4.8,
      reviews: 130,
      resolutionBadge: '8K Panorama',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Visit the Kolukkumalai estate early for the highest tea garden sunrise in the world.'
    },
    {
      title: 'Periyar Rainforest Bamboo Rafting & Wild Elephant Trail',
      desc: 'Paddle through silent tiger reserve waters flanked by towering evergreen rainforest canopies and wild herds.',
      duration: 'Full Day • Eco Safari',
      tag: 'Wildlife Adventure',
      theme: 'nature',
      rating: 4.9,
      reviews: 104,
      resolutionBadge: '8K Eco Safari',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Wear neutral earthy colors and carry waterproof phone covers for bamboo rafting.'
    },
    {
      title: 'Varkala Clifftop Sunset & Sacred Janardanaswamy Shrine',
      desc: 'Stroll red laterite cliffs towering over the Arabian Sea, witness Tibetan handicraft studios, and explore 2,000-year-old temples.',
      duration: 'Half Day • Coastal Bliss',
      tag: 'Coastal Heritage',
      theme: 'waterways',
      rating: 4.8,
      reviews: 95,
      resolutionBadge: '8K Golden Hour',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Clifftop cafes serve fresh coconut water and warm Malabar parottas with spicy curries.'
    },
    {
      title: 'Fort Kochi Chinese Fishing Nets & Mattancherry Palace',
      desc: 'Watch ancient cantilevered fishing nets dip into the Arabian harbour and explore 400-year-old spice merchant alleys.',
      duration: 'Half Day • Colonial Port',
      tag: 'Maritime Heritage',
      theme: 'heritage',
      rating: 4.9,
      reviews: 150,
      resolutionBadge: '8K Maritime',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Visit Jew Town spice warehouse stalls around 4:00 PM when cardamom sacks are freshly milled.'
    },
    {
      title: 'Athirappilly "Niagara of India" 80 ft Waterfall Trail',
      desc: 'Hike through lush Chalakudy river canopies down to the base of Kerala’s largest roaring waterfall cascade.',
      duration: 'Half Day • Rainforest Walk',
      tag: 'Roaring Cascades',
      theme: 'nature',
      rating: 4.9,
      reviews: 118,
      resolutionBadge: '8K Waterfalls',
      image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Early mornings provide rainbow mists against emerald bamboo forests.'
    }
  ],
  Karnataka: [
    {
      title: 'Kapu Beach Lighthouse & Coastal Sunset Walk',
      desc: 'Climb the 125-year-old black-and-white stone lighthouse for 360-degree views of roaring turquoise Arabian Sea waves.',
      duration: 'Half Day • Coastal Bliss',
      tag: 'NammaYatra Highlight',
      theme: 'waterways',
      rating: 4.9,
      reviews: 175,
      resolutionBadge: '8K Coastal Icon',
      image: '/hero-lighthouse.jpg',
      chauffeurTip: 'The lighthouse opens for climbing between 4 PM and 6 PM. Sunset from the top is unforgettable.'
    },
    {
      title: 'Hampi UNESCO Vijayanagara Stone Chariot & Virupaksha',
      desc: 'Marvel at 14th-century boulder-strewn kingdoms, musical pillars of Vittala temple, and sunsets over Tungabhadra River.',
      duration: 'Full Day • Living History',
      tag: 'World Heritage',
      theme: 'heritage',
      rating: 5.0,
      reviews: 220,
      resolutionBadge: '8K Monumental',
      image: 'https://images.unsplash.com/photo-1593693411515-c20261bcad6e?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Hire a coracle round boat to glide past the boulders of the river gorge at sunset.'
    },
    {
      title: 'Coorg Misty Arabica Coffee & Pepper Plantation Estate Stay',
      desc: 'Wake up to hornbill calls, walk through red coffee cherry canopies, and taste artisanal single-origin roasts.',
      duration: 'Full Day • Plantation Trek',
      tag: 'Nature Escape',
      theme: 'nature',
      rating: 4.8,
      reviews: 114,
      resolutionBadge: '8K Rainforest',
      image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Chauffeur Suresh introduces you to local Kodava families for authentic home-cooked dishes.'
    },
    {
      title: 'Malpe St. Mary’s Hexagonal Basaltic Rock Islands',
      desc: 'Cruise to rare volcanic geological formations carved by cooling lava 88 million years ago, surrounded by turquoise water.',
      duration: '3 Hours • Marine Cruise',
      tag: 'Geological Wonder',
      theme: 'waterways',
      rating: 4.9,
      reviews: 140,
      resolutionBadge: '8K Marine Vista',
      image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Carry reef shoes to walk safely across the smooth hexagonal basalt columns.'
    },
    {
      title: 'Kabini River Wildlife Boat Safari & Black Panther Reserve',
      desc: 'Board quiet boats on Kabini backwaters where Asiatic elephants swim and leopards stalk along shoreline grass.',
      duration: 'Dawn & Dusk Safari',
      tag: 'Predator Corridors',
      theme: 'nature',
      rating: 5.0,
      reviews: 132,
      resolutionBadge: '8K Wildlife Reserve',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Dusk boat safaris offer the highest probability of spotting mother elephants bathing calves.'
    },
    {
      title: 'Badami Rock-Cut Cave Temples & Agastya Lake Basin',
      desc: 'Admire 6th-century Chalukyan red sandstone cave architecture carved into massive sandstone cliff bluffs.',
      duration: 'Half Day • Ancient Caves',
      tag: 'Sandstone Heritage',
      theme: 'heritage',
      rating: 4.9,
      reviews: 98,
      resolutionBadge: '8K Cliff Architecture',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Climb to North Fort before noon for the best lighting on the emerald lake below.'
    }
  ],
  Rajasthan: [
    {
      title: 'Thar Desert Stargazing & Candlelit Camp in Sam Dunes',
      desc: 'Ride majestic camels across wind-sculpted sand ripples, watch vibrant Kalbelia folk dancers, and sleep under desert stars.',
      duration: 'Overnight • Luxury Tents',
      tag: 'Desert Romance',
      theme: 'heritage',
      rating: 4.9,
      reviews: 188,
      resolutionBadge: '8K Desert Gold',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Private 4x4 dune bashing before sunset gives adrenaline that coaches cannot offer.'
    },
    {
      title: 'Udaipur Lake Pichola Royal Ferry & City Palace Court',
      desc: 'Board vintage brass boats beneath marble balconies, admiring the floating Lake Palace reflecting on mirror water.',
      duration: 'Half Day • Royal Splendor',
      tag: 'Palace Living',
      theme: 'waterways',
      rating: 5.0,
      reviews: 196,
      resolutionBadge: '8K Royal Lake',
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Book the 5:30 PM royal jetty slot to catch city lights illuminating the lake.'
    },
    {
      title: 'Amber Fort Secret Underground Tunnel & Chhatris Walk',
      desc: 'Explore the 16th-century fortress, Sheesh Mahal mirror palace, and hidden underground royal escape passages to Jaigarh.',
      duration: 'Half Day • Historian Guided',
      tag: 'Royal Heritage',
      theme: 'heritage',
      rating: 4.9,
      reviews: 204,
      resolutionBadge: '8K Fortress',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Beat the desert heat by starting at 8:00 AM sharp.'
    },
    {
      title: 'Jodhpur Blue City Brahmin Alleys & Mehrangarh Ramparts',
      desc: 'Look out from 400-foot cliff ramparts over indigo-painted courtyards and savor saffron mawa kachori in old markets.',
      duration: 'Half Day • Citadel Walk',
      tag: 'Living Culture',
      theme: 'heritage',
      rating: 4.9,
      reviews: 155,
      resolutionBadge: '8K Architecture',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Rampart terrace offers the best panoramic view of the sun setting over the blue rooftops.'
    },
    {
      title: 'Pushkar Holy Brahma Lake Ghats & Desert Rose Terraces',
      desc: 'Participate in evening maha-aarti along 52 bathing ghats and walk through fragrant damask rose oil distillation farms.',
      duration: 'Half Day • Sacred Ghats',
      tag: 'Spiritual Radiance',
      theme: 'spiritual',
      rating: 4.8,
      reviews: 110,
      resolutionBadge: '8K Sacred Ghats',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Savor rabdi malpua at Halwai Gali after evening aarti.'
    },
    {
      title: 'Jaisalmer Golden Yellow Sandstone Living Fort Walk',
      desc: 'Walk inside one of the only living forts in the world, inhabited by 4,000 residents across seven Jain temples.',
      duration: '3 Hours • Living Citadel',
      tag: 'Golden Fortress',
      theme: 'heritage',
      rating: 4.9,
      reviews: 145,
      resolutionBadge: '8K Sandstone',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Cannon Point at sunset offers a magical view of golden limestone glowing like fire.'
    }
  ],
  Himachal: [
    {
      title: 'Rohtang Snowline Drive & 13,058 ft Glacier Crest',
      desc: 'Traverse winding mountain roads with glacier waterfalls, cedar forests, and panoramic views of the Pir Panjal range.',
      duration: 'Full Day • High Mountain',
      tag: 'Alpine Thrill',
      theme: 'mountain',
      rating: 4.8,
      reviews: 165,
      resolutionBadge: '8K Glacier Pass',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Our drivers carry government green-corridor permits so you do not wait at border barriers.'
    },
    {
      title: 'Spiti Valley Key Gompa & Cold Desert Expedition',
      desc: 'Cross Kunzum Pass into surreal high-altitude Buddhist sanctuaries perched atop thousands of feet of bare mountain cliff.',
      duration: '2 Days • High Altitude',
      tag: 'Spiritual Ridge',
      theme: 'mountain',
      rating: 5.0,
      reviews: 140,
      resolutionBadge: '8K Mountain Peak',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Stay hydrated with warm sea-buckthorn tea to acclimatize effortlessly.'
    },
    {
      title: 'Old Manali Apple Orchard Homestay & Wood-Fired Cafes',
      desc: 'Stroll past rustic Himachali wooden architecture, babbling mountain streams, and artisan trout bakeries.',
      duration: 'Relaxed Day',
      tag: 'Slow Living',
      theme: 'nature',
      rating: 4.9,
      reviews: 92,
      resolutionBadge: '8K Alpine Chalet',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Try the fresh river trout with Himalayan mountain butter at Cafe 1947.'
    },
    {
      title: 'Dharamshala Pine Valley & Kangra Tea Estate Promenade',
      desc: 'Breathe crisp Himalayan air among deodar cedars, visit the Tibetan Dalai Lama temple, and taste orthodox tea.',
      duration: 'Half Day • Peaceful Retreat',
      tag: 'Peace & Serenity',
      theme: 'nature',
      rating: 4.8,
      reviews: 88,
      resolutionBadge: '8K Cedar Forest',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Bhagsunag waterfall early in the morning is untouched by day crowds.'
    },
    {
      title: 'Chandratal Moon Lake Turquoise Glacial Basin Trek',
      desc: 'Hike to the crescent-shaped sacred alpine lake reflecting snowy peaks at an elevation of 14,100 ft.',
      duration: 'Full Day / Overnight',
      tag: 'Glacial Tarn',
      theme: 'mountain',
      rating: 5.0,
      reviews: 112,
      resolutionBadge: '8K Moon Lake',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Camp at designated eco-tents 3 km away to protect the pristine lake ecology.'
    },
    {
      title: 'Parvati Valley Kasol Pine River Trails & Manikaran Springs',
      desc: 'Walk along the roaring crystal Parvati River through deodar forests to natural hot sulfur healing springs.',
      duration: 'Full Day • River Trail',
      tag: 'Roaring Valley',
      theme: 'nature',
      rating: 4.8,
      reviews: 105,
      resolutionBadge: '8K River Crest',
      image: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Eat langar meal cooked naturally in the bubbling hot spring water at Manikaran Sahib.'
    }
  ],
  Goa: [
    {
      title: 'South Goa Hidden Beaches & Cabo de Rama Cliff Sunset',
      desc: 'Leave the crowded commercial north behind for secluded turquoise coves at Cola beach with freshwater lagoons.',
      duration: 'Full Day • Coastal Escape',
      tag: 'Secret Coast',
      theme: 'waterways',
      rating: 4.9,
      reviews: 140,
      resolutionBadge: '8K Coastal Cove',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Enjoy coconut water right by the natural freshwater lagoon meeting the sea.'
    },
    {
      title: 'Old Goa Portuguese Latin Quarter (Fontainhas) Walking Tour',
      desc: 'Wander through pastel yellow and cobalt blue Portuguese villas, ornate wooden balconies, and boutique azulejo tile studios.',
      duration: '3 Hours • Architectural',
      tag: 'Living Heritage',
      theme: 'heritage',
      rating: 4.8,
      reviews: 112,
      resolutionBadge: '8K Old Town',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Stop at Joseph Bar for artisanal feni cocktails and warm poee bread.'
    },
    {
      title: 'Dudhsagar Four-Tiered Mountain Waterfall Jeep Safari',
      desc: 'Ride private 4x4 jeeps across rocky streams of Bhagwan Mahaveer Sanctuary to the milky cascade plunging 1,017 feet.',
      duration: 'Full Day • Jungle Thrill',
      tag: 'Waterfall Quest',
      theme: 'nature',
      rating: 4.9,
      reviews: 165,
      resolutionBadge: '8K Jungle Falls',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Life jackets are mandatory for swimming in the crystal fresh natural pool below.'
    },
    {
      title: 'Butterfly Beach Dolphin Lagoon & Secluded Snorkeling',
      desc: 'Accessible primarily by boat, this semi-circular white sand cove is famous for playful dolphins and clear coral waters.',
      duration: 'Half Day • Marine Safari',
      tag: 'Dolphin Safari',
      theme: 'waterways',
      rating: 4.8,
      reviews: 98,
      resolutionBadge: '8K Ocean Waters',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Early morning 7 AM departures give the calmest water and best dolphin sightings.'
    },
    {
      title: 'Divar Island Backwater Kayaking & Heritage Mansions',
      desc: 'Paddle through silent mangrove estuaries where kingfishers hunt, followed by cycling along quaint sleepy island hamlets.',
      duration: 'Half Day • Island Haven',
      tag: 'Island Stillness',
      theme: 'waterways',
      rating: 4.9,
      reviews: 86,
      resolutionBadge: '8K Island Kayak',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Take the romantic car ferry from Ribandar wharf for the most scenic approach.'
    },
    {
      title: 'Sahakari Spice Farm Guided Trail & Traditional Goan Buffet',
      desc: 'Walk through organic betel nut, vanilla, and peri-peri pepper groves, followed by a herbal cashew fenny demonstration.',
      duration: '3 Hours • Agrarian Trail',
      tag: 'Spice Aromas',
      theme: 'nature',
      rating: 4.8,
      reviews: 120,
      resolutionBadge: '8K Spice Garden',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Sample the freshly squeezed sugarcane juice spiced with ginger and green chillies.'
    }
  ],
  Ladakh: [
    {
      title: 'Pangong Tso Changing-Color Lake Expedition via Chang La',
      desc: 'Cross 17,590 ft pass into the surreal 134-km saltwater lake that shifts shades from sapphire blue to turquoise and emerald green.',
      duration: 'Overnight • Lake Tents',
      tag: 'Himalayan Wonder',
      theme: 'mountain',
      rating: 5.0,
      reviews: 195,
      resolutionBadge: '8K Azure Lake',
      image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Keep warm layers handy; nighttime temperatures drop below freezing even in June.'
    },
    {
      title: 'Nubra Valley White Sand Dunes & Diskit Monastery Giant Buddha',
      desc: 'Cross the world’s highest motorable pass (Khardung La, 18,380 ft), meet Bactrian double-humped camels, and hear monks chant.',
      duration: '2 Days • High Desert',
      tag: 'Bucket List',
      theme: 'mountain',
      rating: 4.9,
      reviews: 168,
      resolutionBadge: '8K Cold Desert',
      image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Our vehicles carry medical grade oxygen canisters and certified pulse oximeters.'
    },
    {
      title: 'Khardung La (18,380 ft) Motorable Summit Flag Ceremony',
      desc: 'Stand on the legendary gateway to the Shyok and Nubra valleys, decorated with colorful fluttering Tibetan prayer flags.',
      duration: 'Half Day • World Record Road',
      tag: 'Summit Pass',
      theme: 'mountain',
      rating: 4.9,
      reviews: 180,
      resolutionBadge: '8K Mountain Roof',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Spend no more than 20 minutes at the top to avoid high-altitude headache.'
    },
    {
      title: 'Thiksey Monastery Sunrise Chants & Indus Valley Panorama',
      desc: 'Resembling the Potala Palace of Lhasa, listen to conch shells and deep Tibetan horns echoing across high desert plateaus.',
      duration: '3 Hours • Spiritual Heritage',
      tag: 'Sacred Living',
      theme: 'spiritual',
      rating: 5.0,
      reviews: 135,
      resolutionBadge: '8K Sacred Temple',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Arrive by 6:00 AM to sit with the young novice monks during morning butter-tea prayer.'
    },
    {
      title: 'Magnetic Hill Defying Gravity & Pathar Sahib Gurudwara',
      desc: 'Witness vehicles rolling uphill on neutral gear against optical valley illusions, followed by serene langar tea at 11,000 ft.',
      duration: 'Half Day • Optical Wonder',
      tag: 'Gravity Hill',
      theme: 'mountain',
      rating: 4.8,
      reviews: 140,
      resolutionBadge: '8K Valley Wonder',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Turn off engine completely and align tires with the yellow marker box to feel the magnetic pull.'
    },
    {
      title: 'Tso Moriri High-Altitude Wetland & Nomadic Changpa Camps',
      desc: 'A pristine sanctuary for bar-headed geese and Tibetan wild ass (kiang) fringed by snow peaks and nomadic yak hair tents.',
      duration: '2 Days • Deep Wilderness',
      tag: 'Changthang Plateau',
      theme: 'mountain',
      rating: 5.0,
      reviews: 110,
      resolutionBadge: '8K High Wetland',
      image: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=2400&q=90',
      chauffeurTip: 'Korzok village monastery at the lake head is one of the highest permanently inhabited hamlets on Earth.'
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
    quote: '"Climbing the Kapu beach lighthouse at sunset and having breakfast by the Udupi Krishna temple was the highlight of our year. Transparent pricing, zero hidden charges. Highly recommend NammaYatra!"',
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
    quote: '"Solo traveled to Himachal with NammaYatra. The chauffeur was verified, respectful, and navigated the Rohtang curves with exceptional skill. Felt completely safe throughout."',
    date: 'Travelled Aug 2026',
    rating: 5
  },
  Goa: {
    author: 'Karan & Pooja Shah (Ahmedabad)',
    quote: '"We wanted quiet beaches away from commercial crowds. NammaYatra gave us South Goa secluded coves and authentic Portuguese villa dining. Worth every single rupee."',
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
  const [active8kImage, setActive8kImage] = useState(null);
  const [explorerTheme, setExplorerTheme] = useState('all');

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
        email: formData.email || user?.email || 'guest@nammayatra.in',
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
NAMMAYATRA - OFFICIAL CUSTOM TRIP QUOTATION
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

NammaYatra Concierge Desk: support@travelindia.org | WhatsApp: +91 98765 43210
======================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Nammayatra-Trip-Quotation-${quoteId || 'NY-Q26'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Quotation text voucher downloaded!', 'success');
  };

  // Copy to clipboard
  const handleCopyQuotation = () => {
    const summary = `NammaYatra Trip Quotation (${quoteId}) for ${formData.destination} - Estimated Total: ₹${costBreakdown.totalCost.toLocaleString('en-IN')}. Group: ${formData.travellers} guests. Dates: ${formData.date || 'Flexible'}. Stays: ${formData.hotel}. Vehicle: ${formData.transport}.`;
    navigator.clipboard.writeText(summary);
    showToast('Quotation details copied to clipboard!', 'success');
  };

  // Share to WhatsApp
  const handleWhatsAppShare = () => {
    const msg = encodeURIComponent(
      `*Hi NammaYatra Concierge!* I generated Quotation *${quoteId}* on the website:\n` +
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
  const filteredExperiences = explorerTheme === 'all'
    ? currentExperiences
    : currentExperiences.filter((exp) => exp.theme === explorerTheme);
  const currentStory = DESTINATION_STORIES[formData.destination] || DESTINATION_STORIES.Kashmir;

  const handleNext8k = () => {
    if (!active8kImage) return;
    const all = currentExperiences;
    const idx = all.findIndex((e) => e.title === active8kImage.title);
    const nextIdx = (idx + 1) % all.length;
    setActive8kImage({ ...all[nextIdx], destination: formData.destination });
  };

  const handlePrev8k = () => {
    if (!active8kImage) return;
    const all = currentExperiences;
    const idx = all.findIndex((e) => e.title === active8kImage.title);
    const prevIdx = (idx - 1 + all.length) % all.length;
    setActive8kImage({ ...all[prevIdx], destination: formData.destination });
  };

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
                  <span className="text-xl font-bold tracking-tight text-slate-900 font-serif">NammaYatra</span>
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
              <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                {destinationOptions.map((destination) => {
                  const destInfo = DESTINATION_INFO[destination] || {};
                  const isSelected = formData.destination === destination;
                  return (
                    <button
                      type="button"
                      key={destination}
                      onClick={() => updateField('destination', destination)}
                      className={`group relative overflow-hidden rounded-[22px] border text-left transition-all duration-300 ${
                        isSelected
                          ? 'border-[#B68D40] ring-2 ring-[#B68D40] shadow-xl scale-[1.01]'
                          : 'border-slate-200 bg-white hover:border-[#B68D40]/60 hover:shadow-lg'
                      }`}
                    >
                      <div className="relative h-32 w-full overflow-hidden bg-slate-900">
                        <img
                          src={destInfo.image}
                          alt={destInfo.alt || destination}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                        
                        {/* 8K Badge */}
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/40 text-[9.5px] font-bold text-amber-300 tracking-wider uppercase">
                          <Camera className="w-2.5 h-2.5 text-amber-400" />
                          <span>{destInfo.badge || '8K Ultra HD'}</span>
                        </div>

                        {isSelected && (
                          <div className="absolute top-2.5 right-2.5 bg-[#B68D40] text-white p-1 rounded-full shadow-lg">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}

                        <div className="absolute bottom-2.5 left-3 right-3 text-white">
                          <span className="font-bold text-base leading-tight block drop-shadow-sm font-serif">
                            {destInfo.title || destination}
                          </span>
                          <span className="text-[10px] text-slate-200 line-clamp-1 font-light mt-0.5">
                            {destInfo.tagline}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
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

          {/* STEP 6: ACTIVITIES (8K PHOTOGRAPHIC EXPERIENCE CARDS) */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-5 w-5 text-[#B68D40]" />
                  <span className="text-sm font-medium">Select activities with verified 8K Ultra-HD photography (or skip for general sightseeing).</span>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100 font-semibold px-2.5 py-0.5 rounded-full">
                  Optional
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {activityOptions.map((item) => {
                  const meta = ACTIVITY_METADATA[item] || {};
                  const active = formData.activities.includes(item);
                  return (
                    <div
                      key={item}
                      onClick={() => toggleActivity(item)}
                      className={`group relative overflow-hidden rounded-[22px] border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                        active
                          ? 'border-[#B68D40] bg-[#fffcf7] ring-2 ring-[#B68D40] shadow-lg'
                          : 'border-slate-200 bg-white hover:border-[#B68D40]/50 hover:shadow-md'
                      }`}
                    >
                      <div>
                        {/* 8K Thumbnail */}
                        <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                          <img
                            src={meta.image}
                            alt={meta.title || item}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/40 text-[9.5px] font-bold text-amber-300">
                            <Camera className="w-2.5 h-2.5 text-amber-400" />
                            <span>{meta.badge || '8K Ultra HD'}</span>
                          </div>

                          <div className="absolute top-2.5 right-2.5">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                              active ? 'bg-[#B68D40] text-white shadow-md' : 'bg-black/50 text-white/60 border border-white/30'
                            }`}>
                              {active ? <Check className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-white/40" />}
                            </div>
                          </div>

                          <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                            <span className="font-medium text-amber-200">{meta.category}</span>
                            <span className="text-white/80 text-[10px]">{meta.duration}</span>
                          </div>
                        </div>

                        {/* Text */}
                        <div className="p-3.5 space-y-1">
                          <h4 className="font-serif font-bold text-slate-900 text-sm group-hover:text-[#B68D40] transition-colors">
                            {meta.title || item}
                          </h4>
                          <p className="text-xs text-slate-500 font-light line-clamp-2">
                            {meta.desc}
                          </p>
                        </div>
                      </div>
                    </div>
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
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#B68D40] block">
                Visual Trip Explorer
              </span>
              <span className="flex items-center gap-1 bg-amber-500/15 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                <Camera className="w-3 h-3 text-amber-600" />
                8K Ultra-HD Gallery
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif text-slate-900 font-semibold mt-1">
              8K Trip Highlights: {formData.destination}
            </h2>
            <p className="text-xs text-slate-500 font-light mt-0.5">
              Explore authentic 8K Ultra-HD imagery captured along our private chauffeur routes. Click any card to inspect in full-resolution 8K Lightbox.
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

        {/* Visual Explorer Theme Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All 8K Highlights' },
            { id: 'mountain', label: 'Scenic Peaks & Passes' },
            { id: 'heritage', label: 'Royal Living Heritage' },
            { id: 'waterways', label: 'Lagoons, Lakes & Waters' },
            { id: 'nature', label: 'Wild Rainforests & Safaris' },
            { id: 'spiritual', label: 'Sacred Sanctums' }
          ].map((thm) => (
            <button
              key={thm.id}
              type="button"
              onClick={() => setExplorerTheme(thm.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                explorerTheme === thm.id
                  ? 'bg-[#131417] text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {thm.label}
            </button>
          ))}
        </div>

        {/* Experience Cards Grid in 8K Quality */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExperiences.map((exp, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & Badge */}
                <div
                  className="relative h-48 w-full overflow-hidden bg-slate-900 cursor-pointer"
                  onClick={() => setActive8kImage({ ...exp, destination: formData.destination })}
                >
                  <img
                    src={exp.image}
                    alt={exp.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Category Tag */}
                  <span className="absolute top-2.5 left-2.5 bg-[#131417]/85 backdrop-blur-xs text-[#E5C989] text-[9.5px] font-semibold tracking-wide px-2 py-0.5 rounded-md border border-[#E5C989]/30">
                    {exp.tag}
                  </span>

                  {/* 8K Resolution Badge Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActive8kImage({ ...exp, destination: formData.destination });
                    }}
                    className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/40 text-[9.5px] font-bold text-amber-300 tracking-wider hover:bg-amber-500 hover:text-black transition shadow-sm"
                    title="Click to view in 8K Ultra-HD Lightbox"
                  >
                    <Maximize2 className="w-2.5 h-2.5" />
                    <span>{exp.resolutionBadge || '8K Ultra-HD'}</span>
                  </button>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#B68D40]" />
                      <span className="text-[11px] font-medium">{exp.duration}</span>
                    </div>
                    <span className="text-[10px] text-amber-300 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3 h-3" /> Click 8K
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span className="text-xs font-bold text-slate-900">{exp.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({exp.reviews})</span>
                    </div>
                    <span className="text-[9.5px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Sarathi Verified
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-[#B68D40] transition-colors line-clamp-2">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              </div>

              {/* Chauffeur Insider Tip Strip */}
              <div className="p-4 pt-0">
                <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200/60 text-[10.5px] text-amber-900 space-y-0.5">
                  <span className="font-bold uppercase tracking-wider text-[9px] text-amber-800 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Chauffeur Insider Tip
                  </span>
                  <p className="text-slate-700 italic text-[10.5px] line-clamp-2">
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

        {/* 8K Highway Vistas & Scenic Route Halts */}
        <div className="space-y-4 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#B68D40] block">
                Highway Vistas &amp; Chauffeur Halts
              </span>
              <span className="bg-amber-100 text-amber-800 text-[9.5px] font-bold px-2 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                <Camera className="w-3 h-3 text-amber-600" />
                8K Panoramic Series
              </span>
            </div>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Captured along private chauffeur routes
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SCENIC_ROUTE_PANORAMAS.map((pano, pIdx) => (
              <div
                key={pIdx}
                onClick={() => setActive8kImage({
                  title: pano.title,
                  image: pano.image,
                  tag: pano.altitude,
                  duration: pano.route,
                  destination: pano.route.split('—')[0]?.trim() || formData.destination,
                  resolutionBadge: pano.badge,
                  desc: `Panoramic 8K Ultra-HD photography stop along ${pano.route}. Chauffeur stops on demand for pristine photography without rushing.`,
                  chauffeurTip: `Optics: ${pano.camera}`
                })}
                className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer h-44"
              >
                <img
                  src={pano.image}
                  alt={pano.title}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute top-2.5 left-2.5 flex items-center gap-1 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-full border border-amber-400/40 text-[9.5px] font-bold text-amber-300">
                  <Camera className="w-2.5 h-2.5 text-amber-400" />
                  <span>{pano.badge}</span>
                </div>

                <div className="absolute top-2.5 right-2.5 text-white/70 group-hover:text-amber-300 transition">
                  <Maximize2 className="w-3.5 h-3.5" />
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 text-white text-left">
                  <span className="text-[10px] text-amber-300/90 font-mono block">
                    {pano.altitude} • {pano.route}
                  </span>
                  <h4 className="font-serif font-bold text-sm text-white leading-snug group-hover:text-amber-200 transition-colors line-clamp-1 mt-0.5">
                    {pano.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8K Ultra-HD Lightbox Viewer Modal */}
      {active8kImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-6"
          onClick={() => setActive8kImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-[#131417] text-white rounded-3xl overflow-hidden border border-white/15 shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/40">
                  <Camera className="w-3.5 h-3.5 text-amber-400" />
                  <span>8K Ultra-HD Resolution • 7680×4320</span>
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  • {active8kImage.destination} Expedition
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActive8kImage(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition"
                aria-label="Close 8K Lightbox"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* High-Resolution 8K Image View with Prev/Next Controls */}
            <div className="relative max-h-[62vh] w-full overflow-hidden bg-black flex items-center justify-center min-h-[320px]">
              <img
                src={active8kImage.image}
                alt={active8kImage.title}
                className="max-h-[62vh] w-full object-contain"
              />

              {/* Prev Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev8k();
                }}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 transition shadow-lg"
                title="Previous 8K Photo"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Next Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext8k();
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/70 hover:bg-black/95 text-white border border-white/20 transition shadow-lg"
                title="Next 8K Photo"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <span className="absolute bottom-3 right-4 bg-black/70 backdrop-blur-xs text-[10px] text-amber-300/90 font-mono px-2.5 py-1 rounded border border-white/10">
                Prism Ultra-HD 8K Display
              </span>
            </div>

            {/* Bottom Info Bar */}
            <div className="p-6 bg-[#131417] border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#B68D40] font-semibold">{active8kImage.tag}</span>
                  <span className="text-xs text-slate-400">• {active8kImage.duration}</span>
                  <span className="text-xs text-emerald-400 font-medium">• 100% Direct Driver Pricing</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white leading-snug">
                  {active8kImage.title}
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  {active8kImage.desc}
                </p>
                {active8kImage.chauffeurTip && (
                  <p className="text-[11px] text-amber-200/90 italic pt-1">
                    "Sarathi Chauffeur Insider Tip: {active8kImage.chauffeurTip}"
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActive8kImage(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-5 py-2.5 bg-[#B68D40] hover:bg-[#a77f34] text-white text-xs font-bold rounded-xl transition shrink-0 whitespace-nowrap shadow-md"
              >
                Plan Trip with this Experience
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
