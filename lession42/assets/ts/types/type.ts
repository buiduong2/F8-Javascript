import { PageAbstract } from "../pages/PageAbstract.js";

export type Res = {
    code: number;
    status_code: string;
    message?: string;
    data?: any;
}

export type ErrorRes = {
    code: number,
    status_code: string,
    message: string
}

export type PostReq = {
    title: string,
    content: string,
}

export type PostRes = {
    _id: string,
    content: string,
    createdAt: string,
    timeUp: string,
    title: string,
    userId: {
        _id: string,
        name: string,
    }
}

export type UserRes = {
    _id: string,
    name: string,
    email: string,
    avatar: string,
    role:string,
    blogs: {
        _id: string,
        title: string,
        content:string,
        userId: string,
        createdAt: string,

    }[],
    createdAt: string,
    updatedAt: string
}

export type AuthReq = {
    email: string,
    password: string
}

export type AuthRes = {
    _id: string,
    name: string,
    email: string,
    createdAt: string,
    updatedAt: string,
    accessToken: string,
    refreshToken: string
}

export type RegisterReq = {
    email: string,
    password: string,
    name: string
}

export type RefreshTokenReq = {
    refreshToken: string
}

export type RefreshTokenRes = {
    token: {
        accessToken: string,
        refreshToken: string
    }
}

export type Route = {
    name: string,
    ctor: SubClassType<PageAbstract>,
    path: string;
    meta?: MetaRoute;
    props?: boolean;
    dynamic?: boolean;
}

export type MetaRoute = {
    [key: string]: any,
    requiredGuest?: boolean,
    requiredAuth?: boolean,
}

export type RouteOption = {
    name: string,
    params?: { id: string }
    query?: { [key: string]: string | undefined }
}

export type SubClassType<T extends PageAbstract> = new (...args: any[]) => T;
