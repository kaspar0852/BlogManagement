import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequestDto, LoginResponseDto, UserState } from './login.model';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly rootUrl = 'http://localhost:5239/api/Auth/login';
  private readonly USER_STATE_KEY = 'userState';

  // Update to use the actual user state object
  private userStateSubject = new BehaviorSubject<UserState | null>(
    this.getUserStateFromStorage()
  );

  // Derived observable for just the login state
  isLoggedIn$ = this.userStateSubject
    .asObservable()
    .pipe(map((state) => !!state?.isLoggedIn));

  // Expose the full user state
  // userState$ = this.userStateSubject.asObservable();

  private http = inject(HttpClient);

  constructor() {
    // Initialize from localStorage on service creation
    this.loadUserState();
  }

  private loadUserState(): void {
    const userState = this.getUserStateFromStorage();
    if (userState) {
      this.userStateSubject.next(userState);
    }
  }

  private getUserStateFromStorage(): UserState | null {
    const stateJson = localStorage.getItem(this.USER_STATE_KEY);
    return stateJson ? JSON.parse(stateJson) : null;
  }

  private saveUserStateToStorage(state: UserState): void {
    localStorage.setItem(this.USER_STATE_KEY, JSON.stringify(state));
  }

  login(loginRequest: LoginRequestDto): Observable<LoginResponseDto | null> {
    return this.http.post<LoginResponseDto>(this.rootUrl, loginRequest).pipe(
      tap((response: LoginResponseDto) => {
        // Create user state object
        console.log('response', response);
        const userState: UserState = {
          token: response.token,
          user: response.user,
          isLoggedIn: true,
        };

        console.log('userState', userState);

        // Update the BehaviorSubject
        this.userStateSubject.next(userState);

        // Save to localStorage
        this.saveUserStateToStorage(userState);
      }),
      catchError((error) => {
        console.error('Error in login:', error);
        return throwError(() => error);
      })
    );
  }

  logout() {
    // Clear the state
    this.userStateSubject.next(null);

    // Remove from localStorage
    localStorage.removeItem(this.USER_STATE_KEY);
  }

  // Helper method to get the current user's ID
  getCurrentUserId(): Observable<number | null> {
    return this.userStateSubject
      .asObservable()
      .pipe(map((state) => state?.user.id || null));
  }

  // Helper method to get the auth token
  getAuthToken(): string | null {
    return this.userStateSubject.value?.token || null;
  }
}
