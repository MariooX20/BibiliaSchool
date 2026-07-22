import { useState, useEffect } from 'react'
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
import Enroll from './components/enroll/Enroll'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'



function App() {
  const navigate = useNavigate();

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
          isEnrolled: sessionUser.user_metadata?.is_enrolled === true,
          authLevel: profile?.auth_level || 0
        });
      } catch (err) {
        console.error("Error fetching profile", err);
        setCurrentUser({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.name || sessionUser.email,
          isEnrolled: sessionUser.user_metadata?.is_enrolled === true,
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
    navigate('/');
  };

  // Verse of the Day state
  const [verseIndex, setVerseIndex] = useState(0);
  const [isPlayingVerseAudio, setIsPlayingVerseAudio] = useState(false);
  const [isBookmarkedVerse, setIsBookmarkedVerse] = useState(false);

  // Settings State
  const [themeMode, setThemeMode] = useState('dark');
  const [fontSize, setFontSize] = useState(20);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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



  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      themeMode === 'dark' ? 'bg-deep-950 text-gray-100' : 
      themeMode === 'sepia' ? 'bg-[#f7f3e3] text-[#433422]' : 'bg-stone-50 text-stone-900'
    }`}>
      

      <Header 
        themeMode={themeMode}
        setThemeMode={setThemeMode}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        currentUser={currentUser}
        handleLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex-1 w-full">
        <Routes>
          <Route path="/" element={
            <Home
              themeMode={themeMode}
              verseIndex={verseIndex}
              setVerseIndex={setVerseIndex}
              isPlayingVerseAudio={isPlayingVerseAudio}
              setIsPlayingVerseAudio={setIsPlayingVerseAudio}
              isBookmarkedVerse={isBookmarkedVerse}
              setIsBookmarkedVerse={setIsBookmarkedVerse}
            />
          } />

          <Route path="/courses" element={<Courses currentUser={currentUser} />} />
          <Route path="/year1" element={<Year1 />} />
          <Route path="/year1_old" element={<Year1OldTestament />} />
          <Route path="/year1_new" element={<Year1NewTestament />} />
          <Route path="/year2" element={<Year2 />} />

          <Route path="/lesson" element={
            <Lesson 
              themeMode={themeMode}
            />
          } />

          <Route path="/settings" element={
            <Settings 
              themeMode={themeMode}
              setThemeMode={setThemeMode}
              fontSize={fontSize}
              setFontSize={setFontSize}
            />
          } />

          <Route path="/login" element={<Login />} />
          <Route path="/enroll" element={<Enroll themeMode={themeMode} currentUser={currentUser} />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer themeMode={themeMode} />

    </div>
  )
}

export default App
