// blog.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { BlogPostResponseDto } from '../../components/blog/blog.model';
import * as BlogActions from './blog.actions';

export interface BlogState {
  blogs: BlogPostResponseDto[];
  error: string | null;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: BlogState = {
  blogs: [],
  error: null,
  status: 'pending',
};

export const blogReducer = createReducer(
  initialState,

  // Add blog
  on(BlogActions.addBlogs, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),

  on(BlogActions.addBlogSuccess, (state, { blog }) => ({
    ...state,
    blogs: [...state.blogs, blog],
    status: 'success' as const,
    error: null,
  })),

  on(BlogActions.addBlogFailure, (state, { error }) => ({
    ...state,
    status: 'error' as const,
    error,
  })),

  // Load blogs
  on(BlogActions.loadBlogs, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),

  on(BlogActions.loadBlogsSuccess, (state, { blogs }) => ({
    ...state,
    blogs,
    status: 'success' as const,
    error: null,
  })),

  on(BlogActions.loadBlogsFailure, (state, { error }) => ({
    ...state,
    status: 'error' as const,
    error,
  })),

  // Delete blog
  on(BlogActions.deleteBlog, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),

  on(BlogActions.deleteBlogSuccess, (state, { id }) => ({
    ...state,
    blogs: state.blogs.filter((blog) => blog.id !== id),
    status: 'success' as const,
    error: null,
  })),

  on(BlogActions.deleteBlogFailure, (state, { error }) => ({
    ...state,
    status: 'error' as const,
    error,
  })),

  // Update blog
  on(BlogActions.updateBlog, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),

  on(BlogActions.updateBlogSuccess, (state, { blog }) => ({
    ...state,
    blogs: state.blogs.map((existingBlog) =>
      existingBlog.id === blog.id ? blog : existingBlog
    ),
    status: 'success' as const,
    error: null,
  })),

  on(BlogActions.updateBlogFailure, (state, { error }) => ({
    ...state,
    status: 'error' as const,
    error,
  }))
);
