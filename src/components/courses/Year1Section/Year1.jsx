import { ChevronRight, Book, BookOpen } from 'lucide-react';

function Year1({ setActiveTab }) {
  return (
    <div className="flex flex-col w-full min-h-[60vh] p-6 animate-fade-in relative">
      
      {/* Header Section */}
      <div className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => setActiveTab('courses')}
          className="p-2 rounded-xl bg-stone-200 dark:bg-deep-800 text-stone-700 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-deep-700 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-l from-gold-400 to-amber-500 bg-clip-text text-transparent">
          مقرر سنة أولى
        </h2>
      </div>

      {/* Content Area - Two Big Buttons */}
      <div className="max-w-4xl w-full mx-auto flex flex-col md:flex-row gap-6 justify-center">
        
        {/* العهد القديم */}
        <button 
          onClick={() => setActiveTab('year1_old')}
          className="flex-1 group relative flex flex-col items-center justify-center gap-4 px-8 py-16 rounded-3xl border-2 border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-deep-900/50 hover:bg-gradient-to-br hover:from-amber-500 hover:to-gold-600 hover:text-white hover:border-transparent shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden backdrop-blur-sm"
        >
          <Book size={64} className="stroke-[1.5] mb-2 text-amber-600 group-hover:text-white transition-colors" />
          <span className="text-3xl font-bold tracking-wide text-stone-800 dark:text-stone-100 group-hover:text-white transition-colors">العهد القديم</span>
        </button>

        {/* العهد الجديد */}
        <button 
          onClick={() => setActiveTab('year1_new')}
          className="flex-1 group relative flex flex-col items-center justify-center gap-4 px-8 py-16 rounded-3xl border-2 border-stone-200 dark:border-stone-800 bg-white/50 dark:bg-deep-900/50 hover:bg-gradient-to-br hover:from-amber-500 hover:to-gold-600 hover:text-white hover:border-transparent shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden backdrop-blur-sm"
        >
          <BookOpen size={64} className="stroke-[1.5] mb-2 text-amber-600 group-hover:text-white transition-colors" />
          <span className="text-3xl font-bold tracking-wide text-stone-800 dark:text-stone-100 group-hover:text-white transition-colors">العهد الجديد</span>
        </button>

      </div>
    </div>
  );
}

export default Year1;
