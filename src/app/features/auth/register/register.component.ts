
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
     // Redirect if already logged in
     if (this.authService.getCurrentUser()) {
       this.router.navigate(['/']); // Or candidate dashboard
     }
  }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required],
      address: [''],
      linkedin: ['']
      // Experience, Education, Skills will be added/edited in the profile section later
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    // Only pass necessary fields for initial registration
    const registrationData = {
        name: this.f['name'].value,
        email: this.f['email'].value,
        password: this.f['password'].value,
        phone: this.f['phone'].value,
        address: this.f['address'].value || '',
        linkedin: this.f['linkedin'].value || null
    };

    this.authService.register(registrationData)
      .pipe(first())
      .subscribe({
        next: () => {
          this.successMessage = 'Registration successful! Redirecting to login...';
          this.loading = false;
          // Optionally redirect to login page after a short delay
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000); // 2 seconds delay
        },
        error: error => {
          this.errorMessage = error.message || 'Registration failed. Please try again.';
          this.loading = false;
        }
      });
  }
}

