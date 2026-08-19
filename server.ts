import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import {
  SAMPLE_DISEASE_PRESETS,
  FALLBACK_WEATHER_DATA,
  FALLBACK_NEWS_DATA,
} from './src/data/samplePresets';

dotenv.config();

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '' || !apiKey.startsWith('AIzaSy')) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Call Groq for Chat & Conversational responses
async function callGroqChat(prompt: string, systemPrompt?: string): Promise<string | null> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey || groqKey.trim() === '') return null;

  const groqModels = [
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.6-27b',
    'mixtral-8x7b-32768',
  ];

  for (const model of groqModels) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            ...(systemPrompt ? [{ role: 'system', content: systemPrompt }] : []),
            { role: 'user', content: prompt },
          ],
          temperature: 0.6,
          max_tokens: 1500,
        }),
      });

      if (res.ok) {
        const data: any = await res.json();
        const content = data?.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (err: any) {
      console.warn(`Groq request failed for ${model}: ${err?.message || 'unknown error'}`);
    }
  }
  return null;
}

// 2. Call Groq specifically for structured JSON responses (Crop Advisory, etc.)
async function callGroqJSON(prompt: string, systemPrompt?: string): Promise<any | null> {
  const groqKey = process.env.GROQ_API_KEY;
  if (!groqKey || groqKey.trim() === '') return null;

  const groqModels = [
    'openai/gpt-oss-120b',
    'llama-3.1-8b-instant',
    'llama3-8b-8192',
    'llama3-70b-8192',
  ];

  for (const model of groqModels) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${groqKey.trim()}`,
        },
        body: JSON.stringify({
          model,
          response_format: { type: 'json_object' },
          messages: [
            {
              role: 'system',
              content:
                systemPrompt ||
                'You are an expert ICAR agricultural scientist and precision agronomy engine. Respond ONLY in valid JSON matching the exact schema requested without any markdown explanation.',
            },
            { role: 'user', content: prompt },
          ],
          temperature: 0.4,
          max_tokens: 6000,
        }),
      });

      if (res.ok) {
        const data: any = await res.json();
        const rawContent = data?.choices?.[0]?.message?.content;
        if (rawContent) {
          return JSON.parse(rawContent);
        }
      }
    } catch (err: any) {
      console.warn(`Groq JSON request failed for ${model}: ${err?.message || 'unknown error'}`);
    }
  }
  return null;
}

// Helper to run generateContent with automatic model fallback for 429 Quota / Rate-limit resilience
async function generateContentWithFallback(ai: GoogleGenAI, options: {
  contents: any;
  config?: any;
  preferredModel?: string;
}) {
  const modelsToTry = [
    options.preferredModel || 'gemini-3.7-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite',
  ];

  let lastError: any = null;
  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      const isRetryable =
        err?.status === 429 ||
        err?.status === 404 ||
        err?.message?.includes('429') ||
        err?.message?.includes('quota') ||
        err?.message?.includes('RESOURCE_EXHAUSTED') ||
        err?.message?.includes('NOT_FOUND') ||
        err?.message?.includes('no longer available');
      if (!isRetryable) {
        break;
      }
    }
  }
  throw lastError;
}

// Fallback agricultural recommendation generator when Gemini API is rate limited / restricted
function generateAdvisoryFallback(soilType: string, region: string, season: string, previousCrop: string) {
  const isRabi = season.toLowerCase().includes('rabi') || season.toLowerCase().includes('winter');

  const topRecommendations = isRabi
    ? [
        {
          rank: 1,
          cropName: 'Wheat (High-Yield Sharbati)',
          hindiName: 'उन्नत गेहूँ (DBW 187 / HD 3226)',
          suitabilityScore: 96,
          reasonForRecommendation: `Excellent choice for ${soilType} soil in ${region}. Breaks disease cycles after ${previousCrop} and provides reliable cold-season vegetative growth.`,
          expectedYield: '20-24 quintals/acre',
          estimatedRevenueOrRoi: '₹58,000 - ₹75,000 net profit per acre (ROI ~175%)',
          growthDurationDays: '115-125 days',
          waterRequirement: 'Medium',
          riskLevel: 'Low',
          idealSowingTime: '15th Oct - 15th Nov',
          keyVarieties: ['DBW 187 (Karan Vandana)', 'HD 3226', 'PBW 725'],
        },
        {
          rank: 2,
          cropName: 'Mustard / Rapeseed',
          hindiName: 'पीली सरसों / राया (RH 725 / Giriraj)',
          suitabilityScore: 92,
          reasonForRecommendation: 'Low water requirement with high oil content and premium mandi market prices.',
          expectedYield: '9-12 quintals/acre',
          estimatedRevenueOrRoi: '₹45,000 - ₹62,000 net profit per acre (ROI ~190%)',
          growthDurationDays: '110-120 days',
          waterRequirement: 'Low',
          riskLevel: 'Low',
          idealSowingTime: 'October month',
          keyVarieties: ['RH 725', 'NRCHB 101', 'Pusa Mustard 31'],
        },
      ]
    : [
        {
          rank: 1,
          cropName: 'Basmati / Hybrid Paddy',
          hindiName: 'सुगंधित बासमती धान (Pusa 1509 / 1718)',
          suitabilityScore: 95,
          reasonForRecommendation: `Ideal moisture response in ${soilType} soil for ${region} conditions during ${season} season.`,
          expectedYield: '22-26 quintals/acre',
          estimatedRevenueOrRoi: '₹65,000 - ₹88,000 net profit per acre (ROI ~180%)',
          growthDurationDays: '120-135 days',
          waterRequirement: 'High',
          riskLevel: 'Low',
          idealSowingTime: 'June - July',
          keyVarieties: ['Pusa Basmati 1509', 'PB 1718', 'PR 126'],
        },
        {
          rank: 2,
          cropName: 'Hybrid Maize / Corn',
          hindiName: 'संकर मक्का (DKC 9108)',
          suitabilityScore: 90,
          reasonForRecommendation: 'High industrial feed demand with fast turnover and lower water consumption than flood irrigation crops.',
          expectedYield: '30-35 quintals/acre',
          estimatedRevenueOrRoi: '₹50,000 - ₹68,000 net profit per acre (ROI ~165%)',
          growthDurationDays: '95-105 days',
          waterRequirement: 'Medium',
          riskLevel: 'Moderate',
          idealSowingTime: 'June - July',
          keyVarieties: ['Dekalb 9108', 'Pioneer P3396', 'NK 6240'],
        },
      ];

  return {
    topRecommendations,
    soilPreparationSteps: [
      'Deep summer ploughing (MB plough) to expose soil-borne pests to sunlight.',
      'Apply 4-5 tonnes well-decomposed FYM / Vermicompost per acre 15 days before sowing.',
      'Perform precision laser levelling to optimize uniform water distribution and save 25% irrigation.',
    ],
    cropRotationStrategy: `Rotating with pulses or oilseeds after ${previousCrop} restores root-nodule rhizobia and breaks cereal nematode cycles.`,
    companionOrIntercropping: [
      'Mustard intercropping in Wheat at 1:9 row ratio for ecological insect deterrence',
      'Marigold border planting to trap stem borers and root-knot nematodes naturally',
    ],
    fertilizerAndNutrientPlan: [
      {
        stage: 'Basal (At Sowing)',
        fertilizer: 'DAP 50kg + MOP 25kg + Zinc Sulphate 10kg/acre',
        applicationMethod: 'Drilled 3-4 cm below seed level',
        organicAlternative: 'Vermicompost 2 tons + Jeevamrutha 200L/acre',
      },
      {
        stage: 'First Top Dressing (21-25 Days)',
        fertilizer: 'Neem-Coated Urea 35kg/acre',
        applicationMethod: 'Broadcasting prior to first irrigation (CRI stage)',
      },
      {
        stage: 'Boot / Flowering Stage',
        fertilizer: 'NPK 19:19:19 foliar spray @ 1kg in 100L water',
        applicationMethod: 'Fine mist spray on leaves during cool morning hours',
      },
    ],
    irrigationSchedule: 'Ensure irrigation during critical growth stages: Crown Root Initiation, Tillering, and Grain Milking stage.',
    marketOpportunities: 'Direct government procurement at Minimum Support Price (MSP) and APMC electronic e-NAM trading.',
    expertSummary: `Your ${soilType} soil profile in ${region} is well-suited for high-yield production with systematic nutrient management.`,
  };
}

function getWeatherDescription(weatherCode: number): string {
  if (weatherCode === 0) return 'Clear Sky';
  if ([1, 2].includes(weatherCode)) return 'Partly Cloudy';
  if (weatherCode === 3) return 'Overcast';
  if ([45, 48].includes(weatherCode)) return 'Foggy';
  if ([51, 53, 55, 56, 57].includes(weatherCode)) return 'Drizzle';
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) return 'Rain';
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) return 'Snow';
  if ([95, 96, 99].includes(weatherCode)) return 'Thunderstorm';
  return 'Variable Conditions';
}

function formatNumber(value: number | undefined, unit: string, decimals = 0): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? `${value.toFixed(decimals)}${unit}`
    : `--${unit}`;
}

function parseCoordinates(location: string): { latitude: number; longitude: number } | null {
  const match = location.match(/Lat:\s*(-?\d+(?:\.\d+)?),\s*Lng:\s*(-?\d+(?:\.\d+)?)/i);
  if (!match) return null;

  const latitude = Number(match[1]);
  const longitude = Number(match[2]);
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) return null;
  return { latitude, longitude };
}

async function resolveWeatherLocation(location: string) {
  const coordinates = parseCoordinates(location);
  if (coordinates) {
    return {
      ...coordinates,
      displayName: `GPS (${coordinates.latitude.toFixed(2)}, ${coordinates.longitude.toFixed(2)})`,
    };
  }

  const geocodeUrl = new URL('https://geocoding-api.open-meteo.com/v1/search');
  geocodeUrl.search = new URLSearchParams({
    name: location,
    count: '1',
    language: 'en',
    format: 'json',
  }).toString();

  const response = await fetch(geocodeUrl);
  if (!response.ok) throw new Error(`Open-Meteo geocoding failed with ${response.status}`);
  const data: any = await response.json();
  const result = data?.results?.[0];
  if (!result) throw new Error(`Location not found: ${location}`);

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    displayName: [result.name, result.admin1, result.country].filter(Boolean).join(', '),
  };
}

function buildWeatherAgronomyData(weather: any, location: { latitude: number; longitude: number; displayName: string }) {
  const current = weather.current || {};
  const hourly = weather.hourly || {};
  const daily = weather.daily || {};
  const currentWeatherCode = Number(current.weather_code ?? 0);
  const humidity = Number(current.relative_humidity_2m);
  const rainRisk = Number(current.precipitation_probability);
  const soilMoisture = Number(hourly.soil_moisture_0_to_1cm?.[0]);
  const windSpeed = Number(current.wind_speed_10m);
  const dailyDates: string[] = daily.time || [];
  const dailyRain = daily.precipitation_probability_max || [];
  const dailyCodes = daily.weather_code || [];
  const dailyMin = daily.temperature_2m_min || [];
  const dailyMax = daily.temperature_2m_max || [];
  const dailySunshine = daily.sunshine_duration || [];

  const alerts = [];
  if (rainRisk >= 60 || currentWeatherCode >= 80) {
    alerts.push({
      id: 'open-meteo-rain',
      level: 'warning',
      title: 'Rainfall Spray-Washoff Risk',
      description: 'Rain is likely soon and may wash off recently applied pesticides or nutrients.',
      impactOnCrops: 'Delay foliar sprays and check field drainage to prevent waterlogging.',
      actionRequired: 'Avoid spraying before rainfall. Inspect low-lying areas after the rain and resume irrigation only when soil drains.',
    });
  }
  if (humidity >= 80) {
    alerts.push({
      id: 'open-meteo-humidity',
      level: 'warning',
      title: 'High Humidity Disease Watch',
      description: 'High humidity can keep leaves wet and favor fungal disease development.',
      impactOnCrops: 'Dense crop canopies may have increased rust, blight, and mildew pressure.',
      actionRequired: 'Scout lower leaves early in the morning and avoid unnecessary evening irrigation.',
    });
  }
  if (windSpeed >= 20) {
    alerts.push({
      id: 'open-meteo-wind',
      level: 'warning',
      title: 'High Wind Spray Drift Risk',
      description: 'Strong winds can cause pesticide drift and uneven application.',
      impactOnCrops: 'Spray coverage may be poor and nearby crops, people, or water bodies may be exposed.',
      actionRequired: 'Postpone spraying until wind speeds are lower and secure lightweight farm materials.',
    });
  }
  if (alerts.length === 0) {
    alerts.push({
      id: 'open-meteo-advisory',
      level: 'advisory',
      title: 'Favorable Field Operations Window',
      description: 'Current conditions show no major rainfall or wind barrier for routine field work.',
      impactOnCrops: 'Conditions are suitable for scouting and planned work with normal precautions.',
      actionRequired: 'Check the crop canopy and soil moisture before irrigation or nutrient application.',
    });
  }

  const agriTips = [
    rainRisk >= 40 ? 'Keep pesticide and fertilizer applications clear of the next rain window.' : 'Check the next rain window before scheduling irrigation.',
    humidity >= 75 ? 'Scout dense crop canopies for fungal symptoms and prolonged leaf wetness.' : 'Use early morning scouting to identify pest and moisture stress early.',
    windSpeed >= 15 ? 'Avoid spraying during windy periods to reduce drift and off-target exposure.' : 'Low wind conditions are suitable for careful foliar application when the crop needs it.',
  ];

  return {
    location: location.displayName,
    coordinates: { lat: location.latitude, lng: location.longitude },
    current: {
      temp: formatNumber(Number(current.temperature_2m), '°C'),
      feelsLike: formatNumber(Number(current.apparent_temperature), '°C'),
      condition: getWeatherDescription(currentWeatherCode),
      humidity: formatNumber(humidity, '%'),
      windSpeed: formatNumber(windSpeed, ' km/h'),
      rainfallRisk: formatNumber(rainRisk, '%'),
      uvIndex: formatNumber(Number(current.uv_index), '', 1),
      soilMoistureEstimate: Number.isFinite(soilMoisture) ? `${Math.round(soilMoisture * 100)}% (0-1 cm)` : 'Unavailable',
      sunHours: formatNumber(Number(dailySunshine[0]) / 3600, ' hrs', 1),
    },
    farmAlerts: alerts,
    weeklyFarmingOutlook: dailyDates.slice(0, 6).map((date, index) => ({
      day: index === 0 ? 'Today' : index === 1 ? 'Tomorrow' : new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { weekday: 'short' }),
      date,
      tempRange: `${formatNumber(Number(dailyMin[index]), '°C')} - ${formatNumber(Number(dailyMax[index]), '°C')}`,
      condition: getWeatherDescription(Number(dailyCodes[index] ?? 0)),
      rainfallRisk: formatNumber(Number(dailyRain[index]), '%'),
      sprayingAdvice: Number(dailyRain[index]) >= 40 ? 'Avoid spraying before the rain window' : windSpeed >= 15 ? 'Wait for lower wind before spraying' : 'Suitable for spray before late morning',
      irrigationAdvice: Number(dailyRain[index]) >= 50 ? 'Skip irrigation if useful rain occurs' : soilMoisture >= 0.3 ? 'Check soil before routine irrigation' : 'Light irrigation may be needed',
    })),
    agriTips,
    groundingSources: [
      { title: 'Open-Meteo Forecast', uri: 'https://open-meteo.com/' },
      { title: 'Open-Meteo Geocoding', uri: 'https://open-meteo.com/en/docs/geocoding-api' },
    ],
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '30mb' }));
  app.use(express.urlencoded({ extended: true, limit: '30mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY || process.env.GROQ_API_KEY),
      app: 'CROPWIS - Smart Agriculture System',
    });
  });

  // 1. CROP DISEASE DETECTION ENDPOINT
  app.post('/api/crop/disease-check', async (req, res) => {
    try {
      const { cropName, plantPart, symptoms, imageBase64, imageMimeType, language = 'en' } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        throw new Error('API Key unconfigured');
      }

      const promptText = `
You are an expert Agronomist and Plant Pathologist specializing in Indian and global crop systems.
Analyze the following crop disease case and provide a comprehensive diagnostic and remedy plan.

Crop Name: ${cropName || 'Not specified (Identify from image if visible)'}
Affected Plant Part: ${plantPart || 'Leaves / Stem / Fruit'}
Reported Symptoms: ${symptoms || 'Visual inspection requested'}
User's Preferred Language: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English (with common Indian agricultural terminology where helpful)'}

