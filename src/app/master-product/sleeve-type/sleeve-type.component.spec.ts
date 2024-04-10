import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleeveTypeComponent } from './sleeve-type.component';

describe('SleeveTypeComponent', () => {
  let component: SleeveTypeComponent;
  let fixture: ComponentFixture<SleeveTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SleeveTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SleeveTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
