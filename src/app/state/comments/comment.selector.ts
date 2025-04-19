import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CommentState } from './comment.reducer';

export const selectCommentsState =
  createFeatureSelector<CommentState>('comments');

export const selectAllComments = createSelector(
  selectCommentsState,
  (state: CommentState) => state?.comments || []
);

export const selectCommentIsLoading = createSelector(
  selectCommentsState,
  (state) => state?.status === 'loading'
);

export const selectCommentError = createSelector(
  selectCommentsState,
  (state) => state?.error
);
