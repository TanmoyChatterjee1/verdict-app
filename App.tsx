/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, Component } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "motion/react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis,
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  User, 
  Check, 
  HelpCircle, 
  X, 
  ChevronRight, 
  TrendingUp, 
  Lock, 
  Award, 
  Calendar, 
  LogIn, 
  Mail, 
  Gavel, 
  Share2, 
  Camera, 
  LogOut, 
  ArrowRight, 
  ArrowUp,
  ArrowDown,
  Pencil, 
  Bell, 
  Flame, 
  CheckCircle, 
  MessageSquare, 
  Zap, 
  Package,
  Info,
  HelpCircle as HelpIcon,
  Circle,
  MoreVertical,
  Edit2,
  Tag,
  Trash2,
  Filter,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  DollarSign,
  Clock,
  MapPin,
  Globe,
  Share as ShareIcon,
  Trophy,
  Moon
} from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  getDoc, 
  runTransaction, 
  serverTimestamp,
  query,
  orderBy,
  limit,
  increment,
  Timestamp,
  writeBatch,
  updateDoc,
  deleteDoc,
  getDocs
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError } from './firebase';
import { getProductImage, getCategoryIcon, getUnsplashImage } from './imageService';

const DEMO_PROFILES = [
  { id: 'demo_profile_001', username: "Arjun_Mehta_92", country: "🇮🇳", bio: "Tech buyer from Mumbai. Never overpays.", accuracyScore: 94, verdictsCast: 847, isDemo: true, oracleRank: 1 },
  { id: 'demo_profile_002', username: "Priya_Sharma_Official", country: "🇮🇳", bio: "Skincare and fashion obsessed.", accuracyScore: 89, verdictsCast: 623, isDemo: true, oracleRank: 2 },
  { id: 'demo_profile_003', username: "RahulVerma_Fin", country: "🇮🇳", bio: "Financial analyst. Every rupee counts.", accuracyScore: 91, verdictsCast: 734, isDemo: true, oracleRank: 3 },
  { id: 'demo_profile_004', username: "Sneha_Kapoor_04", country: "🇮🇳", bio: "College student. Budget is real.", accuracyScore: 78, verdictsCast: 412, isDemo: true, oracleRank: 4 },
  { id: 'demo_profile_005', username: "VikasTech_Pro", country: "🇮🇳", bio: "Gadget reviewer. Tested 300+ products.", accuracyScore: 86, verdictsCast: 289, isDemo: true, oracleRank: 5 },
  { id: 'demo_profile_006', username: "Ananya_Lifestyle", country: "🇮🇳", bio: "Minimalist buyer. Quality over quantity.", accuracyScore: 82, verdictsCast: 156, isDemo: true, oracleRank: 6 },
  { id: 'demo_profile_007', username: "Jake_Williams_US", country: "🇺🇸", bio: "Silicon Valley engineer. Only buys what works.", accuracyScore: 88, verdictsCast: 534, isDemo: true, oracleRank: 7 },
  { id: 'demo_profile_008', username: "Sophie_Laurent_FR", country: "🇫🇷", bio: "Paris designer. Style must justify price.", accuracyScore: 92, verdictsCast: 678, isDemo: true, oracleRank: 8 },
  { id: 'demo_profile_009', username: "Kai_Nakamura_JP", country: "🇯🇵", bio: "Tokyo tech enthusiast. Precision buyer.", accuracyScore: 85, verdictsCast: 321, isDemo: true, oracleRank: 9 },
  { id: 'demo_profile_010', username: "Emma_Thompson_UK", country: "🇬🇧", bio: "London finance grad. Data driven.", accuracyScore: 79, verdictsCast: 198, isDemo: true, oracleRank: 10 },
  { id: 'demo_profile_011', username: "Carlos_Rivera_MX", country: "🇲🇽", bio: "Startup founder. ROI on everything.", accuracyScore: 93, verdictsCast: 445, isDemo: true, oracleRank: 11 },
  { id: 'demo_profile_012', username: "Aisha_Al_Farsi", country: "🇦🇪", bio: "Dubai based. Luxury only if worth it.", accuracyScore: 96, verdictsCast: 912, isDemo: true, oracleRank: 12 }
];

const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo_001',
    name: 'Apple AirPods Pro 2',
    price: 24900,
    category: 'AUDIO',
    description: 'The ultimate noise canceling earphones for Apple users.',
    votes: { essential: 450, maybe: 120, waste: 30 },
    authorId: 'demo_profile_001',
    postedBy: 'Arjun_Mehta_92',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 100000000)),
    imageBase64: ''
  },
  {
    id: 'demo_002',
    name: 'boAt Airdopes 141',
    price: 899,
    category: 'AUDIO',
    description: 'Budget true wireless earbuds with massive battery life.',
    votes: { essential: 1200, maybe: 300, waste: 50 },
    authorId: 'demo_profile_004',
    postedBy: 'Sneha_Kapoor_04',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 200000000)),
    imageBase64: ''
  },
  {
    id: 'demo_003',
    name: 'iPhone 16 Pro Max 256GB',
    price: 144900,
    category: 'TECH',
    description: 'The biggest, most powerful iPhone ever made.',
    votes: { essential: 150, maybe: 80, waste: 210 },
    authorId: 'demo_profile_007',
    postedBy: 'Jake_Williams_US',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 50000000)),
    imageBase64: ''
  },
  {
    id: 'demo_004',
    name: 'Gaming Chair RGB Pro',
    price: 18999,
    category: 'HOME',
    description: 'Racing style seat with vibrant RGB lighting.',
    votes: { essential: 40, maybe: 90, waste: 350 },
    authorId: 'demo_profile_005',
    postedBy: 'VikasTech_Pro',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 150000000)),
    imageBase64: ''
  },
  {
    id: 'demo_005',
    name: 'MacBook Air M3',
    price: 114900,
    category: 'TECH',
    description: 'Thinner, lighter, and faster with the M3 chip.',
    votes: { essential: 380, maybe: 60, waste: 20 },
    authorId: 'demo_profile_008',
    postedBy: 'Sophie_Laurent_FR',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 120000000)),
    imageBase64: ''
  },
  {
    id: 'demo_006',
    name: 'Sony WH-1000XM5',
    price: 26990,
    category: 'AUDIO',
    description: 'Leading noise cancellation over-ear headphones.',
    votes: { essential: 410, maybe: 40, waste: 15 },
    authorId: 'demo_profile_012',
    postedBy: 'Aisha_Al_Farsi',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 180000000)),
    imageBase64: ''
  },
  {
    id: 'demo_007',
    name: 'PlayStation 5',
    price: 54990,
    category: 'TECH',
    description: 'The latest console with breathtaking games.',
    votes: { essential: 620, maybe: 110, waste: 40 },
    authorId: 'demo_profile_009',
    postedBy: 'Kai_Nakamura_JP',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 220000000)),
    imageBase64: ''
  },
  {
    id: 'demo_008',
    name: 'Spotify Premium Annual',
    price: 1189,
    category: 'SUBSCRIPTION',
    description: 'Unlimited music and podcasts, zero ads.',
    votes: { essential: 890, maybe: 50, waste: 10 },
    authorId: 'demo_profile_010',
    postedBy: 'Emma_Thompson_UK',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 300000000)),
    imageBase64: ''
  },
  {
    id: 'demo_009',
    name: 'Detox Tea 28 Day Program',
    price: 1899,
    category: 'HEALTH',
    description: 'Scientific blend for body purification.',
    votes: { essential: 10, maybe: 30, waste: 580 },
    authorId: 'demo_profile_002',
    postedBy: 'Priya_Sharma_Official',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 400000000)),
    imageBase64: ''
  },
  {
    id: 'demo_010',
    name: 'Fitbit Charge 6',
    price: 14999,
    category: 'TECH',
    description: 'Advanced fitness and health tracker.',
    votes: { essential: 210, maybe: 150, waste: 40 },
    authorId: 'demo_profile_003',
    postedBy: 'RahulVerma_Fin',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 450000000)),
    imageBase64: ''
  },
  {
    id: 'demo_011',
    name: 'Nike Air Max 270',
    price: 12995,
    category: 'FASHION',
    description: 'Legendary comfort and style with Air Max technology.',
    votes: { essential: 320, maybe: 80, waste: 40 },
    authorId: 'demo_profile_006',
    postedBy: 'Ananya_Lifestyle',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 500000000)),
    imageBase64: ''
  },
  {
    id: 'demo_012',
    name: 'Kindle Paperwhite 2024',
    price: 13999,
    category: 'TECH',
    description: 'The best reading experience with adjustable warm light.',
    votes: { essential: 480, maybe: 30, waste: 10 },
    authorId: 'demo_profile_003',
    postedBy: 'RahulVerma_Fin',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 550000000)),
    imageBase64: ''
  },
  {
    id: 'demo_013',
    name: 'Dyson V12 Vacuum Cleaner',
    price: 45900,
    category: 'HOME',
    description: 'Powerful suction and laser illumination for deep cleaning.',
    votes: { essential: 180, maybe: 120, waste: 210 },
    authorId: 'demo_profile_001',
    postedBy: 'Arjun_Mehta_92',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 600000000)),
    imageBase64: ''
  },
  {
    id: 'demo_014',
    name: 'Nothing Phone (2a)',
    price: 23999,
    category: 'TECH',
    description: 'Unique design with Glyphs and smooth software.',
    votes: { essential: 340, maybe: 80, waste: 20 },
    authorId: 'demo_profile_005',
    postedBy: 'VikasTech_Pro',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 650000000)),
    imageBase64: ''
  },
  {
    id: 'demo_015',
    name: 'Noise ColorFit Pro 4',
    price: 2499,
    category: 'TECH',
    description: 'Smartwatch with a large display and fitness tracking.',
    votes: { essential: 540, maybe: 210, waste: 80 },
    authorId: 'demo_profile_004',
    postedBy: 'Sneha_Kapoor_04',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 700000000)),
    imageBase64: ''
  },
  {
    id: 'demo_016',
    name: 'Ola Electric Scooter S1 Pro',
    price: 129999,
    category: 'TECH',
    description: 'Efficient and high-performance electric scooter.',
    votes: { essential: 310, maybe: 420, waste: 150 },
    authorId: 'demo_profile_005',
    postedBy: 'VikasTech_Pro',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 750000000)),
    imageBase64: ''
  },
  {
    id: 'demo_017',
    name: 'Uniqlo Ultra Light Down Jacket',
    price: 5990,
    category: 'FASHION',
    description: 'Warm, lightweight, and compact jacket.',
    votes: { essential: 450, maybe: 90, waste: 20 },
    authorId: 'demo_profile_006',
    postedBy: 'Ananya_Lifestyle',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 800000000)),
    imageBase64: ''
  },
  {
    id: 'demo_018',
    name: 'MuscleBlaze Whey Protein 2kg',
    price: 5499,
    category: 'HEALTH',
    description: 'High-quality whey protein for muscle recovery.',
    votes: { essential: 380, maybe: 120, waste: 60 },
    authorId: 'demo_profile_011',
    postedBy: 'Carlos_Rivera_MX',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 850000000)),
    imageBase64: ''
  },
  {
    id: 'demo_019',
    name: 'Netflix Premium 4K Plan',
    price: 649,
    category: 'SUBSCRIPTION',
    description: 'Watch in Ultra HD on 4 screens at once.',
    votes: { essential: 410, maybe: 180, waste: 130 },
    authorId: 'demo_profile_008',
    postedBy: 'Sophie_Laurent_FR',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 900000000)),
    imageBase64: ''
  },
  {
    id: 'demo_020',
    name: 'Amazon Prime Yearly',
    price: 1499,
    category: 'SUBSCRIPTION',
    description: 'Fast delivery, exclusive movies and more.',
    votes: { essential: 920, maybe: 40, waste: 10 },
    authorId: 'demo_profile_010',
    postedBy: 'Emma_Thompson_UK',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 950000000)),
    imageBase64: ''
  },
  {
    id: 'demo_021',
    name: 'Logitech MX Master 3S',
    price: 9495,
    category: 'TECH',
    description: 'The definitive mouse for productivity and ergonomic comfort.',
    votes: { essential: 350, maybe: 40, waste: 15 },
    authorId: 'demo_profile_001',
    postedBy: 'Arjun_Mehta_92',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1000000000)),
    imageBase64: ''
  },
  {
    id: 'demo_022',
    name: 'Instant Pot Pro',
    price: 12900,
    category: 'HOME',
    description: 'Multi-functional pressure cooker that saves hours.',
    votes: { essential: 280, maybe: 90, waste: 40 },
    authorId: 'demo_profile_006',
    postedBy: 'Ananya_Lifestyle',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1100000000)),
    imageBase64: ''
  },
  {
    id: 'demo_023',
    name: 'Ray-Ban Wayfarer Classic',
    price: 9900,
    category: 'FASHION',
    description: 'Timeless style that never goes out of fashion.',
    votes: { essential: 150, maybe: 210, waste: 80 },
    authorId: 'demo_profile_008',
    postedBy: 'Sophie_Laurent_FR',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1200000000)),
    imageBase64: ''
  },
  {
    id: 'demo_024',
    name: 'LEGO Star Wars Millennium Falcon',
    price: 64999,
    category: 'TOYS',
    description: 'The ultimate collector series model for Star Wars fans.',
    votes: { essential: 90, maybe: 60, waste: 310 },
    authorId: 'demo_profile_009',
    postedBy: 'Kai_Nakamura_JP',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1300000000)),
    imageBase64: ''
  },
  {
    id: 'demo_025',
    name: 'KitchenAid Artisan Mixer',
    price: 49990,
    category: 'HOME',
    description: 'Iconic stand mixer for every baking enthusiast.',
    votes: { essential: 110, maybe: 80, waste: 190 },
    authorId: 'demo_profile_012',
    postedBy: 'Aisha_Al_Farsi',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1400000000)),
    imageBase64: ''
  },
  {
    id: 'demo_026',
    name: 'Kindle Scribe',
    price: 33999,
    category: 'TECH',
    description: 'Read and write as naturally as you do on paper.',
    votes: { essential: 60, maybe: 120, waste: 240 },
    authorId: 'demo_profile_003',
    postedBy: 'RahulVerma_Fin',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1500000000)),
    imageBase64: ''
  },
  {
    id: 'demo_027',
    name: 'Steam Deck 512GB',
    price: 45000,
    category: 'TECH',
    description: 'Handheld gaming PC that runs your whole Steam library.',
    votes: { essential: 430, maybe: 70, waste: 30 },
    authorId: 'demo_profile_011',
    postedBy: 'Carlos_Rivera_MX',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1600000000)),
    imageBase64: ''
  },
  {
    id: 'demo_028',
    name: 'Ember Mug 2',
    price: 12900,
    category: 'HOME',
    description: 'Smart mug that keeps your coffee at the perfect temp.',
    votes: { essential: 20, maybe: 50, waste: 510 },
    authorId: 'demo_profile_001',
    postedBy: 'Arjun_Mehta_92',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1700000000)),
    imageBase64: ''
  },
  {
    id: 'demo_029',
    name: 'Hydro Flask 32oz',
    price: 3499,
    category: 'OUTDOOR',
    description: 'The classic insulated water bottle.',
    votes: { essential: 390, maybe: 40, waste: 10 },
    authorId: 'demo_profile_006',
    postedBy: 'Ananya_Lifestyle',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1800000000)),
    imageBase64: ''
  },
  {
    id: 'demo_030',
    name: 'Yeti Tundra 45 Cooler',
    price: 28000,
    category: 'OUTDOOR',
    description: 'Indestructible cooler that keeps ice for days.',
    votes: { essential: 70, maybe: 110, waste: 280 },
    authorId: 'demo_profile_007',
    postedBy: 'Jake_Williams_US',
    isDemo: true,
    createdAt: Timestamp.fromDate(new Date(Date.now() - 1900000000)),
    imageBase64: ''
  }
];

const SEED_COMMENTS: Record<string, any[]> = {
  "iPhone 16 Pro Max": [
    {
      username: "deepak_buys 🇮🇳",
      vote: "WASTE",
      accuracy: 88,
      text: "Bhai seriously ₹1.35 lakh for a phone. My father's first car cost less than this. OnePlus 13 does everything this does for exactly half the price. You are paying for the logo only. Hard no from me.",
      time: 2 * 60 * 60 * 1000
    },
    {
      username: "nyc_minimalist 🇺🇸",
      vote: "ESSENTIAL",
      accuracy: 92,
      text: "People who say this is overpriced are not calculating total cost of ownership. This phone will last 6 years with updates. Divide ₹1.35 lakh by 6 years. That is ₹22,500 per year. Less than ₹2,000 per month for your primary device. Completely justified.",
      time: 5 * 60 * 60 * 1000
    },
    {
      username: "berlin_logic 🇩🇪",
      vote: "MAYBE",
      accuracy: 94,
      text: "The answer depends entirely on whether you are already in Apple ecosystem. iPhone plus Mac plus iPad — the integration saves 2 hours weekly. That has real monetary value. If you are standalone Android user switching to this — genuinely not worth it. Context matters more than the price tag.",
      time: 24 * 60 * 60 * 1000
    }
  ],
  "boAt Airdopes 141": [
    {
      username: "pune_student 🇮🇳",
      vote: "ESSENTIAL",
      accuracy: 72,
      text: "Bought these in first year of college. Now in third year. Still working perfectly. Battery still lasts full day. At ₹899 this is genuinely the best money I have spent on any gadget. My roommate bought ₹3,500 earphones. Mine sound the same to both of us.",
      time: 4 * 60 * 60 * 1000
    },
    {
      username: "london_frugal 🇬🇧",
      vote: "ESSENTIAL",
      accuracy: 89,
      text: "Recommended these to 11 people. All 11 came back and said thank you. The value per rupee calculation on these earphones is simply unmatched. Nothing in this price range globally comes close to this battery life.",
      time: 12 * 60 * 60 * 1000
    },
    {
      username: "toronto_deals 🇨🇦",
      vote: "MAYBE",
      accuracy: 81,
      text: "Sound quality is fine for calls and casual listening. But if you actually care about music quality you will notice the bass is muddy and treble is harsh. For commuting and calls — buy it. For serious music listening — save up for something better.",
      time: 24 * 60 * 60 * 1000
    }
  ],
  "Detox Tea 28 Day Program": [
    {
      username: "frugal_delhi 🇮🇳",
      vote: "WASTE",
      accuracy: 91,
      text: "My doctor literally laughed when I showed him this product. Your liver processes toxins 24 hours a day for free. The word detox on a product label is pure marketing with zero science behind it. Save ₹1,899. Drink water. Sleep more. That is the actual detox program.",
      time: 6 * 60 * 60 * 1000
    },
    {
      username: "paris_style 🇫🇷",
      vote: "WASTE",
      accuracy: 86,
      text: "In France we have a saying — if something sounds too good to be true it is selling you something. A tea that detoxes your body in 28 days while you eat normally? This is pseudoscience with good packaging. Spend this money on actual vegetables.",
      time: 18 * 60 * 60 * 1000
    },
    {
      username: "hyderabad_eats 🇮🇳",
      vote: "MAYBE",
      accuracy: 83,
      text: "Okay I know everyone is saying waste but hear me out. I used this for 28 days. Did not lose weight. Did not detox anything. But the morning ritual made me drink more water and eat less at night. The psychological habit trigger had value. The health claims are fake. The habit formation was real for me.",
      time: 2 * 24 * 60 * 60 * 1000
    }
  ],
  "Gaming Chair RGB Pro": [
    {
      username: "bangalore_dev 🇮🇳",
      vote: "WASTE",
      accuracy: 84,
      text: "Software developer here. Sit 10 hours daily. Bought a gaming chair. Back pain by month 2. Physiotherapy cost ₹8,000. Now using a basic Featherlite office chair at ₹6,500 with a lumbar cushion. Zero back pain for 14 months. The RGB on gaming chairs is for aesthetics not for your spine.",
      time: 8 * 60 * 60 * 1000
    },
    {
      username: "seoul_gadget 🇰🇷",
      vote: "WASTE",
      accuracy: 91,
      text: "Korean PC gaming culture is massive here. We learned this lesson 10 years ago. Gaming chairs are furniture for aesthetics. For actual comfort and health you need proper ergonomic office chairs. Herman Miller, Steelcase, or local equivalents. Your back will thank you in 5 years.",
      time: 24 * 60 * 60 * 1000
    },
    {
      username: "mumbai_techie 🇮🇳",
      vote: "MAYBE",
      accuracy: 76,
      text: "If you are a content creator or streamer and the chair appears in your videos then the RGB aesthetic adds production value. For that specific use case ₹16,000 is justified as a business expense. For everyone else gaming in their bedroom this is pure waste. Nobody sees your chair.",
      time: 2 * 24 * 60 * 60 * 1000
    }
  ],
  "MacBook Air M3": [
    {
      username: "sg_techie 🇸🇬",
      vote: "ESSENTIAL",
      accuracy: 93,
      text: "M3 chip performance per watt is genuinely revolutionary. I run full machine learning models on mine. My previous Windows workstation cost 3x more and did less. For developers and data professionals this is not a laptop purchase. It is an infrastructure investment that pays for itself monthly.",
      time: 3 * 60 * 60 * 1000
    },
    {
      username: "kolkata_reads 🇮🇳",
      vote: "WASTE",
      accuracy: 79,
      text: "Engineering student here. AutoCAD, MATLAB, SolidWorks — none run on Mac. Checked with seniors before buying. Saved myself from a very expensive mistake. If your work or college requires Windows specific software please research compatibility before spending ₹1.15 lakh. Ask your seniors first.",
      time: 14 * 60 * 60 * 1000
    },
    {
      username: "dubai_luxury 🇦🇪",
      vote: "MAYBE",
      accuracy: 88,
      text: "The M1 MacBook Air at ₹79,000 does 95% of what this M3 does. I have used both back to back. Real world difference for normal tasks is minimal. If you are buying new and have the budget then M3. If you are upgrading from M1 or M2 skip this generation entirely. Wait for M4 or buy M1 now.",
      time: 24 * 60 * 60 * 1000
    }
  ],
  "Sony WH-1000XM5": [
    {
      username: "deepak_buys 🇮🇳",
      vote: "ESSENTIAL",
      accuracy: 88,
      text: "Work from home for 3 years. These headphones changed my life. Noise cancellation so good I forgot my neighbour was drilling for 2 hours. Call quality so clear clients think I am in a professional studio. For WFH professionals this is not a luxury purchase. It is a productivity tool.",
      time: 2 * 60 * 60 * 1000
    },
    {
      username: "chennai_spends 🇮🇳",
      vote: "MAYBE",
      accuracy: 87,
      text: "Sony XM4 is available for ₹18,000 now. Does 90% of what XM5 does. The XM5 improvement is mainly slightly better call quality and slightly lighter weight. If you are buying fresh get XM4. If you already have XM4 do not upgrade. ₹9,000 difference is not justified.",
      time: 1 * 24 * 60 * 60 * 1000
    },
    {
      username: "rio_budget 🇧🇷",
      vote: "WASTE",
      accuracy: 80,
      text: "For the price of these headphones I can buy 30 pairs of boAt earphones. That is 30 years of daily earphone use. The noise cancellation is impressive but I genuinely cannot justify ₹27,000 for any audio product that is not a professional studio tool. Personal opinion. Fight me.",
      time: 3 * 24 * 60 * 60 * 1000
    }
  ],
  "PlayStation 5": [
    {
      username: "seoul_gadget 🇰🇷",
      vote: "ESSENTIAL",
      accuracy: 91,
      text: "PC gaming equivalent performance costs ₹80,000 minimum. PS5 at ₹55,000 with exclusive titles that never come to PC makes this genuinely the best value gaming purchase available. Spider-Man 2, God of War, Demon Souls — these alone justify the hardware cost. Essential for any serious gamer.",
      time: 2 * 60 * 60 * 1000
    },
    {
      username: "pune_student 🇮🇳",
      vote: "MAYBE",
      accuracy: 72,
      text: "As a student the upfront cost is painful. But divide ₹55,000 by how many hours you will use it over 7 years. Gaming is actually the cheapest entertainment per hour if you play seriously. Movies cost ₹300 for 2 hours. Gaming costs ₹0 per hour after purchase. Math actually works out.",
      time: 1 * 24 * 60 * 60 * 1000
    },
    {
      username: "frugal_delhi 🇮🇳",
      vote: "WASTE",
      accuracy: 91,
      text: "Mobile gaming in India has reached a level where 90% of popular titles are available free on phone. BGMI, COD Mobile, Asphalt — all free. All great. All on a device you already own. ₹55,000 for a box that sits under your TV for exclusives is hard to justify when your phone already covers most gaming needs.",
      time: 3 * 24 * 60 * 60 * 1000
    }
  ],
  "Spotify Premium Annual": [
    {
      username: "nairobi_smart 🇳🇬",
      vote: "ESSENTIAL",
      accuracy: 77,
      text: "₹1,189 per year is ₹99 per month. That is less than one cup of coffee. For unlimited music, podcasts, and no ads across all my devices? This is the easiest Essential vote I have ever cast. Absolute no brainer.",
      time: 2 * 60 * 60 * 1000
    },
    {
      username: "mumbai_techie 🇮🇳",
      vote: "ESSENTIAL",
      accuracy: 76,
      text: "YouTube Music is free with ads. JioSaavn has most Indian content free. BUT — Spotify podcast library, offline download quality, and cross device continuity is unmatched. The annual plan at ₹1,189 makes the per month cost ridiculous. Just buy the annual plan immediately.",
      time: 1 * 24 * 60 * 60 * 1000
    },
    {
      username: "berlin_logic 🇩🇪",
      vote: "MAYBE",
      accuracy: 94,
      text: "Essential only if you are not already paying for YouTube Premium which includes YouTube Music. If you have YouTube Premium you are paying twice for music streaming. Check what you already have before adding another subscription. Subscription stacking is how people waste ₹5,000 per year without noticing.",
      time: 3 * 24 * 60 * 60 * 1000
    }
  ]
};

