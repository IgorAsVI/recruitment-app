import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { VacancyService } from './services/vacancy.service';
import { Vacancy } from './models/vacancy.model';
import { VacancyListComponent } from './vacancy-list/vacancy-list.component';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrl: './vacancies.component.scss'
})
export class VacanciesComponent implements OnInit {
  @ViewChild('vacancyList') vacancyList!: VacancyListComponent;

  constructor(private vacancyService: VacancyService) {}

  ngOnInit(): void {
    // Carregar vagas iniciais após a view ser inicializada
    setTimeout(() => {
      if (this.vacancyList) {
        this.vacancyList.loadVacancies();
      }
    });
  }

  onFilterChanged(filters: any): void {
    if (this.vacancyList) {
      // Se não há filtros, carregar todas as vagas
      if (!filters || Object.keys(filters).length === 0) {
        this.vacancyList.loadVacancies();
      } else {
        this.vacancyList.loadVacancies(filters);
      }
    }
  }
}
