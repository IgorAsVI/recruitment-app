import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vacancy } from '../models/vacancy.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  private apiUrl = `${environment.apiUrl}/vacancies`;

  constructor(private http: HttpClient) {}

  getVacancies(filters?: any): Observable<Vacancy[]> {
    let params = new HttpParams();
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.append(key, filters[key]);
        }
      });
    }
    return this.http.get<Vacancy[]>(this.apiUrl, { params });
  }

  getVacancyById(id: number): Observable<Vacancy> {
    return this.http.get<Vacancy>(`${this.apiUrl}/${id}`);
  }

  createVacancy(vacancy: Omit<Vacancy, 'id'>): Observable<Vacancy> {
    return this.http.post<Vacancy>(this.apiUrl, vacancy);
  }

  updateVacancy(id: number, vacancy: Partial<Vacancy>): Observable<Vacancy> {
    return this.http.patch<Vacancy>(`${this.apiUrl}/${id}`, vacancy);
  }

  deleteVacancy(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

