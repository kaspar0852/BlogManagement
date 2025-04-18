import { Component, inject } from '@angular/core';
import { LoginService } from '../../login/login.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { startWith } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private loginService = inject(LoginService);
  private router = inject(Router);

  isUserLoggedIn = this.loginService.isLoggedIn$.pipe(startWith(false));

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
