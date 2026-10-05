import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Pipes
import { ApprovalActionPipe, ContactMethodPipe, CustomDatePipe, DiscoverPipe, DonorRequestPipe, DraftPipe, EducationStatusPipe, EmploymentStatusPipe, NumberFormatPipe, PatientRelationPipe, PurposePipe, SafeUrlPipe, StatusPipe, SupoprtPipe, VerifiedPipe,
  TaxBenefitsPipe,
  FeaturedPipe
 } from './pipe/common.pipe';

// Components

import { ControlMessagesComponent } from './components/control-messages/control-messages.component';
import { TableSkeletonComponent } from './components/table-skeleton/table-skeleton.component';

@NgModule({
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NumberFormatPipe,
    StatusPipe,
    CustomDatePipe,
    ControlMessagesComponent,
    TableSkeletonComponent,
    DraftPipe,
    SupoprtPipe,
    DiscoverPipe,
    FeaturedPipe,
    VerifiedPipe,
    TaxBenefitsPipe,
    ApprovalActionPipe,
    PurposePipe,
    PatientRelationPipe,
    EducationStatusPipe,
    EmploymentStatusPipe,
    ContactMethodPipe,
    DonorRequestPipe,
    SafeUrlPipe

  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [NumberFormatPipe, ControlMessagesComponent, TableSkeletonComponent, StatusPipe, CustomDatePipe,
    DraftPipe, SupoprtPipe, DiscoverPipe,FeaturedPipe, VerifiedPipe, TaxBenefitsPipe,ApprovalActionPipe, PurposePipe, PatientRelationPipe,
    EducationStatusPipe, ContactMethodPipe, EmploymentStatusPipe, DonorRequestPipe,SafeUrlPipe

  ],
})
export class UtilsModule { }
