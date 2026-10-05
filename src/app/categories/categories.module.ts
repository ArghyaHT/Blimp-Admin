import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryListingComponent } from './category-listing/category-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UtilsModule } from '../utils/utils.module';

const routes: Routes = [
  {
    path: '',
    component: CategoryListingComponent
  },
];


@NgModule({
  declarations: [
    CategoryListingComponent,
  ],
  imports: [RouterModule.forChild(routes),
    UtilsModule,
    CommonModule,
    DataTableModule,
    FormsModule,
    IconModule,
    ModalModule,
    ReactiveFormsModule,
    NgxDatatableModule,

  ],
})
export class CategoriesModule { }
