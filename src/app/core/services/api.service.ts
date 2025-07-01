
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vacancy } from '../../features/vacancies/models/vacancy.model';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8080/api/v1'; // Updated to use port 8080

  constructor(private http: HttpClient) { }

  // Generic HTTP methods
  get(endpoint: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${endpoint}`);
  }

  post(endpoint: string, data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${endpoint}`, data);
  }

  put(endpoint: string, id: number | string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${endpoint}/${id}`, data);
  }

  delete(endpoint: string, id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${endpoint}/${id}`);
  }

  // Candidate methods
  getCandidates(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/candidato`, { params });
  }

  getCandidateById(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/candidato/${id}`);
  }

  addCandidate(candidate: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/candidato`, candidate);
  }

  updateCandidate(id: number | string, candidate: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/candidato/${id}`, candidate);
  }

  updateCandidateResumePath(candidateId: string, resumePath: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/candidato/${candidateId}`, { resume_pdf_path: resumePath });
  }

  // RH Users methods
  getRHUsers(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rh_users`, { params });
  }

  // Vacancy methods
  getVacancies(params?: any): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(`${this.apiUrl}/vaga`, { params });
  }

  getVacancyById(id: number): Observable<Vacancy> {
    return this.http.get<Vacancy>(`${this.apiUrl}/vaga/${id}`);
  }

  createVacancy(vacancy: any): Observable<Vacancy> {
    return this.http.post<Vacancy>(`${this.apiUrl}/vaga`, vacancy);
  }

  updateVacancy(id: number, vacancy: any): Observable<Vacancy> {
    return this.http.put<Vacancy>(`${this.apiUrl}/vaga/${id}`, vacancy);
  }

  deleteVacancy(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/vaga/${id}`);
  }

  // Application methods
  getApplications(params?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/application`, { params });
  }

  getApplicationsByCandidateId(candidateId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/application/candidato/${candidateId}`);
  }

  getApplicationsByVacancyId(vacancyId: number | string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/application/vaga/${vacancyId}`);
  }

  addApplication(application: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/application`, application);
  }

  updateApplication(id: number | string, application: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/application/${id}`, application);
  }

  deleteApplication(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/application/${id}`);
  }
}

