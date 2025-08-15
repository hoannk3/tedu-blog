import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XlsxUploaderComponent } from './xlsx-uploader.component';

describe('XlsxUploaderComponent', () => {
  let component: XlsxUploaderComponent;
  let fixture: ComponentFixture<XlsxUploaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [XlsxUploaderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(XlsxUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
