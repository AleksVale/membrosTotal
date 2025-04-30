import { useState, useEffect } from 'react';
import { setCookie, getJsonCookie, removeCookie } from '@/lib/cookies';
import { useRouter } from 'next/navigation';

// Define user interface based on your auth response
export interface User {
  id: number;
  name: string;
  email: string;
  profile: string;
  photo: string | null;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export function useUser() {
  const [auth, setAuth] = useState<AuthState>({
    token: null,
    user: null,
    isAuthenticated: false,
  });
  const router = useRouter();

  // Load user data from cookies on mount
  useEffect(() => {
    const token = getJsonCookie<string>('auth_token');
    const user = getJsonCookie<User>('auth_user');
    
    if (token && user) {
      setAuth({
        token,
        user,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = (token: string, user: User) => {
    // Store in cookies (7 days expiration)
    setCookie('auth_token', token, 7);
    setCookie('auth_user', user, 7);
    
    // Update state
    setAuth({
      token,
      user,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    // Remove cookies
    removeCookie('auth_token');
    removeCookie('auth_user');
    
    // Reset state
    setAuth({
      token: null,
      user: null,
      isAuthenticated: false,
    });
    
    // Redirect to login page
    router.push('/');
  };

  return {
    ...auth,
    login,
    logout,
  };
}
