import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { CropDiseaseChecker } from './components/CropDiseaseChecker';
import { WeatherFarmDashboard } from './components/WeatherFarmDashboard';
import { AgriNewsHub } from './components/AgriNewsHub';
import { CropAdvisoryEngine } from './components/CropAdvisoryEngine';
import { KisanChatbotModal } from './components/KisanChatbotModal';
import { Footer } from './components/Footer';
import { Language, NavSection } from './types';
import { Bot, Sprout, CloudSun, Newspaper, Compass, Sparkles, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [language, setLanguage] = useState<Language>('en');
  const [isChatbotOpen, setIsChatbotOpen] = useState<boolean>(false);

  const isHi = language === 'hi';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navbar */}
      <Navbar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        language={language}
        setLanguage={setLanguage}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeSection === 'dashboard' && (
          <div>
            {/* Top Interactive Hero */}
            <HeroBanner
              setActiveSection={setActiveSection}
              language={language}
              onOpenChatbot={() => setIsChatbotOpen(true)}
            />

            {/* Dashboard Integrated Sections Overview */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
              {/* Section 1: Check My Crop Spotlight */}
              <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">
                      <Sprout className="w-4 h-4 text-emerald-600" />
                      <span>{isHi ? 'तत्काल रोग पहचान' : 'Instant AI Diagnosis'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                      {isHi ? 'फसल रोग जांच व उपचार (Check My Crop)' : 'Check My Crop & Disease Solutions'}
                    </h2>
                  </div>
                  <button
                    id="dash-open-disease-btn"
                    onClick={() => setActiveSection('disease-check')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
                  >
                    <span>{isHi ? 'पूर्ण डायग्नोस्टिक टूल खोलें' : 'Open Full Diagnostic Tool'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <CropDiseaseChecker language={language} onOpenChatbot={() => setIsChatbotOpen(true)} />
              </section>

              {/* Section 2: Weather & Farm Warnings Spotlight */}
              <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-sky-700 uppercase tracking-wider mb-1">
                      <CloudSun className="w-4 h-4 text-sky-600" />
                      <span>{isHi ? 'लाइव मौसम व जोखिम अलर्ट' : 'Live Farm Weather & Risk Alerts'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                      {isHi ? 'मौसम व शुरुआती चेतावनी प्रणाली (Farm Warnings)' : 'Farm Weather & Warning Systems'}
                    </h2>
                  </div>
                  <button
                    id="dash-open-weather-btn"
                    onClick={() => setActiveSection('weather')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 px-4 py-2 rounded-xl transition-all"
                  >
                    <span>{isHi ? 'मौसम व चेतावनी विवरण' : 'Explore Weather Alerts'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <WeatherFarmDashboard language={language} onOpenChatbot={() => setIsChatbotOpen(true)} />
              </section>

              {/* Section 3: Smart Crop Advisory Planner Spotlight */}
              <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                      <Compass className="w-4 h-4 text-amber-600" />
                      <span>{isHi ? 'फसल चयन सलाहकार' : 'Sowing Recommendation Engine'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                      {isHi ? 'स्मार्ट फसल सलाहकार (Crop Advise Engine)' : 'Smart Crop Advisory & Rotation Planner'}
                    </h2>
                  </div>
                  <button
                    id="dash-open-advisory-btn"
                    onClick={() => setActiveSection('crop-advisory')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-4 py-2 rounded-xl transition-all"
                  >
                    <span>{isHi ? 'फसल योजना बनाएं' : 'Plan Next Season Crops'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <CropAdvisoryEngine language={language} onOpenChatbot={() => setIsChatbotOpen(true)} />
              </section>

              {/* Section 4: All-India Agri News Spotlight */}
              <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
                      <Newspaper className="w-4 h-4 text-teal-600" />
                      <span>{isHi ? 'ताजा कृषि समाचार' : 'Live National News'}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-serif">
                      {isHi ? 'अखिल भारतीय किसान समाचार (All-India Farmer News)' : 'All-India Real-Time Agriculture News'}
                    </h2>
                  </div>
                  <button
                    id="dash-open-news-btn"
                    onClick={() => setActiveSection('news')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 px-4 py-2 rounded-xl transition-all"
                  >
                    <span>{isHi ? 'सभी समाचार देखें' : 'View All News & MSP'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <AgriNewsHub language={language} onOpenChatbot={() => setIsChatbotOpen(true)} />
              </section>
            </div>
          </div>
        )}

        {/* Dedicated Full Views when navigating from Navbar */}
        {activeSection === 'disease-check' && (
          <CropDiseaseChecker language={language} onOpenChatbot={() => setIsChatbotOpen(true)} />
        )}

        {activeSection === 'weather' && (
          <WeatherFarmDashboard language={language} onOpenChatbot={() => setIsChatbotOpen(true)} />
        )}

        {activeSection === 'news' && (
          <AgriNewsHub language={language} onOpenChatbot={() => setIsChatbotOpen(true)} />
        )}

        {activeSection === 'crop-advisory' && (
          <CropAdvisoryEngine language={language} onOpenChatbot={() => setIsChatbotOpen(true)} />
        )}
      </main>

      {/* Floating Kisan Mitra AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="floating-kisan-mitra-btn"
          onClick={() => setIsChatbotOpen(true)}
          className="group flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-4 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 border border-amber-300/60"
        >
          <div className="w-7 h-7 bg-slate-950 text-amber-400 rounded-lg flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-sm tracking-tight hidden sm:inline">
            {isHi ? 'किसान मित्र से पूछें' : 'Ask Kisan Mitra AI'}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-ping hidden sm:inline" />
        </button>
      </div>

      {/* Kisan Mitra Chatbot Modal */}
      <KisanChatbotModal
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        language={language}
      />

      {/* Footer */}
      <Footer
        language={language}
        setActiveSection={setActiveSection}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />
    </div>
  );
}
