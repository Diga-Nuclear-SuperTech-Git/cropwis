import { AgriNewsResponse, DiseaseAnalysisResult, WeatherData } from '../types';

export const POPULAR_INDIAN_REGIONS = [
  { name: 'Ludhiana, Punjab', state: 'Punjab', crops: 'Wheat, Rice, Cotton, Mustard' },
  { name: 'Nashik, Maharashtra', state: 'Maharashtra', crops: 'Onion, Grapes, Sugarcane, Soybean' },
  { name: 'Rajkot, Gujarat', state: 'Gujarat', crops: 'Groundnut, Cotton, Cumin, Sesame' },
  { name: 'Karnal, Haryana', state: 'Haryana', crops: 'Basmati Rice, Wheat, Sugarcane' },
  { name: 'Varanasi, Uttar Pradesh', state: 'Uttar Pradesh', crops: 'Wheat, Paddy, Vegetables, Pulses' },
  { name: 'Indore, Madhya Pradesh', state: 'Madhya Pradesh', crops: 'Soybean, Wheat, Gram, Garlic' },
  { name: 'Guntur, Andhra Pradesh', state: 'Andhra Pradesh', crops: 'Chilli, Cotton, Tobacco, Paddy' },
  { name: 'Coimbatore, Tamil Nadu', state: 'Tamil Nadu', crops: 'Banana, Coconut, Sugarcane, Millets' },
  { name: 'Belagavi, Karnataka', state: 'Karnataka', crops: 'Sugarcane, Maize, Vegetables, Soybean' },
  { name: 'Burdwan, West Bengal', state: 'West Bengal', crops: 'Paddy, Potato, Mustard, Jute' },
  { name: 'Jaipur, Rajasthan', state: 'Rajasthan', crops: 'Mustard, Bajra, Guar, Pulses' }
];

export const SOIL_TYPES = [
  { id: 'alluvial', name: 'Alluvial Soil (जलोढ़ मिट्टी)', desc: 'Rich in potash & humus, highly fertile for Wheat, Rice, Sugarcane, Pulses' },
  { id: 'black', name: 'Black Cotton / Regur Soil (काली मिट्टी)', desc: 'High clay content & moisture retention, ideal for Cotton, Soybean, Wheat, Groundnut' },
  { id: 'red_yellow', name: 'Red & Yellow Soil (लाल और पीली मिट्टी)', desc: 'Porous with iron content, great for Millets, Pulses, Groundnut, Tobacco with irrigation' },
  { id: 'clay_loam', name: 'Clayey Loam (दोमट मिट्टी)', desc: 'Balanced drainage & nutrient holding, versatile for all vegetables, cereals, and fruits' },
  { id: 'sandy_loam', name: 'Sandy Loam (बलुई दोमट)', desc: 'Quick draining, warm soil suitable for Root crops, Melons, Potato, Peanuts, Mustard' },
  { id: 'laterite', name: 'Laterite Soil (लेटराइट मिट्टी)', desc: 'Acidic, high in iron/aluminum, suitable for Cashew, Tea, Coffee, Rubber, Coconut' }
];

export const FARMING_SEASONS = [
  { id: 'Kharif', name: 'Kharif (Monsoon / June - Oct)', desc: 'Paddy, Maize, Cotton, Soybean, Groundnut, Pulses' },
  { id: 'Rabi', name: 'Rabi (Winter / Oct - April)', desc: 'Wheat, Mustard, Gram, Barley, Peas, Potato' },
  { id: 'Zaid', name: 'Zaid / Summer (March - June)', desc: 'Watermelon, Cucumber, Moong, Fodder crops, Vegetables' }
];

