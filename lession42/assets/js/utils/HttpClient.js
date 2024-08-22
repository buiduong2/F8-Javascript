export class HttpClient {
    constructor(apiServer) {
        this.BASE_URL = apiServer;
    }
    async getBlogs(page = 1) {
        const res = await fetch(`${this.BASE_URL}/blogs?page=${page}`);
        if (!res.ok)
            throw res;
        const data = await res.json();
        if (data.code === 200) {
            return data.data;
        }
        else {
            throw new Error("Status !== 200");
        }
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
        if (!res.ok)
            throw res;
        const data = await res.json();
        if (data.code === 200) {
            return data.data;
        }
        else {
            throw new Error("code !== 200");
        }
    }
    async getProfile(id) {
        const res = await fetch(`${this.BASE_URL}/users/${id}`, {
            method: "GET"
        });
        if (!res.ok)
            throw res;
        const data = await res.json();
        if (data.code === 200) {
            return data.data;
        }
        else {
            throw new Error("Status !== 200 ");
        }
    }
    async getAuthInfo(accessToken) {
        const res = await fetch(`${this.BASE_URL}/users/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        if (!res.ok)
            throw res;
        const data = await res.json();
        return data.data;
    }
    async login(loginReq) {
        try {
            const res = await fetch(`${this.BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginReq)
            });
            return await res.json();
        }
        catch (error) {
            throw new Error("Error On fetching Login");
        }
    }
    async register(registerReq) {
        const res = await fetch(`${this.BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerReq)
        });
        if (!res.ok)
            throw res;
        const data = await res.json();
        return data;
    }
    async logout(accessToken) {
        const res = await fetch(`${this.BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        });
        if (!res.ok)
            throw res;
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
        if (!res.ok)
            throw new Error("Fail To Fetch");
        const data = await res.json();
        if (data.code === 200) {
            return data.data;
        }
        else {
            throw new Error("Fail to Authenticated");
        }
    }
}
