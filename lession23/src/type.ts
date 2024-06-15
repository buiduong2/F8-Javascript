//Ex01

export interface ErrorField {
    [rule: string]: string
}

export interface ValidateRule {
    [key: string]: ErrorField
}


//Ex02

export interface Customer {
    name: string,
    age: number,
    address: string
    shortName?: string
}

//Ex03

export interface User {
    name: string,
    password: string,
    email: string,
    role?: string
}

export interface Validator {
    [key: string]: () => boolean
}

export interface ValidatorOption {
    required: (this: any, value: string) => boolean,
    min: (this: any, value: string, size: number) => boolean,
    email: (this: any, value: string) => boolean,
    unique: (this: any, value: string, field: string, collectionName: string) => boolean,
    same: (this: any, value: string, otherField: string) => boolean,
    [key: string]: (this: any, value: string, ...optionalParams: any[]) => boolean
}

export interface AuthResponse {
    type: "Accept" | "UnAccept" | "Error",
    data: User | string[]
}

export interface InvalidField {
    field: string;
    options: string[]
}

export interface ValidateDetail {
    isValid: boolean,
    errorMsgs: string[]
}