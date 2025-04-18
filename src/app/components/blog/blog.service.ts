import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import {
  BlogPost,
  BlogPostResponseDto,
  FileMetadata,
  UpdateBlogPost,
} from './blog.model';

@Injectable({ providedIn: 'root' })
export class BlogService {
  //Dependency injections
  private http = inject(HttpClient);

  //definations
  public readonly rootUrl = 'http://localhost:5239/api';
  private readonly blogPostsUrl = `${this.rootUrl}/BlogPosts`;
  private readonly mediaFilesUrl = `${this.rootUrl}/MediaFiles`;

  //methods
  getBlogPosts(searchQuery: string | null): Observable<BlogPostResponseDto[]> {
    return this.http
      .get<BlogPostResponseDto[]>(`${this.blogPostsUrl}?search=${searchQuery}`)
      .pipe(
        catchError((error) => {
          console.error(error);
          return of([]);
        })
      );
  }

  createBlogPost(blogPost: BlogPost): Observable<BlogPostResponseDto> {
    return this.http
      .post<BlogPostResponseDto>(this.blogPostsUrl, blogPost)
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(() => error);
        })
      );
  }

  getBlogPostById(id: number): Observable<BlogPostResponseDto> {
    return this.http
      .get<BlogPostResponseDto>(`${this.blogPostsUrl}/${id}`)
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(() => error);
        })
      );
  }

  updateBlogPost(
    id: number | null,
    blogPost: UpdateBlogPost
  ): Observable<BlogPostResponseDto> {
    return this.http
      .put<BlogPostResponseDto>(`${this.blogPostsUrl}/${id}`, blogPost)
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(() => error);
        })
      );
  }

  deleteBlogPost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.blogPostsUrl}/${id}`).pipe(
      catchError((error) => {
        console.error(error);
        throw error;
      })
    );
  }

  getBlogPostsByUser(
    userId: number | null,
    searchQuery: string
  ): Observable<BlogPostResponseDto[]> {
    return this.http
      .get<BlogPostResponseDto[]>(
        `${this.blogPostsUrl}/my-posts?userId=${userId}&Search=${searchQuery}`
      )
      .pipe(
        catchError((error) => {
          console.error(error);
          return of([]);
        })
      );
  }

  uploadCoverImage(id: number, formData: FormData): Observable<FileMetadata> {
    console.log('Uploading cover image');
    console.log(formData);
    return this.http
      .post<FileMetadata>(`${this.mediaFilesUrl}/upload/${id}`, formData)
      .pipe(
        catchError((error) => {
          console.error(error);
          return throwError(() => error);
        })
      );
  }
}
