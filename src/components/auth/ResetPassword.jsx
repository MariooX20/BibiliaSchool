import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ResetPassword({ themeMode }) {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password.trim() || !confirmPassword.trim()) {
      setError('يرجى إدخال كلمة المرور وتأكيدها.');
      return;
    }

    if (password !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (password.length < 6) {
      setError('يجب أن تحتوي كلمة المرور على 6 أحرف على الأقل.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password.trim(),
      });

      if (updateError) {
        throw updateError;
      }

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1800);
    } catch (err) {
      console.error('Update password error:', err);
      setError(err.message || 'حدث خطأ أثناء تغيير كلمة المرور.');
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
      ? 'bg-deep-950 border-stone-700 text-white placeholder-gray-500'
      : themeMode === 'sepia'
      ? 'bg-white/70 border-[#dfd5b4] text-[#433422] placeholder-stone-400'
      : 'bg-stone-50 border-stone-300 text-stone-900 placeholder-stone-400';

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4 animate-fade-in text-right">
      <div className={`w-full max-w-md rounded-3xl p-8 shadow-2xl border backdrop-blur-md transition-all duration-300 ${cardBg}`}>
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-400 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-bold">تعيين كلمة مرور جديدة</h2>
          <p className="opacity-75 text-sm mt-2 max-w-xs">
            أدخل كلمة المرور الجديدة لحسابك.
          </p>
        </div>

        {isSuccess ? (
          <div className="text-center space-y-4 animate-slide-up py-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold">تم تغيير كلمة المرور بنجاح!</h3>
            <p className="text-sm opacity-80">
              جاري تحويلك للصفحة الرئيسية...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="new-password" className="block text-sm font-semibold">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock size={20} />
                </div>
                <input
                  id="new-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full pr-11 pl-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${inputBg}`}
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirm-password" className="block text-sm font-semibold">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock size={20} />
                </div>
                <input
                  id="confirm-password"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pr-11 pl-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${inputBg}`}
                  placeholder="••••••••"
                  dir="ltr"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 text-rose-500 bg-rose-500/10 p-3.5 rounded-xl text-sm font-medium border border-rose-500/20">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري الحفظ...
                </>
              ) : (
                'حفظ كلمة المرور الجديدة'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