Return your response strictly in JSON matching the exact schema below.

JSON Format:
{
  "cropName": "Name of the crop in English & Hindi",
  "diseaseName": "Scientific & Common disease name",
  "hindiName": "Hindi local name (e.g., पीला रतुआ, अगेती झुलसा, तना छेदक)",
  "confidenceScore": 94,
  "severityLevel": "Low" | "Moderate" | "Severe" | "Critical",
  "symptomsIdentified": ["bullet 1", "bullet 2", "bullet 3"],
  "primaryCause": "Fungal" | "Bacterial" | "Viral" | "Pest/Insect" | "Nutrient Deficiency" | "Environmental Stress" | "Healthy / No Disease",
  "detailedExplanation": "Clear explanation of why this disease occurred, environmental triggers like temperature/humidity, and how it progresses.",
  "immediateAction": ["Action step 1", "Action step 2"],
  "organicTreatments": [
    {
      "name": "Treatment name (e.g., Neem oil spray, Dashaparni Ark, Trichoderma, Bordeaux mixture)",
      "recipeOrMethod": "Preparation steps and ratio",
      "applicationFrequency": "e.g., Every 5-7 days in early morning"
    }
  ],
  "chemicalTreatments": [
    {
      "chemicalName": "Commercial fungicide/insecticide formulation (e.g., Mancozeb 75% WP, Propiconazole 25% EC)",
      "dosage": "Exact dosage per liter and per acre (e.g., 2g/L or 400g in 200L water/acre)",
      "safetyPrecautions": "Safety gear, waiting/pre-harvest period (PHI), pollinator protection"
    }
  ],
  "preventativeMeasures": [
    "Resistant seeds/varieties to plant",
    "Crop rotation advice",
    "Soil health and drainage recommendations"
  ],
  "yieldImpact": "Estimated impact on crop yield if left untreated vs if treated promptly"
}
`;

      const contents: any = [];

      if (imageBase64 && imageMimeType) {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
        contents.push({
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: imageMimeType || 'image/jpeg',
              },
            },
            {
              text: promptText,
            },
          ],
        });
      } else {
        contents.push({
          parts: [{ text: promptText }],
        });
      }

      const response = await generateContentWithFallback(ai, {
        contents: contents[0],
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an elite plant pathologist and senior agriculture advisor. Return valid JSON only.',
        },
      });

      const responseText = response.text || '{}';
      const parsedData = JSON.parse(responseText);

      res.json({ success: true, data: parsedData });
    } catch (err: any) {
      const requestedCrop = (req.body?.cropName || '').toLowerCase();
      const matchedPreset = SAMPLE_DISEASE_PRESETS.find((p) =>
        requestedCrop.includes(p.cropName.toLowerCase()) || p.cropName.toLowerCase().includes(requestedCrop)
      ) || SAMPLE_DISEASE_PRESETS[0];

      res.json({
        success: true,
        data: matchedPreset.mockResult,
        isQuotaFallback: true,
      });
    }
  });

  // 2. WEATHER & FARM WARNINGS ENDPOINT
  app.post('/api/weather/agri-forecast', async (req, res) => {
    try {
      const { location = 'Ludhiana, Punjab' } = req.body;
      const resolvedLocation = await resolveWeatherLocation(String(location).trim());
      const forecastUrl = new URL('https://api.open-meteo.com/v1/forecast');
      forecastUrl.search = new URLSearchParams({
        latitude: String(resolvedLocation.latitude),
        longitude: String(resolvedLocation.longitude),
        current: [
          'temperature_2m',
          'apparent_temperature',
          'relative_humidity_2m',
          'precipitation_probability',
          'weather_code',
          'wind_speed_10m',
          'uv_index',
          'sunshine_duration',
        ].join(','),
        hourly: 'soil_moisture_0_to_1cm',
        daily: [
          'weather_code',
          'temperature_2m_min',
          'temperature_2m_max',
          'precipitation_probability_max',
          'sunshine_duration',
          'uv_index_max',
        ].join(','),
        forecast_days: '7',
        timezone: 'auto',
      }).toString();

      const response = await fetch(forecastUrl);
      if (!response.ok) throw new Error(`Open-Meteo forecast failed with ${response.status}`);
      const weather = await response.json();
      res.json({ success: true, data: buildWeatherAgronomyData(weather, resolvedLocation) });
    } catch (err: any) {
      console.warn('Open-Meteo weather request failed:', err?.message || err);
      res.status(502).json({
        success: false,
        error: 'Live weather is unavailable for that location right now. Please check the place name and try again.',
      });
    }
  });

  // 3. AGRI NEWS ALL OVER INDIA ENDPOINT
  app.post('/api/news/farmer-updates', async (req, res) => {
    try {
      const { category = 'all', query = '' } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        throw new Error('API Key unconfigured');
      }

      const newsPrompt = `
