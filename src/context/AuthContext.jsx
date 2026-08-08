import { createContext, useContext, useState, useEffect, useRef } from 'react';
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
  const lastFetchedUserIdRef = useRef(null);

  const fetchProfileAndSetUser = async (sessionUser, forceRefresh = false) => {
    if (!sessionUser) {
      lastFetchedUserIdRef.current = null;
      setCurrentUser(null);
      setLoading(false);
      return null;
    }

    // Prevent duplicate network calls for the same user unless forced
    if (!forceRefresh && lastFetchedUserIdRef.current === sessionUser.id && currentUser?.id === sessionUser.id) {
      setLoading(false);
      return currentUser;
    }

    try {
      lastFetchedUserIdRef.current = sessionUser.id;
      const { data: profile } = await supabase
        .from('profiles')
        .select('auth_level, is_enrolled')
        .eq('id', sessionUser.id)
        .maybeSingle();

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
    // Listen for auth state changes (Supabase v2 handles initial session automatically via INITIAL_SESSION)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Filter events to prevent duplicate profile fetches
      if (['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED', 'INITIAL_SESSION'].includes(event)) {
        fetchProfileAndSetUser(session?.user);
      } else if (event === 'TOKEN_REFRESHED' && !lastFetchedUserIdRef.current) {
        fetchProfileAndSetUser(session?.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      lastFetchedUserIdRef.current = null;
      setCurrentUser(null);
    }
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return await fetchProfileAndSetUser(session?.user, true);
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
