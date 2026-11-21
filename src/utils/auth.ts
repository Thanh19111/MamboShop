import type {User} from "../types/user.type.ts";
import type {AuthResponse} from "../types/auth.type.ts";

export const LocalStorageEventTarget = new EventTarget()

type TokenType = 'access_token' | 'refresh_token';

export const clearLocalStorage = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('profile')
    const clearLSEvent = new Event('clearLocalStorage')
    LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getToken = (type: TokenType) : string => {
    if (type == 'access_token') {
        return localStorage.getItem('access_token') || '';
    }
    if (type == 'refresh_token') {
        return localStorage.getItem('refresh_token') || '';
    }
    return '';
}

export const setToken = (type: TokenType, token: string): void => {
    if (type == 'access_token') {
        localStorage.setItem('access_token', token);
        return;
    }
    if (type == 'refresh_token') {
        localStorage.setItem('refresh_token', token);
        return;
    }
}

export const setUserProfile = (profile: User) : void => localStorage.setItem('profile', JSON.stringify(profile))

export const getUserProfile = () : User | null => {
    const result = localStorage.getItem('profile')
    return result ? JSON.parse(result) : null
}

export const handleLogin = (data: AuthResponse) => {
    setToken('access_token', data.data.access_token)
    setToken('refresh_token', data.data.refresh_token)
    setUserProfile(data.data.user)
}

export const handleLogout = () => clearLocalStorage()