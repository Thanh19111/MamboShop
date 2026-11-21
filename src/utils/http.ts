import axios, {type AxiosError, type AxiosInstance} from "axios";
import {clearLocalStorage, getToken, handleLogin, handleLogout, setToken} from "./auth.ts";
import type {AuthResponse, RefreshTokenResponse} from "../types/auth.type.ts";
import HttpStatusCode from "../constants/httpStatusCode.enum.ts";
import {toast} from "react-toastify";
import {isExpiredToken, isUnauthorized} from "./utils.ts";
import type {ErrorResponse} from "../types/response.type.ts";
import {URL_REFRESH_TOKEN} from "../apis/auth.api.ts";

const apiUrl = import.meta.env.VITE_API_BASE_URL
const URL_LOGIN = "login"
const URL_REGISTER = "register"
const URL_LOGOUT = "logout"

export class Http {
    public instance: AxiosInstance
    public accessToken: string
    public refreshToken: string
    public refreshTokenRequest: Promise<string> | null

    constructor() {
        this.accessToken = getToken('access_token')
        this.refreshToken = getToken('refresh_token')
        this.refreshTokenRequest = null
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
                    handleLogin(data)
                } else if (url === URL_LOGOUT) {
                    this.accessToken = ''
                    this.refreshToken = ''
                    handleLogout()
                }
                return response
            },
            (error: AxiosError) => {
                // Chỉ toast lỗi không phải 422 và 401
                if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status as number)) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const data: any | undefined = error.response?.data
                    const message = data?.message || error.message
                    toast.error(message)
                }

                // Lỗi Unauthorized (401) có rất nhiều trường hợp
                // - Token không đúng
                // - Không truyền token
                // - Token hết hạn*

                // Nếu là lỗi 401
                if (isUnauthorized<ErrorResponse<{ name: string; message: string }>>(error)) {
                    const config = error.response?.config || {headers: {}, url: ''}
                    const {url} = config
                    // Trường hợp Token hết hạn và request đó không phải là của request refresh token
                    // thì chúng ta mới tiến hành gọi refresh token
                    if (isExpiredToken(error) && url !== URL_REFRESH_TOKEN) {
                        // Hạn chế gọi 2 lần handleRefreshToken
                        this.refreshTokenRequest = this.refreshTokenRequest
                            ? this.refreshTokenRequest
                            : this.handleRefreshToken().finally(() => {
                                // Giữ refreshTokenRequest trong 10s cho những request tiếp theo nếu có 401 thì dùng
                                setTimeout(() => {
                                    this.refreshTokenRequest = null
                                }, 10000)
                            })
                        return this.refreshTokenRequest.then((access_token) => {
                            // Nghĩa là chúng ta tiếp tục gọi lại request cũ vừa bị lỗi
                            return this.instance({...config, headers: {...config.headers, authorization: access_token}})
                        })
                    }

                    // Còn những trường hợp như token không đúng
                    // không truyền token,
                    // token hết hạn nhưng gọi refresh token bị fail
                    // thì tiến hành xóa local storage và toast message
                    this.accessToken = ''
                    this.refreshToken = ''
                    clearLocalStorage()
                    toast.error(error.response?.data.data?.message || error.response?.data.message)
                    // window.location.reload()
                }
                return Promise.reject(error)
            }
        )
    }

    private handleRefreshToken() {
        return this.instance
            .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, {
                refresh_token: this.refreshToken
            })
            .then((res) => {
                const {access_token} = res.data.data
                setToken('access_token', access_token)
                this.accessToken = access_token
                return access_token
            })
            .catch((error) => {
                clearLocalStorage()
                this.accessToken = ''
                this.refreshToken = ''
                throw error
            })
    }
}

const http = new Http().instance
export default http
