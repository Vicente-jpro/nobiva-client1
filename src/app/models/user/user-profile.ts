export interface UserProfile {
  id: string;
  username: string;
  email: string;
}

export interface UserUpdateRequest {
  username: string;
  email: string;
  currentPassword?: string;
}
