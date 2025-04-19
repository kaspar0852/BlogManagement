import { createReducer, on } from '@ngrx/store';
import { CommentResponseDto } from '../../components/blog/blog.model';
import {
  addComment,
  addCommentFailure,
  addCommentSuccess,
  deleteComment,
  deleteCommentFailure,
  deleteCommentSuccess,
  loadComments,
  loadCommentsFailure,
  loadCommentsSuccess,
} from './comment.actions';

export interface CommentState {
  comments: CommentResponseDto[];
  error: string | null;
  status: 'pending' | 'loading' | 'error' | 'success';
}

export const initialState: CommentState = {
  comments: [],
  error: null,
  status: 'pending',
};

export const commentReducer = createReducer(
  initialState,
  on(addComment, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),

  on(addCommentSuccess, (state, { comment }) => ({
    ...state,
    status: 'success' as const,
    comments: [...state.comments, comment],
    error: null,
  })),
  on(addCommentFailure, (state, { error }) => ({
    ...state,
    status: 'error' as const,
    error: error,
  })),
  on(deleteComment, (state, { id }) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),
  on(deleteCommentSuccess, (state, { id }) => ({
    ...state,
    comments: state.comments.filter((comment) => comment.id !== id),
    status: 'success' as const,
    error: null,
  })),
  on(deleteCommentFailure, (state, { error }) => ({
    ...state,
    status: 'error' as const,
    error: error,
  })),
  on(loadComments, (state) => ({
    ...state,
    status: 'loading' as const,
    error: null,
  })),

  on(loadCommentsSuccess, (state, { comments }) => ({
    ...state,
    comments,
    status: 'success' as const,
    error: null,
  })),

  on(loadCommentsFailure, (state, { error }) => ({
    ...state,
    status: 'error' as const,
    error,
  }))
);
