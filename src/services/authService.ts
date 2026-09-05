import { User } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const DEMO_USER: User = {
  id: 'user-demo',
  email: 'demo@medlens.app',
  name: 'Alex Kumar',
  role: 'Clinical Specialist',
  avatarInitials: 'AK',
  isDemo: true,
};

const AUTH_STORAGE_KEY = 'medlens_auth_user';

export const authService = {
  getStoredUser(): User | null {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading stored user', e);
    }
    return null;
  },

  async loginDemo(): Promise<User> {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(DEMO_USER));
    return DEMO_USER;
  },

  async loginReal(email: string, password: string): Promise<User> {
    // Check if credentials match demo email for convenience
    if (email.toLowerCase() === 'demo@medlens.app') {
      if (password === 'Demo@123') {
        return this.loginDemo();
      } else {
        throw new Error('Invalid password for demo account. Please use Demo@123');
      }
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw new Error(error.message);
      }
      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: data.user.user_metadata?.full_name || email.split('@')[0],
          role: 'Attending Physician',
          avatarInitials: (data.user.email || email).slice(0, 2).toUpperCase(),
          isDemo: false,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return user;
      }
    }

    // Local development authentication fallback
    const initials = email
      .split('@')[0]
      .split('.')
      .map((part) => part[0]?.toUpperCase() || '')
      .join('') || 'DR';

    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name: `Dr. ${email.split('@')[0].replace('.', ' ')}`,
      role: 'Attending Practitioner',
      avatarInitials: initials.slice(0, 2),
      isDemo: false,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async signUpReal(fullName: string, email: string, password: string): Promise<User> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) {
        throw new Error(error.message);
      }
      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: data.user.email || email,
          name: fullName,
          role: 'Attending Practitioner',
          avatarInitials: fullName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2),
          isDemo: false,
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        return user;
      }
    }

    const initials = fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'MD';

    const user: User = {
      id: `user-${Date.now()}`,
      email,
      name: fullName.startsWith('Dr.') ? fullName : `Dr. ${fullName}`,
      role: 'Attending Specialist',
      avatarInitials: initials,
      isDemo: false,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },
};
