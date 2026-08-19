import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  User,
  Sprout,
  ExternalLink,
  RotateCcw,
  PhoneCall,
} from 'lucide-react';
import { ChatMessage, Language } from '../types';

interface KisanChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const KisanChatbotModal: React.FC<KisanChatbotModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const isHi = language === 'hi';
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: isHi
        ? 'नमस्ते किसान भाई! मैं आपका डिजिटल कृषि सहायक "किसान मित्र" (Kisan Mitra) हूँ। आप मुझसे फसल रोग, मौसम, खाद की सही मात्रा, जैविक कीटनाशक (जीवामृत, नीमास्त्र) या सरकारी योजनाओं (PM-Kisan, KCC) के बारे में कोई भी सवाल पूछ सकते हैं।'
        : 'Namaste Farmer Friend! I am your digital agricultural assistant "Kisan Mitra". Ask me anything about crop diseases, weather impact, fertilizer dosages, organic remedies, or government schemes.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    isHi ? 'धान में पीलापन दूर करने का उपाय?' : 'How to treat yellowing leaves in paddy?',
    isHi ? 'घर पर जीवामृत कैसे बनाएं?' : 'Recipe for making Jeevamrutha at home?',
    isHi ? 'गेहूँ में पीला रतुआ की दवा क्या है?' : 'What is the best fungicide for wheat yellow rust?',
    isHi ? 'पीएम-किसान की अगली किस्त कब आएगी?' : 'How to check PM-Kisan DBT installment status?',
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/farm-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get answer');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || (isHi ? 'क्षमा करें, उत्तर प्राप्त नहीं हुआ।' : 'Sorry, no response available.'),
        sources: data.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: isHi
          ? 'माफ़ कीजिए, नेटवर्क में समस्या आई। आप किसान कॉल सेंटर 1800-180-1551 पर भी सीधे बात कर सकते हैं।'
          : 'Sorry, could not connect to advisory services. You can also dial Kisan Call Centre at 1800-180-1551.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const cleanText = text.replace(/[*#_`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = isHi ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div
        id="kisan-mitra-modal-box"
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-emerald-700/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[640px] max-h-[92vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-emerald-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold font-serif">{isHi ? 'किसान मित्र एआई (Kisan Mitra)' : 'Kisan Mitra AI Farm Doctor'}</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-emerald-300">
                {isHi ? '24x7 निःशुल्क कृषि परामर्श' : '24x7 Free ICAR-Aligned Advisory'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setIsSpeaking(false);
                setMessages([messages[0]]);
              }}
              title={isHi ? 'चैट रीसेट करें' : 'Reset Chat'}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                if (window.speechSynthesis) window.speechSynthesis.cancel();
                setIsSpeaking(false);
                onClose();
              }}
              className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Question Prompts */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/40 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-emerald-900 dark:text-emerald-300 font-bold shrink-0 text-[11px]">
            {isHi ? 'पूछें:' : 'Quick Questions:'}
          </span>
          {quickPrompts.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(q)}
              className="bg-white dark:bg-slate-800 hover:bg-emerald-100 text-slate-800 dark:text-slate-200 px-3 py-1 rounded-full border border-emerald-300/80 dark:border-emerald-700/60 shrink-0 font-medium transition-all text-[11px]"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/90 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                    <Sprout className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs ${
                    isUser
                      ? 'bg-emerald-700 text-white rounded-tr-none'
                      : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>

                  {/* Grounding Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 space-y-1">
                      <span className="font-semibold block">{isHi ? 'संदर्भ स्रोत:' : 'Sources:'}</span>
                      {msg.sources.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.uri}
                          target="_blank"
                          rel="noreferrer"
                          className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{s.title || s.uri}</span>
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="mt-1.5 flex items-center justify-between text-[10px] opacity-70">
                    <span>{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        onClick={() => handleSpeak(msg.content)}
                        className="hover:text-emerald-700 dark:hover:text-emerald-400 p-0.5 ml-2"
                        title={isHi ? 'बोलकर सुनाएं' : 'Read aloud'}
                      >
                        {isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-amber-500" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0">
                <Sprout className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-2xl rounded-tl-none text-xs text-slate-500 flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span>{isHi ? 'किसान मित्र उत्तर तैयार कर रहा है...' : 'Consulting agricultural database...'}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="kisan-bot-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                isHi
                  ? 'अपनी फसल या खेती से जुड़ा कोई भी सवाल पूछें...'
                  : 'Type your farming question (e.g. spray schedule for cotton, urea dosage)...'
              }
              className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              id="kisan-bot-send-btn"
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-bold p-2.5 rounded-xl transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-2 text-center text-[10px] text-slate-400">
            {isHi
              ? 'आपातकालीन सहायता के लिए टोल-फ्री किसान कॉल सेंटर 1800-180-1551 पर भी कॉल कर सकते हैं।'
              : 'For urgent field emergencies, call Kisan Call Centre 1800-180-1551 (Toll-Free).'}
          </div>
        </div>
      </div>
    </div>
  );
};
