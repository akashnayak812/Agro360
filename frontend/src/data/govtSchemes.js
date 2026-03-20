/**
 * Government Schemes Data — Complete data for the Govt Schemes page.
 * Contains central and state-level scheme information for Indian farmers.
 */

export const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Chhattisgarh", "Gujarat",
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Odisha", "Punjab", "Rajasthan",
  "Tamil Nadu", "Telangana", "Uttar Pradesh", "Uttarakhand", "West Bengal"
];

export const SCHEME_CATEGORIES = [
  { id: "all", label: "All Schemes", emoji: "📋", color: "#2C6E49" },
  { id: "financial_aid", label: "Cash Benefits", emoji: "💰", color: "#E8B84B" },
  { id: "insurance", label: "Insurance", emoji: "🛡️", color: "#3498DB" },
  { id: "credit", label: "Loans & Credit", emoji: "💳", color: "#9B59B6" },
  { id: "solar", label: "Solar & Energy", emoji: "☀️", color: "#F39C12" },
  { id: "organic", label: "Organic Farming", emoji: "🌱", color: "#27AE60" },
  { id: "market_access", label: "Market Access", emoji: "🏪", color: "#E74C3C" },
  { id: "irrigation", label: "Irrigation", emoji: "💧", color: "#1ABC9C" },
  { id: "soil_testing", label: "Soil Testing", emoji: "🧪", color: "#795548" },
  { id: "infrastructure", label: "Infrastructure", emoji: "🏗️", color: "#607D8B" },
  { id: "debt_relief", label: "Debt Relief", emoji: "🏦", color: "#E91E63" },
  { id: "electricity", label: "Free Power", emoji: "⚡", color: "#FF9800" },
];

