
import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../services/candidate.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-recommended-jobs',
  templateUrl: './recommended-jobs.component.html',
  styleUrls: ['./recommended-jobs.component.scss']
})
export class RecommendedJobsComponent implements OnInit {
  recommendedJobs$: Observable<any[]> | undefined;
  loading = false;
  errorMessage = '';

  constructor(private candidateService: CandidateService) { }

  ngOnInit(): void {
    this.loadRecommendedJobs();
  }

  loadRecommendedJobs(): void {
    this.loading = true;
    this.errorMessage = '';
    this.recommendedJobs$ = this.candidateService.getRecommendedJobsWithScores();

    // Handle loading and error states
    this.recommendedJobs$.subscribe({
      next: () => this.loading = false,
      error: (err) => {
        this.errorMessage = 'Falha ao carregar vagas recomendadas. Tente novamente mais tarde.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  // Placeholder for viewing details - implement navigation
  viewDetails(vacancyId: number): void {
    console.log('View details for recommended vacancy ID:', vacancyId);
    // this.router.navigate(['/vacancies', vacancyId]); // Example navigation
  }
}

