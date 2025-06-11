import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vacancy } from '../models/vacancy.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  private apiUrl = `${environment.apiUrl}/vacancies`;

  constructor(private http: HttpClient) {}

  getVacancies(filters?: any): Observable<Vacancy[]> {
    // Se não houver filtros, retorna todas as vagas
    if (!filters || Object.keys(filters).length === 0) {
      return this.http.get<Vacancy[]>(this.apiUrl);
    }

    // Aplica os filtros
    return this.http.get<Vacancy[]>(this.apiUrl).pipe(
      map(vacancies => {
        return vacancies.filter(vacancy => {
          let matches = true;

          // Filtro por área
          if (filters.area && vacancy.area !== filters.area) {
            matches = false;
          }

          // Filtro por tipo
          if (filters.type && vacancy.type !== filters.type) {
            matches = false;
          }

          // Filtro por localização (case insensitive e parcial)
          if (filters.location) {
            const locationMatch = vacancy.location.toLowerCase().includes(filters.location.toLowerCase());
            if (!locationMatch) {
              matches = false;
            }
          }

          return matches;
        });
      })
    );
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

