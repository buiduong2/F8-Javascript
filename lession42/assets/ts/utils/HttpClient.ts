import { AuthReq, PostReq, PostRes, RefreshTokenRes, RegisterReq, Res, UserRes } from "../types/type";

export class HttpClient {

    private readonly BASE_URL: string;

    constructor(apiServer: string) {
        this.BASE_URL = apiServer;
    }

    public async getBlogs(page: number = 1): Promise<PostRes[]> {
        const res = await fetch(`${this.BASE_URL}/blogs?page=${page}`);
        if (!res.ok) throw res;
        const data = await res.json();
        if (data.code === 200) {
            return data.data as PostRes[];
        } else {
            throw new Error("Status !== 200");
        }
    }

    public async createBlog(body: PostReq, accessToken: string): Promise<PostRes> {
        const res = await fetch(`${this.BASE_URL}/blogs`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })

        if (!res.ok) throw res;

        const data = await res.json();

        if (data.code === 200) {
            return data.data;
        } else {
            throw new Error("code !== 200");
        }
    }

    public async getProfile(id: string): Promise<UserRes> {
        const res = await fetch(`${this.BASE_URL}/users/${id}`, {
            method: "GET"
        })

        if (!res.ok) throw res;
        const data = await res.json();

        if (data.code === 200) {
            return data.data;
        } else {
            throw new Error("Status !== 200 ")
        }
    }

    public async getAuthInfo(accessToken: string): Promise<UserRes> {
        const res = await fetch(`${this.BASE_URL}/users/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        if (!res.ok) throw res;

        const data = await res.json();

        return data.data;
    }



    public async login(loginReq: AuthReq): Promise<any> {
        try {
            const res = await fetch(`${this.BASE_URL}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginReq)
            })
            return await res.json();

        } catch (error) {
            throw new Error("Error On fetching Login")
        }
    }

    public async register(registerReq: RegisterReq): Promise<Res> {
        const res = await fetch(`${this.BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerReq)
        })
        if (!res.ok) throw res;

        const data = await res.json();
        return data;
    }

    public async logout(accessToken: string): Promise<Res> {
        const res = await fetch(`${this.BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        })
        if (!res.ok) throw res;
        return res.json();

    }

    public async refreshToken(refreshToken: string): Promise<RefreshTokenRes> {
        const res = await fetch(`${this.BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refreshToken })
        })

        if (!res.ok) throw new Error("Fail To Fetch");

        const data = await res.json();

        if (data.code === 200) {
            return data.data;
        } else {
            throw new Error("Fail to Authenticated");
        }
    }
}