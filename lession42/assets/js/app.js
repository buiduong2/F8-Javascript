import { httpClient } from "./index.js";
import { Router } from "./utils/Router.js";
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
        try {
            const user = await httpClient.getAuthInfo(accessToken);
            this.updateAuthFromAccessToken(user);
        }
        catch (error) {
            if (error instanceof Error) {
                this.addNotification("error", error.message);
            }
            else {
                throw error;
            }
        }
    }
    async refreshTokenToAcessToken() {
        try {
            const token = localStorage.getItem(STORE_KEY_REFRESH_TOKEN);
            if (!token)
                throw new Error("Refresh Token is misssing");
            const res = await httpClient.refreshToken(token);
            const { accessToken, refreshToken } = res.token;
            this.saveLocalToken(accessToken, refreshToken);
        }
        catch (error) {
            this.clearAuthInfo();
            this.addNotification("info", "Tài khoản đã đăng xuất do lâu không sử dụng");
            throw new Error("Refresh Token error");
        }
    }
    async loadUserInfoFromToken() {
        try {
            await this.accessTokenToUserInfo();
        }
        catch (error) {
            try {
                await this.refreshTokenToAcessToken();
                this.accessTokenToUserInfo();
            }
            catch (error) {
                console.log("error");
            }
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
        try {
            const res = await httpClient.register(registerReq);
            this.addNotification("success", res.message || "Register Sucessful");
        }
        catch (error) {
            if (error instanceof Response) {
                this.addNotification("warning", (await error.json()).message);
            }
            else {
                this.addNotification("error", "Error on fetching Resgister");
            }
            throw error;
        }
    }
    async logout() {
        if (!this.user) {
            this.clearAuthInfo();
            throw new Error("Bug");
        }
        ;
        const accessToken = this.user.accessToken;
        try {
            const res = await httpClient.logout(accessToken);
            this.clearAuthInfo();
            this.addNotification("success", res.message || "Logout Successful");
            return res;
        }
        catch (error) {
            if (error instanceof Response) {
                return error.json();
            }
            throw error;
        }
    }
    async getAuthInfo() {
        if (this.user?.accessToken) {
            try {
                return await this.tryRefreshTokenOnFailure(() => httpClient.getAuthInfo(this.user?.accessToken || ""));
            }
            catch (error) {
                if (error instanceof Response) {
                    const data = await error.json();
                    this.addNotification("error", data.message);
                }
                throw error;
            }
        }
        else {
            this.clearAuthInfo();
            throw new Error("AccessToken is not existed");
        }
    }
    notifyAuthStateChange() {
        this.authListeners.forEach(fn => fn());
    }
    // AUTH GROUP END
    // OTHER RESOURCE
    async getPosts(page) {
        try {
            return await httpClient.getBlogs(page);
        }
        catch (error) {
            this.addNotification("error", error.message);
            throw error;
        }
    }
    async getUserInfo(userId) {
        try {
            return await httpClient.getProfile(userId);
        }
        catch (error) {
            if (error instanceof Response) {
                const data = await error.json();
                if (data.code === 404) {
                    Router.getIntance().push({ name: "Blog" });
                    this.addNotification("warning", data.message);
                }
                else {
                    this.addNotification("error", data.message);
                }
                throw new Error("Faild on Fetch");
            }
            else {
                this.addNotification("error", error.message);
                throw error;
            }
        }
    }
    async createPost(postReq) {
        if (!this.user?.accessToken) {
            this.clearAuthInfo();
            throw new Error("Error on Authenticate System");
        }
        try {
            const post = await this.tryRefreshTokenOnFailure(() => httpClient.createBlog(postReq, this.user?.accessToken || ""));
            this.addNotification("info", "Create Post Successful");
            return post;
        }
        catch (error) {
            if (error instanceof Response) {
                const data = await error.json();
                this.addNotification("error", data.message);
            }
            throw error;
        }
    }
    // UTILS
    async tryRefreshTokenOnFailure(func) {
        try {
            return await func();
        }
        catch (error) {
            if (error instanceof Response) {
                const data = await error.json();
                console.log("refresh");
                console.log(data.code);
                if (data.code === 401) {
                    await this.refreshTokenToAcessToken();
                    return await func();
                }
            }
            throw error;
        }
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
