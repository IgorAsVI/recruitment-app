import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

// Angular Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatBadgeModule } from '@angular/material/badge'; // For recommended jobs score
import { MatDividerModule } from '@angular/material/divider';

import { CandidateRoutingModule } from './candidate-routing.module';
import { CandidateComponent } from './candidate.component';
import { ProfileComponent } from './profile/profile.component';
import { ResumeUploadComponent } from './resume-upload/resume-upload.component';
import { ApplicationsComponent } from './applications/applications.component';
import { RecommendedJobsComponent } from './recommended-jobs/recommended-jobs.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [
    CandidateComponent,
    ProfileComponent,
    ResumeUploadComponent,
    ApplicationsComponent,
    RecommendedJobsComponent
  ],
  imports: [
    CommonModule,
    CandidateRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    // Material Modules
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCheckboxModule,
    MatChipsModule,
    MatListModule,
    MatProgressBarModule,
    MatBadgeModule,
    MatDividerModule
  ]
})
export class CandidateModule { }

