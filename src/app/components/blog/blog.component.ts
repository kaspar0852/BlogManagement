import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { LoginService } from '../login/login.service';
import { Router, RouterModule } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BlogPost } from './blog.model';
import { BlogService } from './blog.service';
import { ToastService } from '../shared/toast/toast.service';
import { Subscription, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { addBlogs, addBlogSuccess } from '../../state/blogs/blog.actions';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Actions, ofType } from '@ngrx/effects';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css',
})
export class BlogComponent implements OnInit, OnDestroy {
  //services
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly blogService = inject(BlogService);
  private readonly toastr = inject(ToastService);
  private readonly store = inject(Store);
  private readonly destroyRef = inject(DestroyRef);
  private readonly actions$ = inject(Actions);

  isLoggedIn$ = this.loginService.isLoggedIn$;
  private loginSubscription: Subscription | undefined;
  selectedFile: File | null = null;
  previewUrl: string | null = null;

  ngOnInit(): void {
    this.loginSubscription = this.loginService.isLoggedIn$.subscribe(
      (isLoggedIn) => {
        if (!isLoggedIn) {
          console.log('The user is not logged in');
          this.router.navigate(['/login']);
        }
        console.log('The user is logged in');
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loginSubscription) {
      this.loginSubscription.unsubscribe();
    }
  }

  blogForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    summary: new FormControl('', [Validators.required]),
    coverImage: new FormControl(''),
    isPublished: new FormControl(true),
  });

  createBlogPost() {
    if (!this.blogForm.valid) {
      console.log('The blog form is not valid.');
      return;
    }

    const blogPost: BlogPost = {
      title: this.blogForm.value.title ?? null,
      content: this.blogForm.value.content ?? null,
      summary: this.blogForm.value.summary ?? null,
      isPublished: this.blogForm.value.isPublished ?? false,
    };

    console.log(blogPost);
    console.log('Dispatching data to add Blog');

    this.store.dispatch(
      addBlogs({
        content: blogPost,
      })
    );

    console.log('Blog content dispatched');

    if (this.selectedFile) {
      // This is a bit hacky but necessary to handle file uploads that need the blog ID
      this.blogService
        .createBlogPost(blogPost)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (response) => {
            const formData = new FormData();
            formData.append('file', this.selectedFile!);
            this.blogService.uploadCoverImage(response.id, formData).subscribe({
              next: () => this.router.navigate(['/blog-list']),
              error: (error) => {
                console.error(error);
                this.toastr.showError('Failed to upload cover image');
              },
            });
          },
          error: (error) =>
            console.error('Error creating blog post for file upload:', error),
        });
    }

    this.actions$
      .pipe(
        ofType(addBlogSuccess),
        takeUntilDestroyed(this.destroyRef),
        take(1) // Important: only take once
      )
      .subscribe(() => {
        console.log('addBlogSuccess action completed');
        this.router.navigate(['/blog-list']);
        this.toastr.showSuccess('Blog post created successfully');
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.previewUrl = URL.createObjectURL(this.selectedFile);
    }
  }

  removeFile() {
    this.selectedFile = null;
    this.previewUrl = null;
  }
}
