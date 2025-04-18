import { createAction, props } from '@ngrx/store';
import {
  BlogPost,
  BlogPostResponseDto,
  UpdateBlogPost,
} from '../../components/blog/blog.model';

//add blog actions
export const addBlogs = createAction(
  '[Blog page] Add Blog',
  props<{ content: BlogPost }>()
);

export const addBlogSuccess = createAction(
  '[Blog API] Add Blog Success',
  props<{ blog: BlogPostResponseDto }>()
);

export const addBlogFailure = createAction(
  '[Blog API] Add Blog Failure',
  props<{ error: string }>()
);

// Delete blog actions
export const deleteBlog = createAction(
  '[Blog Page] Delete Blog',
  props<{ id: number }>()
);

export const deleteBlogSuccess = createAction(
  '[Blog API] Delete Blog Success',
  props<{ id: number }>()
);

export const deleteBlogFailure = createAction(
  '[Blog API] Delete Blog Failure',
  props<{ error: string }>()
);

//load blog actions
export const loadBlogs = createAction(
  '[Blog page] Load Blogs',
  props<{ id: number; searchQuery: string }>()
);

export const loadBlogsSuccess = createAction(
  '[Blog API] Load Blogs Success',
  props<{ blogs: BlogPostResponseDto[] }>()
);

export const loadBlogsFailure = createAction(
  '[Blog API] Load Blogs Failure',
  props<{ error: string }>()
);

// Update blog actions
export const updateBlog = createAction(
  '[Blog Page] Update Blog',
  props<{ id: number; blog: UpdateBlogPost }>()
);

export const updateBlogSuccess = createAction(
  '[Blog API] Update Blog Success',
  props<{ blog: BlogPostResponseDto }>()
);

export const updateBlogFailure = createAction(
  '[Blog API] Update Blog Failure',
  props<{ error: string }>()
);
