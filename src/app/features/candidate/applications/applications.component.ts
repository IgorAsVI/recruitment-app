import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-applications',
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent implements OnInit {
  applications: any[] = [];

  constructor(private apiService: ApiService, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      this.apiService.getApplicationsByCandidateId(currentUser.id).subscribe(
        (applications: any[]) => {
          // Para cada aplicação, buscar os detalhes da vaga
          const vacancyRequests = applications.map(app =>
            this.apiService.getVacancyById(app.vacancyId)
          );

          forkJoin(vacancyRequests).subscribe(
            (vacancies: any[]) => {
              this.applications = applications.map((app, index) => ({
                ...app,
                vacancy: vacancies[index]
              }));
            },
            error => {
              console.error('Erro ao carregar detalhes das vagas:', error);
            }
          );
        },
        (error: any) => {
          console.error('Erro ao carregar aplicações:', error);
        } 
      );
    }
  }

  getStatusClass(status: string): string {
    switch (status?.toLowerCase()) {
      case 'recebido':
        return 'status-received';
      case 'em análise':
        return 'status-analyzing';
      case 'aprovado':
        return 'status-approved';
      case 'rejeitado':
        return 'status-rejected';
      default:
        return 'status-default';
    }
  }

  cancelApplication(applicationId: string): void {
    if (confirm('Tem certeza que deseja cancelar esta aplicação?')) {
      this.apiService.deleteApplication(applicationId).subscribe(
        () => {
          console.log('Aplicação cancelada com sucesso!');
          // Mostrar mensagem de sucesso
          alert('Aplicação cancelada com sucesso!');
          this.loadApplications(); // Recarregar a lista de aplicações
        },
        error => {
          console.error('Erro ao cancelar aplicação:', error);
          alert('Erro ao cancelar aplicação. Por favor, tente novamente.');
        }
      );
    }
  }

  canCancelApplication(status: string): boolean {
    // Permite cancelar apenas aplicações que estão em "Recebido" ou "Em Análise"
    const cancelableStatuses = ['recebido', 'em análise'];
    return cancelableStatuses.includes(status?.toLowerCase());
  }
}