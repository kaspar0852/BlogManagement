import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { BlogEffects } from './state/blogs/blog.effects';
import { blogReducer } from './state/blogs/blog.reducer';
import { CommentEffects } from './state/comments/comment.effects';
import { commentReducer } from './state/comments/comment.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideEffects([BlogEffects, CommentEffects]),
    provideStore({
      blogs: blogReducer,
      comments: commentReducer,
    }),
  ],
};
