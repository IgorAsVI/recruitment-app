import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select'; // For filters
import { MatListModule } from '@angular/material/list'; // For vacancy list
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion'; // For filter panel

import { VacanciesRoutingModule } from './vacancies-routing.module';
import { VacanciesComponent } from './vacancies.component';
import { VacancyListComponent } from './vacancy-list/vacancy-list.component';
import { VacancyFilterComponent } from './vacancy-filter/vacancy-filter.component';


@NgModule({
  declarations: [
    VacanciesComponent,
    VacancyListComponent,
    VacancyFilterComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    VacanciesRoutingModule,
    ReactiveFormsModule,
    // Material Modules
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatDividerModule,
    MatExpansionModule
  ]
})
export class VacanciesModule { }

