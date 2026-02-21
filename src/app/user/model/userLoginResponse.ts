export interface UserLoginResponse {
    token: string;
    type: string;
    username: string;
    email: string;
    roles: string[];
}
