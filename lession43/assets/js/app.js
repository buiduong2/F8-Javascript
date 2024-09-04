import { Router } from "./utils/Router.js";
import { HttpClient } from "./utils/HttpClient.js";
import { API_SERVER } from "./index.js";
const STORE_KEY_ACCESS_TOKEN = "ACCESS_TOKEN";
const STORE_KEY_REFRESH_TOKEN = "REFRESH_TOKEN";
export class Store {
    constructor() {
        this.isAuth = false;
        this.posts = [];
        this.authListeners = [];
        this.notification = document.querySelector("app-notification");
        this.httpClient = new HttpClient(API_SERVER);
        const infoNotificationUrls = ['/auth/login', '/auth/register', '/auth/logout'];
        this.httpClient.interceptors.response.use(async (res) => {
            if (infoNotificationUrls.includes(res.config.url) || (res.config.url === '/blogs' && res.config.method === "POST")) {
                this.addNotification("info", res.data.message);
            }
            return res;
        }, async (error) => {
            if (HttpClient.isClientError(error.status) && error.status !== 401) {
                this.addNotification("warn", error.data.message);
            }
            else if (HttpClient.isServerError(error.status)) {
                this.addNotification("error", error.data.message);
            }
            return error;
        });
        this.httpClient.interceptors.response.use(async (res) => res, async (error) => {
            if (error.config.url !== '/auth/refresh-token' &&
                error.status === 401 &&
                error.config.headers['Authorization'] &&
                localStorage.getItem(STORE_KEY_REFRESH_TOKEN)) {
                await this.refreshTokenToAcessToken();
                error.config.headers['Authorization'] = 'Bearer ' + localStorage.getItem(STORE_KEY_ACCESS_TOKEN);
                const result = await this.httpClient.request(error.config);
                return result;
            }
            throw error;
        });
    }
    // Auth FETCH 
    async accessTokenToUserInfo() {
        const accessToken = localStorage.getItem(STORE_KEY_ACCESS_TOKEN);
        if (!accessToken)
            return;
        try {
            const res = await this.httpClient.get("/users/profile", { headers: { "Authorization": "Bearer " + accessToken } });
            console.log(res);
            if (res.data.code === 200) {
                const authInfo = res.data.data;
                this.updateAuthFromAccessToken(authInfo);
            }
        }
        catch (error) {
            this.clearAuthInfo();
            console.log(error);
        }
    }
    async refreshTokenToAcessToken() {
        const refreshToken = localStorage.getItem(STORE_KEY_REFRESH_TOKEN);
        if (!refreshToken) {
            this.clearAuthInfo();
            return;
        }
        try {
            const res = await this.httpClient.post("/auth/refresh-token", { data: { refreshToken } });
            if (res.data.code === 200) {
                const { accessToken, refreshToken } = res.data.data.token;
                this.saveLocalToken(accessToken, refreshToken);
            }
        }
        catch (error) {
            this.clearAuthInfo();
            throw error;
        }
    }
    async loadUserInfoFromToken() {
        await this.accessTokenToUserInfo();
    }
    async register(registerReq) {
        const res = await this.httpClient.post("/auth/register", { data: registerReq });
        if (res.data.code === 201) {
            this.addNotification("info", res.data.message);
            return true;
        }
        return false;
    }
    async logout() {
        if (!this.user) {
            this.clearAuthInfo();
            throw new Error("Bug On Client");
        }
        ;
        await this.httpClient.post('/auth/logout', { headers: { "Authorization": "Bearer " + this.user.accessToken } });
        this.clearAuthInfo();
        return true;
    }
    async login(authReq) {
        const res = await this.httpClient.post('/auth/login', { data: authReq });
        if (res.data.code === 200) {
            const authInfo = res.data.data;
            this.updateAuthFromLogin(authInfo);
        }
    }
    async getAuthInfo() {
        if (!this.user?.accessToken) {
            this.clearAuthInfo();
            throw new Error("AccessToken is not existed");
        }
        const res = await this.httpClient.get("/users/profile", { headers: { "Authorization": "Bearer " + this.user.accessToken } });
        if (res.data.code === 200) {
            return res.data.data;
        }
        throw new Error("Error ON Get Auth Info");
    }
    // OTHER RESOURCE FETCH
    async getPosts(page) {
        const res = await this.httpClient.get("/blogs", { params: { page } });
        return res.data.data;
    }
    async getPostById(id) {
        try {
            const res = await this.httpClient.get("/blogs/" + id);
            return res.data.data;
        }
        catch (error) {
            Router.getIntance().push({ name: "Blog" });
            throw error;
        }
    }
    async getUserInfo(userId) {
        try {
            const res = await this.httpClient.get("/users/" + userId);
            return res.data.data;
        }
        catch (error) {
            Router.getIntance().push({ name: "Blog" });
            throw error;
        }
    }
    async createPost(postReq) {
        if (!this.user?.accessToken) {
            this.clearAuthInfo();
            throw new Error("Error on Authenticate System");
        }
        const res = await this.httpClient.post("/blogs", { data: postReq, headers: { "Authorization": "Bearer " + this.user.accessToken } });
        return res.data.data;
    }
    // UTILS
    updateAuthFromAccessToken(userRes) {
        const accessToken = localStorage.getItem(STORE_KEY_ACCESS_TOKEN);
        const refreshToken = localStorage.getItem(STORE_KEY_REFRESH_TOKEN);
        if (!accessToken || !refreshToken) {
            throw new Error("Error on programing");
        }
        this.user = {
            ...userRes,
            accessToken: accessToken,
            refreshToken: refreshToken
        };
        this.isAuth = true;
        this.notifyAuthStateChange();
    }
    updateAuthFromLogin(authRes) {
        this.user = authRes;
        this.isAuth = true;
        this.notifyAuthStateChange();
        this.saveLocalToken(authRes.accessToken, authRes.refreshToken);
    }
    clearAuthInfo() {
        this.user = undefined;
        this.isAuth = false;
        localStorage.removeItem(STORE_KEY_ACCESS_TOKEN);
        localStorage.removeItem(STORE_KEY_REFRESH_TOKEN);
        this.notifyAuthStateChange();
    }
    saveLocalToken(accessToken, refreshToken) {
        localStorage.setItem(STORE_KEY_REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORE_KEY_ACCESS_TOKEN, accessToken);
        if (this.user) {
            this.user.accessToken = accessToken;
            this.user.refreshToken = refreshToken;
        }
    }
    addNotification(type, message) {
        this.notification.addNotification(type, message);
    }
    notifyAuthStateChange() {
        this.authListeners.forEach(fn => fn());
    }
}
