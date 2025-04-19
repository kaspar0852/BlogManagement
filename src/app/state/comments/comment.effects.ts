import { inject, Injectable } from '@angular/core';
import { CommentService } from '../../components/blog/comment/comment.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class CommentEffects {
  private commentService = inject(CommentService);
  private actions$ = inject(Actions);

  addComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addComment),
      mergeMap((action) =>
        this.commentService.createComment(action.comment).pipe(
          map((comment) => addCommentSuccess({ comment })),
          catchError((error) => of(addCommentFailure({ error: error.message })))
        )
      )
    )
  );

  loadComments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadComments),
      mergeMap((action) =>
        this.commentService.getCommentsByBlogId(action.blogId).pipe(
          map((comments) => loadCommentsSuccess({ comments })),
          catchError((error) =>
            of(
              loadCommentsFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );

  deleteComment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteComment),
      mergeMap((action) =>
        this.commentService.deleteComment(action.id).pipe(
          map(() => deleteCommentSuccess({ id: action.id })),
          catchError((error) =>
            of(deleteCommentFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