export const SAMPLE_DISEASE_PRESETS = [
  {
    id: 'wheat-rust',
    cropName: 'Wheat (गेहूँ)',
    diseaseName: 'Yellow Rust / Stripe Rust (Puccinia striiformis)',
    hindiName: 'पीला रतुआ / धारीदार रतुआ',
    symptoms: 'Yellow to orange pustules arranged in linear stripes on leaf blades, powdery yellow dust when touched.',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    mockResult: {
      cropName: 'Wheat',
      diseaseName: 'Stripe Rust / Yellow Rust (Puccinia striiformis)',
      hindiName: 'गेहूँ का पीला रतुआ',
      confidenceScore: 96,
      severityLevel: 'Severe' as const,
      symptomsIdentified: [
        'Linear yellow-orange powdery pustules along leaf veins',
        'Stunted grain development and chlorotic leaf stripes',
        'Yellow spores rubbing off on fingers or cloth'
      ],
      primaryCause: 'Fungal' as const,
      detailedExplanation: 'Yellow rust thrives in cool temperatures (10-15°C) with high relative humidity and dew. The fungal spores multiply rapidly on the leaf surface, depleting photosynthesis and shriveling grain fill.',
      immediateAction: [
        'Isolate infected field spots and refrain from excessive nitrogen fertilizer.',
        'Schedule targeted fungicide spray within 48 hours to halt secondary spore cycles.'
      ],
      organicTreatments: [
        {
          name: 'Sour Buttermilk (Khatti Chhachh) + Copper Spray',
          recipeOrMethod: 'Ferment 5 liters of buttermilk in a copper vessel for 5 days. Dilute in 100L water and spray over canopy.',
          applicationFrequency: 'Every 7-10 days in early onset'
        },
        {
          name: 'Neem Oil (10,000 PPM) + Bio-fungicide Trichoderma',
          recipeOrMethod: 'Mix 5ml Neem oil with 2.5g Trichoderma viride per liter of water.',
          applicationFrequency: 'Apply at first sign of temperature drop and morning fog'
        }
      ],
      chemicalTreatments: [
        {
          chemicalName: 'Propiconazole 25% EC (Tilt)',
          dosage: '1 ml per liter of water (200 ml in 200L water per acre)',
          safetyPrecautions: 'Wear gloves, avoid spraying during windy hours, 21-day pre-harvest interval.'
        },
        {
          chemicalName: 'Tebuconazole 25.9% EC (Folicur)',
          dosage: '1.25 ml per liter of water',
          safetyPrecautions: 'Use fine mist nozzle, do not mix with acidic fertilizers.'
        }
      ],
      preventativeMeasures: [
        'Sow rust-resistant wheat varieties (e.g. DBW 187, DBW 222, HD 3226).',
        'Avoid late sowing; ensure balanced NPK ratio (120:60:40 kg/ha).',
        'Maintain field drainage to prevent localized humidity stagnation.'
      ],
      yieldImpact: 'Can cause 30% to 70% yield loss if left unmanaged during the flag leaf stage.'
    }
  },
  {
    id: 'tomato-blight',
    cropName: 'Tomato (टमाटर)',
    diseaseName: 'Early Blight (Alternaria solani)',
    hindiName: 'टमाटर का अगेती झुलसा',
    symptoms: 'Dark concentric brown ring spots (target-board pattern) on lower leaves, yellow halo around lesions.',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80',
    mockResult: {
      cropName: 'Tomato',
      diseaseName: 'Early Blight (Alternaria solani)',
      hindiName: 'अगेती झुलसा रोग',
      confidenceScore: 94,
      severityLevel: 'Moderate' as const,
      symptomsIdentified: [
        'Concentric brown "target-like" rings on mature foliage',
        'Yellowing and premature leaf drop on lower canopy',
        'Sunken dark lesions on stem collars and fruit calyx'
      ],
      primaryCause: 'Fungal' as const,
      detailedExplanation: 'Alternaria solani survives in soil debris and infects plants when foliage remains wet for over 8-10 hours during warm days (24-29°C).',
      immediateAction: [
        'Prune lower infected leaves using sterilized shears and bury or burn them away from the field.',
        'Switch to drip irrigation to prevent splash dispersal of fungal spores onto healthy foliage.'
      ],
      organicTreatments: [
        {
          name: 'Pseudomonas fluorescens 1.0% WP',
          recipeOrMethod: 'Dissolve 5g/liter of water with 10g jaggery as sticking agent.',
          applicationFrequency: 'Foliar spray every 7 days'
        },
        {
          name: 'Bordeaux Mixture (1%)',
          recipeOrMethod: 'Dissolve 1kg Copper Sulphate + 1kg Quicklime in 100 liters of water in earthen/plastic tank.',
          applicationFrequency: 'Spray proactively after overcast/rainy days'
        }
      ],
      chemicalTreatments: [
        {
          chemicalName: 'Mancozeb 75% WP (Dithane M-45)',
          dosage: '2.5 grams per liter of water (500g in 200L water per acre)',
          safetyPrecautions: 'Apply with surfactant; keep 7-day waiting period before picking ripe tomatoes.'
        },
        {
          chemicalName: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC',
          dosage: '1 ml per liter of water',
          safetyPrecautions: 'Do not spray during full bloom to protect pollinating bees.'
        }
      ],
      preventativeMeasures: [
        'Practice 3-year crop rotation without solanaceous crops (potato, brinjal, chilli).',
        'Mulch soil bed with straw or silver-black plastic mulch to block soil-to-leaf splash.',
        'Stake plants upright to maximize airflow through the middle canopy.'
      ],
      yieldImpact: 'Moderate (15-35% potential loss) if treated before fruit formation; critical if stem lesions girdle base.'
    }
  },
  {
    id: 'cotton-leaf-curl',
    cropName: 'Cotton (कपास)',
    diseaseName: 'Cotton Leaf Curl Virus (CLCuV)',
    hindiName: 'कपास का पत्ता मरोड़ रोग (चुर्रा-मुर्रा)',
    symptoms: 'Upward or downward leaf curling, thickening of veins, enation (leaf-like outgrowths) on underside.',
    imageUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80',
    mockResult: {
      cropName: 'Cotton',
      diseaseName: 'Cotton Leaf Curl Virus (CLCuV / Begomovirus)',
      hindiName: 'कपास का लीफ कर्ल वायरस',
      confidenceScore: 92,
      severityLevel: 'Severe' as const,
      symptomsIdentified: [
        'Upward and downward cupping of younger leaves',
        'Main and secondary vein thickening with dark green appearance',
        'Formation of small cup-shaped enation underneath leaves',
        'Presence of Whitefly (Bemisia tabaci) vectors'
      ],
      primaryCause: 'Viral' as const,
      detailedExplanation: 'CLCuV is a begomovirus transmitted exclusively by the Silverleaf Whitefly vector. Once infected, plants cannot be cured systemically, so management focuses on controlling the vector.',
      immediateAction: [
        'Install yellow sticky traps (15-20 traps per acre) to monitor and catch adult whiteflies.',
        'Uproot and destroy heavily stunted, non-productive plants in the vegetative stage.'
      ],
      organicTreatments: [
        {
          name: 'Dashaparni Ark / Bio-Repellent Botanical Extract',
          recipeOrMethod: 'Fermented concoction of Neem, Pongamia, Custard apple leaves, Garlic, and Chilli. Spray at 5% dilution.',
          applicationFrequency: 'Twice a week in early morning'
        },
        {
          name: 'Verticillium lecanii (Bio-Pesticide)',
          recipeOrMethod: '5 grams per liter of water with 1ml liquid soap.',
          applicationFrequency: 'Spray in late evening when humidity is high'
        }
      ],
      chemicalTreatments: [
        {
          chemicalName: 'Diafenthiuron 50% WP (Pegasus)',
          dosage: '1.25 grams per liter of water (250g/acre)',
          safetyPrecautions: 'Target undersides of leaves where nymphs feed. Wear respirator.'
        },
        {
          chemicalName: 'Pyriproxyfen 10% + Bifenthrin 10% EC',
          dosage: '2 ml per liter of water',
          safetyPrecautions: 'Rotate modes of action to prevent insecticide resistance.'
        }
      ],
      preventativeMeasures: [
        'Eradicate weed hosts (such as Parthenium, Abutilon indicum) along field borders.',
        'Avoid growing collateral hosts like Okra (Bhindi) or Brinjal nearby.',
        'Apply seed treatment with Imidacloprid 70 WS @ 5-7 g/kg seed.'
      ],
      yieldImpact: 'High (40-60% yield reduction) if infection occurs before 60 days of sowing.'
    }
  }
];

