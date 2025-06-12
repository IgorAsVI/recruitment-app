import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';

const materialModules = [
  MatDialogModule,
  MatButtonModule,
  MatIconModule
];

@NgModule({
  declarations: [
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ...materialModules
  ],
  exports: [
    ConfirmDialogComponent,
    ...materialModules
  ]
})
export class SharedModule { } 