import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { KeyRound, Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ForgotPassword({ themeMode }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (searchParams.get('expired') === 'true') {
      setError('انتهت صلاحية رابط إعادة التعيين أو تم استخدامه مسبقاً. يرجى طلب رابط جديد.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('يرجى إدخال البريد الإلكتروني الخاص بك.');
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (resetError) {
        if (resetError.message?.toLowerCase().includes('rate limit')) {
          throw new Error('لقد تجاوزت عدد محاولات الإرسال المسموح بها مؤقتاً. يرجى الانتظار القليل من الوقت قبل إرسال رابط جديد.');
        }
        throw resetError;
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Password reset error:', err);
      const msg = err.message || '';
      if (msg.toLowerCase().includes('rate limit')) {
        setError('لقد تجاوزت عدد محاولات الإرسال المسموح بها مؤقتاً. يرجى الانتظار القليل من الوقت قبل إعادة المحاولة.');
      } else {
        setError(msg || 'حدث خطأ أثناء إرسال رابط إعادة التعيين.');
      }
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
          <div className="w-16 h-16 bg-gradient-to-tr from-gold-500 to-amber-400 text-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-gold-500/20">
            <KeyRound size={32} />
          </div>
          <h2 className="text-2xl font-bold">نسيت كلمة المرور؟</h2>
          <p className="opacity-75 text-sm mt-2 max-w-xs">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور الخاصة بك.
          </p>
        </div>

        {isSubmitted ? (
          <div className="text-center space-y-6 animate-slide-up">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">تم إرسال رابط التعيين!</h3>
              <p className="text-sm opacity-80 leading-relaxed">
                يرجى تفقد بريدك الإلكتروني <span className="font-semibold text-gold-500" dir="ltr">{email}</span> واتباع التعليمات لإعادة تعيين كلمة المرور.
              </p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-gold-500 to-amber-500 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight size={18} />
              العودة لصفحة الدخول
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="reset-email" className="block text-sm font-semibold">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail size={20} />
                </div>
                <input
                  id="reset-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className={`w-full pr-11 pl-4 py-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-gold-500 transition-all ${inputBg}`}
                  placeholder="example@mail.com"
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
              className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-gold-500 to-amber-500 text-white shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  جاري الإرسال...
                </>
              ) : (
                'إرسال رابط التعيين'
              )}
            </button>

            <div className="pt-2 text-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold opacity-80 hover:opacity-100 hover:text-gold-500 transition-all"
              >
                <ArrowRight size={16} />
                العودة إلى تسجيل الدخول
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
