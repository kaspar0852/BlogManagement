import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EMPTY, Subscription, catchError, finalize, take, tap } from 'rxjs';

import { BlogService } from '../blog.service';
import { BlogPostResponseDto, HubBlogData } from '../blog.model';
import { LoginService } from '../../login/login.service';
import { ToastService } from '../../shared/toast/toast.service';
import { ModalComponent } from '../../shared/modal/modal.component';
import { EditBlogComponent } from '../edit-blog/edit-blog.component';
import { Store } from '@ngrx/store';
import {
  selectAllBlogs,
  selectBlogError,
  selectIsLoading,
} from '../../../state/blogs/blog.selector';
import {
  deleteBlog,
  deleteBlogSuccess,
  loadBlogs,
  updateBlog,
} from '../../../state/blogs/blog.actions';
import { Actions, ofType } from '@ngrx/effects';
import { SignalRService } from '../../../services/signalr.service';
import { LoggerService } from '../../../services/logger.service';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    DatePipe,
    ModalComponent,
    EditBlogComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.css',
})
export class BlogListComponent implements OnInit {
  // Dependency injection
  private readonly toastService = inject(ToastService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly loginService = inject(LoginService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly toastr = inject(ToastService);
  private readonly signalRService = inject(SignalRService);
  private readonly logger = inject(LoggerService);

  // Reactive state
  readonly blogPosts = signal<BlogPostResponseDto[]>([]);
  readonly isEditModalOpen = signal<boolean>(false);
  readonly selectedBlogPost = signal<BlogPostResponseDto | null>(null);
  readonly isLoading = signal<boolean>(false);
  private signalRSubscription?: Subscription;

  // Form controls
  readonly searchFormControl = this.formBuilder.control('');

  ngOnInit(): void {
    this.loadUserData();
    this.setupStoreSubscriptions();

    //notification
    this.signalRService.startConnection();

    this.signalRSubscription = this.signalRService.newBlog$.subscribe(
      (blog: HubBlogData) => {
        this.logger.info('New blog received in component', {
          blogTitle: blog.postTitle,
          userName: blog.username,
        });
        this.handleNewBlogNotification(blog);
      }
    );
  }

  ngOnDestroy() {
    this.signalRSubscription?.unsubscribe();
    this.signalRService.stopConnection();
  }

  private handleNewBlogNotification(blog: HubBlogData) {
    this.toastService.showInfo(
      `${blog.username} just published a new post: :${blog.postTitle}"`
    );
  }

  private setupStoreSubscriptions(): void {
    // Subscribe to blogs data from the store
    this.store
      .select(selectAllBlogs)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((blogs) => {
        if (blogs) {
          this.blogPosts.set(blogs);
        }
      });

    // Subscribe to loading state from the store
    this.store
      .select(selectIsLoading)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isLoading) => {
        this.isLoading.set(isLoading);
      });

    // Subscribe to errors from the store
    this.store
      .select(selectBlogError)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((error) => {
        if (error) {
          this.toastService.showError(error);
        }
      });
  }

  private loadUserDataWithQuery(searchQuery: string = ''): void {
    this.isLoading.set(true);

    this.loginService
      .getCurrentUserId()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap((userId) => {
          if (!userId) {
            this.toastService.showError('User data is incomplete');
            return;
          }

          // Dispatch the loadBlogs action with both userId and optional searchQuery
          this.store.dispatch(
            loadBlogs({ id: userId, searchQuery: searchQuery })
          );
        }),
        catchError((error) => {
          console.error('Error getting current user:', error);
          this.toastService.showError('Failed to get user information');
          return EMPTY;
        }),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe();
  }

  private loadUserData(): void {
    this.loadUserDataWithQuery();
  }

  onFilterButtonClick(): void {
    const searchQuery = this.searchFormControl.value;
    this.isLoading.set(true);

    this.loadUserDataWithQuery(searchQuery ?? '');
  }

  deleteBlogPost(id: number): void {
    // Use the NgRx action instead of direct service call
    this.store.dispatch(deleteBlog({ id }));

    this.actions$
      .pipe(
        ofType(deleteBlogSuccess),
        takeUntilDestroyed(this.destroyRef),
        take(1)
      )
      .subscribe(() => {
        console.log('deleteBlogSuccess action completed');
        this.toastr.showSuccess('Blog post deleted successfully');
      });
  }

  onEditButtonClick(blogPost: BlogPostResponseDto): void {
    this.selectedBlogPost.set(blogPost);
    this.isEditModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedBlogPost.set(null);
  }

  onBlogUpdated(updatedBlogPost: BlogPostResponseDto): void {
    // Use the NgRx action instead of directly updating the UI state
    if (updatedBlogPost && updatedBlogPost.id) {
      this.store.dispatch(
        updateBlog({
          id: updatedBlogPost.id,
          blog: {
            id: updatedBlogPost.id,
            title: updatedBlogPost.title,
            content: updatedBlogPost.content,
            summary: updatedBlogPost.summary,
            isPublished: updatedBlogPost.isPublished,
          },
        })
      );
      this.closeEditModal();
    }
  }

  getCoverImageUrl(blogPost: BlogPostResponseDto): string {
    return blogPost.mediaFiles?.length > 0
      ? `http://localhost:5239/${blogPost.mediaFiles[0].filePath}`
      : '/assets/placeholder.jpg';
  }

  getAuthorImageUrl(blogPost: BlogPostResponseDto): string {
    return blogPost.author?.profilePicturePath
      ? `http://localhost:5239/${blogPost.author.profilePicturePath}`
      : '/assets/default-avatar.jpg';
  }
}
