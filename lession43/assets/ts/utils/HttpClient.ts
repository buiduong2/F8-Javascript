
type RequestConfig = {
    url: string,
    method: FetchMethod,
    baseURL: string,
    headers?: any,
    params?: any,
    data?: any,
    responseType: "json" | "text"
}

type AliasConfig = {
    headers?: any,
    params?: any,
    data?: any
    responseType?: "json" | "text"
}

type ResponseSchema = {
    data: any,
    status: number,
    statusText: string,
    headers: {},
    config: RequestConfig,
    action?: any,
}

type FetchMethod = "POST" | "PUT" | "DELETE" | "GET"

export class HttpClient {

    private readonly BASE_URL: string;

    interceptors: { request: Interceptor<RequestConfig, any>, response: Interceptor<ResponseSchema, ResponseSchema> };
    commonsHeaders: any;

    constructor(apiServer: string = "") {
        this.BASE_URL = apiServer;
        this.interceptors = {
            request: new Interceptor(),
            response: new Interceptor()
        };
        this.commonsHeaders = { 'Content-Type': 'application/json' }

    }


    public async request(config: RequestConfig): Promise<ResponseSchema> {
        config.headers = {
            ...this.commonsHeaders,
            ...config.headers
        };
        config = await this.interceptors.request.applySuccess(config);

        const init: RequestInit = {
            method: config.method,
            headers: config.headers
        };

        if (config.data) {
            if (config.headers['Content-Type'] === 'application/json') {
                init.body = JSON.stringify(config.data)
            }
        }

        let url = config.baseURL
        if (config.url) {
            url += config.url
        }

        if (config.params) {
            url += "?" + new URLSearchParams(config.params).toString();
        }

        try {
            const res = await fetch(url, init);
            const data = await res[config.responseType]();
            let result: ResponseSchema = { data, status: res.status, headers: res.headers, statusText: res.statusText, config }

            if (res.ok) {
                result = await this.interceptors.response.applySuccess(result);
            } else {
                const transformed = await this.interceptors.response.applyError(result);
                if (transformed) {
                    return transformed;
                } else {
                    throw { type: "Response Error", data: result }
                }
            }
            return result;

        } catch (error) {
            if ((error as any).type !== "Response Error") {
                this.interceptors.request.applyError(error);
            }
            throw error
        }
    }

    public async get(url: string, opt?: AliasConfig): Promise<ResponseSchema> {
        return await this.genericRequest("GET", url, opt);
    }

    public async post(url: string, opt: AliasConfig): Promise<ResponseSchema> {
        return await this.genericRequest("POST", url, opt);
    }


    public async put(url: string, opt: AliasConfig): Promise<ResponseSchema> {
        return await this.genericRequest("DELETE", url, opt);
    }
    public async delete(url: string, opt: AliasConfig): Promise<ResponseSchema> {
        return await this.genericRequest("DELETE", url, opt)
    }

    public async genericRequest(method: FetchMethod, url: string, opt: AliasConfig = {}) {
        return await this.request({
            url,
            baseURL: this.BASE_URL,
            method,
            responseType: "json",
            ...opt
        })
    }

    static isSuccessful(status: number): boolean {
        return status >= 200 && status <= 299;
    }
    static isClientError(status: number): boolean {
        return status >= 400 && status <= 499;
    }
    static isServerError(status: number): boolean {
        return status >= 500
    }
}

class Interceptor<T, E> {
    filters: Filter<T, E>[];

    constructor() {
        this.filters = []
    }

    async applySuccess(t: T): Promise<T> {
        return this.filters.reduce(
            (config, filter) => config.then(c => filter.success(c as T)),
            new Promise(resolve => resolve(t))) as T;

    }

    async applyError(error: E): Promise<E> {
        if (this.filters.length === 0) {
            throw error
        }

        return this.filters.reduce(
            (config, filter) => config.then(er => filter.error(er)),
            new Promise<E>(resolve => resolve(error))
        );

    }

    public use(handleSuccess: handleFunc<T>, handleError: handleFunc<E>): Filter<T, E> {
        const filter = {
            success: handleSuccess,
            error: handleError
        };
        this.filters.push(filter)

        return filter;
    }

    public eject(filter: Filter<T, E>): void {
        const index = this.filters.findIndex(f => f === filter);
        if (index !== -1) {
            this.filters.splice(index, 1);
        }
    }
}

type Filter<T, E> = {
    success: handleFunc<T>,
    error: handleFunc<E>,
}

type handleFunc<T> = (t: T) => Promise<T>