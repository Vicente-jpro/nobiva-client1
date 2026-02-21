import { UserEmail } from "./UserEmail";

export interface UserLogin extends UserEmail {
  password: string;
}