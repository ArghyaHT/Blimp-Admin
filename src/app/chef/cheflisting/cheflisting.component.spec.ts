import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheflistingComponent } from './cheflisting.component';

describe('CheflistingComponent', () => {
  let component: CheflistingComponent;
  let fixture: ComponentFixture<CheflistingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CheflistingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheflistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
