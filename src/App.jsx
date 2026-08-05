import { useState, useEffect } from 'react'
import Header from './components/header/Header'
import Footer from './components/footer/Footer'
import Home from './components/home/Home'
import Courses from './components/courses/Courses'
import Year1 from './components/courses/Year1Section/Year1'
import Year1OldTestament from './components/courses/Year1Section/3ahdAdem'
import Year1NewTestament from './components/courses/Year1Section/3ahdGded'
import Year2 from './components/courses/Year2'
import ContactUs from './components/contactus/ContactUs'
import Profile from './components/profile/Profile'
import Login from './components/auth/Login'
import ForgotPassword from './components/auth/ForgotPassword'
import ResetPassword from './components/auth/ResetPassword'
import Enroll from './components/enroll/Enroll'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

function App() {
  const navigate = useNavigate();

  // ── Auth state ───────────────────────────────────────────────────────────
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
          .select('auth_level, is_enrolled')
          .eq('id', sessionUser.id)
          .single();

        const enrolledStatus = (profile && profile.is_enrolled !== undefined && profile.is_enrolled !== null)
          ? profile.is_enrolled === true
          : sessionUser.user_metadata?.is_enrolled === true;

        setCurrentUser({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.name || sessionUser.email,
          photoURL: sessionUser.user_metadata?.photoURL || null,
          isEnrolled: enrolledStatus,
          authLevel: profile?.auth_level || 0,
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        setCurrentUser({
          id: sessionUser.id,
          email: sessionUser.email,
          name: sessionUser.user_metadata?.name || sessionUser.email,
          photoURL: sessionUser.user_metadata?.photoURL || null,
          isEnrolled: sessionUser.user_metadata?.is_enrolled === true,
          authLevel: 0,
        });
      }
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfileAndSetUser(session?.user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfileAndSetUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    navigate('/');
  };

  // ── Verse of the Day state ───────────────────────────────────────────────
  const [verseIndex, setVerseIndex] = useState(0);
  const [isBookmarkedVerse, setIsBookmarkedVerse] = useState(false);

  /** Copy verse text + reference to clipboard */
  const handleCopyText = (text, reference) => {
    const content = `"${text}"\n— ${reference}`;
    navigator.clipboard.writeText(content).catch((err) =>
      console.error('Clipboard error:', err)
    );
  };

  // ── Theme state ──────────────────────────────────────────────────────────
  const [themeMode, setThemeMode] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply a single theme class to the root element
  useEffect(() => {
    const root = document.documentElement;
    root.className = '';
    if (themeMode === 'sepia') {
      root.classList.add('theme-sepia');
    } else if (themeMode === 'light') {
      root.classList.add('theme-light');
    } else {
      root.classList.add('theme-dark');
    }
  }, [themeMode]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      themeMode === 'dark'  ? 'bg-deep-950 text-gray-100' :
      themeMode === 'sepia' ? 'bg-[#f7f3e3] text-[#433422]' :
                              'bg-stone-50 text-stone-900'
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
              isBookmarkedVerse={isBookmarkedVerse}
              setIsBookmarkedVerse={setIsBookmarkedVerse}
              handleCopyText={handleCopyText}
            />
          } />

          <Route path="/courses" element={<Courses currentUser={currentUser} />} />
          <Route path="/year1" element={<Year1 />} />
          <Route path="/year1_old" element={<Year1OldTestament />} />
          <Route path="/year1_new" element={<Year1NewTestament />} />
          <Route path="/year2" element={<Year2 />} />

          <Route path="/contactus" element={<ContactUs themeMode={themeMode} currentUser={currentUser} />} />

          <Route path="/profile" element={
            <Profile themeMode={themeMode} currentUser={currentUser} />
          } />

          <Route path="/login" element={<Login themeMode={themeMode} />} />
          <Route path="/forgot-password" element={<ForgotPassword themeMode={themeMode} />} />
          <Route path="/reset-password" element={<ResetPassword themeMode={themeMode} />} />
          <Route path="/enroll" element={<Enroll themeMode={themeMode} currentUser={currentUser} />} />
        </Routes>
      </main>

      <Footer themeMode={themeMode} />
    </div>
  )
}

export default App
