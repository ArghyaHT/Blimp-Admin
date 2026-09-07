import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-faq-details',
  templateUrl: './faq-details.component.html',
  styleUrls: ['./faq-details.component.css']
})
export class FaqDetailsComponent extends BaseComponent {

  constructor(injector: Injector, private service: DashboardService, private activeRouter: Router) {
    super(injector);

    this.route.params.subscribe(params => {
      this.id = params['id']
    })
  }
  faqData: any
  id: any;
  token: any


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fetchData();
  }

  fetchData() {
    const body = {
      "faq_id": this.id
    }
    this.service.faq_details(this.token, body).subscribe((response: any) => {
      if (response.code === 200) {
        this.faqData = response.data;
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }

  goBack() {
    this.activeRouter.navigate(['/admin/cms/faq']);
  }

}
