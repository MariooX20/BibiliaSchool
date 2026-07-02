import { 
  BookOpenCheck, 
  Award, 
  Check, 
  Clock, 
  Sparkles, 
  Pause, 
  Play, 
  Copy, 
  BookmarkCheck, 
  Bookmark, 
  ChevronLeft 
} from 'lucide-react'
import heroImg from '../../assets/bible_hero.png'

const BIBLE_VERSES = [
  {
    text: 'كُلُّ الْكِتَابِ هُوَ مُوحَى بِهِ مِنَ اللهِ، وَنَافِعٌ لِلتَّعْلِيمِ وَالتَّوْبِيخِ، لِلتَّقْوِيمِ وَالتَّأْدِيبِ الَّذِي فِي الْبِرِّ.',
    reference: 'تيموثاوس الثانية ٣: ١٦',
    theme: 'كلمة الله'
  },
  {
    text: 'سِرَاجٌ لِرِجْلِي كَلاَمُكَ وَنُورٌ لِسَبِيلِي.',
    reference: 'مزمور ١١٩: ١٠٥',
    theme: 'إرشاد ونور'
  },
  {
    text: 'لاَ يَبْرَحْ سِفْرُ هذِهِ الشَّرِيعَةِ مِنْ فَمِكَ، بَلْ تَلْهَجُ فِيهِ نَهَارًا وَلَيْلاً، لِتَحْرِصَ أَنْ تَعْمَلَ حَسَبَ كُلِّ مَا هُوَ مَكْتُوبٌ فِيهِ.',
    reference: 'يشوع ١: ٨',
    theme: 'التأمل والنمو'
  }
];

function Home({
  themeMode,
  setActiveTab,
  currentCourse,
  currentLessonIndex,
  handleStartStudy,
  verseIndex,
  setVerseIndex,
  isPlayingVerseAudio,
  setIsPlayingVerseAudio,
  isBookmarkedVerse,
  setIsBookmarkedVerse,
  handleCopyText
}) {
  if (!currentCourse) {
    return (
      <div className="space-y-10 animate-fade-in text-right">
        {/* Hero Section */}
        <div className={`relative overflow-hidden rounded-3xl border transition-all ${
          themeMode === 'dark' ? 'bg-gradient-to-r from-deep-900 to-deep-950 border-deep-800' :
          themeMode === 'sepia' ? 'bg-gradient-to-r from-[#efe9d0] to-[#e6dcb9] border-[#dfd5b4]' : 'bg-gradient-to-r from-white to-stone-100 border-stone-200'
        }`}>
          <div className="grid md:grid-cols-12 gap-6 items-center p-6 md:p-10 relative z-10">
            <div className="md:col-span-7 space-y-5 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gold-500/10 text-gold-500 border border-gold-500/20">
                <Sparkles size={12} />
                <span>منصة التعليم الروحي المفتوحة</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                دراسة تفاعلية <br /> <span className="text-transparent bg-clip-text bg-gradient-to-l from-gold-400 to-amber-500">لكلمة الله الحية</span>
              </h2>
              <p className="text-sm md:text-base opacity-75 leading-relaxed max-w-md">
                مرحباً بك. حالياً لا توجد مسارات دراسية أو مناهج متاحة. يرجى الانتظار لحين إضافة المناهج، أو تحقق من قسم الإعدادات.
              </p>
            </div>
            <div className="md:col-span-5 flex justify-center">
              <img
                src={heroImg}
                alt="مدرسة الكتاب المقدس"
                className="w-full max-w-[280px] md:max-w-[340px] drop-shadow-[0_15px_30px_rgba(238,176,37,0.25)] relative z-10 object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in text-right">
      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-3xl border transition-all ${
        themeMode === 'dark' ? 'bg-gradient-to-r from-deep-900 to-deep-950 border-deep-800' :
        themeMode === 'sepia' ? 'bg-gradient-to-r from-[#efe9d0] to-[#e6dcb9] border-[#dfd5b4]' : 'bg-gradient-to-r from-white to-stone-100 border-stone-200'
      }`}>
        <div className="grid md:grid-cols-12 gap-6 items-center p-6 md:p-10 relative z-10">
          <div className="md:col-span-7 space-y-5 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-gold-500/10 text-gold-500 border border-gold-500/20">
              <Sparkles size={12} />
              <span>منصة التعليم الروحي المفتوحة</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight text-white drop-shadow-sm">
              اكتشف عمق كلمة الله <br />
              <span className="text-gold-500">من أي مكان وفي أي وقت</span>
            </h2>
            <p className="text-sm md:text-base opacity-80 max-w-xl leading-relaxed">
              مرحباً بك في مدرسة الكتاب المقدس الإلكترونية. هنا نوفر لك مناهج وتفسيرات دراسية مجانية، مدعومة بمواد صوتية وخرائط ووسائل تقييم ذاتي لمساعدتك في بناء رحلتك الإيمانية والمعرفية.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveTab('courses')}
                className="px-6 py-3.5 rounded-xl font-bold bg-gradient-to-l from-gold-600 to-amber-500 text-deep-950 shadow-lg hover:brightness-110 active:scale-95 transition-all"
              >
                استعراض المناهج الدراسية
              </button>
              <button
                onClick={() => handleStartStudy(currentCourse, currentLessonIndex)}
                className={`px-6 py-3.5 rounded-xl font-semibold border flex items-center gap-2 transition-all ${
                  themeMode === 'dark' ? 'border-deep-700 hover:bg-deep-900 text-gray-200' : 'border-stone-300 hover:bg-black/5 text-stone-800'
                }`}
              >
                <span>متابعة الدرس الحالي</span>
                <ChevronLeft size={16} />
              </button>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center relative mt-6 md:mt-0">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 to-transparent blur-3xl rounded-full"></div>
            <img
              src={heroImg}
              alt="مدرسة الكتاب المقدس"
              className="w-full max-w-[280px] md:max-w-[340px] drop-shadow-[0_15px_30px_rgba(238,176,37,0.25)] relative z-10 object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'المنهج الفعال', value: currentCourse.title.split(' ')[0] + ' ' + currentCourse.title.split(' ')[1], icon: BookOpenCheck, color: 'text-teal-400 bg-teal-500/10' },
          { label: 'نسبة تقدم الدراسة', value: `${currentCourse.progress}%`, icon: Award, color: 'text-gold-500 bg-gold-500/10' },
          { label: 'الدروس المكتملة', value: `${currentCourse.lessons.filter(l => l.completed).length} من ${currentCourse.lessons.length}`, icon: Check, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'وقت القراءة اليومي', value: '٢٥ دقيقة', icon: Clock, color: 'text-amber-500 bg-amber-500/10' }
        ].map((stat, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border text-right transition-all ${
            themeMode === 'dark' ? 'bg-deep-900 border-deep-800' :
            themeMode === 'sepia' ? 'bg-[#efe9d0] border-[#dfd5b4]' : 'bg-white border-stone-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 rounded-xl ${stat.color}`}>
                <stat.icon size={20} />
              </span>
            </div>
            <p className="text-xs opacity-60 font-medium mb-1">{stat.label}</p>
            <p className="text-[17px] font-bold truncate leading-tight">{stat.value}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;
