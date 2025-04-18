import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BlogState } from './blog.reducer';

// This is safer as it uses NgRx's feature selector
export const selectBlogsState = createFeatureSelector<BlogState>('blogs');

export const selectAllBlogs = createSelector(
  selectBlogsState,
  (state: BlogState) => state?.blogs || []
);

export const selectBlogStatus = createSelector(
  selectBlogsState,
  (state) => state?.status === 'loading'
);

export const selectBlogError = createSelector(
  selectBlogsState,
  (state) => state?.error
);

// Additional selectors
export const selectBlogById = (id: number) =>
  createSelector(selectAllBlogs, (blogs) =>
    blogs.find((blog) => blog.id === id)
  );

export const selectIsLoading = createSelector(
  selectBlogsState,
  (state) => state?.status === 'loading'
);
