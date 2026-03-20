/**
 * Market Data — Mock data for the Market Insights page.
 * Contains crop prices, mandi info, alerts, and seasonal data.
 */

export const cropMarketData = [
  {
    id: 1, name: "Rice", emoji: "🌾", category: "Grains",
    currentPrice: 2450, unit: "quintal", change: +120, changePercent: +5.1,
    trend: "up", msp: 2183, minPrice: 2200, maxPrice: 2650, demandLevel: 80,
    recommendation: "SELL_NOW",
    weeklyPrices: [2100, 2180, 2250, 2300, 2380, 2420, 2450],
    season: ["Kharif"], bestMonths: [10, 11, 12]
  },
  {
    id: 2, name: "Wheat", emoji: "🌿", category: "Grains",
    currentPrice: 2340, unit: "quintal", change: +45, changePercent: +1.9,
    trend: "up", msp: 2275, minPrice: 2180, maxPrice: 2500, demandLevel: 75,
    recommendation: "SELL_NOW",
    weeklyPrices: [2200, 2220, 2260, 2280, 2300, 2320, 2340],
    season: ["Rabi"], bestMonths: [3, 4, 5]
  },
  {
    id: 3, name: "Cotton", emoji: "☁️", category: "Fibers",
    currentPrice: 6580, unit: "quintal", change: -180, changePercent: -2.7,
    trend: "down", msp: 6620, minPrice: 6400, maxPrice: 7100, demandLevel: 60,
    recommendation: "WAIT",
    weeklyPrices: [6900, 6850, 6800, 6750, 6700, 6650, 6580],
    season: ["Kharif"], bestMonths: [11, 12, 1]
  },
  {
    id: 4, name: "Maize", emoji: "🌽", category: "Grains",
    currentPrice: 1950, unit: "quintal", change: +65, changePercent: +3.4,
    trend: "up", msp: 2090, minPrice: 1800, maxPrice: 2150, demandLevel: 70,
    recommendation: "WAIT",
    weeklyPrices: [1780, 1810, 1850, 1880, 1900, 1930, 1950],
    season: ["Kharif", "Rabi"], bestMonths: [9, 10, 11]
  },
  {
    id: 5, name: "Soybean", emoji: "🫘", category: "Oilseeds",
    currentPrice: 4720, unit: "quintal", change: +210, changePercent: +4.7,
    trend: "up", msp: 4600, minPrice: 4400, maxPrice: 5000, demandLevel: 85,
    recommendation: "SELL_NOW",
    weeklyPrices: [4350, 4420, 4480, 4550, 4600, 4660, 4720],
    season: ["Kharif"], bestMonths: [10, 11, 12]
  },
  {
    id: 6, name: "Groundnut", emoji: "🥜", category: "Oilseeds",
    currentPrice: 5680, unit: "quintal", change: +90, changePercent: +1.6,
    trend: "up", msp: 6377, minPrice: 5500, maxPrice: 6000, demandLevel: 65,
    recommendation: "WAIT",
    weeklyPrices: [5500, 5520, 5560, 5590, 5620, 5650, 5680],
    season: ["Kharif"], bestMonths: [11, 12, 1]
  },
  {
    id: 7, name: "Tomato", emoji: "🍅", category: "Vegetables",
    currentPrice: 3200, unit: "quintal", change: +480, changePercent: +17.6,
    trend: "up", msp: 0, minPrice: 2400, maxPrice: 4000, demandLevel: 92,
    recommendation: "SELL_NOW",
    weeklyPrices: [2400, 2550, 2700, 2850, 3000, 3100, 3200],
    season: ["Rabi", "Kharif"], bestMonths: [1, 2, 3, 11, 12]
  },
  {
    id: 8, name: "Onion", emoji: "🧅", category: "Vegetables",
    currentPrice: 1850, unit: "quintal", change: -220, changePercent: -10.6,
    trend: "down", msp: 0, minPrice: 1600, maxPrice: 2800, demandLevel: 55,
    recommendation: "WAIT",
    weeklyPrices: [2400, 2300, 2200, 2100, 2000, 1920, 1850],
    season: ["Rabi"], bestMonths: [4, 5, 6]
  },
  {
    id: 9, name: "Potato", emoji: "🥔", category: "Vegetables",
    currentPrice: 1350, unit: "quintal", change: +30, changePercent: +2.3,
    trend: "up", msp: 0, minPrice: 1100, maxPrice: 1600, demandLevel: 68,
    recommendation: "WAIT",
    weeklyPrices: [1250, 1270, 1290, 1310, 1320, 1340, 1350],
    season: ["Rabi"], bestMonths: [2, 3, 4]
  },
  {
    id: 10, name: "Turmeric", emoji: "🟡", category: "Spices",
    currentPrice: 8500, unit: "quintal", change: +350, changePercent: +4.3,
    trend: "up", msp: 0, minPrice: 7800, maxPrice: 9200, demandLevel: 78,
    recommendation: "SELL_NOW",
    weeklyPrices: [7900, 8000, 8100, 8200, 8300, 8400, 8500],
    season: ["Kharif"], bestMonths: [1, 2, 3]
  },
  {
    id: 11, name: "Chilli", emoji: "🌶️", category: "Spices",
    currentPrice: 12500, unit: "quintal", change: -400, changePercent: -3.1,
    trend: "down", msp: 0, minPrice: 11000, maxPrice: 14000, demandLevel: 62,
    recommendation: "WAIT",
    weeklyPrices: [13200, 13100, 12900, 12800, 12700, 12600, 12500],
    season: ["Kharif"], bestMonths: [2, 3, 4]
  },
  {
    id: 12, name: "Sugarcane", emoji: "🎋", category: "Cash Crops",
    currentPrice: 355, unit: "quintal", change: +10, changePercent: +2.9,
    trend: "up", msp: 315, minPrice: 310, maxPrice: 380, demandLevel: 88,
    recommendation: "SELL_NOW",
    weeklyPrices: [320, 325, 330, 338, 345, 350, 355],
    season: ["Kharif"], bestMonths: [11, 12, 1, 2]
  }
];

