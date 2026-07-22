import { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function SignUpModal({ isOpen, onClose, themeMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwiBZCpEcsS9tW40zuddZuW6rYskc2R2JpZxZ4xluK4TGSqkBf6lPQOJy6XiGVNNRQq/exec';
    
    const url = new URL(scriptURL);
    url.searchParams.append('name', formData.name);
    url.searchParams.append('email', formData.email);
    url.searchParams.append('password', formData.password);
    // Also add capitalized versions just in case the script expects them
    url.searchParams.append('Name', formData.name);
    url.searchParams.append('Email', formData.email);
    url.searchParams.append('Password', formData.password);

    try {
      // 1. Sign up with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name
          }
        }
      });

      if (signUpError) {
        throw signUpError;
      }

      // 2. Insert into profiles table
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: formData.email,
              name: formData.name
            }
          ]);
          
        if (profileError) {
          console.error('Error inserting profile:', profileError);
        }
      }

      // 3. Backup to Google Script
      try {
        await fetch(url.toString(), {
          method: 'GET',
          mode: 'no-cors'
        });
      } catch (err) {
        console.error('Google Script Backup Error:', err);
      }
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', password: '' });
      }, 2000);
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'حدث خطأ أثناء التسجيل. حاول مرة أخرى.');
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
        className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto no-scrollbar p-6 sm:p-8 rounded-2xl border shadow-2xl animate-fade-in ${modalBg} ${textPrimary}`}
        dir="rtl"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-black/10 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold bg-gradient-to-l from-gold-400 to-amber-500 bg-clip-text text-transparent mb-2">
            إنشاء حساب جديد
          </h2>
          <p className="opacity-70 text-sm">
            انضم إلينا للاستفادة من جميع الميزات والمحاضرات
          </p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center py-8 text-green-500 gap-4 animate-fade-in">
            <CheckCircle2 size={64} className="animate-bounce" />
            <p className="font-semibold text-lg">تم التسجيل بنجاح!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5 opacity-90">الاسم</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="أدخل اسمك الكامل"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all ${inputBg}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 opacity-90">البريد الإلكتروني</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="example@email.com"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-left ${inputBg}`}
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5 opacity-90">كلمة المرور</label>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border outline-none transition-all text-left ${inputBg}`}
                dir="ltr"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-4 w-full py-3.5 rounded-xl bg-gradient-to-r from-gold-600 to-amber-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  جاري التسجيل...
                </>
              ) : 'تسجيل حساب'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
