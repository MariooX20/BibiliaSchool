import {
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import heroBg from "../../assets/1.webp";
import heroLogo from "../../assets/2.webp";
import bannerBg from "../../assets/banner.webp";
import peopleImg from "../../assets/people.webp";
import { useNavigate } from "react-router-dom";

const BIBLE_VERSES = [
  {
    text: "كُلُّ الْكِتَابِ هُوَ مُوحَى بِهِ مِنَ اللهِ، وَنَافِعٌ لِلتَّعْلِيمِ وَالتَّوْبِيخِ، لِتَقْوِيمِ وَالتَّأْدِيبِ الَّذِي فِي الْبِرِّ.",
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

function Home({ themeMode }) {
  const navigate = useNavigate();
  const verse = BIBLE_VERSES[0];

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

  return (
    <div className="space-y-10 animate-fade-in text-right pb-12">
      {/* Hero Section */}
      <div
        className={`relative overflow-hidden rounded-[2.5rem] border transition-all duration-500 shadow-2xl bg-cover [background-position:15%_center] lg:bg-center bg-no-repeat bg-[#0d1627] ${
          themeMode === "dark"
            ? "border-deep-700/50"
            : themeMode === "sepia"
              ? "border-[#dfd5b4]"
              : "border-stone-200"
        }`}
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        {/* Subtle overlay for text contrast */}
        <div className="absolute inset-0 bg-deep-950/40 pointer-events-none z-0"></div>

        <div className="grid lg:grid-cols-12 gap-8 items-center p-8 lg:p-16 relative z-10 min-h-[480px]">
          <div className="lg:col-span-7 space-y-6 text-right animate-slide-up relative z-20">
    

            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.2] drop-shadow-lg">
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
            </h1>

            <p className="text-lg md:text-xl max-w-xl leading-relaxed text-white/90 drop-shadow-md">
              مدرسة الكتاب المقدس لسن اعدادي، المدرسة تابعة لكنيسة العذراء العمرانية و اتاسست سنة ٢٠٢٥ 
            </p>

            {/* Mobile Logo: positioned below the text and above the button */}
            <div className="lg:hidden flex justify-center pt-4 pb-2">
              <img
                src={heroLogo}
                alt="Biblia School Logo"
                loading="eager"
                fetchPriority="high"
                decoding="async"
                className="w-full max-w-[230px] sm:max-w-[290px] object-contain drop-shadow-2xl translate-y-2"
              />
            </div>

            {/* Button */}
            <div className="pt-2 flex flex-wrap gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/courses")}
                className="px-8 py-4 rounded-2xl font-bold bg-gradient-to-l from-gold-500 to-gold-600 text-white shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-3 text-lg group border border-gold-400/30"
              >
                استكشف المناهج
                <ChevronLeft
                  size={22}
                  className="group-hover:-translate-x-1.5 transition-transform"
                />
              </button>
            </div>
          </div>

          {/* Desktop Logo Column */}
          <div className="hidden lg:flex lg:col-span-5 justify-center items-center relative z-20">
            <img
              src={heroLogo}
              alt="Biblia School Logo"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full max-w-[260px] sm:max-w-[320px] lg:max-w-[380px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {renderVerseOfTheDay()}
      </div>

      {/* Enroll CTA Banner */}
      <div
        className="mt-16 relative overflow-hidden rounded-[2.5rem] shadow-2xl bg-cover bg-center bg-no-repeat border-0"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        {/* Subtle overlay for contrast */}
        <div className="absolute inset-0 bg-deep-950/20 pointer-events-none z-0"></div>

        <div className="grid lg:grid-cols-12 gap-8 items-center p-6 md:p-10 lg:p-12 relative z-10 min-h-[380px] lg:min-h-[460px]">
          {/* Text Content (Right side in RTL, Centered on Mobile) */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-right order-1 lg:order-1 self-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white drop-shadow-lg leading-tight">
جاهز تبدأ رحلتك معانا ؟            </h2>
            <p className="text-sm sm:text-base md:text-lg leading-relaxed text-white/90 drop-shadow-md max-w-xl mx-auto lg:mx-0">
             سجل الأن وكن جزءأ من عائلتنا
            </p>
            <div className="pt-2 flex justify-center lg:justify-start">
              <button
                onClick={() => navigate("/enroll")}
                className="relative inline-flex items-center justify-center px-7 py-3.5 sm:px-8 sm:py-4 text-base sm:text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:-translate-y-1 active:translate-y-0 group overflow-hidden border border-emerald-400/30"
              >
                <span className="relative flex items-center gap-2.5">
                  <Sparkles size={20} className="animate-pulse" />
                  املأ الاستمارة
                </span>
              </button>
            </div>
          </div>

          {/* People Image (Extra Large & Shifted Far Left) */}
          <div className="lg:col-span-6 flex justify-start order-2 lg:order-2 pt-0 lg:pt-0">
            <img
              src={peopleImg}
              alt="Students"
              loading="lazy"
              decoding="async"
              className="w-full max-w-[360px] sm:max-w-[460px] md:max-w-[560px] lg:max-w-[850px] xl:max-w-[980px] object-contain drop-shadow-2xl mx-0 -ml-6 sm:-ml-12 lg:-ml-52 xl:-ml-72 -translate-x-16 sm:-translate-x-24 md:-translate-x-36 lg:-translate-x-56 xl:-translate-x-72 mb-0 lg:-mb-16 scale-[1.35] sm:scale-[1.5] lg:scale-[1.8] xl:scale-[2] origin-bottom-left translate-y-8 sm:translate-y-10 md:translate-y-14 lg:translate-y-18 xl:translate-y-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
