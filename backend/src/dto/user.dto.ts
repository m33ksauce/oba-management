export interface CreateUserDTO {
    email: string,
    name: string,
    password: string,
}

export interface ReadUserDTO {
    email: string,
    default_translation: string,
    default_translation_current_version: string,
    available_translations: string[],
}

export interface AuthUserDTO {
    email: string,
    password: string,
}

export interface UserTokenDTO {
    email: string,
    token: string,
}
