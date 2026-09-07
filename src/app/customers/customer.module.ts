import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { customerListingComponent } from './customer-list/customer.component';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { CustomerDetailsComponent } from './customer-details/customer-details.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
// import { PdfViewerModule } from 'ng2-pdf-viewer';
import { AngJson2excelBtnModule } from 'ang-json2excel-btn';


const routes: Routes = [
  {
    path: '',
    component: customerListingComponent
  },
  {
    path: 'customer-details/:id',
    component: CustomerDetailsComponent
  },


];
@NgModule({
  declarations: [
    customerListingComponent,
    CustomerDetailsComponent
  ],
  imports: [RouterModule.forChild(routes),
    // PdfViewerModule,
    CommonModule,
    DataTableModule,
    IconModule,
    ModalModule,
    NgxDatatableModule,
    FormsModule,
    Ng2FlatpickrModule,
    ReactiveFormsModule,
    NgSelectModule,
    AngJson2excelBtnModule,
    FormsModule,
  ]
})
export class customerModule { }
