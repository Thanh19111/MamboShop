import axios, {type AxiosInstance} from "axios";
import {
    clearLS,
    getAccessTokenFromLS,
    getRefreshTokenFromLS,
    setAccessTokenToLS,
    setProfileToLS,
    setRefreshTokenToLS
} from "./auth.ts";
import type {AuthResponse} from "../types/auth.type.ts";

const apiUrl = 'https://api-ecom.duthanhduoc.com/';
const URL_LOGIN = "login"
const URL_REGISTER = "register"
const URL_LOGOUT = "logout"

const handleLogin = (data: AuthResponse) => {
    setAccessTokenToLS(data.data.access_token);
    setRefreshTokenToLS(data.data.refresh_token);
    setProfileToLS(data.data.user)
}

const handleLogout = () => {
    clearLS()
}

export class Http {
    public instance: AxiosInstance
    public accessToken: string
    public refreshToken: string

    constructor() {
        this.accessToken = getAccessTokenFromLS()
        this.refreshToken = getRefreshTokenFromLS()
        this.instance = axios.create({
            baseURL: apiUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'expire-access-token': 60 * 60 * 24, // 1 ngày
                'expire-refresh-token': 60 * 60 * 24 * 160 // 160 ngày
            }
        })
        // Add a request interceptor
        this.instance.interceptors.request.use(
            (config) => {
                if (this.accessToken && config.headers) {
                    config.headers.authorization = this.accessToken
                    return config
                }
                return config
            },
            (error) => {
                return Promise.reject(error)
            }
        )
        // Add a response interceptor
        this.instance.interceptors.response.use(
            (response) => {
                const {url} = response.config
                if (url === URL_LOGIN || url === URL_REGISTER) {
                    const data = response.data as AuthResponse
                    this.accessToken = data.data.access_token
                    this.refreshToken = data.data.refresh_token
                    console.log(url)
                    console.log(data)
                    handleLogin(data)
                } else if (url === URL_LOGOUT) {
                    this.accessToken = ''
                    this.refreshToken = ''
                    handleLogout()
                }
                return response
            }
        )
    }
}

const http = new Http().instance
export default http
