export class HttpClient {
    constructor(apiServer) {
        this.BASE_URL = apiServer;
    }
    async getBlogs(page = 1) {
        const res = await fetch(`${this.BASE_URL}/blogs?page=${page}`);
        return res.json();
    }
    async createBlog(body, accessToken) {
        const res = await fetch(`${this.BASE_URL}/blogs`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        });
        return res.json();
    }
    async getProfile(id) {
        const res = await fetch(`${this.BASE_URL}/users/${id}`, {
            method: "GET"
        });
        return res.json();
    }
    async getAuthInfo(accessToken) {
        const res = await fetch(`${this.BASE_URL}/users/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return res.json();
    }
    async login(loginReq) {
        const res = await fetch(`${this.BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginReq)
        });
        return await res.json();
    }
    async register(registerReq) {
        const res = await fetch(`${this.BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerReq)
        });
        return await res.json();
        ;
    }
    async logout(accessToken) {
        const res = await fetch(`${this.BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        });
        return res.json();
    }
    async refreshToken(refreshToken) {
        const res = await fetch(`${this.BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refreshToken })
        });
        return res.json();
    }
    static isSuccessful(res) {
        return res.code >= 200 && res.code <= 299;
    }
    static isClientError(res) {
        return res.code >= 400 && res.code <= 499;
    }
    static isServerError(res) {
        return res.code >= 500;
    }
}