export const nearbyMandis = [
  {
    id: 1, name: "Warangal Agricultural Market", city: "Warangal",
    distance: 18, isOpen: true,
    topCrops: [
      { crop: "Rice", price: 2460, emoji: "🌾" },
      { crop: "Cotton", price: 6200, emoji: "☁️" },
      { crop: "Maize", price: 1890, emoji: "🌽" }
    ],
    hours: "6:00 AM – 2:00 PM", lat: 17.9784, lng: 79.5941
  },
  {
    id: 2, name: "Karimnagar APMC Market", city: "Karimnagar",
    distance: 32, isOpen: true,
    topCrops: [
      { crop: "Rice", price: 2440, emoji: "🌾" },
      { crop: "Turmeric", price: 8550, emoji: "🟡" },
      { crop: "Chilli", price: 12800, emoji: "🌶️" }
    ],
    hours: "6:00 AM – 3:00 PM", lat: 18.4386, lng: 79.1288
  },
  {
    id: 3, name: "Nizamabad Mandi", city: "Nizamabad",
    distance: 45, isOpen: false,
    topCrops: [
      { crop: "Soybean", price: 4700, emoji: "🫘" },
      { crop: "Turmeric", price: 8480, emoji: "🟡" },
      { crop: "Wheat", price: 2310, emoji: "🌿" }
    ],
    hours: "7:00 AM – 1:00 PM", lat: 18.6725, lng: 78.0940
  },
  {
    id: 4, name: "Khammam Market Yard", city: "Khammam",
    distance: 55, isOpen: true,
    topCrops: [
      { crop: "Cotton", price: 6350, emoji: "☁️" },
      { crop: "Rice", price: 2470, emoji: "🌾" },
      { crop: "Chilli", price: 12400, emoji: "🌶️" }
    ],
    hours: "6:30 AM – 2:30 PM", lat: 17.2473, lng: 80.1514
  },
  {
    id: 5, name: "Suryapet Rythu Bazar", city: "Suryapet",
    distance: 68, isOpen: true,
    topCrops: [
      { crop: "Tomato", price: 3150, emoji: "🍅" },
      { crop: "Onion", price: 1880, emoji: "🧅" },
      { crop: "Potato", price: 1340, emoji: "🥔" }
    ],
    hours: "5:30 AM – 12:00 PM", lat: 17.1400, lng: 79.6340
  }
];

