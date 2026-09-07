import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheflistingComponent } from './cheflisting/cheflisting.component';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { AcceptRejectChefComponent } from './accept-reject-chef/accept-reject-chef.component';
import { ModalModule } from 'angular-custom-modal';
import { AcceptRejectChefDetailsComponent } from './accept-reject-chef-details/accept-reject-chef-details.component';
import { ChefDetailsComponent } from './chef-details/chef-details.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

const routes: Routes = [
  {
    path: 'cheflisting',
    component: CheflistingComponent,
  },
  {
    path: 'accept-reject_chef',
    component: AcceptRejectChefComponent,
  },
  {
    path: 'accept-reject_chef_details/:id',
    component: AcceptRejectChefDetailsComponent,
  },
  {
    path: 'chef-details/:id',
    component: ChefDetailsComponent,
  },


];

@NgModule({
  declarations: [
    CheflistingComponent,
    AcceptRejectChefComponent,
    AcceptRejectChefDetailsComponent,
    ChefDetailsComponent
  ],
  imports: [RouterModule.forChild(routes),
    CommonModule,
    DataTableModule,
    FormsModule,
    IconModule,
    ModalModule,
    NgxDatatableModule


  ],

})
export class ChefModule { }
