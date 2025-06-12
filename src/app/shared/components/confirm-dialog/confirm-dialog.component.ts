import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  type: 'success' | 'warning' | 'error' | 'info';
  showCancel?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {
    // Define valores padrão
    this.data.showCancel = this.data.showCancel !== false;
    this.data.cancelText = this.data.cancelText || 'Cancelar';
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  getIcon(): string {
    switch (this.data.type) {
      case 'success':
        return 'check_circle';
      case 'warning':
        return 'warning';
      case 'error':
        return 'error';
      case 'info':
        return 'info';
      default:
        return 'help';
    }
  }

  getColor(): string {
    switch (this.data.type) {
      case 'success':
        return 'primary';
      case 'warning':
        return 'accent';
      case 'error':
        return 'warn';
      case 'info':
        return 'primary';
      default:
        return 'primary';
    }
  }
} 