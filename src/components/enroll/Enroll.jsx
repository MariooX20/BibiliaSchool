import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, User, Phone, FileText, Calendar, Building, MapPin, GraduationCap, Heart } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Enroll({ themeMode, currentUser }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    grade: '',
    birthDate: '',
    phone: '',
    father: '',
    church: '',
    service: '',
    reason: '',
    interviewData: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(() => {
    if (currentUser?.isEnrolled) return true;
    if (currentUser?.email) {
      return localStorage.getItem(`enrolled_${currentUser.email}`) === 'true';
    }
    return false;
  });
  const [error, setError] = useState('');

  // Check local storage on mount or when currentUser changes
  useEffect(() => {
    if (currentUser?.isEnrolled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSuccess(true);
    } else if (currentUser?.email) {
      const hasEnrolled = localStorage.getItem(`enrolled_${currentUser.email}`);
      if (hasEnrolled === 'true') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsSuccess(true);
      }
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Phone validation (Egyptian numbers: 01 + 9 digits)
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('يرجى إدخال رقم موبايل مصري صحيح (مثال: 01xxxxxxxxx)');
      return;
    }

    setIsLoading(true);

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwiBZCpEcsS9tW40zuddZuW6rYskc2R2JpZxZ4xluK4TGSqkBf6lPQOJy6XiGVNNRQq/exec';
    const url = new URL(scriptURL);
    
    Object.keys(formData).forEach(key => {
      url.searchParams.append(key, formData[key]);
      // Also add capitalized versions just in case the script expects them
      url.searchParams.append(key.charAt(0).toUpperCase() + key.slice(1), formData[key]);
    });

    if (currentUser?.email) {
      url.searchParams.append('email', currentUser.email);
      url.searchParams.append('Email', currentUser.email);
    }

    try {
      const response = await fetch(url, {
        method: 'GET'
        // Removed mode: 'no-cors' to be able to read the JSON response from Google Script
      });
      
      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
        if (currentUser?.email) {
          localStorage.setItem(`enrolled_${currentUser.email}`, 'true');
        }
        // Update persistent state in Supabase metadata
        try {
          await supabase.auth.updateUser({
            data: { is_enrolled: true }
          });
        } catch (err) {
          console.error('Failed to update user metadata', err);
        }
      } else {
        // If Google Script returns an error
        if (result.message === "Phone already exists") {
          setError('رقم الموبايل مسجل بالفعل، لقد قمت بالتقديم مسبقاً.');
        } else if (result.message === "All fields are required") {
          setError('يرجى التأكد من ملء جميع البيانات المطلوبة.');
        } else {
          setError('حدث خطأ: ' + result.message);
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      // In case of actual network/CORS error
      setError('حدث خطأ في الاتصال، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 animate-fade-in px-4">
        <div className={`relative overflow-hidden rounded-[2.5rem] border shadow-2xl p-10 md:p-16 transition-colors duration-500 ${
          themeMode === 'dark' ? 'bg-deep-900/60 border-deep-800' :
          themeMode === 'sepia' ? 'bg-[#efe9d0]/70 border-[#dfd5b4]' : 'bg-white/80 border-stone-200'
        }`}>
          <div className="w-24 h-24 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <User size={48} />
          </div>
          <h2 className="text-3xl font-black mb-4">يجب تسجيل الدخول أولاً!</h2>
          <p className="opacity-70 text-lg mb-8 max-w-md mx-auto">
            لتتمكن من ملء استمارة الالتحاق وحفظ بياناتك، يرجى تسجيل الدخول أو إنشاء حساب جديد.
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
    <div className="max-w-4xl mx-auto animate-fade-in text-right w-full">
      <div className={`relative overflow-hidden rounded-[2.5rem] border shadow-2xl p-8 md:p-12 transition-colors duration-500 ${
        themeMode === 'dark' ? 'bg-deep-900/60 border-deep-800' :
        themeMode === 'sepia' ? 'bg-[#efe9d0]/70 border-[#dfd5b4]' : 'bg-white/80 border-stone-200'
      }`}>
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px] pointer-events-none -ml-20 -mb-20"></div>

        {isSuccess ? (
          <div className="relative z-10 text-center py-20 animate-slide-up">
            <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 size={48} />
            </div>
            <h2 className="text-4xl font-black mb-4">تم إرسال استمارتك بنجاح!</h2>
            <p className="opacity-70 text-xl mb-10 max-w-lg mx-auto">
              شكراً لاهتمامك بالانضمام إلينا. سنقوم بمراجعة طلبك والتواصل معك في أقرب وقت ممكن.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="px-8 py-4 rounded-xl font-bold border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all text-lg hover:-translate-y-1"
            >
              العودة للرئيسية
            </button>
          </div>
        ) : (
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-10 text-center text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">
              املا البيانات التاليه
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl text-center font-bold">
                  {error}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <User size={16} className="text-emerald-500" /> الاسم الرباعي
                  </label>
                  <input 
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                      themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                    }`}
                    placeholder="أدخل اسمك بالكامل"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <User size={16} className="text-emerald-500" /> النوع
                  </label>
                  <select 
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                      themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                    }`}
                  >
                    <option value="" disabled>اختر النوع...</option>
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <GraduationCap size={16} className="text-emerald-500" /> المرحلة الدراسية
                  </label>
                  <select 
                    name="grade"
                    required
                    value={formData.grade}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                      themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                    }`}
                  >
                    <option value="" disabled>اختر المرحلة...</option>
                    <option value="1st_prep">أولى إعدادي</option>
                    <option value="2nd_prep">ثانية إعدادي</option>
                    <option value="3rd_prep">ثالثة إعدادي</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Calendar size={16} className="text-emerald-500" /> تاريخ الميلاد
                  </label>
                  <input 
                    type="date"
                    name="birthDate"
                    required
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                      themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Phone size={16} className="text-emerald-500" /> رقم الموبايل
                  </label>
                  <input 
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                      themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                    }`}
                    placeholder="أدخل رقم الموبايل"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Heart size={16} className="text-emerald-500" /> اسم أب الاعتراف
                  </label>
                  <input 
                    type="text"
                    name="father"
                    required
                    value={formData.father}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                      themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                    }`}
                    placeholder="اسم أب الاعتراف"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <Building size={16} className="text-emerald-500" />  اسم الكنيسة الي بتحضر فيها 
                  </label>
                  <input 
                    type="text"
                    name="church"
                    required
                    value={formData.church}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                      themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                    }`}
                    placeholder="اسم الكنيسة"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold flex items-center gap-2">
                    <MapPin size={16} className="text-emerald-500" /> الفرع اللي بتحضر فيه
                  </label>
                  <input 
                    type="text"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                      themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                      themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                    }`}
                    placeholder="أدخل اسم الفرع"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  <FileText size={16} className="text-emerald-500" /> ليه حابب تقدم معانا
                </label>
                <textarea 
                  name="reason"
                  rows="3"
                  required
                  value={formData.reason}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none ${
                    themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                    themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                  }`}
                  placeholder="اكتب نبذة بسيطة عن دافعك..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold flex items-center gap-2">
                  <Calendar size={16} className="text-emerald-500" /> حدد معاد الانترفيو
                </label>
                <select 
                  name="interviewData"
                  required
                  value={formData.interviewData}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${
                    themeMode === 'dark' ? 'bg-deep-900/50 border-deep-700 focus:border-emerald-500' :
                    themeMode === 'sepia' ? 'bg-white/50 border-[#dfd5b4] focus:border-emerald-500' : 'bg-stone-50 border-stone-200 focus:border-emerald-500'
                  }`}
                >
                  <option value="" disabled>اختر ميعاد مناسب لك...</option>
                  <option value="15_aug_5pm">الخميس 15 أغسطس - 5:00 مساءً</option>
                  <option value="15_aug_7pm">الخميس 15 أغسطس - 7:00 مساءً</option>
                  <option value="16_aug_4pm">الجمعة 16 أغسطس - 4:00 مساءً</option>
                  <option value="16_aug_6pm">الجمعة 16 أغسطس - 6:00 مساءً</option>
                  <option value="17_aug_5pm">السبت 17 أغسطس - 5:00 مساءً</option>
                  <option value="17_aug_7pm">السبت 17 أغسطس - 7:00 مساءً</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      جاري حجز الانترفيو...
                    </>
                  ) : (
                    'تأكيد استمارة الالتحاق'
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
