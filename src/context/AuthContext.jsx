import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({
  currentUser: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => {}
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndSetUser = async (sessionUser) => {
    if (!sessionUser) {
      setCurrentUser(null);
      setLoading(false);
      return null;
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

      const userObj = {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.user_metadata?.name || sessionUser.email,
        photoURL: sessionUser.user_metadata?.photoURL || null,
        isEnrolled: enrolledStatus,
        authLevel: profile?.auth_level || 0,
      };

      setCurrentUser(userObj);
      return userObj;
    } catch (err) {
      console.error('Error fetching profile in AuthContext:', err);
      const fallbackUser = {
        id: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.user_metadata?.name || sessionUser.email,
        photoURL: sessionUser.user_metadata?.photoURL || null,
        isEnrolled: sessionUser.user_metadata?.is_enrolled === true,
        authLevel: 0,
      };
      setCurrentUser(fallbackUser);
      return fallbackUser;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfileAndSetUser(session?.user);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfileAndSetUser(session?.user);
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setCurrentUser(null);
    }
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return await fetchProfileAndSetUser(session?.user);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
