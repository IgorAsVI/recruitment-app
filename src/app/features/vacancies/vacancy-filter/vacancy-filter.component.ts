
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-vacancy-filter',
  templateUrl: './vacancy-filter.component.html',
  styleUrls: ['./vacancy-filter.component.scss']
})
export class VacancyFilterComponent implements OnInit {
  filterForm!: FormGroup;
  @Output() filterChanged = new EventEmitter<any>();

  // Example options - In a real app, these might come from an API
  areas = ['Tecnologia', 'Marketing', 'Recursos Humanos', 'Vendas', 'Finanças'];
  types = ['Tempo Integral', 'Meio Período', 'Estágio', 'Freelance'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      area: [''],
      type: [''],
      location: ['']
    });

    // Emit filter changes with debounce to avoid excessive API calls
    this.filterForm.valueChanges
      .pipe(
        debounceTime(300), // Wait for 300ms pause in events
        distinctUntilChanged() // Only emit if value has changed
      )
      .subscribe(values => {
        this.filterChanged.emit(this.cleanFilterValues(values));
      });
  }

  // Method called on form submit (explicit filter application)
  applyFilters(): void {
      this.filterChanged.emit(this.cleanFilterValues(this.filterForm.value));
  }

  // Remove empty properties from filter object before emitting
  private cleanFilterValues(values: any): any {
    const cleanedFilters: any = {};
    Object.keys(values).forEach(key => {
      if (values[key]) {
        cleanedFilters[key] = values[key];
      }
    });
    return cleanedFilters;
  }

  resetFilters(): void {
    this.filterForm.reset({ area: '', type: '', location: '' });
    // The valueChanges subscription will automatically emit the reset state
  }
}

