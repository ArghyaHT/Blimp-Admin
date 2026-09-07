import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignListingComponent } from './campaign-list/campaign-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UtilsModule } from '../utils/utils.module';
import { CampaignDetailsComponent } from './campaign-details/campaign-details.component';
import { EditCampaignComponent } from './edit-campaign/edit-campaign.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { NgSelectModule } from '@ng-select/ng-select';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';



const routes: Routes = [
  {
    path: '',
    component: CampaignListingComponent
  },
  {
    path: 'campaign-details/:id',
    component: CampaignDetailsComponent
  },
  { path: 'edit-campaign/:id', component: EditCampaignComponent },
];


@NgModule({
  declarations: [
    CampaignListingComponent,
    CampaignDetailsComponent,
    EditCampaignComponent
  ],
  imports: [RouterModule.forChild(routes),
    CommonModule,
    DataTableModule,
    FormsModule,
    IconModule,
    ModalModule,
    NgSelectModule,
    Ng2FlatpickrModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UtilsModule,
    AngularEditorModule,
    NgxDropzoneModule

  ],
  
})
export class CampaignsModule { }
