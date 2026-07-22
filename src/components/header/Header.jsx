import { Moon, Sliders, Sun, Menu, X, User, LogOut, Settings } from 'lucide-react'
import { UserRound, Sparkles } from 'lucide-react';
import { useState, useRef, useEffect } from 'react'
import SignUpModal from '../auth/SignUpModal'
import { useNavigate, useLocation } from 'react-router-dom'

function Header({
  themeMode,
  setThemeMode,
  mobileMenuOpen,
  setMobileMenuOpen,
  currentUser,
  handleLogout
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname === '/' ? 'home' : location.pathname.substring(1);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-40 border-b transition-colors duration-300 ${
        themeMode === 'dark' ? 'bg-deep-950/80 border-deep-900 backdrop-blur-md' :
        themeMode === 'sepia' ? 'bg-[#efe9d0]/95 border-[#dfd5b4]' : 'bg-white/80 border-stone-200 backdrop-blur-md'
      }`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/icon.png" alt="Bibilia School Logo" className="w-auto h-20 scale-125 object-contain drop-shadow-md origin-left" />
            <div>
              {/* <h1 className="font-bold text-lg md:text-xl tracking-tight leading-none bg-gradient-to-l from-gold-400 to-amber-500 bg-clip-text text-transparent">
               Bibilia School
              </h1> */}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  navigate('/enroll');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-[15px] font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
              >
                <Sparkles size={16} />
                <span>التحق بنا</span>
              </button>
              
              {/* Vertical separator */}
              <div className={`w-px h-6 mx-1 ${themeMode === 'dark' ? 'bg-deep-800' : themeMode === 'sepia' ? 'bg-[#dfd5b4]' : 'bg-stone-200'}`}></div>
            </div>

            {[
              { id: 'home', label: 'الرئيسية' },
              { id: 'courses', label: 'المحاضرات' },
              { id: 'lesson', label: 'ملخصات' },
              { id: 'settings', label: 'الإعدادات' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  navigate(tab.id === 'home' ? '/' : `/${tab.id}`);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-xl text-[15px] font-medium transition-all ${
                  activeTab.startsWith(tab.id)
                    ? (themeMode === 'dark' ? 'bg-deep-800 text-gold-400 shadow-inner' :
                       themeMode === 'sepia' ? 'bg-[#dfd5b4] text-[#433422]' : 'bg-stone-200 text-stone-900')
                    : 'opacity-70 hover:opacity-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Actions Menu */}
          <div className="flex items-center gap-3">
            {/* Auth Buttons (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="w-10 h-10 rounded-full border-2 border-gold-500 overflow-hidden focus:outline-none focus:ring-2 focus:ring-gold-400 transition-all shadow-sm"
                  >
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-gold-600 to-amber-400 flex items-center justify-center text-white font-bold">
                        {currentUser.name ? <UserRound /> : <User size={20} />}
                      </div>
                    )}
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className={`absolute left-0 mt-2 w-48 rounded-xl shadow-lg border overflow-hidden z-50 transition-all ${
                      themeMode === 'dark' ? 'bg-deep-900 border-deep-800' :
                      themeMode === 'sepia' ? 'bg-[#efe9d0] border-[#dfd5b4]' : 'bg-white border-stone-200'
                    }`}>
                      <div className="px-4 py-3 border-b border-inherit">
                        <p className={`text-sm font-semibold truncate ${themeMode === 'dark' ? 'text-white' : 'text-stone-800'}`}>
                          {currentUser.name}
                        </p>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            navigate('/settings');
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                            themeMode === 'dark' ? 'text-gray-300 hover:bg-deep-800' :
                            themeMode === 'sepia' ? 'text-[#5a4a35] hover:bg-[#dfd5b4]' : 'text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          <Settings size={16} />
                          الإعدادات
                        </button>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors ${
                            themeMode === 'dark' ? 'hover:bg-deep-800' :
                            themeMode === 'sepia' ? 'hover:bg-[#dfd5b4]' : 'hover:bg-red-50'
                          }`}
                        >
                          <LogOut size={16} />
                          تسجيل الخروج
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/login')}
                    className="px-4 py-2 text-sm font-bold rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-deep-800 transition-all"
                  >
                    دخول
                  </button>
                  <button
                    onClick={() => setIsSignUpModalOpen(true)}
                    className="px-4 py-2 text-sm font-bold rounded-xl bg-gradient-to-r from-gold-600 to-amber-500 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    إنشاء حساب
                  </button>
                </>
              )}
            </div>

            {/* Quick theme cycle button */}
            <button 
              onClick={() => {
                if (themeMode === 'dark') setThemeMode('sepia');
                else if (themeMode === 'sepia') setThemeMode('light');
                else setThemeMode('dark');
              }}
              className={`p-2.5 rounded-xl border transition-all ${
                themeMode === 'dark' ? 'border-deep-800 hover:bg-deep-900 text-gold-400' :
                themeMode === 'sepia' ? 'border-[#dfd5b4] hover:bg-[#efe9d0] text-[#7c684d]' : 'border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
              title="تغيير المظهر"
            >
              {themeMode === 'dark' && <Moon size={18} />}
              {themeMode === 'sepia' && <Sliders size={18} />}
              {themeMode === 'light' && <Sun size={18} />}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-transparent hover:bg-black/5"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className={`md:hidden fixed inset-0 top-20 z-30 transition-all ${
          themeMode === 'dark' ? 'bg-deep-950/95' :
          themeMode === 'sepia' ? 'bg-[#f7f3e3]/95' : 'bg-stone-50/95'
        } backdrop-blur-lg`}>
          <nav className="flex flex-col p-6 gap-3">
            {currentUser && (
               <div className="flex items-center gap-3 bg-stone-100 dark:bg-deep-900 p-4 rounded-2xl mb-2 border border-stone-200 dark:border-stone-800">
                 <div className="w-12 h-12 rounded-full border-2 border-gold-500 overflow-hidden flex-shrink-0">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-gold-600 to-amber-400 flex items-center justify-center text-white font-bold text-lg">
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : <User size={24} />}
                      </div>
                    )}
                 </div>
                 <div className="flex-1 overflow-hidden">
                   <p className={`font-semibold text-base truncate ${themeMode === 'dark' ? 'text-white' : 'text-stone-800'}`}>{currentUser.name}</p>
                 </div>
                 <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded-lg" title="تسجيل الخروج">
                   <LogOut size={20} />
                 </button>
               </div>
            )}

            <button
              onClick={() => {
                navigate('/enroll');
                setMobileMenuOpen(false);
              }}
              className="w-full py-4 px-5 rounded-2xl flex justify-center items-center gap-2 text-lg font-bold bg-emerald-500 text-white shadow-lg mb-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              <Sparkles size={20} />
              <span>التحق بنا</span>
            </button>

            {[
              { id: 'home', label: 'الرئيسية' },
              { id: 'courses', label: 'المناهج الدراسية' },
              { id: 'lesson', label: 'قاعة الدراسة التفاعلية' },
              { id: 'settings', label: 'الإعدادات والمظهر' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  navigate(tab.id === 'home' ? '/' : `/${tab.id}`);
                  setMobileMenuOpen(false);
                }}
                className={`w-full py-4 px-5 rounded-2xl text-right text-base font-semibold border ${
                  activeTab.startsWith(tab.id)
                    ? 'bg-gradient-to-l from-gold-600 to-amber-500 text-white border-transparent shadow-lg'
                    : (themeMode === 'dark' ? 'border-deep-900 text-gray-300' :
                       themeMode === 'sepia' ? 'border-[#dfd5b4] text-[#433422]' : 'border-stone-200 text-stone-700')
                }`}
              >
                {tab.label}
              </button>
            ))}
            
            {!currentUser && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-4 px-5 rounded-2xl text-center text-base font-bold bg-stone-200 dark:bg-deep-800 text-stone-800 dark:text-stone-200"
                >
                  دخول
                </button>
                <button
                  onClick={() => {
                    setIsSignUpModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex-1 py-4 px-5 rounded-2xl text-center text-base font-bold bg-gradient-to-l from-gold-600 to-amber-500 text-white shadow-lg"
                >
                  إنشاء حساب
                </button>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Sign Up Modal */}
      <SignUpModal 
        isOpen={isSignUpModalOpen} 
        onClose={() => setIsSignUpModalOpen(false)} 
        themeMode={themeMode} 
      />
    </>
  )
}

export default Header;
