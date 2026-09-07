import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsComponent } from './about-us/about-us.component';
import { Routes, RouterModule } from '@angular/router';
import { FaqComponent } from './faq/faq.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsConditionComponent } from './terms-condition/terms-condition.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { DataTableModule } from '@bhplugin/ng-datatable';
import { IconModule } from 'src/app/shared/icon/icon.module';
import { ModalModule } from 'angular-custom-modal';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { NgSelectModule } from '@ng-select/ng-select';
import { FaqDetailsComponent } from './faq-details/faq-details.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { httpTranslateLoader } from '../app.module';
import { HttpClient } from '@angular/common/http';
import { ContactDetailsComponent } from './contact-details/contact-details.component';
import { AddFaqComponent } from './add-faq/add-faq.component';
import { EditFaqComponent } from './edit-faq/edit-faq.component';



const routes: Routes = [
  {
    path: 'about-us',
    component: AboutUsComponent
  },

  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-condition',
    component: TermsConditionComponent
  },
  {
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'contact-details/:id',
    component: ContactDetailsComponent
  },
  { path: 'faq', component: FaqComponent },
  { path: 'faq-details/:id', component: FaqDetailsComponent },
  { path: 'add-faq', component: AddFaqComponent },
  { path: 'edit-faq/:id', component: EditFaqComponent }

];



@NgModule({
  declarations: [
    AboutUsComponent,
    FaqComponent,
    PrivacyPolicyComponent,
    TermsConditionComponent,
    ContactUsComponent,
    FaqDetailsComponent,
    ContactDetailsComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    AngularEditorModule,
    FormsModule,
    DataTableModule,
    IconModule,
    ModalModule,
    NgxDatatableModule,
    Ng2FlatpickrModule,
    ReactiveFormsModule,
    NgSelectModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient],
      },
    }),
  ],
})
export class CmsModule { }
