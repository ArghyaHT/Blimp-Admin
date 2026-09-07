import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent extends BaseComponent {

  constructor(injector: Injector, private formBuilder: FormBuilder, private service: DashboardService,) {
    super(injector);
  }

  articleData: any
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
    this.service.article_details(this.token, body).subscribe((response: any) => {
      if (response.code === 200) {
        this.articleData = response.data;
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }

}
