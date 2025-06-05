
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';

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
  isAdmLogin = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute 
  ) {
     // Redirect to home if already logged in
     if (this.authService.getCurrentUser()) {
       this.router.navigate(['/']); // Navigate to a default logged-in route, e.g., candidate dashboard or vacancies
     }
      this.isAdmLogin = this.route.snapshot.queryParamMap.get('adm') ? true : false; // Substitua 'nomeDoParametro' pelo nome do parâmetro
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value,this.isAdmLogin)
      .pipe(first())
      .subscribe({
        next: () => {
          // Login successful, navigate to a protected route (e.g., candidate profile or vacancies)
          // The specific route might depend on user role or initial setup
          this.router.navigate(['/vacancies']); // Example: Navigate to vacancies list
          this.loading = false;
        },
        error: error => {
          this.errorMessage = error.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      });
  }
}

