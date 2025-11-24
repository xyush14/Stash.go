
import { Product, Brand, Occasion, Offer, Reel, Story } from './types';

// --- 50+ Emerging Indian Brands List ---
export const ALL_BRANDS_DATA = [
  // Existing Popular
  { name: "Jaywalking", logo: "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=150&h=150&fit=crop&q=80" },
  { name: "Huemn", logo: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop&q=80" },
  { name: "Almost Gods", logo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&h=150&fit=crop&q=80" },
  { name: "Six5Six", logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&q=80" },
  { name: "Biskit", logo: "https://images.unsplash.com/photo-1516826957135-bdd83b7082e0?w=150&h=150&fit=crop&q=80" },
  { name: "Burger Bae", logo: "https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=150&h=150&fit=crop&q=80" },
  // Imported from CSV
  { name: "UrbanThreads", logo: "https://images.unsplash.com/photo-1559563458-527698bf5295?w=150&h=150&fit=crop&q=80" },
  { name: "Everease", logo: "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?w=150&h=150&fit=crop&q=80" },
  { name: "FitFlex", logo: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=150&h=150&fit=crop&q=80" },
  { name: "VelvetLane", logo: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=150&h=150&fit=crop&q=80" },
  { name: "EliteFormal", logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&q=80" },
  { name: "StreetMode", logo: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=150&h=150&fit=crop&q=80" },
  { name: "WarmNest", logo: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&h=150&fit=crop&q=80" },
  { name: "AeroFit", logo: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&h=150&fit=crop&q=80" },
  { name: "ChicWear", logo: "https://images.unsplash.com/photo-1550614000-4b9519e026c5?w=150&h=150&fit=crop&q=80" },
  { name: "CasualCo", logo: "https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=150&h=150&fit=crop&q=80" },
  // Hypothetical / New
  { name: "Neon Riot", logo: "https://images.unsplash.com/photo-1535295972055-1c762f4483e5?w=150&h=150&fit=crop&q=80" },
  { name: "Void", logo: "https://images.unsplash.com/photo-1550614000-4b9519e026c5?w=150&h=150&fit=crop&q=80" },
  { name: "Aura", logo: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=150&h=150&fit=crop&q=80" },
  { name: "Snitch", logo: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&q=80" },
  { name: "Bonkers Corner", logo: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&q=80" },
  { name: "The Bear House", logo: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=150&h=150&fit=crop&q=80" },
];

export const ALL_BRANDS_NAMES = ALL_BRANDS_DATA.map(b => b.name);

export const OFFERS: Offer[] = [
  { id: '1', title: '40% OFF', subtitle: 'MID SEASON', bgGradient: 'from-[#FF4D4D] to-[#F9CB28]', icon: '⚡' },
  { id: '2', title: '₹499', subtitle: 'ESSENTIALS', bgGradient: 'from-[#7928CA] to-[#FF0080]', icon: '💎' },
  { id: '3', title: 'BOGO', subtitle: 'ON TEES', bgGradient: 'from-[#00C9FF] to-[#92FE9D]', icon: '🎁' },
];

export const BRANDS_LIST: Brand[] = [
  { 
    id: '1', name: 'Jaywalking', handle: '@jaywalking.in', category: 'Luxury Streetwear', notableInfo: 'Concept Driven',
    logo: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=150&h=150&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1617137968427-85924c809a10?w=800&q=80',
    followers: '185K', description: 'Jaywalking is not just a clothing brand, it is an attitude. Known for oversized silhouettes and deconstructed aesthetics.',
    endorsedBy: [
        { name: 'Ranveer', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100' },
        { name: 'Karan', image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100' }
    ]
  },
  { 
    id: '2', name: 'Huemn', handle: '@huemn', category: 'High Fashion', notableInfo: 'Award Winning',
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150&h=150&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80',
    followers: '92K', description: 'Narrative driven clothing that sparks conversation. Award winning designs.', 
    endorsedBy: [
        { name: 'Vicky', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' }
    ]
  },
  { 
    id: '5', name: 'Snitch', handle: '@snitch.co.in', category: 'Fast Fashion', notableInfo: 'Shark Tank Featured',
    logo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150&h=150&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&q=80',
    followers: '500K', description: 'Limitless fashion for the modern man.', 
    endorsedBy: []
  },
  { 
    id: '6', name: 'Bonkers Corner', handle: '@bonkers.corner', category: 'Gen Z Essentials', notableInfo: 'Viral',
    logo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150&h=150&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    followers: '450K', description: 'The ultimate destination for oversized tees, cargo pants and aesthetic fits.', 
    endorsedBy: []
  },
  {
    id: '7', name: 'UrbanThreads', handle: '@urbanthreads', category: 'Casual Classics', notableInfo: 'Premium Cotton',
    logo: 'https://images.unsplash.com/photo-1559563458-527698bf5295?w=150&h=150&fit=crop&q=80',
    coverImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&q=80',
    followers: '50K', description: 'Timeless essentials for the modern wardrobe.', endorsedBy: []
  }
];

export const STORIES_DATA: Story[] = [
  { id: 's1', brandName: 'Huemn', logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=150', image: 'https://images.unsplash.com/photo-1611558709798-e009c8fd7706?w=400&q=80', isViewed: false },
  { id: 's2', brandName: 'Jaywalking', logo: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=150', image: 'https://images.unsplash.com/photo-1503342217505-b0815a046baf?w=400&q=80', isViewed: false },
  { id: 's3', brandName: 'Snitch', logo: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=150', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&q=80', isViewed: true },
  { id: 's4', brandName: 'Bonkers', logo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=150', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', isViewed: false },
];

export const MOCK_PRODUCTS: Product[] = [
  // --- IMPORTED FROM CSV ---
  {
    id: 'csv1', name: 'Classic Denim Jacket', brand: 'UrbanThreads', price: 2499, originalPrice: 3499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'Jackets', description: 'A timeless denim jacket crafted with premium cotton and double-stitched durability.', tags: ['classic', 'denim', 'layering']
  },
  {
    id: 'csv2', name: 'Comfort Fit Hoodie', brand: 'Everease', price: 1799, originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    category: 'Hoodies', description: 'Soft fleece hoodie with a relaxed fit, perfect for daily wear.', tags: ['cozy', 'winter', 'casual']
  },
  {
    id: 'csv3', name: 'Athletic Dry-Fit T-Shirt', brand: 'FitFlex', price: 999, originalPrice: 1499,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
    category: 'Sportswear', description: 'Moisture-wicking dry-fit tee ideal for workouts and outdoor activities.', tags: ['gym', 'active', 'sport']
  },
  {
    id: 'csv4', name: 'Summer Floral Dress', brand: 'VelvetLane', price: 2199, originalPrice: 3000,
    image: 'https://images.unsplash.com/photo-1520975922071-a6e0b94ec2f1?w=800&q=80',
    category: 'Dresses', description: 'Lightweight floral dress designed for breezy summer days.', tags: ['summer', 'floral', 'dayout']
  },
  {
    id: 'csv5', name: 'Slim Fit Formal Shirt', brand: 'EliteFormal', price: 1499, originalPrice: 1999,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80',
    category: 'Formal Wear', description: 'Premium cotton formal shirt with a tailored slim fit.', tags: ['work', 'formal', 'office']
  },
  {
    id: 'csv6', name: 'Cargo Jogger Pants', brand: 'StreetMode', price: 1999, originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&q=80',
    category: 'Pants', description: 'Trendy cargo joggers with elastic cuffs and spacious pockets.', tags: ['street', 'utility', 'cargo']
  },
  {
    id: 'csv7', name: 'Woolen Winter Sweater', brand: 'WarmNest', price: 2599, originalPrice: 3299,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    category: 'Sweaters', description: 'Cozy winter sweater made from soft wool for maximum warmth.', tags: ['winter', 'wool', 'cozy']
  },
  {
    id: 'csv8', name: 'Running Shorts', brand: 'AeroFit', price: 799, originalPrice: 1299,
    image: 'https://images.unsplash.com/photo-1598970434795-0c54fe7c0642?w=800&q=80',
    category: 'Sportswear', description: 'Lightweight running shorts designed for comfort and breathability.', tags: ['gym', 'run', 'active']
  },
  {
    id: 'csv9', name: 'High-Waist Jeans', brand: 'ChicWear', price: 1899, originalPrice: 2599,
    image: 'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&q=80',
    category: 'Jeans', description: 'High-waist stretch denim jeans that contour and enhance shape.', tags: ['denim', 'casual', 'classic']
  },
  {
    id: 'csv10', name: 'Basic Oversized T-Shirt', brand: 'CasualCo', price: 699, originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1520974722031-19be37f1f7c7?w=800&q=80',
    category: 'T-Shirts', description: 'Soft cotton oversized tee for everyday comfort and style.', tags: ['basic', 'daily', 'oversized']
  },
  // --- ORIGINAL CATALOG (Retained & Expanded) ---
  {
    id: '101', name: 'THE ARCHITECT TEE', brand: 'Jaywalking', price: 2499, originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1620799139834-6b8f844fbe61?w=800&q=80',
    category: 'Tees', description: 'Heavyweight cotton oversized tee with architectural back print.', tags: ['luxury', 'street', 'black']
  },
  {
    id: '102', name: 'GORILLA PARACHUTE', brand: 'Huemn', price: 4500, originalPrice: 6500,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
    category: 'Bottoms', description: 'Wide leg parachute pants with signature embroidery.', tags: ['runway', 'statement', 'baggy']
  },
  {
    id: '201', name: 'BABY TEE Y2K', brand: 'Bonkers Corner', price: 699, originalPrice: 999,
    image: 'https://images.unsplash.com/photo-1503342394128-c104d54dba01?w=800&q=80',
    category: 'Tees', description: 'Cropped fitted baby tee with rhinestone graphics.', tags: ['y2k', 'viral', 'party']
  },
  {
    id: '202', name: 'BAGGY DAD JEANS', brand: 'Burger Bae', price: 1899, originalPrice: 2499,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
    category: 'Denim', description: 'Super baggy acid wash denim for that relaxed fit.', tags: ['denim', 'baggy', 'street']
  },
  {
    id: '203', name: 'VARSITY JACKET', brand: 'Snitch', price: 2999, originalPrice: 4999,
    image: 'https://images.unsplash.com/photo-1551488852-0801715a558d?w=800&q=80',
    category: 'Outerwear', description: 'Classic letterman jacket with faux leather sleeves.', tags: ['college', 'layering', 'winter']
  },
  {
    id: '204', name: 'RESORT SHIRT', brand: 'The Bear House', price: 1499, originalPrice: 2299,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80',
    category: 'Shirts', description: 'Cuban collar printed shirt in soft viscose.', tags: ['summer', 'vacation', 'beach']
  },
  {
    id: '205', name: 'CORSET TOP', brand: 'Urban Suburban', price: 1299, originalPrice: 1899,
    image: 'https://images.unsplash.com/photo-1609505848912-b7c3b8b4beda?w=800&q=80',
    category: 'Tops', description: 'Structured corset top with boning details.', tags: ['party', 'chic', 'date']
  },
  {
    id: '206', name: 'OVERSIZED HOODIE', brand: 'Six5Six', price: 3200, originalPrice: 4000,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
    category: 'Hoodies', description: '500GSM French Terry hoodie. Super heavy.', tags: ['winter', 'cozy', 'street']
  },
  {
    id: '207', name: 'CARGO SKIRT', brand: 'Off Duty', price: 1599, originalPrice: 2199,
    image: 'https://images.unsplash.com/photo-1606410931503-2c099393f953?w=800&q=80',
    category: 'Bottoms', description: 'Mini cargo skirt with functional pockets.', tags: ['utility', 'skirt', 'summer']
  },
  // --- NEW EXPANSION (Hypothetical) ---
  { id: '301', name: 'SILK SLIP DRESS', brand: 'Neon Riot', price: 2100, originalPrice: 3500, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80', category: 'Dresses', description: 'Emerald green silk slip dress.', tags: ['elegant', 'date'] },
  { id: '302', name: 'NEON PUFFER', brand: 'Void', price: 4200, originalPrice: 6000, image: 'https://images.unsplash.com/photo-1545593169-527716092d5d?w=800&q=80', category: 'Outerwear', description: 'High-vis neon puffer.', tags: ['cyber', 'winter'] },
  { id: '303', name: 'ABSTRACT MIDI', brand: 'Aura', price: 1800, originalPrice: 2400, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800&q=80', category: 'Dresses', description: 'Abstract print midi dress.', tags: ['brunch', 'summer'] },
  { id: '304', name: 'MESH BODYSUIT', brand: 'Neon Riot', price: 1200, originalPrice: 1800, image: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&q=80', category: 'Tops', description: 'Sheer mesh bodysuit.', tags: ['rave', 'party'] },
  { id: '305', name: 'LEATHER BLAZER', brand: 'Void', price: 5500, originalPrice: 7500, image: 'https://images.unsplash.com/photo-1520975686498-31642e912683?w=800&q=80', category: 'Outerwear', description: 'Faux leather oversized blazer.', tags: ['formal', 'street'] },
  { id: '306', name: 'LINEN CO-ORD', brand: 'Maati', price: 2800, originalPrice: 3200, image: 'https://images.unsplash.com/photo-1591369045365-d368c685225e?w=800&q=80', category: 'Sets', description: 'Breathable linen set.', tags: ['organic', 'summer'] },
  { id: '307', name: 'SEQUIN MINI', brand: 'Urban Suburban', price: 2500, originalPrice: 4000, image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80', category: 'Dresses', description: 'Full sequin mini dress.', tags: ['party', 'glam'] },
  { id: '308', name: 'CROCHET TOP', brand: 'Biskit', price: 1500, originalPrice: 2200, image: 'https://images.unsplash.com/photo-1624206112918-f1406dc1b13d?w=800&q=80', category: 'Tops', description: 'Handmade crochet top.', tags: ['boho', 'summer'] },
  { id: '309', name: 'DENIM MAXI', brand: 'Burger Bae', price: 1900, originalPrice: 2500, image: 'https://images.unsplash.com/photo-1584273143981-41c073df8e8d?w=800&q=80', category: 'Bottoms', description: 'Floor length denim skirt.', tags: ['trends', 'denim'] },
  { id: '310', name: 'TRACKSUIT SET', brand: 'Six5Six', price: 4500, originalPrice: 5000, image: 'https://images.unsplash.com/photo-1515347619252-60a6bf4fffce?w=800&q=80', category: 'Sets', description: 'Retro colorblock tracksuit.', tags: ['sporty', 'gym'] },
  { id: '311', name: 'GRAPHIC HOODIE', brand: 'Bonkers Corner', price: 1499, originalPrice: 2499, image: 'https://images.unsplash.com/photo-1513373319109-eb154073eb0b?w=800&q=80', category: 'Hoodies', description: 'Bold graphic print hoodie.', tags: ['street', 'casual'] },
  { id: '312', name: 'BLACK CARGOS', brand: 'Snitch', price: 1899, originalPrice: 2299, image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80', category: 'Pants', description: 'Tactical black cargo pants.', tags: ['utility', 'techwear'] },
  { id: '313', name: 'WHITE SNEAKERS', brand: 'Red Tape', price: 2499, originalPrice: 4999, image: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80', category: 'Shoes', description: 'Chunky white sneakers.', tags: ['sneakers', 'casual'] },
  { id: '314', name: 'PUFFER VEST', brand: 'H&M', price: 2999, originalPrice: 3999, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80', category: 'Jackets', description: 'Cropped puffer vest.', tags: ['winter', 'layering'] },
  { id: '315', name: 'FLORAL SHIRT', brand: 'Zara', price: 1999, originalPrice: 2599, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80', category: 'Shirts', description: 'Viscose floral shirt.', tags: ['summer', 'vacation'] },
  { id: '316', name: 'WIDE LEG CHINOS', brand: 'Uniqlo', price: 2999, originalPrice: 3499, image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80', category: 'Pants', description: 'Pleated wide leg chinos.', tags: ['smart', 'casual'] },
  { id: '317', name: 'SATIN SKIRT', brand: 'Zara', price: 2299, originalPrice: 2999, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80', category: 'Bottoms', description: 'Midi satin skirt.', tags: ['elegant', 'work'] },
  { id: '318', name: 'KNIT POLO', brand: 'H&M', price: 1499, originalPrice: 1999, image: 'https://images.unsplash.com/photo-1624160719431-1660b65f5271?w=800&q=80', category: 'T-Shirts', description: 'Textured knit polo shirt.', tags: ['smart', 'oldmoney'] },
  { id: '319', name: 'BIKER JACKET', brand: 'AllSaints', price: 8999, originalPrice: 12999, image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=800&q=80', category: 'Jackets', description: 'Classic leather biker jacket.', tags: ['leather', 'edgy'] },
  { id: '320', name: 'TIE DYE TEE', brand: 'Bonkers', price: 899, originalPrice: 1299, image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80', category: 'Tees', description: 'Oversized tie dye t-shirt.', tags: ['summer', 'colorful'] },
];

export const REELS_DATA: Reel[] = [
  {
    id: 'r1', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-in-street-wearing-sunglasses-1308-large.mp4',
    product: MOCK_PRODUCTS[10], likes: '12.4K', user: 'Jaywalking', userAvatar: 'https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=100', brandId: '1'
  },
  {
    id: 'r2', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-posing-in-a-dark-studio-39859-large.mp4',
    product: MOCK_PRODUCTS[11], likes: '8.9K', user: 'Huemn', userAvatar: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=100', brandId: '2'
  },
  {
    id: 'r3', videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-skateboarding-in-a-park-4225-large.mp4',
    product: MOCK_PRODUCTS[20], likes: '32K', user: 'Snitch', userAvatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100', brandId: '5'
  },
];

export const OCCASIONS: Occasion[] = [
  { id: '1', title: 'Runway', image: 'https://images.unsplash.com/photo-1536243298747-ea8874136d64?q=80&w=600&auto=format&fit=crop' },
  { id: '2', title: 'Street', image: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=600&auto=format&fit=crop' },
  { id: '3', title: 'Date Night', image: 'https://images.unsplash.com/photo-1516762689617-e1cffcef479d?q=80&w=600&auto=format&fit=crop' },
  { id: '4', title: 'Gym & Fit', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop' },
  { id: '5', title: 'Festival', image: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=600&auto=format&fit=crop' },
  { id: '6', title: 'Airport', image: 'https://images.unsplash.com/photo-1517466787929-bc90951d64b8?q=80&w=600&auto=format&fit=crop' },
  { id: '7', title: 'Party', image: 'https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?q=80&w=600&auto=format&fit=crop' },
  { id: '8', title: 'Office', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=600&auto=format&fit=crop' },
  { id: '9', title: 'Wedding', image: 'https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?q=80&w=600&auto=format&fit=crop' },
];
