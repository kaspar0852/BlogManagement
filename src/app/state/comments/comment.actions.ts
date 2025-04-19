import { createAction, props } from '@ngrx/store';
import {
  CommentResponseDto,
  CreateComment,
} from '../../components/blog/comment/comment.model';

export const addComment = createAction(
  '[Comment Page] Add Comment',
  props<{ comment: CreateComment }>()
);

export const addCommentSuccess = createAction(
  '[Comment API] Add Comment Success',
  props<{ comment: CommentResponseDto }>()
);

export const addCommentFailure = createAction(
  '[Comment API] Add Comment Failure',
  props<{ error: string }>()
);

export const deleteComment = createAction(
  '[Comment Page] Delete Comment',
  (id: number) => ({ id })
);
export const deleteCommentSuccess = createAction(
  '[Comment API] Delete Comment Success',
  props<{ id: number }>()
);
export const deleteCommentFailure = createAction(
  '[Comment API] Delete Comment Failure',
  props<{ error: string }>()
);
export const loadComments = createAction(
  '[Comment Page] Load Comments',
  props<{ blogId: number }>()
);
export const loadCommentsSuccess = createAction(
  '[Comment API] Load Comments Success',
  props<{ comments: CommentResponseDto[] }>()
);
export const loadCommentsFailure = createAction(
  '[Comment API] Load Comments Failure',
  props<{ error: string }>()
);
