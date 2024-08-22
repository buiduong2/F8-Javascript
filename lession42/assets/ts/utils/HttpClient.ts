import { AuthReq, PostReq, PostRes, RegisterReq, Res } from "../types/type";

export class HttpClient {

    private readonly BASE_URL: string;

    constructor(apiServer: string) {
        this.BASE_URL = apiServer;
    }

    public async getBlogs(page: number = 1): Promise<Res> {
        const res = await fetch(`${this.BASE_URL}/blogs?page=${page}`);
        return res.json();
    }

    public async createBlog(body: PostReq, accessToken: string): Promise<Res> {
        const res = await fetch(`${this.BASE_URL}/blogs`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify(body)
        })
        return res.json();
    }

    public async getProfile(id: string): Promise<Res> {
        const res = await fetch(`${this.BASE_URL}/users/${id}`, {
            method: "GET"
        })

        return res.json();
    }

    public async getAuthInfo(accessToken: string): Promise<Res> {
        const res = await fetch(`${this.BASE_URL}/users/profile`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })

        return res.json();
    }



    public async login(loginReq: AuthReq): Promise<Res> {

        const res = await fetch(`${this.BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginReq)
        })
        return await res.json();

    }

    public async register(registerReq: RegisterReq): Promise<Res> {
        const res = await fetch(`${this.BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerReq)
        })

        return await res.json();;
    }

    public async logout(accessToken: string): Promise<Res> {
        const res = await fetch(`${this.BASE_URL}/auth/logout`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            },
        })
        return res.json();

    }

    public async refreshToken(refreshToken: string): Promise<Res> {
        const res = await fetch(`${this.BASE_URL}/auth/refresh-token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ refreshToken })
        })

        return res.json();
    }

    static isSuccessful(res: Res): boolean {
        return res.code >= 200 && res.code <= 299;
    }
    static isClientError(res: Res): boolean {
        return res.code >= 400 && res.code <= 499;
    }
    static isServerError(res: Res): boolean {
        return res.code >= 500
    }
}