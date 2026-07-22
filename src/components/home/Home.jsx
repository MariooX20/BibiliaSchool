import {
  Sparkles,
  Copy,
  BookmarkCheck,
  Bookmark,
  ChevronLeft,
  Users,
} from "lucide-react";
import heroImg from "../../assets/homehome.jpeg";
import { useNavigate } from "react-router-dom";

const BIBLE_VERSES = [
  {
    text: "كُلُّ الْكِتَابِ هُوَ مُوحَى بِهِ مِنَ اللهِ، وَنَافِعٌ لِلتَّعْلِيمِ وَالتَّوْبِيخِ، لِلتَّقْوِيمِ وَالتَّأْدِيبِ الَّذِي فِي الْبِرِّ.",
    reference: "تيموثاوس الثانية ٣: ١٦",
    theme: "كلمة الله",
  },
  {
    text: "سِرَاجٌ لِرِجْلِي كَلاَمُكَ وَنُورٌ لِسَبِيلِي.",
    reference: "مزمور ١١٩: ١٠٥",
    theme: "إرشاد ونور",
  },
  {
    text: "لاَ يَبْرَحْ سِفْرُ هذِهِ الشَّرِيعَةِ مِنْ فَمِكَ، بَلْ تَلْهَجُ فِيهِ نَهَارًا وَلَيْلاً، لِتَحْرِصَ أَنْ تَعْمَلَ حَسَبَ كُلِّ مَا هُوَ مَكْتُوبٌ فِيهِ.",
    reference: "يشوع ١: ٨",
    theme: "التأمل والنمو",
  },
];

