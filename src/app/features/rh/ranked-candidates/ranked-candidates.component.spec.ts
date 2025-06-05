import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankedCandidatesComponent } from './ranked-candidates.component';

describe('RankedCandidatesComponent', () => {
  let component: RankedCandidatesComponent;
  let fixture: ComponentFixture<RankedCandidatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RankedCandidatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankedCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