Search for the latest real-time agricultural news, farmer policies, MSP updates, government schemes (PM-Kisan, PMFBY, KCC, Soil Health), APMC mandi price trends, and technological advances in agriculture across India.
Category focus: ${category}
Search query: ${query || 'Latest farmer news in India'}

Return your response strictly in valid JSON:
{
  "marketTrendsSummary": "A concise 2-sentence summary of overall APMC Mandi price trends and procurement updates.",
  "newsList": [
    {
      "id": "news-1",
      "title": "National Mandi & Procurement Highlights",
      "summary": "Record procurement of wheat and paddy at announced Minimum Support Prices across major mandis.",
      "category": "mandi-prices",
      "keyTakeawayForFarmers": "Farmers can register on state procurement portals for direct DBT account settlements.",
      "region": "All India",
      "date": "Recent",
      "source": "Ministry of Agriculture / PIB",
      "tags": ["MSP", "DBT", "Mandi"]
    }
  ]
}
`;

      const response = await generateContentWithFallback(ai, {
        contents: newsPrompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const responseText = response.text || '';
      let parsedData: any;

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        parsedData = JSON.parse(responseText);
      }

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = groundingChunks
        .filter((chunk: any) => chunk.web?.uri)
        .map((chunk: any) => ({
          title: chunk.web?.title || 'Agri News Source',
          uri: chunk.web?.uri,
        }));

      parsedData.groundingSources = sources;
      parsedData.lastUpdated = new Date().toLocaleDateString();

      res.json({ success: true, data: parsedData });
    } catch (err: any) {
      res.json({
        success: true,
        data: FALLBACK_NEWS_DATA,
        isQuotaFallback: true,
      });
    }
  });

  // 4. SMART CROP ADVISORY RECOMMENDATION ENGINE (Live Groq JSON + Gemini + Fallback)
  app.post('/api/crop/recommend', async (req, res) => {
    try {
      const {
        soilType = 'Alluvial',
        regionState = 'Punjab',
        district = '',
        season = 'Rabi',
        landSize = '5',
        landUnit = 'Acres',
        irrigationType = 'Tube well / Canal',
        budgetLevel = 'Medium',
        currentPreviousCrop = 'Paddy / Rice',
        farmingGoal = 'Maximum Profit',
        organicPreference = false,
        language = 'en',
      } = req.body;

      const promptText = `