function Home({
  themeMode,
  currentCourse,
  currentLessonIndex,
  handleStartStudy,
  verseIndex,
  // setVerseIndex,
  // isPlayingVerseAudio,
  // setIsPlayingVerseAudio,
  isBookmarkedVerse,
  setIsBookmarkedVerse,
  handleCopyText,
}) {
  const navigate = useNavigate();
  const verse = BIBLE_VERSES[(verseIndex || 0) % BIBLE_VERSES.length];

  const renderVerseOfTheDay = () => (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 border transition-all duration-300 hover:shadow-xl ${
        themeMode === "dark"
          ? "bg-deep-900/60 border-deep-800 backdrop-blur-md"
          : themeMode === "sepia"
            ? "bg-[#efe9d0]/70 border-[#dfd5b4]"
            : "bg-white/90 border-stone-200"
      }`}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-gold-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gold-500/10 text-gold-600 border border-gold-500/20">
          <Sparkles size={14} className="text-gold-500" />
          <span>آية اليوم</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBookmarkedVerse(!isBookmarkedVerse)}
            className={`p-2.5 rounded-xl transition-all ${isBookmarkedVerse ? "text-gold-500 bg-gold-500/10" : "text-gray-400 hover:bg-black/5 hover:text-gray-600"}`}
          >
            {isBookmarkedVerse ? (
              <BookmarkCheck size={20} />
            ) : (
              <Bookmark size={20} />
            )}
          </button>
          <button
            onClick={() => handleCopyText(verse.text, verse.reference)}
            className="p-2.5 rounded-xl text-gray-400 hover:bg-black/5 hover:text-gray-600 transition-all"
            title="نسخ الآية"
          >
            <Copy size={20} />
          </button>
        </div>
      </div>

      <div className="relative z-10">
        <p
          className={`bible-verse-text text-2xl md:text-3xl font-bold leading-loose mb-8 ${
            themeMode === "dark" ? "text-gray-100" : "text-gray-800"
          }`}
        >
          "{verse.text}"
        </p>

        <div className="flex items-center justify-between mt-auto">
          <p className="text-base font-bold text-gold-600">{verse.reference}</p>
        </div>
      </div>
    </div>
  );



  const renderEnrollCTA = () => (
    <div className={`mt-16 relative overflow-hidden rounded-[2.5rem] p-10 md:p-16 border text-center transition-all duration-500 shadow-2xl ${
      themeMode === "dark" 
        ? "bg-gradient-to-br from-emerald-900/40 via-teal-900/40 to-deep-900 border-emerald-500/30" 
        : themeMode === "sepia"
          ? "bg-gradient-to-br from-[#d4c89f] via-[#e6dcb9] to-[#efe9d0] border-[#dfd5b4]"
          : "bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-emerald-100"
    }`}>
      <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -ml-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px] -mr-20 -mb-20 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto space-y-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center text-white shadow-xl rotate-12 hover:rotate-0 transition-transform duration-300">
          <Users size={40} />
        </div>
        <h2 className={`text-4xl md:text-5xl font-black ${themeMode === 'dark' ? 'text-white' : 'text-stone-900'}`}>
          التحق بمدرستنا الآن
        </h2>
        <p className={`text-lg md:text-xl leading-relaxed ${themeMode === 'dark' ? 'text-gray-300' : 'text-stone-600'}`}>
          سجل معنا اليوم لتبدأ رحلتك في دراسة الكتاب المقدس والتمتع بكافة المناهج والميزات التفاعلية المتاحة على المنصة.
        </p>
        <div className="pt-4">
          <button 
            onClick={() => navigate('/enroll')} 
            className="relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:-translate-y-1 group overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none"></span>
            <span className="relative flex items-center gap-3">
              <Sparkles size={24} className="animate-pulse" />
              املأ الاستمارة
            </span>
          </button>
        </div>
      </div>
    </div>
  );

  if (!currentCourse) {
    return (
      <div className="space-y-10 animate-fade-in text-right">
        {/* Hero Section */}
        <div
          className={`relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 shadow-2xl bg-contain md:bg-cover bg-center bg-no-repeat bg-[#0d1627] ${
            themeMode === "dark"
              ? "border-deep-700/50"
              : themeMode === "sepia"
                ? "border-[#dfd5b4]"
                : "border-stone-200"
          }`}
          style={{ backgroundImage: `url(${heroImg})` }}
        >
          {/* Subtle overlay to ensure text readability over the blue background */}
          <div className="absolute inset-0 bg-deep-950/40 pointer-events-none z-0"></div>

          <div className="grid lg:grid-cols-12 gap-8 items-center p-8 lg:p-16 relative z-10 min-h-[500px]">
            <div className="lg:col-span-7 space-y-8 text-right animate-slide-up relative z-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-white/10 text-white border border-white/20 backdrop-blur-md">
                <Sparkles size={16} className="animate-pulse text-gold-400" />
                <span> Biblia School</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.2] drop-shadow-lg">
                <span className="text-white">
                  فهمني{" "}
                </span>{" "}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-gold-300 via-gold-400 to-amber-500 drop-shadow-md">
                  فأتعلم وصاياك
                </span>
                <span className="block text-xl md:text-2xl lg:text-3xl font-normal text-white/90 mt-6">
                  (مزمور 119: 73)
                </span>
              </h2>

              <p className="text-lg md:text-xl max-w-xl leading-relaxed text-white/90 drop-shadow-md">
                مدرسة الكتاب المقدس لسن اعدادي , هي مدرسة تهدف الي تعلم الكتاب
                المقدس بطرق مختلفة
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => navigate("/courses")}
                  className="px-8 py-4.5 rounded-2xl font-bold bg-gradient-to-l from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 text-lg group border border-gold-400/30"
                >
                  استكشف المناهج
                  <ChevronLeft
                    size={22}
                    className="group-hover:-translate-x-1.5 transition-transform"
                  />
                </button>
              </div>
            </div>
            
            {/* Empty column to keep the text on the right and let the left side of the wallpaper show */}
            <div className="lg:col-span-5 hidden lg:block"></div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto">
          {renderVerseOfTheDay()}
        </div>


        {renderEnrollCTA()}
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in text-right">
      {/* Hero Section */}
      <div
        className={`relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 shadow-2xl ${
          themeMode === "dark"
            ? "bg-gradient-to-br from-deep-900 via-deep-900 to-deep-950 border-deep-700/50"
            : themeMode === "sepia"
              ? "bg-gradient-to-br from-[#efe9d0] via-[#e6dcb9] to-[#d4c89f] border-[#dfd5b4]"
              : "bg-gradient-to-br from-white via-stone-50 to-stone-100 border-stone-200"
        }`}
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/15 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>

        <div className="grid lg:grid-cols-12 gap-8 items-center p-8 lg:p-16 relative z-10">
          <div className="lg:col-span-7 space-y-8 text-right animate-slide-up relative z-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gold-500/10 text-gold-600 border border-gold-500/30 backdrop-blur-md">
              <Sparkles size={14} className="animate-pulse" />
              <span>منصة التعليم الروحي المفتوحة</span>
            </div>

            <h2
              className={`text-4xl md:text-5xl lg:text-6xl font-black leading-tight drop-shadow-sm ${themeMode === "dark" ? "text-white" : "text-stone-900"}`}
            >
              اكتشف عمق كلمة الله <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-gold-400 via-gold-500 to-amber-600 block mt-2">
                من أي مكان وفي أي وقت
              </span>
            </h2>

            <p
              className={`text-base md:text-xl max-w-2xl leading-relaxed ${themeMode === "dark" ? "text-gray-300" : "text-stone-600"}`}
            >
              مرحباً بك في مدرسة الكتاب المقدس الإلكترونية. مناهج وتفسيرات
              دراسية مجانية، مدعومة بمواد صوتية وخرائط ووسائل تقييم ذاتي.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-4.5 rounded-2xl font-bold bg-gradient-to-l from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 hover:-translate-y-1 active:translate-y-0 transition-all text-lg"
              >
                استعراض المناهج
              </button>
              <button
                onClick={() =>
                  handleStartStudy(currentCourse, currentLessonIndex)
                }
                className={`px-8 py-4.5 rounded-2xl font-bold border-2 flex items-center gap-3 hover:-translate-y-1 active:translate-y-0 transition-all group text-lg ${
                  themeMode === "dark"
                    ? "border-deep-700 hover:bg-deep-800 text-gray-200"
                    : "border-stone-300 hover:bg-black/5 text-stone-800"
                }`}
              >
                <span>متابعة الدرس الحالي</span>
                <ChevronLeft
                  size={20}
                  className="group-hover:-translate-x-1.5 transition-transform"
                />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 flex justify-center relative mt-10 lg:mt-0 z-10">
            <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/20 to-transparent blur-3xl rounded-full animate-pulse pointer-events-none"></div>
            <img
              src={heroImg}
              alt="مدرسة الكتاب المقدس"
              className="w-full max-w-[280px] sm:max-w-[300px] lg:max-w-[420px] drop-shadow-[0_20px_40px_rgba(238,176,37,0.3)] relative z-10 object-contain hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {renderVerseOfTheDay()}
      </div>

      {renderEnrollCTA()}
    </div>
  );
}

export default Home;