export const FALLBACK_WEATHER_DATA: WeatherData = {
  location: 'Ludhiana, Punjab',
  lastUpdated: new Date().toLocaleTimeString(),
  current: {
    temp: '28°C',
    feelsLike: '29°C',
    condition: 'Partly Cloudy & Dry',
    humidity: '58%',
    windSpeed: '12 km/h (NW)',
    rainfallRisk: '10%',
    uvIndex: '6 (Moderate)',
    soilMoistureEstimate: 'Adequate (32%)',
    sunHours: '8.5 hrs'
  },
  farmAlerts: [
    {
      id: 'fa-1',
      level: 'warning',
      title: 'High Humidity & Dew Spike Warning',
      description: 'Morning dew forecast for next 48 hours could trigger fungal spore germination in wheat and mustard crops.',
      impactOnCrops: 'Foliage wetness > 6 hours increases Yellow Rust & White Rust vulnerability.',
      actionRequired: 'Inspect lower leaf canopies. Avoid excessive evening irrigation; spray prophylactic bio-fungicide if symptoms appear.'
    },
    {
      id: 'fa-2',
      level: 'advisory',
      title: 'Ideal Spraying & Top-Dressing Window',
      description: 'Wind speeds below 14 km/h with dry conditions forecast until Thursday evening.',
      impactOnCrops: 'Optimal absorption for urea top-dressing and micronutrient zinc spray.',
      actionRequired: 'Complete scheduled fertilizer broadcast by tomorrow noon.'
    }
  ],
  weeklyFarmingOutlook: [
    {
      day: 'Today',
      date: 'Aug 19',
      tempRange: '22°C - 32°C',
      condition: 'Partly Cloudy',
      rainfallRisk: '10%',
      sprayingAdvice: 'Excellent (Low wind, zero rain risk)',
      irrigationAdvice: 'Normal cycle'
    },
    {
      day: 'Tomorrow',
      date: 'Aug 20',
      tempRange: '23°C - 33°C',
      condition: 'Sunny & Warm',
      rainfallRisk: '5%',
      sprayingAdvice: 'Ideal for foliar sprays before 10 AM',
      irrigationAdvice: 'Maintain light moisture'
    },
    {
      day: 'Thu',
      date: 'Aug 21',
      tempRange: '24°C - 34°C',
      condition: 'Clear Sky',
      rainfallRisk: '10%',
      sprayingAdvice: 'Safe all day',
      irrigationAdvice: 'Check soil moisture before watering'
    },
    {
      day: 'Fri',
      date: 'Aug 22',
      tempRange: '23°C - 31°C',
      condition: 'Overcast with Breeze',
      rainfallRisk: '45%',
      sprayingAdvice: 'Avoid spraying (Rain probability)',
      irrigationAdvice: 'Pause irrigation; rain expected'
    },
    {
      day: 'Sat',
      date: 'Aug 23',
      tempRange: '21°C - 29°C',
      condition: 'Scattered Showers',
      rainfallRisk: '70%',
      sprayingAdvice: 'Do not spray pesticides',
      irrigationAdvice: 'Ensure field drainage channels are clear'
    },
    {
      day: 'Sun',
      date: 'Aug 24',
      tempRange: '22°C - 30°C',
      condition: 'Clearing up',
      rainfallRisk: '20%',
      sprayingAdvice: 'Wait for leaves to dry',
      irrigationAdvice: 'Post-rain assessment'
    }
  ],
  agriTips: [
    'Apply Zinc Sulphate (21%) @ 10 kg/acre if leaves show bronzing or yellow patches.',
    'Keep farm bunds weed-free to prevent insect pest migration.',
    'Test irrigation water electrical conductivity (EC) to ensure low salt accumulation.'
  ]
};

