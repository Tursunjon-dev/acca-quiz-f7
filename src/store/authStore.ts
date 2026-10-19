import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { getAuth } from 'firebase/auth';
import { initFirebase, currentUser, onAuthChange } from '@/lib/firebase';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: true,
      error: null,
      isAuthenticated: false,

      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      }),

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error, isLoading: false }),

      checkAuth: async () => {
        set({ isLoading: true });
        if (typeof window === 'undefined') {
          set({ isLoading: false });
          return;
        }
        
        initFirebase();
        const auth = getAuth();
        
        onAuthStateChanged(auth, (user) => {
          set({ 
            user, 
            isAuthenticated: !!user,
            isLoading: false 
          });
        });
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          initFirebase();
          const auth = getAuth();
          const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
          set({ 
            user: cred.user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (e) {
          const code = (e as { code?: string })?.code ?? '';
          let message = 'Login failed';
          
          switch (code) {
            case 'auth/invalid-email':
              message = 'Invalid email address';
              break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
            case 'auth/invalid-credential':
              message = 'Wrong email or password';
              break;
            case 'auth/too-many-requests':
              message = 'Too many attempts. Try again later';
              break;
          }
          
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      register: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          initFirebase();
          const auth = getAuth();
          const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
          set({ 
            user: cred.user, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (e) {
          const code = (e as { code?: string })?.code ?? '';
          let message = 'Registration failed';
          
          switch (code) {
            case 'auth/invalid-email':
              message = 'Invalid email address';
              break;
            case 'auth/email-already-in-use':
              message = 'Email already in use';
              break;
            case 'auth/weak-password':
              message = 'Password must be at least 6 characters';
              break;
          }
          
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      logout: async () => {
        try {
          initFirebase();
          const auth = getAuth();
          await signOut(auth);
          set({ 
            user: null, 
            isAuthenticated: false, 
            error: null 
          });
        } catch (e) {
          console.error('Logout error:', e);
        }
      },
    }),
    {
      name: 'faq-auth',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user ? { uid: state.user.uid, email: state.user.email } : null,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
);
