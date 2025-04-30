import Cookies from 'js-cookie';

// Duração padrão do cookie em dias
const DEFAULT_EXPIRATION = 7;

export const setCookie = (
  name: string,
  value: string | object,
  expirationDays: number = DEFAULT_EXPIRATION
): void => {
  // If value is an object, convert it to a JSON string
  const cookieValue = typeof value === 'object' ? JSON.stringify(value) : value;
  
  Cookies.set(name, cookieValue, {
    expires: expirationDays,
    path: '/',
    // Add secure flag in production environment
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
};

export const getCookie = (name: string): string | null => {
  return Cookies.get(name) || null;
};

export const getJsonCookie = <T>(name: string): T | null => {
  const cookie = getCookie(name);
  if (!cookie) return null;
  
  try {
    return JSON.parse(cookie) as T;
  } catch (e) {
    console.error(`Error parsing cookie ${name}:`, e);
    return null;
  }
};

export const removeCookie = (name: string): void => {
  Cookies.remove(name, { path: '/' });
};
