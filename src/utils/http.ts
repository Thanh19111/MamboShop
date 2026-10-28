import axios, {type AxiosInstance} from "axios";

const baseUrl = import.meta.env.BASE_URL;

export class Http {
    public instance: AxiosInstance

    constructor() {
        this.instance = axios.create({
            baseURL: baseUrl,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            }
        })
        // Add a response interceptor
    }
}

const http = new Http().instance
export default http
