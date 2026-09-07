import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogsDetailsComponent extends BaseComponent{

  constructor(injector: Injector,private service: DashboardService) { 
    super(injector);
  }
  blogData: any
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
      "blog_id": this.id
    }
    this.service.Blog_details(this.token, body).subscribe((response: any) => {
      if (response.code === 200) {
        this.blogData = response.data;
      } else {
        this.handleError(response.code, response.message); 
      }
    });
  }

}
