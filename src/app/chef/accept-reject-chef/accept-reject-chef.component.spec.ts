import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptRejectChefComponent } from './accept-reject-chef.component';

describe('AcceptRejectChefComponent', () => {
  let component: AcceptRejectChefComponent;
  let fixture: ComponentFixture<AcceptRejectChefComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptRejectChefComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptRejectChefComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
