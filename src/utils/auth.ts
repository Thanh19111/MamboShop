import type {User} from "../types/user.type.ts";

export const LocalStorageEventTarget = new EventTarget()

type TokenType = 'access_token' | 'refresh_token';

export const setAccessTokenToLS = (access_token: string) => {
    localStorage.setItem('access_token', access_token)
}

export const setRefreshTokenToLS = (refresh_token: string) => {
    localStorage.setItem('refresh_token', refresh_token)
}

export const clearLS = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('profile')
    const clearLSEvent = new Event('clearLS')
    LocalStorageEventTarget.dispatchEvent(clearLSEvent)
}

export const getToken = (type: TokenType) => {
    if (type == 'access_token') {
        return localStorage.getItem('access_token') || '';
    } else if (type == 'refresh_token') {
        return localStorage.getItem('refresh_token') || '';
    }
    return '';
}

export const setToken = (type: TokenType, token: string) => {
    if (type == 'access_token') {
        localStorage.setItem('access_token', token);
    } else if (type == 'refresh_token') {
        localStorage.setItem('refresh_token', token);
    }
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getRefreshTokenFromLS = () => localStorage.getItem('refresh_token') || ''

export const getProfileFromLS = () => {
    const result = localStorage.getItem('profile')
    return result ? JSON.parse(result) : null
}

export const setProfileToLS = (profile: User) => {
    localStorage.setItem('profile', JSON.stringify(profile))
}
