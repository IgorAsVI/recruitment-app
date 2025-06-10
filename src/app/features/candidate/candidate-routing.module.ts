import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateComponent } from './candidate.component';
import { ProfileComponent } from './profile/profile.component';
import { ResumeUploadComponent } from './resume-upload/resume-upload.component';
import { ApplicationsComponent } from './applications/applications.component';
import { RecommendedJobsComponent } from './recommended-jobs/recommended-jobs.component';

const routes: Routes = [
  {
    path: '',
    component: CandidateComponent,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'resume', component: ResumeUploadComponent },
      { path: 'applications', component: ApplicationsComponent },
      { path: 'recommended-jobs', component: RecommendedJobsComponent },
      { path: '', redirectTo: 'profile', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
