
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service'; // Adjust path as needed

@Injectable({
  providedIn: 'root' // Provide in root or in VacanciesModule if preferred
})
export class VacancyService {

  constructor(private apiService: ApiService) { }

  getVacancies(filters?: any): Observable<any[]> {
    // Construct query parameters based on filters
    let params: any = {};
    let test: any = {};
    if (filters) {
      if (filters.area) {
        params.area = filters.area;
      }
      if (filters.type) {
        params.type = filters.type;
      }
      if (filters.location) {
        // Use q for full-text search or specific field if API supports it
        params.location_like = filters.location; // Example: use location_like for partial match
      }
      // Add other filters as needed
    }
    test =  this.apiService.getVacancies(params);
    console.log('====================================');
    console.log(JSON.stringify(test));
    console.log('====================================');
    return test;
  }

  getVacancyById(id: number): Observable<any> {
    return this.apiService.getVacancyById(id);
  }

  // Add methods for applying to a vacancy if needed here or in a separate ApplicationService
  applyToVacancy(applicationData: any): Observable<any> {
    return this.apiService.addApplication(applicationData);
  }
}

