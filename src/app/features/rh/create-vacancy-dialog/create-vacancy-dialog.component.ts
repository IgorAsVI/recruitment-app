import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-create-vacancy-dialog',
  templateUrl: './create-vacancy-dialog.component.html',
  styleUrls: ['./create-vacancy-dialog.component.scss']
})
export class CreateVacancyDialogComponent {
  vacancyForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<CreateVacancyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.vacancyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      area: ['', Validators.required],
      type: ['', Validators.required],
      location: ['', Validators.required],
      requirements: this.fb.array([])
    });

    // Adicionar um requisito inicial
    this.addRequirement();
  }

  get requirements(): FormArray {
    return this.vacancyForm.get('requirements') as FormArray;
  }

  addRequirement(): void {
    this.requirements.push(this.fb.control('', Validators.required));
  }

  removeRequirement(index: number): void {
    if (this.requirements.length > 1) {
      this.requirements.removeAt(index);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.vacancyForm.valid) {
      this.isLoading = true;
      
      const vacancyData = {
        ...this.vacancyForm.value,
        postedDate: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
        id: this.generateId() // Gerar ID único
      };

      this.apiService.createVacancy(vacancyData).subscribe(
        (response) => {
          console.log('Vaga criada com sucesso:', response);
          this.isLoading = false;
          this.dialogRef.close(true); // Fechar com sucesso
        },
        (error) => {
          console.error('Erro ao criar vaga:', error);
          this.isLoading = false;
          alert('Erro ao criar vaga. Por favor, tente novamente.');
        }
      );
    } else {
      // Marcar todos os campos como tocados para mostrar erros
      this.vacancyForm.markAllAsTouched();
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.vacancyForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${fieldName} é obrigatório`;
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `${fieldName} deve ter pelo menos ${minLength} caracteres`;
    }
    return '';
  }
}

