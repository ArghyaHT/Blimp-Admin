import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogsListingComponent } from './blogs/blogs-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BlogsDetailsComponent } from './blog-details/blog-details.component';
import { AddBlogsComponent } from './add-blogs/add-blogs.component';
import { EditBlogsComponent } from './edit-blogs/edit-blogs.component';
import { UtilsModule } from '../utils/utils.module';


const routes: Routes = [
  {
    path: '',
    component: BlogsListingComponent
  },
  {
    path: 'blog-details/:id',
    component: BlogsDetailsComponent
  },
  { path: 'add-blogs', component: AddBlogsComponent },
  { path: 'edit-blogs/:id', component: EditBlogsComponent },
];


@NgModule({
  declarations: [
    BlogsListingComponent,
    BlogsDetailsComponent,
    AddBlogsComponent,
    EditBlogsComponent
  ],
  imports: [RouterModule.forChild(routes),
    CommonModule,
    DataTableModule,
    FormsModule,
    IconModule,
    ModalModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UtilsModule

  ],
})
export class BlogsModule { }
