import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitExperience } from './submit-experience';

describe('SubmitExperience', () => {
  let component: SubmitExperience;
  let fixture: ComponentFixture<SubmitExperience>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubmitExperience]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubmitExperience);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
