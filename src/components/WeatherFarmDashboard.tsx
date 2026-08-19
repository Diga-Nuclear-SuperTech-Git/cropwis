import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Search,
  MapPin,
  AlertTriangle,
  Droplets,
  Wind,
  Sun,
  CloudRain,
  ShieldAlert,
  Compass,
  CheckCircle2,
  Calendar,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Info,
  ThermometerSun,
  Sprout,
} from 'lucide-react';
import { Language, WeatherData } from '../types';
import { POPULAR_INDIAN_REGIONS, FALLBACK_WEATHER_DATA } from '../data/samplePresets';

interface WeatherFarmDashboardProps {
  language: Language;
  onOpenChatbot?: () => void;
}

export const WeatherFarmDashboard: React.FC<WeatherFarmDashboardProps> = ({
  language,
  onOpenChatbot,
}) => {
  const isHi = language === 'hi';
  const [searchLocation, setSearchLocation] = useState<string>('Ludhiana, Punjab');
  const [activeRegion, setActiveRegion] = useState<string>('Ludhiana, Punjab');
  const [weatherData, setWeatherData] = useState<WeatherData>(FALLBACK_WEATHER_DATA);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (loc: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/weather/agri-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: loc,
          language,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch weather forecast');
      }

      if (json.data) {
        setWeatherData(json.data);
        setActiveRegion(loc);
      }
    } catch (err: any) {
      const message = err instanceof Error ? err.message : 'Unable to load live weather';
      console.warn('Weather fetch error:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchLocation.trim()) {
      fetchWeather(searchLocation.trim());
    }
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      setError(isHi ? 'आपके ब्राउज़र में जीपीएस स्थान सेवा समर्थित नहीं है' : 'Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const coordsName = `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`;
        setSearchLocation(coordsName);
        await fetchWeather(`GPS (${coordsName})`);
      },
      (err) => {
        setLoading(false);
        setError(isHi ? 'स्थान की अनुमति नहीं मिली, कृपया शहर का नाम दर्ज करें।' : 'Location permission denied. Please enter your district or city manually.');
      },
      { timeout: 10000 }
    );
  };

  const getAlertStyle = (level: string) => {
    switch (level) {
      case 'critical':
        return {
          bg: 'bg-red-50 dark:bg-red-950/40',
          border: 'border-red-500/80',
          badge: 'bg-red-600 text-white',
          text: 'text-red-900 dark:text-red-200',
        };
      case 'warning':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          border: 'border-amber-500/80',
          badge: 'bg-amber-600 text-white',
          text: 'text-amber-900 dark:text-amber-200',
        };
      default:
        return {
          bg: 'bg-blue-50 dark:bg-blue-950/40',
          border: 'border-blue-500/80',
          badge: 'bg-blue-600 text-white',
          text: 'text-blue-900 dark:text-blue-200',
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-sky-700 text-sm font-bold uppercase tracking-wider mb-1">
            <CloudSun className="w-4 h-4 text-sky-600" />
            <span>{isHi ? 'कृषि मौसम विज्ञान' : 'Agro-Meteorological Intel'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            {isHi ? 'खेत का मौसम व शुरुआती चेतावनी (Farm Weather & Warnings)' : 'Farm Weather & Agricultural Risk Warnings'}
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            {isHi
              ? 'ओपन-मेटियो से लाइव स्थानीय मौसम, फसलों पर असर, वर्षा/हवा चेतावनी व 6-दिवसीय स्प्रे कैलेंडर।'
              : 'Live Open-Meteo weather, crop impact warnings, spray safety windows, and soil moisture indicators.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchWeather(activeRegion)}
            disabled={loading}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3 py-2 rounded-xl text-xs border border-slate-300 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{isHi ? 'ताजा करें' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Location Search Bar & Geolocation */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-6">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="weather-search-input"
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder={
                isHi
                  ? 'अपना जिला, तहसील या शहर का नाम लिखें (उदा. नासिक, लुधियाना, वाराणसी, राजकोट)...'
                  : 'Enter district, city or village name (e.g., Nashik, Ludhiana, Rajkot, Varanasi)...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="weather-search-btn"
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-initial bg-sky-600 hover:bg-sky-700 disabled:bg-slate-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isHi ? 'मौसम देखें' : 'Get Weather'}</span>
            </button>

            <button
              id="weather-gps-btn"
              type="button"
              onClick={handleUseMyLocation}
              disabled={loading}
              className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold px-4 py-2.5 rounded-xl text-sm border border-emerald-200 transition-all shrink-0"
              title={isHi ? 'वर्तमान जीपीएस स्थान का उपयोग करें' : 'Use Current GPS'}
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">{isHi ? 'मेरा स्थान' : 'My Location'}</span>
            </button>
          </div>
        </form>

        {/* Quick Popular Agri Zones Chips */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 font-semibold shrink-0">
            {isHi ? 'प्रमुख कृषि क्षेत्र:' : 'Agri Zones:'}
          </span>
          {POPULAR_INDIAN_REGIONS.slice(0, 8).map((reg) => (
            <button
              key={reg.name}
              type="button"
              onClick={() => {
                setSearchLocation(reg.name);
                fetchWeather(reg.name);
              }}
              className={`px-2.5 py-1 rounded-lg shrink-0 font-medium transition-all ${
                activeRegion === reg.name
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {reg.name}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs sm:text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{error}</span>
        </div>
      )}

      {/* FARM WARNING SIGNS (Crucial Feature Requested) */}
      {weatherData.farmAlerts && weatherData.farmAlerts.length > 0 && (
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold uppercase text-xs tracking-wider">
              <ShieldAlert className="w-4 h-4 text-red-600 animate-bounce" />
              <span>{isHi ? 'खेत सुरक्षा चेतावनियां व अलर्ट' : 'Active Agricultural Risk Alerts'}</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {isHi ? 'स्थान: ' : 'Location: '}<strong>{weatherData.location}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherData.farmAlerts.map((alert) => {
              const style = getAlertStyle(alert.level);
              return (
                <div
                  key={alert.id}
                  id={`farm-alert-${alert.id}`}
                  className={`rounded-2xl p-5 border-2 shadow-sm ${style.bg} ${style.border}`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${style.badge}`}>
                        {alert.level}
                      </span>
                      <h3 className="text-base font-extrabold text-slate-950 font-serif">
                        {alert.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 mb-3 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-300/60 text-xs">
                    <div>
                      <strong className="text-slate-900">{isHi ? 'फसलों पर प्रभाव: ' : 'Impact on Standing Crops: '}</strong>
                      <span className="text-slate-700">{alert.impactOnCrops}</span>
                    </div>
                    <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-300/80">
                      <strong className="text-emerald-800 dark:text-emerald-300 flex items-center gap-1 font-bold mb-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {isHi ? 'किसान तुरंत क्या करें (Action Required):' : 'Farmer Action Required:'}
                      </strong>
                      <p className="text-slate-800 font-medium pl-4">{alert.actionRequired}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Current Real-Time Conditions Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Main Temperature & Status Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-sky-200 mb-2">
              <span className="flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                {weatherData.location}
              </span>
              <span>{isHi ? 'अंतिम अपडेट: ' : 'Updated: '}{weatherData.lastUpdated}</span>
            </div>

            <div className="flex items-center justify-between my-4">
              <div>
                <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-white">
                  {weatherData.current?.temp || '29°C'}
                </div>
                <p className="text-sm font-semibold text-sky-200 mt-1">
                  {weatherData.current?.condition || 'Partly Cloudy'}
                </p>
                {weatherData.current?.feelsLike && (
                  <p className="text-xs text-sky-300">
                    {isHi ? 'महसूस होता है: ' : 'Feels like '}{weatherData.current.feelsLike}
                  </p>
                )}
              </div>

              <div className="w-20 h-20 bg-sky-700/50 rounded-2xl flex items-center justify-center shadow-inner border border-sky-600/50">
                <CloudSun className="w-12 h-12 text-amber-300 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-sky-700/60 grid grid-cols-2 gap-3 text-xs">
            <div className="bg-sky-950/60 p-2.5 rounded-xl border border-sky-800/60">
              <span className="text-sky-300 block text-[11px]">{isHi ? 'वर्षा की संभावना' : 'Rain Probability'}</span>
              <strong className="text-white text-sm font-mono">{weatherData.current?.rainfallRisk || '10%'}</strong>
            </div>
            <div className="bg-sky-950/60 p-2.5 rounded-xl border border-sky-800/60">
              <span className="text-sky-300 block text-[11px]">{isHi ? 'अनुमानित मृदा नमी' : 'Soil Moisture'}</span>
              <strong className="text-emerald-300 text-sm font-mono">{weatherData.current?.soilMoistureEstimate || 'Adequate (32%)'}</strong>
            </div>
          </div>
        </div>

        {/* 4 Core Parameter Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isHi ? 'हवा में नमी' : 'Humidity'}</span>
              <Droplets className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {weatherData.current?.humidity || '58%'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isHi ? 'पत्ती गीलापन सूचकांक' : 'Canopy dew risk'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isHi ? 'हवा की गति' : 'Wind Speed'}</span>
              <Wind className="w-4 h-4 text-teal-500" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {weatherData.current?.windSpeed || '12 km/h'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isHi ? 'स्प्रे ड्रिफ्ट जोखिम' : 'Spray drift index'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isHi ? 'धूप के घंटे' : 'Sun Hours'}</span>
              <Sun className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {weatherData.current?.sunHours || '8.5 hrs'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isHi ? 'प्रकाश संश्लेषण' : 'Photosynthesis'}
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{isHi ? 'यूवी इंडेक्स' : 'UV Index'}</span>
              <ThermometerSun className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono">
                {weatherData.current?.uvIndex || '6 (Mod)'}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {isHi ? 'फसल तनाव सूचकांक' : 'Heat stress factor'}
              </p>
            </div>
          </div>

          {/* Quick Agronomic Weather Tips */}
          <div className="col-span-2 sm:col-span-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'इस मौसम के लिए कृषि सुझाव (Weather Agronomy Tips)' : 'Current Weather Agronomic Tips'}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-emerald-900">
              {weatherData.agriTips?.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 bg-white/80 p-2.5 rounded-xl border border-emerald-100">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span className="font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 6-Day Agricultural Spraying & Irrigation Calendar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>{isHi ? 'साप्ताहिक कृषि कार्य योजना' : '6-Day Agricultural Activity Forecast'}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-serif">
              {isHi ? 'स्प्रे व सिंचाई योजना कैलेंडर (Spray & Irrigation Calendar)' : 'Spraying Safety & Irrigation Window Calendar'}
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {isHi ? 'बारिश में दवा धुलने से बचाएं' : 'Prevent pesticide wash-off & water stagnation'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {weatherData.weeklyFarmingOutlook?.map((day, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 rounded-xl p-3.5 transition-all flex flex-col justify-between text-xs space-y-2.5"
            >
              <div>
                <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200 pb-1.5">
                  <span>{day.day}</span>
                  <span className="text-slate-500 font-normal text-[11px]">{day.date}</span>
                </div>

                <div className="my-2">
                  <div className="font-extrabold text-slate-900 font-mono text-sm">
                    {day.tempRange}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 truncate font-medium">
                    {day.condition}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-[11px]">
                <div className="bg-sky-50 text-sky-950 p-1.5 rounded-lg border border-sky-200">
                  <strong className="block text-[10px] text-sky-800 font-bold uppercase">{isHi ? 'वर्षा जोखिम:' : 'Rain Risk:'}</strong>
                  <span>{day.rainfallRisk}</span>
                </div>

                <div className="bg-emerald-50 text-emerald-950 p-1.5 rounded-lg border border-emerald-200">
                  <strong className="block text-[10px] text-emerald-800 font-bold uppercase">{isHi ? 'स्प्रे सलाह:' : 'Spray Advice:'}</strong>
                  <span className="font-medium">{day.sprayingAdvice}</span>
                </div>

                <div className="bg-amber-50 text-amber-950 p-1.5 rounded-lg border border-amber-200">
                  <strong className="block text-[10px] text-amber-800 font-bold uppercase">{isHi ? 'सिंचाई:' : 'Irrigation:'}</strong>
                  <span>{day.irrigationAdvice}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grounding Citations */}
      {weatherData.groundingSources && weatherData.groundingSources.length > 0 && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" />
            {isHi ? 'सत्यापित मौसम स्रोत:' : 'Grounded Sources:'}
          </span>
          {weatherData.groundingSources.map((src, i) => (
            <a
              key={i}
              href={src.uri}
              target="_blank"
              rel="noreferrer"
              className="text-sky-700 hover:text-sky-900 underline flex items-center gap-1"
            >
              <span>{src.title || src.uri}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
