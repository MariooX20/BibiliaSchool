import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Loader2, CheckCircle2, User, Phone, FileText,
  Calendar, Building, MapPin, GraduationCap, Heart
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const INTERVIEW_SLOTS = [
  "الجمعة 11 أغسطس - 5:00 مساءً",
  "الجمعة 21 أغسطس - 5:15 مساءً",
  "الجمعة 21 أغسطس - 5:30 مساءً",
  "الجمعة 21 أغسطس - 5:45 مساءً",
  "الجمعة 21 أغسطس - 6:00 مساءً",
  "الجمعة 21 أغسطس - 6:15 مساءً",
  "الجمعة 21 أغسطس - 6:30 مساءً",
  "الجمعة 21 أغسطس - 6:45 مساءً",
  "الجمعة 21 أغسطس - 7:00 مساءً",
  "الجمعة 21 أغسطس - 7:15 مساءً",
  "الجمعة 21 أغسطس - 7:30 مساءً",
  "الجمعة 21 أغسطس - 7:45 مساءً",
  "الجمعة 21 أغسطس - 8:00 مساءً",

  // الجمعة 28 أغسطس (كل 15 دقيقة من 5 مساءً حتى 8 مساءً)
  "الجمعة 28 أغسطس - 5:00 مساءً",
  "الجمعة 28 أغسطس - 5:15 مساءً",
  "الجمعة 28 أغسطس - 5:30 مساءً",
  "الجمعة 28 أغسطس - 5:45 مساءً",
  "الجمعة 28 أغسطس - 6:00 مساءً",
  "الجمعة 28 أغسطس - 6:15 مساءً",
  "الجمعة 28 أغسطس - 6:30 مساءً",
  "الجمعة 28 أغسطس - 6:45 مساءً",
  "الجمعة 28 أغسطس - 7:00 مساءً",
  "الجمعة 28 أغسطس - 7:15 مساءً",
  "الجمعة 28 أغسطس - 7:30 مساءً",
  "الجمعة 28 أغسطس - 7:45 مساءً",
  "الجمعة 28 أغسطس - 8:00 مساءً",

  // الجمعة 11 سبتمبر (كل 20 دقيقة من 6 مساءً حتى 8 مساءً)
  "الجمعة 11 سبتمبر - 6:00 مساءً",
  "الجمعة 11 سبتمبر - 6:20 مساءً",
  "الجمعة 11 سبتمبر - 6:40 مساءً",
  "الجمعة 11 سبتمبر - 7:00 مساءً",
  "الجمعة 11 سبتمبر - 7:20 مساءً",
  "الجمعة 11 سبتمبر - 7:40 مساءً",
  "الجمعة 11 سبتمبر - 8:00 مساءً",

  // الاثنين 14 سبتمبر (كل 20 دقيقة من 7 مساءً حتى 9 مساءً)
  "الاثنين 14 سبتمبر - 7:00 مساءً",
  "الاثنين 14 سبتمبر - 7:20 مساءً",
  "الاثنين 14 سبتمبر - 7:40 مساءً",
  "الاثنين 14 سبتمبر - 8:00 مساءً",
  "الاثنين 14 سبتمبر - 8:20 مساءً",
  "الاثنين 14 سبتمبر - 8:40 مساءً",
  "الاثنين 14 سبتمبر - 9:00 مساءً",

  // الثلاثاء 15 سبتمبر (كل 20 دقيقة من 7 مساءً حتى 9 مساءً)
  "الثلاثاء 15 سبتمبر - 7:00 مساءً",
  "الثلاثاء 15 سبتمبر - 7:20 مساءً",
  "الثلاثاء 15 سبتمبر - 7:40 مساءً",
  "الثلاثاء 15 سبتمبر - 8:00 مساءً",
  "الثلاثاء 15 سبتمبر - 8:20 مساءً",
  "الثلاثاء 15 سبتمبر - 8:40 مساءً",
  "الثلاثاء 15 سبتمبر - 9:00 مساءً",

  // الاثنين 21 سبتمبر (كل 20 دقيقة من 7 مساءً حتى 9 مساءً)
  "الاثنين 21 سبتمبر - 7:00 مساءً",
  "الاثنين 21 سبتمبر - 7:20 مساءً",
  "الاثنين 21 سبتمبر - 7:40 مساءً",
  "الاثنين 21 سبتمبر - 8:00 مساءً",
  "الاثنين 21 سبتمبر - 8:20 مساءً",
  "الاثنين 21 سبتمبر - 8:40 مساءً",
  "الاثنين 21 سبتمبر - 9:00 مساءً",

  // الثلاثاء 22 سبتمبر (كل 20 دقيقة من 7 مساءً حتى 9 مساءً)
  "الثلاثاء 22 سبتمبر - 7:00 مساءً",
  "الثلاثاء 22 سبتمبر - 7:20 مساءً",
  "الثلاثاء 22 سبتمبر - 7:40 مساءً",
  "الثلاثاء 22 سبتمبر - 8:00 مساءً",
  "الثلاثاء 22 سبتمبر - 8:20 مساءً",
  "الثلاثاء 22 سبتمبر - 8:40 مساءً",
  "الثلاثاء 22 سبتمبر - 9:00 مساءً",
];

