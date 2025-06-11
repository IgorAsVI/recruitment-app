import { Component, OnInit } from '@angular/core';
import { VacancyService } from '../services/vacancy.service';
import { Observable } from 'rxjs';
import { CandidateService } from '../../candidate/services/candidate.service'; // Import CandidateService
import { AuthService } from '../../../core/services/auth.service'; // Import AuthService
import { switchMap, take, first } from 'rxjs/operators';
import { Vacancy } from '../models/vacancy.model';
import { MatDialog } from '@angular/material/dialog';
import { VacancyDetailsModalComponent } from '../vacancy-details-modal/vacancy-details-modal.component';

@Component({
  selector: 'app-vacancy-list',
  templateUrl: './vacancy-list.component.html',
  styleUrls: ['./vacancy-list.component.scss']
})
export class VacancyListComponent implements OnInit {
  vacancies$: Observable<Vacancy[]>;
  loading = false;
  errorMessage: string | null = null;
  successMessage = ''; // Add success message property
  currentFilters: any = {};
  userId: number | null = null;

  constructor(
    private vacancyService: VacancyService,
    private candidateService: CandidateService, // Inject CandidateService
    private authService: AuthService, // Inject AuthService
    private dialog: MatDialog
  ) {
    this.vacancies$ = this.vacancyService.getVacancies();
  }

  ngOnInit(): void {
    this.loadVacancies();
    // Use getCurrentUser() and access id safely
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
        this.userId = currentUser.id;
    }
  }

  loadVacancies(filters: any = {}): void {
    this.loading = true;
    this.errorMessage = null;
    this.successMessage = ''; // Clear success message on load
    this.currentFilters = filters; // Store current filters
    this.vacancies$ = this.vacancyService.getVacancies(filters);

    this.vacancies$.subscribe({
        next: () => this.loading = false,
        error: (err: any) => { // Add explicit type
            this.errorMessage = 'Falha ao carregar vagas. Por favor, tente novamente mais tarde.';
            console.error(err);
            this.loading = false;
        }
    });
  }

  onFilterChanged(filters: any): void {
    console.log('Filtros recebidos:', filters);
    this.loadVacancies(filters);
  }

  viewDetails(vacancy: Vacancy): void {
    const dialogRef = this.dialog.open(VacancyDetailsModalComponent, {
      width: '800px',
      maxWidth: '95vw',
      data: { vacancy }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'apply') {
        this.apply(vacancy.id);
      }
    });
  }

  // Method to handle applying to a vacancy
  apply(vacancyId: number): void {
    if (!this.userId) {
        this.errorMessage = 'Utilizador não autenticado. Faça login para se candidatar.';
        return;
    }
    console.log(`Applying for vacancy ID: ${vacancyId} by user ID: ${this.userId}`);
    this.loading = true; // Indicate loading state
    this.errorMessage = '';
    this.successMessage = '';

    this.candidateService.applyToVacancy(this.userId, vacancyId)
      .pipe(first())
      .subscribe({
        next: (response: any) => {
          console.log('Application successful:', response);
          this.successMessage = 'Candidatura enviada com sucesso!';
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Application failed:', err);
          this.errorMessage = err?.error?.message || err?.message || 'Falha ao enviar candidatura. Verifique se já se candidatou ou tente novamente.';
          this.loading = false;
        }
      });
  }
}