export const centralSchemes = [
  {
    id: "pm-kisan", name: "PM-KISAN",
    fullName: "Pradhan Mantri Kisan Samman Nidhi",
    emoji: "💰", category: "financial_aid",
    benefit: "₹6,000/year direct to bank account",
    benefitAmount: 6000, frequency: "3 installments of ₹2,000",
    eligibility: [
      "Small & marginal farmers",
      "Land holding up to 2 hectares",
      "Valid Aadhaar card required",
      "Bank account linked to Aadhaar"
    ],
    ineligible: ["Income tax payers", "Government employees", "Institutional land holders"],
    documents: ["Aadhaar Card", "Land Records (Khasra/Khatauni)", "Bank Passbook", "Mobile Number"],
    howToApply: [
      "Visit pmkisan.gov.in",
      "Click 'New Farmer Registration'",
      "Enter Aadhaar number",
      "Fill land and bank details",
      "Submit and get registration number"
    ],
    applyLink: "https://pmkisan.gov.in",
    helpline: "155261",
    deadline: "Rolling — apply anytime",
    launchedYear: 2019,
    ministry: "Ministry of Agriculture & Farmers Welfare",
    totalBeneficiaries: "11+ Crore farmers",
    tags: ["money", "direct benefit", "all farmers"],
    status: "active", isCentral: true
  },
  {
    id: "pmfby", name: "PMFBY",
    fullName: "Pradhan Mantri Fasal Bima Yojana",
    emoji: "🛡️", category: "insurance",
    benefit: "Crop insurance against natural disasters",
    benefitAmount: null, frequency: "Per season",
    eligibility: [
      "All farmers growing notified crops",
      "Loanee and non-loanee farmers",
      "Sharecroppers and tenant farmers"
    ],
    ineligible: [],
    documents: ["Aadhaar", "Land Records", "Bank Account", "Sowing Certificate", "Crop Details"],
    howToApply: [
      "Visit pmfby.gov.in",
      "Register with Aadhaar",
      "Select crop and season",
      "Pay premium (1.5-5% of sum insured)",
      "Get policy number via SMS"
    ],
    premium: { kharif: "2% of sum insured", rabi: "1.5% of sum insured", commercial: "5% of sum insured" },
    applyLink: "https://pmfby.gov.in",
    helpline: "14447",
    deadline: "Kharif: July 31 | Rabi: December 31",
    launchedYear: 2016,
    ministry: "Ministry of Agriculture & Farmers Welfare",
    totalBeneficiaries: "5.5+ Crore farmers",
    tags: ["insurance", "crop loss", "natural disaster"],
    status: "active", isCentral: true
  },
  {
    id: "kcc", name: "KCC",
    fullName: "Kisan Credit Card",
    emoji: "💳", category: "credit",
    benefit: "Low interest crop loan up to ₹3 lakh at 4% interest",
    benefitAmount: 300000, frequency: "Annual renewal",
    eligibility: [
      "All farmers — individual or joint",
      "Tenant farmers and sharecroppers",
      "Self Help Groups of farmers",
      "Age 18-75 years"
    ],
    ineligible: [],
    documents: ["Aadhaar", "PAN Card", "Land Records", "Passport Photo", "Bank Account"],
    howToApply: [
      "Visit nearest bank branch (SBI/PNB/any nationalized bank)",
      "Ask for KCC application form",
      "Submit documents with filled form",
      "Bank verifies land records",
      "Card issued within 14 days"
    ],
    applyLink: "https://www.india.gov.in/spotlight/kisan-credit-card",
    helpline: "1800-180-1551",
    interestRate: "4% per annum (after govt subsidy)",
    deadline: "Rolling — apply anytime",
    launchedYear: 1998,
    ministry: "Ministry of Finance + NABARD",
    tags: ["loan", "credit", "low interest"],
    status: "active", isCentral: true
  },
  {
    id: "pkvy", name: "PKVY",
    fullName: "Paramparagat Krishi Vikas Yojana",
    emoji: "🌱", category: "organic",
    benefit: "₹50,000/hectare for organic farming over 3 years",
    benefitAmount: 50000, frequency: "Over 3 years",
    eligibility: [
      "Farmer clusters of minimum 50 acres",
      "Willing to adopt organic farming",
      "No chemical fertilizers for 3 years"
    ],
    ineligible: [],
    documents: ["Aadhaar", "Land Records", "Group Formation Certificate"],
    howToApply: [
      "Form a group of farmers (50+ acres combined)",
      "Contact local agriculture department",
      "Register cluster on pgsindia.net",
      "Get organic certification",
      "Receive financial assistance in phases"
    ],
    applyLink: "https://pgsindia-ncof.gov.in",
    helpline: "1800-180-1551",
    deadline: "Through local agriculture office",
    launchedYear: 2015,
    ministry: "Ministry of Agriculture & Farmers Welfare",
    tags: ["organic", "certification", "premium price"],
    status: "active", isCentral: true
  },
  {
    id: "pm-kusum", name: "PM-KUSUM",
    fullName: "Pradhan Mantri Kisan Urja Suraksha evam Utthan Mahabhiyan",
    emoji: "☀️", category: "solar",
    benefit: "Solar pump subsidy up to 90% — free irrigation",
    benefitAmount: null, frequency: "One-time",
    eligibility: [
      "Individual farmers",
      "Farmers cooperative societies",
      "Water user associations",
      "Having barren or cultivable land"
    ],
    ineligible: [],
    documents: ["Aadhaar", "Land Records", "Bank Account", "Electricity Bill"],
    howToApply: [
      "Visit state nodal agency website",
      "Apply online for solar pump",
      "Pay 10% farmer contribution",
      "Govt pays remaining 60-90%",
      "Installation within 120 days"
    ],
    applyLink: "https://mnre.gov.in/solar/schemes",
    helpline: "1800-180-3333",
    deadline: "State-wise — check state portal",
    launchedYear: 2019,
    ministry: "Ministry of New & Renewable Energy",
    tags: ["solar", "irrigation", "electricity", "free pump"],
    status: "active", isCentral: true
  },
  {
    id: "e-nam", name: "e-NAM",
    fullName: "Electronic National Agriculture Market",
    emoji: "🏪", category: "market_access",
    benefit: "Sell crops online to buyers across India — better price",
    benefitAmount: null, frequency: "Per transaction",
    eligibility: [
      "All farmers with Aadhaar",
      "Crops registered under e-NAM",
      "Farmer registered at local APMC"
    ],
    ineligible: [],
    documents: ["Aadhaar", "Bank Account", "APMC Registration"],
    howToApply: [
      "Register at enam.gov.in",
      "Get registration at local APMC mandi",
      "List your produce with quantity",
      "Buyers bid online",
      "Accept best bid, get paid directly"
    ],
    applyLink: "https://enam.gov.in",
    helpline: "1800-270-0224",
    deadline: "Rolling",
    launchedYear: 2016,
    ministry: "Ministry of Agriculture & Farmers Welfare",
    tags: ["market", "online selling", "better price", "direct buyers"],
    status: "active", isCentral: true
  },
  {
    id: "rkvy", name: "RKVY",
    fullName: "Rashtriya Krishi Vikas Yojana",
    emoji: "📈", category: "infrastructure",
    benefit: "Grants for farm infrastructure, equipment & technology",
    benefitAmount: null, frequency: "Project-based",
    eligibility: [
      "Individual farmers",
      "Farmer Producer Organizations (FPO)",
      "Agriculture startups (RAFTAAR component)"
    ],
    ineligible: [],
    documents: ["Project proposal", "Land records", "Aadhaar", "Bank account"],
    howToApply: [
      "Contact State Agriculture Department",
      "Submit project proposal",
      "Get approved by District Level Committee",
      "Receive grant in tranches"
    ],
    applyLink: "https://rkvy.nic.in",
    helpline: "011-23382651",
    deadline: "Annual — check state calendar",
    launchedYear: 2007,
    ministry: "Ministry of Agriculture & Farmers Welfare",
    tags: ["infrastructure", "equipment", "startup", "FPO"],
    status: "active", isCentral: true
  },
  {
    id: "soil-health-card", name: "Soil Health Card",
    fullName: "Soil Health Card Scheme",
    emoji: "🧪", category: "soil_testing",
    benefit: "FREE soil testing + personalized fertilizer advice card",
    benefitAmount: 0, frequency: "Every 2 years",
    eligibility: ["All farmers — 100% free", "No restrictions"],
    ineligible: [],
    documents: ["Aadhaar", "Land location details"],
    howToApply: [
      "Visit nearest Krishi Vigyan Kendra (KVK)",
      "Submit soil sample (200gm from field)",
      "Receive card within 30 days",
      "Card shows NPK levels + recommendations",
      "Save 20-30% on fertilizer costs"
    ],
    applyLink: "https://soilhealth.dac.gov.in",
    helpline: "1800-180-1551",
    deadline: "Rolling — anytime",
    launchedYear: 2015,
    ministry: "Ministry of Agriculture & Farmers Welfare",
    tags: ["free", "soil", "fertilizer", "testing"],
    status: "active", isCentral: true
  }
];

