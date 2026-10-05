import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import { FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { CloudinaryService } from 'src/app/service/cloudinary.service';

@Component({
  selector: 'app-campaign-details',
  templateUrl: './campaign-details.component.html',
  styleUrls: ['./campaign-details.component.css']
})
export class CampaignDetailsComponent extends BaseComponent {

  constructor(injector: Injector, private formBuilder: FormBuilder, private service: DashboardService,
    private sanitizer: DomSanitizer, private cloudinaryService: CloudinaryService
  ) {
    super(injector);
  }

  campaignData: any
  id: any;
  token: any;
  sanitizedUrl: any;
  loading = true;

  // resolved, browser-loadable media addresses (the API returns "cloudinary://…" values or bare ids)
  bannerUrl = '';
  videoUrl = '';
  aadharUrl = '';
  campaignImages: { url: string; broken?: boolean }[] = [];
  bannerError = false;
  aadharError = false;

  // yes/no switches shown in the "Visibility" card
  flags: { label: string; on: boolean }[] = [];

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
    this.loading = true;
    this.service.getCampaignDetails(this.token, body).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.campaignData = response.data;
          const c = this.campaignData || {};
          this.sanitizedUrl = c.youtube_link ? this.sanitizer.bypassSecurityTrustResourceUrl(c.youtube_link) : null;
          this.bannerUrl = this.cloudinaryService.getImageUrl(c.banner_image, 'bannerImages');
          this.videoUrl = this.cloudinaryService.getImageUrl(c.campaign_video, 'bannerVideo').replace('/image/upload/', '/video/upload/');
          this.aadharUrl = this.cloudinaryService.getImageUrl(c.aadhar_card);
          this.campaignImages = (c.campaignsImages || [])
            .map((img: any) => ({ url: this.cloudinaryService.getImageUrl(img?.image, 'multipleImages') }));
          this.flags = [
            { label: 'Supported', on: c.is_support === 1 },
            { label: 'Discoverable', on: c.is_discover === 1 },
            { label: 'Featured', on: c.is_featured === 1 },
            { label: 'Verified', on: c.is_verified === 1 },
            { label: 'Tax Benefits', on: c.is_tax_benefits === 1 },
          ];
        } else {
          this.handleError(response.code, response.message);
        }
      },
      error: () => { this.loading = false; },
    });
  }

  // Approved / Pending / Rejected badge colour
  approvalClass(value: any): string {
    if (value === 1) return 'badge-outline-success';
    if (value === 2) return 'badge-outline-danger';
    return 'badge-outline-warning';
  }

  downloadRecordPolicy() {
    window.open(this.documentUrl(this.campaignData?.record_policy), '_blank');
  }

  downloadMedicalDocument() {
    window.open(this.documentUrl(this.campaignData?.medical_document), '_blank');
  }

  private documentUrl(value: any): string {
    return this.cloudinaryService.getImageUrl(value) || value;
  }
}