export const marketAlerts = [
  {
    id: 1, type: "green", crop: "Rice", emoji: "🌾",
    message: "Rice prices up 5% — Good time to sell!",
    time: "2 hours ago", action: "Sell Now"
  },
  {
    id: 2, type: "red", crop: "Onion", emoji: "🧅",
    message: "Onion prices falling fast — Hold your stock",
    time: "4 hours ago", action: "Hold"
  },
  {
    id: 3, type: "yellow", crop: "Cotton", emoji: "☁️",
    message: "Cotton stable this week — Wait for better rates",
    time: "6 hours ago", action: "Wait"
  },
  {
    id: 4, type: "blue", crop: "Wheat", emoji: "🌿",
    message: "MSP procurement started in your area!",
    time: "1 day ago", action: "Check Now"
  },
  {
    id: 5, type: "green", crop: "Tomato", emoji: "🍅",
    message: "Tomato prices surging +17% — Sell immediately!",
    time: "30 min ago", action: "Sell Now"
  }
];

export const CATEGORIES = ["All", "Grains", "Vegetables", "Pulses", "Oilseeds", "Spices", "Fibers", "Cash Crops"];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Gujarat", "Haryana",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Odisha",
  "Punjab", "Rajasthan", "Tamil Nadu", "Telangana", "Uttar Pradesh",
  "West Bengal"
];

export const seasonalData = [
  { month: "Jan", crops: ["🌾", "🌿", "🥔"], label: "Rabi Harvest" },
  { month: "Feb", crops: ["🌿", "🟡", "🌶️"], label: "Peak Rabi" },
  { month: "Mar", crops: ["🌿", "🥜", "🟡"], label: "Rabi Harvest" },
  { month: "Apr", crops: ["🧅", "🌿", "🫘"], label: "Summer Start" },
  { month: "May", crops: ["🧅", "🍅", "🌽"], label: "Zaid Season" },
  { month: "Jun", crops: ["🌾", "🌽", "☁️"], label: "Kharif Sowing" },
  { month: "Jul", crops: ["🌾", "☁️", "🫘"], label: "Monsoon" },
  { month: "Aug", crops: ["🌾", "☁️", "🫘"], label: "Monsoon" },
  { month: "Sep", crops: ["🌾", "🌽", "🫘"], label: "Kharif Peak" },
  { month: "Oct", crops: ["🌾", "🫘", "☁️"], label: "Kharif Harvest" },
  { month: "Nov", crops: ["🌾", "🌿", "☁️"], label: "Rabi Sowing" },
  { month: "Dec", crops: ["🌾", "🌿", "🥔"], label: "Rabi Growth" },
];

// Generate extended price history for chart (30 days)
export function generatePriceHistory(crop, days = 30) {
  const basePrice = crop.currentPrice;
  const volatility = basePrice * 0.03;
  const history = [];
  let price = basePrice - (crop.change * 2);

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.45) * volatility;
    price = Math.max(price * 0.9, Math.min(price * 1.1, price + change));
    history.push({
      date: date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
      price: Math.round(price),
      fullDate: date
    });
  }
  // Ensure last point matches current price
  history[history.length - 1].price = basePrice;
  return history;
}
