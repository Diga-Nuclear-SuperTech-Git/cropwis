import React from 'react';
import { Sprout, PhoneCall, ShieldCheck, Heart, Sparkles, ExternalLink, Globe } from 'lucide-react';
import { Language, NavSection } from '../types';

interface FooterProps {
  language: Language;
  setActiveSection: (sec: NavSection) => void;
  onOpenChatbot: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  setActiveSection,
  onOpenChatbot,
}) => {
  const isHi = language === 'hi';

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      {/* Top Emergency Helplines Bar */}
      <div className="bg-emerald-950/80 border-b border-emerald-800/50 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/60">
            <PhoneCall className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                {isHi ? 'किसान कॉल सेंटर (टोल-फ्री)' : 'Kisan Call Centre (Toll-Free)'}
              </span>
              <strong className="text-white text-sm font-mono tracking-wider">1800-180-1551</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/60">
            <PhoneCall className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                {isHi ? 'पीएम-किसान हेल्पलाइन' : 'PM-Kisan Direct Helpline'}
              </span>
              <strong className="text-white text-sm font-mono tracking-wider">155261 / 1800115526</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/60">
            <PhoneCall className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                {isHi ? 'फसल बीमा (PMFBY)' : 'PMFBY Crop Insurance'}
              </span>
              <strong className="text-white text-sm font-mono tracking-wider">1800-180-2117</strong>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/60">
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 block">
                {isHi ? 'एआई कृषि वैज्ञानिक' : 'AI Agronomy Support'}
              </span>
              <button
                onClick={onOpenChatbot}
                className="text-amber-300 hover:text-amber-200 font-bold text-xs underline"
              >
                {isHi ? 'किसान मित्र से पूछें' : 'Chat with Kisan Mitra'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight font-serif">CROPWIS</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {isHi
                ? 'भारतीय किसानों के लिए आधुनिक कृत्रिम बुद्धिमत्ता (AI) आधारित फसल रोग पहचान, लाइव मौसम जोखिम चेतावनी, राष्ट्रीय कृषि समाचार एवं उन्नत फसल सिफारिश मंच।'
                : 'Intelligent AI-powered precision agriculture advisory platform integrating crop pathology diagnostics, search-grounded farm weather alerts, all-India news, and smart sowing planner.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isHi ? 'प्लेटफॉर्म सुविधाएं' : 'CROPWIS Modules'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveSection('disease-check')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isHi ? '• फसल रोग जांच (Check My Crop)' : '• Check My Crop (Disease Detection)'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('weather')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isHi ? '• मौसम व खेत चेतावनी (Farm Weather & Alerts)' : '• Farm Weather & Warnings'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('crop-advisory')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isHi ? '• फसल सलाहकार (Crop Advisory)' : '• Crop Advisory & Sowing Planner'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('news')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {isHi ? '• कृषि समाचार (All-India Agri News)' : '• All-India Agri News & MSP'}
                </button>
              </li>
            </ul>
          </div>

          {/* Useful Government Portals */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isHi ? 'प्रमुख सरकारी पोर्टल्स' : 'National Agri Portals'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>PM-Kisan Samman Nidhi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://enam.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>e-NAM (National Agriculture Market)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://agmarknet.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>Agmarknet Mandi Prices</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://mausam.imd.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1"
                >
                  <span>IMD Agromet Weather</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Note */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              {isHi ? 'सुरक्षा व अस्वीकरण' : 'Agronomic Disclaimer'}
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {isHi
                ? 'यह एआई सलाह वैज्ञानिक शोध पर आधारित है। रासायनिक दवाओं के उपयोग से पहले उत्पाद लेबल पर दिए गए सुरक्षा निर्देशों का पालन करें एवं स्थानीय कृषि विज्ञान केंद्र (KVK) से परामर्श लें।'
                : 'Advisories are generated via Gemini AI & agricultural databases. Please adhere to pesticide label safety instructions and local Krishi Vigyan Kendra (KVK) recommendations before application.'}
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} CROPWIS Precision Agriculture Platform. Empowering Indian Farmers with Gemini AI.</p>
        </div>
      </div>
    </footer>
  );
};
