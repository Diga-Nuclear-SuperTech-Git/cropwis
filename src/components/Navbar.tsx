import React from 'react';
import { Sprout, CloudSun, Newspaper, Compass, Bot, PhoneCall, Globe, Menu, X, ShieldAlert, Sparkles } from 'lucide-react';
import { Language, NavSection } from '../types';

interface NavbarProps {
  activeSection: NavSection;
  setActiveSection: (section: NavSection) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  onOpenChatbot: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  setActiveSection,
  language,
  setLanguage,
  onOpenChatbot,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard', icon: Sparkles },
    { id: 'disease-check', label: language === 'hi' ? 'फसल रोग जांच' : 'Check My Crop', icon: Sprout },
    { id: 'weather', label: language === 'hi' ? 'मौसम व चेतावनी' : 'Weather & Alerts', icon: CloudSun },
    { id: 'news', label: language === 'hi' ? 'कृषि समाचार' : 'Agri News', icon: Newspaper },
    { id: 'crop-advisory', label: language === 'hi' ? 'फसल सलाहकार' : 'Crop Advisory', icon: Compass },
  ];

  const handleNavClick = (id: string) => {
    setActiveSection(id as NavSection);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-emerald-950/95 backdrop-blur-md text-emerald-50 border-b border-emerald-800/60 shadow-lg">
      {/* Top Bar for Kisan Helpline */}
      <div className="bg-emerald-900/80 px-4 py-1 text-xs text-emerald-200 border-b border-emerald-800/40 hidden sm:flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 font-medium text-emerald-100">
            <PhoneCall className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{language === 'hi' ? 'किसान कॉल सेंटर (टोल-फ्री):' : 'Kisan Call Centre (Toll-Free):'}</span>
            <strong className="text-amber-300 tracking-wide font-mono">1800-180-1551</strong>
          </span>
          <span className="text-emerald-400/60">•</span>
          <span className="text-emerald-300">
            {language === 'hi' ? 'पीएम-किसान हेल्पलाइन: 155261' : 'PM-Kisan Helpline: 155261'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 bg-emerald-800/80 px-2 py-0.5 rounded text-[11px] text-emerald-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            AI Gemini 3.7 Online
          </span>
        </div>
      </div>

      {/* Main Nav Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            id="brand-logo"
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-emerald-950 rounded-[10px] flex items-center justify-center">
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-serif">CROPWIS</span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] font-semibold px-1.5 py-0.5 rounded border border-amber-400/40">
                  AI AGRI
                </span>
              </div>
              <p className="text-[10px] text-emerald-300 font-medium tracking-wide uppercase">
                {language === 'hi' ? 'स्मार्ट कृषि सलाहकार' : 'Smart Farming Advisor'}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-800/90 text-white shadow-inner border border-emerald-600/50'
                      : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-300' : 'text-emerald-400/80'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-900/80 rounded-lg p-0.5 border border-emerald-700/60">
              <button
                id="lang-btn-en"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  language === 'en'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                id="lang-btn-hi"
                onClick={() => setLanguage('hi')}
                className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                  language === 'hi'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                हिंदी
              </button>
            </div>

            {/* Kisan Mitra Assistant Button */}
            <button
              id="kisan-mitra-header-btn"
              onClick={onOpenChatbot}
              className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-1.5 rounded-lg text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <Bot className="w-4 h-4 text-slate-950" />
              <span>{language === 'hi' ? 'किसान मित्र' : 'Kisan Mitra AI'}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-900/80 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-emerald-950 border-b border-emerald-800 px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-800 text-white'
                    : 'text-emerald-200 hover:bg-emerald-900/80 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 text-emerald-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-3 border-t border-emerald-800/80">
            <div className="flex items-center gap-2 text-xs text-amber-300 bg-emerald-900/60 p-3 rounded-lg">
              <PhoneCall className="w-4 h-4 shrink-0" />
              <span>Kisan Call Centre Toll-Free: <strong>1800-180-1551</strong></span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
