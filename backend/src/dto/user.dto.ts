export interface CreateUserDTO {
    email: string,
    name: string,
    password: string,
    zone: string,
    locale: string,
    phone: string,
}

export interface AuthUserDTO {
    email: string,
    password: string,
}

export interface UserTokenDTO {
    email: string,
    token: string,
}