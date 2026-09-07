import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRejectChefDetailsComponent } from './accept-reject-chef-details.component';

describe('AcceptRejectChefDetailsComponent', () => {
  let component: AcceptRejectChefDetailsComponent;
  let fixture: ComponentFixture<AcceptRejectChefDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptRejectChefDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptRejectChefDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
