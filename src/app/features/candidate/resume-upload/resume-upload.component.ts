
import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../services/candidate.service';
import { AuthService } from '../../../core/services/auth.service'; // Adjust path as needed
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-resume-upload',
  templateUrl: './resume-upload.component.html',
  styleUrls: ['./resume-upload.component.scss']
})
export class ResumeUploadComponent implements OnInit {
  selectedFile: File | null = null;
  uploadMessage = '';
  errorMessage = '';
  loading = false;
  currentResumePath: string | null = null;

  constructor(
    private candidateService: CandidateService,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    // Load current resume path if available
    this.candidateService.getCurrentCandidateProfile().pipe(first()).subscribe(profile => {
      if (profile && profile.resume_pdf_path) {
        this.currentResumePath = profile.resume_pdf_path;
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
        if (file.type !== 'application/pdf') {
            this.errorMessage = 'Apenas ficheiros PDF são permitidos.';
            this.selectedFile = null;
            // Reset file input visually
            const fileInput = event.target as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
            return;
        }
        this.selectedFile = file;
        this.uploadMessage = '';
        this.errorMessage = '';
    } else {
        this.selectedFile = null;
    }
  }

  // Simulate upload
  onUpload(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor, selecione um ficheiro PDF.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.uploadMessage = '';

    // Simulate upload by setting a fake path based on the filename
    // In a real app, this would involve an actual API call to upload the file
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
        this.errorMessage = 'Erro: Utilizador não encontrado.';
        this.loading = false;
        return;
    }
    const fakePath = `/uploads/resumes/${userId}_${this.selectedFile.name}`;

    this.candidateService.updateResumePath(fakePath)
      .pipe(first())
      .subscribe({
        next: (updatedProfile: any) => { // Add type annotation if possible
          this.uploadMessage = `Currículo '${this.selectedFile?.name}' carregado com sucesso (simulado).`;
          this.currentResumePath = updatedProfile.resume_pdf_path;
          this.selectedFile = null;
           // Reset file input visually
           const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) {
                fileInput.value = '';
            }
          this.loading = false;
        },
        error: (err: any) => { // Add type annotation
          this.errorMessage = 'Falha ao atualizar o caminho do currículo. Tente novamente.';
          console.error(err);
          this.loading = false;
        }
      });
  }

  // Utility function to get filename from path
  getFileName(path: string | null): string {
      if (!path) {
          return '';
      }
      // Handles both / and \ separators
      const separator = path.includes('/') ? '/' : '\\';
      return path.substring(path.lastIndexOf(separator) + 1);
  }
}

