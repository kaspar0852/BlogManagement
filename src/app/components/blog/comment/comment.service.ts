import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { Comment, CommentResponseDto, CreateComment } from './comment.model';
import { EnvService } from '../../../services/env.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private envService = inject(EnvService);

  private readonly apiBaseUrl = this.envService.getApiBaseUrl();
  private readonly commentsUrl = `${this.apiBaseUrl}/Comments`;

  getCommentsByBlogId(blogId: number): Observable<CommentResponseDto[]> {
    return this.http
      .get<CommentResponseDto[]>(`${this.commentsUrl}/blog/${blogId}`)
      .pipe(
        catchError((error) => {
          console.error('Error fetching comments:', error);
          return throwError(() => error);
        })
      );
  }

  createComment(
    createCommentDto: CreateComment
  ): Observable<CommentResponseDto> {
    return this.http
      .post<CommentResponseDto>(`${this.commentsUrl}`, createCommentDto)
      .pipe(
        catchError((error) => {
          console.error('Error creating comment:', error);
          return throwError(() => error);
        })
      );
  }

  deleteComment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.commentsUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting comment:', error);
        return throwError(() => error);
      })
    );
  }
}