const DEMO_IMAGES: Record<string, string> = {
  "Apple AirPods Pro 2": "https://i.guim.co.uk/img/media/ba963e76f1ff9148a21027fa44a15743baf6f879/1197_1053_3680_2944/master/3680.jpg?width=1200&quality=85&auto=format&fit=max&s=ffaf42c8c421a77d9ffc9e5d4ba9e615",
  "boAt Airdopes 141": "https://m.media-amazon.com/images/I/71LStnbkz4L._AC_UF1000,1000_QL80_.jpg",
  "iPhone 16 Pro Max 256GB": "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-geo-240909_inline.jpg.large.jpg",
  "OnePlus 13 256GB": "https://oasis.opstatics.com/content/dam/oasis/page/2024/global/phones/13/specs/13-black.png",
  "Sony WH-1000XM5": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrKu2LHvVFdOSH-Jh23Wc2aIenBDkRRxzsjw&s",
  "Kindle Paperwhite 2024": "https://cdn.arstechnica.net/wp-content/uploads/2024/11/IMG_2480.jpeg",
  "Gaming Chair RGB Pro": "https://m.media-amazon.com/images/I/817VI3DpflL._AC_UF894,1000_QL80_.jpg",
  "Nike Air Max 270": "https://cdn.runrepeat.com/storage/gallery/product_primary/34275/nike-air-max-270-react-hero-image-22267660-main.jpg",
  "Uniqlo Ultra Light Down Jacket": "https://www.uniqlo.com/jp/ja/contents/feature/masterpiece/common/img/ogi/ogi_product_02.jpg?260115",
  "Ray-Ban Wayfarer Sunglasses": "https://flightsunglasses.com/cdn/shop/files/ScreenShot2023-05-21at7.06.28PM_2048x.png?v=1684723128",
  "Zara Oversized Blazer": "https://static.zara.net/assets/public/911f/69d6/f47940d0aaac/18f3adcbffad/02469631070-p/02469631070-p.jpg?ts=1771596232747",
  "MuscleBlaze Whey Protein 2kg": "https://img10.hkrtcdn.com/39074/prd_3907379-MuscleBlaze-100-Whey-Protein-Supplement-Powder-with-Digestive-Enzyme-2.2-lb-28-Servings-Rich-Milk-Chocolate_o.jpg",
  "Detox Tea 28 Day Program": "https://rukminim2.flixcart.com/image/480/640/xif0q/tea/x/f/0/100-morning-detox-tea-and-jamun-glow-diabetic-support-tea-original-imahk793uma7vfta.jpeg?q=90",
  "Fitbit Charge 6": "https://wifihifi.com/wp-content/uploads/2024/01/fitbit-charge-6-table.jpeg",
  "Yoga Mat Premium Cork": "https://hipimi.com/cdn/shop/products/712901742366_1080x.jpg?v=1584404534",
  "Philips Air Fryer HD9200": "https://images-cdn.ubuy.co.in/66ff84b7f1d3de796345f58d-philips-premium-airfryer-xxl-with-fat.jpg",
  "Dyson V12 Vacuum Cleaner": "https://www.littledayout.com/wp-content/uploads/dyson-v12-01.jpg",
  "Instant Pot Duo 7-in-1": "https://image.cnbcfm.com/api/v1/image/104710222-Robert_Wang.jpg?v=1505406958",
  "Smart LED Bulbs Pack of 4": "https://m.media-amazon.com/images/I/61vN5ySYjJL._AC_UF350,350_QL80_.jpg",
  "Robot Vacuum Cleaner Budget": "https://m.media-amazon.com/images/I/81ETNR6s1hL._AC_UF350,350_QL80_.jpg",
  "PlayStation 5 Disc Edition": "https://m.media-amazon.com/images/I/51ljnEaW0pL.jpg",
  "MacBook Air M3 8GB 256GB": "https://cdn.mos.cms.futurecdn.net/oLggbYvoxtc9yd3vLJDQwT.jpg",
  "Ola Electric Scooter S1 Pro": "https://www.carandbike.com/_next/image?url=https%3A%2F%2Fimages.carandbike.com%2Fcms%2Farticles%2F2024%2F12%2F3215552%2FOla_S1_Pro_Sona_1_c6b8b5991b.jpg&w=1920&q=90",
  "Netflix Premium 4K Plan": "https://cdn.mos.cms.futurecdn.net/Yy247gYvzaMZXprhZHXy4E.jpg",
  "Spotify Premium Annual Plan": "https://hdradio.vn/upload/hinhanh/tin-tuc/spotify-la-gi-7-dieu-can-luu-y-khi-dung-ung-dung-spotify/spotify-la-gi-7-dieu-can-luu-y-khi-dung-ung-dung-spotify-48.jpg",
  "Noise ColorFit Pro 4": "https://m.media-amazon.com/images/I/61RqU14G4ZL._AC_UF1000,1000_QL80_.jpg",
  "Cold Pressed Juice Subscription": "https://www.mypromeals.com/blog/images/how-healthy-are-cold-pressed-juices.jpg",
  "UPSC Coaching Package Online": "https://chahalacademy.com/assets/upsc-coaching/best-ias-coaching-in-kolkata-fees.webp",
  "Astrology Consultation Premium": "https://www.lifewire.com/thmb/emhGnNV0Q85thL3CS96CUfTFplg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Nebula-9f5461a19961484da244ca0539caa56d.jpg",
  "Fast Fashion Haul (20 items)": "https://puck.news/wp-content/uploads/2025/08/GettyImages-1228572715-scaled-e1755816997461-1088x612.jpg",
  "Snake Oil Detox Kit": "https://m.media-amazon.com/images/I/61z8iNUqK4L._AC_UF1000,1000_QL80_.jpg",
  "Mechanical Keyboard (Custom)": "https://images.indianexpress.com/2021/06/Corsair-Mechanical-Keyboard.jpg"
};

// --- Error Boundary ---
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };
  constructor(props: ErrorBoundaryProps) {
    super(props);
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("Screen Error:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-neon-red/10 flex items-center justify-center mb-6 border border-neon-red/20 shadow-[0_0_20px_rgba(255,68,68,0.1)]">
            <X className="w-8 h-8 text-neon-red" />
          </div>
          <h2 className="font-display text-3xl text-white tracking-widest uppercase mb-4 italic underline decoration-neon-red/30 underline-offset-8">SYSTEM FAILURE</h2>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-[2px] mb-8 max-w-[280px] leading-relaxed">
            The jury component encountered a critical state error. Data integrity is prioritized.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-white text-black font-bebas text-xl tracking-[4px] uppercase skew-x-[-15deg] hover:scale-[1.02] transition-transform"
          >
            <span className="skew-x-[15deg] inline-block">REBOOT JURY</span>
          </button>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

// --- Logo Component ---
const HammerIcon = ({ size = 24, color = "#00FF88", className = "" }: { size?: number, color?: string, className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Gavel head */}
    <rect
      x="35"
      y="8"
      width="42"
      height="22"
      rx="4"
      fill={color}
      transform="rotate(45 35 8)"
    />
    {/* Gavel handle */}
    <rect
      x="8"
      y="62"
      width="52"
      height="12"
      rx="6"
      fill={color}
      transform="rotate(-45 8 62)"
    />
    {/* Handle grip detail */}
    <rect
      x="10"
      y="72"
      width="28"
      height="8"
      rx="4"
      fill={color}
      opacity="0.6"
      transform="rotate(-45 10 72)"
    />
    {/* Sound block */}
    <rect
      x="62"
      y="72"
      width="28"
      height="10"
      rx="3"
      fill={color}
      opacity="0.4"
    />
  </svg>
);

const StatsRow = () => (
  <div className="flex items-center gap-2 font-mono text-[8px] tracking-[2px] text-[#444444] uppercase">
    <span>10,421 Verdicts</span>
    <span className="opacity-30">|</span>
    <span>₹2.4CR Saved</span>
    <span className="opacity-30">|</span>
    <span>94% Accuracy</span>
  </div>
);

const ScreenTransition = ({ active }: { active: boolean }) => (
  <AnimatePresence>
    {active && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[20000] bg-black/40 backdrop-blur-sm flex items-center justify-center pointer-events-none"
      >
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
           <HammerIcon size={48} color="#00FF88" className="filter drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]" />
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Social Footer ---
const SocialFooter = () => (
  <footer className="w-full bg-[#0D0D0D] border-t border-white/5 py-4 px-6 flex flex-col items-center gap-4 mt-8">
    <div className="flex justify-center gap-5">
      {[
        { Icon: Instagram, url: "https://instagram.com/verdictapp" },
        { Icon: Facebook, url: "https://facebook.com/verdictapp" },
        { Icon: Linkedin, url: "https://linkedin.com/company/verdictapp" },
        { Icon: Twitter, url: "https://twitter.com/verdictapp" },
        { Icon: Mail, url: "mailto:contact@verdictapp.com" }
      ].map((social, i) => (
        <a 
          key={i} 
          href={social.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-9 h-9 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center text-white transition-all hover:border-neon-green hover:shadow-[0_0_10px_rgba(0,255,136,0.2)] active:scale-95"
        >
          <social.Icon size={16} />
        </a>
      ))}
    </div>
    <div className="text-[8px] text-[#333333] font-mono tracking-[2px] text-center uppercase">
      © 2026 VERDICT. All rights reserved.
    </div>
  </footer>
);

// --- Helpers ---

const getTimestampMillis = (ts: any): number => {
  if (!ts) return Date.now();
  if (typeof ts.toMillis === 'function') return ts.toMillis();
  if (ts.seconds !== undefined) return ts.seconds * 1000 + (ts.nanoseconds || 0) / 1000000;
  if (typeof ts === 'number') return ts;
  if (typeof ts === 'string') return new Date(ts).getTime();
  return Date.now();
};

const ProductImage: React.FC<{ product: Product; onError: () => void; priority?: boolean }> = ({ product, onError, priority = false }) => {
  const [imageError, setImageError] = useState(false);
  const [inView, setInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (priority) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [priority]);

  // Rule 1, 2, 3: Matching logic for DEMO_IMAGES
  const demoUrl = useMemo(() => {
    if (!product.isDemo) return null;
    
    // 1. Exact match
    if (DEMO_IMAGES[product.name]) return DEMO_IMAGES[product.name];
    
    // 2. Case-insensitive match
    const lowerName = product.name.toLowerCase();
    const ciKey = Object.keys(DEMO_IMAGES).find(k => k.toLowerCase() === lowerName);
    if (ciKey) return DEMO_IMAGES[ciKey];
    
    // 3. Partial match
    const partialKey = Object.keys(DEMO_IMAGES).find(k => 
      lowerName.includes(k.toLowerCase()) || k.toLowerCase().includes(lowerName)
    );
    if (partialKey) return DEMO_IMAGES[partialKey];
    
    return null;
  }, [product]);

  // Calculate source priority
  const src = useMemo(() => {
    if (product.isDemo) return demoUrl;
    // Rule 4: Real user posts use imageBase64 or imageUrl from DB
    return product.imageBase64 || product.imageUrl || product.image;
  }, [product, demoUrl]);
  
  const Placeholder = (
    <div className="w-full h-[220px] flex flex-col items-center justify-center bg-[#141414] relative">
      <span className="text-[48px] opacity-40">{getCategoryIcon(product.category)}</span>
      <div className="absolute bottom-4 left-4 right-4">
        <p className="font-inter font-bold text-white text-[10px] text-center uppercase tracking-[2px] opacity-40 leading-tight">{product.name}</p>
      </div>
    </div>
  );

  // Rule 5: Error handling showing category icon placeholder
  if (!src || imageError) return Placeholder;

  return (
    <div className="relative w-full h-[220px] overflow-hidden bg-[#0A0A0A]" ref={imgRef}>
      {inView ? (
        <img 
          src={src}
          className="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          alt={product.name}
          loading="lazy"
          onError={() => {
            setImageError(true);
            onError();
          }}
        />
      ) : (
        <div className="w-full h-full animate-pulse bg-white/5 flex items-center justify-center">
           <Package className="w-6 h-6 text-white/10" />
        </div>
      )}
    </div>
  );
};

// --- Firebase Configuration Helper ---
function FirebaseSetupGuide({ onClose }: { onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-2xl"
    >
      <div className="w-full max-w-sm space-y-8">
        <div className="bg-bg-dark border-2 border-neon-red/50 p-8 rounded-3xl space-y-6 shadow-[0_0_50px_rgba(255,61,61,0.2)]">
          <div className="flex items-center gap-4 text-neon-red">
            <Lock className="w-10 h-10" />
            <h2 className="font-display text-3xl tracking-tighter uppercase leading-none italic">CONSOLE<br />ACCESS<br />REQUIRED</h2>
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[11px] text-white/60 leading-relaxed uppercase">
              Anonymous Authentication is currently <span className="text-neon-red">DISABLED</span> in your Firebase Console. 
              Zero-friction guest entry requires this provider to be enabled.
            </p>

            <div className="bg-white/5 p-4 rounded-xl space-y-3 font-mono text-[10px] text-white/40 uppercase">
              <p>1. Open Firebase Console</p>
              <p>2. Go to <span className="text-white">Authentication</span></p>
              <p>3. Go to <span className="text-white">Sign-in method</span></p>
              <p>4. Enable <span className="text-neon-green">Anonymous</span></p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full h-14 bg-neon-red text-white font-bold uppercase tracking-[4px] text-xs rounded-xl shadow-[0_0_20px_rgba(255,61,61,0.2)] cursor-pointer"
          >
            I UNDERSTAND
          </button>
        </div>
        
        <p className="text-center font-mono text-[8px] text-white/20 uppercase tracking-[2px]">
          Code is ready. Waiting for backend authorization.
        </p>
      </div>
    </motion.div>
  );
}

// --- Identity Components ---

const DEMO_AVATARS: Record<string, { initials: string; color: string; textColor: string }> = {
  'Arjun_Mehta_92': { 
    initials: 'AM', 
    color: '#00FF88',
    textColor: '#0A0A0A'
  },
  'Priya_Sharma_Official': { 
    initials: 'PS', 
    color: '#FFB800',
    textColor: '#0A0A0A'
  },
  'RahulVerma_Fin': { 
    initials: 'RV', 
    color: '#4A90D9',
    textColor: '#FFFFFF'
  },
  'Sneha_Kapoor_04': { 
    initials: 'SK', 
    color: '#9B59B6',
    textColor: '#FFFFFF'
  },
  'VikasTech_Pro': { 
    initials: 'VT', 
    color: '#00FF88',
    textColor: '#0A0A0A'
  },
  'Ananya_Lifestyle': { 
    initials: 'AL', 
    color: '#FF3D3D',
    textColor: '#FFFFFF'
  },
  'Jake_Williams_US': { 
    initials: 'JW', 
    color: '#4A90D9',
    textColor: '#FFFFFF'
  },
  'Sophie_Laurent_FR': { 
    initials: 'SL', 
    color: '#FFB800',
    textColor: '#0A0A0A'
  },
  'Kai_Nakamura_JP': { 
    initials: 'KN', 
    color: '#00FF88',
    textColor: '#0A0A0A'
  },
  'Emma_Thompson_UK': { 
    initials: 'ET', 
    color: '#9B59B6',
    textColor: '#FFFFFF'
  },
  'Carlos_Rivera_MX': { 
    initials: 'CR', 
    color: '#FF3D3D',
    textColor: '#FFFFFF'
  },
  'Aisha_Al_Farsi': { 
    initials: 'AA', 
    color: '#FFB800',
    textColor: '#0A0A0A'
  },
  'deepak_buys': {
    initials: 'DB',
    color: '#00FF88',
    textColor: '#0A0A0A'
  },
  'mumbai_techie': {
    initials: 'MT',
    color: '#4A90D9',
    textColor: '#FFFFFF'
  },
  'frugal_delhi': {
    initials: 'FD',
    color: '#FFB800',
    textColor: '#0A0A0A'
  },
  'bangalore_dev': {
    initials: 'BD',
    color: '#9B59B6',
    textColor: '#FFFFFF'
  },
  'kolkata_reads': {
    initials: 'KR',
    color: '#FF3D3D',
    textColor: '#FFFFFF'
  },
  'chennai_spends': {
    initials: 'CS',
    color: '#00FF88',
    textColor: '#0A0A0A'
  },
  'pune_student': {
    initials: 'PS',
    color: '#FFB800',
    textColor: '#0A0A0A'
  },
  'hyderabad_eats': {
    initials: 'HE',
    color: '#4A90D9',
    textColor: '#FFFFFF'
  },
  'nyc_minimalist': {
    initials: 'NM',
    color: '#00FF88',
    textColor: '#0A0A0A'
  },
  'london_frugal': {
    initials: 'LF',
    color: '#9B59B6',
    textColor: '#FFFFFF'
  },
  'berlin_logic': {
    initials: 'BL',
    color: '#FF3D3D',
    textColor: '#FFFFFF'
  },
  'tokyo_precise': {
    initials: 'TP',
    color: '#FFB800',
    textColor: '#0A0A0A'
  },
  'sydney_smart': {
    initials: 'SS',
    color: '#4A90D9',
    textColor: '#FFFFFF'
  },
  'toronto_deals': {
    initials: 'TD',
    color: '#00FF88',
    textColor: '#0A0A0A'
  },
  'dubai_luxury': {
    initials: 'DL',
    color: '#FFB800',
    textColor: '#0A0A0A'
  },
  'paris_style': {
    initials: 'PS',
    color: '#9B59B6',
    textColor: '#FFFFFF'
  },
  'sg_techie': {
    initials: 'ST',
    color: '#00FF88',
    textColor: '#0A0A0A'
  },
  'seoul_gadget': {
    initials: 'SG',
    color: '#FF3D3D',
    textColor: '#FFFFFF'
  },
  'nairobi_smart': {
    initials: 'NS',
    color: '#4A90D9',
    textColor: '#FFFFFF'
  },
  'rio_budget': {
    initials: 'RB',
    color: '#FFB800',
    textColor: '#0A0A0A'
  }
};

const Avatar = ({ username, size = 32 }: { username: string; size?: number }) => {
  const avatar = DEMO_AVATARS[username];
  
  if (avatar) {
    return (
      <div style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: avatar.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.35,
        fontWeight: 'bold',
        color: avatar.textColor,
        flexShrink: 0,
        border: '1.5px solid rgba(255,255,255,0.1)'
      }}>
        {avatar.initials}
      </div>
    );
  }
  
  // For real users — show their initial
  const initial = username ? 
    username.charAt(0).toUpperCase() : '?';
  const colors = [
    '#00FF88','#FFB800','#FF3D3D',
    '#4A90D9','#9B59B6'
  ];
  const colorIndex = username ? 
    username.charCodeAt(0) % colors.length : 0;
  
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: colors[colorIndex],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: size * 0.35,
      fontWeight: 'bold',
      color: '#0A0A0A',
      flexShrink: 0,
      border: '1.5px solid rgba(255,255,255,0.1)'
    }}>
      {initial}
    </div>
  );
};

function getAvatarUrl(username: string, base64?: string) {
  if (base64) return base64;
  return `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(username)}`;
}

// --- Dopamine Helpers ---

const playTone = (freq: number, duration: number = 0.5, type: OscillatorType = 'sine', volume: number = 0.1) => {
  try {
    const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + duration);
  } catch (e) {}
};

const playAccuracyUp = () => {
  const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + 0.5);
};

const playAccuracyDown = () => {
  const AudioContext = (window.AudioContext || (window as any).webkitAudioContext);
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(880, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
  gain.gain.setValueAtTime(0.05, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + 0.5);
};

const SuspenseVerdictOverlay = ({ verdict, onFinish }: { verdict: string; onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onFinish, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[20000] bg-black flex items-center justify-center overflow-hidden"
    >
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 20, opacity: [0, 1, 0] }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute w-20 h-20 border-2 border-white rounded-full"
      />
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2 }}
        className="w-2 h-2 bg-white rounded-full z-10"
      />
      <div className="absolute top-[60%] w-full text-center">
        <div className="font-bebas text-2xl text-white tracking-[8px]">
          {"THE JURY HAS SPOKEN".split("").map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 + i * 0.05 }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </div>
      </div>
      <AnimatePresence>
         <motion.div
           initial={{ y: -500, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 1, type: "spring", damping: 15 }}
           className="absolute z-20"
         >
           <span className={`font-display text-8xl italic uppercase select-none ${
             verdict === 'ESSENTIAL' ? 'text-neon-green' : 
             verdict === 'MAYBE' ? 'text-neon-amber' : 'text-neon-red'
           }`}>
             {verdict}
           </span>
         </motion.div>
      </AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ delay: 1, duration: 0.3 }}
        className={`absolute inset-0 ${
          verdict === 'ESSENTIAL' ? 'bg-neon-green' : 
          verdict === 'MAYBE' ? 'bg-neon-amber' : 'bg-neon-red'
        }`}
      />
    </motion.div>
  );
};

const CelebrationOverlay = React.memo(({ type, onFinish }: { type: 'TEN' | 'FIFTY' | 'HUNDRED' | 'ORACLE', onFinish: () => void }) => {
  useEffect(() => {
    if (type === 'FIFTY') playTone(200, 0.4, 'sine', 0.2);
    if (type === 'ORACLE') playTone(300, 0.6, 'square', 0.1);
    const timer = setTimeout(onFinish, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[25000] bg-black flex items-center justify-center p-8 overflow-hidden"
    >
      {/* Particle Background */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: "50%", 
              y: "50%",
              opacity: 1,
              scale: 0 
            }}
            animate={{ 
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
              scale: Math.random() * 2 + 1
            }}
            transition={{ duration: 2, ease: "easeOut", delay: 0.2 }}
            className={`absolute w-1 h-1 rounded-full ${type === 'HUNDRED' ? 'bg-neon-amber' : 'bg-neon-green'}`}
          />
        ))}
      </div>

      <div className="text-center space-y-6 z-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 10 }}
        >
           <h2 className="font-bebas text-6xl text-white tracking-widest leading-none">
             {type === 'TEN' && "10 VERDICTS CAST"}
             {type === 'FIFTY' && "ACCURACY SCORE UNLOCKED"}
             {type === 'HUNDRED' && "CENTURY ACHIEVED"}
             {type === 'ORACLE' && "YOU ARE NOW AN ORACLE"}
           </h2>
           <p className="font-mono text-[10px] text-neon-green tracking-[4px] uppercase mt-4">
             {type === 'TEN' && "You are building something real."}
             {type === 'FIFTY' && "Analyzing community patterns."}
             {type === 'HUNDRED' && "Supreme consistency revealed."}
             {type === 'ORACLE' && "Your verdicts carry double weight."}
           </p>
           {type === 'ORACLE' && (
             <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
               transition={{ duration: 0.5, repeat: 3 }}
               className="mt-8 flex justify-center"
             >
               <Zap className="w-12 h-12 text-neon-green fill-current" />
             </motion.div>
           )}
        </motion.div>
      </div>

      {type === 'FIFTY' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-neon-green"
        />
      )}
    </motion.div>
  );
});

const SocialComparisonPopup = ({ type, percent }: { type: 'majority' | 'minority', percent: number }) => (
  <motion.div 
    initial={{ y: 50, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: 50, opacity: 0 }}
    className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-xl backdrop-blur-xl border border-white/10 flex items-center gap-3"
  >
    <div className={`w-2 h-2 rounded-full ${type === 'majority' ? 'bg-neon-green' : 'bg-neon-amber'} animate-pulse`} />
    <span className="font-mono text-[10px] uppercase tracking-[2px] text-white">
      {type === 'majority' ? (
        <>You voted with the majority <span className="text-neon-green">({percent}%)</span></>
      ) : (
        <>You voted against <span className="text-neon-amber">{percent}%</span> of people</>
      )}
    </span>
  </motion.div>
);

const IdentityCard = React.memo(({ userId, postedBy, light = false }: { userId: string; postedBy?: string; light?: boolean }) => {
  const [author, setAuthor] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!userId) return;
    // Basic caching/fetching for authors
    const fetchAuthor = async () => {
      try {
        const docRef = doc(db, 'users', userId);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setAuthor(snap.data() as UserProfile);
        } else if (postedBy) {
           // Fallback for demo users if not in DB
           const demo = DEMO_PROFILES.find(p => p.username === postedBy);
           if (demo) setAuthor(demo as any);
        }
      } catch (err) {
        console.error("Failed to fetch identity", err);
      }
    };
    fetchAuthor();
  }, [userId, postedBy]);

  if (!author && !postedBy) return (
    <div className="flex items-center gap-3 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-white/5" />
      <div className="space-y-1">
        <div className="h-3 w-16 bg-white/5 rounded" />
        <div className="h-2 w-12 bg-white/5 rounded" />
      </div>
    </div>
  );

  const displayUser = author || (postedBy ? DEMO_PROFILES.find(p => p.username === postedBy) : null);
  const username = displayUser?.username || postedBy || "Unknown";
  const country = displayUser?.country || "";
  const accuracyScore = displayUser?.accuracyScore || 0;
  const verdictsCast = displayUser?.verdictsCast || 0;
  const bio = displayUser?.bio || "Observing the ecosystem...";

  return (
    <div className="flex items-center gap-3 relative">
      <div className="relative">
        <Avatar username={username} size={32} />
        {verdictsCast >= 50 && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-neon-amber rounded-full border border-bg-dark flex items-center justify-center">
             <Award className="w-1.5 h-1.5 text-black" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={`font-inter font-bold text-xs uppercase tracking-tight truncate ${light ? 'text-white' : 'text-white/80'}`}>
            <span style={{
              fontSize: '11px',
              color: light ? '#FFFFFF' : '#888888',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              {username}
            </span> {country}
          </span>
          <span className="font-mono text-[8px] text-neon-green bg-neon-green/10 px-1 rounded">{accuracyScore}% ACCURATE</span>
        </div>
        <p className={`font-mono text-[9px] uppercase tracking-widest truncate ${light ? 'text-white/60' : 'text-white/30'}`}>
          {bio} • {verdictsCast} verdicts
        </p>
      </div>
    </div>
  );
});

const SplashScreen = ({ onComplete, totalSaved }: { onComplete: () => void, totalSaved: number }) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 500),
      setTimeout(() => setPhase(3), 900),
      setTimeout(() => setPhase(4), 1400),
      setTimeout(() => setPhase(5), 2000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      zIndex: 10000
    }}>
      
      {/* HAMMER */}
      <div style={{
        transform: phase >= 1 
          ? phase === 2 
            ? 'translateY(0) rotate(-5deg)' 
            : 'translateY(0) rotate(0deg)'
          : 'translateY(-120px)',
        opacity: phase >= 1 ? 1 : 0,
        transition: phase === 1 
          ? 'transform 0.3s cubic-bezier(0.34,1.2,0.64,1), opacity 0.2s'
          : 'transform 0.15s ease-out',
        marginBottom: '16px'
      }}>
        <HammerIcon size={64} color="#00FF88" />
      </div>

      {/* VERDICT TEXT */}
      <div style={{
        transform: phase >= 3 
          ? 'translateY(0)' 
          : 'translateY(20px)',
        opacity: phase >= 3 ? 1 : 0,
        transition: 'all 0.4s ease-out',
        fontSize: '64px',
        fontFamily: 'Bebas Neue, sans-serif',
        color: 'white',
        letterSpacing: '8px',
        marginBottom: '8px'
      }}>
        VERDICT
      </div>

      {/* TAGLINE */}
      <div style={{
        opacity: phase >= 4 ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
        fontSize: '10px',
        color: '#00FF88',
        letterSpacing: '4px',
        fontFamily: 'monospace',
        marginBottom: '32px'
      }}>
        AWAITING YOUR JUDGMENT.
      </div>

      {/* COUNTER */}
      <div style={{
        opacity: phase >= 4 ? 1 : 0,
        transition: 'opacity 0.4s ease-out',
        fontSize: '13px',
        color: '#00FF88',
        fontFamily: 'monospace',
        letterSpacing: '2px',
        marginBottom: '40px'
      }}>
        ₹{totalSaved.toLocaleString()} SAVED BY THIS COMMUNITY
      </div>

      {/* ENTER BUTTON */}
      <div style={{
        transform: phase >= 5 
          ? 'translateY(0)' 
          : 'translateY(20px)',
        opacity: phase >= 5 ? 1 : 0,
        transition: 'all 0.4s ease-out',
        width: '80%',
        maxWidth: '360px'
      }}>
        <button
          onClick={onComplete}
          style={{
            width: '100%',
            height: '56px',
            background: '#00FF88',
            border: 'none',
            borderRadius: '6px',
            color: '#0A0A0A',
            fontSize: '13px',
            fontWeight: 'bold',
            letterSpacing: '4px',
            cursor: 'pointer',
            fontFamily: 'inherit'
          }}
        >
          ENTER THE COURT
        </button>
      </div>

    </div>
  );
};

const FirstActionPrompt = ({ onDismiss }: { onDismiss: () => void }) => (
  <div id="first-action-prompt" className="mx-4 mb-4 bg-[#00FF88]/[0.08] border border-[#00FF88]/20 rounded-lg p-4 flex items-center gap-4 relative overflow-hidden">
    <div className="text-2xl">⚖️</div>
    <div className="flex-1">
      <h4 className="font-mono text-[11px] text-[#00FF88] font-bold tracking-[2px] uppercase">Cast your first verdict</h4>
      <p className="text-[10px] text-[#666666] leading-tight">Vote on any product below to start building your accuracy score.</p>
    </div>
    <button onClick={onDismiss} className="text-[#444444] hover:text-white p-1">
      <X size={14} />
    </button>
  </div>
);

