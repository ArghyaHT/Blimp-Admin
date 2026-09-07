import { Component } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { slideDownUp } from '../../shared/animations';

@Component({
  selector: 'app-chef-details',
  templateUrl: './chef-details.component.html',
  styleUrls: ['./chef-details.component.css'],
  animations: [slideDownUp],
})
export class ChefDetailsComponent {
  constructor(private service: DashboardService, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.id = params['id']
    })
  }
  data: any
  id: any;
  showDescription: { [key: number]: boolean } = {};
  accordians1:any = 1;
  selectedSpecialty: any;
  
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']

      const Token = localStorage.getItem('token');
      const body = {
        "id": this.id
      }

      this.service.accepted_chef_detail(Token, body).subscribe((response: any) => {
        if (response.code == 1) {
          this.data = response.data;
      
        } else {

        }
      });
    })
  }
}
