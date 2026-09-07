import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent extends BaseComponent {

  constructor(injector: Injector, private formBuilder: FormBuilder, private service: DashboardService,
    private sanitizer: DomSanitizer
  ) {
    super(injector);
  }

  campaignData: any
  id: any;
  token: any;
  sanitizedUrl: any; 


  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']
    })
    this.token = localStorage.getItem('token');
    this.fetchData();
  }

  fetchData() {
    const body = {
      "id": this.id
    }
    this.service.getCampaignDetails(this.token, body).subscribe((response: any) => {
      if (response.code === 200) {
        this.campaignData = response.data;
        this.sanitizedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.campaignData.youtube_link);
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }

  downloadRecordPolicy(){
    const pdfUrl = this.campaignData?.record_policy;
    window.open(pdfUrl, '_blank');
  }

  downloadMedicalDocument(){
    const pdfUrl = this.campaignData?.medical_document;
    window.open(pdfUrl, '_blank');
  }


}
