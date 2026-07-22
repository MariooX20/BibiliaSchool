import { ChevronRight, PlayCircle, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Year1OldTestament() {
  const navigate = useNavigate();
  // Placeholder data for lessons
  const lessons = [
    { id: 1, title: "الخليقة", duration: "45 دقيقة", type: "فيديو" },
    { id: 2, title: "سفر التكوين - الجزء الأول", duration: "50 دقيقة", type: "فيديو" },
    { id: 3, title: "اختبار على سفر التكوين", duration: "15 دقيقة", type: "امتحان" },
    { id: 4, title: "سفر القضاة", duration: "55 دقيقة", type: "فيديو" },
  ];


  return (
    <div className="flex flex-col w-full min-h-[60vh] p-6 animate-fade-in relative">
      
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => navigate('/year1')}
          className="p-2 rounded-xl bg-stone-200 dark:bg-deep-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-deep-700 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-gold-400 to-amber-500 bg-clip-text text-transparent">
          العهد القديم
        </h2>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl w-full mx-auto">
        
        {/* Placeholder Alert */}
        <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 p-4 rounded-xl mb-8 flex gap-3 shadow-sm">
          <BookOpen size={24} className="shrink-0" />
          <p className="font-semibold text-sm">
            أهلاً بك في مقرر العهد القديم لسنة أولى.
          </p>
        </div>

        {/* Lessons List */}
        <div className="flex flex-col gap-4">
          {lessons.map((lesson) => (
            <div 
              key={lesson.id} 
              className="flex items-center justify-between p-5 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-deep-900/50 backdrop-blur-sm hover:shadow-md transition-shadow group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gold-100 dark:bg-gold-900/40 flex items-center justify-center text-gold-600 dark:text-gold-400 group-hover:scale-110 transition-transform">
                  <PlayCircle size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100">{lesson.title}</h3>
                  <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 text-sm mt-1">
                    <Clock size={14} />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              </div>
              
              <button className="px-4 py-2 rounded-lg bg-stone-100 dark:bg-deep-800 text-stone-600 dark:text-stone-300 font-semibold group-hover:bg-gold-500 group-hover:text-white transition-colors" onClick={()=> window.open("https://drive.google.com/file/d/1vmExbD4anpvzePIywRj_aycceXYD2qNh/view?usp=sharing","_blank")}>
                ابدأ
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Year1OldTestament;
