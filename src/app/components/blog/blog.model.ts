import { User } from '../login/login.model';

export interface MediaFile {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  uploadedAt: string; // ISO date string
}

export interface BlogPost {
  title: string | null;
  content: string | null;
  summary: string | null;
  isPublished: boolean;
}

export interface UpdateBlogPost {
  id: number | null;
  title: string | null;
  content: string | null;
  summary: string | null;
  isPublished: boolean;
}

export interface CommentResponseDto {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: User;
  blogPostId: number;
}

export interface BlogPostResponseDto {
  id: number;
  title: string;
  content: string;
  summary: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  author: User;
  mediaFiles: MediaFile[];
  comments: CommentResponseDto[];
}

export interface FileMetadata {
  id: number;
  fileName: string;
  fileType: string;
  filePath: string;
  fileSize: number;
  uploadedAt: Date;
}

export interface HubBlogData {
  username: string;
  postTitle: string;
}
