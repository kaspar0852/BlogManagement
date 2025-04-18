import { Component, inject } from '@angular/core';
import { LoginService } from './login.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LoginRequestDto } from './login.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../shared/toast/toast.service';
import { ToastType } from '../shared/toast/toast.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  showPassword = false;

  login() {
    if (!this.loginForm.valid) {
      console.log('The login form is not valid.');
      return;
    }

    const loginRequest: LoginRequestDto = {
      email: this.loginForm.value.email ?? null,
      password: this.loginForm.value.password ?? null,
    };

    this.loginService.login(loginRequest).subscribe({
      next: (response) => {
        console.log(response);
        if (response) {
          this.toastService.showToast('Login successful', ToastType.SUCCESS);
          this.router.navigate(['/blog-list']);
        }
      },
      error: (error) => {
        console.log(error);
        this.toastService.showToast('Login failed', ToastType.ERROR);
        throw error;
      },
    });
  }
}
