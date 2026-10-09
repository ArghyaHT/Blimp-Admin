import { Component } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import { CloudinaryService } from 'src/app/service/cloudinary.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent {

  constructor(private service: DashboardService, private route: ActivatedRoute, private cloudinaryService: CloudinaryService) {
    this.route.params.subscribe(params => {
      this.id = params['id']
    })
  }
  customerData: any
  id: any;
  token: any
  loading = true;

  // country flag for the phone number, looked up by dialling code (same as the customer list)
  flagUrl = '';
  flagError = false;
  private countryFlags: Record<string, string> = {};

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.loadCountryFlags();
    this.fetchData();
  }

  fetchData() {
    const body = {
      "user_id": this.id
    }
    this.loading = true;
    this.service.customer_details(this.token, body).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.customerData = response.data;
          this.updateFlag();
        }
      },
      error: () => { this.loading = false; },
    });
  }

  loadCountryFlags() {
    this.service.getCountry(this.token, {}).subscribe((response: any) => {
      if (response.code === 200) {
        for (const country of response.data || []) {
          const code = this.phoneCodeDigits(country.phone_code);
          if (code && !this.countryFlags[code]) {
            this.countryFlags[code] = this.cloudinaryService.getImageUrl(country.country_icon, 'country');
          }
        }
        this.updateFlag();
      }
    });
  }

  private updateFlag() {
    this.flagUrl = this.countryFlags[this.phoneCodeDigits(this.customerData?.country_code)] || '';
    this.flagError = false;
  }

  phoneCodeDigits(code: any): string {
    return String(code ?? '').replace(/\D/g, '');
  }

  get initials(): string {
    const parts = String(this.customerData?.fullname || '').trim().split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  // is_active 0 = blocked; any other value = unblocked
  get isBlocked(): boolean {
    return this.customerData?.is_active === 0 || this.customerData?.is_active === '0';
  }

  get isDonor(): boolean {
    return this.customerData?.user_type === 1;
  }

  get identityLabel(): string {
    const type = this.customerData?.identity_type;
    return type === 1 ? 'Anonymous' : type === 2 ? 'Share Identity' : 'Not defined';
  }
}
