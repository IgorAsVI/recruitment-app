import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Vacancy } from '../models/vacancy.model';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../../../core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class VacancyService {
  private apiUrl = `${environment.apiUrl}/vacancies`;

  constructor(private apiService: ApiService) {}

  getVacancies(filters?: any): Observable<Vacancy[]> {
    // Se não houver filtros, retorna todas as vagas
    if (!filters || Object.keys(filters).length === 0) {
      return this.apiService.getVacancies();
    }

    // Aplica os filtros
    return this.apiService.getVacancies().pipe(
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

  createVacancy(vacancy: Omit<Vacancy, 'id'>): Observable<Vacancy> {
    return this.apiService.createVacancy(vacancy);
  }

  updateVacancy(id: number, vacancy: Partial<Vacancy>): Observable<Vacancy> {
    return this.apiService.updateVacancy(id, vacancy);
  }

  deleteVacancy(id: number): Observable<void> {
    return this.apiService.deleteVacancy(id);
  }
}

