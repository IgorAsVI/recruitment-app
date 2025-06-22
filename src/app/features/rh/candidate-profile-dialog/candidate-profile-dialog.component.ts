import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-candidate-profile-dialog',
  templateUrl: './candidate-profile-dialog.component.html',
  styleUrls: ['./candidate-profile-dialog.component.scss']
})
export class CandidateProfileDialogComponent implements OnInit {
  candidate: any = null;
  isLoading = true;
  error = '';

  constructor(
    private apiService: ApiService,
    public dialogRef: MatDialogRef<CandidateProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { candidateId: number }
  ) { }

  ngOnInit(): void {
    this.loadCandidateProfile();
  }

  loadCandidateProfile(): void {
    this.isLoading = true;
    this.error = '';
    
    this.apiService.getCandidateById(this.data.candidateId).subscribe(
      (candidate) => {
        this.candidate = candidate;
        this.isLoading = false;
      },
      (error) => {
        console.error('Erro ao carregar perfil do candidato:', error);
        this.error = 'Erro ao carregar perfil do candidato';
        this.isLoading = false;
      }
    );
  }

  onClose(): void {
    this.dialogRef.close();
  }

  hasResume(): boolean {
    return !!this.candidate?.resume_pdf_path;
  }

  getResumeFileName(): string {
    if (!this.candidate?.resume_pdf_path) {
      return '';
    }
    const path = this.candidate.resume_pdf_path;
    const separator = path.includes('/') ? '/' : '\\';
    return path.substring(path.lastIndexOf(separator) + 1);
  }

  downloadResume(): void {
    if (this.hasResume()) {
      window.open(this.candidate.resume_pdf_path, '_blank');
    }
  }

  getExperienceYears(): number {
    if (!this.candidate?.experiences || !Array.isArray(this.candidate.experiences)) {
      return 0;
    }
    
    return this.candidate.experiences.reduce((total: number, exp: any) => {
      return total + (exp.years || 0);
    }, 0);
  }

  formatPhoneNumber(phone: string): string {
    if (!phone) return '';
    // Formatar número de telefone português
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
  }
}

