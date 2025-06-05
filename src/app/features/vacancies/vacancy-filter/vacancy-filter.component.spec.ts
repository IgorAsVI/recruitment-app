import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VacancyFilterComponent } from './vacancy-filter.component';

describe('VacancyFilterComponent', () => {
  let component: VacancyFilterComponent;
  let fixture: ComponentFixture<VacancyFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VacancyFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacancyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
