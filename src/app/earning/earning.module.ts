import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EarninglistingComponent } from './earninglisting/earninglisting.component';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';



const routes: Routes = [
  {  
      path: '',
      component: EarninglistingComponent,
  },
  

];

@NgModule({
  declarations: [
    EarninglistingComponent
  ],
  imports: [RouterModule.forChild(routes), 
    CommonModule,
    DataTableModule,
    FormsModule,
    IconModule,
    ModalModule,
    NgSelectModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    Ng2FlatpickrModule
  ]
})
export class EarningModule { }
