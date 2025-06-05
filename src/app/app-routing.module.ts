import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'auth', loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule) }, { path: 'vacancies', loadChildren: () => import('./features/vacancies/vacancies.module').then(m => m.VacanciesModule) }, { path: 'candidate', loadChildren: () => import('./features/candidate/candidate.module').then(m => m.CandidateModule) }, { path: 'rh', loadChildren: () => import('./features/rh/rh.module').then(m => m.RhModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
