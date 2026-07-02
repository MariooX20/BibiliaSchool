import { useState, useEffect } from 'react';
import { BookOpen, Video, Lock, AlertCircle } from 'lucide-react';

function Courses({ currentUser, setActiveTab }) {
  const [toastMessage, setToastMessage] = useState('');

  // Clear toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleYear1Click = () => {
    if (!currentUser) {
      setToastMessage('يرجى تسجيل الدخول أولاً للوصول إلى المحاضرات.');
      setTimeout(() => setActiveTab('login'), 2000);
      return;
    }

    if (currentUser.authLevel < 1) {
      setToastMessage('غير مصرح لك. في انتظار موافقة الإدارة لفتح محاضرات سنة أولى.');
      return;
    }

    // Access allowed (authLevel >= 1)
    setToastMessage('جاري فتح محاضرات سنة أولى...');
  };

  const handleYear2Click = () => {
    if (!currentUser) {
      setToastMessage('يرجى تسجيل الدخول أولاً للوصول إلى المحاضرات.');
      setTimeout(() => setActiveTab('login'), 2000);
      return;
    }

    if (currentUser.authLevel < 2) {
      setToastMessage('غير مصرح لك. محتوى سنة تانية متاح فقط للمستوى الثاني.');
      return;
    }

    // Access allowed (authLevel >= 2)
    // Replace with actual logic to show Year 2 courses
    setToastMessage('جاري فتح محاضرات سنة تانية...');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] p-6 relative">
      
      {/* Toast Message */}
      {toastMessage && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in text-center max-w-sm w-full border border-stone-700">
          <AlertCircle size={20} className="text-gold-500 shrink-0" />
          <span className="font-semibold text-sm leading-tight">{toastMessage}</span>
        </div>
      )}

      <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-gold-400 to-amber-500 bg-clip-text text-transparent mb-12">
        المحاضرات
      </h2>
      
      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-3xl justify-center">
        {/* سنه اولي */}
        <button 
          onClick={handleYear1Click}
          className={`flex-1 group relative flex flex-col items-center justify-center gap-4 px-8 py-12 rounded-3xl border-2 transition-all duration-300 overflow-hidden backdrop-blur-sm shadow-lg hover:-translate-y-2 ${
            (!currentUser || currentUser.authLevel < 1) 
              ? 'border-stone-400 text-stone-500 bg-stone-100/50 dark:bg-deep-900/50 cursor-not-allowed opacity-80 hover:shadow-none hover:translate-y-0' 
              : 'border-amber-500 text-amber-600 hover:bg-gradient-to-br hover:from-amber-500 hover:to-gold-600 hover:text-white hover:border-transparent hover:shadow-2xl'
          }`}
        >
          {(!currentUser || currentUser.authLevel < 1) && (
            <div className="absolute top-4 right-4 text-stone-400">
              <Lock size={24} />
            </div>
          )}
          <Video size={56} className="stroke-[1.5] mb-2" />
          <span className="text-2xl font-bold tracking-wide">سنة اولي</span>
        </button>

        {/* سنه تانيه*/}
        <button 
          onClick={handleYear2Click}
          className={`flex-1 group relative flex flex-col items-center justify-center gap-4 px-8 py-12 rounded-3xl border-2 transition-all duration-300 overflow-hidden backdrop-blur-sm shadow-lg hover:-translate-y-2 ${
            (!currentUser || currentUser.authLevel < 2) 
              ? 'border-stone-400 text-stone-500 bg-stone-100/50 dark:bg-deep-900/50 cursor-not-allowed opacity-80 hover:shadow-none hover:translate-y-0' 
              : 'border-amber-500 text-amber-600 hover:bg-gradient-to-br hover:from-amber-500 hover:to-gold-600 hover:text-white hover:border-transparent hover:shadow-2xl'
          }`}
        >
          {(!currentUser || currentUser.authLevel < 2) && (
            <div className="absolute top-4 right-4 text-stone-400">
              <Lock size={24} />
            </div>
          )}
          <BookOpen size={56} className="stroke-[1.5] mb-2" />
          <span className="text-2xl font-bold tracking-wide">سنة تانية</span>
        </button>
      </div>
    </div>
  );
}

export default Courses;
