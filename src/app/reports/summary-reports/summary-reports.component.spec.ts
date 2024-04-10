import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryReportsComponent } from './summary-reports.component';

describe('SummaryReportsComponent', () => {
  let component: SummaryReportsComponent;
  let fixture: ComponentFixture<SummaryReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryReportsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
