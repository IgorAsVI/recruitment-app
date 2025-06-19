import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  loginType: 'candidate' | 'admin' = 'candidate';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute 
  ) {
    // Redireciona para home se já estiver logado
    if (this.authService.getCurrentUser()) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onLoginTypeChange(): void {
    // Pode ser usado para lógica extra de UI
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const isAdmLogin = this.loginType === 'admin';
    this.authService.login(this.loginForm.value, isAdmLogin)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['/vacancies']);
          this.loading = false;
        },
        error: error => {
          this.errorMessage = error.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
  }
}

