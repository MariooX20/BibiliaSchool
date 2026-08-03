import { ChevronRight, PlayCircle, BookOpen, Clock, FileQuestion } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Each lesson has its own Drive URL.
// Set driveUrl to null for lessons not yet published.
const lessons = [
  {
    id: 1,
    title: "مقدمة في العهد الجديد",
    duration: "40 دقيقة",
    type: "فيديو",
    driveUrl: null,
  },
  {
    id: 2,
    title: "إنجيل متى - الجزء الأول",
    duration: "55 دقيقة",
    type: "فيديو",
    driveUrl: null,
  },
  {
    id: 3,
    title: "اختبار على إنجيل متى",
    duration: "20 دقيقة",
    type: "امتحان",
    driveUrl: null,
  },
];

function Year1NewTestament() {
  const navigate = useNavigate();

  const handleLessonClick = (lesson) => {
    if (lesson.driveUrl) {
      window.open(lesson.driveUrl, "_blank", "noopener,noreferrer");
    }
  };

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
          العهد الجديد
        </h2>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl w-full mx-auto">

        {/* Info Banner */}
        <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-200 p-4 rounded-xl mb-8 flex gap-3 shadow-sm">
          <BookOpen size={24} className="shrink-0" />
          <p className="font-semibold text-sm">
            أهلاً بك في مقرر العهد الجديد لسنة أولى.
          </p>
        </div>

        {/* Lessons List */}
        <div className="flex flex-col gap-4">
          {lessons.map((lesson) => {
            const isAvailable = Boolean(lesson.driveUrl);
            return (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                className={`flex items-center justify-between p-5 rounded-2xl border border-stone-200 dark:border-stone-800 backdrop-blur-sm transition-all group ${
                  isAvailable
                    ? 'bg-white/50 dark:bg-deep-900/50 hover:shadow-md cursor-pointer'
                    : 'bg-stone-50/50 dark:bg-deep-900/30 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${
                    isAvailable
                      ? 'bg-gold-100 dark:bg-gold-900/40 text-gold-600 dark:text-gold-400 group-hover:scale-110'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-400'
                  }`}>
                    {lesson.type === "امتحان"
                      ? <FileQuestion size={24} />
                      : <PlayCircle size={24} />
                    }
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-stone-800 dark:text-stone-100">
                      {lesson.title}
                    </h3>
                    <div className="flex items-center gap-3 text-stone-500 dark:text-stone-400 text-sm mt-1">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {lesson.duration}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        lesson.type === "امتحان"
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                          : 'bg-gold-100 dark:bg-gold-900/40 text-gold-700 dark:text-gold-400'
                      }`}>
                        {lesson.type}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  disabled={!isAvailable}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    isAvailable
                      ? 'bg-stone-100 dark:bg-deep-800 text-stone-600 dark:text-stone-300 group-hover:bg-gold-500 group-hover:text-white'
                      : 'bg-stone-100 dark:bg-deep-800 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  {isAvailable ? 'ابدأ' : 'قريباً'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Year1NewTestament;