export const stateSchemes = {
  "Telangana": [
    {
      id: "rythu-bandhu", name: "Rythu Bandhu",
      fullName: "Rythu Bandhu Investment Support Scheme",
      emoji: "💵", category: "financial_aid",
      benefit: "₹10,000/acre/year — ₹5,000 each season",
      benefitAmount: 10000, frequency: "Twice yearly (Kharif + Rabi)",
      eligibility: [
        "All farmers owning agricultural land in Telangana",
        "Land must be registered in farmer's name",
        "Both pattadar and assigned land holders"
      ],
      ineligible: [],
      documents: ["Pattadar Passbook", "Aadhaar", "Bank Account linked"],
      howToApply: [
        "Automatic — if land registered, you get it",
        "Update Pattadar Passbook at MeeSeva",
        "Link Aadhaar to bank at nearest bank",
        "Contact local VRO if not received"
      ],
      applyLink: "https://rythubandhu.telangana.gov.in",
      helpline: "1100",
      deadline: "Automatic disbursement",
      launchedYear: 2018, state: "Telangana",
      tags: ["money", "per acre", "automatic", "all farmers"],
      status: "active", isCentral: false
    },
    {
      id: "rythu-bima", name: "Rythu Bima",
      fullName: "Rythu Bima Life Insurance Scheme",
      emoji: "🛡️", category: "insurance",
      benefit: "₹5 lakh life insurance — 100% FREE premium paid by govt",
      benefitAmount: 500000, frequency: "Annual auto-renewal",
      eligibility: [
        "Farmers aged 18-59 years in Telangana",
        "Registered in Rythu Bandhu records",
        "Cultivating agricultural land"
      ],
      ineligible: [],
      documents: ["Pattadar Passbook", "Aadhaar", "Bank Account"],
      howToApply: [
        "Automatic enrollment for Rythu Bandhu beneficiaries",
        "No premium to pay — govt pays ₹2,500/year",
        "Nominee gets ₹5 lakh on farmer's death",
        "Contact LIC office for claims"
      ],
      applyLink: "https://agriculture.telangana.gov.in",
      helpline: "1100",
      deadline: "Automatic",
      launchedYear: 2018, state: "Telangana",
      tags: ["free", "life insurance", "family protection"],
      status: "active", isCentral: false
    },
    {
      id: "ts-mission-kakatiya", name: "Mission Kakatiya",
      fullName: "Mission Kakatiya — Tank Restoration",
      emoji: "💧", category: "irrigation",
      benefit: "Restored irrigation tanks — free water access for farming",
      benefitAmount: null, frequency: "Infrastructure",
      eligibility: ["All farmers near restored tanks in Telangana"],
      ineligible: [],
      documents: ["None required for benefiting"],
      howToApply: [
        "Automatic benefit — tanks restored near your village",
        "Contact Panchayat for water distribution schedule",
        "Join Water User Association for management"
      ],
      applyLink: "https://irrigation.telangana.gov.in",
      helpline: "040-23450022",
      deadline: "Ongoing restoration",
      launchedYear: 2015, state: "Telangana",
      tags: ["water", "irrigation", "tank", "free"],
      status: "active", isCentral: false
    },
    {
      id: "ts-free-power", name: "Free Power Scheme",
      fullName: "Telangana Free Power to Agriculture",
      emoji: "⚡", category: "electricity",
      benefit: "FREE 9-hour electricity daily for agricultural pumps",
      benefitAmount: null, frequency: "Daily",
      eligibility: [
        "All farmers with agricultural pump connections in Telangana",
        "Up to 5HP motor pump"
      ],
      ineligible: [],
      documents: ["Service connection number", "Aadhaar"],
      howToApply: [
        "Visit nearest TSSPDCL/TSNPDCL office",
        "Apply for agriculture connection",
        "Get dedicated feeder connection",
        "Receive 9 hours free power daily"
      ],
      applyLink: "https://tssouthernpower.com",
      helpline: "1912",
      deadline: "Rolling",
      launchedYear: 2014, state: "Telangana",
      tags: ["free electricity", "pump", "irrigation", "9 hours"],
      status: "active", isCentral: false
    }
  ],
  "Maharashtra": [
    {
      id: "maha-dbtatree", name: "DBT Agriculture",
      fullName: "Maharashtra DBT Agriculture Scheme",
      emoji: "💰", category: "financial_aid",
      benefit: "Direct subsidy for seeds, fertilizers and equipment",
      benefitAmount: null, frequency: "Per season",
      eligibility: ["Maharashtra farmers with 7/12 land extract"],
      ineligible: [],
      documents: ["7/12 extract", "Aadhaar", "Bank Account"],
      howToApply: [
        "Register on mahadbt.maharashtra.gov.in",
        "Select scheme and fill details",
        "Upload documents",
        "Verify via Aadhaar OTP",
        "Track status online"
      ],
      applyLink: "https://mahadbt.maharashtra.gov.in",
      helpline: "1800-120-8040",
      deadline: "Season-wise",
      launchedYear: 2017, state: "Maharashtra",
      tags: ["subsidy", "seeds", "equipment", "DBT"],
      status: "active", isCentral: false
    }
  ],
  "Punjab": [
    {
      id: "punjab-kisaan-karj-mafi", name: "Karj Mafi",
      fullName: "Punjab Farmers Debt Waiver Scheme",
      emoji: "🏦", category: "debt_relief",
      benefit: "Farm loan waiver up to ₹2 lakh for small farmers",
      benefitAmount: 200000, frequency: "One-time",
      eligibility: [
        "Small & marginal farmers of Punjab",
        "Land up to 5 acres",
        "Outstanding loan as of cut-off date"
      ],
      ineligible: [],
      documents: ["Land records", "Loan documents", "Aadhaar", "Bank passbook"],
      howToApply: [
        "Visit punjab.gov.in/farmer-debt-waiver",
        "Enter Aadhaar and loan account number",
        "Verify eligibility automatically",
        "Approval via SMS"
      ],
      applyLink: "https://punjab.gov.in",
      helpline: "1100",
      deadline: "Check latest notification",
      launchedYear: 2017, state: "Punjab",
      tags: ["loan waiver", "debt relief", "small farmers"],
      status: "active", isCentral: false
    }
  ],
  "Andhra Pradesh": [
    {
      id: "ap-annadata-sukhibhava", name: "Annadata Sukhibhava",
      fullName: "YSR Rythu Bharosa + PM-KISAN Combined",
      emoji: "💵", category: "financial_aid",
      benefit: "₹13,500/year per farmer family — highest in India",
      benefitAmount: 13500, frequency: "3 installments yearly",
      eligibility: [
        "All farmers in Andhra Pradesh",
        "Tenant farmers also eligible",
        "Both landowners and cultivators"
      ],
      ineligible: [],
      documents: ["Aadhaar", "Land/tenant records", "Bank account"],
      howToApply: [
        "Visit gramawardsachivalayam.ap.gov.in",
        "Meet Village Agriculture Assistant",
        "Enroll at village secretariat",
        "Amount credited to bank automatically"
      ],
      applyLink: "https://gramawardsachivalayam.ap.gov.in",
      helpline: "1902",
      deadline: "Rolling enrollment",
      launchedYear: 2019, state: "Andhra Pradesh",
      tags: ["money", "highest benefit", "all farmers", "tenant farmers"],
      status: "active", isCentral: false
    }
  ],
  "Karnataka": [
    {
      id: "karnataka-raitha-siri", name: "Raitha Siri",
      fullName: "Karnataka Raitha Siri Scheme",
      emoji: "🌾", category: "financial_aid",
      benefit: "₹2,000 per acre input subsidy for dry land farmers",
      benefitAmount: 2000, frequency: "Annually",
      eligibility: [
        "Dryland farmers of Karnataka",
        "Land up to 2 hectares"
      ],
      ineligible: [],
      documents: ["RTC (Records of Rights)", "Aadhaar", "Bank account"],
      howToApply: [
        "Register on karfarmer.karnataka.gov.in",
        "Verify land details with village accountant",
        "Link Aadhaar to account",
        "Amount auto-credited"
      ],
      applyLink: "https://karfarmer.karnataka.gov.in",
      helpline: "1800-425-6655",
      deadline: "June-July (Kharif season)",
      launchedYear: 2020, state: "Karnataka",
      tags: ["dryland", "subsidy", "input support"],
      status: "active", isCentral: false
    }
  ]
};

