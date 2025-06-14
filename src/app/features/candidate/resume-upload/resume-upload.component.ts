
import { Component, OnInit } from '@angular/core';
import { CandidateService } from '../services/candidate.service';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
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
  currentCandidate: any = null;
  
  // S3 Configuration
  private readonly S3_BUCKET_URL = 'https://curriculos-pos.s3.us-east-1.amazonaws.com/UUID';

  constructor(
    private candidateService: CandidateService,
    private authService: AuthService,
    private apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadCurrentCandidate();
  }

  loadCurrentCandidate(): void {
    this.candidateService.getCurrentCandidateProfile().pipe(first()).subscribe(profile => {
      if (profile) {
        this.currentCandidate = profile;
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
        const fileInput = event.target as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
        return;
      }
      
      // Verificar tamanho do arquivo (máximo 10MB)
      if (file.size > 10 * 1024 * 1024) {
        this.errorMessage = 'O ficheiro deve ter no máximo 10MB.';
        this.selectedFile = null;
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

  async onUpload(): Promise<void> {
    if (!this.selectedFile) {
      this.errorMessage = 'Por favor, selecione um ficheiro PDF.';
      return;
    }

    if (!this.currentCandidate) {
      this.errorMessage = 'Erro: Dados do candidato não encontrados.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.uploadMessage = '';

    try {
      // Gerar nome único para o arquivo
      const timestamp = new Date().getTime();
      const fileName = `${this.currentCandidate.id}_${timestamp}_${this.selectedFile.name}`;
      
      // Upload para S3
      const s3Url = await this.uploadToS3(this.selectedFile, fileName);
      
      // Atualizar o caminho do currículo no banco de dados
      await this.updateCandidateResumePath(s3Url);
      
      this.uploadMessage = `Currículo '${this.selectedFile.name}' carregado com sucesso!`;
      this.currentResumePath = s3Url;
      this.selectedFile = null;
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error) {
      console.error('Erro no upload:', error);
      this.errorMessage = 'Falha no upload do currículo. Tente novamente.';
    } finally {
      this.loading = false;
    }
  }

  private async uploadToS3(file: File, fileName: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    // Como o bucket é público, fazemos upload direto via PUT
    const s3Url = `${this.S3_BUCKET_URL}/${fileName}`;
    
    try {
      const response = await fetch(s3Url, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': 'application/pdf',
          'x-amz-meta-Content-Type': 'application/pdf',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Erro no upload: ${response.status}`);
      }
      
      return s3Url;
    } catch (error) {
      console.error('Erro no upload para S3:', error);
      throw error;
    }
  }

  private async updateCandidateResumePath(resumePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.updateCandidateResumePath(this.currentCandidate.id, resumePath)
        .pipe(first())
        .subscribe({
          next: (response) => {
            resolve(response);
          },
          error: (error) => {
            reject(error);
          }
        });
    });
  }

  getFileName(path: string | null): string {
    if (!path) {
      return '';
    }
    const separator = path.includes('/') ? '/' : '\\';
    return path.substring(path.lastIndexOf(separator) + 1);
  }

  hasCurrentResume(): boolean {
    return !!this.currentResumePath;
  }

  getResumeUrl(): string {
    return this.currentResumePath || '';
  }

  downloadResume(): void {
    if (this.currentResumePath) {
      window.open(this.currentResumePath, '_blank');
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

