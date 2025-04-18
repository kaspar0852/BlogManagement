export interface SignupRequestDto {
  username: string | null;
  email: string | null;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
  profilePicture: File | null;
}

export interface SignupResponseDto {
  username: string;
  token: string;
  email: string;
}
