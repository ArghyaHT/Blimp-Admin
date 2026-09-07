import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamsDetailsComponent extends BaseComponent {

  constructor(injector: Injector,private service: DashboardService) {
    super(injector);
   }
  teamData: any
  id: any;
  token: any


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
    this.service.Teams_details(this.token, body).subscribe((response: any) => {
      if (response.code === 200) {
        this.teamData = response.data;
      } else {
        this.handleError(response.code, response.message); 

      }
    });
  }

}
