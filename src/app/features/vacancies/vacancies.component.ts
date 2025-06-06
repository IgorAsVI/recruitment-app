import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { VacancyService } from './services/vacancy.service';
import { Vacancy } from './models/vacancy.model';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss'
})
export class VacanciesComponent implements OnInit {
  vacancies$: Observable<Vacancy[]>;

  constructor(private vacancyService: VacancyService) {
    this.vacancies$ = this.vacancyService.getVacancies();
  }

  ngOnInit(): void {}
}
