import { Component, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { BlogService } from '../blog.service';
import { BlogPostResponseDto } from '../blog.model';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.css',
})
export class BlogDetailComponent {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private toastService = inject(ToastService);

  blogPost = signal<BlogPostResponseDto | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.blogService.getBlogPostById(id).subscribe({
        next: (post) => {
          this.blogPost.set(post);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error fetching blog post:', error);
          this.toastService.showError('Failed to load blog post');
          this.isLoading.set(false);
        },
      });
    }
  }

  getCoverImageUrl(blogPost: BlogPostResponseDto | null): string {
    if (blogPost && blogPost.mediaFiles.length > 0) {
      const coverImageUrl =
        'http://localhost:5239/' + blogPost.mediaFiles[0].filePath;
      return coverImageUrl;
    }
    return '/assets/placeholder.jpg';
  }

  getAuthorImageUrl(blogPost: BlogPostResponseDto | null): string {
    if (blogPost && blogPost.author.profilePicturePath) {
      return 'http://localhost:5239/' + blogPost.author.profilePicturePath;
    }
    return '/assets/default-avatar.jpg';
  }
}
