import { useState, useEffect, useRef } from 'react'
import { 
  BookOpen, 
  Play, 
  Pause, 
  Volume2, 
  Copy, 
  Share2, 
  Check, 
  Bookmark, 
  BookmarkCheck,
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Clock, 
  Sliders, 
  Moon, 
  Sun, 
  BookOpenCheck,
  Sparkles,
  Info,
  Menu,
  X,
  Compass
} from 'lucide-react'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Home from './components/home/Home'
import Courses from './components/courses/Courses'
import Year1 from './components/courses/Year1Section/Year1'
import Year1OldTestament from './components/courses/Year1Section/3ahdAdem'
import Year1NewTestament from './components/courses/Year1Section/3ahdGded'
import Year2 from './components/courses/Year2'
import Lesson from './components/lesson/Lesson'
import Settings from './components/settings/Settings'
import Login from './components/auth/Login'
import { supabase } from './lib/supabase'

// Initial Mock Database
const INITIAL_COURSES = [];

const toArabicNumerals = (num) => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().replace(/\d/g, (d) => arabicDigits[d]);
};

const BIBLE_BOOKS = {
  genesis: {
    name: 'سفر التكوين',
    chapters: [
      {
        number: 1,
        verses: [
          { num: 1, text: 'فِي الْبَدْءِ خَلَقَ اللهُ السَّمَاوَاتِ وَالأَرْضَ.' },
          { num: 2, text: 'وَكَانَتِ الأَرْضُ خَرَاباً وَخَالِيَةً، وَعَلَى وَجْهِ الْغَمْرِ ظُلْمَةٌ، وَرُوحُ اللهِ يَرِفُّ عَلَى وَجْهِ الْمِيَاهِ.' },
          { num: 3, text: 'وَقَالَ اللهُ: «لِيَكُنْ نُورٌ»، فَكَانَ نُورٌ.' },
          { num: 4, text: 'وَرَأَى اللهُ النُورَ أَنَّهُ حَسَنٌ. وَفَصَلَ اللهُ بَيْنَ النُورِ وَالظُّلْمَةِ.' },
          { num: 5, text: 'وَدَعَا اللهُ النُورَ نَهَاراً، وَالظُّلْمَةُ دَعَاهَا لَيْلاً. وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْماً وَاحِداً.' },
          { num: 6, text: 'وَقَالَ اللهُ: «لِيَكُنْ جَلَدٌ فِي وَسَطِ الْمِيَاهِ. وَلْيَكُنْ فَاصِلاً بَيْنَ مِيَاهٍ وَمِيَاهٍ».' },
          { num: 7, text: 'فَعَمِلَ اللهُ الْجَلَدَ، وَفَصَلَ بَيْنَ الْمِيَاهِ الَّتِي تَحْتَ الْجَلَدِ وَالْمِيَاهِ الَّتِي فَوْقَ الْجَلَدِ. وَكَانَ كَذلِكَ.' },
          { num: 8, text: 'وَدَعَا اللهُ الْجَلَدَ سَمَاءً. وَكَانَ مَسَاءٌ وَكَانَ صَبَاحٌ يَوْماً ثَانِيًا.' },
          { num: 9, text: 'وَقَالَ اللهُ: «لِتَجْتَمِعِ الْمِيَاهُ تَحْتَ السَّمَاءِ إِلَى مَكَانٍ وَاحِدٍ، وَلْتَظْهَرِ الْيَابِسَةُ». وَكَانَ كَذلِكَ.' },
          { num: 10, text: 'وَدَعَا اللهُ الْيَابِسَةَ أَرْضاً، وَمُجْتَمَعَ الْمِيَاهِ دَعَاهُ بِحَاراً. وَرأَى اللهُ ذلِكَ أَنَّهُ حَسَنٌ.' }
        ]
      }
    ]
  },
  john: {
    name: 'إنجيل يوحنا',
    chapters: [
      {
        number: 1,
        verses: [
          { num: 1, text: 'فِي الْبَدْءِ كَانَ الْكَلِمَةُ، وَالْكَلِمَةُ كَانَ عِنْدَ اللهِ، وَكَانَ الْكَلِمَةُ اللهَ.' },
          { num: 2, text: 'هذَا كَانَ فِي الْبَدْءِ عِنْدَ اللهِ.' },
          { num: 3, text: 'كُلُّ شَيْءٍ بِهِ كَانَ، وَبِغَيْرِهِ لَمْ يَكُنْ شَيْءٌ مِمَّا كَانَ.' },
          { num: 4, text: 'فِيهِ كَانَتِ الْحَيَاةُ، وَالْحَيَاةُ كَانَتْ نُورَ النَّاسِ،' },
          { num: 5, text: 'وَالنُّورُ يُضِيءُ فِي الظُّلْمَةِ، وَالظُّلْمَةُ لَمْ تُدْرِكْهُ.' },
          { num: 6, text: 'كَانَ إِنْسَانٌ مُرْسَلٌ مِنَ اللهِ اسْمُهُ يُوحَنَّا.' },
          { num: 7, text: 'هذَا جَاءَ لِلشَّهَادَةِ لِيَشْهَدَ لِلنُّورِ، لِكَيْ يُؤْمِنَ الْكُلُّ بِه.' },
          { num: 8, text: 'لَمْ يَكُنْ هُوَ النُّورَ، بَلْ لِيَشْهَدَ لِلنُّورِ.' },
          { num: 9, text: 'كَانَ النُّورُ الْحَقِيقِيُّ الَّذِي يُنِيرُ كُلَّ إِنْسَانٍ آتِيًا إِلَى الْعَالَمِ.' },
          { num: 10, text: 'كَانَ فِي الْعَالَمِ، وَكُوِّنَ الْعَالَمُ بِهِ، وَلَمْ يَعْرِفْهُ الْعَالَمُ.' }
        ]
      }
    ]
  }
};

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

