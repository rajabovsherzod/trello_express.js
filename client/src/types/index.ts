export interface IUser {
    id: string
    username: string
    email: string
}

export interface UserResponse {
    user: IUser
    accessToken: string
}
