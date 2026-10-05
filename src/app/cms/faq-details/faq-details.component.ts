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

  loading = true;
  languages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
  ];

  fetchData() {
    const body = {
      "faq_id": this.id
    }
    this.loading = true;
    this.service.faq_details(this.token, body).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.faqData = response.data;
        } else {
          this.handleError(response.code, response.message);
        }
      },
      error: () => { this.loading = false; },
    });
  }

  // a language is complete when both its question and answer are filled in
  isComplete(code: string): boolean {
    return !!String(this.faqData?.['question_' + code] || '').trim() && !!String(this.faqData?.['answer_' + code] || '').trim();
  }

  get completeCount(): number {
    return this.languages.filter((language) => this.isComplete(language.code)).length;
  }

  goBack() {
    this.activeRouter.navigate(['/admin/cms/faq']);
  }

}
