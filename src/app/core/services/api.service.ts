
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000'; // Default JSON Server URL

  constructor(private http: HttpClient) { }

  // Example GET request
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`);
  }

  // Example POST request
  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }

  // Example PUT request
  put(endpoint: string, id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  // Example DELETE request
  delete(endpoint: string, id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}/${id}`);
  }

   // Get candidates with optional filtering (e.g., by email)
   getCandidates(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidates`, { params });
  }

  getRHUsers(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rh_users`, { params });
  }

  // Add a new candidate
  addCandidate(candidate: any): Observable<any> {
    return this.post('candidates', candidate);
  }

   // Get vacancies with optional filtering
   getVacancies(params?: any): Observable<any[]> {
      return this.http.get<any[]>(`${this.apiUrl}/vacancies`, { params })
  }

  // Get a specific vacancy by ID
  getVacancyById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/vacancies/${id}`);
  }

  // Add a new application
  addApplication(application: any): Observable<any> {
    return this.post('applications', application);
  }

   // Get applications with optional filtering (e.g., by candidateId)
   getApplications(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/applications`, { params });
  }

}

