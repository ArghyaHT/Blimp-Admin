import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent extends BaseComponent {

  constructor(injector: Injector,private service: DashboardService) {
    super(injector);
    this.route.params.subscribe(params => {
      this.id = params['id']
    })
  }
  contactData: any
  id: any;
  token: any


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fetchData();
  }

  loading = true;

  fetchData() {
    const body = {
      "contact_id": this.id
    }
    this.loading = true;
    this.service.contact_details(this.token, body).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.contactData = response.data;
        } else {
          this.handleError(response.code, response.message);
        }
      },
      error: () => { this.loading = false; },
    });
  }

  get fullName(): string {
    return [this.contactData?.first_name, this.contactData?.last_name].filter((part) => String(part || '').trim()).join(' ');
  }

  get initials(): string {
    const parts = this.fullName.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase() || '?';
  }

  // opens the admin's mail app with the sender and "Re: <subject>" filled in
  get replyLink(): string {
    const subject = this.contactData?.subject ? 'Re: ' + this.contactData.subject : '';
    return 'mailto:' + this.contactData?.email + (subject ? '?subject=' + encodeURIComponent(subject) : '');
  }

}
