import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SignupService } from './signup.service';
import { SignupRequestDto } from './signup.model';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  public profilePictureUrl = signal<string | null>(null);

  private profilePictureFile: File | null = null;

  private readonly signupService = inject(SignupService);
  private readonly router = inject(Router);
  private readonly toastr = inject(ToastService);

  signupForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    profilePicture: new FormControl(''),
  });

  showPassword = false;

  signup() {
    console.log(this.signupForm.value);

    if (!this.signupForm.valid) {
      console.log('The signup form is not valid.');
    }

    const signUpRequest: SignupRequestDto = {
      username: this.signupForm.value.username ?? null,
      email: this.signupForm.value.email ?? null,
      password: this.signupForm.value.password ?? null,
      firstName: this.signupForm.value.firstName ?? null,
      lastName: this.signupForm.value.lastName ?? null,
      profilePicture: this.profilePictureFile,
    };

    this.signupService.signup(signUpRequest).subscribe({
      next: (response) => {
        console.log(response);
        this.toastr.showSuccess('Signup successful');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
        this.toastr.showError('Signup failed');
        throw error;
      },
    });
  }

  onProfilePicSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profilePictureFile = input.files[0];
      this.profilePictureUrl.set(URL.createObjectURL(input.files[0]));
    }
  }

  removeProfilePic(event: Event) {
    this.profilePictureFile = null;
    this.profilePictureUrl.set(null);
  }
}
