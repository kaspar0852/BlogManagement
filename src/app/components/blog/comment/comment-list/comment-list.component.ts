import {
  Component,
  DestroyRef,
  Input,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentResponseDto } from '../comment.model';
import { CommentService } from '../comment.service';
import { ToastService } from '../../../shared/toast/toast.service';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  selectAllComments,
  selectCommentError,
  selectCommentIsLoading,
} from '../../../../state/comments/comment.selector';
import { loadComments } from '../../../../state/comments/comment.actions';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, CommentFormComponent],
  templateUrl: './comment-list.component.html',
  styleUrl: './comment-list.component.css',
})
export class CommentListComponent implements OnInit {
  //definations
  blogPostId = input<number>();
  comments = signal<CommentResponseDto[]>([]);

  //DI
  private commentService = inject(CommentService);
  private toastService = inject(ToastService);
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  currentUserId = 1; // For demo purposes - should come from auth service

  ngOnInit(): void {
    console.log('BlogPostId:', this.blogPostId());
    this.setupStoreSuscription();

    if (this.blogPostId()) {
      this.store.dispatch(loadComments({ blogId: this.blogPostId()! }));
    }
  }

  private setupStoreSuscription(): void {
    console.log('Setting up store subscriptions');
    this.store
      .select(selectAllComments)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((comments) => this.comments.set(comments));

    this.store
      .select(selectCommentIsLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isLoading) => {
        if (isLoading) {
          this.toastService.showInfo('Loading comments...');
        }
      });

    this.store
      .select(selectCommentError)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => {
        if (error) {
          this.toastService.showError('Failed to load comments');
        }
      });
  }

  deleteComment(commentId: number) {
    this.commentService.deleteComment(commentId).subscribe({
      next: () => {
        this.comments.update((currentComments) =>
          currentComments.filter((comment) => comment.id !== commentId)
        );
        this.toastService.showSuccess('Comment deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting comment:', error);
        this.toastService.showError('Failed to delete comment');
      },
    });
  }
}
