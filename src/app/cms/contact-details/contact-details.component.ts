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

  fetchData() {
    const body = {
      "contact_id": this.id
    }
    this.service.contact_details(this.token, body).subscribe((response: any) => {
      if (response.code === 200) {
        this.contactData = response.data;
      } else {
        this.handleError(response.code, response.message); 
      }
    });
  }

}
