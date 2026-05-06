
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = import.meta.env.VITE_GOOGLE_SEARCH_CX;

export const getProductImage = async (productName: string): Promise<string | null> => {
  // 1. Try Google Custom Search if keys are present
  if (GOOGLE_API_KEY && SEARCH_ENGINE_ID) {
    try {
      const query = productName + ' product image official';
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(query)}&searchType=image&num=1&imgType=photo&imgSize=medium`
      );
      
      const data = await response.json();
      if (data.items && data.items[0]) {
        return data.items[0].link;
      }
    } catch (error) {
      console.error("Google Image Search failed:", error);
    }
  }

  // 2. Fallback: Unsplash is handled elsewhere or via getUnsplashImage
  return null;
};

export const getUnsplashImage = (productName: string): string | null => {
  const keywordMap: Record<string, string> = {
    "Apple AirPods Pro 2": "airpods,earbuds",
    "AirPods Pro": "airpods,earbuds",
    "boAt Airdopes 141": "earbuds,wireless",
    "boAt Airdopes": "earbuds,wireless",
    "iPhone 16 Pro Max": "iphone,smartphone",
    "iPhone 16 Pro Max 256GB": "iphone,smartphone",
    "iPhone 16": "iphone,smartphone",
    "OnePlus 13": "android,smartphone",
    "Sony WH-1000XM5": "headphones,sony",
    "Kindle Paperwhite": "kindle,ereader",
    "Kindle": "kindle,ereader",
    "Gaming Chair RGB": "gaming,chair",
    "Gaming Chair": "gaming,chair",
    "Nike Air Max 270": "nike,sneakers",
    "Nike Air Max": "nike,sneakers",
    "Uniqlo Heattech Jacket": "jacket,clothing",
    "Uniqlo Jacket": "jacket,clothing",
    "Ray-Ban Wayfarer Classic": "sunglasses,rayban",
    "Ray-Ban": "sunglasses,rayban",
    "Zara Slim Fit Blazer": "blazer,fashion",
    "Zara Blazer": "blazer,fashion",
    "Optimum Nutrition Whey": "protein,supplement",
    "Whey Protein": "protein,supplement",
    "Organic Detox Tea": "tea,detox",
    "Detox Tea": "tea,detox",
    "Fitbit Charge 6": "fitbit,smartwatch",
    "Fitbit": "fitbit,smartwatch",
    "Manduka Yoga Mat": "yoga,mat",
    "Yoga Mat": "yoga,mat",
    "Philips Air Fryer": "airfryer,kitchen",
    "Air Fryer": "airfryer,kitchen",
    "Dyson V15 Detect": "vacuum,dyson",
    "Dyson Vacuum": "vacuum,dyson",
    "Instant Pot Duo": "instantpot,cooking",
    "Instant Pot": "instantpot,cooking",
    "Philips Hue Smart Bulbs": "smartbulb,light",
    "Smart Bulbs": "smartbulb,light",
    "Xiaomi Robot Vacuum": "robot,vacuum",
    "Robot Vacuum": "robot,vacuum",
    "PlayStation 5 Console": "playstation,gaming",
    "PlayStation 5": "playstation,gaming",
    "MacBook Air M3": "macbook,laptop",
    "MacBook Air": "macbook,laptop",
    "Ola S1 Pro": "scooter,electric",
    "Ola Scooter": "scooter,electric",
    "Netflix Subscription": "netflix,streaming",
    "Netflix": "netflix,streaming",
    "Spotify Premium": "spotify,music",
    "Spotify": "spotify,music",
    "UPSC Coaching": "study,books",
    "Personalized Astrology": "astrology,stars",
    "Astrology": "astrology,stars",
    "Yoga Mat Cork": "cork,yoga",
    "Noise Smartwatch": "smartwatch,fitness",
    "Cold Pressed Juice": "juice,healthy"
  };

  const keywords = keywordMap[productName];
  if (keywords) {
    return `https://source.unsplash.com/400x300/?${keywords}`;
  }
  return null;
};

export const getCategoryIcon = (category: string) => {
  const cat = category.toUpperCase();
  if (cat.includes('TECH')) return '💻';
  if (cat.includes('FASHION')) return '👕';
  if (cat.includes('HEALTH')) return '💪';
  if (cat.includes('HOME')) return '🏠';
  if (cat.includes('GAMING')) return '🎮';
  if (cat.includes('FOOD')) return '🍽️';
  if (cat.includes('TRANSPORT')) return '🚗';
  if (cat.includes('ENTERTAINMENT')) return '🎵';
  return '📦';
};