You are India's premier Agricultural Scientist (ICAR / KVK specialist). Provide customized crop recommendations based on the farmer's complete agricultural profile:

Farmer Profile:
- Soil Type: ${soilType}
- State & Region: ${regionState} ${district ? `(District: ${district})` : ''}
- Sowing Season: ${season}
- Total Land Area: ${landSize} ${landUnit}
- Irrigation Source: ${irrigationType}
- Capital / Investment Capacity: ${budgetLevel}
- Current / Previous Crop: ${currentPreviousCrop}
- Primary Farming Goal: ${farmingGoal}
- Organic Farming Preference: ${organicPreference ? 'Yes (100% Organic / Natural Farming)' : 'Conventional / Integrated'}
- Language: ${language === 'hi' ? 'Hindi' : 'English (with Hindi names for crops)'}

Return your advisory strictly as valid JSON adhering to this schema:
{
  "topRecommendations": [
    {
      "rank": 1,
      "cropName": "Crop name in English",
      "hindiName": "फसल का नाम (e.g. गेहूँ / सरसों / मक्का)",
      "suitabilityScore": 95,
      "reasonForRecommendation": "Detailed rationale considering soil chemistry, previous crop rotation benefit, and regional climate",
      "expectedYield": "e.g. 18-22 quintals/acre",
      "estimatedRevenueOrRoi": "e.g. ₹60,000 - ₹85,000 net profit per acre (ROI ~180%)",
      "growthDurationDays": "e.g. 110-125 days",
      "waterRequirement": "Low" | "Medium" | "High",
      "riskLevel": "Low" | "Moderate" | "High",
      "idealSowingTime": "e.g. 15th October to 15th November",
      "keyVarieties": ["High-yield resistant variety 1 (e.g. DBW 187)", "Variety 2"]
    }
  ],
  "soilPreparationSteps": [
    "Step 1: Tillage and deep ploughing advice",
    "Step 2: Soil amendment (Gypsum, Lime, FYM compost)",
    "Step 3: Bed formation and laser levelling"
  ],
  "cropRotationStrategy": "Specific rotation strategy to break pest cycles and replenish nitrogen after ${currentPreviousCrop}",
  "companionOrIntercropping": [
    "Intercropping pair 1 (e.g. Mustard in Wheat rows 1:9 ratio)",
    "Border crop for pest trapping (e.g. Marigold around plot)"
  ],
  "fertilizerAndNutrientPlan": [
    {
      "stage": "Basal Application (At Sowing)",
      "fertilizer": "DAP 50kg + MOP 25kg + Zinc Sulphate 10kg per acre",
      "applicationMethod": "Band placement below seed depth",
      "organicAlternative": "Vermicompost 2 tons + Jeevamrutha 200L"
    },
    {
      "stage": "First Top Dressing (21-25 Days / Crown Root Initiation)",
      "fertilizer": "Urea 35kg/acre",
      "applicationMethod": "Broadcasting before irrigation"
    },
    {
      "stage": "Boot / Flowering Stage",
      "fertilizer": "NPK 19:19:19 or 0:52:34 Foliar Spray @ 1kg/100L",
      "applicationMethod": "Foliar mist spray in cool hours"
    }
  ],
  "irrigationSchedule": "Critical moisture stages (e.g., Crown root initiation, tillering, flowering, grain filling)",
  "marketOpportunities": "Current mandi trends, contract farming, export potential, or government procurement MSP",
  "expertSummary": "Inspiring and realistic summary from the agronomy team for this specific landholding"
}
`;

      // 1. If Groq API key is available, use Groq JSON generation
      if (process.env.GROQ_API_KEY) {
        const groqData = await callGroqJSON(promptText);
        if (groqData && groqData.topRecommendations && Array.isArray(groqData.topRecommendations)) {
          return res.json({ success: true, data: groqData });
        }
      }

      // 2. Try Gemini if configured
      const ai = getGeminiClient();
      if (ai) {
        const response = await generateContentWithFallback(ai, {
          contents: promptText,
          config: {
            responseMimeType: 'application/json',
            systemInstruction: 'You are an expert ICAR agricultural scientist. Provide rigorous, practical, field-tested agronomic advice.',
          },
        });

        const responseText = response.text || '{}';
        const parsedData = JSON.parse(responseText);
        return res.json({ success: true, data: parsedData });
      }

      throw new Error('No AI provider available');
    } catch (err: any) {
      console.warn('Crop advisory recommendation served fallback:', err?.message || err);
      const fallbackData = generateAdvisoryFallback(
        req.body?.soilType || 'Alluvial',
        req.body?.regionState || 'Punjab',
        req.body?.season || 'Rabi',
        req.body?.currentPreviousCrop || 'Paddy'
      );
      res.json({
        success: true,
        data: fallbackData,
        isQuotaFallback: true,
      });
    }
  });

  // 5. KISAN MITRA AI CHATBOT (General Farming & Problem Solver)
  app.post('/api/chat/farm-bot', async (req, res) => {
    try {
      const { message, chatHistory = [], language = 'en' } = req.body;
      const groqKey = process.env.GROQ_API_KEY;

      // 1. If Groq API key is configured, use Groq directly
      if (groqKey && groqKey.startsWith('gsk_')) {
        const sysPrompt = `You are "Kisan Mitra" (किसान मित्र), an expert agricultural scientist on CROPWIS platform. 
