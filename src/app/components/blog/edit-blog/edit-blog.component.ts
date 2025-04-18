import { Component, DestroyRef, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BlogPost, BlogPostResponseDto, UpdateBlogPost } from '../blog.model';
import { BlogService } from '../blog.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Store } from '@ngrx/store';
import {
  updateBlog,
  updateBlogSuccess,
} from '../../../state/blogs/blog.actions';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';

@Component({
  selector: 'app-edit-blog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-blog.component.html',
})
export class EditBlogComponent {
  blogPost = input<UpdateBlogPost | null>(null);
  close = output<void>();
  updated = output<BlogPostResponseDto>();

  private fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly toastr = inject(ToastService);
  private readonly actions$ = inject(Actions);
  private readonly destroyRef = inject(DestroyRef);

  editForm = this.fb.group({
    title: ['', Validators.required],
    content: ['', Validators.required],
    summary: ['', Validators.required],
    isPublished: [false],
  });

  ngOnInit() {
    // Populate form with existing blog post data
    this.editForm.patchValue({
      title: this.blogPost()?.title,
      content: this.blogPost()?.content,
      summary: this.blogPost()?.summary,
      isPublished: this.blogPost()?.isPublished,
    });
  }

  onSubmit() {
    if (this.editForm.valid) {
      const updatedPost = {
        ...this.blogPost(),
        ...this.editForm.value,
      };

      console.log('The updated post is :', updatedPost);

      const updateBlogPost: UpdateBlogPost = {
        id: this.blogPost()?.id ?? 0,
        title: this.editForm.value.title ?? null,
        content: this.editForm.value.content ?? null,
        summary: this.editForm.value.summary ?? null,
        isPublished: this.editForm.value.isPublished ?? false,
      };

      console.log('The update blog post is 1:', updateBlogPost);

      console.log('Dispatching data to add Blog');

      this.store.dispatch(
        updateBlog({
          id: this.blogPost()?.id ?? 0,
          blog: updateBlogPost,
        })
      );

      console.log('Blog content dispatched');

      // Listen for the success action
      this.actions$
        .pipe(
          ofType(updateBlogSuccess),
          takeUntilDestroyed(this.destroyRef),
          take(1) // Important: only take once
        )
        .subscribe(() => {
          console.log('updateBlogSuccess action completed');
          this.toastr.showSuccess('Blog post updated successfully');
          this.close.emit();
        });
    }
  }

  onCancel() {
    this.close.emit();
  }
}
