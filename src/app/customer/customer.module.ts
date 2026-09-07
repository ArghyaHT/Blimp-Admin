import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerlistingComponent } from './customerlisting/customerlisting.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AngJson2excelBtnModule } from 'ang-json2excel-btn';

const routes: Routes = [
  {  
      path: '',
      component: CustomerlistingComponent,
  }, 

];

@NgModule({
  declarations: [
    CustomerlistingComponent,
   
  ],
  imports: [RouterModule.forChild(routes), 
    CommonModule,
    DataTableModule,
    FormsModule,
    IconModule,
    ModalModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    AngJson2excelBtnModule
  
  ],
})
export class CustomerModule { }
