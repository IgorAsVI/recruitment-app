import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Vacancy } from '../models/vacancy.model';

@Component({
  selector: 'app-vacancy-details-modal',
  templateUrl: './vacancy-details-modal.component.html',
  styleUrls: ['./vacancy-details-modal.component.scss']
})
export class VacancyDetailsModalComponent {
  constructor(
    public dialogRef: MatDialogRef<VacancyDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { vacancy: Vacancy }
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  onApply(): void {
    this.dialogRef.close('apply');
  }
} 