Language preference: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English'}.
Help the farmer directly with practical agronomic advice, crop science, fertilizers, and remedies. Provide clear, direct steps.`;
        const groqReply = await callGroqChat(message, sysPrompt);
        if (groqReply) {
          return res.json({
            success: true,
            reply: groqReply,
            sources: [{ title: 'Groq Agricultural Intelligence', uri: 'https://groq.com' }],
          });
        }
      }

      // 2. Try Gemini if configured
      const ai = getGeminiClient();
      if (ai) {
        const promptContext = `
You are "Kisan Mitra" (किसान मित्र), an empathetic, deeply knowledgeable AI farming assistant on the CROPWIS platform.
You assist Indian farmers with crop diseases, fertilizers, MSP rates, weather impacts, organic farming (Jeevamrutha, Neemastra), livestock care, and government schemes (PM-Kisan, PMFBY, KCC).

User Question: "${message}"
Language preference: ${language === 'hi' ? 'Hindi (हिंदी)' : 'English (with Hindi agricultural terms where natural)'}

Provide a clear, practical, step-by-step response with dosages, timing, and safety warnings.
`;

        const response = await generateContentWithFallback(ai, {
          contents: promptContext,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const text = response.text || '';
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
          .filter((chunk: any) => chunk.web?.uri)
          .map((chunk: any) => ({
            title: chunk.web?.title || 'Agricultural Reference',
            uri: chunk.web?.uri,
          }));

        return res.json({
          success: true,
          reply: text,
          sources,
        });
      }

      throw new Error('No AI provider available');
    } catch (err: any) {
      const isQuota = err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota');
      const isHi = req.body?.language === 'hi';
      
      let fallbackReply = '';
      const userMsgLower = (req.body?.message || '').toLowerCase();

      if (userMsgLower.includes('hi') || userMsgLower.includes('hello') || userMsgLower.includes('namaste')) {
        fallbackReply = isHi
          ? 'नमस्ते किसान भाई! मैं "किसान मित्र" हूँ। आप मुझसे फसल रोग, यूरिया/डीएपी की सही मात्रा, दोमट मिट्टी, जीवामृत या सरकारी योजनाओं के बारे में कोई भी प्रश्न पूछ सकते हैं।'
          : 'Namaste Farmer Friend! I am "Kisan Mitra". You can ask me about crop diseases, fertilizer dosages (Urea/DAP/Zinc), soil types (loamy/clay), organic recipes (Jeevamrutha), or PM-Kisan schemes.';
      } else {
        fallbackReply = isHi
          ? `नमस्ते किसान भाई! मैं आपकी खेती में सहायता के लिए यहाँ हूँ। आप फसल सुरक्षा, दोमट मिट्टी, कीट नियंत्रण, उर्वरक (यूरिया/डीएपी), या सरकारी योजनाओं (PM-Kisan) के बारे में पूछ सकते हैं।\n\nतत्काल सहायता के लिए राष्ट्रीय किसान कॉल सेंटर 1800-180-1551 पर भी कॉल कर सकते हैं।`
          : `Namaste Farmer Friend! I am here to assist your farming operations. You can ask about soil types (loamy soil), pest & disease protection, organic recipes (Jeevamrutha/Neemastra), crop rotation, or government schemes.\n\nFor 24x7 expert agronomy phone support, dial the Kisan Call Centre at 1800-180-1551 (Toll-Free).`;
      }

      res.json({
        success: true,
        reply: fallbackReply,
        sources: [
          { title: 'ICAR / Kisan Call Centre (Toll Free 1800-180-1551)', uri: 'https://farmer.gov.in' }
        ],
        isQuotaNotice: isQuota,
      });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CROPWIS Server running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});