import { Routes } from '@angular/router';
import { BlogComponent } from './components/blog/blog.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'create-blog', component: BlogComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: 'blogs',
    loadChildren: () =>
      import('./components/blog/blog.routes').then((m) => m.BLOG_ROUTES),
  },
  {
    path: '**',
    redirectTo: 'blogs',
  },
];
