import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCommissionComponent } from './add-commission/add-commission.component';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule } from 'angular-custom-modal';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {  
      path: 'commission',
      component: AddCommissionComponent,
  },
  
];
@NgModule({
  declarations: [
    AddCommissionComponent
  ],
  imports: [RouterModule.forChild(routes), 
    CommonModule,
    ModalModule,
    IconModule,
    ReactiveFormsModule
  ]
})
export class CommissionModule { }
