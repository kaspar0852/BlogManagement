import { User } from '../../login/login.model';

export interface Comment {
  content: string;
}

export interface CommentResponseDto {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  blogPostId: number;
}

export interface CreateComment {
  content: string;
  blogPostId: number;
}
