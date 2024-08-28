export class HttpClient {
    constructor(apiServer = "") {
        this.BASE_URL = apiServer;
        this.interceptors = {
            request: new Interceptor(),
            response: new Interceptor()
        };
        this.commonsHeaders = { 'Content-Type': 'application/json' };
    }
    async request(config) {
        config.headers = {
            ...this.commonsHeaders,
            ...config.headers
        };
        config = await this.interceptors.request.applySuccess(config);
        const init = {
            method: config.method,
            headers: config.headers
        };
        if (config.data) {
            if (config.headers['Content-Type'] === 'application/json') {
                init.body = JSON.stringify(config.data);
            }
        }
        let url = config.baseURL;
        if (config.url) {
            url += config.url;
        }
        if (config.params) {
            url += "?" + new URLSearchParams(config.params).toString();
        }
        try {
            const res = await fetch(url, init);
            const data = await res[config.responseType]();
            let result = { data, status: res.status, headers: res.headers, statusText: res.statusText, config };
            if (res.ok) {
                result = await this.interceptors.response.applySuccess(result);
            }
            else {
                const transformed = await this.interceptors.response.applyError(result);
                if (transformed) {
                    return transformed;
                }
                else {
                    throw { type: "Response Error", data: result };
                }
            }
            return result;
        }
        catch (error) {
            if (error.type !== "Response Error") {
                this.interceptors.request.applyError(error);
            }
            throw error;
        }
    }
    async get(url, opt) {
        return await this.genericRequest("GET", url, opt);
    }
    async post(url, opt) {
        return await this.genericRequest("POST", url, opt);
    }
    async put(url, opt) {
        return await this.genericRequest("DELETE", url, opt);
    }
    async delete(url, opt) {
        return await this.genericRequest("DELETE", url, opt);
    }
    async genericRequest(method, url, opt = {}) {
        return await this.request({
            url,
            baseURL: this.BASE_URL,
            method,
            responseType: "json",
            ...opt
        });
    }
    static isSuccessful(status) {
        return status >= 200 && status <= 299;
    }
    static isClientError(status) {
        return status >= 400 && status <= 499;
    }
    static isServerError(status) {
        return status >= 500;
    }
}
class Interceptor {
    constructor() {
        this.filters = [];
    }
    async applySuccess(t) {
        return this.filters.reduce((config, filter) => config.then(c => filter.success(c)), new Promise(resolve => resolve(t)));
    }
    async applyError(error) {
        if (this.filters.length === 0) {
            throw error;
        }
        return this.filters.reduce((config, filter) => config.then(er => filter.error(er)), new Promise(resolve => resolve(error)));
    }
    use(handleSuccess, handleError) {
        const filter = {
            success: handleSuccess,
            error: handleError
        };
        this.filters.push(filter);
        return filter;
    }
    eject(filter) {
        const index = this.filters.findIndex(f => f === filter);
        if (index !== -1) {
            this.filters.splice(index, 1);
        }
    }
}
