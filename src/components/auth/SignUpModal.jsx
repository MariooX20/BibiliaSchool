import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Loader2, CheckCircle2, User, Mail, Lock,
  Phone, Calendar, GraduationCap, Heart, Building, MapPin
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SignUpModal({ isOpen, onClose, themeMode }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    birthDate: '',
    grade: '',
    confessionFather: '',
    church: '',
    branch: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const trimmedEmail = formData.email.trim().toLowerCase();
    const cleanPhone = formData.phone.trim();

    // 1. Email format regex check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('يرجى إدخال بريد إلكتروني صحيح (مثال: example@gmail.com)');
      return;
    }

    // 2. Allowed webmail domains check to avoid typos and ensure verification delivery
    const allowedDomains = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'live.com', 'msn.com'];
    const domain = trimmedEmail.split('@')[1];
    if (!domain || !allowedDomains.includes(domain)) {
      setError('يرجى استخدام بريد إلكتروني مُعتمد مثل (Gmail, Hotmail, Yahoo, Outlook, iCloud) لضمان وصول رابط التفعيل.');
      return;
    }

    // 3. Password length check
    if (formData.password.length < 6) {
      setError('كلمة المرور يجب أن تتكون من 6 أحرف أو أرقام على الأقل.');
      return;
    }

    // 4. Phone validation (Egyptian numbers: 01 + 9 digits)
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError('يرجى إدخال رقم موبايل مصري صحيح مكون من 11 رقماً يبدأ بـ 01 (مثال: 01012345678)');
      return;
    }

    // 5. Birth date check
    if (!formData.birthDate) {
      setError('يرجى اختيار تاريخ الميلاد.');
      return;
    }

    // 6. Grade check
    if (!formData.grade) {
      setError('يرجى اختيار المرحلة الدراسية.');
      return;
    }

    setIsLoading(true);

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwiBZCpEcsS9tW40zuddZuW6rYskc2R2JpZxZ4xluK4TGSqkBf6lPQOJy6XiGVNNRQq/exec';
    
    // Construct search params with URLSearchParams for proper UTF-8 Arabic encoding
    const params = new URLSearchParams({
      name: formData.name.trim(),
      email: trimmedEmail,
      password: formData.password,
      phone: cleanPhone,
      birthDate: formData.birthDate,
      grade: formData.grade,
      father: formData.confessionFather.trim(),
      confessionFather: formData.confessionFather.trim(),
      church: formData.church.trim(),
      service: formData.branch.trim(),
      branch: formData.branch.trim(),
      type: 'signup'
    });

    try {
      // 1. Sign up with Supabase Auth (stores metadata in user object)
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password: formData.password,
        options: {
          data: {
            name: formData.name.trim(),
            phone: cleanPhone,
            birth_date: formData.birthDate,
            grade: formData.grade,
            confession_father: formData.confessionFather.trim(),
            church: formData.church.trim(),
            branch: formData.branch.trim(),
          }
        }
      });

      if (signUpError) throw signUpError;

      // 2. Backup to Google Script
      try {
        await fetch(scriptURL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
          body: params.toString()
        });
      } catch (scriptErr) {
        console.warn('Google Script POST error, trying GET fallback:', scriptErr);
        fetch(`${scriptURL}?${params.toString()}`, { method: 'GET', mode: 'no-cors' }).catch(() => {});
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
      let rawMsg = typeof err === 'string' ? err : (err?.message || err?.error_description || '');
      if (typeof rawMsg !== 'string' || rawMsg === '{}' || !rawMsg.trim()) {
        rawMsg = 'حدث خطأ أثناء التسجيل. يرجى التأكد من البيانات أو المحاولة لاحقاً.';
      }
      if (rawMsg.toLowerCase().includes('rate limit')) {
        setError('لقد تجاوزت عدد محاولات التسجيل المسموح بها مؤقتاً. يرجى الانتظار بضع دقائق.');
      } else {
        setError(rawMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const modalBg = themeMode === 'dark' ? 'bg-deep-900 border-deep-800' :
                  themeMode === 'sepia' ? 'bg-[#efe9d0] border-[#dfd5b4]' : 'bg-white border-stone-200';
  const overlayBg = themeMode === 'dark' ? 'bg-black/60' : 'bg-black/40';
  const textPrimary = themeMode === 'dark' ? 'text-gray-100' : themeMode === 'sepia' ? 'text-[#433422]' : 'text-stone-900';
  const inputBg = themeMode === 'dark' ? 'bg-deep-950 border-deep-800 focus:border-gold-500' :
                  themeMode === 'sepia' ? 'bg-[#f7f3e3] border-[#dfd5b4] focus:border-[#7c684d]' : 'bg-stone-50 border-stone-300 focus:border-stone-500';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${overlayBg} backdrop-blur-sm transition-opacity`}>
      <div 
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar p-6 sm:p-8 rounded-2xl border shadow-2xl animate-fade-in ${modalBg} ${textPrimary}`}
        dir="rtl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-black/10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-l from-gold-400 to-amber-500 bg-clip-text text-transparent mb-1">
            إنشاء حساب جديد
          </h2>
          <p className="opacity-70 text-xs sm:text-sm">
            يرجى إدخال بياناتك بدقة للالتحاق والتواصل معك
          </p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-xl font-bold text-emerald-500">تم إنشاء الحساب بنجاح! 📩</h3>
            <p className="opacity-80 text-sm max-w-md leading-relaxed">
              تم إرسال رابط تأكيد إلى بريدك الإلكتروني (<strong>{formData.email}</strong>).
              يرجى فتح بريدك والضغط على رابط التفعيل لتتمكن من تسجيل الدخول.
            </p>
            <button
              onClick={() => {
                onClose();
                setIsSuccess(false);
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  phone: '',
                  birthDate: '',
                  grade: '',
                  confessionFather: '',
                  church: '',
                  branch: ''
                });
                navigate('/');
              }}
              className="mt-4 px-6 py-2.5 rounded-xl font-bold bg-gold-600 hover:bg-gold-500 text-white shadow-md transition-all text-sm"
            >
              العودة للرئيسية
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Grid for Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* الاسم الكامل */}
              <div className="sm:col-span-2">
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 opacity-90">
                  <User size={15} className="text-gold-500" /> الاسم بالكامل
                </label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسمك الرباعي أو الكامل"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${inputBg}`}
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 opacity-90">
                  <Mail size={15} className="text-gold-500" /> البريد الإلكتروني
                </label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@gmail.com"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-left ${inputBg}`}
                  dir="ltr"
                />
              </div>

              {/* كلمة المرور */}
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 opacity-90">
                  <Lock size={15} className="text-gold-500" /> كلمة المرور
                </label>
                <input 
                  type="password" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-left ${inputBg}`}
                  dir="ltr"
                />
              </div>

              {/* رقم الموبايل (واتساب) */}
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 opacity-90">
                  <Phone size={15} className="text-gold-500" /> رقم الموبايل (يُفضل واتساب)
                </label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="01xxxxxxxxx"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all text-left ${inputBg}`}
                  dir="ltr"
                />
              </div>

              {/* تاريخ الميلاد */}
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 opacity-90">
                  <Calendar size={15} className="text-gold-500" /> تاريخ الميلاد
                </label>
                <input 
                  type="date" 
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${inputBg}`}
                />
              </div>

              {/* المرحلة الدراسية */}
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 opacity-90">
                  <GraduationCap size={15} className="text-gold-500" /> المرحلة الدراسية
                </label>
                <select 
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${inputBg}`}
                >
                  <option value="" disabled>اختر المرحلة الدراسية...</option>
                  <option value="أولى إعدادي" className={themeMode === 'dark' ? 'bg-deep-900 text-white' : ''}>أولى إعدادي</option>
                  <option value="ثانية إعدادي" className={themeMode === 'dark' ? 'bg-deep-900 text-white' : ''}>ثانية إعدادي</option>
                  <option value="ثالثة إعدادي" className={themeMode === 'dark' ? 'bg-deep-900 text-white' : ''}>ثالثة إعدادي</option>
                </select>
              </div>

              {/* الفرع الذي تحضر فيه */}
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 opacity-90">
                  <MapPin size={15} className="text-gold-500" /> الفرع اللي بتحضر فيه
                </label>
                <input 
                  type="text" 
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسم الفرع"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${inputBg}`}
                />
              </div>

              {/* اسم الكنيسة التي تحضر فيها */}
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 opacity-90">
                  <Building size={15} className="text-gold-500" /> اسم الكنيسة اللي بتحضر فيها
                </label>
                <input 
                  type="text" 
                  name="church"
                  value={formData.church}
                  onChange={handleChange}
                  required
                  placeholder="اسم الكنيسة"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${inputBg}`}
                />
              </div>

              {/* اسم أب الاعتراف */}
              <div>
                <label className="text-sm font-semibold mb-1.5 flex items-center gap-1.5 opacity-90">
                  <Heart size={15} className="text-gold-500" /> اسم أب الاعتراف
                </label>
                <input 
                  type="text" 
                  name="confessionFather"
                  value={formData.confessionFather}
                  onChange={handleChange}
                  required
                  placeholder="أدخل اسم أب الاعتراف"
                  className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-all ${inputBg}`}
                />
              </div>

            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium bg-red-500/10 p-2.5 rounded-xl border border-red-500/20 text-center">
                {error}
              </p>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-amber-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  جاري تسجيل الحساب...
                </>
              ) : 'إنشاء الحساب'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
