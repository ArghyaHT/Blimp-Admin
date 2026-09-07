import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-faq',
  templateUrl: './add-faq.component.html',
  styleUrls: ['./add-faq.component.css']
})
export class AddFaqComponent extends BaseComponent {
  addFaqForm: FormGroup | any;
  is_submited = false;
  token: any;
  faqId: any;

  constructor(injector: Injector,
    private formBuilder: FormBuilder,
    private service: DashboardService,
  ) { super(injector); }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.setFaqForms();
  }

  setFaqForms() {
    this.addFaqForm = this.formBuilder.group({
      question_en: ['', [Validators.required]],
      answer_en: ['', [Validators.required]],
      question_fr: ['', [Validators.required]],
      answer_fr: ['', [Validators.required]],
      question_de: ['', [Validators.required]],
      answer_de: ['', [Validators.required]],
      question_it: ['', [Validators.required]],
      answer_it: ['', [Validators.required]],
    });
  }

  get faqF() { return this.addFaqForm.controls; }

  submitFaq(): void {
    this.is_submited = true;
    if (this.addFaqForm.valid) {
      const formData = this.addFaqForm.value;
      if (formData) {
        formData.id = this.faqId;
        this.service.addFAQ(this.token, formData).subscribe((response: any) => {
          if (response.code === 200) {
            this.showSuccessToast('FAQ added successfully!');
            this.router.navigate(['/admin/cms/faq']);
          } else {
            this.handleError(response.code, response.message);
          }
        });
      }
    } else {
      this.showErrorToast('Please fill in all required fields.');
    }
  }


  showSuccessToast(message: string): void {
    Swal.fire({
      icon: 'success',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }

  showErrorToast(message: string): void {
    Swal.fire({
      icon: 'error',
      title: message,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/cms/faq']);
  }
}