const SkeletonCard = () => (
  <div className="bg-card-dark rounded-[24px] overflow-hidden border border-white/5 mb-8 relative">
    <div className="h-[220px] bg-white/[0.02] flex flex-col items-center justify-center gap-4">
       <div className="flex items-center gap-2">
         <div className="w-2 h-2 bg-neon-green rounded-full animate-ping" />
         <span className="font-mono text-[10px] text-white/20 tracking-[4px] uppercase whitespace-nowrap">CONSULTING THE COMMUNITY...</span>
       </div>
    </div>
    <div className="p-6 space-y-6">
      <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse" />
      <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
      <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse" />
    </div>
  </div>
);

// --- Utilities ---

const compressImage = (file: File, maxWidth = 500, quality = 0.5): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => { if (blob) resolve(blob); }, 
        'image/jpeg', 
        quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
};

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// --- Types ---

interface Product {
  id: string;
  name: string;
  price: number;
  imageBase64: string;
  imageUrl?: string; // New field for auto-fetched images
  image?: string; // Legacy field
  category: string;
  description?: string;
  roast?: string;
  votes: {
    essential: number;
    maybe: number;
    waste: number;
  };
  regretScore?: number;
  authorId: string;
  postedBy?: string;
  tags?: string[];
  isDemo?: boolean;
  createdAt: Timestamp;
}

interface UserProfile {
  username: string;
  joinDate: string;
  accuracyScore: number;
  streak: number;
  verdictsCast: number;
  oracleRank: number;
  moneySaved: number;
  avatarBase64?: string;
  bio?: string;
  onboardingComplete?: boolean;
  isDemo?: boolean;
  country?: string;
  lastAccuracyScore?: number;
  lastLoginAt?: Timestamp;
  lastBriefDate?: string;
  lastWeeklyWrappedDate?: string;
  accuracyHistory?: { date: string, score: number }[];
}

interface Comment {
  id: string;
  productId: string;
  userId: string;
  username: string;
  avatarUrl: string;
  accuracyScore: number;
  verdict: 'ESSENTIAL' | 'MAYBE' | 'WASTE';
  text: string;
  imageUrl?: string; // Base64 compressed image
  timestamp: Timestamp;
  isDemo?: boolean;
}

interface AppNotification {
  id: string;
  type: 
    | 'VOTE_ON_CASE' 
    | 'VERDICT_REACHED' 
    | 'CORRECT_VERDICT' 
    | 'COMMENT_ON_CASE' 
    | 'STREAK_REMINDER' 
    | 'ORACLE_STATUS' 
    | 'NEW_PRODUCT'
    | 'MORNING_BRIEF'
    | 'WEEKLY_WRAPPED'
    | 'ANNIVERSARY'
    | 'COMEBACK'
    | 'VERDICT_OUTCOME';
  title?: string; // Optional context title
  message: string;
  productId?: string;
  username?: string;
  productName?: string;
  verdict?: string;
  communityVerdict?: string;
  isRight?: boolean;
  accuracy?: number;
  accuracyChange?: string;
  streak?: number;
  price?: number;
  category?: string;
  timestamp: Timestamp;
  read: boolean;
  icon: string;
  stats?: any;
}

interface PendingUpload {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  imagePreview: string;
  progress: number;
}

const SkeletonProductCard: React.FC<{ pending: PendingUpload }> = ({ pending }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card-dark rounded-[16px] overflow-hidden border border-white/5 mb-8 relative"
    >
      <div className="relative aspect-square w-full bg-black/40 overflow-hidden">
        <img src={pending.imagePreview} className="w-full h-full object-cover blur-md opacity-30" alt="" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/40">
           <div className="w-full max-w-[200px] h-1 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${pending.progress}%` }}
                className="h-full bg-neon-green shadow-[0_0_10px_#00FF88]"
              />
           </div>
           <span className="font-mono text-[10px] tracking-[4px] text-neon-green animate-pulse uppercase">
             Submitting Case... {Math.round(pending.progress)}%
           </span>
        </div>
      </div>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-6 w-3/4 bg-white/5 rounded animate-pulse" />
            <div className="h-4 w-1/4 bg-white/5 rounded animate-pulse" />
          </div>
          <div className="h-5 w-16 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="flex gap-2">
           {[1, 2, 3].map(i => (
             <div key={i} className="flex-1 h-14 bg-white/5 rounded-xl border border-white/5 animate-pulse" />
           ))}
        </div>
      </div>
    </motion.div>
  );
}

// Helper: Format relative time for Morning Brief
const getMorningDisplay = () => {
  const h = new Date().getHours();
  if (h < 12) return "MORNING";
  if (h < 17) return "AFTERNOON";
  return "EVENING";
};

// Accuracy Graph Component (Retention 7)
const AccuracyGraph: React.FC<{ data: { date: string, score: number }[] }> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center border border-white/5 bg-[#141414] rounded-2xl">
        <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">Growth data accumulating...</span>
      </div>
    );
  }

  return (
    <div className="h-48 w-full bg-[#141414] border border-white/5 rounded-2xl p-4 overflow-hidden">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAcc" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00FF88" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#00FF88', fontSize: '10px', fontFamily: 'monospace' }}
            labelStyle={{ display: 'none' }}
          />
          <Area 
            type="monotone" 
            dataKey="score" 
            stroke="#00FF88" 
            fillOpacity={1} 
            fill="url(#colorAcc)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// Retention Overlay Components
const WeeklyWrappedOverlay: React.FC<{ data: any, onClose: () => void }> = ({ data, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[30000] bg-black p-6 flex flex-col overflow-y-auto"
    >
      <div className="flex-1 flex flex-col justify-center max-w-[400px] mx-auto w-full space-y-12 py-10">
        <div className="space-y-2 text-center">
          <p className="font-mono text-[10px] text-neon-green tracking-[6px] uppercase">VERDICT WRAPPED</p>
          <h2 className="font-bebas text-6xl text-white tracking-widest leading-none">YOUR WEEK IN JUDGMENT</h2>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest italic">{data.weekRange || "This Week"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
             <p className="font-mono text-[8px] text-white/40 uppercase mb-2">VERDICTS CAST</p>
             <p className="font-bebas text-4xl text-white">{data.totalVerdicts || 0}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
             <p className="font-mono text-[8px] text-white/40 uppercase mb-2">AVG ACCURACY</p>
             <p className="font-bebas text-4xl text-neon-green">{data.accuracy || 0}%</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
             <p className="font-mono text-[8px] text-white/40 uppercase mb-2">MONEY SAVED</p>
             <p className="font-bebas text-4xl text-white">₹{(data.moneySaved || 0).toLocaleString()}</p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
             <p className="font-mono text-[8px] text-white/40 uppercase mb-2">STREAK</p>
             <p className="font-bebas text-4xl text-neon-green">🔥 {data.streak || 0}</p>
          </div>
        </div>

        <div className="bg-neon-green/5 border border-neon-green/20 p-6 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-20"><Trophy className="w-12 h-12 text-neon-green"/></div>
           <p className="font-mono text-[8px] text-neon-green uppercase mb-4 tracking-widest">BEST CALL OF THE WEEK</p>
           <h3 className="font-display text-2xl text-white uppercase italic leading-tight">{data.bestCall || "N/A"}</h3>
           <p className="font-mono text-[10px] text-white/60 mt-2 uppercase">You were the first to call this a WASTE.</p>
        </div>

        <div className="space-y-4">
           <button className="w-full bg-white text-black font-bebas text-xl py-4 tracking-widest uppercase skew-x-[-15deg] transition-transform hover:scale-[1.02] active:scale-95">
             <span className="skew-x-[15deg] inline-block">SHARE YOUR WRAPPED</span>
           </button>
           <button onClick={onClose} className="w-full font-mono text-[10px] text-white/40 uppercase tracking-[4px] py-2 hover:text-white transition-colors">
              CLOSE REPORT
           </button>
        </div>
      </div>
    </motion.div>
  );
};

const AnniversaryOverlay: React.FC<{ months: number, stats: any, onClose: () => void }> = ({ months, stats, onClose }) => {
  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      className="fixed inset-0 z-[30000] bg-bg-dark p-6 flex flex-col justify-center items-center text-center space-y-10"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,136,0.1)_0%,_transparent_70%)]" />
      
      <div className="space-y-2">
        <div className="flex justify-center mb-6">
           {[...Array(3)].map((_, i) => (
             <motion.div 
               key={i}
               animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
               className="w-1.5 h-1.5 bg-neon-green rounded-full mx-1 shadow-[0_0_10px_#00FF88]" 
             />
           ))}
        </div>
        <h2 className="font-bebas text-8xl text-white tracking-widest leading-none">{months} {months === 1 ? 'MONTH' : 'MONTHS'}</h2>
        <p className="font-mono text-xl text-neon-green tracking-[10px] uppercase">AS A JUROR</p>
      </div>

      <div className="max-w-[300px] w-full space-y-4 py-8 border-y border-white/10 uppercase font-mono text-[10px] tracking-widest text-white/40">
         <div className="flex justify-between"><span>TOTAL VERDICTS</span><span className="text-white">{stats.verdictsCast}</span></div>
         <div className="flex justify-between"><span>ACCURACY SCORE</span><span className="text-neon-green">{stats.accuracyScore}%</span></div>
         <div className="flex justify-between"><span>MONEY SAVED</span><span className="text-white">₹{stats.moneySaved.toLocaleString()}</span></div>
         <div className="flex justify-between"><span>BEST CALL</span><span className="text-white">{stats.bestCall}</span></div>
      </div>

      <div className="w-full max-w-[320px] space-y-4">
        <button className="w-full bg-neon-green text-black font-bebas text-xl py-4 tracking-widest uppercase skew-x-[-15deg]">
          <span className="skew-x-[15deg] inline-block">SHARE ANNIVERSARY CARD</span>
        </button>
        <button onClick={onClose} className="w-full font-mono text-[10px] text-white/40 uppercase tracking-[4px] py-2">
           CONTINUE JUDGING
        </button>
      </div>
    </motion.div>
  );
};

const ComebackOverlay: React.FC<{ days: number, stats: any, onClose: () => void }> = ({ days, stats, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[30000] bg-black/95 backdrop-blur-2xl p-8 flex flex-col justify-center space-y-12"
    >
      <div className="space-y-4 text-center">
        <p className="font-mono text-neon-red text-sm tracking-[4px] uppercase">OPERATIVE DETECTED</p>
        <h2 className="font-bebas text-6xl text-white tracking-widest leading-none text-center italic">YOUR STREAK IS SAFE. FOR NOW. 🔥</h2>
      </div>

      <div className="space-y-8">
        <p className="font-inter text-white/60 leading-relaxed text-lg text-center">
          You have been away for <span className="text-white font-bold">{days} days</span>. While you were gone, the community moved on.
        </p>
        
        <div className="bg-neon-red/5 border border-neon-red/20 p-6 rounded-2xl relative overflow-hidden space-y-4">
           <div className="flex justify-between items-center text-center">
             <span className="font-mono text-[10px] text-neon-red uppercase tracking-widest">MISSED OPPORTUNITIES</span>
             <span className="font-bebas text-2xl text-white">{stats.missedVerdicts || 0} VERDICTS</span>
           </div>
           <div className="flex justify-between items-center text-center">
             <span className="font-mono text-[10px] text-neon-red uppercase tracking-widest">RANK DRIFT</span>
             <span className="font-bebas text-2xl text-white">↓ {stats.rankDrop || 12} POSITIONS</span>
           </div>
        </div>

        <p className="font-inter text-white/40 text-sm italic text-center">
          "{stats.competitor || 'Someone'} just passed your accuracy score. They were behind you last week."
        </p>
      </div>

      <button onClick={onClose} className="w-full bg-white text-black font-bebas text-2xl py-5 tracking-widest uppercase skew-x-[-15deg]">
        <span className="skew-x-[15deg] inline-block">RECLAIM YOUR RANK</span>
      </button>
    </motion.div>
  );
};

const MorningBriefOverlay: React.FC<{ data: any, onClose: () => void }> = React.memo(({ data, onClose }) => {
  useEffect(() => {
    // PROBLEM 1 — Show Court Report for 3 seconds then go to feed
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      className="fixed inset-0 z-[30000] bg-bg-dark flex flex-col p-8 overflow-y-auto"
    >
      <div className="max-w-[400px] mx-auto w-full space-y-12 py-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 font-mono text-neon-green text-[10px] tracking-[6px] uppercase">
             <Clock className="w-4 h-4"/> GOOD {getMorningDisplay()}
          </div>
          <h2 className="font-bebas text-6xl text-white tracking-widest leading-none">YOUR COURT REPORT</h2>
        </div>

        <div className="space-y-6">
           <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-white/5 flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-neon-green/10 flex items-center justify-center text-neon-green">
                 <Package className="w-6 h-6"/>
              </div>
              <div>
                 <p className="font-bebas text-3xl text-white leading-none">{data.newCases || 0} NEW CASES</p>
                 <p className="font-mono text-[9px] text-white/40 uppercase tracking-widest">Need your final judgment</p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5">
                 <p className="font-mono text-[8px] text-white/40 uppercase mb-1">ACCURACY</p>
                 <p className="font-bebas text-3xl text-neon-green">{data.accuracy}%</p>
              </div>
              <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5">
                 <p className="font-mono text-[8px] text-white/40 uppercase mb-1">STREAK</p>
                 <p className="font-bebas text-3xl text-neon-amber">🔥 {data.streak}D</p>
              </div>
           </div>

           {data.challenge && (
             <div className="bg-neon-red/5 p-6 rounded-2xl border border-neon-red/20 border-l-4">
                <div className="flex items-start gap-4">
                   <div className="shrink-0">
                      <Avatar username={data.challenge.username} size={32} />
                   </div>
                   <div className="space-y-1">
                      <p className="font-inter text-xs text-white/80 leading-tight">
                         <span className="text-white font-bold">{data.challenge.username}</span> challenged your verdict on <span className="text-neon-red font-bold">{data.challenge.product}</span>
                      </p>
                      <p className="font-mono text-[8px] text-white/20 uppercase">Action required</p>
                   </div>
                </div>
             </div>
           )}
        </div>

        <button onClick={onClose} className="w-full bg-neon-green text-black font-bebas text-2xl py-5 tracking-widest uppercase skew-x-[-15deg] mt-10">
           <span className="skew-x-[15deg] inline-block">ENTER THE COURT</span>
        </button>
      </div>
    </motion.div>
  );
});

function Toast({ message }: { message: string }) {
  const isRed = message.includes("CLOSED") || message.includes("FAILED") || message.includes("TERMINATED");
  return (
    <motion.div 
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 50, opacity: 0 }}
      className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] px-6 py-2 rounded-full font-mono text-[10px] font-bold tracking-[2px] shadow-lg whitespace-nowrap ${isRed ? 'bg-neon-red text-white shadow-neon-red/20' : 'bg-neon-green text-black shadow-neon-green/20'}`}
    >
      {message}
    </motion.div>
  );
}

// --- Product Components ---

function ShareCard({ product, userVote, onClose, onRecruit }: { product: Product; userVote: string; onClose: () => void; onRecruit: (msg: string) => void }) {
  const handleRecruit = async () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?case=${product.id}`;
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      onRecruit("LINK COPIED. SEND IT.");
    } catch (err) {
      console.error("Copy failed", err);
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: "THE VERDICT IS IN",
          text: `Join the court. Judge this ${product.name}.`,
          url: shareUrl
        });
      } catch (err) {
        // Share skipped
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6 backdrop-blur-xl"
    >
      <div className="w-full max-w-sm space-y-8">
        <div className="bg-[#141414] border border-neon-green/30 p-8 rounded-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-neon-green text-black font-mono text-[10px] px-4 py-1 font-bold uppercase tracking-widest">
            OFFICIAL VERDICT
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Gavel className="w-8 h-8 text-neon-green" />
              <div>
                <h4 className="font-display text-2xl text-white leading-none tracking-tight uppercase">{product.name}</h4>
                <p className="font-mono text-[10px] text-white/40 mt-1 uppercase tracking-widest">CASE ID #{Math.floor(Math.random() * 9000) + 1000}</p>
              </div>
            </div>

            <div className="aspect-square w-full rounded-2xl overflow-hidden grayscale">
              <img src={product.image} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="text-center space-y-2">
              <p className="font-mono text-[10px] text-white/40 uppercase tracking-[4px]">MY JUDGMENT:</p>
              <div className="font-display text-5xl text-neon-green tracking-widest py-2 border-y border-white/5 uppercase italic">
                {userVote}
              </div>
            </div>

            <div className="pt-4 flex justify-between items-end border-t border-white/5">
              <div className="space-y-1">
                <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest">ECOSYSTEM TOTAL</p>
                <p className="font-display text-xl text-white tracking-tight text-neon-green uppercase italic">VERDICT SETTLED</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="flex items-center gap-2 mb-1">
                  <HammerIcon size={14} />
                  <span className="font-bebas text-sm text-white tracking-widest">VERDICT</span>
                </div>
                <p className="font-mono text-[8px] text-white/30 tracking-widest underline">V_RD_CT.APP</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleRecruit}
            className="w-full py-4 bg-neon-green text-black font-bold uppercase tracking-[4px] text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] flex items-center justify-center gap-3 cursor-pointer"
          >
             <Share2 className="w-4 h-4" /> RECRUIT OTHERS
          </button>
          <button 
            onClick={onClose}
            className="w-full py-4 bg-white/5 text-white/40 font-mono text-[10px] uppercase tracking-[4px] hover:text-white transition-all underline underline-offset-4 cursor-pointer"
          >
             Back to Terminal
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// --- Components ---

// --- Components ---

function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const dotX = useSpring(0, { damping: 25, stiffness: 250 });
  const dotY = useSpring(0, { damping: 25, stiffness: 250 });
  const ringX = useSpring(0, { damping: 35, stiffness: 150 });
  const ringY = useSpring(0, { damping: 35, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block">
      <motion.div 
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        className="w-2 h-2 bg-neon-green rounded-full shadow-[0_0_10px_#00FF88]"
      />
      <motion.div 
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        className="w-6 h-6 border border-neon-green/30 rounded-full"
      />
    </div>
  );
}

// --- Landing Page ---

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();
        
        const animate = (time: number) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const easeOutQuad = (t: number) => t * (2 - t);
          setDisplayValue(Math.floor(easeOutQuad(progress) * value));
          
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return <div ref={ref} className="font-bebas text-5xl text-white">{displayValue.toLocaleString()}{suffix}</div>;
}

function LandingProductImage({ src, alt, name }: { src: string; alt: string; name: string }) {
  const [error, setError] = useState(false);
  
  if (error || !src) {
    return (
      <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center p-6 text-center">
        <span className="font-bebas text-xl text-white/20 tracking-widest uppercase">{name}</span>
      </div>
    );
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className="w-full h-full object-cover" 
      onError={() => setError(true)}
    />
  );
}

