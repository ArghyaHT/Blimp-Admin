import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChefDetailsComponent } from './chef-details.component';

describe('ChefDetailsComponent', () => {
  let component: ChefDetailsComponent;
  let fixture: ComponentFixture<ChefDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChefDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChefDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
