
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms'; // Needed if RH panel has forms

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table'; // For ranked candidates table
import { MatPaginatorModule } from '@angular/material/paginator'; // Optional: for pagination
import { MatSortModule } from '@angular/material/sort'; // Optional: for sorting
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge'; // For score display

import { RhRoutingModule } from './rh-routing.module';
import { RhComponent } from './rh.component';
import { RankedCandidatesComponent } from './ranked-candidates/ranked-candidates.component';


@NgModule({
  declarations: [
    RhComponent,
    RankedCandidatesComponent
  ],
  imports: [
    CommonModule,
    RhRoutingModule,
    ReactiveFormsModule,
    // Material Modules
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule
  ]
})
export class RhModule { }

