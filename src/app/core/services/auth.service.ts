
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject, throwError } from 'rxjs'; // Keep core imports
import { tap, map, catchError, switchMap } from 'rxjs/operators'; // Import operators separately or directly from 'rxjs'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn = this.loggedIn.asObservable();

  constructor(private apiService: ApiService, private router: Router) {
    // Load user data from local storage on service initialization if token exists
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUserSubject.next(JSON.parse(userData));
    }
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('currentUser'); // Simple check if user data exists
  }

  login(credentials: { email: string; password: string;}, isAdmLogin:boolean): Observable<any> {

    if (isAdmLogin) {
        return this.apiService.getRHUsers({ email: credentials.email }).pipe(
      map(users => {
        if (users.length > 0 && users[0].password === credentials.password) {
          const user = users[0];
          // Store user data in local storage (in a real app, use a token)
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.loggedIn.next(true);
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        this.currentUserSubject.next(null);
        this.loggedIn.next(false);
        return throwError(() => new Error('Login failed. Please check your email and password.'));
      })
    );
    }



    return this.apiService.getCandidates({ email: credentials.email }).pipe(
      map(users => {
        if (users.length > 0 && users[0].password === credentials.password) {
          const user = users[0];
          // Store user data in local storage (in a real app, use a token)
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.loggedIn.next(true);
          return user;
        } else {
          throw new Error('Invalid credentials');
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        this.currentUserSubject.next(null);
        this.loggedIn.next(false);
        return throwError(() => new Error('Login failed. Please check your email and password.'));
      })
    );
  }

  register(candidateData: any): Observable<any> {
    // Check if email already exists
    return this.apiService.getCandidates({ email: candidateData.email }).pipe(
      map(users => {
        if (users.length > 0) {
          throw new Error('Email already exists');
        }
        return candidateData; // Pass data if email is unique
      }),
      // If email is unique, proceed to add the candidate
      tap(() => {
         // Add default fields if not provided
         candidateData.resume_pdf_path = null;
         candidateData.is_reserve = false;
         candidateData.interests = candidateData.interests || []; // Ensure interests is an array
         candidateData.experiences = candidateData.experiences || [];
         candidateData.education = candidateData.education || [];
         candidateData.skills = candidateData.skills || [];
      }),
      // Use switchMap to chain the addCandidate call
      switchMap((data: any) => this.apiService.addCandidate(data)),
      catchError(error => {
        console.error('Registration failed:', error);
        // Handle specific errors like 'Email already exists'
        if (error.message === 'Email already exists') {
          return throwError(() => new Error('This email address is already registered.'));
        }
        return throwError(() => new Error('Registration failed. Please try again later.'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.loggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }

  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }
}