/* ─── Helper Functions ─── */

/** Get all schemes (central + all states) as a flat array */
export function getAllSchemes() {
  const all = [...centralSchemes];
  Object.values(stateSchemes).forEach(arr => all.push(...arr));
  return all;
}

/** Get schemes for a specific state (central + that state's schemes) */
export function getSchemesByState(state) {
  return {
    central: centralSchemes,
    state: stateSchemes[state] || [],
  };
}

/** Basic client-side eligibility matching */
export function matchEligibility({ landAcres, farmerType, incomeRange, state }) {
  const matched = [];

  const allSchemes = [...centralSchemes, ...(stateSchemes[state] || [])];

  for (const scheme of allSchemes) {
    let score = 0;
    let reasons = [];

    // PM-KISAN: up to 2 hectares (~5 acres)
    if (scheme.id === 'pm-kisan') {
      if (landAcres <= 5) { score += 3; reasons.push('Land ≤ 5 acres'); }
      if (incomeRange !== 'above_5l') { score += 2; reasons.push('Income eligible'); }
    }
    // PMFBY: all farmers
    else if (scheme.id === 'pmfby') {
      score += 3; reasons.push('All farmers eligible');
    }
    // KCC: all farmers
    else if (scheme.id === 'kcc') {
      score += 3; reasons.push('All farmers eligible');
      if (farmerType === 'tenant') { score += 1; reasons.push('Tenant farmers welcome'); }
    }
    // PKVY: clusters of 50+ acres
    else if (scheme.id === 'pkvy') {
      if (landAcres >= 5) { score += 2; reasons.push('Sufficient land for cluster'); }
    }
    // PM-KUSUM: all farmers
    else if (scheme.id === 'pm-kusum') {
      score += 2; reasons.push('Farmer with land');
    }
    // e-NAM: all farmers
    else if (scheme.id === 'e-nam') {
      score += 2; reasons.push('All farmers eligible');
    }
    // RKVY: individual / FPO
    else if (scheme.id === 'rkvy') {
      score += 1; reasons.push('Project-based');
    }
    // Soil Health Card: everyone
    else if (scheme.id === 'soil-health-card') {
      score += 3; reasons.push('100% free for all');
    }
    // State schemes — match if correct state
    else if (!scheme.isCentral) {
      if (scheme.state === state) {
        score += 3; reasons.push(`${state} resident`);
        if (farmerType === 'landowner' && scheme.category === 'financial_aid') {
          score += 1; reasons.push('Landowner benefit');
        }
        if (farmerType === 'tenant' && scheme.tags?.includes('tenant farmers')) {
          score += 1; reasons.push('Tenant farmer eligible');
        }
      }
    }

    if (score >= 2) {
      matched.push({ scheme, score, reasons });
    }
  }

  return matched.sort((a, b) => b.score - a.score);
}
