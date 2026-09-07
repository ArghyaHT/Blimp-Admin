import { Component } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent {

  constructor(private service: DashboardService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id']
    })
  }
  customerData: any
  id: any;
  token: any


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fetchData();
  }

  fetchData() {
    const body = {
      "user_id": this.id
    }
    this.service.customer_details(this.token, body).subscribe((response: any) => {
      if (response.code === 200) {
        this.customerData = response.data;
      } else {
        
      }
    });
  }

}