function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('home');

  // Auth State
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchProfileAndSetUser = async (sessionUser) => {
      if (!sessionUser) {
        setCurrentUser(null);
        return;
      }
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('auth_level')
          .eq('id', sessionUser.id)
          .single();

        setCurrentUser({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.name || sessionUser.email,
          authLevel: profile?.auth_level || 0
        });
      } catch (err) {
        console.error("Error fetching profile", err);
        setCurrentUser({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.name || sessionUser.email,
          authLevel: 0
        });
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfileAndSetUser(session?.user);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfileAndSetUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setActiveTab('home');
  };

  // Courses Database State
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Selected Course for Lesson Player
  const [currentCourse, setCurrentCourse] = useState(INITIAL_COURSES[0]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(3); // Default to first uncompleted lesson

  // Verse of the Day state
  const [verseIndex, setVerseIndex] = useState(0);
  const [isPlayingVerseAudio, setIsPlayingVerseAudio] = useState(false);
  const [verseAudioProgress, setVerseAudioProgress] = useState(0);
  const [isBookmarkedVerse, setIsBookmarkedVerse] = useState(false);

  // Lesson Player state
  const [isPlayingLessonAudio, setIsPlayingLessonAudio] = useState(false);
  const [lessonAudioProgress, setLessonAudioProgress] = useState(25);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizChecked, setQuizChecked] = useState(false);

  // Settings State
  const [themeMode, setThemeMode] = useState('dark');
  const [fontSize, setFontSize] = useState(20);

  // UI States
  const [copiedToast, setCopiedToast] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Timer reference for mock audio playing
  const audioIntervalRef = useRef(null);

  // Apply Theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    root.className = '';
    if (themeMode === 'sepia') {
      root.classList.add('theme-sepia');
    } else if (themeMode === 'light') {
      root.classList.add('bg-stone-50', 'text-stone-900');
    } else {
      root.classList.add('bg-deep-950', 'text-gray-100');
    }
  }, [themeMode]);

  // Audio timer emulation for Verse of the Day
  useEffect(() => {
    if (isPlayingVerseAudio) {
      audioIntervalRef.current = setInterval(() => {
        setVerseAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingVerseAudio(false);
            return 0;
          }
          return prev + 2;
        });
      }, 200);
    } else {
      clearInterval(audioIntervalRef.current);
    }
    return () => clearInterval(audioIntervalRef.current);
  }, [isPlayingVerseAudio]);

  // Handle Copy Verse
  const handleCopyText = (text, ref) => {
    navigator.clipboard.writeText(`"${text}" (${ref})`);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Start study handler: Switches to player tab & loads course
  const handleStartStudy = (course, lessonIdx = 0) => {
    setCurrentCourse(course);
    setCurrentLessonIndex(lessonIdx);
    setQuizSelection(null);
    setQuizChecked(false);
    setIsPlayingLessonAudio(false);
    setLessonAudioProgress(0);
    setActiveTab('lesson');
  };

  // Lesson Quiz Submission
  const handleQuizSubmit = (correctIdx) => {
    if (quizSelection === null) return;
    setQuizChecked(true);
    if (quizSelection === correctIdx) {
      // Mark current lesson as completed
      const updatedCourses = courses.map(c => {
        if (c.id === currentCourse.id) {
          const updatedLessons = [...c.lessons];
          updatedLessons[currentLessonIndex] = {
            ...updatedLessons[currentLessonIndex],
            completed: true
          };
          // Recalculate course progress
          const completedCount = updatedLessons.filter(l => l.completed).length;
          const newProgress = Math.round((completedCount / updatedLessons.length) * 100);
          return {
            ...c,
            lessons: updatedLessons,
            progress: newProgress
          };
        }
        return c;
      });
      setCourses(updatedCourses);
      // Update selected current course state too
      const updatedCurrentCourse = updatedCourses.find(c => c.id === currentCourse.id);
      setCurrentCourse(updatedCurrentCourse);
    }
  };

  // Reset progress for user
  const handleResetProgress = () => {
    setCourses(INITIAL_COURSES);
    setCurrentCourse(INITIAL_COURSES[0]);
    setCurrentLessonIndex(3);
    setQuizSelection(null);
    setQuizChecked(false);
    alert('تم إعادة تعيين تقدم الدراسة بنجاح!');
  };

  // Filter Courses based on search query & category selection
  const filteredCourses = courses.filter((c) => {
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      themeMode === 'dark' ? 'bg-deep-950 text-gray-100' : 
      themeMode === 'sepia' ? 'bg-[#f7f3e3] text-[#433422]' : 'bg-stone-50 text-stone-900'
    }`}>
      
      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gold-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in border border-gold-400">
          <Check size={18} />
          <span className="font-semibold text-sm">تم نسخ الآية والشاهد إلى الحافظة!</span>
        </div>
      )}

      {/* Main Header */}
      <Header 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex-1 w-full">
        
        {/* TAB 1: HOME / DASHBOARD */}
        {activeTab === 'home' && (
          <Home
            themeMode={themeMode}
            setActiveTab={setActiveTab}
            currentCourse={currentCourse}
            currentLessonIndex={currentLessonIndex}
            handleStartStudy={handleStartStudy}
            verseIndex={verseIndex}
            setVerseIndex={setVerseIndex}
            isPlayingVerseAudio={isPlayingVerseAudio}
            setIsPlayingVerseAudio={setIsPlayingVerseAudio}
            isBookmarkedVerse={isBookmarkedVerse}
            setIsBookmarkedVerse={setIsBookmarkedVerse}
            handleCopyText={handleCopyText}
          />
        )}

        {/* TAB 2: COURSES CATALOG */}
        {activeTab === 'courses' && (
          <Courses currentUser={currentUser} setActiveTab={setActiveTab} />
        )}

        {/* YEAR 1 PAGE */}
        {activeTab === 'year1' && (
          <Year1 setActiveTab={setActiveTab} />
        )}

        {/* YEAR 1 OLD TESTAMENT PAGE */}
        {activeTab === 'year1_old' && (
          <Year1OldTestament setActiveTab={setActiveTab} />
        )}

        {/* YEAR 1 NEW TESTAMENT PAGE */}
        {activeTab === 'year1_new' && (
          <Year1NewTestament setActiveTab={setActiveTab} />
        )}

        {/* YEAR 2 PAGE */}
        {activeTab === 'year2' && (
          <Year2 setActiveTab={setActiveTab} />
        )}

        {/* TAB 3: LESSON PLAYER */}
        {activeTab === 'lesson' && (
          <Lesson 
            currentCourse={currentCourse}
            currentLessonIndex={currentLessonIndex}
            setCurrentLessonIndex={setCurrentLessonIndex}
            setQuizSelection={setQuizSelection}
            setQuizChecked={setQuizChecked}
            themeMode={themeMode}
          />
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <Settings 
            themeMode={themeMode}
            setThemeMode={setThemeMode}
            fontSize={fontSize}
            setFontSize={setFontSize}
            handleResetProgress={handleResetProgress}
          />
        )}

        {/* TAB 6: LOGIN */}
        {activeTab === 'login' && (
          <Login setCurrentUser={setCurrentUser} setActiveTab={setActiveTab} />
        )}

      </main>

      {/* Footer */}
      <Footer themeMode={themeMode} setActiveTab={setActiveTab} />

    </div>
  )
}

export default App
