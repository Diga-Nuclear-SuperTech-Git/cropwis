import React from 'react';
import { Sprout, CloudSun, Newspaper, Compass, ArrowRight, ShieldCheck, Zap, AlertTriangle, Sparkles, CheckCircle2, TrendingUp } from 'lucide-react';
import { Language, NavSection } from '../types';

interface HeroBannerProps {
  setActiveSection: (section: NavSection) => void;
  language: Language;
  onOpenChatbot: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  setActiveSection,
  language,
  onOpenChatbot,
}) => {
  const isHi = language === 'hi';

  const quickFeatures = [
    {
      id: 'disease-check',
      title: isHi ? 'फसल रोग जांच' : 'Check My Crop',
      subtitle: isHi ? 'पत्ते की फोटो अपलोड करें और बीमारी का वैज्ञानिक व जैविक उपचार पाएं' : 'Upload leaf photo to detect fungal, bacterial or viral diseases with organic & chemical cure',
      icon: Sprout,
      color: 'from-emerald-600 to-teal-700',
      badge: isHi ? 'विज़न AI सक्षम' : 'AI Vision Ready',
      actionText: isHi ? 'रोग जांच शुरू करें' : 'Diagnose Now',
    },
    {
      id: 'weather',
      title: isHi ? 'खेत का मौसम व चेतावनी' : 'Farm Weather & Warnings',
      subtitle: isHi ? 'अपने क्षेत्र का मौसम, ओलावृष्टि व कीट प्रसार चेतावनी और 7-दिवसीय स्प्रे कैलेंडर' : 'Real-time weather, frost/humidity alerts, spray safety window & soil moisture outlook',
      icon: CloudSun,
      color: 'from-sky-600 to-blue-700',
      badge: isHi ? 'लाइव सर्च ग्राउंडेड' : 'Live Search Grounded',
      actionText: isHi ? 'मौसम देखें' : 'View Weather Alerts',
    },
    {
      id: 'crop-advisory',
      title: isHi ? 'स्मार्ट फसल सलाहकार' : 'Smart Crop Advisory',
      subtitle: isHi ? 'मिट्टी, राज्य, मौसम, जमीन और बजट के आधार पर सबसे ज्यादा मुनाफा देने वाली फसलें' : 'Multi-factor recommendation engine factoring soil type, water, budget & crop rotation',
      icon: Compass,
      color: 'from-amber-600 to-orange-700',
      badge: isHi ? 'अधिकतम मुनाफा' : 'High ROI Planner',
      actionText: isHi ? 'फसल सलाह प्राप्त करें' : 'Get Recommendation',
    },
    {
      id: 'news',
      title: isHi ? 'अखिल भारतीय कृषि समाचार' : 'All-India Agri News',
      subtitle: isHi ? 'पीएम-किसान, एमएसपी दरें, नई कृषि योजनाएं और देशभर की ताजा मंडियों का हाल' : 'Live updates on MSP, government schemes (PM-Kisan, PMFBY), subsidies & mandi price trends',
      icon: Newspaper,
      color: 'from-teal-600 to-emerald-800',
      badge: isHi ? 'दैनिक समाचार' : 'Daily Updates',
      actionText: isHi ? 'ताजा खबरें पढ़ें' : 'Explore News',
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white pb-12 pt-6">
      {/* Decorative ambient background glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Seasonal Alert Marquee Bar */}
        <div className="mb-6 bg-emerald-900/60 border border-emerald-700/50 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-amber-300 font-medium">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <span className="font-semibold">{isHi ? 'कृषि अलर्ट:' : 'Seasonal Farming Advisory:'}</span>
            <span className="text-emerald-100">
              {isHi
                ? 'उच्च आर्द्रता और सुबह की ओस से फसलों में फफूंद जनित रोगों का खतरा - नियमित निरीक्षण करें।'
                : 'Elevated morning humidity levels reported across major belts - conduct prophylactic checks for foliar rust.'}
            </span>
          </div>
          <button
            onClick={() => setActiveSection('weather')}
            className="text-amber-300 hover:text-amber-200 underline font-semibold flex items-center gap-1 shrink-0"
          >
            <span>{isHi ? 'चेतावनी विवरण देखें' : 'Check Warning Details'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hero Main Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-600/60 px-3.5 py-1 rounded-full text-xs font-semibold text-emerald-200 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{isHi ? 'भारत का उन्नत कृत्रिम बुद्धिमत्ता कृषि मंच' : 'India’s Advanced AI-Powered Agriculture Engine'}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-serif leading-tight mb-4">
            {isHi ? (
              <>
                स्मार्ट खेती, स्वस्थ फसलें और <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">अधिकतम मुनाफा</span>
              </>
            ) : (
              <>
                Intelligent Precision Farming for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">Healthier Yields & Profits</span>
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-emerald-200/90 leading-relaxed font-normal mb-6">
            {isHi
              ? 'CROPWIS के साथ पाएं सटीक फसल रोग पहचान व दवाइयां, खेत के लिए रियल-टाइम मौसम चेतावनियां, अखिल भारतीय कृषि समाचार और मिट्टी आधारित अनुकूल फसल सिफारिशें।'
              : 'Protect your crops with AI leaf diagnosis, stay ahead with agricultural weather risk warnings, follow nation-wide farmer news, and plan your highest-yielding sowing calendar with Gemini.'}
          </p>

          {/* Quick CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              id="hero-cta-disease"
              onClick={() => setActiveSection('disease-check')}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm transition-all hover:scale-105 active:scale-95"
            >
              <Sprout className="w-4 h-4 text-slate-950" />
              <span>{isHi ? 'फसल की बीमारी जांचें' : 'Check My Crop'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-cta-advisory"
              onClick={() => setActiveSection('crop-advisory')}
              className="bg-emerald-900/90 hover:bg-emerald-800 text-emerald-100 border border-emerald-600/70 font-semibold px-5 py-2.5 rounded-xl text-sm transition-all hover:border-emerald-400 flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{isHi ? 'फसल सिफारिश सलाहकार' : 'Smart Crop Advisory'}</span>
            </button>

            <button
              id="hero-cta-ask-kisan"
              onClick={onOpenChatbot}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-md flex items-center gap-1.5"
            >
              <Zap className="w-4 h-4" />
              <span>{isHi ? 'कृषि विशेषज्ञ से पूछें' : 'Ask Kisan Mitra AI'}</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickFeatures.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                id={`feature-card-${feat.id}`}
                onClick={() => setActiveSection(feat.id as NavSection)}
                className="group relative bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-700/60 hover:border-emerald-500/80 rounded-2xl p-5 transition-all duration-200 cursor-pointer shadow-md hover:shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center shadow-md text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-700/50">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-emerald-200/80 leading-relaxed mb-4">
                    {feat.subtitle}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs font-semibold text-emerald-300 group-hover:text-white pt-3 border-t border-emerald-800/60">
                  <span>{feat.actionText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-emerald-800/40 flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-300 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{isHi ? 'वैज्ञानिक आईसीएआर मानकों पर आधारित' : 'Aligned with ICAR & State Agri University Standards'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{isHi ? 'जैविक व रासायनिक दोनों उपचार उपलब्ध' : 'Includes Both Organic & Safe Chemical Formulations'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{isHi ? 'सटीक लाइव मौसम व कृषि चेतावनी' : 'Real-time Google Grounded Farm Weather & News'}</span>
          </span>
        </div>
      </div>
    </div>
  );
};
