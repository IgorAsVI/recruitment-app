
import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service'; // Adjust path

@Injectable({
  providedIn: 'root'
})
export class RhService {

  constructor(private apiService: ApiService) { }

  // Fetch all vacancies for selection in the RH panel
  getAllVacancies(): Observable<any[]> {
    return this.apiService.getVacancies();
  }

  // Calculates a simple matching score based on shared skills
  // Duplicated from CandidateService for now, consider moving to a shared utility
  private calculateMatchScore(candidateSkills: string[], vacancyRequirements: string[]): number {
    if (!candidateSkills || candidateSkills.length === 0 || !vacancyRequirements || vacancyRequirements.length === 0) {
      return 0;
    }
    const candidateSkillSet = new Set(candidateSkills.map(s => s.toLowerCase().trim()));
    const requirementSet = new Set(vacancyRequirements.map(r => r.toLowerCase().trim()));

    let matchCount = 0;
    requirementSet.forEach(req => {
        if (candidateSkillSet.has(req) || Array.from(candidateSkillSet).some(skill => req.includes(skill))) {
            matchCount++;
        }
    });

    const score = (matchCount / requirementSet.size) * 100;
    return Math.round(score);
  }

  // Get ranked candidates for a specific vacancy
  getRankedCandidatesForVacancy(vacancyId: number): Observable<any[]> {
    // 1. Get the specific vacancy details (to get requirements)
    return this.apiService.getVacancyById(vacancyId).pipe(
      switchMap(vacancy => {
        if (!vacancy) {
          return of([]); // Vacancy not found
        }
        const vacancyRequirements = vacancy.requirements || [];

        // 2. Get all applications for this vacancy
        return this.apiService.getApplicationsByVacancyId(vacancyId).pipe(
          switchMap(applications => {
            if (!applications || applications.length === 0) {
              return of([]); // No applications for this vacancy
            }

            // 3. For each application, get the candidate details
            const candidateObservables = applications.map(app =>
              this.apiService.getCandidateById(app.candidateId).pipe(
                map(candidate => {
                  if (!candidate) return null; // Candidate not found
                  // 4. Calculate score for this candidate against this vacancy
                  const score = this.calculateMatchScore(candidate.skills || [], vacancyRequirements);
                  // Return candidate data along with the application info and score
                  return {
                    ...candidate,
                    applicationDate: app.applicationDate,
                    applicationId: app.id,
                    matchScore: score
                  };
                }),
                catchError(err => {
                    console.error(`Error fetching candidate ${app.candidateId}:`, err);
                    return of(null); // Return null if fetching a candidate fails
                })
              )
            );

            // 5. Wait for all candidate details to be fetched
            return forkJoin(candidateObservables).pipe(
              map(candidatesWithDetails => {
                // Filter out any null results (e.g., candidate fetch failed)
                const validCandidates = candidatesWithDetails.filter(c => c !== null) as any[];
                // 6. Sort candidates by score (descending)
                return validCandidates.sort((a, b) => b.matchScore - a.matchScore);
              })
            );
          })
        );
      }),
      catchError(error => {
        console.error(`Error fetching ranked candidates for vacancy ${vacancyId}:`, error);
        return of([]); // Return empty array on error
      })
    );
  }
}

