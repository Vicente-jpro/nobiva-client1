import { UserLogin } from "./userLogin";

export interface UserSignup extends UserLogin{
  username: string;
  telephone: string;
  passwordConfirmed: string;
  roles: string[];
}
