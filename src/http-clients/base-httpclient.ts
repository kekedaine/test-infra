import axios from "axios";
import _ from "lodash";
export class BaseHttpclient {
    private httpClient: any
    private baseUrl: string
    constructor(base_url: string, base_option: any) {
        this.baseUrl = base_url;
        this.createHttpClient(base_option);
    }

    private createHttpClient(base_option: any = {}) {
        this.httpClient = axios.create({
            baseURL: this.baseUrl,
            timeout: 20000,
            ...base_option
        });
    }

    setAccessToken(token: string) {
        this.createHttpClient({
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            }
        });
    }

    removeAccessToken() {
        this.createHttpClient();
    }

    private request(method: string, url: string, options?: any) {
        const query = Object.assign({
            method: method || "get",
            url
        }, options);
        // console.log(query);
        return this.httpClient(query).then((result: any) => {
            if (_.isEmpty(result.data)) {
                throw new Error("response data not found");
            }
            return result.data;
        }).catch((err: any) => {
            console.error(err.message);
            console.log(query);
            if (err.response) console.error(err.response.data);
        });
    }

    get(url: string, params?: any, options = {}) {
        return this.request("get", url, { ...(params && params), ...options  });
    }

    post(url: string, body?: any, options = {}) {
        return this.request("post", url, { ...(body && { data: body }), ...options });
    }

    put(url: string, body: any, options = {}) {
        return this.request("put", url, { data: body, ...options });
    }

    patch(url: string, body: any, options = {}) {
        return this.request("patch", url, { data: body, ...options });
    }

    delete(url: string, body: any, options = {}) {
        return this.request("delete", url, { data: body, ...options });
    }
}
