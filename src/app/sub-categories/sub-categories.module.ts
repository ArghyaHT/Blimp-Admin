import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SubCategoryListingComponent } from './sub-category-listing/sub-category-listing.component';

const routes: Routes = [
  {
    path: '',
    component: SubCategoryListingComponent
  },
];


@NgModule({
  declarations: [
    SubCategoryListingComponent
  ],
  imports: [RouterModule.forChild(routes),
    CommonModule,
    DataTableModule,
    FormsModule,
    IconModule,
    ModalModule,
    ReactiveFormsModule,
    NgxDatatableModule

  ],
})
export class SubCategoriesModule { }
