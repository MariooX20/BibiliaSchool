import React, { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

function Login({ setCurrentUser, setActiveTab }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('برجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (signInError) {
        throw signInError;
      }

      if (data.user) {
        setActiveTab('home'); // Redirect to home on successful login
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.message === 'Invalid login credentials') {
         setError('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
      } else if (err.message === 'Email not confirmed') {
         setError('يرجى تأكيد بريدك الإلكتروني أولاً (يرجى إيقاف Confirm email في Supabase).');
      } else {
         setError(err.message || 'حدث خطأ أثناء تسجيل الدخول.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-stone-100 dark:bg-deep-900 rounded-3xl p-8 shadow-xl border border-stone-200 dark:border-stone-800">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gold-500 text-white rounded-full flex items-center justify-center mb-4 shadow-lg">
            <LogIn size={32} />
          </div>
          <h2 className="text-2xl font-bold text-center">تسجيل الدخول</h2>
          <p className="text-stone-500 dark:text-stone-400 text-center mt-2">
            قم بتسجيل الدخول للوصول إلى حسابك
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 text-right" dir="rtl">
          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                <Mail size={20} />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-deep-950 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-shadow"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2" htmlFor="password">
              كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-stone-400">
                <Lock size={20} />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 pl-4 py-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-deep-950 focus:outline-none focus:ring-2 focus:ring-gold-500 transition-shadow"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-sm font-medium">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold-600 hover:bg-gold-500 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-lg shadow-gold-500/30 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <LogIn size={20} />}
            دخول
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
