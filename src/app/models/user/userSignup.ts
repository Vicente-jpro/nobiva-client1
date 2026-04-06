import { UserLogin } from "./userLogin";

export interface UserSignup extends UserLogin{
  username: string;
  passwordConfirmed: string;
  roles: string[];
}