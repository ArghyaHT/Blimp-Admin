import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticleListingComponent } from './article-list/article-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { AddArticleComponent } from './add-articles/add-article.component';
import { EditArticleComponent } from './edit-article/edit-article.component';
import { UtilsModule } from '../utils/utils.module';


const routes: Routes = [
  {
    path: '',
    component: ArticleListingComponent
  },
  {
    path: 'article-details/:id',
    component: ArticleDetailsComponent
  },
  { path: 'add-article', component: AddArticleComponent },
  { path: 'edit-article/:id', component: EditArticleComponent },
];


@NgModule({
  declarations: [
    ArticleListingComponent,
    ArticleDetailsComponent,
    AddArticleComponent,
    EditArticleComponent
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
export class ArticlesModule { }
