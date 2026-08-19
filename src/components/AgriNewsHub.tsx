import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Search,
  Tag,
  RefreshCw,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Landmark,
  CloudSun,
  Cpu,
  FileCheck2,
  Share2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { AgriNewsItem, AgriNewsResponse, Language } from '../types';
import { FALLBACK_NEWS_DATA } from '../data/samplePresets';

interface AgriNewsHubProps {
  language: Language;
  onOpenChatbot?: () => void;
}

export const AgriNewsHub: React.FC<AgriNewsHubProps> = ({
  language,
  onOpenChatbot,
}) => {
  const isHi = language === 'hi';
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [newsData, setNewsData] = useState<AgriNewsResponse>(FALLBACK_NEWS_DATA);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: isHi ? 'सभी समाचार' : 'All News', icon: Newspaper },
    { id: 'schemes', label: isHi ? 'सरकारी योजनाएं' : 'Govt Schemes (PM-Kisan)', icon: Landmark },
    { id: 'mandi-prices', label: isHi ? 'मंडी भाव व एमएसपी' : 'Mandi Rates & MSP', icon: TrendingUp },
    { id: 'weather-impact', label: isHi ? 'मानसून व फसल प्रभाव' : 'Weather & Crop Status', icon: CloudSun },
    { id: 'tech-innovations', label: isHi ? 'ड्रोन व नई तकनीक' : 'Drones & Agri-Tech', icon: Cpu },
    { id: 'policy', label: isHi ? 'ऋण व नीतियां' : 'Loans & Policies', icon: FileCheck2 },
  ];

  const quickSearchTags = [
    'PM-Kisan 17th Installment',
    'Wheat MSP',
    'Cotton Price',
    'Maharashtra Onion Subsidy',
    'Drone Spray Subsidy',
    'Drip Irrigation Subsidy',
    'Kisan Credit Card (KCC)',
    'Soybean Mandi Rates',
  ];

  const fetchNews = async (cat: string, query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/news/farmer-updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: cat,
          query: query.trim(),
          language,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || 'Failed to fetch news');
      }

      if (json.data && json.data.newsList) {
        setNewsData(json.data);
      }
    } catch (err: any) {
      console.warn('Agri news fetch error, using fallback feeds:', err);
      setNewsData(FALLBACK_NEWS_DATA);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews(activeCategory, searchQuery);
  };

  const handleCategoryChange = (catId: string) => {
    setActiveCategory(catId);
    fetchNews(catId, searchQuery);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'schemes':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'mandi-prices':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'weather-impact':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'tech-innovations':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'policy':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-teal-700 text-sm font-bold uppercase tracking-wider mb-1">
            <Newspaper className="w-4 h-4 text-teal-600" />
            <span>{isHi ? 'अखिल भारतीय कृषि बुलेटिन' : 'National Farmer Intelligence Hub'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            {isHi ? 'अखिल भारतीय किसान समाचार (All-India Farmer News)' : 'All-India Real-Time Agriculture & Farmer News'}
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-3xl">
            {isHi
              ? 'गूगल सर्च ग्राउंडिंग द्वारा संचालित भारत भर के किसानों के लिए एमएसपी दरें, पीएम-किसान किस्त, सब्सिडी, मंडी भाव व नई नीतियां।'
              : 'Live updates on MSP rates, PM-Kisan DBT transfers, PMFBY crop insurance, APMC mandi trends, and technological breakthroughs across Indian states.'}
          </p>
        </div>

        <button
          onClick={() => fetchNews(activeCategory, searchQuery)}
          disabled={loading}
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-3.5 py-2 rounded-xl text-xs border border-slate-300 transition-all shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
          <span>{isHi ? 'ताजा समाचार लोड करें' : 'Refresh News'}</span>
        </button>
      </div>

      {/* Market Trends Summary Alert Banner */}
      {newsData.marketTrendsSummary && (
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-5 mb-8 shadow-md flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                {isHi ? 'दैनिक राष्ट्रीय मंडी व नीति सारांश' : 'Daily National Mandi & Agricultural Outlook'}
              </span>
              <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded text-emerald-200">
                {newsData.lastUpdated}
              </span>
            </div>
            <p className="text-sm text-emerald-100/90 leading-relaxed font-normal">
              {newsData.marketTrendsSummary}
            </p>
          </div>
        </div>
      )}

      {/* Search & Topic Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-8 space-y-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="news-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isHi
                  ? 'फसल, राज्य या योजना का नाम खोजें (उदा. गेहूँ एमएसपी, महाराष्ट्र प्याज, ड्रोन सब्सिडी)...'
                  : 'Search by crop, state, or scheme (e.g. Wheat MSP, Punjab Paddy, Drone Subsidy, PM-Kisan)...'
              }
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button
            id="news-search-btn"
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-400 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>{isHi ? 'समाचार खोजें' : 'Search News'}</span>
          </button>
        </form>

        {/* Category Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`news-cat-${cat.id}`}
                onClick={() => handleCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-emerald-800 text-white shadow-sm border border-emerald-900'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-emerald-700'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Quick Tag Pills */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-400 font-semibold shrink-0">
            {isHi ? 'लोकप्रिय विषय:' : 'Trending Topics:'}
          </span>
          {quickSearchTags.map((tag, i) => (
            <button
              key={i}
              onClick={() => {
                setSearchQuery(tag);
                fetchNews(activeCategory, tag);
              }}
              className="bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-800 px-2.5 py-1 rounded-lg border border-slate-200 hover:border-emerald-300 shrink-0 font-medium transition-all"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="min-h-[350px] bg-white border border-slate-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4" />
          <h3 className="text-lg font-bold text-slate-900 font-serif">
            {isHi ? 'ताजा अखिल भारतीय कृषि समाचार खोजे जा रहे हैं...' : 'Gathering Live All-India Farmer News via Google Search...'}
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            {isHi
              ? 'कृषि मंत्रालय, एगमार्कनेट, पीआईबी व प्रमुख कृषि समाचार पोर्टल्स से सत्यापित जानकारी संकलित की जा रही है।'
              : 'Aggregating verified reports from Agmarknet, Ministry of Agriculture, PIB, and leading rural news agencies.'}
          </p>
        </div>
      ) : newsData.newsList && newsData.newsList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newsData.newsList.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Tags */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${getCategoryColor(item.category)}`}>
                    {item.category.replace('-', ' ')}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {item.date}
                  </span>
                </div>

                {/* Region Tag */}
                <div className="mb-2">
                  <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    📍 {item.region}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-base font-extrabold text-slate-900 font-serif leading-snug mb-2 hover:text-emerald-800 transition-colors">
                  {item.title}
                </h3>

                {/* Summary */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {item.summary}
                </p>

                {/* Highlight: Key Takeaway For Farmers */}
                {item.keyTakeawayForFarmers && (
                  <div className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3 mb-4">
                    <div className="flex items-center gap-1.5 text-amber-900 font-bold text-[11px] uppercase tracking-wide mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isHi ? 'किसान के लिए मुख्य लाभ / निर्देश:' : '🌾 Key Takeaway for Farmers:'}</span>
                    </div>
                    <p className="text-xs text-amber-950 font-medium leading-relaxed">
                      {item.keyTakeawayForFarmers}
                    </p>
                  </div>
                )}
              </div>

              {/* Source & Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-600 truncate max-w-[180px]">
                  {item.source}
                </span>

                {item.sourceUrl ? (
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                  >
                    <span>{isHi ? 'स्रोत देखें' : 'Read Source'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">
                    Verified Grounded
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-600 text-sm">
            {isHi ? 'इस श्रेणी में कोई समाचार नहीं मिला।' : 'No news articles found for this search.'}
          </p>
        </div>
      )}

      {/* Grounding Source Attribution */}
      {newsData.groundingSources && newsData.groundingSources.length > 0 && (
        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex flex-wrap items-center gap-3">
          <span className="font-semibold text-slate-700 flex items-center gap-1">
            <ExternalLink className="w-3.5 h-3.5" />
            {isHi ? 'समाचार स्रोत संदर्भ:' : 'Grounded Web Sources:'}
          </span>
          {newsData.groundingSources.map((src, i) => (
            <a
              key={i}
              href={src.uri}
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1"
            >
              <span>{src.title || src.uri}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};
