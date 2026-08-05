import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquare, Send, CheckCircle2, User,
  HelpCircle, ExternalLink, MessageCircle
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ContactUs({ themeMode, currentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    topic: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwiBZCpEcsS9tW40zuddZuW6rYskc2R2JpZxZ4xluK4TGSqkBf6lPQOJy6XiGVNNRQq/exec';
    const url = new URL(scriptURL);
    
    url.searchParams.append('name', currentUser?.name || currentUser?.email || '');
    url.searchParams.append('email', currentUser?.email || '');
    url.searchParams.append('topic', formData.topic);
    url.searchParams.append('message', formData.message);

    try {
      // 1. Submit to Google Sheet via Google Apps Script (no-cors mode)
      await fetch(url.toString(), {
        method: 'GET',
        mode: 'no-cors'
      });

      // 2. Record inquiry in Supabase inquiries table
      try {
        await supabase.from('inquiries').insert([
          {
            user_id: currentUser?.id,
            email: currentUser?.email,
            name: currentUser?.name || currentUser?.email,
            topic: formData.topic,
            message: formData.message
          }
        ]);
      } catch (supaErr) {
        console.log('Supabase inquiry save:', supaErr);
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Contact form submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const cardBg =
    themeMode === 'dark'
      ? 'bg-deep-900/80 border-deep-800 text-gray-100'
      : themeMode === 'sepia'
      ? 'bg-[#efe9d0]/80 border-[#dfd5b4] text-[#433422]'
      : 'bg-white border-stone-200 text-stone-900';

  const inputBg =
    themeMode === 'dark'
      ? 'bg-deep-950 border-stone-700 text-white placeholder-gray-500 focus:border-emerald-500'
      : themeMode === 'sepia'
      ? 'bg-white/70 border-[#dfd5b4] text-[#433422] placeholder-stone-400 focus:border-emerald-500'
      : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400 focus:border-emerald-500';

  // 1. Check if user is logged in
  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 animate-fade-in px-4">
        <div className={`relative overflow-hidden rounded-[2.5rem] border shadow-2xl p-10 md:p-16 transition-colors duration-500 ${cardBg}`}>
          <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={48} />
          </div>
          <h2 className="text-3xl font-black mb-4">يجب تسجيل الدخول أولاً!</h2>
          <p className="opacity-70 text-lg mb-8 max-w-md mx-auto">
            لتتمكن من التواصل معنا وإرسال استفساراتك، يرجى تسجيل الدخول أو إنشاء حساب جديد.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all inline-flex items-center gap-2"
          >
            الذهاب لصفحة الدخول
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in text-right py-6 space-y-10">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black">تواصل معنا</h1>
        <p className="opacity-75 text-base md:text-lg leading-relaxed">
          اختر موضوع استفسارك وسنرد عليك في أقرب وقت، أو يمكنك التواصل معنا مباشرة عبر وسائل التواصل.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Direct Messages Links (Right side in RTL - 5 Cols) */}
        <div className="lg:col-span-5 space-y-4 order-2 lg:order-1">
          <h3 className="font-bold text-xl mb-2 flex items-center gap-2">
            <MessageCircle className="text-emerald-500" size={22} />
            التواصل المباشر
          </h3>
  {/* Facebook Direct Link */}
          <a
            href="https://www.facebook.com/messages/t/788899294302989"
            target="_blank"
            rel="noopener noreferrer"
            className={`group block p-6 rounded-3xl border shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${cardBg}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 4.974 0 11.111c0 3.498 1.744 6.614 4.469 8.654V24l4.088-2.242c1.092.302 2.25.464 3.443.464 6.627 0 12-4.974 12-11.111C24 4.974 18.627 0 12 0zm1.191 14.963l-3.055-3.26-5.963 3.26 6.559-6.963 3.13 3.259 5.889-3.259-6.56 6.964z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg group-hover:text-blue-500 transition-colors">رسائل فيسبوك Messenger</h4>
                  <p className="text-xs opacity-75">تواصل معنا مباشرة عبر Facebook</p>
                </div>
              </div>
              <ExternalLink size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-[-2px] transition-all" />
            </div>
          </a>
          
          {/* Instagram Direct Link */}
          <a
            href="https://www.instagram.com/direct/t/17848608780543998/"
            target="_blank"
            rel="noopener noreferrer"
            className={`group block p-6 rounded-3xl border shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ${cardBg}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-lg group-hover:text-rose-500 transition-colors">رسائل انستجرام Direct</h4>
                  <p className="text-xs opacity-75">تواصل معنا مباشرة عبر Instagram</p>
                </div>
              </div>
              <ExternalLink size={18} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-[-2px] transition-all" />
            </div>
          </a>

        
        </div>

        {/* Contact Form (7 Cols) */}
        <div className={`lg:col-span-7 p-8 md:p-10 rounded-3xl border shadow-2xl transition-all duration-300 ${cardBg} order-1 lg:order-2`}>
          {isSubmitted ? (
            <div className="text-center py-12 space-y-4 animate-slide-up">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-2xl font-bold">تم إرسال استفسارك بنجاح!</h3>
              <p className="opacity-75 max-w-md mx-auto text-base">
                شكراً لتواصلك معنا. سنقوم بمراجعة استفسارك والتواصل معك في أقرب وقت.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ topic: '', message: '' });
                }}
                className="mt-4 px-6 py-2.5 rounded-xl font-bold bg-emerald-500 text-white shadow-md hover:bg-emerald-600 transition-all text-sm"
              >
                إرسال استفسار آخر
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="text-emerald-500" size={24} />
                أرسل استفسارك
              </h2>

              {/* Question 1: Topic Dropdown */}
              <div className="space-y-2">
                <label className="block text-sm font-bold flex items-center gap-2">
                  <HelpCircle size={16} className="text-emerald-500" />
                  استفسارك بخصوص؟
                </label>
                <select
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${inputBg}`}
                >
                  <option value="" disabled>اختر الموضوع...</option>
                  <option value="مواعيد الدراسة">مواعيد الدراسة</option>
                  <option value="المكان">المكان</option>
                  <option value="المسموحين بالحضور">المسموحين بالحضور</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>

              {/* Question 2: Message Textarea */}
              <div className="space-y-2">
                <label className="block text-sm font-bold flex items-center gap-2">
                  <MessageSquare size={16} className="text-emerald-500" />
                  اكتب استفسارك
                </label>
                <textarea
                  rows="5"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="اكتب استفسارك بالتفصيل هنا..."
                  className={`w-full px-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none ${inputBg}`}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2 text-base"
              >
                {isLoading ? (
                  <span>جاري إرسال الاستفسار...</span>
                ) : (
                  <>
                    <Send size={18} />
                    <span>إرسال الاستفسار</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