function LandingPage({ onEnter, totalSaved, recentProducts }: { onEnter: () => void; totalSaved: number; recentProducts: Product[] }) {
  const [counter, setCounter] = useState(totalSaved);

  const LANDING_PRODUCTS = [
    {
      id: 'landing_1',
      name: 'Apple AirPods Pro 2',
      price: 24900,
      image: "https://i.guim.co.uk/img/media/ba963e76f1ff9148a21027fa44a15743baf6f879/1197_1053_3680_2944/master/3680.jpg?width=1200&quality=85&auto=format&fit=max&s=ffaf42c8c421a77d9ffc9e5d4ba9e615"
    },
    {
      id: 'landing_2',
      name: 'boAt Airdopes 141',
      price: 1499,
      image: "https://m.media-amazon.com/images/I/71LStnbkz4L._AC_UF1000,1000_QL80_.jpg"
    },
    {
      id: 'landing_3',
      name: 'iPhone 16 Pro Max 256GB',
      price: 144900,
      image: "https://www.apple.com/newsroom/images/2024/09/apple-debuts-iphone-16-pro-and-iphone-16-pro-max/article/Apple-iPhone-16-Pro-hero-geo-240909_inline.jpg.large.jpg"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 50));
    }, 30000);
    return () => clearInterval(interval);
  }, [totalSaved]);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" as any }
  };

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-white overflow-x-hidden selection:bg-neon-green selection:text-black cursor-none">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col relative px-6 lg:px-20 py-8 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,136,0.05)_0%,_transparent_70%)] pointer-events-none" />
        
        {/* Nav */}
        <div className="flex justify-between items-center z-50">
          <div className="flex items-center gap-2">
            <HammerIcon size={16} />
            <span className="font-bebas text-lg tracking-[6px] text-neon-green">VERDICT</span>
          </div>
          <button 
            onClick={onEnter}
            className="border border-neon-green bg-transparent text-neon-green px-6 py-2.5 rounded-full font-mono text-[11px] tracking-[3px] hover:bg-neon-green hover:text-black transition-all duration-300 uppercase cursor-pointer"
          >
            ENTER THE COURT
          </button>
        </div>

        {/* Hero Content */}
        <div className="flex-1 flex flex-col justify-center py-20 relative z-10">
          <motion.p 
            {...fadeInUp}
            className="font-mono text-[8px] md:text-[10px] text-neon-green tracking-[5px] uppercase mb-8"
          >
            THE WORLD'S FIRST PURCHASE INTELLIGENCE NETWORK
          </motion.p>
          
          <div className="space-y-[-2vw]">
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="font-bebas text-[18vw] leading-[0.9] text-white tracking-tight"
            >
              STOP
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-bebas text-[18vw] leading-[0.9] text-white tracking-tight"
            >
              WASTING
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-bebas text-[18vw] leading-[0.9] text-white tracking-tight"
            >
              MONEY.
            </motion.h1>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/40 font-inter text-sm md:text-base mt-8 max-w-sm"
          >
            The community tells you before you regret it.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-8 flex flex-col items-center md:items-start gap-4"
          >
            <StatsRow />
            <div className="font-mono text-[11px] md:text-[13px] text-neon-green tracking-widest flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-neon-green rounded-full animate-ping" />
              ₹{counter.toLocaleString()} SAVED IN 2024
            </div>
            <p className="font-inter text-[11px] text-[#444444] mt-3 md:mt-1 opacity-80">
              Trusted by smart buyers in 🇮🇳 🇺🇸 🇬🇧 🇩🇪 🇯🇵 🇸🇬 and 14 more countries
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-12 flex flex-col sm:flex-row gap-4"
          >
            <button 
              onClick={onEnter}
              className="px-10 py-5 bg-neon-green text-black font-bold text-xs uppercase tracking-[3px] rounded hover:brightness-110 transition-all cursor-pointer shadow-[0_0_30px_rgba(0,255,136,0.2)]"
            >
              JOIN THE COURT
            </button>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-5 bg-transparent border border-white/20 text-white font-bold text-xs uppercase tracking-[2px] rounded hover:border-white transition-all cursor-pointer"
            >
              SEE HOW IT WORKS
            </button>
          </motion.div>
        </div>

        {/* Scrolling Ticker */}
        <div className="absolute bottom-0 left-0 w-full bg-black/50 border-t border-white/5 py-4 overflow-hidden">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="flex whitespace-nowrap gap-20"
          >
            {[1, 2].map(i => (
              <span key={i} className="font-mono text-[8px] text-white/20 tracking-[3px] uppercase flex items-center gap-20">
                <span>ESSENTIAL</span>
                <span>MAYBE</span>
                <span>WASTE</span>
                <span>THE VERDICT IS IN</span>
                <span>RANKED BY ACCURACY NOT ADS</span>
                <span>JOIN 10,000 SMART BUYERS</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-[#0D0D0D] py-32 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto">
          <motion.p {...fadeInUp} className="font-mono text-[8px] text-neon-green tracking-[5px] uppercase mb-20 text-center">
            HOW IT WORKS
          </motion.p>
          
          <div className="grid md:grid-cols-3 gap-16 relative">
            <div className="absolute top-1/2 left-0 w-full h-px bg-white/5 hidden md:block -translate-y-1/2 pointer-events-none" />
            
            {[
              { num: "01", title: "SOMEONE POSTS A PRODUCT", body: "A user submits something they're considering buying. The case is now open." },
              { num: "02", title: "THE COMMUNITY VOTES", body: "Essential. Maybe. Waste. Results stay hidden until you vote. No bias. No manipulation." },
              { num: "03", title: "THE VERDICT IS DELIVERED", body: "A final score emerges. Backed by real people. Not ads. Not algorithms." }
            ].map((step, i) => (
              <motion.div 
                key={i} 
                {...fadeInUp}
                transition={{ delay: i * 0.2 }}
                className="relative space-y-4"
              >
                <span className="font-bebas text-7xl text-white/5 absolute -top-8 -left-4 pointer-events-none">{step.num}</span>
                <h3 className="font-inter font-bold text-xs text-white tracking-[2px] uppercase relative z-10">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed relative z-10">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Verdicts Section */}
      <section className="py-32 bg-[#0A0A0A] px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-20">
            <p className="font-mono text-[8px] text-neon-green tracking-[5px] uppercase mb-4">LIVE FROM THE COURT</p>
            <p className="text-white/40 text-sm italic">Real verdicts. Happening right now.</p>
          </motion.div>

          <div className="flex gap-8 overflow-x-auto no-scrollbar justify-center pb-12">
            {LANDING_PRODUCTS.map((p, i) => (
              <motion.div 
                key={p.id} 
                {...fadeInUp}
                transition={{ delay: i * 0.2 }}
                className="w-[320px] flex-shrink-0"
              >
                <div className="bg-[#141414] border border-white/5 rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-500">
                  <div className="aspect-square relative">
                    <LandingProductImage src={p.image} alt={p.name} name={p.name} />
                    <div className="absolute top-4 right-4 bg-neon-green text-black font-mono text-[10px] px-3 py-1 font-bold">VERDICT REVEALED</div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-display text-xl text-white uppercase italic">{p.name}</h4>
                      <span className="text-neon-green font-mono text-sm">₹{p.price.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-1">
                      <div className="bg-neon-green/10 text-neon-green font-mono text-[8px] py-2 text-center rounded border border-neon-green/30 italic">ESSENTIAL</div>
                      <div className="bg-white/5 text-white/40 font-mono text-[8px] py-2 text-center rounded border border-white/5 uppercase">MAYBE</div>
                      <div className="bg-white/5 text-white/40 font-mono text-[8px] py-2 text-center rounded border border-white/5 uppercase">WASTE</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0D0D0D] py-24 px-6 lg:px-20 overflow-hidden">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
             <AnimatedNumber value={10000} suffix="+" />
             <p className="font-mono text-[9px] text-white/20 tracking-[3px] uppercase mt-2">VERDICTS CAST</p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
             <AnimatedNumber value={24000000} />
             <p className="font-mono text-[9px] text-white/20 tracking-[3px] uppercase mt-2">SAVED BY COMMUNITY</p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
             <AnimatedNumber value={94} suffix="%" />
             <p className="font-mono text-[9px] text-white/20 tracking-[3px] uppercase mt-2">ACCURACY RATE</p>
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
             <AnimatedNumber value={48} suffix="HR" />
             <p className="font-mono text-[9px] text-white/20 tracking-[3px] uppercase mt-2">AVG VERDICT TIME</p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-[#0A0A0A] flex flex-col items-center justify-center text-center px-6">
        <motion.div {...fadeInUp} className="space-y-4 mb-16">
          <h2 className="font-bebas text-7xl md:text-8xl lg:text-[6vw] text-white leading-none">YOUR NEXT PURCHASE<br />DESERVES A VERDICT.</h2>
          <p className="text-white/40 text-sm md:text-base italic">Join free. No credit card. Just better decisions.</p>
        </motion.div>
        
        <motion.button 
          {...fadeInUp}
          onClick={onEnter}
          className="px-12 py-6 bg-neon-green text-black font-bold text-sm uppercase tracking-[4px] rounded-sm hover:scale-105 active:scale-95 transition-all shadow-[0_0_50px_rgba(0,255,136,0.3)] cursor-pointer"
        >
          ENTER THE COURT
        </motion.button>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-12 font-mono text-[9px] text-white/10 tracking-[2px] uppercase"
        >
          EST. 2026 • VERDICT INTELLIGENCE NETWORK • V.2.0 • NODE_ACTIVE
        </motion.p>
      </section>

      {/* Footer */}
      <SocialFooter />
    </div>
  );
}

function SignOutModal({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-6 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xs bg-[#141414] border border-white/10 rounded-[32px] p-8 space-y-8 text-center"
      >
        <div className="space-y-4">
          <div className="w-16 h-16 bg-neon-red/10 rounded-full flex items-center justify-center mx-auto border border-neon-red/30">
            <LogOut className="w-8 h-8 text-neon-red" />
          </div>
          <h3 className="font-display text-2xl text-white tracking-widest uppercase">TERMINATE SESSION?</h3>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">
            You will be logged out of the intelligence network.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={onConfirm}
            className="w-full h-[56px] bg-neon-red text-white font-bold uppercase tracking-[4px] text-xs rounded-xl shadow-[0_0_20px_rgba(255,68,68,0.2)] cursor-pointer"
          >
            CONFIRM
          </button>
          <button 
            onClick={onCancel}
            className="w-full h-[56px] bg-white/5 text-white/40 font-mono font-bold uppercase tracking-[4px] text-xs rounded-xl hover:text-white transition-colors cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function AuthScreen({ onEnter, moment = "default" }: { onEnter: () => void, moment?: "default" | "post" | "vote" | "profile" }) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      // PROBLEM 3 — After sign in black screen: Immediately set local state to show feed.
      onEnter();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const momentMessages = {
    default: "Awaiting your judgment.",
    post: "Sign in to open a case. Takes 10 seconds.",
    vote: "Save your verdict history — sign in free.",
    profile: "Sign in to track your stats and ranks."
  };

  return (
    <div className="min-h-screen bg-bg-dark/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 fixed inset-0 z-[1000] text-white">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(0,255,136,0.05)_0%,_transparent_70%)]" />
      
      <div className="w-full max-w-sm z-10 space-y-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <Gavel className="w-16 h-16 text-neon-green mx-auto" />
          <h1 className="font-display text-5xl text-white tracking-widest uppercase">VERDICT</h1>
          <p className="font-mono text-[10px] text-neon-green tracking-[4px] uppercase animate-pulse">
            {momentMessages[moment]}
          </p>
        </motion.div>

        {error && (
          <div className="bg-neon-red/10 border border-neon-red/30 p-3 rounded text-[10px] font-mono text-neon-red uppercase tracking-wider text-center">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-[64px] bg-white text-black font-bold uppercase tracking-[4px] text-xs hover:bg-neon-green transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer rounded-xl shadow-[0_0_20px_rgba(0,255,136,0.2)]"
          >
            {loading ? "AUTHENTICATING..." : <><LogIn className="w-4 h-4" /> CONTINUE WITH GOOGLE</>}
          </button>
          
          <button 
            onClick={onEnter}
            className="w-full py-4 font-mono text-[9px] text-white/20 hover:text-white/60 uppercase tracking-[4px] transition-colors cursor-pointer"
          >
            Stay as Guest
          </button>
        </div>

        <div className="pt-10 border-t border-white/5">
          <p className="font-mono text-[8px] text-white/10 uppercase tracking-widest leading-relaxed">
            Instant synchronization. No passwords. No friction. 
            All data stored securely on the node.
          </p>
        </div>
      </div>
    </div>
  );
}

// --- AI Roast Service ---

const aiGenAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateRoast(productName: string, price: number): Promise<string> {
  try {
    const response = await aiGenAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are the AI of a financial court. One funny sharp roast of ${productName} at ${price}. Max 15 words.`,
    });
    return response.text?.trim() || "DEBT_TRAP_DETECTED";
  } catch (error) {
    console.error("Roast failed:", error);
    return "JUDGMENT_UNAVAILABLE";
  }
}

// --- Notification Components ---

const NotificationCard: React.FC<{ 
  notif: AppNotification; 
  onClick: (notif: AppNotification) => void;
}> = ({ notif, onClick }) => {
  const getIcon = () => {
    switch (notif.type) {
      case 'VOTE_ON_CASE': return <Gavel className="w-5 h-5 text-white/40" />;
      case 'VERDICT_REACHED': return <Gavel className="w-5 h-5 text-neon-green" />;
      case 'CORRECT_VERDICT': return <CheckCircle className="w-5 h-5 text-neon-green" />;
      case 'COMMENT_ON_CASE': return <MessageSquare className="w-5 h-5 text-white/40" />;
      case 'STREAK_REMINDER': return <Flame className="w-5 h-5 text-neon-red" />;
      case 'ORACLE_STATUS': return <Zap className="w-5 h-5 text-neon-amber" />;
      case 'NEW_PRODUCT': return <Package className="w-5 h-5 text-neon-green" />;
      default: return <Bell className="w-5 h-5 text-white/40" />;
    }
  };

  const getBorderColor = () => {
    if (notif.type === 'STREAK_REMINDER') return 'border-l-neon-red';
    if (['VERDICT_REACHED', 'CORRECT_VERDICT', 'ORACLE_STATUS', 'NEW_PRODUCT'].includes(notif.type)) return 'border-l-neon-green';
    return 'border-l-neon-amber';
  };

  const formatNotifTime = (ts: any) => {
    if (!ts) return "Just now";
    const seconds = Math.floor((Date.now() - getTimestampMillis(ts)) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(notif)}
      className={`relative group bg-[#141414] p-4 mb-2 rounded-lg border-l-[3px] ${getBorderColor()} ${notif.read ? 'opacity-50' : 'bg-[#1a1a1a] shadow-lg shadow-black/20'} cursor-pointer transition-all hover:bg-[#1c1c1c]`}
    >
      <div className="flex gap-4">
        <div className="mt-1 flex-shrink-0 flex items-center justify-center w-10">
          {notif.username ? (
            <Avatar username={notif.username} size={24} />
          ) : (
            getIcon()
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] text-white leading-tight font-inter font-medium pr-6">{notif.message}</p>
          <div className="flex justify-between items-center mt-2">
            {!notif.read && <div className="w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_8px_#00FF88]" />}
            <span className="font-mono text-[9px] text-[#444444] ml-auto">{formatNotifTime(notif.timestamp)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const NotificationPanel: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onNotificationClick: (notif: AppNotification) => void;
}> = ({ isOpen, onClose, notifications, onMarkAllRead, onClearAll, onNotificationClick }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[360px] bg-[#0D0D0D] border-l-2 border-neon-green z-[101] flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-[8px] text-neon-green tracking-[4px] uppercase">INTEL FEED</h2>
                <button onClick={onClose} className="text-white/40 hover:text-white transition-colors cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">{notifications.filter(n => !n.read).length} UNREAD REVIEWS</span>
                {notifications.some(n => !n.read) && (
                  <button 
                    onClick={onMarkAllRead}
                    className="font-mono text-[10px] text-neon-green uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    MARK ALL READ
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar no-scrollbar scroll-smooth">
              {notifications.length > 0 ? (
                notifications.map(n => (
                  <NotificationCard key={n.id} notif={n} onClick={onNotificationClick} />
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center opacity-20 space-y-4">
                  <Bell className="w-12 h-12" />
                  <p className="font-mono text-xs uppercase tracking-widest">Awaiting Intel...</p>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-6 border-t border-white/5">
                <button 
                  onClick={onClearAll}
                  className="w-full font-mono text-[11px] text-white/20 uppercase tracking-[4px] hover:text-white transition-all py-3 border border-white/5 rounded-lg cursor-pointer"
                >
                  CLEAR ALL RECORDS
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Components ---

const DeleteConfirmationModal: React.FC<{ 
  product: Product; 
  onClose: () => void; 
  onConfirm: () => void; 
}> = ({ product, onClose, onConfirm }) => {
  const totalVotes = product.votes.essential + product.votes.maybe + product.votes.waste;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#141414] w-full max-w-[400px] rounded-2xl border border-neon-red/20 p-8 relative z-10 shadow-2xl"
      >
        <div className="flex flex-col items-center text-center">
          <Trash2 className="w-12 h-12 text-neon-red mb-6" />
          <h2 className="font-display text-4xl text-white tracking-widest uppercase mb-4">DELETE THIS CASE?</h2>
          <p className="text-[13px] text-[#666666] leading-relaxed mb-6">This cannot be undone. All votes and comments will be lost.</p>
          
          {totalVotes >= 10 && (
            <div className="bg-neon-amber/5 border border-neon-amber/30 p-4 rounded-xl mb-6 flex gap-3 text-left">
              <span className="text-neon-amber text-lg">⚠</span>
              <p className="text-[12px] text-neon-amber leading-tight font-medium">This case has {totalVotes} votes. Deleting active cases affects community trust score.</p>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-8 w-full">
            <span className="font-mono text-[9px] text-white/40 uppercase tracking-widest block mb-1">TOTAL EVIDENCE</span>
            <span className="font-bebas text-3xl text-white tracking-widest">{totalVotes} VOTES</span>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={onClose}
              className="py-4 border border-white/10 rounded-xl text-white font-mono text-xs uppercase tracking-widest hover:bg-white/5 transition-all cursor-pointer"
            >
              CANCEL
            </button>
            <button 
              onClick={onConfirm}
              className="py-4 border border-neon-red bg-neon-red/10 text-neon-red font-mono text-xs uppercase tracking-[2px] font-bold rounded-xl hover:bg-neon-red hover:text-white transition-all cursor-pointer"
            >
              DELETE
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const TagModal: React.FC<{
  product: Product;
  onClose: () => void;
  onSave: (tags: string[]) => void;
}> = ({ product, onClose, onSave }) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(product.tags || []);
  const [customTag, setCustomTag] = useState("");
  const [error, setError] = useState<string | null>(null);

  const suggestedTags = [
    ["Tech", "Fashion", "Health", "Home"],
    ["Gaming", "Fitness", "Food", "Travel"],
    ["Luxury", "Budget", "StudentLife", "Gift"]
  ];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
      setError(null);
    } else {
      if (selectedTags.length >= 5) {
        setError("Maximum 5 tags allowed.");
        return;
      }
      setSelectedTags(prev => [...prev, tag]);
      setError(null);
    }
  };

  const handleAddCustom = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && customTag.trim()) {
      const tag = customTag.trim();
      const normalized = tag.charAt(0).toUpperCase() + tag.slice(1).toLowerCase();
      if (!selectedTags.includes(normalized)) {
        if (selectedTags.length >= 5) {
          setError("Maximum 5 tags allowed.");
          return;
        }
        setSelectedTags(prev => [...prev, normalized]);
        setCustomTag("");
        setError(null);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#141414] w-full max-w-[480px] rounded-2xl border border-white/5 p-8 relative z-10 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-mono text-[8px] text-neon-green tracking-[4px] uppercase">TAG YOUR CASE</h2>
          <button onClick={onClose} className="text-[#444444] hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5"/></button>
        </div>

        <p className="text-[12px] text-[#666666] mb-8">Tags help others find your case.</p>

        <div className="space-y-4 mb-8">
           {suggestedTags.map((row, i) => (
             <div key={i} className="flex flex-wrap gap-2">
               {row.map(tag => {
                 const active = selectedTags.includes(tag);
                 return (
                   <button 
                     key={tag}
                     onClick={() => handleToggleTag(tag)}
                     className={`px-4 py-2 rounded-full font-mono text-[11px] transition-all border ${active ? 'border-neon-green text-neon-green bg-neon-green/10 shadow-[0_0_10px_rgba(0,255,136,0.1)]' : 'border-white/5 text-[#888888] bg-[#1A1A1A] hover:border-white/20'} cursor-pointer`}
                   >
                     #{tag}
                   </button>
                 );
               })}
             </div>
           ))}
        </div>

        <div className="mb-8">
           <input 
             type="text"
             value={customTag}
             onChange={(e) => setCustomTag(e.target.value)}
             onKeyDown={handleAddCustom}
             placeholder="Add custom tag..."
             className="w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-5 py-4 text-sm text-white placeholder:text-[#444444] focus:outline-none focus:border-neon-green transition-all"
           />
           {error && <p className="text-neon-red text-[10px] font-mono mt-2 uppercase tracking-widest">{error}</p>}
        </div>

        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {selectedTags.map(tag => (
              <div key={tag} className="flex items-center gap-2 bg-neon-green/5 border border-neon-green/30 text-neon-green px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider">
                {tag}
                <button onClick={() => handleToggleTag(tag)} className="hover:text-white"><X className="w-3 h-3"/></button>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={() => onSave(selectedTags)}
          className="w-full h-14 bg-neon-green text-[#0A0A0A] font-bold uppercase tracking-[4px] text-xs skew-x-[-12deg] transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <span className="skew-x-[12deg] inline-block">SAVE TAGS</span>
        </button>
      </motion.div>
    </div>
  );
};

const EditCaseModal: React.FC<{
  product: Product;
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ product, onClose, onSave }) => {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [description, setDescription] = useState(product.description || "");
  const [imageBase64, setImageBase64] = useState(product.imageBase64);
  const [loading, setLoading] = useState(false);
  
  const totalVotes = product.votes.essential + product.votes.maybe + product.votes.waste;
  const isLocked = totalVotes > 10;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const compressed = await compressImage(file);
      const b64 = await blobToBase64(compressed);
      setImageBase64(b64);
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (isLocked) return;
    onSave({
      name,
      price: parseFloat(price) || 0,
      description,
      imageBase64
    });
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#141414] w-full max-w-[480px] rounded-2xl border border-white/5 p-8 relative z-10 shadow-2xl overflow-y-auto max-h-[90vh]"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-mono text-[8px] text-neon-green tracking-[4px] uppercase">EDIT CASE</h2>
          <button onClick={onClose} className="text-[#444444] hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5"/></button>
        </div>

        {isLocked && (
          <div className="bg-neon-amber/5 border border-neon-amber/20 p-4 rounded-xl mb-8">
            <h4 className="font-display text-base text-neon-amber uppercase tracking-widest leading-tight font-bold">
              CASE IS ACTIVE — Cannot edit after jury has spoken.
            </h4>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-[4px] mb-2 block">PRODUCT NAME</label>
            <input 
              type="text"
              readOnly={isLocked}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-neon-green transition-all ${isLocked ? 'opacity-50' : ''}`}
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-[4px] mb-2 block">PRICE</label>
            <input 
              type="number"
              readOnly={isLocked}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={`w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-5 py-4 text-sm text-white focus:outline-none focus:border-neon-green transition-all ${isLocked ? 'opacity-50' : ''}`}
            />
          </div>

          <div>
            <label className="font-mono text-[10px] text-white/40 uppercase tracking-[4px] mb-2 block">YOUR CASE</label>
            <textarea 
              readOnly={isLocked}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full bg-[#1A1A1A] border border-white/5 rounded-xl px-5 py-4 text-sm text-white h-20 resize-none focus:outline-none focus:border-neon-green transition-all ${isLocked ? 'opacity-50' : ''}`}
            />
          </div>

          <div>
             <label className="font-mono text-[10px] text-white/40 uppercase tracking-[4px] mb-2 block">PRODUCT INTEL</label>
             <div className="relative aspect-video rounded-xl border border-white/5 bg-black/40 overflow-hidden mb-4">
                <img src={imageBase64} className="w-full h-full object-cover" loading="lazy" />
                {loading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><div className="h-4 w-4 border-2 border-neon-green border-t-transparent rounded-full animate-spin"></div></div>}
             </div>
             {!isLocked && (
               <label className="inline-block py-2 px-4 border border-white/10 rounded-lg font-mono text-[10px] text-white tracking-widest cursor-pointer hover:bg-white/5 transition-all">
                 CHANGE IMAGE
                 <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
               </label>
             )}
          </div>
        </div>

        <button 
          disabled={isLocked || loading}
          onClick={handleSave}
          className={`w-full h-14 bg-neon-green text-[#0A0A0A] font-bold uppercase tracking-[4px] text-xs skew-x-[-12deg] transition-all mt-8 ${isLocked || loading ? 'opacity-30' : 'hover:scale-[1.02] active:scale-95 cursor-pointer'}`}
        >
          <span className="skew-x-[12deg] inline-block">UPDATE CASE</span>
        </button>
      </motion.div>
    </div>
  );
};

const TagFilterBar: React.FC<{ 
  selectedTag: string | null; 
  onSelect: (tag: string | null) => void;
  allProducts: Product[];
}> = ({ selectedTag, onSelect, allProducts }) => {
  const coreTags = ["Tech", "Fashion", "Gaming", "Health", "Budget", "Luxury"];
  
  // Calculate dynamic tags from all products to find "Most used"
  const allTags = allProducts.flatMap(p => p.tags || []);
  const tagCounts = allTags.reduce((acc, t) => {
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostUsedTags = Object.entries(tagCounts)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .map(([t]) => t)
    .filter(t => !coreTags.includes(t))
    .slice(0, 5);

  const displayTags = [...coreTags, ...mostUsedTags];
  
  return (
    <div className="w-full px-4 mb-4">
       <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
         <button 
           onClick={() => onSelect(null)}
           className={`flex-shrink-0 px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${!selectedTag ? 'border-neon-green text-neon-green bg-neon-green/10 shadow-[0_0_10px_rgba(0,255,136,0.1)]' : 'border-[#333333] text-[#666666] hover:border-white/20'}`}
         >
           All
         </button>
         {displayTags.map(tag => (
           <button 
             key={tag}
             onClick={() => onSelect(tag)}
             className={`flex-shrink-0 px-4 py-2 rounded-full font-mono text-[10px] uppercase tracking-widest border transition-all cursor-pointer ${selectedTag === tag ? 'border-neon-green text-neon-green bg-neon-green/10 shadow-[0_0_10px_rgba(0,255,136,0.1)]' : 'border-[#333333] text-[#666666] hover:border-white/20'}`}
           >
             #{tag}
           </button>
         ))}
       </div>
    </div>
  );
};

const ProductCard = React.memo(({ product, onVote, userVote, onShare, user, profile, onNotify, onEdit, onTag, onDelete, onTagClick, priority }: { 
  product: Product; 
  onVote: (verdict: 'ESSENTIAL' | 'MAYBE' | 'WASTE') => void;
  userVote?: string;
  onShare: (msg: string) => void;
  user: FirebaseUser | null;
  profile: UserProfile | null;
  onNotify: (targetId: string, payload: any) => void;
  onEdit?: (p: Product) => void;
  onTag?: (p: Product) => void;
  onDelete?: (p: Product) => void;
  onTagClick?: (tag: string) => void;
  priority?: boolean;
}) => {
  const [revealed, setRevealed] = useState(!!userVote);
  const totalVotes = product.votes.essential + product.votes.maybe + product.votes.waste;
  const [showShare, setShowShare] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentImagePreview, setCommentImagePreview] = useState<string | null>(null);
  const [commentCompressedBlob, setCommentCompressedBlob] = useState<Blob | null>(null);
  const [commentOriginalSize, setCommentOriginalSize] = useState<number | null>(null);
  const [commentNewSize, setCommentNewSize] = useState<number | null>(null);
  const [isCompressingComment, setIsCompressingComment] = useState(false);
  const commentFileInputRef = useRef<HTMLInputElement>(null);
  const [lastTotalVotes, setLastTotalVotes] = useState(totalVotes);
  const [justVotedCount, setJustVotedCount] = useState(0);

  // Trigger 3: Live Vote Counter logic
  useEffect(() => {
    if (totalVotes > lastTotalVotes) {
      setJustVotedCount(prev => prev + (totalVotes - lastTotalVotes));
      setLastTotalVotes(totalVotes);
      const timer = setTimeout(() => setJustVotedCount(0), 5000);
      return () => clearTimeout(timer);
    }
  }, [totalVotes]);

  const isBattle = totalVotes > 10 && Math.abs(product.votes.essential - product.votes.waste) <= 3;

  useEffect(() => {
    if (userVote) setRevealed(true);
  }, [userVote]);

  // Real-time Comments Listener
  useEffect(() => {
    const q = query(collection(db, 'products', product.id, 'comments'), orderBy('timestamp', 'desc'));
    return onSnapshot(q, (snap) => {
      setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });
  }, [product.id]);

  // Handle Escape key to close menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showMenu) {
        setShowMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showMenu]);

  const getPercentage = (count: number) => {
    return totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100);
  };

  const getVerdictText = () => {
    const { essential, maybe, waste } = product.votes;
    if (waste > essential && waste > maybe) return "TOTAL WASTE";
    if (essential > waste && essential > maybe) return "CERTIFIED ESSENTIAL";
    return "DEBATED MAYBE";
  };

  const handleVoteLocal = (v: 'ESSENTIAL' | 'MAYBE' | 'WASTE') => {
    if (revealed) return;
    onVote(v);
    setRevealed(true);
    setShowCommentInput(true); // Slide up input after vote
  };

  const handleCommentImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsCompressingComment(true);
      setCommentOriginalSize(file.size);
      
      const compressed = await compressImage(file, 400, 0.6);
      setCommentCompressedBlob(compressed);
      setCommentNewSize(compressed.size);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setCommentImagePreview(reader.result as string);
        setIsCompressingComment(false);
      };
      reader.readAsDataURL(compressed);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleAddComment = async () => {
    if (!user || !profile || !commentText.trim() || !userVote) return;
    setIsSubmittingComment(true);
    try {
      let imageUrl = "";
      if (commentCompressedBlob) {
        imageUrl = await blobToBase64(commentCompressedBlob);
      }

      await setDoc(doc(collection(db, 'products', product.id, 'comments')), {
        productId: product.id,
        userId: user.uid,
        username: profile.username,
        avatarUrl: getAvatarUrl(profile.username, profile.avatarBase64),
        accuracyScore: profile.accuracyScore,
        verdict: userVote,
        text: commentText.trim(),
        imageUrl: imageUrl,
        timestamp: serverTimestamp()
      });

      // Trigger TYPE 4: Someone commented on your case
      if (product.authorId !== user.uid) {
        onNotify(product.authorId, {
          type: 'COMMENT_ON_CASE',
          message: `${profile.username} added testimony on ${product.name}`,
          productId: product.id,
          productName: product.name,
          username: profile.username,
          icon: '💬'
        });
      }

      setCommentText("");
      setCommentImagePreview(null);
      setCommentCompressedBlob(null);
      setCommentOriginalSize(null);
      setCommentNewSize(null);
      setShowCommentInput(false);
    } catch (err) {
      console.error("Comment failed", err);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const formatTimeAgo = (ts: any) => {
    if (!ts) return "Just now";
    const seconds = Math.floor((Date.now() - getTimestampMillis(ts)) / 1000);
    if (seconds < 60) return `Just now`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <motion.div 
      id={product.id}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      animate={isBattle ? {
        borderColor: ["rgba(0,255,136,0.2)", "rgba(255,61,61,0.2)", "rgba(0,255,136,0.2)"],
        boxShadow: ["0 0 10px rgba(0,255,136,0.1)", "0 0 15px rgba(255,61,61,0.1)", "0 0 10px rgba(0,255,136,0.1)"]
      } : {}}
      transition={isBattle ? { duration: 2, repeat: Infinity } : { duration: 0.3 }}
      className={`bg-card-dark rounded-[24px] overflow-hidden border mb-8 relative shadow-2xl transition-all ${isBattle ? 'border-2' : 'border-white/5'}`}
    >
      {/* Live Vote Alert (Trigger 3) */}
      <AnimatePresence>
        {justVotedCount > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: -45, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 z-[100] bg-neon-green/90 text-bg-dark font-mono text-[9px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-xl"
          >
            ↑ {justVotedCount} {justVotedCount === 1 ? 'person' : 'people'} just voted on this
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity Header (Author) */}
      <div className="p-4 border-b border-white/5 bg-white/2 flex justify-between items-center relative">
        <div className="flex-1 cursor-pointer hover:bg-white/5 transition-colors">
          <IdentityCard userId={product.authorId} postedBy={product.postedBy} />
        </div>
      </div>

      {showShare && <ShareCard product={product} userVote={userVote || ""} onClose={() => setShowShare(false)} onRecruit={onShare} />}
      
      {/* Product Image Area */}
      <div className="relative h-[220px] w-full bg-[#141414] overflow-hidden group">
        <ProductImage 
          product={product} 
          onError={() => {}} // Handled inside component
          priority={priority}
        />
        
        {/* Premium Overlay */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

        {/* Time Remaining Timer (Change 3) - Only if not revealed */}
        {!revealed && (
          <div className="absolute top-4 right-14 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5">
            <span className="text-[#FFB800] text-[10px] filter drop-shadow-[0_0_8px_rgba(255,184,0,0.5)] animate-pulse">⏱</span>
            <span className="font-mono text-[10px] text-[#FFB800] tracking-wider">Verdicts close in 23h 14m</span>
          </div>
        )}

        {/* Three Dot Menu - Fix Problem 1 */}
        {user?.uid === product.authorId && (
          <div className="absolute top-[12px] right-[12px] z-[50]">
            <button 
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="w-[32px] h-[32px] flex items-center justify-center bg-black/70 border border-white/20 rounded-full text-white hover:bg-black/90 transition-all cursor-pointer z-10"
              title="Menu"
            >
              <span className="text-[18px] leading-none mb-1">⋮</span>
            </button>
            <AnimatePresence>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-[40]" onClick={(e) => { e.stopPropagation(); setShowMenu(false); }} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 top-[40px] w-[180px] bg-[#1A1A1A] border border-white/10 rounded-lg shadow-[0_8px_32px_rgba(0,0,0,0.6)] z-[100] overflow-hidden"
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); onEdit?.(product); setShowMenu(false); }}
                      className="w-full px-4 py-[14px] text-left text-[12px] text-white hover:bg-[#222222] flex items-center gap-3 transition-colors cursor-pointer font-mono tracking-wider"
                    >
                      <span className="text-base">✏️</span> Edit Case
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onTag?.(product); setShowMenu(false); }}
                      className="w-full px-4 py-[14px] text-left text-[12px] text-white hover:bg-[#222222] flex items-center gap-3 transition-colors cursor-pointer font-mono tracking-wider"
                    >
                      <span className="text-base">🏷️</span> Add Tags
                    </button>
                    <div className="h-[1px] bg-[#222222]" />
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete?.(product); setShowMenu(false); }}
                      className="w-full px-4 py-[14px] text-left text-[12px] text-[#FF3D3D] hover:bg-neon-red/10 flex items-center gap-3 transition-colors cursor-pointer font-mono tracking-wider"
                    >
                      <span className="text-base">🗑️</span> Delete Case
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        )}
        
        {/* Badge Overlay */}
        <AnimatePresence mode="wait">
          {isBattle && (
             <motion.div
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               className="absolute top-4 left-4 bg-neon-amber text-bg-dark px-3 py-1 font-bebas text-xl tracking-widest skew-x-[-15deg] z-20 shadow-xl"
             >
               <span className="skew-x-[15deg] inline-block">⚡ BATTLE VERDICT</span>
             </motion.div>
          )}
          {!revealed ? (
            <motion.div 
              key="locked"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center p-6 bg-black/20"
            >
              <div className="backdrop-blur-xl bg-white/10 border border-white/20 px-8 py-4 rounded-full">
                <span className="font-display text-xl sm:text-2xl tracking-[4px] text-white">VERDICT LOCKED</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="unlocked"
              initial={{ scale: 1.5, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 p-6 z-10"
            >
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 0.2 }}
                className="font-mono text-[10px] text-neon-green tracking-widest mb-2"
              >
                SYSTEM ANALYSIS COMPLETE
              </motion.span>
              <h3 className="font-display text-4xl sm:text-6xl text-white tracking-tighter text-center leading-none">
                {getVerdictText()}
              </h3>
              
              {/* Mini Bar Chart */}
              <div className="w-full max-w-[200px] mt-8 space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-white/60 uppercase">
                    <span>ESSENTIAL</span>
                    <span className="text-neon-green">{getPercentage(product.votes.essential)}%</span>
                  </div>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${getPercentage(product.votes.essential)}%` }} 
                    className="h-1 bg-neon-green shadow-[0_0_10px_rgba(0,255,136,0.5)]"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-white/60 uppercase">
                    <span>MAYBE</span>
                    <span className="text-neon-amber">{getPercentage(product.votes.maybe)}%</span>
                  </div>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${getPercentage(product.votes.maybe)}%` }} 
                    className="h-1 bg-neon-amber"
                  />
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between font-mono text-[10px] text-white/60 uppercase">
                    <span>WASTE</span>
                    <span className="text-neon-red">{getPercentage(product.votes.waste)}%</span>
                  </div>
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${getPercentage(product.votes.waste)}%` }} 
                    className="h-1 bg-neon-red"
                  />
                </div>
              </div>

              {/* Share Trigger */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                onClick={() => setShowShare(true)}
                className="mt-8 flex items-center gap-2 font-mono text-[8px] text-white/40 uppercase tracking-[4px] hover:text-white transition-all cursor-pointer"
              >
                <Share2 className="w-3 h-3" /> GENERATE SHARE CARD
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 space-y-6">
        {isBattle && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-4 mb-2">
            <div className="flex-1 text-center">
              <span className="block font-mono text-[9px] text-neon-green uppercase mb-1">ESSENTIAL</span>
              <span className="text-2xl font-bebas text-white tracking-widest">{product.votes.essential}</span>
            </div>
            <div className="h-0.5 flex-1 bg-white/5 relative overflow-hidden rounded-full">
               <motion.div
                 animate={{ x: ["-100%", "100%"] }}
                 transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                 className="absolute inset-0 bg-gradient-to-r from-neon-green via-neon-amber to-neon-red w-1/2"
               />
            </div>
            <div className="flex-1 text-center">
              <span className="block font-mono text-[9px] text-neon-red uppercase mb-1">WASTE</span>
              <span className="text-2xl font-bebas text-white tracking-widest">{product.votes.waste}</span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="min-w-0">
            <h4 className={`font-display text-2xl text-white tracking-tight truncate uppercase italic ${isBattle ? 'text-neon-amber' : ''}`}>
              {isBattle ? "WAR: " + product.name : product.name}
            </h4>
            
            {/* Social Proof Count (Change 3) */}
            <div className="font-mono text-[10px] text-[#444444] mt-0.5 tracking-wider uppercase">
               {totalVotes.toLocaleString()} people have judged this
            </div>

            <div className="flex items-center gap-3 mt-2">
              <span className="font-mono text-xs text-neon-green tracking-widest italic group-hover:scale-110 transition-transform block">₹{product.price.toLocaleString()}</span>
              {isBattle && (
                <span className="font-mono text-[9px] text-neon-amber bg-neon-amber/10 px-2 py-0.5 rounded uppercase tracking-[2px] animate-pulse">BATTLE_MODE</span>
              )}
            </div>
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {product.tags.map(tag => (
                  <button 
                    key={tag} 
                    onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }}
                    className="font-mono text-[9px] text-[#666666] bg-white/5 border border-white/5 px-2 py-0.5 rounded-full uppercase tracking-wider hover:border-neon-green/30 hover:text-neon-green transition-all cursor-pointer"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="font-mono text-[9px] text-white/20 bg-white/5 px-2 py-1 rounded uppercase tracking-[2px]">#{product.category}</span>
        </div>

        {/* AI Roast if present */}
        {product.roast && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border-l-2 border-neon-amber pl-4 py-1"
          >
            <p className="font-mono text-[10px] text-neon-amber italic leading-relaxed uppercase">
              {product.roast.replace(/^\/\/ ROAST_CORE:\s*/, '')}
            </p>
          </motion.div>
        )}

        {/* Vote Buttons */}
        <div className="flex gap-2">
          <button 
            disabled={revealed}
            onClick={() => handleVoteLocal('ESSENTIAL')}
            className={`flex-1 group relative flex flex-col items-center justify-center gap-1.5 min-h-[56px] py-4 rounded-xl border border-white/5 transition-all ${revealed && userVote !== 'ESSENTIAL' ? 'opacity-20 grayscale' : 'hover:border-neon-green/30 hover:bg-neon-green/5'}`}
          >
            <Check className={`w-6 h-6 ${revealed && userVote === 'ESSENTIAL' ? 'text-neon-green' : 'text-white/20 group-hover:text-neon-green'}`} />
            <span className="font-mono text-[9px] font-bold tracking-widest uppercase">ESSENTIAL</span>
            {revealed && userVote === 'ESSENTIAL' && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-neon-green rounded-full shadow-[0_0_8px_rgba(0,255,136,1)]" />}
          </button>
          
          <button 
            disabled={revealed}
            onClick={() => handleVoteLocal('MAYBE')}
            className={`flex-1 group relative flex flex-col items-center justify-center gap-1.5 min-h-[56px] py-4 rounded-xl border border-white/5 transition-all ${revealed && userVote !== 'MAYBE' ? 'opacity-20 grayscale' : 'hover:border-neon-amber/30 hover:bg-neon-amber/5'}`}
          >
            <HelpCircle className={`w-6 h-6 ${revealed && userVote === 'MAYBE' ? 'text-neon-amber' : 'text-white/20 group-hover:text-neon-amber'}`} />
            <span className="font-mono text-[9px] font-bold tracking-widest uppercase">MAYBE</span>
            {revealed && userVote === 'MAYBE' && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-neon-amber rounded-full shadow-[0_0_8px_rgba(255,184,0,1)]" />}
          </button>
 
          <button 
            disabled={revealed}
            onClick={() => handleVoteLocal('WASTE')}
            className={`flex-1 group relative flex flex-col items-center justify-center gap-1.5 min-h-[56px] py-4 rounded-xl border border-white/5 transition-all ${revealed && userVote !== 'WASTE' ? 'opacity-20 grayscale' : 'hover:border-neon-red/30 hover:bg-neon-red/5'}`}
          >
            <X className={`w-6 h-6 ${revealed && userVote === 'WASTE' ? 'text-neon-red' : 'text-white/20 group-hover:text-neon-red'}`} />
            <span className="font-mono text-[9px] font-bold tracking-widest uppercase">WASTE</span>
            {revealed && userVote === 'WASTE' && <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-neon-red rounded-full shadow-[0_0_8px_rgba(255,68,68,1)]" />}
          </button>
        </div>

        {/* Community Comments (New System) */}
        {revealed && (
          <div className="pt-6 border-t border-white/5 space-y-6">
            <div className="flex justify-between items-center px-1">
               <h5 className="font-mono text-[11px] text-white/20 uppercase tracking-[3px]">COMMUNITY RECORD</h5>
               <span className="font-mono text-[8px] text-neon-green uppercase">{totalVotes} JURORS TOTAL</span>
            </div>

            <AnimatePresence>
               {showCommentInput && (
                 <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-[#141414] border border-white/10 rounded-2xl p-4 shadow-xl"
                 >
                    <textarea 
                      placeholder="Why did you vote this way? The jury wants to know."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      className="w-full bg-transparent border-none outline-none text-[13px] text-white placeholder-[#444444] resize-none h-20"
                    />
                    
                    {commentImagePreview && (
                      <div className="relative w-20 h-20 mb-4 group/img">
                        <img src={commentImagePreview} className="w-full h-full object-cover rounded-lg border border-white/10" />
                        <button 
                          onClick={() => {
                            setCommentImagePreview(null);
                            setCommentCompressedBlob(null);
                          }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-black border border-white/20 rounded-full text-white text-[10px] flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                        {commentOriginalSize && commentNewSize && (
                          <div className="absolute top-full left-0 mt-1 whitespace-nowrap">
                            <div className="text-[8px] text-neon-green font-mono uppercase">
                              Original: {formatSize(commentOriginalSize)} → {formatSize(commentNewSize)} ✓
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center gap-4 mt-2">
                       <div className="flex items-center gap-4">
                         <input 
                           type="file" 
                           accept="image/*" 
                           className="hidden" 
                           ref={commentFileInputRef} 
                           onChange={handleCommentImageChange} 
                         />
                         <button 
                           type="button"
                           onClick={() => commentFileInputRef.current?.click()}
                           className="text-white/40 hover:text-white transition-colors cursor-pointer"
                           title="Add Testimony Photo"
                         >
                           <Camera size={18} />
                         </button>
                         {isCompressingComment && (
                            <span className="text-[10px] text-neon-green font-mono animate-pulse uppercase">PROCESSING...</span>
                         )}
                       </div>
                       <div className="flex items-center gap-4">
                         <button 
                           onClick={() => setShowCommentInput(false)}
                           className="text-[#666666] text-[11px] font-mono uppercase tracking-widest cursor-pointer"
                         >
                           SKIP
                         </button>
                         <button 
                           disabled={!commentText.trim() || isSubmittingComment || isCompressingComment}
                           onClick={handleAddComment}
                           className="bg-neon-green text-[#0A0A0A] text-[11px] font-bold px-6 py-2 rounded-lg uppercase tracking-[2px] disabled:opacity-50 cursor-pointer"
                         >
                           {isSubmittingComment ? "RECORDING..." : "ADD TESTIMONY"}
                         </button>
                       </div>
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment.id} className="group animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="flex gap-3 relative">
                    <Avatar username={comment.username} size={28} />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-inter font-bold text-xs text-white">{comment.username}</span>
                        <span className={`font-mono text-[8px] px-1.5 py-0.5 rounded uppercase font-bold 
                          ${comment.verdict === 'ESSENTIAL' ? 'bg-neon-green/10 text-neon-green' : 
                            comment.verdict === 'MAYBE' ? 'bg-neon-amber/10 text-neon-amber' : 
                            'bg-neon-red/10 text-neon-red'}`}>
                          {comment.verdict}
                        </span>
                        <span className="font-mono text-[9px] text-[#444444]">{comment.accuracyScore}% ACCURACY</span>
                      </div>
                      <p className="text-[13px] text-white pr-8 leading-relaxed font-inter font-medium opacity-90">{comment.text}</p>
                      {comment.imageUrl && (
                        <div className="mt-2 max-w-[200px] rounded-xl overflow-hidden border border-white/5 shadow-lg">
                          <img src={comment.imageUrl} className="w-full h-auto" loading="lazy" />
                        </div>
                      )}
                      <div className="font-mono text-[9px] text-[#444444]">{formatTimeAgo(comment.timestamp)}</div>
                    </div>

                    {/* Delete Comment Button for own comments */}
                    {user?.uid === comment.userId && (
                      <button 
                        onClick={async () => {
                          if (confirm("Delete this testimony?")) {
                            try {
                              await deleteDoc(doc(db, 'products', product.id, 'comments', comment.id));
                            } catch (err) {
                              console.error("Delete comment failed", err);
                            }
                          }
                        }}
                        className="p-2 text-white/40 hover:text-neon-red transition-all absolute right-0 top-0 cursor-pointer"
                        title="Delete Comment"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {comments.length === 0 && !showCommentInput && (
                <div className="text-center py-12 px-6 flex flex-col items-center gap-4">
                   <div className="font-bebas text-2xl text-white/10 tracking-[4px]">THE JURY IS SILENT.</div>
                   <p className="font-mono text-[9px] text-[#444444] uppercase tracking-widest leading-relaxed">
                     Every case needs evidence. <br/> Add your expert testimony below.
                   </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});

interface Activity {
  id: string;
  city: string;
  productName: string;
  amount: number;
  verdict: string;
  timestamp: Timestamp;
}

const TICKER_CITIES = ["Kolkata", "Delhi", "Mumbai", "Bangalore", "Chennai", "Hyderabad", "Pune", "Ahmedabad", "Gurgaon", "Noida"];

const DEFAULT_TICKER = [
  "● SCANNING FOR LIVE VERDICTS...",
  "● ESTABLISHING SECURE CONNECTION...",
  "● AWAITING COMMUNITY JUDGMENT...",
];

function LiveTicker({ totalSaved, activities }: { totalSaved: number; activities: Activity[] }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeAgo = (ts: any) => {
    const seconds = Math.floor((now - getTimestampMillis(ts)) / 1000);
    if (seconds < 60) return `Just now`;
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  const tickerItems = activities.length > 0 
    ? activities.map(a => `● ${a.city} • ${a.verdict === 'WASTE' ? 'Saved' : 'Debated'} ₹${a.amount.toLocaleString()} on ${a.productName} • ${formatTimeAgo(a.timestamp)}`)
    : DEFAULT_TICKER;

  return (
    <div className="w-full bg-bg-dark border-y border-white/5 h-10 flex items-center overflow-hidden relative">
      <motion.div 
        animate={{ x: ["0%", "-100%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="flex whitespace-nowrap gap-12"
      >
        <span className="font-mono text-[11px] text-neon-green flex items-center gap-4 uppercase font-bold">
          TOTAL ECOSYSTEM SAVINGS: ₹{totalSaved.toLocaleString()}
        </span>
        {[...tickerItems, ...tickerItems].map((item, i) => (
          <span key={i} className="font-mono text-[11px] text-[#888888] flex items-center gap-4 uppercase">
            {item}
          </span>
        ))}
      </motion.div>
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-bg-dark to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-bg-dark to-transparent z-10" />
    </div>
  );
}

// --- Onboarding & Help System ---

const OnboardingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
    else onComplete();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const skip = () => setStep(5);

  const slideTransition = {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
    transition: { duration: 0.28, ease: "easeInOut" }
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col font-inter overflow-hidden">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#222222]">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          className="h-full bg-neon-green"
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Skip Button */}
      {step < 5 && (
        <button 
          onClick={skip}
          className="absolute top-8 right-8 z-20 text-[#666666] font-mono text-[10px] tracking-widest uppercase hover:text-white transition-colors cursor-pointer"
        >
          SKIP
        </button>
      )}

      {/* Screen Content */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial="initial"
            animate="animate"
            exit="exit"
            variants={slideTransition}
            className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
          >
            {step === 1 && (
              <>
                <span className="text-6xl mb-8">💸</span>
                <h2 className="font-bebas text-[48px] text-white leading-tight mb-6">YOU HAVE WASTED MONEY.</h2>
                <p className="text-[15px] text-[#888888] leading-[1.8] max-w-[320px] mb-12">
                  We all have. That ₹3,000 protein powder that did nothing. The ₹15,000 gadget collecting dust. The shoes that hurt. Buying without real information costs Indians crores every year.
                </p>
                <div className="mt-auto mb-12">
                  <div className="font-mono text-3xl text-neon-green font-bold mb-1 uppercase tracking-tight">₹2,48,00,000+</div>
                  <div className="font-mono text-[10px] text-[#444444] tracking-widest uppercase">wasted by our community before they found VERDICT</div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="relative mb-12">
                  <div className="w-48 h-64 bg-[#141414] rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <HammerIcon size={48} color="#00FF88" className="opacity-20" />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-neon-green/10 border border-neon-green/30 rounded-full text-neon-green text-[10px] font-mono backdrop-blur-md whitespace-nowrap">
                      VERDICT UNLOCKED 🔓
                    </div>
                  </div>
                </div>
                <h2 className="font-bebas text-[48px] text-white leading-tight mb-6">THE COMMUNITY DECIDES.</h2>
                <p className="text-[15px] text-[#888888] leading-[1.8] max-w-[320px] mb-8">
                  On VERDICT, real people vote on whether a product is worth buying. Essential. Maybe. Waste. The results stay hidden until YOU vote. No bias. No sponsored reviews. Just honest verdicts from real buyers.
                </p>
                <div className="flex gap-6 mt-4">
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-2xl">📦</span>
                    <span className="text-[8px] text-[#666666] font-mono uppercase tracking-widest max-w-[60px]">Someone posts a product</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-2xl">⚖️</span>
                    <span className="text-[8px] text-[#666666] font-mono uppercase tracking-widest max-w-[60px]">Real people vote honestly</span>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <span className="text-2xl">🔓</span>
                    <span className="text-[8px] text-[#666666] font-mono uppercase tracking-widest max-w-[60px]">Truth is revealed</span>
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div className="font-bebas text-[110px] text-[#FF3D3D] leading-none mb-4">81%</div>
                <h2 className="font-bebas text-[48px] text-white leading-tight mb-6 uppercase">81% OF BUYERS REGRET THIS.</h2>
                <p className="text-[15px] text-[#888888] leading-[1.8] max-w-[320px] mb-12">
                  VERDICT tracks what happens AFTER people buy something. We follow up 7 days later and ask — do you regret it?<br/><br/>
                  This creates the Regret Score. The most honest data in shopping. Nowhere else on earth shows you this.
                </p>
                <div className="bg-[#141414] rounded-xl p-6 border border-white/5 w-full max-w-[280px]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] text-white/40 font-mono">Detox Tea ₹1,899</span>
                    <span className="text-[#FF3D3D] font-bold text-sm">81% 😔</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: '81%' }}
                       className="h-full bg-[#FF3D3D]" 
                     />
                  </div>
                  <div className="text-[9px] font-mono text-neon-green uppercase tracking-widest">Community Verdict: 73% WASTE</div>
                </div>
                <div className="mt-6 text-[9px] text-[#444444] font-mono uppercase tracking-wider">This data could have saved you ₹1,899. Now it will.</div>
              </>
            )}

            {step === 4 && (
              <>
                <h2 className="font-bebas text-[42px] md:text-[48px] text-white leading-tight mb-6 mt-4">BUILD YOUR REPUTATION.</h2>
                <p className="text-[15px] text-[#888888] leading-[1.8] max-w-[320px] mb-10">
                  Every verdict you cast is tracked. The more accurate you are — the more the community trusts you.<br/><br/>
                  Reach the top 10% accuracy and become an ORACLE. Your votes carry double weight. Your name appears on the Global Board. Your opinion shapes what millions buy.
                </p>
                
                <div className="w-full max-w-[280px] bg-[#141414] border border-white/10 rounded-xl p-5 mb-8 text-left relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Zap className="w-16 h-16 text-neon-green" />
                  </div>
                  <div className="flex items-center gap-4 mb-4 relative z-10">
                    <div className="w-12 h-12 bg-neon-green/20 rounded-lg flex items-center justify-center overflow-hidden border border-neon-green/20">
                      <div className="w-8 h-8 bg-neon-green rotate-45 rounded-sm" />
                    </div>
                    <div>
                      <div className="text-white font-bold text-sm tracking-tight">SharpMind_042 <span className="text-xs ml-1 opacity-60">🇮🇳</span></div>
                      <div className="flex items-center gap-2 mt-0.5">
                         <span className="text-neon-green font-mono text-[9px]">94% Accuracy</span>
                         <span className="bg-neon-green text-black px-1.5 py-0.5 rounded-[4px] text-[8px] font-bold uppercase tracking-tight">⚡ ORACLE BOARD</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[9px] text-white/30 font-mono uppercase tracking-[2px] italic">847 verdicts cast</div>
                </div>

                <div className="grid grid-cols-5 gap-3 mb-4">
                   {['🏁', '🔥', '💯', '⚡', '🏆'].map((e, i) => (
                     <div key={i} className="w-11 h-11 rounded-lg bg-[#141414] border border-white/5 flex items-center justify-center text-lg grayscale hover:grayscale-0 transition-all cursor-default">
                       {e}
                     </div>
                   ))}
                </div>
                <div className="text-[9px] text-[#444444] font-mono uppercase tracking-[2px]">These are earned. Never bought.</div>
              </>
            )}

            {step === 5 && (
              <>
                <div className="mb-12">
                  <motion.div
                    initial={{ y: -150, opacity: 0 }}
                    animate={{ 
                      y: 0, 
                      opacity: 1,
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ 
                      y: { type: "spring", damping: 12, stiffness: 200, duration: 0.4 },
                      rotate: { delay: 0.35, duration: 0.3 }
                    }}
                  >
                    <HammerIcon size={84} color="#00FF88" />
                  </motion.div>
                </div>
                <div className="font-bebas text-[56px] text-white leading-[0.9] mb-8 uppercase text-center tracking-tight">
                  THE COURT<br/>IS NOW<br/>IN SESSION.
                </div>
                <p className="text-[15px] text-[#888888] leading-[1.8] max-w-[320px] mb-12">
                   Cast your first verdict. Help someone avoid a mistake. Build your accuracy. Join the smartest buyers on earth.
                </p>

                <div className="flex gap-8 mb-12 justify-center">
                   <div className="flex flex-col items-center">
                      <span className="text-white font-bebas text-xl">10,000+</span>
                      <span className="text-[8px] text-[#666666] font-mono uppercase tracking-widest mt-1">Verdicts Cast</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-white font-bebas text-xl">₹2.4CR+</span>
                      <span className="text-[8px] text-[#666666] font-mono uppercase tracking-widest mt-1">Saved</span>
                   </div>
                   <div className="flex flex-col items-center">
                      <span className="text-white font-bebas text-xl">94%</span>
                      <span className="text-[8px] text-[#666666] font-mono uppercase tracking-widest mt-1">Avg Accuracy</span>
                   </div>
                </div>
                
                <div className="w-full max-w-[360px]">
                  <button 
                    onClick={onComplete}
                    className="w-full h-[60px] bg-neon-green text-[#0A0A0A] font-bebas text-2xl tracking-[4px] rounded-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-[0_0_30px_rgba(0,255,136,0.15)]"
                  >
                    ENTER THE COURT
                  </button>
                  <p className="text-[9px] text-[#444444] font-mono uppercase mt-4 tracking-[3px]">Free forever. No credit card.</p>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="p-8 pb-12 flex justify-between items-center z-20">
        <div>
          {step > 1 && (
            <button 
              onClick={prevStep}
              className="text-[#666666] font-mono text-[11px] tracking-[2px] uppercase flex items-center gap-2 hover:text-white transition-colors cursor-pointer"
            >
              ← BACK
            </button>
          )}
        </div>
        <div>
          {step < 5 && (
            <button 
              onClick={nextStep}
              className="text-neon-green font-mono text-[11px] tracking-[3px] uppercase flex items-center gap-2 hover:translate-x-2 transition-all cursor-pointer font-bold"
            >
              {step === 1 ? "I FEEL THIS →" : step === 2 ? "GOT IT →" : step === 3 ? "THIS IS POWERFUL →" : "I WANT THIS →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const HelpPanel: React.FC<{ isOpen: boolean; onClose: () => void; onStartTutorial?: () => void }> = ({ isOpen, onClose, onStartTutorial }) => {
  const badges = [
    { icon: "🏁", title: "First 10 Voter", desc: "Vote before 10 people on any product" },
    { icon: "🔥", title: "Week Warrior", desc: "Vote every day for 7 days straight" },
    { icon: "💯", title: "Century", desc: "Cast 100 total verdicts" },
    { icon: "⚡", title: "Oracle", desc: "Reach top 10% accuracy (min 50 verdicts)" },
    { icon: "🏆", title: "Season Champion", desc: "Rank #1 on Oracle Board at season end" },
    { icon: "👁️", title: "Case Opener", desc: "Post your first product for verdict" }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[1000]"
          />
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="fixed bottom-0 left-0 right-0 max-h-[85vh] bg-[#0D0D0D] border-t-2 border-neon-green rounded-t-[32px] z-[1001] overflow-y-auto"
          >
            <div className="p-8 pb-24 space-y-10">
              <div className="flex justify-between items-center">
                <h2 className="font-mono text-[10px] text-neon-green tracking-[6px] uppercase">OPERATIONS MANUAL</h2>
                <button onClick={onClose} className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-8">
                <section className="space-y-4">
                   <h3 className="font-mono text-[10px] text-white/20 uppercase tracking-[2px]">How Voting Works</h3>
                   <div className="bg-white/2 p-4 rounded-xl border border-white/5 text-[13px] text-[#888888] leading-relaxed">
                     <p>● Select Essential, Maybe, or Waste based on value.</p>
                     <p>● Once cast, the community verdict is revealed.</p>
                     <p>● Your vote is permanent and affects accuracy history.</p>
                   </div>
                </section>

                <section className="space-y-4">
                   <h3 className="font-mono text-[10px] text-white/20 uppercase tracking-[2px]">Accuracy Ranking</h3>
                   <div className="bg-white/2 p-4 rounded-xl border border-white/5 text-[13px] text-[#888888] leading-relaxed">
                     <p>● Accuracy is based on how often you match the court.</p>
                     <p>● Consistency raises your level and unlock better badges.</p>
                   </div>
                </section>

                <section className="space-y-4">
                   <h3 className="font-mono text-[10px] text-white/20 uppercase tracking-[2px]">Badge Unlocks</h3>
                   <div className="space-y-4">
                      {badges.map((b, i) => (
                        <div key={i} className="flex gap-4 bg-[#141414] p-4 rounded-xl border border-white/5">
                           <span className="text-2xl">{b.icon}</span>
                           <div>
                             <h4 className="font-inter font-bold text-sm text-white">{b.title}</h4>
                             <p className="text-xs text-[#666666] leading-tight">{b.desc}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </section>

                <section className="space-y-4">
                   <h3 className="font-mono text-[10px] text-white/20 uppercase tracking-[2px]">Oracle Status</h3>
                   <div className="bg-neon-green/5 p-4 rounded-xl border border-neon-green/10 text-[13px] text-neon-green/80 leading-relaxed">
                     <p>● Oracle status is granted to the top 10% accurate jurors.</p>
                     <p>● Your votes count as double in final community counts.</p>
                   </div>
                </section>

                <section className="pt-4">
                   <button 
                     onClick={onStartTutorial}
                     className="w-full py-4 border border-white/5 bg-white/2 rounded-xl font-mono text-[10px] text-white/40 tracking-[4px] uppercase hover:text-neon-green hover:border-neon-green/30 transition-all cursor-pointer flex items-center justify-center gap-3"
                   >
                     <HelpCircle className="w-4 h-4" />
                     How to use VERDICT
                   </button>
                </section>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

function ContactUsScreen({ onBack, onShowToast }: { onBack: () => void; onShowToast: (msg: string) => void }) {
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    onShowToast("MESSAGE RECEIVED. THANK YOU.");
    setFeedback("");
  };

  const socialIcons = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com" },
    { name: "Facebook", icon: Facebook, url: "https://facebook.com" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com" }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="min-h-screen bg-[#0A0A0A] flex flex-col text-white overflow-y-auto pb-20 no-scrollbar"
    >
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-white/5 py-6 px-6 flex items-center">
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors cursor-pointer mr-auto">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2">
           <h2 className="font-mono text-[8px] text-[#888888] tracking-[4px] uppercase">CONTACT US</h2>
        </div>
        <div className="w-6 h-6 ml-auto" />
      </header>

      <div className="p-8 space-y-12 max-w-[500px] mx-auto w-full">
        {/* Top Section */}
        <div className="space-y-4">
          <h1 className="font-bebas text-[36px] text-white leading-none uppercase tracking-tight italic">GET IN TOUCH</h1>
          <p className="font-inter text-[13px] text-[#666666] leading-[1.8]">
            Questions, feedback, or partnership enquiries. We read everything.
          </p>
        </div>

        {/* Email Section */}
        <div className="space-y-4">
          <label className="font-mono text-[8px] text-neon-green tracking-[3px] uppercase">EMAIL</label>
          <a 
            href="mailto:contact@verdict.app"
            className="flex items-center gap-3 group cursor-pointer"
          >
            <Mail className="w-5 h-5 text-white/40 group-hover:text-neon-green transition-colors" />
            <span className="font-inter text-[16px] text-white group-hover:text-neon-green transition-colors">contact@verdict.app</span>
          </a>
        </div>

        <div className="h-[1px] bg-[#1A1A1A]" />

        {/* Social Section */}
        <div className="space-y-8">
          <label className="font-mono text-[8px] text-neon-green tracking-[3px] uppercase block">FOLLOW THE COURT</label>
          <div className="flex justify-center gap-6">
            {socialIcons.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#141414] border border-white/5 flex items-center justify-center transition-all group-hover:border-white/20 group-hover:bg-[#1A1A1A]">
                  <social.icon className="w-6 h-6 text-white group-hover:text-white transition-colors" />
                </div>
                <span className="font-mono text-[9px] text-[#444444] uppercase tracking-wider group-hover:text-white/60 transition-colors">{social.name}</span>
              </a>
            ))}
          </div>
        </div>

        <div className="h-[1px] bg-[#1A1A1A]" />

        {/* Feedback Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <label className="font-mono text-[8px] text-neon-green tracking-[3px] uppercase">SEND FEEDBACK</label>
            <textarea 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us what you think. We are listening."
              className="w-full h-[120px] bg-[#141414] border border-white/5 rounded-lg p-4 text-[13px] text-white placeholder-white/20 outline-none focus:border-neon-green transition-all resize-none"
            />
          </div>

          <button 
            type="submit"
            className="w-full h-12 bg-neon-green text-[#0A0A0A] font-bold uppercase tracking-[3px] text-[11px] rounded transition-all hover:bg-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            SEND TO THE COURT
          </button>
        </form>

        {/* Footer */}
        <SocialFooter />
      </div>
    </motion.div>
  );
}

function FeedScreen({ products, pendingUploads, userVotes, onVote, onPost, onViewHotList, onViewOracle, onViewProfile, onViewContact, totalSaved, activities, onShare, user, profile, onNotify, tagFilter, onTagSelect, onStartTutorial, accuracyChange, isNightOwl, onRefresh, onLoadMore, hasMore, liveSessions, setProducts }: { 
  products: Product[]; 
  pendingUploads: PendingUpload[];
  userVotes: Record<string, string>;
  onVote: (id: string, verdict: 'ESSENTIAL' | 'MAYBE' | 'WASTE') => void;
  onPost: () => void; 
  onViewHotList: () => void; 
  onViewOracle: () => void;
  onViewProfile: () => void;
  onViewContact: () => void;
  totalSaved: number;
  activities: Activity[];
  onShare: (msg: string) => void;
  user: FirebaseUser | null;
  profile: UserProfile | null;
  onNotify: (targetId: string, payload: any) => void;
  tagFilter: string | null;
  onTagSelect: (tag: string | null) => void;
  onStartTutorial: () => void;
  accuracyChange: 'up' | 'down' | null;
  isNightOwl?: boolean;
  onRefresh: () => Promise<void>;
  onLoadMore: () => void;
  hasMore: boolean;
  liveSessions: number;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  quotaExceeded: boolean;
}) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [taggingProduct, setTaggingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  const handleUpdateCase = async (data: any) => {
    if (!editingProduct) return;
    try {
      await updateDoc(doc(db, 'products', editingProduct.id), data);
      onShare("CASE UPDATED");
      setEditingProduct(null);
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleSaveTags = async (tags: string[]) => {
    if (!taggingProduct) return;
    try {
      await updateDoc(doc(db, 'products', taggingProduct.id), { tags });
      setTaggingProduct(null);
    } catch (err) {
      console.error("Tags update failed", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    const prodId = deletingProduct.id;
    
    // Optimistic Delete
    const originalProducts = [...products];
    setProducts(prev => prev.filter(p => p.id !== prodId));
    setDeletingProduct(null);
    onShare("CASE CLOSED");

    try {
      // 1. Delete votes and comments
      const votesSnap = await getDocs(collection(db, 'products', prodId, 'votes'));
      const commentsSnap = await getDocs(collection(db, 'products', prodId, 'comments'));
      
      const batch = writeBatch(db);
      votesSnap.docs.forEach(d => batch.delete(d.ref));
      commentsSnap.docs.forEach(d => batch.delete(d.ref));
      batch.delete(doc(db, 'products', prodId));
      
      await batch.commit();
    } catch (err) {
      console.error("Delete failed", err);
      setProducts(originalProducts);
      onShare("DELETE FAILED");
    }
  };

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'notifications'), 
      orderBy('timestamp', 'desc'),
      limit(50)
    );
    return onSnapshot(q, (snap) => {
      setNotifications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppNotification)));
    });
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllRead = async () => {
    if (!user) return;
    const unread = notifications.filter(n => !n.read);
    const batch = writeBatch(db);
    unread.forEach(n => {
      batch.update(doc(db, 'users', user.uid, 'notifications', n.id), { read: true });
    });
    await batch.commit();
  };

  const handleClearAll = async () => {
    if (!user) return;
    const batch = writeBatch(db);
    notifications.forEach(n => {
      batch.delete(doc(db, 'users', user.uid, 'notifications', n.id));
    });
    await batch.commit();
  };

  const handleNotificationClick = async (notif: AppNotification) => {
    if (!user) return;
    if (!notif.read) {
      await updateDoc(doc(db, 'users', user.uid, 'notifications', notif.id), { read: true });
    }
    setIsNotifOpen(false);
    // If it has a productId, we could scroll to it or just stay here as cases are already in feed
    if (notif.productId) {
      const el = document.getElementById(notif.productId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleRefresh = async () => {
    try {
      await onRefresh();
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col text-white">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-bg-dark/90 backdrop-blur-md border-b border-white/5 py-5 px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={onViewProfile}>
             <div className={`w-9 h-9 rounded-full border-2 p-0.5 transition-all duration-300 ${
               profile && profile.streak > 0 
                 ? 'border-neon-green shadow-[0_0_15px_rgba(0,255,136,0.3)]' 
                 : (profile && profile.streak === 0 && profile.verdictsCast > 0 ? 'border-neon-red animate-pulse shadow-[0_0_15px_rgba(255,68,68,0.3)]' : 'border-white/10')
             }`}>
               <img 
                 src={profile?.avatarBase64 || getAvatarUrl(profile?.username || "Guest")} 
                 alt="Me"
                 className="w-full h-full rounded-full object-cover"
               />
               
               {/* Streak Fire Animation (Trigger 2) */}
               {profile && profile.streak > 0 && (
                 <motion.div
                   initial={{ opacity: 0, scale: 0.5 }}
                   animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 2] }}
                   transition={{ duration: 0.5 }}
                   className="absolute inset-0 bg-neon-green/20 rounded-full blur-sm"
                 />
               )}
             </div>
             
             {profile && profile.streak > 0 && (
               <div className="absolute -top-1 -right-1 bg-neon-green text-bg-dark rounded-full w-4 h-4 flex items-center justify-center border border-bg-dark">
                 <Flame className="w-2.5 h-2.5 fill-current" />
               </div>
             )}
          </div>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <HammerIcon size={20} />
            <h2 className="font-display text-2xl text-white tracking-widest leading-none">VERDICT</h2>
          </div>
          <button 
            onClick={handleRefresh}
            className="font-mono text-[8px] text-white/20 hover:text-white/60 tracking-[2px] mt-1 transition-colors uppercase"
          >
            Pull to refresh ↓
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsNotifOpen(true)}
            className="relative h-10 w-10 flex items-center justify-center text-white/60 hover:text-white transition-all cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && <div className="absolute top-2 right-2 w-2 h-2 bg-neon-red rounded-full shadow-[0_0_8px_#FF4444]" />}
          </button>
          <button 
            onClick={onPost}
            className="bg-neon-green/10 border border-neon-green/30 text-neon-green px-4 py-2 rounded-full font-mono text-[10px] tracking-widest hover:bg-neon-green/20 transition-all uppercase cursor-pointer"
          >
            Open Case +
          </button>
        </div>
      </header>

      {/* Change 2 — Social Proof in Feed Header */}
      <div className="bg-bg-dark border-b border-white/5 py-3 flex justify-center backdrop-blur-md sticky top-16 z-30">
         <StatsRow />
      </div>

      <NotificationPanel 
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onClearAll={handleClearAll}
        onNotificationClick={handleNotificationClick}
      />

      <HelpPanel 
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
        onStartTutorial={() => {
          setIsHelpOpen(false);
          onStartTutorial();
        }}
      />
 
      {/* Ticker */}
      <LiveTicker totalSaved={totalSaved} activities={activities} />

      {/* Hero Statement Banner (Change 1) for first-time users */}
      {profile && profile.verdictsCast === 0 && !localStorage.getItem('verdict_hero_dismissed') && (
        <div className="max-w-[600px] mx-auto w-full">
           <div className="mx-4 mt-6 p-5 rounded-xl border border-white/10 bg-gradient-to-br from-neon-green/[0.08] to-transparent relative flex gap-5 animate-in fade-in slide-in-from-top-4 duration-700 shadow-2xl">
            <button 
              onClick={() => {
                localStorage.setItem('verdict_hero_dismissed', 'true');
                // We just force a re-render by hitting a local state or just letting it stay until next load
                // But safer to just hides it via DOM for now or better yet, use a state.
                const el = document.getElementById('verdict-hero-banner');
                if (el) el.style.display = 'none';
              }} 
              className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
            >
              <X size={14} />
            </button>
            <div id="verdict-hero-banner" className="contents">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-neon-green/10 rounded-xl border border-neon-green/20">
                <span className="text-2xl">⚖️</span>
              </div>
              <div className="flex flex-col gap-1.5 pr-8">
                <h3 className="font-bold text-[13px] text-white tracking-[2px] uppercase">STOP GUESSING. START KNOWING.</h3>
                <p className="text-[12px] text-[#888888] leading-relaxed font-inter">The community has already judged these products. Your verdict matters.</p>
                <div className="flex items-center gap-2 mt-2">
                   <div className="w-1.5 h-1.5 bg-neon-green rounded-full animate-ping" />
                   <p className="text-[10px] text-neon-green font-mono uppercase tracking-[3px]">Cast your first verdict below ↓</p>
                </div>
              </div>
            </div>
           </div>
        </div>
      )}
      
      <TagFilterBar 
        selectedTag={tagFilter} 
        onSelect={onTagSelect} 
        allProducts={products} 
      />

      {/* Main Feed */}
      <main className={`flex-1 max-w-[600px] mx-auto w-full px-4 pt-4 pb-20 transition-colors duration-1000 ${isNightOwl ? 'bg-[#050508]' : ''}`}>
        {isNightOwl && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 bg-purple-900/5 border border-purple-500/20 rounded-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <Moon className="w-12 h-12 text-purple-400" />
             </div>
             <motion.div 
               animate={{ opacity: [0.4, 1, 0.4] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="font-mono text-[9px] text-purple-400 tracking-[4px] uppercase mb-1"
             >
               LATE NIGHT MODE // ACTIVE
             </motion.div>
             <h4 className="font-display text-3xl text-white tracking-tight uppercase italic underline decoration-purple-500/30">LATE NIGHT CONFESSIONS</h4>
             <p className="font-inter text-xs text-white/40 mt-2">Highly impulsive verdicts for the night owls.</p>
          </motion.div>
        )}
        
        {/* Trigger 5: Oracle Proximity Banner */}
        {profile && profile.oracleRank === 0 && profile.verdictsCast >= 40 && profile.verdictsCast < 50 && (
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 0px #FFB800", "0 0 15px #FFB800", "0 0 0px #FFB800"] 
            }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 30 }}
            className="mb-6 bg-neon-amber/5 border border-neon-amber/20 rounded-xl px-5 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-neon-amber animate-pulse" />
              <div>
                <p className="font-bebas text-lg text-neon-amber tracking-widest leading-none">
                  ⚡ {50 - profile.verdictsCast} VERDICTS FROM ORACLE STATUS
                </p>
                <p className="font-mono text-[9px] text-white/40 uppercase mt-1 tracking-wider">
                  Finish strong. The court is watching.
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-white/20" />
          </motion.div>
        )}

        <div className="flex justify-between items-end mb-8 px-2">
          <div className="max-w-[70%]">
            <h3 className="font-mono text-[10px] text-white/40 uppercase tracking-[4px]">
              {tagFilter ? `Filtered by #${tagFilter}` : "Trending Now"}
            </h3>
            <h4 className="font-display text-4xl text-white tracking-tight uppercase">THE CHOPPING BLOCK</h4>
          </div>
          <div className="text-right">
            <span className="font-mono text-[10px] text-neon-green bg-neon-green/10 px-2 py-0.5 rounded leading-none mb-1 block">LIVE_SESSIONS</span>
            <span className="font-mono text-white text-xs">{liveSessions.toLocaleString()} ACTIVE</span>
          </div>
        </div>

        <div className="space-y-4">
          {/* Skeletons First */}
          <AnimatePresence>
            {pendingUploads.map((p) => (
              <SkeletonProductCard key={p.id} pending={p} />
            ))}
          </AnimatePresence>

          {products.length === 0 && pendingUploads.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 px-8 text-center bg-[#0D0D0D] rounded-[32px] border border-white/5 my-4 animate-in zoom-in-95 duration-500">
               <div className="w-20 h-20 bg-neon-green/[0.03] rounded-full flex items-center justify-center mb-10 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                 <HammerIcon size={44} color="#00FF88" className="opacity-30" />
               </div>
               <h2 className="font-bebas text-[48px] text-white leading-tight mb-4 tracking-tight">THE COURT IS EMPTY.</h2>
               <p className="text-[15px] text-[#666666] leading-relaxed max-w-[280px] mb-12 font-inter">
                 {tagFilter ? "No cases found with this tag matches. Be the first to bring a case to the jury." : "No products have been judged in this area. Be the first to bring a case to the jury."}
               </p>
               {tagFilter && (
                 <button 
                   onClick={() => onTagSelect(null)}
                   className="mb-8 text-neon-green font-mono text-[10px] uppercase tracking-widest block mx-auto underline cursor-pointer"
                 >
                   Clear filter
                 </button>
               )}
               <button 
                 onClick={onPost}
                 className="w-full max-w-[240px] h-16 bg-neon-green text-[#0A0A0A] font-bebas text-2xl tracking-[4px] rounded-xl hover:brightness-110 active:scale-95 transition-all cursor-pointer shadow-[0_40px_60px_-15px_rgba(0,255,136,0.2)]"
               >
                  OPEN A CASE +
               </button>
            </div>
          ) : (
            products.map((p, index) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onVote={(v) => onVote(p.id, v)}
                userVote={userVotes[p.id]}
                onShare={onShare}
                user={user}
                profile={profile}
                onNotify={onNotify}
                onEdit={(prod) => setEditingProduct(prod)}
                onTag={(prod) => setTaggingProduct(prod)}
                onDelete={(prod) => setDeletingProduct(prod)}
                onTagClick={onTagSelect}
                priority={index < 3}
              />
            ))
          )}
        </div>

        <div className="text-center py-12">
          {hasMore ? (
            <button 
              onClick={onLoadMore}
              className="px-8 py-3 bg-white/5 border border-white/10 rounded-full font-mono text-[10px] text-white/60 tracking-[4px] uppercase hover:bg-white/10 transition-all cursor-pointer"
            >
              Load More Verdicts
            </button>
          ) : (
            <>
              <div className="h-2 w-2 bg-neon-green mx-auto animate-bounce mb-4" />
              <span className="font-mono text-[10px] text-white/30 tracking-[4px] uppercase">End of stream // Checking for new drops</span>
            </>
          )}
        </div>
        
        <SocialFooter />
      </main>

      {/* Action Modals */}
      <AnimatePresence>
        {editingProduct && (
          <EditCaseModal 
            product={editingProduct} 
            onClose={() => setEditingProduct(null)} 
            onSave={handleUpdateCase} 
          />
        )}
        {taggingProduct && (
          <TagModal 
            product={taggingProduct} 
            onClose={() => setTaggingProduct(null)} 
            onSave={handleSaveTags} 
          />
        )}
        {deletingProduct && (
          <DeleteConfirmationModal 
            product={deletingProduct} 
            onClose={() => setDeletingProduct(null)} 
            onConfirm={handleConfirmDelete} 
          />
        )}
      </AnimatePresence>

      {/* Bottom Nav Simulation (Mobile UI context) */}
      <nav className="fixed bottom-0 left-0 w-full h-16 bg-bg-dark/80 backdrop-blur-xl border-t border-white/10 px-6 flex items-center justify-around z-50">
        <div className="h-10 w-10 flex items-center justify-center text-neon-green border-b-2 border-neon-green">
           <TrendingUp className="w-6 h-6" />
        </div>
        <button 
          onClick={onViewHotList}
          className="h-10 w-10 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
        >
           <Flame className="w-6 h-6" />
        </button>
        <button 
          onClick={onViewOracle}
          className="h-10 w-10 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
        >
           <Award className="w-6 h-6" />
        </button>
        <button 
          onClick={onViewProfile}
          className="h-10 w-10 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer relative"
        >
           <User className="w-6 h-6" />
           <AnimatePresence>
             {accuracyChange === 'up' && (
               <motion.div 
                 initial={{ y: 0, opacity: 0 }}
                 animate={{ y: -25, opacity: [0, 1, 0] }}
                 exit={{ opacity: 0 }}
                 className="absolute text-neon-green"
               >
                 <ArrowUp className="w-4 h-4" />
               </motion.div>
             )}
             {accuracyChange === 'down' && (
               <motion.div 
                 initial={{ y: 0, opacity: 0 }}
                 animate={{ y: 25, opacity: [0, 1, 0] }}
                 exit={{ opacity: 0 }}
                 className="absolute text-neon-red"
               >
                 <ArrowDown className="w-4 h-4" />
               </motion.div>
             )}
           </AnimatePresence>
        </button>
        <button 
          onClick={onViewContact}
          className="h-10 w-10 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
        >
           <HelpCircle className="w-6 h-6" />
        </button>
      </nav>
    </div>
  );
}

function PostScreen({ onBack, onSubmit, userId }: { onBack: () => void; onSubmit: (data: any) => void; userId: string }) {
  const [category, setCategory] = useState("TECH");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [newSize, setNewSize] = useState<number | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categories = ["TECH", "FASHION", "HEALTH", "HOME", "OTHER"];

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setImageFile(file);
      setOriginalSize(file.size);
      
      const compressed = await compressImage(file, 500, 0.5);
      setCompressedBlob(compressed);
      setNewSize(compressed.size);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setLoading(false);
      };
      reader.readAsDataURL(compressed);
    }
  };

  const handlePost = async () => {
    if (!name || !price || !compressedBlob || !imagePreview) return;
    setLoading(true);
    try {
      onSubmit({
        name,
        price: parseFloat(price),
        category,
        description,
        preview: imagePreview,
        blob: compressedBlob
      });
    } catch (error) {
      console.error("Post processing failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col pt-8 pb-24 px-6 relative overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors cursor-pointer">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h2 className="font-mono text-xs text-[#888888] tracking-[6px] uppercase">OPEN A CASE</h2>
        <div className="w-6 h-6" /> {/* Spacer */}
      </div>

      <div className="max-w-[500px] mx-auto w-full space-y-8 pb-20">
        {/* Field: What is it */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/40 tracking-[2px] uppercase">WHAT IS IT</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mechanical Keyboard"
            className="w-full bg-[#141414] border border-white/10 rounded-lg p-5 text-white/90 outline-none focus:border-neon-green/50 transition-all font-inter"
          />
        </div>

        {/* Field: Price */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/40 tracking-[2px] uppercase">HOW MUCH</label>
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 font-mono text-neon-green">₹</span>
            <input 
              type="number" 
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#141414] border border-white/10 rounded-lg p-5 pl-10 text-white/90 outline-none focus:border-neon-green/50 transition-all font-mono"
            />
          </div>
        </div>

        {/* Field: Photo (Required) */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/40 tracking-[2px] uppercase flex justify-between">
            <span>PHOTO (REQUIRED)</span>
            {originalSize && newSize && (
              <span className="text-neon-green">
                Original: {formatSize(originalSize)} → Compressed: {formatSize(newSize)} ✓
              </span>
            )}
          </label>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleImageChange}
          />
          <div 
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`w-full aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-all cursor-pointer overflow-hidden ${imagePreview ? 'border-neon-green bg-[#141414]' : 'border-white/10 bg-[#141414]/50 hover:border-neon-green/50'}`}
          >
            {loading ? (
              <div className="text-center space-y-3">
                <div className="w-10 h-10 border-2 border-neon-green border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-mono text-[10px] text-neon-green animate-pulse uppercase">PROCESSING...</p>
              </div>
            ) : imagePreview ? (
              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6 text-white/40" />
                </div>
                <p className="font-mono text-[10px] text-white/20 tracking-widest uppercase">Add product photo (required)</p>
              </div>
            )}
          </div>
        </div>

        {/* Field: Category */}
        <div className="space-y-4">
          <label className="font-mono text-[10px] text-white/40 tracking-[2px] uppercase">CATEGORY</label>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`flex-shrink-0 px-6 py-2 rounded-full font-mono text-[10px] tracking-widest transition-all cursor-pointer ${category === c ? 'bg-neon-green text-black' : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/30'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Field: Description */}
        <div className="space-y-2">
          <label className="font-mono text-[10px] text-white/40 tracking-[2px] uppercase">YOUR CASE (OPTIONAL)</label>
          <textarea 
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Explain why this purchase is justified..."
            className="w-full bg-[#141414] border border-white/10 rounded-lg p-5 text-white/90 outline-none focus:border-neon-green/50 transition-all font-inter resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-4 text-center">
          <button 
            disabled={loading || !name || !price || !imageFile}
            onClick={handlePost}
            className="w-full bg-neon-green text-black font-bold uppercase tracking-[4px] py-5 rounded-xl text-xs hover:bg-white transition-all shadow-[0_0_20px_rgba(0,255,136,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? "FILING CASE..." : imagePreview ? "READY TO SUBMIT" : "SUBMIT FOR VERDICT"}
          </button>
          <p className="mt-4 font-inter text-[10px] text-[#444444] italic">
            Your case will receive community verdicts within 24 hours. You will be notified.
          </p>
        </div>
      </div>
    </div>
  );
}

function ConfirmationScreen({ onBack }: { onBack: () => void }) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6 text-center">
      {/* Radar Dot Animation */}
      <div className="relative mb-12">
        <div className="w-4 h-4 bg-neon-green rounded-full shadow-[0_0_20px_#00FF88]" />
        <div className="absolute top-0 left-0 w-4 h-4 bg-neon-green rounded-full animate-ping" />
        <div className="absolute top-0 left-0 w-4 h-4 bg-neon-green rounded-full animate-ping [animation-delay:0.5s] opacity-50" />
      </div>

      <div className="space-y-3">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="font-display text-4xl text-white tracking-widest leading-none"
        >
          CASE #4721 IS NOW OPEN
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-mono text-xs text-neon-green tracking-[4px] uppercase"
        >
          Awaiting community verdict.
        </motion.p>
      </div>

      <AnimatePresence>
        {showButton && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-12 w-full max-w-[400px] px-10"
          >
            <button 
              onClick={onBack}
              className="w-full border border-neon-green text-neon-green font-mono text-xs py-4 tracking-[4px] hover:bg-neon-green/10 transition-all uppercase"
            >
              Back to Feed
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function OracleBoardScreen({ onBack }: { onBack: () => void }) {
  const [filter, setFilter] = useState("GLOBAL");
  const [demoUsers, setDemoUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    // Fetch users for the board
    const q = query(collection(db, 'users'), orderBy('oracleRank', 'asc'), limit(25));
    return onSnapshot(q, (snap) => {
      const uData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      // Fallback: If snapshot is empty, use DEMO_PROFILES
      if (uData.length === 0) {
        setDemoUsers(DEMO_PROFILES as any);
      } else {
        // Merge real users with demo profiles for a full board
        const combined = [...uData];
        DEMO_PROFILES.forEach(dp => {
          if (!combined.find(u => u.username === dp.username)) combined.push(dp as any);
        });
        setDemoUsers(combined);
      }
    }, (err) => {
      console.error("Oracle board snapshot failed, using demo data", err);
      setDemoUsers(DEMO_PROFILES as any);
    });
  }, []);

  const sortedLeaderboard = useMemo(() => {
    return [...demoUsers].sort((a, b) => b.accuracyScore - a.accuracyScore);
  }, [demoUsers]);

  const filteredUsers = useMemo(() => {
    const list = filter === "GLOBAL" ? sortedLeaderboard : sortedLeaderboard.filter(u => u.country === "🇮🇳");
    return list;
  }, [sortedLeaderboard, filter]);

  return (
    <div className="min-h-screen bg-bg-dark pt-8 pb-32 px-6 relative overflow-y-auto text-white">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors cursor-pointer">
          <ChevronRight className="w-6 h-6 rotate-180" />
        </button>
        <h2 className="font-mono text-xs text-neon-green tracking-[6px] uppercase">ORACLE BOARD</h2>
        <div className="w-6 h-6" />
      </div>

      <div className="bg-[#141414] p-6 rounded-[24px] border border-white/5 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4">
           <Zap className="text-neon-green w-5 h-5 animate-pulse" />
        </div>
        <p className="font-mono text-[10px] text-white/40 uppercase tracking-[4px] mb-2">SEASON 1 ENDS IN</p>
        <h3 className="font-display text-4xl text-white italic">28 DAYS</h3>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-8 bg-black/40 p-1 rounded-full border border-white/5">
        {["GLOBAL", "INDIA"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-1 py-3 rounded-full font-mono text-[10px] tracking-widest transition-all cursor-pointer ${filter === f ? 'bg-white text-black font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)]' : 'text-white/40 hover:text-white'}`}
          >
            {f === "INDIA" ? "🇮🇳 INDIA" : "GLOBAL"}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {demoUsers.length === 0 ? (
          Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-[#141414] p-4 rounded-xl border border-white/5 flex items-center gap-4 animate-pulse">
               <div className="w-8 h-8 bg-white/5 rounded italic" />
               <div className="w-12 h-12 rounded-full bg-white/5" />
               <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-white/5 rounded" />
                  <div className="h-3 w-16 bg-white/5 rounded" />
               </div>
            </div>
          ))
        ) : filteredUsers.map((u, i) => (
          <div key={i} className="bg-[#141414] p-4 rounded-xl border border-white/5 flex items-center gap-4 relative overflow-hidden group hover:border-neon-green/30 transition-all">
             <span className="font-display text-2xl text-white/20 w-8 italic text-center">#{u.oracleRank || (i+1)}</span>
             <Avatar username={u.username} size={40} />
             <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                   <h4 className="font-inter font-bold text-white truncate text-sm uppercase">{u.username} {u.country || "🇮🇳"}</h4>
                   {u.verdictsCast >= 50 && u.accuracyScore >= 90 && <Zap className="w-3 h-3 text-neon-green" />}
                </div>
                <div className="flex items-center gap-3 mt-1">
                   <span className="font-mono text-[9px] text-neon-green uppercase tracking-widest">{u.accuracyScore}% ACCURACY</span>
                   <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">{u.verdictsCast} VERDICTS</span>
                </div>
             </div>
             <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Mock Data Extensions ---

function HotListScreen({ products, onBack, onViewProfile }: { products: Product[]; onBack: () => void; onViewProfile: () => void }) {
  const [filter, setFilter] = useState("ALL");
  const crownVariants = {
    animate: {
      y: [0, -5, 0],
      rotate: [0, 5, -5, 0],
      transition: { duration: 3, repeat: Infinity, ease: "easeInOut" as any }
    }
  };

  const getPercentage = (p: Product, type: keyof Product['votes']) => {
    const total = p.votes.essential + p.votes.maybe + p.votes.waste;
    return total === 0 ? 0 : Math.round((p.votes[type] / total) * 100);
  };

  const getTopVerdict = (p: Product) => {
    const { essential, maybe, waste } = p.votes;
    if (waste > essential && waste > maybe) return "WASTE";
    if (essential > waste && essential > maybe) return "ESSENTIAL";
    return "MAYBE";
  };

  const sortedProducts = [...products].sort((a, b) => {
    const totalA = a.votes.essential + a.votes.maybe + a.votes.waste;
    const totalB = b.votes.essential + b.votes.maybe + b.votes.waste;
    return totalB - totalA;
  });

  const filteredProducts = sortedProducts.filter(p => {
    if (filter === "ALL") return true;
    return getTopVerdict(p) === filter;
  });

  const top3 = filteredProducts.slice(0, 3);
  const others = filteredProducts.slice(3);

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col pt-8 pb-24 px-6 relative overflow-y-auto text-white">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h2 className="font-display text-4xl text-white tracking-widest uppercase">THE VERDICT IS IN</h2>
          <p className="font-mono text-[10px] text-white/40 uppercase tracking-[2px] mt-1">Ranked by accuracy. Not by ads.</p>
        </div>
        <button onClick={onBack} className="text-white/40 hover:text-white transition-colors cursor-pointer">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-6 scrollbar-hide no-scrollbar mb-8">
        {["ALL", "ESSENTIAL", "WASTE", "CONTROVERSIAL"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`flex-shrink-0 px-6 py-2 rounded-full font-mono text-[10px] tracking-widest transition-all cursor-pointer ${filter === f ? 'bg-white text-black font-bold' : 'bg-white/5 text-white/40 border border-white/10 hover:border-white/30'}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Podium Layout */}
      <div className="grid grid-cols-3 gap-2 items-end mb-16 h-64 px-4">
        {products.length === 0 ? (
          Array.from({ length: 3 }).map((_, i) => (
             <div key={i} className="flex flex-col items-center h-full animate-pulse">
                <div className="w-8 h-8 rounded-full bg-white/5 mb-2" />
                <div className="w-full bg-[#141414] border border-white/5 rounded-xl flex-1" />
             </div>
          ))
        ) : (
          <>
            {/* Slot #2 (Silver) */}
            <div className="flex flex-col items-center h-[80%]">
          <motion.div variants={crownVariants} animate="animate" className="mb-2">
            <Award className={`w-6 h-6 ${top3[1] ? 'text-white/40' : 'text-white/10'}`} />
          </motion.div>
          {top3[1] ? (
            <div className="w-full bg-[#141414] border border-white/10 rounded-xl flex-1 flex flex-col items-center justify-center p-3 relative text-center">
               <div className="aspect-square w-12 rounded-full overflow-hidden mb-2 border border-white/20">
                 <img src={top3[1].imageBase64 || top3[1].image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               </div>
               <span className="font-mono text-[9px] text-white/60 truncate w-full px-2 uppercase">{top3[1].name}</span>
               <span className="absolute -bottom-4 bg-white/10 border border-white/10 px-4 py-1 rounded-full font-display text-xs shadow-xl">#2</span>
            </div>
          ) : (
            <div className="w-full bg-[#141414]/30 border border-dashed border-white/10 rounded-xl flex-1 flex flex-col items-center justify-center p-3 relative text-center">
               <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest text-center leading-none">AWAITING VERDICT</span>
               <span className="absolute -bottom-4 bg-white/5 px-3 py-1 rounded-full font-display text-sm text-white/10">#2</span>
            </div>
          )}
        </div>

        {/* Slot #1 (Gold) */}
        <div className="flex flex-col items-center h-full">
          <motion.div variants={crownVariants} animate="animate" className="mb-2">
            <Award className={`w-8 h-8 ${top3[0] ? 'text-neon-green' : 'text-white/10'}`} />
          </motion.div>
          {top3[0] ? (
            <div className="w-full bg-[#141414] border-2 border-neon-green/30 rounded-xl flex-1 flex flex-col items-center justify-center p-3 relative text-center shadow-[0_-10px_30px_rgba(0,255,136,0.1)]">
               <div className="aspect-square w-16 rounded-full overflow-hidden mb-2 border-2 border-neon-green shadow-[0_0_15px_rgba(0,255,136,0.2)]">
                 <img src={top3[0].imageBase64 || top3[0].image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               </div>
               <span className="font-mono text-xs text-white font-bold truncate w-full px-2 uppercase italic leading-none">{top3[0].name}</span>
               <span className="absolute -bottom-5 bg-neon-green text-black px-6 py-1.5 rounded-full font-display text-xl shadow-lg">#1</span>
            </div>
          ) : (
            <div className="w-full bg-[#141414]/30 border border-dashed border-white/10 rounded-xl flex-1 flex flex-col items-center justify-center p-3 relative text-center">
               <span className="font-mono text-[10px] text-white/20 uppercase tracking-widest text-center leading-none">AWAITING VERDICT</span>
               <span className="absolute -bottom-4 bg-white/5 px-4 py-1 rounded-full font-display text-lg text-white/10">#1</span>
            </div>
          )}
        </div>

        {/* Slot #3 (Bronze) */}
        <div className="flex flex-col items-center h-[70%]">
          <motion.div variants={crownVariants} animate="animate" className="mb-2">
            <Award className={`w-5 h-5 ${top3[2] ? 'text-neon-amber' : 'text-white/10'}`} />
          </motion.div>
          {top3[2] ? (
            <div className="w-full bg-[#141414] border border-white/10 rounded-xl flex-1 flex flex-col items-center justify-center p-3 relative text-center">
               <div className="aspect-square w-10 rounded-full overflow-hidden mb-2 border border-white/20">
                 <img src={top3[2].imageBase64 || top3[2].image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
               </div>
               <span className="font-mono text-[8px] text-white/60 truncate w-full px-2 uppercase">{top3[2].name}</span>
               <span className="absolute -bottom-4 bg-white/10 border border-white/10 px-4 py-1 rounded-full font-display text-xs shadow-xl">#3</span>
            </div>
          ) : (
            <div className="w-full bg-[#141414]/30 border border-dashed border-white/10 rounded-xl flex-1 flex flex-col items-center justify-center p-3 relative text-center">
               <span className="font-mono text-[7px] text-white/20 uppercase tracking-widest text-center leading-none">AWAITING VERDICT</span>
               <span className="absolute -bottom-4 bg-white/5 px-3 py-1 rounded-full font-display text-xs text-white/10">#3</span>
            </div>
          )}
        </div>
      </>
        )}
      </div>

      {/* List View */}
      <div className="space-y-4">
        {products.length === 0 ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#141414] border border-white/5 rounded-xl animate-pulse" />
          ))
        ) : others.map((p, idx) => (
          <div key={p.id} className="flex items-center gap-4 bg-[#141414] p-4 rounded-xl border border-white/5">
             <span className="font-display text-2xl text-white/20 w-8">{idx + 4}</span>
             <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
               <img src={p.imageBase64 || p.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
             </div>
             <div className="flex-1 min-w-0">
                <h5 className="font-inter font-bold text-white truncate text-sm uppercase italic">{p.name}</h5>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${getTopVerdict(p) === 'ESSENTIAL' ? 'bg-neon-green/10 text-neon-green' : 'bg-neon-red/10 text-neon-red'}`}>
                    {getTopVerdict(p)}
                  </span>
                  <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">{p.votes.essential + p.votes.maybe + p.votes.waste} VOTES</span>
                </div>
             </div>
             <ChevronRight className="w-4 h-4 text-white/10" />
          </div>
        ))}
      </div>

      {/* Bottom Nav Simulation */}
      <nav className="fixed bottom-0 left-0 w-full h-[72px] pb-[env(safe-area-inset-bottom)] bg-bg-dark/90 backdrop-blur-2xl border-t border-white/10 px-8 flex items-center justify-around z-50">
        <button 
          onClick={onBack}
          className="h-full px-6 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
        >
           <TrendingUp className="w-7 h-7" />
        </button>
        <div className="h-full px-6 flex items-center justify-center text-neon-green relative">
           <HelpCircle className="w-7 h-7" />
           <div className="absolute bottom-0 w-12 h-0.5 bg-neon-green shadow-[0_0_10px_#00FF88]" />
        </div>
        <button 
          onClick={onViewProfile}
          className="h-full px-6 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
        >
           <User className="w-7 h-7" />
        </button>
      </nav>
    </div>
  );
}

function ProfileScreen({ profile, onBack, onSignOut, onViewContact, userId }: { profile: UserProfile | null; onBack: () => void; onSignOut: () => void; onViewContact: () => void; userId: string }) {
  const [showSignOut, setShowSignOut] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [newBio, setNewBio] = useState(profile?.bio || "");
  const [isEditingCountry, setIsEditingCountry] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [displayedScore, setDisplayedScore] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!userId || !profile) return;
    const target = profile.accuracyScore;
    let start = 0;
    const duration = 1200;
    const interval = 25;
    const steps = duration / interval;
    const step = target / steps;

    if (target > 0) {
      if (profile.lastAccuracyScore === undefined || target > profile.lastAccuracyScore) {
        playAccuracyUp();
      } else if (target < profile.lastAccuracyScore) {
        playAccuracyDown();
      }
    }

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setDisplayedScore(target);
        clearInterval(timer);
      } else {
        setDisplayedScore(Math.floor(start));
      }
    }, interval);
    
    if (userId && target !== profile.lastAccuracyScore) {
       setDoc(doc(db, 'users', userId), { lastAccuracyScore: target }, { merge: true });
    }

    return () => clearInterval(timer);
  }, [profile?.accuracyScore, userId]);

  const countries = [
    { name: "India", flag: "🇮🇳" }, { name: "USA", flag: "🇺🇸" }, { name: "UK", flag: "🇬🇧" },
    { name: "Australia", flag: "🇦🇺" }, { name: "Canada", flag: "🇨🇦" }, { name: "Germany", flag: "🇩🇪" },
    { name: "Singapore", flag: "🇸🇬" }, { name: "UAE", flag: "🇦🇪" }, { name: "Japan", flag: "🇯🇵" },
    { name: "South Korea", flag: "🇰🇷" }, { name: "France", flag: "🇫🇷" }, { name: "Brazil", flag: "🇧🇷" },
    { name: "South Africa", flag: "🇿🇦" }, { name: "Nigeria", flag: "🇳🇬" }, { name: "Malaysia", flag: "🇲🇾" },
    { name: "Philippines", flag: "🇵🇭" }, { name: "Bangladesh", flag: "🇧🇩" }, { name: "Pakistan", flag: "🇵🇰" },
    { name: "New Zealand", flag: "🇳🇿" }, { name: "Indonesia", flag: "🇮🇩" }
  ];

  if (!profile) return null;

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!userId) return;
    setUploading(true);
    try {
      const compressed = await compressImage(file);
      const b64 = await blobToBase64(compressed);
      await setDoc(doc(db, 'users', userId), { avatarBase64: b64 }, { merge: true });
    } catch (err) {
      console.error("Avatar upload failed", err);
    } finally {
      setUploading(false);
    }
  };

  const saveBio = async () => {
    if (!userId) return;
    try {
      await setDoc(doc(db, 'users', userId), { bio: newBio }, { merge: true });
      setIsEditingBio(false);
    } catch (err) {
      console.error("Bio save failed", err);
    }
  };

  const setCountry = async (flag: string) => {
    if (!userId) return;
    try {
      await setDoc(doc(db, 'users', userId), { country: flag }, { merge: true });
      setIsEditingCountry(false);
    } catch (err) {
      console.error("Country save failed", err);
    }
  };

  const bioSuggestions = [
    "Tech minimalist. Never overpays.",
    "Impulsive buyer trying to do better.",
    "I research everything twice."
  ];

  const badges = [
    { id: 1, name: "Oracle", locked: profile.verdictsCast < 50, icon: Award },
    { id: 2, name: "Saver", locked: profile.moneySaved < 10000, icon: TrendingUp },
    { id: 3, name: "Sentinel", locked: profile.accuracyScore < 95, icon: Lock },
    { id: 4, name: "Judge", locked: profile.verdictsCast < 10, icon: Check },
  ];

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col pt-8 pb-32 px-6 relative overflow-y-auto text-white">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
      
      <AnimatePresence>
        {showSignOut && (
          <SignOutModal onConfirm={onSignOut} onCancel={() => setShowSignOut(false)} />
        )}
      </AnimatePresence>

      <div className="flex flex-col items-center mb-12 bg-[#141414] p-8 rounded-[32px] border border-white/5 relative overflow-hidden text-center">
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-neon-green/5 to-transparent" />
        
        <div onClick={handleAvatarClick} className="relative group cursor-pointer mb-6">
          <Avatar username={profile.username} size={80} />
          <div className="absolute bottom-1 right-1 bg-neon-green text-black p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-4 h-4" />
          </div>
          {uploading && (
             <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-6 h-6 border-2 border-neon-green border-t-transparent rounded-full animate-spin" />
             </div>
          )}
        </div>
        
        <div className="z-10 space-y-4 w-full">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display text-4xl text-white tracking-tight uppercase italic">{profile.username}</h3>
              <button onClick={() => setIsEditingCountry(!isEditingCountry)} className="text-2xl hover:scale-110 transition-transform cursor-pointer">
                {profile.country || "🇮🇳"}
              </button>
            </div>
            
            <AnimatePresence>
              {isEditingCountry && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute top-52 left-1/2 -translate-x-1/2 bg-[#1A1A1A] border border-white/10 rounded-2xl shadow-2xl p-4 z-50 grid grid-cols-5 gap-2 w-[240px]"
                >
                  {countries.map(c => (
                    <button key={c.flag} onClick={() => setCountry(c.flag)} className="text-xl p-2 hover:bg-white/5 rounded-lg transition-colors cursor-pointer">
                      {c.flag}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <p className="font-mono text-[9px] text-white/40 uppercase tracking-[4px]">OPERATIVE SINCE {new Date(profile.joinDate).getFullYear()}</p>
          </div>

          {/* Bio Section */}
          <div className="pt-4 border-t border-white/5 w-full">
            {isEditingBio ? (
              <div className="space-y-4">
                <input 
                  autoFocus
                  maxLength={80}
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full bg-black/20 border-b border-neon-green/30 py-2 text-center font-inter text-sm text-white focus:border-neon-green outline-none"
                  onBlur={saveBio}
                  onKeyDown={(e) => e.key === 'Enter' && saveBio()}
                />
                <div className="flex flex-wrap justify-center gap-2">
                  {bioSuggestions.map(s => (
                    <button 
                      key={s}
                      onClick={() => setNewBio(s)}
                      className="font-mono text-[8px] text-white/30 border border-white/10 px-2 py-1 rounded hover:text-white hover:border-white transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div 
                onClick={() => setIsEditingBio(true)}
                className="group flex items-center justify-center gap-2 cursor-pointer"
              >
                <p className="font-inter text-sm text-white/60 italic">
                  {profile.bio || "What kind of buyer are you?"}
                </p>
                <Pencil className="w-3 h-3 text-white/20 group-hover:text-neon-green transition-colors" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hero Stat */}
      <div className="text-center space-y-2 mb-4 py-10 border-y border-white/5 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,255,136,0.03)_0%,_transparent_70%)]" />
        <p className="font-mono text-[10px] text-[#888888] tracking-[6px] uppercase relative z-10">YOU SAVED</p>
        <h2 className="font-display text-7xl sm:text-8xl text-neon-green tracking-widest relative z-10">₹{profile.moneySaved.toLocaleString()}</h2>
        <p className="font-mono text-[10px] text-[#888888] uppercase tracking-[2px] relative z-10">Across {profile.verdictsCast} verdicts</p>
      </div>

      {/* Accuracy History Graph (Retention 7) */}
      <div className="mb-12 px-2">
        <div className="flex justify-between items-center mb-4">
          <span className="font-mono text-[8px] text-[#888888] tracking-[2px] uppercase">ACCURACY GROWTH (30D)</span>
          <TrendingUp className="w-3 h-3 text-neon-green opacity-40" />
        </div>
        <AccuracyGraph data={profile.accuracyHistory || []} />
      </div>

      {/* Oracle Progress Bar (Change 2) */}
      <div className="mb-12 px-2">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-[8px] text-[#888888] tracking-[2px] uppercase">ORACLE PROGRESS</span>
          <span className="font-mono text-[8px] text-white/40">{Math.min(profile.verdictsCast, 50)}/50</span>
        </div>
        <div className="h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min((profile.verdictsCast / 50) * 100, 100)}%` }}
            className="h-full bg-neon-green shadow-[0_0_10px_#00FF88]"
          />
        </div>
        <p className={`mt-2 font-mono text-[10px] uppercase tracking-wider ${profile.verdictsCast >= 50 ? 'text-neon-green' : 'text-[#444444]'}`}>
          {profile.verdictsCast >= 50 ? "ACCURACY SCORE ACTIVE ✓" : `${50 - profile.verdictsCast} more verdicts until accuracy score unlocks`}
        </p>
      </div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/5 group hover:border-neon-green/30 transition-all flex flex-col items-center justify-center text-center">
          <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mb-1">ACCURACY</p>
          <div className="flex items-center gap-2">
            <p className="font-display text-4xl text-white italic group-hover:text-neon-green transition-colors">{displayedScore}%</p>
            {profile.lastAccuracyScore !== undefined && profile.accuracyScore !== profile.lastAccuracyScore && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className={profile.accuracyScore > profile.lastAccuracyScore ? 'text-neon-green' : 'text-neon-red'}
              >
                {profile.accuracyScore > profile.lastAccuracyScore ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              </motion.div>
            )}
          </div>
        </div>
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/5 group hover:border-neon-green/30 transition-all">
          <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mb-1">STREAK</p>
          <p className="font-display text-3xl text-white italic group-hover:text-neon-green transition-colors">{profile.streak}D</p>
        </div>
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/5 group hover:border-neon-green/30 transition-all">
          <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mb-1">VERDICTS</p>
          <p className="font-display text-3xl text-white italic group-hover:text-neon-green transition-colors">{profile.verdictsCast}</p>
        </div>
        <div className="bg-[#141414] p-5 rounded-2xl border border-white/5 group hover:border-neon-green/30 transition-all">
          <p className="font-mono text-[9px] text-white/40 tracking-widest uppercase mb-1">ORACLE RANK</p>
          <p className="font-display text-3xl text-white italic group-hover:text-neon-green transition-colors">#{profile.oracleRank}</p>
        </div>
      </div>

      {/* Badges */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6 px-2">
          <h4 className="font-mono text-[10px] text-white/20 tracking-[4px] uppercase">AWARDS EARNED</h4>
          <span className="font-mono text-[8px] text-neon-green uppercase tracking-widest">RANK UP +</span>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 px-2">
          {badges.map((badge, idx) => (
             <div key={idx} className={`flex-shrink-0 w-24 flex flex-col items-center gap-3 ${badge.locked ? 'opacity-30' : ''}`}>
                <div className={`w-16 h-16 rounded-full bg-white/5 border flex items-center justify-center relative ${badge.locked ? 'border-white/10' : 'border-neon-green/30 shadow-[0_0_15px_rgba(0,255,136,0.1)]'}`}>
                   <badge.icon className={`w-8 h-8 ${badge.locked ? 'text-white/20' : 'text-neon-green'}`} />
                   {badge.locked && <Lock className="absolute w-4 h-4 text-white/40" />}
                </div>
                <span className="font-mono text-[8px] text-center leading-tight uppercase tracking-widest">{badge.name}</span>
             </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
         <h4 className="font-mono text-[10px] text-white/20 tracking-[4px] uppercase mb-6 px-2">LOG HISTORY</h4>
         <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-[#141414] rounded-xl border border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${i % 2 === 0 ? 'bg-neon-green shadow-[0_0_8px_rgba(0,255,136,0.5)]' : 'bg-neon-red shadow-[0_0_8px_rgba(255,68,68,0.5)]'}`} />
                  <div>
                    <span className="font-inter font-bold text-xs uppercase text-white/80 block">VERDICT MATCH #{4820 + i}</span>
                    <span className="font-mono text-[8px] text-white/20 uppercase tracking-widest">{i * 2} days ago</span>
                  </div>
                </div>
                <button className="bg-white/5 p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <ChevronRight className="w-3 h-3 text-white/40" />
                </button>
              </div>
            ))}
         </div>
      </div>

      {/* Settings Section */}
      <div className="mb-12 px-2">
         <h4 className="font-mono text-[10px] text-white/20 tracking-[4px] uppercase mb-4 px-2">SETTINGS</h4>
         <div className="space-y-1">
            <button 
              onClick={onViewContact}
              className="w-full flex justify-between items-center p-4 bg-[#141414] rounded-xl border border-white/5 hover:border-white/10 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <HelpCircle className="w-4 h-4 text-white/40 group-hover:text-neon-green transition-colors" />
                <span className="font-inter font-bold text-xs uppercase text-white/80">Support & Contact</span>
              </div>
              <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-white transition-colors" />
            </button>
         </div>
      </div>

      {/* Sign Out Button */}
      <div className="mt-8 mb-20 px-2">
        <button 
          onClick={() => setShowSignOut(true)}
          className="w-full py-5 border border-neon-red/30 bg-transparent text-neon-red font-bold text-[11px] tracking-[3px] rounded-xl hover:bg-neon-red hover:text-white transition-all duration-300 uppercase italic cursor-pointer"
        >
          TERMINATE SESSION
        </button>
      </div>

      <SocialFooter />

      {/* Footer Nav Simulation */}
      <nav className="fixed bottom-0 left-0 w-full h-16 bg-bg-dark/80 backdrop-blur-xl border-t border-white/10 px-8 flex items-center justify-around z-50">
        <button 
          onClick={onBack}
          className="h-10 w-10 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
        >
           <TrendingUp className="w-6 h-6" />
        </button>
        <button 
          onClick={onBack}
          className="h-10 w-10 flex items-center justify-center text-white/30 hover:text-white transition-colors cursor-pointer"
        >
           <HelpCircle className="w-6 h-6" />
        </button>
        <div className="h-10 w-10 flex items-center justify-center text-neon-green border-b-2 border-neon-green">
           <User className="w-6 h-6" />
        </div>
      </nav>
    </div>
  );
}

export default function App() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const [showLanding, setShowLanding] = useState(() => {
    // Immediate check for landing preference to avoid black screen
    const onboarded = localStorage.getItem('onboardingComplete') === 'true';
    // If not onboarded, we definitely want landing.
    // If onboarded, we might want feed, but we don't know auth yet.
    // To avoid black screen, start on landing if not sure.
    return !onboarded;
  });
  const [screen, setScreen] = useState<"landing" | "auth" | "feed" | "post" | "confirmation" | "hotlist" | "profile" | "onboarding" | "oracle" | "contact">(() => {
    const onboarded = localStorage.getItem('onboardingComplete') === 'true';
    return onboarded ? "feed" : "landing";
  });

  useEffect(() => {
    if (authChecked) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 400);
      return () => clearTimeout(timer);
    }
  }, [screen, authChecked]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Dopamine Trigger States
  const [suspenseVerdict, setSuspenseVerdict] = useState<'ESSENTIAL' | 'MAYBE' | 'WASTE' | null>(null);
  const [celebration, setCelebration] = useState<'TEN' | 'FIFTY' | 'HUNDRED' | 'ORACLE' | null>(null);
  const [accuracyChange, setAccuracyChange] = useState<'up' | 'down' | null>(null);
  const [socialComparison, setSocialComparison] = useState<{ type: 'majority' | 'minority', percent: number } | null>(null);

  // Retention States
  const [morningBrief, setMorningBrief] = useState<any | null>(null);
  const [weeklyWrapped, setWeeklyWrapped] = useState<any | null>(null);
  const [anniversary, setAnniversary] = useState<{ months: number, stats: any } | null>(null);
  const [comeback, setComeback] = useState<any | null>(null);
  const [isNightOwl, setIsNightOwl] = useState(false);

  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});
  const [globalSaved, setGlobalSaved] = useState(24783492);
  const [productLimit, setProductLimit] = useState(10);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const writeToFirebase = async (collectionName: string, docId: string, data: any, merge: boolean = true) => {
    if (!docId || docId === 'undefined') return;
    try {
      const docRef = doc(db, collectionName, docId);
      
      // Reduce writes: Check if exists for profile/initialization
      if (!merge) {
         const snap = await getDoc(docRef);
         if (snap.exists()) return; 
      }
      
      await setDoc(docRef, data, { merge });
    } catch (error: any) {
      if (error.code === 'resource-exhausted') {
        console.log('Quota exceeded. Using cached data.');
        setQuotaExceeded(true);
        return;
      }
      throw error;
    }
  };

  const onboardingRef = useRef(localStorage.getItem('onboardingComplete') === 'true');

  const [liveSessions, setLiveSessions] = useState(1247);

  useEffect(() => {
    let timeoutId: any;
    const incrementLive = () => {
      const randomDelay = Math.floor(Math.random() * 45000) + 45000; // 45 to 90 seconds
      timeoutId = setTimeout(() => {
        setLiveSessions(prev => prev + 1);
        incrementLive();
      }, randomDelay);
    };
    incrementLive();
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const checkTime = () => {
      const h = new Date().getHours();
      setIsNightOwl(h >= 22 || h < 2);
    };
    checkTime();
    const interval = setInterval(checkTime, 60000); // 1 minute is > 30s
    return () => clearInterval(interval);
  }, []);

  // Retention Engine
  useEffect(() => {
    if (!user || !profile || !products.length) return;
    // CRITICAL: Problem 1 - Only show morning brief to returning logged in users
    if (!onboardingRef.current) return;

    const runRetentionChecks = async () => {
      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];

      // 1. Morning Brief (Retention 1)
      if (now.getHours() >= 8 && profile.lastBriefDate !== todayStr) {
        const newCases = products.filter(p => {
          const createdAt = getTimestampMillis(p.createdAt);
          return (Date.now() - createdAt) < (24 * 60 * 60 * 1000);
        }).length;

        setMorningBrief({
          newCases,
          accuracy: profile.accuracyScore,
          streak: profile.streak,
          challenge: {
            username: "Rohan_Pro_99",
            product: "Nothing Ear (a)",
            avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Rohan"
          }
        });
        
        await writeToFirebase('users', user.uid, { lastBriefDate: todayStr }, true);
      }

      // 2. Weekly Wrapped (Retention 3)
      if (now.getDay() === 0 && now.getHours() >= 19) {
        const weekStr = `${now.getFullYear()}-W${Math.ceil(now.getDate() / 7)}`;
        if (profile.lastWeeklyWrappedDate !== weekStr) {
           setWeeklyWrapped({
             weekRange: "APR 20 - APR 27",
             totalVerdicts: 42,
             accuracy: 92,
             moneySaved: 12450,
             streak: 7,
             bestCall: "Dyson Airstrait"
           });
           await writeToFirebase('users', user.uid, { lastWeeklyWrappedDate: weekStr }, true);
        }
      }

      // 3. Comeback trigger (Retention 4)
      if (profile.lastLoginAt) {
        const lastLogin = getTimestampMillis(profile.lastLoginAt);
        const diffDays = Math.floor((Date.now() - lastLogin) / (1000 * 60 * 60 * 24));
        if (diffDays >= 3 && !localStorage.getItem(`comeback_seen_${todayStr}`)) {
           setComeback({
             days: diffDays,
             missedVerdicts: 127,
             rankDrop: 42,
             competitor: "Sarah_B"
           });
           localStorage.setItem(`comeback_seen_${todayStr}`, 'true');
        }
      }

      // 4. Anniversary (Retention 5)
      const joinDate = new Date(profile.joinDate);
      const diffMonths = (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth());
      if (diffMonths > 0 && diffMonths % 3 === 0 && !localStorage.getItem(`anniversary_${diffMonths}_seen`)) {
         setAnniversary({
           months: diffMonths,
           stats: {
             verdictsCast: profile.verdictsCast,
             accuracyScore: profile.accuracyScore,
             moneySaved: profile.moneySaved,
             bestCall: "iPhone 16 Pro"
           }
         });
         localStorage.setItem(`anniversary_${diffMonths}_seen`, 'true');
      }

      // 5. Verdict Outcomes (Retention 2)
      // Check for products voted on that are now closed
      const closedVoted = products.filter(p => {
        const createdAt = getTimestampMillis(p.createdAt);
        const isClosed = (Date.now() - createdAt) > (48 * 60 * 60 * 1000);
        return isClosed && userVotes[p.id] && !localStorage.getItem(`verdict_notified_${p.id}`);
      });

      closedVoted.forEach(p => {
        const { essential, maybe, waste } = p.votes;
        let communityVerdict = 'MAYBE';
        if (waste > essential && waste > maybe) communityVerdict = 'WASTE';
        if (essential > waste && essential > maybe) communityVerdict = 'ESSENTIAL';

        const myVote = userVotes[p.id];
        const isRight = myVote === communityVerdict;
        
        sendNotification(user.uid, {
          type: 'VERDICT_OUTCOME',
          title: 'VERDICT CLOSED',
          message: `${p.name} reached its final verdict: ${communityVerdict}`,
          productName: p.name,
          verdict: myVote,
          communityVerdict,
          isRight,
          accuracyChange: isRight ? '+2%' : '-1%',
          icon: isRight ? '✅' : '❌'
        });
        localStorage.setItem(`verdict_notified_${p.id}`, 'true');
      });

      // Update last login
      await writeToFirebase('users', user.uid, { lastLoginAt: serverTimestamp() }, true);
    };

    runRetentionChecks();
  }, [user, profile, products, userVotes]);

  const [activities, setActivities] = useState<Activity[]>([]);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [voteCount, setVoteCount] = useState(0);
  const [authMoment, setAuthMoment] = useState<"default" | "post" | "vote" | "profile">("default");
  const [showAuthOverlay, setShowAuthOverlay] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);
  const [tagFilter, setTagFilter] = useState<string | null>(null);

  // Redundant logic removed to avoid permission errors.
  // Images are now hardcoded in ProductImage component based on product name.

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const sendNotification = async (targetId: string, payload: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    if (!targetId || targetId === 'undefined') return;
    try {
      const notifId = `notif_${Date.now()}`;
      await writeToFirebase(`users/${targetId}/notifications`, notifId, {
        ...payload,
        timestamp: serverTimestamp(),
        read: false
      }, false); // Use docId check

      // Cleanup logic: keep only 50 (ONLY IF OWNER)
      if (user?.uid === targetId) {
        const q = query(collection(db, 'users', targetId, 'notifications'), orderBy('timestamp', 'desc'));
        const snap = await getDocs(q);
        if (snap.size > 50) {
          const toDelete = snap.docs.slice(50);
          const batch = writeBatch(db);
          toDelete.forEach(d => batch.delete(d.ref));
          await batch.commit();
        }
      }
    } catch (err) {
      console.error("Notification failed", err);
    }
  };

  const startUpload = async (data: { name: string; price: number; category: string; description: string; preview: string; blob: Blob }) => {
    if (!user) return;
    
    const tempId = `pending_${Date.now()}`;
    const newPending: PendingUpload = {
      id: tempId,
      name: data.name,
      price: data.price,
      category: data.category,
      description: data.description,
      imagePreview: data.preview,
      progress: 30
    };

    setPendingUploads(prev => [newPending, ...prev]);
    setScreen("feed");

    try {
      // 1. Convert to Base64 (User priority - Rule 5)
      let base64Image = "";
      if (data.blob) {
        base64Image = await blobToBase64(data.blob);
      }
      setPendingUploads(prev => prev.map(p => p.id === tempId ? { ...p, progress: 60 } : p));

      // Auto-search fallback if no image (Rule 5)
      let imageUrl = "";
      if (!base64Image) {
        imageUrl = getUnsplashImage(data.name) || await getProductImage(data.name) || "";
      }

      // 2. Save directly to Firestore
      const productId = `prod_${Date.now()}`;
      await writeToFirebase('products', productId, {
        name: data.name,
        price: data.price,
        imageBase64: base64Image,
        imageUrl: imageUrl,
        category: data.category,
        description: data.description,
        authorId: user.uid,
        createdAt: serverTimestamp(),
        votes: { essential: 0, maybe: 0, waste: 0 }
      }, false);
      
      setPendingUploads(prev => prev.map(p => p.id === tempId ? { ...p, progress: 100 } : p));
      setTimeout(() => {
        setPendingUploads(prev => prev.filter(p => p.id !== tempId));
        showToast("CASE FILED SUCCESSFULLY");
      }, 500);

      // Trigger TYPE 7: New product in category
      // Notify users who have voted in this category before
      // Simple simulation: just notify some "active" users or category fans
      // Actually we don't have a list of all users, so we skip complex user searching
    } catch (err) {
      console.error("Process failed:", err);
      setPendingUploads(prev => prev.filter(p => p.id !== tempId));
      showToast("UPLOAD FAILED");
    }
  };

  const completeOnboarding = async () => {
    localStorage.setItem('onboardingComplete', 'true');
    onboardingRef.current = true;
    setShowOnboarding(false);
    
    if (user) {
      setShowLanding(false);
      setScreen("feed");
    } else {
      setScreen("auth");
    }
  };

  // URL Deep Linking for Cases
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const caseId = params.get('case');
    if (caseId) {
       // If not logged in, they will be forced to auth first anyway
       // This ensured they are ready to vote
    }
  }, [user]);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);
      
      const onboarded = localStorage.getItem('onboardingComplete') === 'true';
      
      if (!u) {
        if (onboarded) {
          // Returning user NOT logged in: Show landing page only. No Court Report. No tutorial.
          setShowLanding(true);
          setScreen("landing");
        } else {
          // New user: Show landing page
          setShowLanding(true);
          setScreen("landing");
        }
      } else {
        // Logged in
        if (onboarded) {
          // Returning user AND logged in: Skip landing/tutorial. Show Feed.
          // Court report logic is in the Retention Engine and UI.
          setShowLanding(false);
          setShowAuthOverlay(false);
          setScreen("feed");
        } else {
          // Logged in but not onboarded (e.g. from previous session)
          // Rare, but handle gracefully
          setShowLanding(true);
          setScreen("landing");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEnterCourt = async () => {
    const onboarded = localStorage.getItem('onboardingComplete') === 'true';
    if (!onboarded) {
      // New user: Immediate black to tutorial.
      // Tutorial starts in 0.3s (handled in OnboardingScreen component)
      setScreen("onboarding"); 
      setShowOnboarding(true);
    } else {
      // onboarded user
      if (!user) {
        // onboarded user NOT logged in: Show auth
        setScreen("auth");
      } else {
        // onboarded user logged in: Go to feed
        setShowLanding(false);
        setScreen("feed");
      }
    }
  };

  const handleSignOut = async () => {
    try {
      setShowLanding(true); // Set instantly for immediate feedback
      await signOut(auth);
      setScreen("landing");
    } catch (err) {
      console.error("Sign out failed", err);
    }
  };

  // Products & Public Data Sync (Optimized Listener - One for all feed data)
  useEffect(() => {
    // 1. Load from cache first (Reduce Firebase Calls)
    const cachedProducts = localStorage.getItem('verdict_products_cache');
    const cacheTime = localStorage.getItem('verdict_products_cache_time');
    const cacheAge = cacheTime ? Date.now() - parseInt(cacheTime) : Infinity;

    if (cachedProducts) {
      try {
        const parsed = JSON.parse(cachedProducts);
        // Combine with hardcoded demo products
        const combined = [...parsed];
        DEMO_PRODUCTS.forEach(dp => {
          if (!combined.find(p => p.id === dp.id)) combined.push(dp);
        });
        setProducts(combined);
      } catch (e) {}
    } else {
      setProducts(DEMO_PRODUCTS);
    }
    
    // 2. Load Stats from cache
    const cachedStats = localStorage.getItem('verdict_stats_cache');
    if (cachedStats) {
      try {
        setGlobalSaved(JSON.parse(cachedStats).totalSaved);
      } catch (e) {}
    }

    // Quota Exceeded Signal
    const handleQuotaExceeded = () => {
      setQuotaExceeded(true);
      showToast("SYSTEM QUOTA EXCEEDED: LIVE UPDATES PAUSED.");
    };

    window.addEventListener('verdict-quota-exceeded', handleQuotaExceeded);

    // 3. Stats listener (low overhead)
    const unsubStats = onSnapshot(
      doc(db, 'stats', 'global'), 
      (snap) => {
        if (snap.exists()) {
          const stats = snap.data();
          setGlobalSaved(stats.totalSaved);
          localStorage.setItem('verdict_stats_cache', JSON.stringify(stats));
        }
      },
      (error) => handleFirestoreError(error, 'read', 'stats/global')
    );

    // 4. Activities listener (low overhead)
    const q = query(collection(db, 'activities'), orderBy('timestamp', 'desc'), limit(10));
    const unsubActivities = onSnapshot(
      q, 
      (snap) => {
        const aData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Activity));
        setActivities(aData);
      },
      (error) => handleFirestoreError(error, 'read', 'activities')
    );

    return () => {
      unsubStats();
      unsubActivities();
      window.removeEventListener('verdict-quota-exceeded', handleQuotaExceeded);
    };
  }, []);

  // Separate effect for products to handle pagination & cache threshold
  useEffect(() => {
    // Check if cache is fresh (< 1 hour)
    const cachedTime = localStorage.getItem('verdict_products_cache_time');
    const cacheAge = cachedTime ? Date.now() - parseInt(cachedTime) : Infinity;
    
    // RULE 3: If cache < 1 hour and we already have products, SKIP fetch
    if (cacheAge < 3600000 && products.length > DEMO_PRODUCTS.length) {
      console.log("Using fresh cache (Age: " + Math.round(cacheAge/60000) + "m). Skipping Firestore fetch.");
      return; 
    }

    // Cache expired or no products yet, fetch from Firebase
    const q = query(
      collection(db, 'products'), 
      orderBy('createdAt', 'desc'), 
      limit(productLimit)
    );
    
    const unsubProducts = onSnapshot(
      q, 
      (snap) => {
        const pData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        // Merge with demo products
        const combined = [...pData];
        DEMO_PRODUCTS.forEach(dp => {
          if (!combined.find(p => p.id === dp.id)) combined.push(dp);
        });
        
        setProducts(combined);
        localStorage.setItem('verdict_products_cache', JSON.stringify(pData));
        localStorage.setItem('verdict_products_cache_time', Date.now().toString());
        setQuotaExceeded(false);
      },
      (error: any) => {
        if (error.code === 'resource-exhausted') {
          console.log("Quota exceeded on products listener");
          setQuotaExceeded(true);
        }
        handleFirestoreError(error, 'read', 'products');
      }
    );

    return () => unsubProducts();
  }, [productLimit, quotaExceeded]);

  // User Profile Listener (Only active when logged in)
  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    return onSnapshot(
      doc(db, 'users', user.uid), 
      (snap) => {
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile);
        } else {
          writeToFirebase('users', user.uid, {
            username: user.displayName || `USER_${user.uid.slice(0, 5)}`,
            joinDate: new Date().toISOString(),
            accuracyScore: 92,
            streak: 1,
            verdictsCast: 0,
            oracleRank: 0,
            moneySaved: 0,
            onboardingComplete: false
          }, true);
        }
      },
      (error) => handleFirestoreError(error, 'read', `users/${user.uid}`)
    );
  }, [user]);

  // Combined Refresh Trigger
  const handleRefresh = async () => {
    try {
      showToast("REFRESHING FEED...");
      const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(50)));
      const pData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      
      // Merge with demo
      const combined = [...pData];
      DEMO_PRODUCTS.forEach(dp => {
        if (!combined.find(p => p.id === dp.id)) combined.push(dp);
      });
      
      setProducts(combined);
      localStorage.setItem('verdict_products_cache', JSON.stringify(pData));
      localStorage.setItem('verdict_products_cache_time', Date.now().toString());
      setQuotaExceeded(false);
    } catch (err: any) {
      if (err.code === 'resource-exhausted') {
        setQuotaExceeded(true);
        showToast("QUOTA EXCEEDED. USING CACHE.");
      } else {
        console.error("Refresh failed", err);
      }
    }
  };

  const handleVote = async (productId: string, verdict: 'ESSENTIAL' | 'MAYBE' | 'WASTE') => {
    if (!user) return;
    setSuspenseVerdict(verdict);

    try {
      // Step 1: Pre-generate roast if needed (to keep transaction lean and fast)
      let generatedRoast: string | undefined;
      const productRef = doc(db, 'products', productId);
      const productSnapTest = await getDoc(productRef);
      if (productSnapTest.exists()) {
        const pData = productSnapTest.data() as Product;
        const currentTotal = pData.votes.essential + pData.votes.maybe + pData.votes.waste;
        const newWaste = pData.votes.waste + (verdict === 'WASTE' ? 1 : 0);
        if (newWaste / (currentTotal + 1) > 0.7 && !pData.roast) {
          generatedRoast = await generateRoast(pData.name, pData.price);
        }
      }

      await runTransaction(db, async (transaction) => {
        const voteRef = doc(db, 'products', productId, 'votes', user.uid);
        
        const voteSnap = await transaction.get(voteRef);
        if (voteSnap.exists()) return; // Already voted

        const productSnap = await transaction.get(productRef);
        if (!productSnap.exists()) return;

        const productData = productSnap.data() as Product;
        const newVotes = { ...productData.votes, [verdict.toLowerCase()]: productData.votes[verdict.toLowerCase() as keyof typeof productData.votes] + 1 };
        
        transaction.set(voteRef, {
          userId: user.uid,
          productId: productId,
          verdict,
          timestamp: serverTimestamp()
        });

        // Log to global activities for live ticker
        const activityRef = doc(collection(db, 'activities'));
        transaction.set(activityRef, {
          city: TICKER_CITIES[Math.floor(Math.random() * TICKER_CITIES.length)],
          productName: productData.name,
          amount: productData.price,
          verdict,
          timestamp: serverTimestamp()
        });

        const updateData: any = { votes: newVotes };
        if (generatedRoast) {
          updateData.roast = generatedRoast;
        }

        transaction.update(productRef, updateData);
        
        // Update user stats
        const userRef = doc(db, 'users', user.uid);
        const userUpdates: any = { verdictsCast: increment(1) };
        if (verdict === 'WASTE') {
          userUpdates.moneySaved = increment(productData.price);
          // Also update global savings
          const statsRef = doc(db, 'stats', 'global');
          transaction.set(statsRef, { totalSaved: increment(productData.price) }, { merge: true });
        }
        transaction.set(userRef, userUpdates, { merge: true });

        // --- Notification Logic (Delayed) ---
        const notificationsToSend: { targetId: string, payload: any }[] = [];
        const total = newVotes.essential + newVotes.maybe + newVotes.waste;

        // TRIGGER 6: Social Comparison Logic
        let majorityVerdict = 'MAYBE';
        if (newVotes.waste > newVotes.essential && newVotes.waste > newVotes.maybe) majorityVerdict = 'WASTE';
        if (newVotes.essential > newVotes.waste && newVotes.essential > newVotes.maybe) majorityVerdict = 'ESSENTIAL';
        
        const myPercent = Math.round((newVotes[verdict.toLowerCase() as keyof typeof newVotes] / total) * 100);
        
        setTimeout(() => {
          setSocialComparison({
            type: verdict === majorityVerdict ? 'majority' : 'minority',
            percent: verdict === majorityVerdict ? myPercent : 100 - myPercent
          });
          setTimeout(() => setSocialComparison(null), 3000);
        }, 3000); // 1.2s suspense sequence + buffer

        // TRIGGER 8: Milestone Checks
        const currentVerdicts = (profile?.verdictsCast || 0) + 1;
        if (currentVerdicts === 10) setTimeout(() => setCelebration('TEN'), 3500);
        if (currentVerdicts === 50) setTimeout(() => setCelebration('FIFTY'), 3500);
        if (currentVerdicts === 100) setTimeout(() => setCelebration('HUNDRED'), 3500);

        if (productData.authorId && productData.authorId !== user.uid) {
           notificationsToSend.push({
             targetId: productData.authorId,
             payload: {
               type: 'VOTE_ON_CASE',
               message: `${profile?.username || 'Someone'} just cast a verdict on your case: ${productData.name}`,
               productId: productId,
               productName: productData.name,
               username: profile?.username || 'Someone',
               icon: '⚖️'
             }
           });
        }

        if (total === 10 && productData.authorId && productData.authorId !== user.uid) {
           const essentialPercent = Math.round((newVotes.essential / 10) * 100);
           notificationsToSend.push({
             targetId: productData.authorId,
             payload: {
               type: 'VERDICT_REACHED',
               message: `VERDICT REACHED on ${productData.name}. ${essentialPercent}% say Essential.`,
               productId: productId,
               productName: productData.name,
               icon: '🔨'
             }
           });
        }

        if (total === 10) {
           const { essential, maybe, waste } = newVotes;
           let finalVerdict = 'MAYBE';
           if (waste > essential && waste > maybe) finalVerdict = 'WASTE';
           if (essential > waste && essential > maybe) finalVerdict = 'ESSENTIAL';
           
           if (verdict === finalVerdict) {
              setAccuracyChange('up');
              setTimeout(() => setAccuracyChange(null), 3000);
              notificationsToSend.push({
                targetId: user.uid,
                payload: {
                  type: 'CORRECT_VERDICT',
                  message: `Your verdict on ${productData.name} was correct. Accuracy score: ↑`,
                  productId: productId,
                  productName: productData.name,
                  icon: '✅'
                }
              });
           }
        }

        // TYPE 6: Oracle status
        if (profile && profile.verdictsCast >= 49 && profile.accuracyScore >= 90 && (profile.oracleRank === 0)) {
           setTimeout(() => setCelebration('ORACLE'), 3500);
           notificationsToSend.push({
             targetId: user.uid,
             payload: {
               type: 'ORACLE_STATUS',
               message: "YOU ARE NOW AN ORACLE. Your verdicts carry double weight.",
               icon: '⚡'
             }
           });
           transaction.set(userRef, { oracleRank: 1 }, { merge: true });
        }

        // Accuracy History Update (Retention 7)
        const history = profile?.accuracyHistory || [];
        const todayStr = new Date().toISOString().split('T')[0];
        const lastEntry = history[history.length - 1];
        
        if (!lastEntry || lastEntry.date !== todayStr) {
          const newHistory = [...history, { date: todayStr, score: profile?.accuracyScore || 0 }].slice(-30);
          transaction.set(userRef, { accuracyHistory: newHistory }, { merge: true });
        }

        setTimeout(() => {
          notificationsToSend.forEach(n => sendNotification(n.targetId, n.payload));
        }, 500);
      });
      
      setUserVotes(prev => ({ ...prev, [productId]: verdict }));

      // Accuracy Score Tease (Change 7)
      if (profile) {
        const nextVerdicts = profile.verdictsCast + 1;
        if (nextVerdicts === 3) {
          showToast(`You are building your accuracy score. [3/50] verdicts cast.`);
        } else if (nextVerdicts > 0 && nextVerdicts < 50 && nextVerdicts % 10 === 0) {
          showToast(`[${nextVerdicts}/50] verdicts cast. Oracle status getting closer.`);
        }
      }

      if (user?.isAnonymous) {
        const nextCount = voteCount + 1;
        setVoteCount(nextCount);
        if (nextCount === 5) {
          showToast("SAVE YOUR VERDICT HISTORY — SIGN IN FREE");
        }
      }
    } catch (err: any) {
      if (err.code === 'resource-exhausted') {
        console.log('Quota exceeded. Vote skipping write.');
        setQuotaExceeded(true);
        showToast("QUOTA EXCEEDED. LIVE UPDATES PAUSED.");
      } else {
        console.error("Vote failed:", err);
        showToast("VOTE FAILED");
      }
    }
  };

  if (!authChecked) {
    return <SplashScreen onComplete={handleEnterCourt} totalSaved={globalSaved} />;
  }

  if (showLanding && screen === "landing") {
    return (
      <LandingPage 
        onEnter={handleEnterCourt} 
        totalSaved={globalSaved}
        recentProducts={products}
      />
    );
  }

  return (
    <>
    <CustomCursor />
    <ScreenTransition active={isTransitioning} />
    <AnimatePresence mode="wait">
      {screen === "auth" ? (
        <motion.div 
          key="auth"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ErrorBoundary>
            <AuthScreen onEnter={() => setScreen("feed")} />
          </ErrorBoundary>
        </motion.div>
      ) : screen === "feed" ? (
        <motion.div 
          key="feed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ErrorBoundary>
            <FeedScreen 
              products={tagFilter ? products.filter(p => p.tags?.includes(tagFilter)) : products}
              tagFilter={tagFilter}
              onTagSelect={setTagFilter}
              pendingUploads={pendingUploads}
              userVotes={userVotes}
              totalSaved={globalSaved}
              activities={activities}
              onVote={handleVote}
              onShare={showToast}
              onNotify={sendNotification}
              onRefresh={async () => {
                showToast("SYNCING COURT DATA...");
                const snap = await getDocs(query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(productLimit)));
                const pData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
                setProducts(pData);
                localStorage.setItem('verdict_products_cache', JSON.stringify(pData));
              }}
              onLoadMore={() => setProductLimit(prev => prev + 10)}
              hasMore={products.length >= productLimit}
              liveSessions={liveSessions}
              setProducts={setProducts}
              quotaExceeded={quotaExceeded}
              onPost={() => {
                if (user?.isAnonymous) {
                  setAuthMoment("post");
                  setShowAuthOverlay(true);
                } else {
                  setScreen("post");
                }
              }} 
              onViewHotList={() => setScreen("hotlist")} 
              onViewOracle={() => setScreen("oracle")}
              onViewProfile={() => {
                if (user?.isAnonymous) {
                  setAuthMoment("profile");
                  setShowAuthOverlay(true);
                } else {
                  setScreen("profile");
                }
              }} 
              onViewContact={() => setScreen("contact")}
              user={user}
              profile={profile}
              onStartTutorial={() => setShowOnboarding(true)}
              accuracyChange={accuracyChange}
              isNightOwl={isNightOwl}
            />
          </ErrorBoundary>
        </motion.div>
      ) : screen === "post" ? (
        <motion.div 
          key="post"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorBoundary>
            <PostScreen 
              userId={user?.uid || ""}
              onBack={() => setScreen("feed")} 
              onSubmit={startUpload} 
            />
          </ErrorBoundary>
        </motion.div>
      ) : screen === "confirmation" ? (
        <motion.div 
          key="confirmation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <ErrorBoundary>
            <ConfirmationScreen onBack={() => setScreen("feed")} />
          </ErrorBoundary>
        </motion.div>
      ) : screen === "hotlist" ? (
        <motion.div 
          key="hotlist"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorBoundary>
            <HotListScreen 
              products={products}
              onBack={() => setScreen("feed")} 
              onViewProfile={() => setScreen("profile")}
            />
          </ErrorBoundary>
        </motion.div>
      ) : screen === "profile" ? (
        <motion.div 
          key="profile"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorBoundary>
            <ProfileScreen 
              profile={profile || { username: "ANONYMOUS", joinDate: new Date().toISOString(), moneySaved: 0, accuracyScore: 0, streak: 0, verdictsCast: 0, oracleRank: 0 }}
              onBack={() => setScreen("feed")} 
              onSignOut={handleSignOut}
              onViewContact={() => setScreen("contact")}
              userId={user?.uid || ""}
            />
          </ErrorBoundary>
        </motion.div>
      ) : screen === "contact" ? (
        <ErrorBoundary>
          <ContactUsScreen 
            onBack={() => setScreen("feed")} 
            onShowToast={showToast} 
          />
        </ErrorBoundary>
      ) : screen === "oracle" ? (
        <motion.div 
          key="oracle"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <ErrorBoundary>
            <OracleBoardScreen onBack={() => setScreen("feed")} />
          </ErrorBoundary>
        </motion.div>
      ) : null}
    </AnimatePresence>
    <AnimatePresence>
      {showOnboarding && (
        <OnboardingScreen onComplete={completeOnboarding} />
      )}
    </AnimatePresence>
    <AnimatePresence>
      {toast && <Toast message={toast} />}
    </AnimatePresence>
    <AnimatePresence>
      {showAuthOverlay && (
        <AuthScreen 
          moment={authMoment} 
          onEnter={() => setShowAuthOverlay(false)} 
        />
      )}
    </AnimatePresence>
    <AnimatePresence>
      {showSetupGuide && (
        <FirebaseSetupGuide onClose={() => setShowSetupGuide(false)} />
      )}
    </AnimatePresence>
    <AnimatePresence>
      {suspenseVerdict && <SuspenseVerdictOverlay verdict={suspenseVerdict} onFinish={() => setSuspenseVerdict(null)} />}
    </AnimatePresence>
    <AnimatePresence>
      {celebration && <CelebrationOverlay type={celebration} onFinish={() => setCelebration(null)} />}
    </AnimatePresence>
    <AnimatePresence>
      {socialComparison && <SocialComparisonPopup {...socialComparison} />}
    </AnimatePresence>

      {/* Quota Exceeded Banner */}
      {quotaExceeded && (
        <div className="fixed bottom-16 left-0 w-full bg-black/80 backdrop-blur-md py-1.5 border-t border-white/5 z-[60] flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-neon-amber animate-pulse" />
          <span className="font-mono text-[9px] text-white/40 uppercase tracking-[2px]">Using cached data. Live updates paused temporarily.</span>
        </div>
      )}

      {/* Retention Overlays */}
    <AnimatePresence>
      {morningBrief && (
        <MorningBriefOverlay data={morningBrief} onClose={() => setMorningBrief(null)} />
      )}
      {weeklyWrapped && (
        <WeeklyWrappedOverlay data={weeklyWrapped} onClose={() => setWeeklyWrapped(null)} />
      )}
      {anniversary && (
        <AnniversaryOverlay months={anniversary.months} stats={anniversary.stats} onClose={() => setAnniversary(null)} />
      )}
      {comeback && (
        <ComebackOverlay days={comeback.days} stats={comeback} onClose={() => setComeback(null)} />
      )}
    </AnimatePresence>
    </>
  );
}
