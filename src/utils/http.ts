import axios, {type AxiosInstance} from "axios";

const apiUrl = 'https://api-ecom.duthanhduoc.com/';

console.log(apiUrl);

export class Http {
    public instance: AxiosInstance

    constructor() {
        this.instance = axios.create({
            baseURL: apiUrl,
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
