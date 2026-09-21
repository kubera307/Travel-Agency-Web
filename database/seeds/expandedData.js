/**
 * Expanded Destinations and Tours for Travel India Platform
 * 13 additional destinations and 14 detailed tour packages
 */

const expandedDestinations = [
  {
    id: 'ladakh',
    name: 'Leh & Ladakh',
    slug: 'ladakh',
    state: 'Ladakh',
    country: 'India',
    tag: 'Roof of the World',
    short_description: 'High-altitude deserts, cobalt blue Pangong Tso, Buddhist gompas & Khardung La pass.',
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Pangong Tso • Nubra Valley • Khardung La • Thiksey Monastery',
    popular_pickups: JSON.stringify(['Leh Kushok Bakula Rimpochee Airport', 'Leh Main Bazaar', 'Choglamsar', 'Changspa Rd']),
    total_packages: 3
  },
  {
    id: 'uttarakhand',
    name: 'Uttarakhand (Rishikesh & Mussoorie)',
    slug: 'uttarakhand',
    state: 'Uttarakhand',
    country: 'India',
    tag: 'Devbhoomi & Adventure',
    short_description: 'Yoga capital on the holy Ganga, roaring river rapids, Beatles Ashram & misty queen of hills.',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Laxman Jhula • Ganga Aarti • Shivpuri Rafting • Kempty Falls',
    popular_pickups: JSON.stringify(['Dehradun Jolly Grant Airport', 'Haridwar Railway Station', 'Rishikesh Tapovan', 'Mussoorie Mall Road']),
    total_packages: 3
  },
  {
    id: 'andaman',
    name: 'Andaman & Nicobar Islands',
    slug: 'andaman',
    state: 'Andaman & Nicobar',
    country: 'India',
    tag: 'Tropical Island Paradise',
    short_description: 'White-sand coral beaches, emerald turquoise waters, scuba adventures & historic Cellular Jail.',
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Radhanagar Beach • Cellular Jail • Elephant Beach Scuba • Ross Island',
    popular_pickups: JSON.stringify(['Port Blair Veer Savarkar Airport', 'Havelock Jetty', 'Aberdeen Bazaar', 'Neil Island Jetty']),
    total_packages: 2
  },
  {
    id: 'sikkim',
    name: 'Sikkim & Darjeeling',
    slug: 'sikkim',
    state: 'Sikkim & West Bengal',
    country: 'India',
    tag: 'Himalayan Eden',
    short_description: 'Majestic Kanchenjunga views, aromatic tea estates, sacred Tsomgo Lake & Tibetan monasteries.',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Tiger Hill • Tsomgo Lake • Gangtok MG Marg • Rumtek Monastery',
    popular_pickups: JSON.stringify(['Bagdogra Airport (IXB)', 'New Jalpaiguri (NJP) Station', 'Gangtok Mall Road', 'Darjeeling Chowrasta']),
    total_packages: 2
  },
  {
    id: 'meghalaya',
    name: 'Meghalaya (Shillong & Cherrapunji)',
    slug: 'meghalaya',
    state: 'Meghalaya',
    country: 'India',
    tag: 'Abode of Clouds',
    short_description: 'Double Decker Living Root Bridges, crystal-clear Dawki river, Nohkalikai waterfall & clean Mawlynnong.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Living Root Bridges • Dawki Umngot River • Nohkalikai Falls • Mawlynnong Village',
    popular_pickups: JSON.stringify(['Guwahati Railway Station', 'Guwahati Airport (GAU)', 'Shillong Police Bazar', 'Cherrapunji Bus Stand']),
    total_packages: 2
  },
  {
    id: 'tamil-nadu',
    name: 'Tamil Nadu (Madurai & Rameswaram)',
    slug: 'tamil-nadu',
    state: 'Tamil Nadu',
    country: 'India',
    tag: 'Dravidian Temple Grandeur',
    short_description: 'Sculptured gopurams of Meenakshi Amman, sea bridges of Pamban, and sacred ghost town of Dhanushkodi.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Meenakshi Temple • Pamban Bridge • Ramanathaswamy Temple • Dhanushkodi Point',
    popular_pickups: JSON.stringify(['Madurai Junction Railway Station', 'Madurai Airport (IXM)', 'Rameswaram Temple East Gate', 'Dhanushkodi Checkpost']),
    total_packages: 2
  },
  {
    id: 'hampi',
    name: 'Hampi & Badami Heritage',
    slug: 'hampi',
    state: 'Karnataka',
    country: 'India',
    tag: 'Vijayanagara Empire Wonders',
    short_description: 'Surreal boulder-strewn landscapes, stone chariot of Vijayanagara, cave temples of Badami & sunset hills.',
    image: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e11?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Virupaksha Temple • Stone Chariot • Badami Cave Temples • Matanga Hill Sunrise',
    popular_pickups: JSON.stringify(['Hosapete Junction Station', 'Hampi Bazaar', 'Kamalapura Bus Stand', 'Badami Station']),
    total_packages: 2
  },
  {
    id: 'udaipur',
    name: 'Udaipur & Mewar Palaces',
    slug: 'udaipur',
    state: 'Rajasthan',
    country: 'India',
    tag: 'Venice of the East',
    short_description: 'Glistening Lake Pichola boat cruises, grand City Palace, Sajjangarh Monsoon fort & Rajasthani royal crafts.',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'City Palace • Lake Pichola • Jag Mandir • Bagore Ki Haveli • Sajjangarh Fort',
    popular_pickups: JSON.stringify(['Udaipur City Railway Station', 'Maharana Pratap Airport (UDR)', 'Fateh Sagar Promenade', 'Hathipole Market']),
    total_packages: 2
  },
  {
    id: 'gujarat',
    name: 'Gujarat (Rann of Kutch & Gir)',
    slug: 'gujarat',
    state: 'Gujarat',
    country: 'India',
    tag: 'Vibrant White Desert & Lions',
    short_description: 'Endless glowing white salt desert, Asiatic lions of Gir, colossal Statue of Unity & sacred Somnath.',
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'White Rann of Kutch • Gir National Park • Statue of Unity • Somnath Temple',
    popular_pickups: JSON.stringify(['Bhuj Airport / Station', 'Ahmedabad Kalupur Station', 'Vadodara Station', 'Rajkot Airport']),
    total_packages: 2
  },
  {
    id: 'mumbai',
    name: 'Mumbai & Elephanta',
    slug: 'mumbai',
    state: 'Maharashtra',
    country: 'India',
    tag: 'Maximum City Coastal Energy',
    short_description: 'Colonial heritage architecture, Queen’s Necklace sea view, UNESCO Elephanta island & street gastronomy.',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Gateway of India • Marine Drive • Elephanta Caves • Chhatrapati Shivaji Maharaj Terminus',
    popular_pickups: JSON.stringify(['CSMT Station', 'Bandra Kurla Complex (BKC)', 'Chhatrapati Shivaji Maharaj Airport T2', 'Colaba Causeway']),
    total_packages: 2
  },
  {
    id: 'madhya-pradesh',
    name: 'Madhya Pradesh (Khajuraho & Kanha)',
    slug: 'madhya-pradesh',
    state: 'Madhya Pradesh',
    country: 'India',
    tag: 'Heart of Incredible India',
    short_description: 'Intricately carved UNESCO Chandela temples, dense sal forests of Kanha & royal Bengal tiger tracking.',
    image: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Khajuraho Western Group Temples • Kanha Tiger Reserve • Bhedaghat Marble Rocks',
    popular_pickups: JSON.stringify(['Khajuraho Airport', 'Jabalpur Station', 'Jabalpur Airport', 'Kanha Khatia Gate']),
    total_packages: 2
  },
  {
    id: 'odisha',
    name: 'Odisha (Puri, Konark & Chilika)',
    slug: 'odisha',
    state: 'Odisha',
    country: 'India',
    tag: 'Sun, Soul & Sacred Waters',
    short_description: 'Architectural marvel of Konark Sun Temple chariot, Jagannath Puri spiritual energy & Irrawaddy dolphins.',
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Konark Sun Temple • Jagannath Temple Puri • Chilika Lagoon • Golden Beach',
    popular_pickups: JSON.stringify(['Bhubaneswar Biju Patnaik Airport (BBI)', 'Puri Railway Station', 'Bhubaneswar Station', 'Konark Marine Drive']),
    total_packages: 2
  },
  {
    id: 'amritsar',
    name: 'Amritsar & Punjab',
    slug: 'amritsar',
    state: 'Punjab',
    country: 'India',
    tag: 'Golden Spirit & Royal Langar',
    short_description: 'Gleaming Golden Temple Harmandir Sahib, electrifying Wagah border retreat & legendary Amritsari kulchas.',
    image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80',
    landmark_highlight: 'Golden Temple • Wagah Border Beating Retreat • Jallianwala Bagh • Gobindgarh Fort',
    popular_pickups: JSON.stringify(['Sri Guru Ram Dass Jee Airport (ATQ)', 'Amritsar Junction', 'Heritage Street Clock Tower', 'Ranjit Avenue']),
    total_packages: 2
  }
];

