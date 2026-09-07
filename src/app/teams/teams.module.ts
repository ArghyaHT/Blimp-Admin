import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsListingComponent } from './teams/teams-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { FormsModule } from '@angular/forms';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TeamsDetailsComponent } from './team-details/team-details.component';
import { EditTeamsComponent } from './edit-teams/edit-teams.component';
import { AddTeamsComponent } from './add-teams/add-teams.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { UtilsModule } from '../utils/utils.module';

const routes: Routes = [
  {
    path: '',
    component: TeamsListingComponent
  },
  {
    path: 'team-details/:id',
    component: TeamsDetailsComponent
  },
  { path: 'add-teams', component: AddTeamsComponent },
  { path: 'edit-teams/:id', component: EditTeamsComponent },

];


@NgModule({
  declarations: [
    TeamsListingComponent,
    TeamsDetailsComponent,
    EditTeamsComponent,
    AddTeamsComponent
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
export class TeamsModule { }
