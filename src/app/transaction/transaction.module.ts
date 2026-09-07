import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  TransactionListingComponent } from './transactions/transaction-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UtilsModule } from '../utils/utils.module';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [
  {
    path: '',
    component: TransactionListingComponent
  }
];


@NgModule({
  declarations: [
    TransactionListingComponent
  ],
  imports: [RouterModule.forChild(routes),
    CommonModule,
    DataTableModule,
    FormsModule,
    IconModule,
    ModalModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UtilsModule,
    NgSelectModule
  ],
})
export class TransactionModule { }