const expandedTours = [
  // 1. Himachal Tour
  {
    id: 'pkg-himachal-01',
    title: 'Manali & Solang Valley Alpine Escape',
    slug: 'manali-solang-valley-alpine-escape',
    destination_id: 'himachal',
    category_id: 'cat_adventure',
    tagline: 'Snow-clad peaks, Solang paragliding, Hadimba ancient forest & Old Manali riverside cafes',
    description: 'Breathe the pure Himalayan pine air with experienced mountain Sarathis driving all-weather heated SUVs across Solang and Atal Tunnel.',
    duration_days: 5,
    duration_nights: 4,
    departure_city: 'Manali / Chandigarh',
    vehicle_type: 'Heated Toyota Innova',
    vehicle_category: 'suv',
    capacity: 'Up to 6 Guests',
    distance: 'Approx. 380 Km',
    base_price: 19999,
    sale_price: 16999,
    saving: 3000,
    max_seats: 16,
    badge: '🏔️ Mountain Bestseller',
    rating: 4.93,
    reviews_count: 820,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Solang Valley adventure sports: Paragliding, Zorbing & Quad biking',
      'Scenic drive through engineering marvel Atal Tunnel to Sissu waterfall',
      'Walk through cedar woods to Hadimba Temple and Vashisht hot springs',
      'Cozy Old Manali riverside evening with live acoustic music & trout delicacies'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Arrival Manali & Pine Forest Stroll', desc: 'Pick up from Bhuntar Airport or Manali bus station. Check in to scenic hillside resort and visit ancient Hadimba Devi temple.', loc: 'Manali', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Solang Valley & Atal Tunnel Journey', desc: 'Full day adventure in Solang Valley. Drive through the 9.02 km Atal Tunnel into Lahaul Valley.', loc: 'Solang & Sissu', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Vashisht Sulphur Springs & Jogini Waterfalls', desc: 'Hike to the breathtaking Jogini falls, relax in natural hot springs and explore Old Manali hippie lanes.', loc: 'Vashisht', meals: 'Breakfast & Dinner' },
      { day: 4, time: 'Day 4', title: 'Naggar Castle & Roerich Art Gallery', desc: 'Visit the historic timber-and-stone Naggar Castle overlooking the Beas valley with traditional Himachali lunch.', loc: 'Naggar', meals: 'Breakfast & Himachali Lunch' },
      { day: 5, time: 'Day 5', title: 'Mall Road Shopping & Departure', desc: 'Morning shopping at Mall Road for woolens and local honey, followed by airport drop-off.', loc: 'Manali', meals: 'Breakfast' }
    ],
    inclusions: [
      'Private 4x4 / Innova SUV with experienced mountain Sarathi for 5 days',
      '4 Nights accommodation in 4-Star mountain view resort',
      'Daily Buffet Breakfast and Chef’s Dinner',
      'All toll taxes, state tourist permits, and parking charges'
    ],
    exclusions: [
      'Flight or train tickets to Chandigarh/Bhuntar',
      'Personal adventure sports charges in Solang Valley (paragliding/skiing)',
      'Laundry and personal bar bills'
    ]
  },

  // 2. Ladakh Tour
  {
    id: 'pkg-ladakh-01',
    title: 'Leh Ladakh: Pangong Lake, Nubra Valley & Khardung La',
    slug: 'leh-ladakh-pangong-lake-nubra-valley-khardung-la',
    destination_id: 'ladakh',
    category_id: 'cat_adventure',
    tagline: 'Cross the world’s highest motorable pass, ride double-humped camels in Hunder sand dunes & stargaze at Pangong',
    description: 'The ultimate bucket-list expedition across the Trans-Himalayas with oxygen-equipped 4x4 SUVs and certified local Ladakhi chauffeurs.',
    duration_days: 7,
    duration_nights: 6,
    departure_city: 'Leh',
    vehicle_type: 'Oxygen-Equipped Toyota Fortuner 4x4',
    vehicle_category: 'suv',
    capacity: 'Up to 5 Guests',
    distance: 'Approx. 750 Km',
    base_price: 44999,
    sale_price: 38999,
    saving: 6000,
    max_seats: 14,
    badge: '⭐ Ultimate Expedition',
    rating: 4.97,
    reviews_count: 1410,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Overnight glamping beside the world-famous color-shifting Pangong Tso lake',
      'Conquer Khardung La Pass at 17,982 ft above sea level',
      'Double-humped Bactrian camel safari in the high-altitude sand dunes of Nubra Valley',
      'Visit monumental Thiksey Monastery and Leh Palace'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Arrival Leh & Acclimatization', desc: 'Warm reception at Leh Airport with traditional Ladakhi Khatak scarf. Mandatory rest day for acclimatization. Evening stroll in Leh Bazaar.', loc: 'Leh', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Sham Valley: Hall of Fame & Magnetic Hill', desc: 'Visit the Sangam of Indus & Zanskar rivers, experience Magnetic Hill optical illusion, and visit Gurudwara Pathar Sahib.', loc: 'Sham Valley', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Leh to Nubra Valley via Khardung La', desc: 'Drive across Khardung La (17,982 ft). Arrive in Nubra, visit Diskit Monastery’s 106 ft Buddha statue and Hunder sand dunes.', loc: 'Nubra Valley', meals: 'Breakfast & Dinner' },
      { day: 4, time: 'Day 4', title: 'Nubra Valley to Pangong Tso via Shyok River', desc: 'Scenic off-road drive along Shyok River towards Pangong Lake. Witness the dramatic turquoise waters at sunset.', loc: 'Pangong Lake', meals: 'Breakfast & Dinner' },
      { day: 5, time: 'Day 5', title: 'Sunrise over Pangong & Return to Leh', desc: 'Witness glowing sunrise reflections on the lake. Cross Chang La pass on the way back to Leh.', loc: 'Leh', meals: 'Breakfast & Dinner' },
      { day: 6, time: 'Day 6', title: 'Thiksey, Shey & Hemis Cultural Trail', desc: 'Explore the grandest monasteries of Ladakh, learning about Tibetan Buddhist architecture and heritage.', loc: 'Leh Monasteries', meals: 'Breakfast & Dinner' },
      { day: 7, time: 'Day 7', title: 'Departure from Leh', desc: 'Transfer to Leh Airport with lifelong Himalayan memories.', loc: 'Leh Airport', meals: 'Breakfast' }
    ],
    inclusions: [
      'Private 4x4 SUV with oxygen cylinder & emergency medical kit for entire tour',
      '6 Nights accommodation (4N Deluxe Leh Hotel + 1N Nubra Deluxe Camp + 1N Pangong Lake Camp)',
      'All Inner Line Permits (ILP) and wildlife environment fees',
      'Breakfast & Dinners throughout the expedition'
    ],
    exclusions: [
      'Airfare to and from Leh',
      'Camel ride fees at Hunder sand dunes',
      'Monument and monastery entrance tokens'
    ]
  },

  // 3. Uttarakhand Tour
  {
    id: 'pkg-uttarakhand-01',
    title: 'Rishikesh & Haridwar Spiritual & River Rafting Trail',
    slug: 'rishikesh-haridwar-spiritual-river-rafting-trail',
    destination_id: 'uttarakhand',
    category_id: 'cat_spiritual',
    tagline: 'Grand Ganga Maha Aarti at Har Ki Pauri, 16 km white-water river rafting & Beatles Ashram peace',
    description: 'Blend sacred spiritual ceremonies with adrenaline-pumping Himalayan white-water rafting in the holy valley of Ganga.',
    duration_days: 4,
    duration_nights: 3,
    departure_city: 'Rishikesh / Dehradun',
    vehicle_type: 'AC Swift Dzire / Ertiga',
    vehicle_category: 'sedan',
    capacity: 'Up to 4 Guests',
    distance: 'Approx. 220 Km',
    base_price: 13999,
    sale_price: 11499,
    saving: 2500,
    max_seats: 20,
    badge: '🪔 Sacred & Adventure',
    rating: 4.91,
    reviews_count: 650,
    featured: 0,
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'VIP front-row seating at Har Ki Pauri Evening Ganga Aarti',
      '16 Km thrilling white-water river rafting from Shivpuri with certified guides',
      'Visit the historic Beatles Ashram (Chaurasi Kutia) in Rajaji Tiger Reserve',
      'Cliff jumping and body surfing in the sacred Ganga waters'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Arrival Rishikesh & Triveni Ghat Aarti', desc: 'Meet your verified Sarathi at Dehradun Airport or Haridwar Station. Check into riverside resort. Witness the vibrant evening Ganga Aarti.', loc: 'Rishikesh', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'White-Water Rafting & Cliff Jumping', desc: 'Experience 16 km rapids (Roller Coaster, Golf Course). Enjoy hot Maggi at Maggi Point.', loc: 'Shivpuri', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Beatles Ashram, Neer Garh Waterfall & Haridwar', desc: 'Morning meditation at Beatles Ashram. Afternoon visit to Har Ki Pauri for the divine evening Maha Aarti.', loc: 'Haridwar', meals: 'Breakfast & Dinner' },
      { day: 4, time: 'Day 4', title: 'Souvenir Walk & Departure', desc: 'Explore Tapovan cafes and ayurvedic spice stalls before airport drop.', loc: 'Rishikesh', meals: 'Breakfast' }
    ],
    inclusions: [
      'Dedicated AC vehicle for all transfers and sightseeing',
      '3 Nights accommodation in riverside boutique retreat',
      '16 Km White Water Rafting with safety gear, life jackets & helmets',
      'Daily breakfast and dinner'
    ],
    exclusions: [
      'Bungee jumping / Giant swing fees at Jumpin Heights',
      'Beatles Ashram entry ticket'
    ]
  },

  // 4. Andaman Tour
  {
    id: 'pkg-andaman-01',
    title: 'Andaman Wonders: Havelock Radhanagar & Scuba Diving',
    slug: 'andaman-wonders-havelock-radhanagar-scuba-diving',
    destination_id: 'andaman',
    category_id: 'cat_coastal',
    tagline: 'Asia’s best beach Radhanagar, vibrant coral reef scuba diving & historic Cellular Jail light-and-sound',
    description: 'An enchanting tropical island holiday across Port Blair and Havelock Island with high-speed catamaran transfers.',
    duration_days: 6,
    duration_nights: 5,
    departure_city: 'Port Blair',
    vehicle_type: 'AC Chauffeur Sedan + High-Speed Catamaran Cruise',
    vehicle_category: 'sedan',
    capacity: 'Up to 4 Guests',
    distance: 'Approx. 180 Km + Sea Cruise',
    base_price: 39999,
    sale_price: 34999,
    saving: 5000,
    max_seats: 15,
    badge: '🌊 Tropical Bestseller',
    rating: 4.96,
    reviews_count: 980,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Bask on Radhanagar Beach (Beach No. 7), rated one of Asia’s cleanest beaches',
      'Introductory Scuba diving session with certified PADI dive master at Elephant Beach',
      'Moving Cellular Jail Light & Sound show narrating India’s freedom struggle',
      'Makruzz / Nautika luxury cruise journey between Port Blair and Havelock'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Arrival Port Blair & Cellular Jail', desc: 'Airport pickup and hotel check-in. Visit the historic Cellular Jail and witness the evocative Light & Sound show.', loc: 'Port Blair', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Cruise to Havelock & Sunset at Radhanagar', desc: 'Board high-speed catamaran cruise to Havelock Island. Spend the evening walking the powdery sands of Radhanagar Beach.', loc: 'Havelock Island', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Elephant Beach Coral Reef & Water Sports', desc: 'Speed boat ride to Elephant Beach. Enjoy included snorkeling or scuba dive amongst tropical clownfish and coral gardens.', loc: 'Elephant Beach', meals: 'Breakfast & Dinner' },
      { day: 4, time: 'Day 4', title: 'Kalapathar Beach & Return to Port Blair', desc: 'Morning visit to turquoise Kalapathar Beach. Afternoon cruise back to Port Blair.', loc: 'Port Blair', meals: 'Breakfast & Dinner' },
      { day: 5, time: 'Day 5', title: 'Ross Island & Chidiya Tapu Sunset', desc: 'Explore the British ruins on Ross Island and catch the fiery sunset at Chidiya Tapu bird sanctuary.', loc: 'Chidiya Tapu', meals: 'Breakfast & Dinner' },
      { day: 6, time: 'Day 6', title: 'Departure Port Blair', desc: 'Transfer to Port Blair Airport with coastal souvenirs.', loc: 'Port Blair', meals: 'Breakfast' }
    ],
    inclusions: [
      'All inter-island transfers via premium catamaran (Makruzz/Green Ocean)',
      '5 Nights hotel accommodation (3N Port Blair + 2N Havelock Beach Resort)',
      'All private road transfers with verified Island Sarathis',
      'Daily breakfast and dinner'
    ],
    exclusions: [
      'Airfare to and from Port Blair',
      'Advanced underwater photography packages'
    ]
  },

  // 5. Sikkim & Darjeeling
  {
    id: 'pkg-sikkim-01',
    title: 'Sikkim & Darjeeling: Kanchenjunga Sunrise & Tea Trails',
    slug: 'sikkim-darjeeling-kanchenjunga-sunrise-tea-trails',
    destination_id: 'sikkim',
    category_id: 'cat_family',
    tagline: 'Tiger Hill golden sunrise, UNESCO toy train ride, holy Tsomgo Lake & Happy Valley tea tastings',
    description: 'Experience the crown of Eastern Himalayas with private mountain SUVs, warm monastery bells, and heritage tea gardens.',
    duration_days: 6,
    duration_nights: 5,
    departure_city: 'Bagdogra / Siliguri',
    vehicle_type: 'AC Mahindra Scorpio / Innova',
    vehicle_category: 'suv',
    capacity: 'Up to 6 Guests',
    distance: 'Approx. 420 Km',
    base_price: 31999,
    sale_price: 27499,
    saving: 4500,
    max_seats: 16,
    badge: '🍵 Mountain Serenity',
    rating: 4.92,
    reviews_count: 530,
    featured: 0,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Witness the breathtaking 4:00 AM golden sunrise on Mt. Kanchenjunga from Tiger Hill',
      'Joy ride on the historic Darjeeling Himalayan Railway (UNESCO World Heritage Toy Train)',
      'Excursion to high-altitude glacial Tsomgo Lake and Baba Mandir at 12,310 ft',
      'Walk through historic Makaibari / Happy Valley tea gardens with tea brewing masterclass'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Bagdogra to Gangtok Hill Journey', desc: 'Pickup from Bagdogra Airport and drive along the roaring Teesta River to Gangtok. Evening walk along MG Marg.', loc: 'Gangtok', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Tsomgo Lake & Baba Mandir Excursion', desc: 'High-altitude excursion to sacred Tsomgo Lake. Ride the cable ropeway over snow peaks.', loc: 'Tsomgo Lake', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Rumtek Monastery & Scenic Drive to Darjeeling', desc: 'Visit Rumtek Dharma Chakra Centre, then scenic winding drive to the Queen of the Hills, Darjeeling.', loc: 'Darjeeling', meals: 'Breakfast & Dinner' },
      { day: 4, time: 'Day 4', title: 'Tiger Hill Sunrise, Batasia Loop & Toy Train', desc: 'Early morning Tiger Hill sunrise. Ride the iconic steam toy train around Batasia Loop.', loc: 'Darjeeling', meals: 'Breakfast & Dinner' },
      { day: 5, time: 'Day 5', title: 'Tea Gardens & Himalayan Mountaineering Institute', desc: 'Visit HMI, Padmaja Naidu Himalayan Zoo (Red Pandas), and tea estate tasting.', loc: 'Darjeeling', meals: 'Breakfast & Dinner' },
      { day: 6, time: 'Day 6', title: 'Drop to Bagdogra Airport', desc: 'Scenic descent through pine forests back to Bagdogra Airport.', loc: 'Bagdogra', meals: 'Breakfast' }
    ],
    inclusions: [
      'Private SUV for entire 6 days with experienced hill Sarathi',
      '5 Nights accommodation (2N Gangtok + 3N Darjeeling)',
      'Tsomgo Lake special permits and border clearance',
      'Daily breakfast and dinner'
    ],
    exclusions: [
      'Toy train joy ride tickets (subject to railway availability)',
      'Ropeway ticket fees'
    ]
  },

  // 6. Meghalaya Tour
  {
    id: 'pkg-meghalaya-01',
    title: 'Meghalaya Living Roots & Crystal Waters of Dawki',
    slug: 'meghalaya-living-roots-crystal-waters-of-dawki',
    destination_id: 'meghalaya',
    category_id: 'cat_adventure',
    tagline: 'Double-decker Living Root Bridge hike, transparent boat ride on Dawki River & Mawlynnong clean village',
    description: 'Explore the wettest place on earth, bio-engineered root bridges, limestone caves, and cloud-draped waterfalls.',
    duration_days: 5,
    duration_nights: 4,
    departure_city: 'Guwahati / Shillong',
    vehicle_type: 'AC Toyota Innova',
    vehicle_category: 'suv',
    capacity: 'Up to 6 Guests',
    distance: 'Approx. 460 Km',
    base_price: 26999,
    sale_price: 22999,
    saving: 4000,
    max_seats: 14,
    badge: '🌿 Natural Wonder',
    rating: 4.95,
    reviews_count: 740,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Trek to the ancient 150-year-old Double Decker Living Root Bridge in Nongriat',
      'Crystal-clear country boat ride on Umngot River at Dawki (Indo-Bangla border)',
      'Stand before the roaring 1,115 ft Nohkalikai Falls, India’s tallest plunge waterfall',
      'Explore Mawsmai limestone caves and cleanest village of Mawlynnong'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Guwahati to Shillong via Umiam Lake', desc: 'Pick up from Guwahati. Stop at the massive blue Umiam Lake for water sports. Evening cafe culture in Shillong.', loc: 'Shillong', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Cherrapunji Waterfalls & Mawsmai Caves', desc: 'Drive to Sohra (Cherrapunji). Visit Nohkalikai Falls, Seven Sisters Falls, and walk through illuminated Mawsmai Caves.', loc: 'Cherrapunji', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Nongriat Double Decker Root Bridge Trek', desc: 'Guided trek through Khasi rainforests across living ficus root bridges and natural turquoise pools.', loc: 'Nongriat', meals: 'Breakfast & Packed Lunch & Dinner' },
      { day: 4, time: 'Day 4', title: 'Dawki Crystal River & Mawlynnong Village', desc: 'Boat ride where boats appear to float in mid-air over glass-clear water. Walk the flower-lined paths of Mawlynnong.', loc: 'Dawki', meals: 'Breakfast & Dinner' },
      { day: 5, time: 'Day 5', title: 'Shillong Peak & Guwahati Drop', desc: 'Panoramic view of Shillong plateau from Shillong Peak before airport drop at Guwahati.', loc: 'Guwahati', meals: 'Breakfast' }
    ],
    inclusions: [
      'Private dedicated SUV with verified local Khasi Sarathi',
      '4 Nights accommodation (2N Shillong + 2N Cherrapunji)',
      'Boat ride charges at Dawki River',
      'Local guide for Nongriat Root Bridge trek',
      'Breakfast and dinner daily'
    ],
    exclusions: [
      'Airfare to/from Guwahati',
      'Zip-lining charges at Mawkdok Dympep'
    ]
  },

  // 7. Tamil Nadu Tour
  {
    id: 'pkg-tamil-nadu-01',
    title: 'Madurai Meenakshi, Rameswaram & Dhanushkodi Temple Trail',
    slug: 'madurai-meenakshi-rameswaram-dhanushkodi-temple-trail',
    destination_id: 'tamil-nadu',
    category_id: 'cat_spiritual',
    tagline: '1,000-pillar hall of Meenakshi Amman, 22 sacred wells of Rameswaram & the ghost city at Ram Setu',
    description: 'A deeply transformative spiritual and coastal journey through South India’s most sacred temple architectures and ocean vistas.',
    duration_days: 4,
    duration_nights: 3,
    departure_city: 'Madurai',
    vehicle_type: 'AC Sedan / Crysta',
    vehicle_category: 'sedan',
    capacity: 'Up to 5 Guests',
    distance: 'Approx. 390 Km',
    base_price: 17499,
    sale_price: 14999,
    saving: 2500,
    max_seats: 18,
    badge: '🛕 Divine Dravidian',
    rating: 4.94,
    reviews_count: 880,
    featured: 0,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'VIP special darshan at Madurai Meenakshi Amman Temple and Thirumalai Nayakkar Palace',
      'Cross the engineering marvel Pamban Sea Bridge over the Bay of Bengal',
      'Holy bath in the 22 sacred teerthams at Ramanathaswamy Temple Rameswaram',
      '4x4 jeep expedition to the ghost town of Dhanushkodi and Ram Setu vantage point'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Madurai Heritage & Evening Temple Ceremony', desc: 'Airport pickup in Madurai. Check in, visit Thirumalai Nayakkar Mahal, and attend the divine night procession of Lord Sundareswarar.', loc: 'Madurai', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Madurai to Rameswaram via Pamban Bridge', desc: 'Morning visit to Gandhi Memorial Museum. Drive across Pamban bridge to Rameswaram Island.', loc: 'Rameswaram', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Ramanathaswamy Teerthams & Dhanushkodi Safari', desc: 'Early morning bath at Agni Teertham and 22 temple wells. Afternoon excursion to Dhanushkodi ruins and ocean confluence.', loc: 'Dhanushkodi', meals: 'Breakfast & Dinner' },
      { day: 4, time: 'Day 4', title: 'Kalam Memorial & Return to Madurai', desc: 'Visit Dr. APJ Abdul Kalam National Memorial before driving back to Madurai for departure.', loc: 'Madurai', meals: 'Breakfast' }
    ],
    inclusions: [
      'Private AC vehicle for all 4 days with verified Tamil-speaking Sarathi',
      '3 Nights 3-Star/4-Star hotel accommodation (1N Madurai + 2N Rameswaram)',
      '4x4 Jeep transfer at Dhanushkodi sand dunes',
      'Daily breakfast and dinner'
    ],
    exclusions: [
      'Special darshan tickets at temples (available on the spot)',
      'Camera tokens'
    ]
  },

  // 8. Hampi Tour
  {
    id: 'pkg-hampi-01',
    title: 'Hampi UNESCO Ruins & Tungabhadra Bouldering Heritage',
    slug: 'hampi-unesco-ruins-tungabhadra-bouldering-heritage',
    destination_id: 'hampi',
    category_id: 'cat_heritage',
    tagline: 'Monumental Stone Chariot, boulder-hopping coracle boat ride, sunset over Matanga Hill & royal zenana',
    description: 'Step into the golden age of the Vijayanagara Empire with verified local storyteller guides across stone temples and riverside ruins.',
    duration_days: 3,
    duration_nights: 2,
    departure_city: 'Hosapete / Hampi',
    vehicle_type: 'AC Heritage Auto Rickshaw / Sedan',
    vehicle_category: 'auto',
    capacity: 'Up to 3 Guests',
    distance: 'Approx. 120 Km',
    base_price: 11999,
    sale_price: 9999,
    saving: 2000,
    max_seats: 12,
    badge: '🏛️ UNESCO World Heritage',
    rating: 4.96,
    reviews_count: 620,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1600100397608-f010e42e4e11?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Iconic Stone Chariot and musical pillars of Vijaya Vittala Temple',
      'Traditional circular coracle boat ride on the sacred Tungabhadra river',
      'Panoramic 360-degree sunset view from the summit of Matanga Hill',
      'Explore Lotus Mahal, Queen’s Bath, and the colossal monolithic Lakshmi Narasimha'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Sacred Centre & Virupaksha Temple', desc: 'Meet your local Sarathi at Hosapete station. Tour the active 7th-century Virupaksha Temple, Hemakuta hill shrines, and Kadalekalu Ganesha.', loc: 'Hampi', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Royal Enclosure & Vittala Stone Chariot', desc: 'Full day exploration of the royal pavilions, Lotus Mahal, Elephant Stables, and the architectural triumph of Vittala Temple.', loc: 'Hampi', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Anegundi Kishkindha & Coracle Ride', desc: 'Cross the river to mythical Kishkindha, explore monkey temple on Anjanadri Hill, coracle ride, and departure.', loc: 'Anegundi', meals: 'Breakfast' }
    ],
    inclusions: [
      'Dedicated AC vehicle / Safari Auto with verified local Hampi Sarathi guide',
      '2 Nights stay in heritage resort / riverview cottages',
      'Traditional coracle boat ride tickets',
      'Breakfast and dinner daily'
    ],
    exclusions: [
      'Archaeological Survey of India (ASI) monument entry tickets',
      'Bicycle rental if desired'
    ]
  },

  // 9. Udaipur Tour
  {
    id: 'pkg-udaipur-01',
    title: 'Udaipur Royal Lakes, City Palace & Monsoon Fortress',
    slug: 'udaipur-royal-lakes-city-palace-monsoon-fortress',
    destination_id: 'udaipur',
    category_id: 'cat_heritage',
    tagline: 'Lake Pichola sunset boat cruise, sprawling City Palace museum, Dharohar folk dance & vintage car museum',
    description: 'Live like Mewar royalty amidst marble palaces, romantic lakeside promenades, and world-class Rajasthani hospitality.',
    duration_days: 3,
    duration_nights: 2,
    departure_city: 'Udaipur',
    vehicle_type: 'AC Swift Dzire / Innova',
    vehicle_category: 'sedan',
    capacity: 'Up to 4 Guests',
    distance: 'Approx. 150 Km',
    base_price: 14999,
    sale_price: 12499,
    saving: 2500,
    max_seats: 18,
    badge: '👑 Royal Mewar',
    rating: 4.95,
    reviews_count: 1100,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Private sunset boat cruise on Lake Pichola with stops at Jag Mandir island',
      'Guided walkthrough of the 400-year-old City Palace complex with royal armory',
      'VIP seats at Bagore Ki Haveli for the colorful Dharohar Rajasthani folk dance show',
      'Sunset drive up to the hilltop Sajjangarh Monsoon Palace overlooking the city'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Arrival Udaipur & Pichola Boat Cruise', desc: 'Pick up from Udaipur station or airport. Check into lake-view hotel. Enjoy a serene boat cruise around Lake Pichola and Jag Mandir.', loc: 'Lake Pichola', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'City Palace, Saheliyon Ki Bari & Folk Show', desc: 'Tour the grand City Palace, stroll the fountains of Saheliyon Ki Bari, and watch Dharohar folk dance at Bagore Ki Haveli.', loc: 'Udaipur City', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Sajjangarh Monsoon Palace & Departure', desc: 'Drive to the majestic Monsoon Palace for panoramic valley views. Souvenir shopping for miniature paintings before departure.', loc: 'Sajjangarh', meals: 'Breakfast' }
    ],
    inclusions: [
      'Private AC sedan with verified local Rajasthani Sarathi',
      '2 Nights accommodation in a boutique lake-view Haveli hotel',
      'Boat cruise tickets on Lake Pichola',
      'Bagore Ki Haveli Dharohar show tickets',
      'Daily breakfast and dinner'
    ],
    exclusions: [
      'City Palace camera and entry charges',
      'Personal handicraft purchases'
    ]
  },

  // 10. Gujarat Tour
  {
    id: 'pkg-gujarat-01',
    title: 'White Rann of Kutch & Statue of Unity Grand Safari',
    slug: 'white-rann-of-kutch-statue-of-unity-grand-safari',
    destination_id: 'gujarat',
    category_id: 'cat_heritage',
    tagline: 'Gleaming white salt desert under the full moon, world’s tallest statue & Kutch handicraft villages',
    description: 'Experience the magic of the endless white desert, vibrant Rogan art and Kutchi embroidery, paired with the mammoth Statue of Unity.',
    duration_days: 5,
    duration_nights: 4,
    departure_city: 'Bhuj / Ahmedabad',
    vehicle_type: 'AC Toyota Innova Crysta',
    vehicle_category: 'suv',
    capacity: 'Up to 6 Guests',
    distance: 'Approx. 650 Km',
    base_price: 25999,
    sale_price: 21999,
    saving: 4000,
    max_seats: 16,
    badge: '✨ Desert Spectacle',
    rating: 4.93,
    reviews_count: 540,
    featured: 0,
    image: 'https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Walk on the glowing crystalline Great White Rann of Kutch at sunset and moonrise',
      'Visit Nirona artisan village: 300-year-old Rogan art, copper bells & lacquer woodcraft',
      'Scale Kala Dungar (Black Hill), highest point in Kutch with panoramic desert views',
      'High-speed viewing gallery elevator inside the 182-metre Statue of Unity'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Bhuj Arrival & Heritage Walk', desc: 'Pickup from Bhuj. Visit Prag Mahal and Aina Mahal palace of mirrors. Transfer to Dhordo tent city.', loc: 'Bhuj', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'White Rann Sunset & Cultural Night', desc: 'Explore the vast White Rann. Watch the desert shift from golden orange to moonlight white. Kutchi folk music performance.', loc: 'Dhordo White Rann', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Kala Dungar & Handicraft Villages', desc: 'Drive to Kala Dungar and Indo-Pak border viewpoint. Visit artisan workshops in Nirona and Hodka villages.', loc: 'Kala Dungar', meals: 'Breakfast & Dinner' },
      { day: 4, time: 'Day 4', title: 'Drive to Kevadia & Statue of Unity', desc: 'Drive to Kevadia. Visit the monumental Statue of Unity, Valley of Flowers, and evening laser projection show.', loc: 'Statue of Unity', meals: 'Breakfast & Dinner' },
      { day: 5, time: 'Day 5', title: 'Cactus Garden & Ahmedabad Drop', desc: 'Tour the Cactus Garden and Ekta Nursery before driving to Ahmedabad for departure.', loc: 'Ahmedabad', meals: 'Breakfast' }
    ],
    inclusions: [
      'Private AC SUV with verified Gujarat Sarathi for all 5 days',
      '4 Nights accommodation (2N Dhordo Traditional Bhunga/Tents + 2N Hotel)',
      'Statue of Unity Express Entry & Viewing Gallery ticket',
      'Rann of Kutch entry permits',
      'Breakfast and dinner daily'
    ],
    exclusions: [
      'Flight/train tickets to Bhuj/Ahmedabad',
      'Camel cart ride fees on the white desert'
    ]
  },

  // 11. Mumbai Tour
  {
    id: 'pkg-mumbai-01',
    title: 'Mumbai Maximum City Heritage Walk & Elephanta Caves',
    slug: 'mumbai-maximum-city-heritage-walk-elephanta-caves',
    destination_id: 'mumbai',
    category_id: 'cat_city',
    tagline: 'Colonial Victorian Gothic architecture, Gateway ferry to Elephanta Caves, Marine Drive & street food trail',
    description: 'Experience the pulsating soul of India’s financial capital, from British-era heritage edifices to sea breezes and spicy street delicacies.',
    duration_days: 2,
    duration_nights: 1,
    departure_city: 'Mumbai',
    vehicle_type: 'AC Sedan / Premier Padmini Heritage Taxi',
    vehicle_category: 'sedan',
    capacity: 'Up to 4 Guests',
    distance: 'Approx. 80 Km + Ferry',
    base_price: 7999,
    sale_price: 6499,
    saving: 1500,
    max_seats: 20,
    badge: '🏙️ Maximum City',
    rating: 4.88,
    reviews_count: 940,
    featured: 0,
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Ferry cruise from Gateway of India to 5th-century rock-cut Elephanta Caves (Trimurti Shiva)',
      'Guided walking tour of UNESCO Victorian Gothic and Art Deco Ensembles at Fort & Kala Ghoda',
      'Sunset drive along the Queen’s Necklace (Marine Drive) to Girgaon Chowpatty',
      'Curated street food tasting: authentic Vada Pav, Pav Bhaji, Sev Puri & Irani Bun Maska'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'South Mumbai Heritage & Elephanta Caves', desc: 'Pick up from hotel/airport. Catch the morning heritage ferry to Elephanta Island. Return for a guided walk through Fort, CSMT, and Colaba.', loc: 'South Mumbai', meals: 'Local Street Food Trail & Dinner' },
      { day: 2, time: 'Day 2', title: 'Dhobi Ghat, Bandra Fort & Marine Drive', desc: 'Visit the open-air Mahalaxmi Dhobi Ghat, drive over Bandra-Worli Sea Link, explore Bandra street art, and relax on Marine Drive.', loc: 'Marine Drive', meals: 'Breakfast' }
    ],
    inclusions: [
      'Private AC vehicle for all transfers and city transit',
      '1 Night accommodation in 4-Star South Mumbai hotel',
      'Return ferry tickets and toy train tickets at Elephanta Island',
      'Curated Mumbai street food walk with verified culinary Sarathi guide'
    ],
    exclusions: [
      'Monument entry fee at Elephanta Caves',
      'Personal shopping'
    ]
  },

  // 12. Madhya Pradesh Tour
  {
    id: 'pkg-madhya-pradesh-01',
    title: 'Khajuraho UNESCO Erotic Temples & Kanha Tiger Safari',
    slug: 'khajuraho-unesco-erotic-temples-kanha-tiger-safari',
    destination_id: 'madhya-pradesh',
    category_id: 'cat_adventure',
    tagline: 'World-famous 10th-century stone carvings, open-top 4x4 jeep tiger safari in Kanha & marble canyon boat ride',
    description: 'Journey into the heart of India where timeless erotic sculpture meets the wild jungle book territory of royal Bengal tigers.',
    duration_days: 5,
    duration_nights: 4,
    departure_city: 'Khajuraho / Jabalpur',
    vehicle_type: 'AC Innova + Open 4x4 Gypsy Safari',
    vehicle_category: 'suv',
    capacity: 'Up to 6 Guests',
    distance: 'Approx. 520 Km',
    base_price: 28999,
    sale_price: 24999,
    saving: 4000,
    max_seats: 12,
    badge: '🐅 Wild & Erotic Heritage',
    rating: 4.97,
    reviews_count: 490,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1608958435020-e8a7109ba809?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'In-depth guided tour of Khajuraho’s Western Group of Temples (Kandariya Mahadeva)',
      '2 Open-top 4x4 Gypsy Jungle Safaris in Kanha National Park with certified naturalist',
      'Boat cruise between the towering 100-foot marble rocks of Bhedaghat on the Narmada River',
      'Witness the majestic Dhuandhar Waterfalls mist'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Arrival Khajuraho & Western Temples', desc: 'Pickup at Khajuraho. Tour the world-renowned Chandela dynasty Western Group temples with master storytelling guide.', loc: 'Khajuraho', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Eastern Temples & Scenic Drive to Kanha', desc: 'Visit Jain group temples, then scenic rural drive to the sal forests of Kanha Tiger Reserve.', loc: 'Kanha', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Morning & Afternoon Kanha Jungle Safari', desc: 'Two thrilling 4x4 open Gypsy safaris tracking tigers, barasingha (swamp deer), leopards and gaur.', loc: 'Kanha National Park', meals: 'Breakfast, Lunch & Dinner' },
      { day: 4, time: 'Day 4', title: 'Drive to Jabalpur & Marble Rocks Boat Cruise', desc: 'Drive to Jabalpur. Row through the marble gorges of Bhedaghat and view Dhuandhar falls.', loc: 'Bhedaghat', meals: 'Breakfast & Dinner' },
      { day: 5, time: 'Day 5', title: 'Jabalpur Departure', desc: 'Drop off at Jabalpur Airport / Station.', loc: 'Jabalpur', meals: 'Breakfast' }
    ],
    inclusions: [
      'Private AC Innova for all inter-city transfers',
      '4 Nights accommodation (1N Khajuraho + 2N Kanha Jungle Lodge + 1N Jabalpur)',
      '2 Exclusive 4x4 open Gypsy safaris in Kanha including forest permits and naturalist',
      'Boat cruise at Bhedaghat Marble Rocks',
      'All meals at Kanha Jungle Lodge'
    ],
    exclusions: [
      'Airfare/train tickets',
      'Camera fee during jungle safari'
    ]
  },

  // 13. Odisha Tour
  {
    id: 'pkg-odisha-01',
    title: 'Puri Jagannath, Konark Sun Temple & Chilika Dolphin Cruise',
    slug: 'puri-jagannath-konark-sun-temple-chilika-dolphin-cruise',
    destination_id: 'odisha',
    category_id: 'cat_spiritual',
    tagline: 'Colossal stone chariot of the Sun God, Mahaprasad at Puri Jagannath & endangered Irrawaddy dolphin boat cruise',
    description: 'Discover the golden triangle of Eastern India, celebrating ancient Kalinga temple architecture, sacred ocean beaches, and Asia’s largest brackish lagoon.',
    duration_days: 4,
    duration_nights: 3,
    departure_city: 'Bhubaneswar / Puri',
    vehicle_type: 'AC Swift Dzire / Ertiga',
    vehicle_category: 'sedan',
    capacity: 'Up to 5 Guests',
    distance: 'Approx. 280 Km',
    base_price: 15999,
    sale_price: 13499,
    saving: 2500,
    max_seats: 18,
    badge: '☀️ Sun & Ocean Soul',
    rating: 4.91,
    reviews_count: 570,
    featured: 0,
    image: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Marvel at the 13th-century Konark Sun Temple, designed as a colossal 24-wheel chariot of Surya',
      'Spiritual darshan at the legendary Puri Jagannath Temple with sacred Anand Bazaar Mahaprasad',
      'Boat cruise on Chilika Lake to spot endangered Irrawaddy dolphins and migratory flamingoes',
      'Walk through the Raghurajpur heritage artisan village known for Pattachitra scroll paintings'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Bhubaneswar Temples to Puri via Dhauli Peace Pagoda', desc: 'Pickup in Bhubaneswar. Visit Lingaraj temple, ancient Dhauli Buddhist stupa, and drive to Puri beach.', loc: 'Puri', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Puri Jagannath Temple & Raghurajpur Craft Trail', desc: 'Morning darshan at Jagannath Puri. Afternoon visit to heritage arts village Raghurajpur meeting Pattachitra masters.', loc: 'Puri', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Konark Sun Temple & Chandrabhaga Beach', desc: 'Scenic Marine Drive to the Konark Sun Temple. Enjoy the golden sands and sea breeze at Chandrabhaga Beach.', loc: 'Konark', meals: 'Breakfast & Dinner' },
      { day: 4, time: 'Day 4', title: 'Chilika Lake Dolphin Cruise & Bhubaneswar Drop', desc: 'Boat excursion on Chilika Lake at Satapada to spot dolphins. Drop off at Bhubaneswar Airport.', loc: 'Chilika', meals: 'Breakfast' }
    ],
    inclusions: [
      'Dedicated AC vehicle with verified Odia/Hindi/English speaking Sarathi',
      '3 Nights hotel accommodation near Puri Golden Beach',
      'Private motor boat cruise at Chilika Lagoon',
      'Daily breakfast and dinner'
    ],
    exclusions: [
      'Monument entry fee at Konark Sun Temple',
      'Special panda/priest dakshina'
    ]
  },

  // 14. Amritsar Tour
  {
    id: 'pkg-amritsar-01',
    title: 'Amritsar Golden Temple, Wagah Border & Punjabi Food Trail',
    slug: 'amritsar-golden-temple-wagah-border-punjabi-food-trail',
    destination_id: 'amritsar',
    category_id: 'cat_spiritual',
    tagline: 'Gleaming Harmandir Sahib night view, electrifying Wagah Beating Retreat ceremony & legendary kulchas',
    description: 'Immerse yourself in the generous warmth and soul of Punjab, from the peaceful hymn-filled waters of the Golden Temple to thrilling patriotic border ceremonies.',
    duration_days: 3,
    duration_nights: 2,
    departure_city: 'Amritsar',
    vehicle_type: 'AC Swift Dzire / Eco Auto',
    vehicle_category: 'sedan',
    capacity: 'Up to 4 Guests',
    distance: 'Approx. 130 Km',
    base_price: 10499,
    sale_price: 8999,
    saving: 1500,
    max_seats: 20,
    badge: '🙏 Golden Spirit',
    rating: 4.97,
    reviews_count: 1250,
    featured: 1,
    image: 'https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Palki Sahib night ceremony and morning serenity at the Golden Temple (Harmandir Sahib)',
      'Experience the massive Langar community kitchen serving 100,000 free hot meals daily',
      'VIP front gallery seating at the electrifying Wagah Border Beating Retreat Ceremony',
      'Curated Punjabi culinary walk: authentic crispy Amritsari Kulcha with Chole, Makhan Lassi & Jalebi'
    ],
    itinerary: [
      { day: 1, time: 'Day 1', title: 'Arrival Amritsar, Jallianwala Bagh & Night Temple View', desc: 'Pickup from Amritsar Airport / Station. Check in to heritage hotel. Visit Jallianwala Bagh memorial and experience the illuminated Golden Temple.', loc: 'Golden Temple', meals: 'Dinner' },
      { day: 2, time: 'Day 2', title: 'Langar Seva & High-Energy Wagah Border Ceremony', desc: 'Participate in community service at the Langar kitchen. Afternoon drive to Wagah Border for the sunset military ceremony.', loc: 'Wagah Border', meals: 'Breakfast & Dinner' },
      { day: 3, time: 'Day 3', title: 'Heritage Bazaars, Kulcha Breakfast & Departure', desc: 'Morning breakfast tasting at legendary Bhai Kulwant Singh Kulchian Wale. Shopping for Phulkari dupattas before airport drop.', loc: 'Amritsar', meals: 'Breakfast' }
    ],
    inclusions: [
      'Dedicated AC vehicle for all transfers and Wagah border trip with verified Sarathi',
      '2 Nights accommodation in 4-Star hotel near Heritage Street',
      'Guided culinary tour with famous Amritsari Kulcha breakfast and Lassi',
      'Daily breakfast and dinner'
    ],
    exclusions: [
      'Airfare / Train tickets to Amritsar',
      'Personal Phulkari and Punjabi Jutti purchases'
    ]
  }
];

module.exports = {
  expandedDestinations,
  expandedTours
};

