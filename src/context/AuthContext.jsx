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

      // 1. Fetch profile from profiles table
      let { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

      const meta = sessionUser.user_metadata || {};

      // 2. If profile row doesn't exist or is missing metadata, auto-create/update it seamlessly
      if (!profile || (!profile.phone && meta.phone)) {
        const fullProfile = {
          id: sessionUser.id,
          email: sessionUser.email,
          name: profile?.name || meta.name || sessionUser.email,
          phone: profile?.phone || meta.phone || null,
          birth_date: profile?.birth_date || meta.birth_date || null,
          grade: profile?.grade || meta.grade || null,
          confession_father: profile?.confession_father || meta.confession_father || null,
          church: profile?.church || meta.church || null,
          branch: profile?.branch || meta.branch || null,
          auth_level: profile?.auth_level || 0,
          is_enrolled: profile?.is_enrolled === true || meta.is_enrolled === true
        };

        const { data: upserted } = await supabase
          .from('profiles')
          .upsert([fullProfile], { onConflict: 'id' })
          .select('*')
          .maybeSingle();

        if (upserted) {
          profile = upserted;
        }
      }

      const enrolledStatus = (profile && profile.is_enrolled !== undefined && profile.is_enrolled !== null)
        ? profile.is_enrolled === true
        : meta.is_enrolled === true;

      const userObj = {
        id: sessionUser.id,
        email: sessionUser.email,
        name: profile?.name || meta.name || sessionUser.email,
        phone: profile?.phone || meta.phone || null,
        birthDate: profile?.birth_date || meta.birth_date || null,
        grade: profile?.grade || meta.grade || null,
        confessionFather: profile?.confession_father || meta.confession_father || null,
        church: profile?.church || meta.church || null,
        branch: profile?.branch || meta.branch || null,
        photoURL: meta.photoURL || null,
        isEnrolled: enrolledStatus,
        authLevel: profile?.auth_level || 0,
      };

      setCurrentUser(userObj);
      return userObj;
    } catch (err) {
      console.error('Error fetching profile in AuthContext:', err);
      const meta = sessionUser.user_metadata || {};
      const fallbackUser = {
        id: sessionUser.id,
        email: sessionUser.email,
        name: meta.name || sessionUser.email,
        phone: meta.phone || null,
        birthDate: meta.birth_date || null,
        grade: meta.grade || null,
        confessionFather: meta.confession_father || null,
        church: meta.church || null,
        branch: meta.branch || null,
        photoURL: meta.photoURL || null,
        isEnrolled: meta.is_enrolled === true,
        authLevel: 0,
      };
      setCurrentUser(fallbackUser);
      return fallbackUser;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (['SIGNED_IN', 'SIGNED_OUT', 'INITIAL_SESSION'].includes(event)) {
        fetchProfileAndSetUser(session?.user);
      } else if (event === 'USER_UPDATED') {
        fetchProfileAndSetUser(session?.user, true);
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
