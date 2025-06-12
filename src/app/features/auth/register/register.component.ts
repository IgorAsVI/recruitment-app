import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
      confirmPassword: ['', [Validators.required]],
      phone: ['', Validators.required],
      address: [''],
      linkedin: ['']
    });

    // Adiciona o validador de senha após a criação do formulário
    this.registerForm.setValidators(this.passwordMatchValidator);
    
    // Inscreve-se nas mudanças do formulário para atualizar a validação
    this.registerForm.valueChanges.subscribe(() => {
      this.registerForm.updateValueAndValidity();
    });
  }

  // Custom validator to check if passwords match
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const form = control as FormGroup;
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else {
      confirmPassword.setErrors(null);
      return null;
    }
  }

  // Convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    this.successMessage = '';

    // Log para debug
    console.log('Form Status:', {
      valid: this.registerForm.valid,
      invalid: this.registerForm.invalid,
      errors: this.registerForm.errors,
      password: this.f['password'].value,
      confirmPassword: this.f['confirmPassword'].value
    });

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

