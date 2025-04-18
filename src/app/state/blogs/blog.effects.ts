import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { BlogService } from '../../components/blog/blog.service';
import {
  addBlogFailure,
  addBlogs,
  addBlogSuccess,
  deleteBlog,
  deleteBlogFailure,
  deleteBlogSuccess,
  loadBlogs,
  loadBlogsFailure,
  loadBlogsSuccess,
  updateBlog,
  updateBlogFailure,
  updateBlogSuccess,
} from './blog.actions';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

@Injectable()
export class BlogEffects {
  private actions$ = inject(Actions);
  private blogService = inject(BlogService);

  addBlog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBlogs),
      mergeMap((action) =>
        this.blogService.createBlogPost(action.content).pipe(
          map((blog) => addBlogSuccess({ blog })),
          catchError((error) => of(addBlogFailure({ error: error.message })))
        )
      )
    )
  );

  // Load Blogs
  loadBlogs$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadBlogs),
      switchMap((action) =>
        this.blogService.getBlogPostsByUser(action.id, action.searchQuery).pipe(
          map((blogs) => loadBlogsSuccess({ blogs })),
          catchError((error) =>
            of(
              loadBlogsFailure({
                error: error.message || 'Failed to load blog posts',
              })
            )
          )
        )
      )
    )
  );

  // Delete Blog
  deleteBlog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteBlog),
      mergeMap((action) =>
        this.blogService.deleteBlogPost(action.id).pipe(
          map(() => deleteBlogSuccess({ id: action.id })),
          catchError((error) =>
            of(
              deleteBlogFailure({
                error: error.message || 'Failed to delete blog post',
              })
            )
          )
        )
      )
    )
  );

  // Update Blog
  updateBlog$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateBlog),
      mergeMap((action) =>
        this.blogService.updateBlogPost(action.id, action.blog).pipe(
          map((blog) => updateBlogSuccess({ blog })),
          catchError((error) =>
            of(
              updateBlogFailure({
                error: error.message || 'Failed to update blog post',
              })
            )
          )
        )
      )
    )
  );
}
