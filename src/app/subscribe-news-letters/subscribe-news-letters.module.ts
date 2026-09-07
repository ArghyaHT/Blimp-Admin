import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscribeNewsLettersListingComponent } from './subscribe-news-letters/subscribe-news-letters-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgSelectModule } from '@ng-select/ng-select';
import { UtilsModule } from '../utils/utils.module';

const routes: Routes = [
  {
    path: '',
    component: SubscribeNewsLettersListingComponent
  },
];


@NgModule({
  declarations: [
    SubscribeNewsLettersListingComponent,
  ],
  imports: [RouterModule.forChild(routes),
    CommonModule,
    DataTableModule,
    FormsModule,
    IconModule,
    ModalModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    NgSelectModule,
    UtilsModule
  ],
})
export class SubScribeNewsLettersModule { }
