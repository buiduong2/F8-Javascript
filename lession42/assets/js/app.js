import { httpClient } from "./index.js";
import { Router } from "./utils/Router.js";
import { HttpClient } from "./utils/HttpClient.js";
const STORE_KEY_ACCESS_TOKEN = "ACCESS_TOKEN";
const STORE_KEY_REFRESH_TOKEN = "REFRESH_TOKEN";
export class Store {
    constructor() {
        this.isAuth = false;
        this.posts = [];
        this.authListeners = [];
        this.notification = document.querySelector("app-notification");
    }
    // Auth GROUP BEGIN
    async accessTokenToUserInfo() {
        const accessToken = localStorage.getItem(STORE_KEY_ACCESS_TOKEN);
        if (!accessToken)
            return;
        const res = await httpClient.getAuthInfo(accessToken);
        if (HttpClient.isSuccessful(res)) {
            this.updateAuthFromAccessToken(res.data);
            return;
        }
        throw new Error("Error on retrive userInfo from AccessToken");
    }
    async refreshTokenToAcessToken() {
        const token = localStorage.getItem(STORE_KEY_REFRESH_TOKEN);
        if (!token)
            throw new Error("Refresh Token is misssing");
        const res = await httpClient.refreshToken(token);
        if (HttpClient.isSuccessful(res)) {
            const { accessToken, refreshToken } = res.data.token;
            this.saveLocalToken(accessToken, refreshToken);
        }
        else if (HttpClient.isClientError(res)) {
            this.clearAuthInfo();
            this.addNotification("info", "Tài khoản đã đăng xuất do lâu không sử dụng");
        }
        else {
            throw new Error("Error on retrive userInfo from Refresh Token ");
        }
    }
    async loadUserInfoFromToken() {
        try {
            await this.accessTokenToUserInfo();
        }
        catch (error) {
            console.log(error);
            await this.refreshTokenToAcessToken();
            this.accessTokenToUserInfo();
        }
    }
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
    async register(registerReq) {
        const res = await httpClient.register(registerReq);
        if (HttpClient.isSuccessful(res)) {
            this.addNotification("success", res.message || "Register Sucessful");
            return true;
        }
        else if (HttpClient.isClientError(res)) {
            this.addNotification("warning", res.message || "Register Error On Client");
        }
        else {
            this.addNotification("error", res.message || "Register Error On Server");
        }
        return false;
    }
    async logout() {
        if (!this.user) {
            this.clearAuthInfo();
            throw new Error("Bug On Client");
        }
        ;
        const accessToken = this.user.accessToken;
        const res = await httpClient.logout(accessToken);
        if (HttpClient.isSuccessful(res)) {
            this.clearAuthInfo();
            this.addNotification("success", res.message || "Logout Successful");
            return true;
        }
        else if (HttpClient.isClientError(res)) {
            this.addNotification("warning", res.message || "Logout Failure may be you need refresh browser");
        }
        else if (HttpClient.isServerError(res)) {
            this.addNotification("error", res.message || "Server Error");
        }
        return false;
    }
    async getAuthInfo() {
        if (!this.user?.accessToken) {
            this.clearAuthInfo();
            throw new Error("AccessToken is not existed");
        }
        const res = await this.tryRefreshTokenOnFailure(() => httpClient.getAuthInfo(this.user?.accessToken || ""));
        if (HttpClient.isSuccessful(res)) {
            return res.data;
        }
        this.addNotification("error", res.message || "Fialed From Fetching Auth Info");
        throw new Error(res.message);
    }
    notifyAuthStateChange() {
        this.authListeners.forEach(fn => fn());
    }
    // AUTH GROUP END
    // OTHER RESOURCE
    async getPosts(page) {
        const res = await httpClient.getBlogs(page);
        if (HttpClient.isSuccessful(res)) {
            return res.data;
        }
        else {
            this.addNotification("error", res.message || "Error On Fetching Posts");
        }
        throw new Error("Error On Fetching Post");
    }
    async getUserInfo(userId) {
        const data = await httpClient.getProfile(userId);
        if (HttpClient.isSuccessful(data)) {
            return data.data;
        }
        else if (HttpClient.isClientError(data)) {
            Router.getIntance().push({ name: "Blog" });
            this.addNotification("warning", data.message || "Không tìm thấy người dùng");
        }
        else {
            this.addNotification("error", data.message || "Error On Server");
        }
        throw new Error("Failed From Fetching User Info");
    }
    async createPost(postReq) {
        if (!this.user?.accessToken) {
            this.clearAuthInfo();
            throw new Error("Error on Authenticate System");
        }
        const res = await this.tryRefreshTokenOnFailure(() => httpClient.createBlog(postReq, this.user?.accessToken || ""));
        if (HttpClient.isSuccessful(res)) {
            this.addNotification("info", "Create Post Successful");
            return res.data;
        }
        this.addNotification("error", res.message || "Failed Froming Create Post");
        throw new Error(res.message);
    }
    // UTILS
    async tryRefreshTokenOnFailure(func) {
        const res = await func();
        if (HttpClient.isSuccessful(res)) {
            return res;
        }
        else if (res.code === 401) {
            await this.refreshTokenToAcessToken();
            const res = await func();
            return res;
        }
        this.addNotification("error", res.message);
        throw new Error(res.message);
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
}
