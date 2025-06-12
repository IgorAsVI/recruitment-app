
import { Component, OnInit, ViewChild } from '@angular/core'; // Import ViewChild
import { MatSort } from '@angular/material/sort'; // Import MatSort
import { MatTableDataSource } from '@angular/material/table'; // Import MatTableDataSource
import { MatDialog } from '@angular/material/dialog';
import { RhService } from '../services/rh.service';
import { CreateVacancyDialogComponent } from '../create-vacancy-dialog/create-vacancy-dialog.component';
import { CandidateProfileDialogComponent } from '../candidate-profile-dialog/candidate-profile-dialog.component';
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

  constructor(private rhService: RhService, private dialog: MatDialog) { }

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
    
    const dialogRef = this.dialog.open(CandidateProfileDialogComponent, {
      width: '700px',
      data: { candidateId: candidateId }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Modal fechado');
    });
  }

  openCreateVacancyDialog(): void {
    const dialogRef = this.dialog.open(CreateVacancyDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Recarregar a lista de vagas após criação
        this.loadVacancies();
      }
    });
  }
}

