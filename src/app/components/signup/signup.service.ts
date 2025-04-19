import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { SignupRequestDto, SignupResponseDto } from './signup.model';
import { EnvService } from '../../services/env.service';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private http = inject(HttpClient);
  private envService = inject(EnvService);
  
  private readonly rootUrl = `${this.envService.getApiBaseUrl()}/Auth/register`;

  signup(
    signupRequest: SignupRequestDto
  ): Observable<SignupResponseDto | null> {
    const formData = new FormData();
    formData.append('username', signupRequest.username ?? '');
    formData.append('email', signupRequest.email ?? '');
    formData.append('password', signupRequest.password ?? '');
    formData.append('firstName', signupRequest.firstName ?? '');
    formData.append('lastName', signupRequest.lastName ?? '');
    formData.append('profilePicture', signupRequest.profilePicture ?? '');

    return this.http.post<SignupResponseDto>(this.rootUrl, formData).pipe(
      catchError((error) => {
        console.error('Error in signup:', error);
        return throwError(() => error);
      })
    );
  }
}
