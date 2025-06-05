
import { Component, OnInit, ViewChild } from '@angular/core'; // Import ViewChild
import { MatSort } from '@angular/material/sort'; // Import MatSort
import { MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
import { RhService } from '../services/rh.service';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Import tap

@Component({
  selector: 'app-ranked-candidates',
  templateUrl: './ranked-candidates.component.html',
  styleUrls: ['./ranked-candidates.component.scss']
})
export class RankedCandidatesComponent implements OnInit {
  vacancies$: Observable<any[]> | undefined;
  rankedCandidates$: Observable<any[]> | undefined;
  dataSource = new MatTableDataSource<any>(); // Use MatTableDataSource
  selectedVacancyId: number | null = null;
  loadingVacancies = false;
  loadingCandidates = false;
  errorVacancies = '';
  errorCandidates = '';

  // Define columns to be displayed in the table
  displayedColumns: string[] = ['ranking', 'name', 'email', 'score', 'applicationDate', 'actions'];

  @ViewChild(MatSort) sort!: MatSort; // Add ViewChild for sorting

  constructor(private rhService: RhService) { }

  ngOnInit(): void {
    this.loadVacancies();
  }

  loadVacancies(): void {
    this.loadingVacancies = true;
    this.errorVacancies = '';
    this.vacancies$ = this.rhService.getAllVacancies().pipe(
        catchError(err => {
            this.errorVacancies = 'Falha ao carregar vagas.';
            console.error(err);
            this.loadingVacancies = false; // Stop loading on error
            return of([]);
        }),
        tap(() => this.loadingVacancies = false) // Stop loading on success
    );
  }

  onVacancySelected(event: any): void {
    // For MatSelect, the value is in event.value
    const vacancyId = event.value;
    if (vacancyId) {
      this.selectedVacancyId = Number(vacancyId);
      this.loadRankedCandidates(this.selectedVacancyId);
    } else {
      this.selectedVacancyId = null;
      this.dataSource.data = []; // Clear table data
      this.rankedCandidates$ = of([]); // Clear observable
      this.errorCandidates = '';
    }
  }

  loadRankedCandidates(vacancyId: number): void {
    this.loadingCandidates = true;
    this.errorCandidates = '';
    this.rankedCandidates$ = this.rhService.getRankedCandidatesForVacancy(vacancyId).pipe(
        tap(candidates => {
            this.dataSource.data = candidates; // Assign data to MatTableDataSource
            this.dataSource.sort = this.sort; // Set sort after data is loaded
            this.loadingCandidates = false; // Stop loading on success
        }),
        catchError(err => {
            this.errorCandidates = `Falha ao carregar candidatos para a vaga ${vacancyId}.`;
            console.error(err);
            this.loadingCandidates = false; // Stop loading on error
            this.dataSource.data = []; // Clear data on error
            return of([]);
        })
    );
  }

  // Placeholder for viewing candidate details
  viewCandidateProfile(candidateId: number): void {
    console.log('View profile for candidate ID:', candidateId);
    // Potentially navigate to a detailed candidate view within the RH panel
    // this.router.navigate(['/rh/candidate', candidateId]);
  }
}

