import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastService } from '../../../shared/toast/toast.service';
import { CommentResponseDto, CreateComment } from '../comment.model';
import { Store } from '@ngrx/store';
import {
  addComment,
  addCommentFailure,
  addCommentSuccess,
} from '../../../../state/comments/comment.actions';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './comment-form.component.html',
  styleUrl: './comment-form.component.css',
})
export class CommentFormComponent implements OnInit {
  blogPostId = input<number>();

  private fb = inject(FormBuilder);
  private toastService = inject(ToastService);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly destroyRef = inject(DestroyRef);

  commentForm: FormGroup = this.fb.group({
    content: ['', [Validators.required, Validators.minLength(3)]],
  });

  ngOnInit(): void {
    this.actions$
      .pipe(
        ofType(addCommentSuccess),
        takeUntilDestroyed(this.destroyRef),
        take(1)
      )
      .subscribe((commentResponse) => {
        console.log('The response is', commentResponse.comment);
        this.commentForm.reset();
        this.toastService.showSuccess('Comment added successfully');
      });

    this.actions$
      .pipe(
        ofType(addCommentFailure),
        takeUntilDestroyed(this.destroyRef),
        take(1)
      )
      .subscribe((response) => {
        console.log('The response is', response.error);
        this.commentForm.reset();
        this.toastService.showError('Error adding comment');
      });
  }

  submitComment() {
    console.log('Submit comment clicked');
    if (this.commentForm.valid) {
      const newComment: CreateComment = {
        content: this.commentForm.value.content,
        blogPostId: this.blogPostId()!,
      };

      console.log('The new comment is', newComment);

      this.store.dispatch(
        addComment({
          comment: newComment,
        })
      );

      console.log('The comment is dispatched');
    }
  }
}
