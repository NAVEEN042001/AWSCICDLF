import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeGenarationComponent } from './barcode-genaration.component';

describe('BarcodeGenarationComponent', () => {
  let component: BarcodeGenarationComponent;
  let fixture: ComponentFixture<BarcodeGenarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarcodeGenarationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarcodeGenarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