export const FALLBACK_NEWS_DATA: AgriNewsResponse = {
  lastUpdated: new Date().toLocaleDateString(),
  marketTrendsSummary: 'Kharif harvest arrivals picking up across North and Central APMC mandis. MSP procurement centres for pulses and oilseeds actively operating with DBT transfers.',
  newsList: [
    {
      id: 'news-1',
      title: 'PM-Kisan 17th Installment Disbursed to Over 9.2 Crore Beneficiary Farmers',
      summary: 'Direct benefit transfer of ₹2,000 sent directly to Aadhaar-seeded bank accounts across all Indian states with simplified e-KYC on PM-Kisan portal.',
      category: 'schemes',
      keyTakeawayForFarmers: 'Verify e-KYC status and land record seeding at nearest CSC centre if payment is pending.',
      region: 'National (All India)',
      date: 'Today',
      source: 'Ministry of Agriculture & Farmers Welfare',
      tags: ['PM-Kisan', 'DBT', 'Subsidy']
    },
    {
      id: 'news-2',
      title: 'Cabinet Approves Hike in Kharif Minimum Support Prices (MSP) for 2024-25 Season',
      summary: 'Substantial increase in MSP for Paddy (up by ₹117/qtl), Cotton (₹501/qtl), Soybean (₹292/qtl), and Moong (₹124/qtl) to ensure minimum 50% margin over cost of production.',
      category: 'mandi-prices',
      keyTakeawayForFarmers: 'Plan sales through registered e-NAM portals and state procurement centres to secure full MSP rates.',
      region: 'All India / Multi-State',
      date: 'Yesterday',
      source: 'Agmarknet / CACP Reports',
      tags: ['MSP', 'Paddy', 'Cotton', 'Soybean']
    },
    {
      id: 'news-3',
      title: 'IMD Releases Extended Range Agricultural Weather Outlook for Key Sowing Belts',
      summary: 'Favorable monsoon trajectory and soil moisture indices reported across Maharashtra, MP, Punjab, and Telangana, promoting pulse and oilseed development.',
      category: 'weather-impact',
      keyTakeawayForFarmers: 'Take advantage of upcoming sunny intervals for second round of inter-cultivation and top-dressing.',
      region: 'Central & Western India',
      date: '2 Days Ago',
      source: 'India Meteorological Department (IMD)',
      tags: ['Monsoon', 'IMD', 'Soil Moisture']
    },
    {
      id: 'news-4',
      title: 'Kisan Drones & Micro-Irrigation Subsidies Under Per Drop More Crop (PDMC) Scheme',
      summary: 'Up to 50% subsidy for small and marginal farmers on drip & sprinkler systems, with custom hiring centres making drone pesticide spray accessible at ₹350/acre.',
      category: 'tech-innovations',
      keyTakeawayForFarmers: 'Apply through state horticulture/agriculture departments for 40-55% subsidy on micro-irrigation installations.',
      region: 'Karnataka, Maharashtra, Gujarat, UP',
      date: '3 Days Ago',
      source: 'National Horticulture Mission',
      tags: ['Drip Irrigation', 'Drones', 'Subsidies']
    },
    {
      id: 'news-5',
      title: 'Kisan Credit Card (KCC) Limit Enhancement and Interest Subvention Guidelines Issued',
      summary: 'Prompt repayment farmers eligible for effective 4% interest rate on short term crop loans up to ₹3 Lakh, with simplified collateral-free limit up to ₹1.6 Lakh.',
      category: 'policy',
      keyTakeawayForFarmers: 'Renew existing KCC accounts before due date to avail the 3% prompt repayment interest subvention.',
      region: 'National Banking Network',
      date: '4 Days Ago',
      source: 'Reserve Bank of India & NABARD',
      tags: ['KCC', 'Crop Loan', 'NABARD']
    }
  ]
};
