import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'recruitment-app';
  
  constructor(
    public authService: AuthService,
    private router: Router
  ) {}
  
  handleAuthAction(): void {
    if (this.authService.getCurrentUser()) {
      // Se o utilizador está autenticado, faz logout
      this.authService.logout();
    } else {
      // Se não está autenticado, redireciona para a página de login
      this.router.navigate(['/auth/login']);
    }
  }
}
