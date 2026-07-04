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
  ChevronLeft,
  BookOpen,
  Map,
  Users,
} from "lucide-react";
import heroImg from "../../assets/bible_hero.png";

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
  setActiveTab,
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

  const renderFeatures = () => (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      {[
        {
          title: "مناهج موثوقة",
          desc: "محتوى دراسي معد بعناية لتأسيس مسيحي متين",
          icon: BookOpen,
          color: "text-blue-500",
          bg: "bg-blue-500/10",
        },
        {
          title: "دراسة مرنة",
          desc: "تعلم بالسرعة التي تناسبك وفي أي وقت ومكان",
          icon: Clock,
          color: "text-gold-500",
          bg: "bg-gold-500/10",
        },
        {
          title: "شهادات إتمام",
          desc: "احصل على شهادة عند إتمام كل مستوى دراسي",
          icon: Award,
          color: "text-emerald-500",
          bg: "bg-emerald-500/10",
        },
      ].map((feature, idx) => (
        <div
          key={idx}
          className={`p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
            themeMode === "dark"
              ? "bg-deep-900/50 border-deep-800 hover:bg-deep-800/80"
              : themeMode === "sepia"
                ? "bg-[#efe9d0]/70 border-[#dfd5b4]"
                : "bg-white/80 border-stone-200 hover:border-stone-300"
          }`}
        >
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color}`}
          >
            <feature.icon size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
          <p className="text-sm opacity-70 leading-relaxed">{feature.desc}</p>
        </div>
      ))}
    </div>
  );

  if (!currentCourse) {
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
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-500/20 rounded-full blur-[80px] -mr-40 -mt-40 pointer-events-none"></div>

          <div className="grid lg:grid-cols-12 gap-8 items-center p-8 lg:p-16 relative z-10">
            <div className="lg:col-span-7 space-y-8 text-right animate-slide-up relative z-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gold-500/10 text-gold-600 border border-gold-500/30 backdrop-blur-md">
                <Sparkles size={16} className="animate-pulse" />
                <span> Bibilia School</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.2]">
                <span
                  className={
                    themeMode === "dark" ? "text-white" : "text-stone-900"
                  }
                >
                  فهمني{" "}
                </span>{" "}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-gold-400 via-gold-500 to-amber-600">
                  فأتعلم وصاياك
                </span>
                <span className="block text-xl md:text-2xl lg:text-3xl font-normal opacity-70 mt-6">
                  (مزمور 119: 73)
                </span>
              </h2>

              <p
                className={`text-lg md:text-xl max-w-xl leading-relaxed ${themeMode === "dark" ? "text-gray-300" : "text-stone-600"}`}
              >
                مدرسة الكتاب المقدس لسن اعدادي , هي مدرسة تهدف الي تعلم الكتاب
                المقدس بطرق مختلفة
              </p>

              <div className="pt-4 flex flex-wrap gap-4">
                <button
                  onClick={() => setActiveTab("courses")}
                  className="px-8 py-4.5 rounded-2xl font-bold bg-gradient-to-l from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 text-lg group"
                >
                  استكشف المناهج
                  <ChevronLeft
                    size={22}
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
                className="w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[450px] drop-shadow-[0_20px_40px_rgba(238,176,37,0.3)] relative z-10 object-contain hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {renderVerseOfTheDay()}
          <div
            className={`rounded-3xl p-10 border flex flex-col justify-center items-center text-center transition-all ${
              themeMode === "dark"
                ? "bg-deep-900/50 border-deep-800"
                : themeMode === "sepia"
                  ? "bg-[#efe9d0]/70 border-[#dfd5b4]"
                  : "bg-white/80 border-stone-200"
            }`}
          >
            <div className="w-20 h-20 rounded-full bg-deep-500/10 text-deep-500 flex items-center justify-center mb-6">
              <Map size={40} />
            </div>
            <h3 className="text-3xl font-bold mb-4">ابدأ رحلتك الآن</h3>
            <p className="text-base opacity-70 mb-8 max-w-md leading-relaxed">
              لا توجد مناهج قيد الدراسة حالياً. تصفح مكتبة المناهج لاختيار مسار
              دراسي يناسبك والبدء في التعلم.
            </p>
            <button
              onClick={() => setActiveTab("courses")}
              className="px-8 py-3.5 rounded-xl font-bold border-2 border-gold-500 text-gold-600 hover:bg-gold-500 hover:text-white transition-all text-lg hover:-translate-y-0.5"
            >
              عرض المكتبة
            </button>
          </div>
        </div>

        {renderFeatures()}
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
                onClick={() => setActiveTab("courses")}
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

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">{renderVerseOfTheDay()}</div>

        {/* Quick Progress Card */}
        <div
          className={`p-8 rounded-3xl border flex flex-col justify-center transition-all hover:shadow-xl ${
            themeMode === "dark"
              ? "bg-deep-900/50 border-deep-800"
              : themeMode === "sepia"
                ? "bg-[#efe9d0]/70 border-[#dfd5b4]"
                : "bg-white/80 border-stone-200"
          }`}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-xl">المنهج الحالي</h3>
            <span className="p-3 rounded-2xl bg-gold-500/10 text-gold-600">
              <BookOpenCheck size={24} />
            </span>
          </div>
          <p className="text-2xl font-black mb-2 truncate">
            {currentCourse.title}
          </p>
          <p className="text-base opacity-70 mb-8">
            {currentCourse.lessons?.filter((l) => l.completed).length || 0} من{" "}
            {currentCourse.lessons?.length || 0} دروس مكتملة
          </p>

          <div className="space-y-3 mt-auto">
            <div className="flex justify-between text-base font-bold">
              <span>نسبة التقدم</span>
              <span className="text-gold-600">
                {currentCourse.progress || 0}%
              </span>
            </div>
            <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-l from-gold-400 to-amber-600 rounded-full transition-all duration-1000 ease-out relative"
                style={{ width: `${currentCourse.progress || 0}%` }}
              >
                <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            label: "المنهج الفعال",
            value:
              currentCourse.title.split(" ")[0] +
              " " +
              (currentCourse.title.split(" ")[1] || ""),
            icon: BookOpenCheck,
            color: "text-teal-500",
            bg: "bg-teal-500/10",
          },
          {
            label: "نسبة تقدم الدراسة",
            value: `${currentCourse.progress || 0}%`,
            icon: Award,
            color: "text-gold-500",
            bg: "bg-gold-500/10",
          },
          {
            label: "الدروس المكتملة",
            value: `${currentCourse.lessons?.filter((l) => l.completed).length || 0}`,
            icon: Check,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
          },
          {
            label: "وقت القراءة اليومي",
            value: "٢٥ دقيقة",
            icon: Clock,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-6 md:p-8 rounded-3xl border text-right transition-all hover:-translate-y-1 hover:shadow-lg group ${
              themeMode === "dark"
                ? "bg-deep-900/50 border-deep-800"
                : themeMode === "sepia"
                  ? "bg-[#efe9d0]/70 border-[#dfd5b4]"
                  : "bg-white/80 border-stone-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <span
                className={`p-4 rounded-2xl transition-colors ${stat.bg} ${stat.color} group-hover:bg-opacity-20`}
              >
                <stat.icon size={28} />
              </span>
            </div>
            <p className="text-sm md:text-base opacity-70 font-medium mb-2">
              {stat.label}
            </p>
            <p className="text-2xl md:text-3xl font-black truncate leading-tight">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
