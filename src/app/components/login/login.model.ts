export interface LoginRequestDto {
  email: string | null;
  password: string | null;
}

export interface LoginResponseDto {
  user: User;
  token: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  profilePicturePath?: string | null;
}

export interface UserState {
  user: User;
  token: string;
  isLoggedIn: boolean;
}
