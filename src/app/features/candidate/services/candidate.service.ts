
import { Injectable } from '@angular/core';
import { Observable, of, forkJoin, throwError } from 'rxjs'; // Add throwError
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service'; // Adjust path as needed
import { AuthService } from '../../../core/services/auth.service'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class CandidateService {

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) { }

  getCurrentCandidateProfile(): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return of(null);
    }
    return this.apiService.getCandidateById(currentUser.id);
  }

  updateCandidateProfile(profileData: any): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      // Should ideally return an error or handle this case appropriately
      return throwError(() => new Error('User not logged in or ID missing'));
    }
    return this.apiService.updateCandidate(currentUser.id, profileData).pipe(
      tap(updatedUser => {
        // Update local storage and potentially the BehaviorSubject in AuthService
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        // this.authService.updateCurrentUser(updatedUser); // Assuming such a method exists
      })
    );
  }

  updateResumePath(resumePath: string): Observable<any> {
     const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return throwError(() => new Error('User not logged in or ID missing'));
    }
    return this.getCurrentCandidateProfile().pipe(
      switchMap(profile => {
        if (!profile) {
          return throwError(() => new Error('Candidate profile not found'));
        }
        const updatedProfile = { ...profile, resume_pdf_path: resumePath };
        return this.updateCandidateProfile(updatedProfile);
      })
    );
  }

  getCandidateApplications(): Observable<any[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return of([]);
    }
    // Assuming the API service method is getApplications
    return this.apiService.getApplications({ candidateId: currentUser.id });
  }

  // Method to apply for a vacancy
  applyToVacancy(candidateId: number, vacancyId: number): Observable<any> {
    // First, check if the candidate has already applied for this vacancy
    return this.apiService.getApplications({ candidateId: candidateId, vacancyId: vacancyId }).pipe(
      switchMap(existingApplications => {
        if (existingApplications && existingApplications.length > 0) {
          // Candidate has already applied
          return throwError(() => new Error('Já se candidatou a esta vaga.'));
        }
        // If not applied, create the application object
        const applicationData = {
          candidateId: candidateId,
          vacancyId: vacancyId,
          applicationDate: new Date().toISOString(), // Record application date
          status: 'Recebido' // Initial status
        };
        // Call the API service to add the application
        return this.apiService.addApplication(applicationData);
      }),
      catchError(error => {
        // Rethrow specific errors or a generic one
        console.error('Error applying to vacancy:', error);
        return throwError(() => error); // Rethrow the original error or a new one
      })
    );
  }

  // Calculates a simple matching score based on shared skills
  private calculateMatchScore(candidateSkills: string[], vacancyRequirements: string[]): number {
    if (!candidateSkills || candidateSkills.length === 0 || !vacancyRequirements || vacancyRequirements.length === 0) {
      return 0;
    }
    const candidateSkillSet = new Set(candidateSkills.map(s => s.toLowerCase().trim()));
    const requirementSet = new Set(vacancyRequirements.map(r => r.toLowerCase().trim()));

    let matchCount = 0;
    requirementSet.forEach(req => {
        // Check for direct match or if a candidate skill is included in the requirement text
        if (candidateSkillSet.has(req) || Array.from(candidateSkillSet).some(skill => req.includes(skill))) {
            matchCount++;
        }
    });

    // Score as a percentage of matched requirements
    const score = (matchCount / requirementSet.size) * 100;
    return Math.round(score); // Return integer percentage
  }

  // Method to get recommended jobs with scores
  getRecommendedJobsWithScores(): Observable<any[]> {
    return this.getCurrentCandidateProfile().pipe(
      switchMap(profile => {
        if (!profile || !profile.skills || profile.skills.length === 0) {
          // If no profile or no skills, return no recommendations
          return of([]);
        }
        const candidateSkills = profile.skills;
        // Assuming apiService.getVacancies exists and returns all vacancies
        return this.apiService.getVacancies().pipe(
          map(vacancies => {
            return vacancies
              .map(vacancy => {
                const score = this.calculateMatchScore(candidateSkills, vacancy.requirements || []);
                return { ...vacancy, matchScore: score }; // Add score to vacancy object
              })
              .filter(vacancy => vacancy.matchScore > 0) // Only return vacancies with some match
              .sort((a, b) => b.matchScore - a.matchScore); // Sort by score descending
          })
        );
      }),
      catchError(error => {
          console.error("Error fetching recommended jobs:", error);
          return of([]); // Return empty array on error
      })
    );
  }

  updateReserveStatus(isReserve: boolean, interests: string[]): Observable<any> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return throwError(() => new Error('User not logged in or ID missing'));
    }
    return this.getCurrentCandidateProfile().pipe(
      switchMap(profile => {
        if (!profile) {
          return throwError(() => new Error('Candidate profile not found'));
        }
        const updatedProfile = { ...profile, is_reserve: isReserve, interests: interests };
        return this.updateCandidateProfile(updatedProfile);
      })
    );
  }
}