// Helper to check if an interview slot datetime has passed
const isSlotExpired = (slotLabel) => {
  try {
    const year = 2026;
    let month = 7; // August (0-indexed)
    let day = null;

    if (slotLabel.includes('أغسطس')) {
      month = 7;
      const dayMatch = slotLabel.match(/(\d+)\s*أغسطس/);
      if (dayMatch) day = parseInt(dayMatch[1], 10);
    } else if (slotLabel.includes('سبتمبر')) {
      month = 8;
      const dayMatch = slotLabel.match(/(\d+)\s*سبتمبر/);
      if (dayMatch) day = parseInt(dayMatch[1], 10);
    }

    if (!day) return false;

    const timeMatch = slotLabel.match(/(\d+):(\d+)\s*(مساءً|صباحاً)/);
    if (!timeMatch) return false;

    let hour = parseInt(timeMatch[1], 10);
    const minute = parseInt(timeMatch[2], 10);
    const period = timeMatch[3];

    if (period === 'مساءً' && hour < 12) {
      hour += 12;
    } else if (period === 'صباحاً' && hour === 12) {
      hour = 0;
    }

    const slotDate = new Date(year, month, day, hour, minute);
    return slotDate < new Date();
  } catch (err) {
    return false;
  }
};

export default function Enroll({ themeMode, currentUser: propUser }) {
  const navigate = useNavigate();
  const { currentUser: authUser, refreshProfile } = useAuth();
  const currentUser = authUser || propUser;

  const isEnrollmentOpen = true;

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [slotCounts, setSlotCounts] = useState({});

  useEffect(() => {
    // Skip slot fetch if enrollment isn't open yet — saves a network request
    if (!isEnrollmentOpen) return;

    const fetchCounts = async () => {
      try {
        // 1. Query Supabase enrollments table for real-time slot counts
        const { data, error: supaErr } = await supabase
          .from('enrollments')
          .select('interview_slot');
        
        if (data && !supaErr) {
          const counts = {};
          data.forEach((item) => {
            if (item.interview_slot) {
              counts[item.interview_slot] = (counts[item.interview_slot] || 0) + 1;
            }
          });
          setSlotCounts(counts);
          return;
        }

        // 2. Fallback to Google Apps Script
        const res = await fetch('https://script.google.com/macros/s/AKfycbwiBZCpEcsS9tW40zuddZuW6rYskc2R2JpZxZ4xluK4TGSqkBf6lPQOJy6XiGVNNRQq/exec?action=getSlotCounts');
        const scriptData = await res.json();
        if (scriptData && scriptData.counts) {
          setSlotCounts(scriptData.counts);
        }
      } catch (err) {
        console.log('Slot counts fetch optional:', err);
      }
    };
    fetchCounts();
  }, []);

  // Derived: user has already enrolled (checked directly from Supabase profile/metadata)
  const alreadyEnrolled = currentUser?.isEnrolled === true;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!currentUser?.id) {
      setError('حدث خطأ في جلسة المستخدم، يرجى إعادة تسجيل الدخول والمحاولة مرة أخرى.');
      return;
    }

    // Phone validation (Egyptian numbers: 01 + 9 digits)
    const phoneRegex = /^01[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('يرجى إدخال رقم موبايل مصري صحيح (مثال: 01xxxxxxxxx)');
      return;
    }

    if (isSlotExpired(formData.interviewData)) {
      setError('الموعد الذي اخترته قد انتهى، يرجى اختيار موعد آخر متاح.');
      return;
    }

    setIsLoading(true);

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwiBZCpEcsS9tW40zuddZuW6rYskc2R2JpZxZ4xluK4TGSqkBf6lPQOJy6XiGVNNRQq/exec';
    
    // Construct search params with URLSearchParams for proper UTF-8 Arabic encoding
    const params = new URLSearchParams({
      ...formData,
      email: currentUser?.email || ''
    });
    const payloadString = params.toString();

    try {
      // 1. Perform the Supabase write FIRST and make sure it actually succeeds.
      //    This is the source of truth — if this fails, nothing else should happen
      //    and the user must see an error, not a fake success screen.
      const enrollmentPayload = {
        user_id: currentUser.id,
        email: currentUser.email || '',
        phone: formData.phone,
        interview_slot: formData.interviewData
      };

      let enrollmentSaved = false;

      // Try upsert first (works now that enrollments.user_id has a unique constraint,
      // so re-submitting updates the existing row instead of creating duplicates)
      const { error: enrollErr } = await supabase
        .from('enrollments')
        .upsert([enrollmentPayload], { onConflict: 'user_id' });

      if (!enrollErr) {
        enrollmentSaved = true;
      } else {
        console.warn('Enrollments upsert failed, trying insert fallback:', enrollErr);
        const { error: insertErr } = await supabase
          .from('enrollments')
          .insert([enrollmentPayload]);

        if (!insertErr) {
          enrollmentSaved = true;
        } else {
          console.error('Enrollments insert fallback also failed:', insertErr);
        }
      }

      // If we couldn't save the enrollment anywhere, stop here. Do NOT mark the
      // user as enrolled and do NOT show the success screen.
      if (!enrollmentSaved) {
        setError('حدث خطأ أثناء حفظ بياناتك، يرجى المحاولة مرة أخرى. لو استمرت المشكلة، تواصل معنا.');
        setIsLoading(false);
        return;
      }

      // 2. Only now that the real record is safely stored, send a best-effort
      //    copy to the Google Sheet (non-blocking, failures here don't matter).
      fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
        body: payloadString
      }).catch(err => console.error('Google Sheet POST error:', err));

      // 3. Update user metadata & profiles table now that we know enrollment succeeded
      const authTask = supabase.auth.updateUser({
        data: { is_enrolled: true }
      });

      const profileTask = supabase
        .from('profiles')
        .update({ is_enrolled: true })
        .eq('id', currentUser.id);

      const [authResult, profileResult] = await Promise.all([authTask, profileTask]);

      if (authResult?.error) {
        console.error('Failed to update auth metadata:', authResult.error);
      }
      if (profileResult?.error) {
        console.error('Failed to update profile:', profileResult.error);
      }

      // 4. Immediately refresh auth context so currentUser.isEnrolled becomes true instantly
      if (refreshProfile) {
        await refreshProfile();
      }

      setIsSuccess(true);
    } catch (err) {
      console.error('Error submitting form:', err);
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

        {isSuccess || alreadyEnrolled ? (
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

                  {(() => {
                    const groups = {};
                    INTERVIEW_SLOTS.forEach((slot) => {
                      if (isSlotExpired(slot)) return;
                      const datePrefix = slot.split(" - ")[0];
                      if (!groups[datePrefix]) {
                        groups[datePrefix] = [];
                      }
                      groups[datePrefix].push(slot);
                    });

                    const groupKeys = Object.keys(groups);
                    if (groupKeys.length === 0) {
                      return <option value="" disabled>لا توجد مواعيد متاحة حالياً</option>;
                    }

                    return groupKeys.map((datePrefix) => (
                      <optgroup key={datePrefix} label={`📅 ${datePrefix}`}>
                        {groups[datePrefix].map((slot) => {
                          const count = slotCounts[slot] || 0;
                          const isFull = count >= 6;
                          return (
                            <option key={slot} value={slot} disabled={isFull}>
                              {slot} {isFull ? '❌ (مكتمل - 6/6)' : count > 0 ? `(${6 - count} أماكن متبقية)` : ''}
                            </option>
                          );
                        })}
                      </optgroup>
                    ));
                  })()}
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
