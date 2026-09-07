import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DashboardService } from 'src/app/service/dashboard.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-edit-faq',
  templateUrl: './edit-faq.component.html',
  styleUrls: ['./edit-faq.component.css']
})
export class EditFaqComponent extends BaseComponent {
  editFaqForm: FormGroup | any;
  is_submited = false;
  faqId: any;
  token: any;
  id: any

  isEditing: boolean = false;

  constructor(
    injector: Injector,
    private fb: FormBuilder,
    private service: DashboardService,
  ) { super(injector); }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditing = true;
        this.faqId = +params['id'];
        this.fetchFaqDetails(this.faqId);
      }
    });

    this.editFaqForms();
  }

  editFaqForms() {
    this.editFaqForm = this.fb.group({
      id: [{ value: '', disabled: true }, Validators.required],
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

  get editFaqF() { return this.editFaqForm.controls; }

  fetchFaqDetails(faq_id: number): void {
    const faqId = {
      faq_id: faq_id
    }

    this.service.faq_details(this.token, faqId).subscribe((faq: any) => {
      this.editFaqForm.patchValue({
        question_en: faq.data.question_en,
        answer_en: faq.data.answer_en,
        question_fr: faq.data.question_fr,
        answer_fr: faq.data.answer_fr,
        question_de: faq.data.question_de,
        answer_de: faq.data.answer_de,
        question_it: faq.data.question_it,
        answer_it: faq.data.answer_it
      });
    });
  }

  editFAQ() {
    this.is_submited = true;
    if (this.editFaqForm.valid) {
      const requestBody = {
        faq_id: this.faqId,
        question_en: this.editFaqForm.value.question_en,
        answer_en: this.editFaqForm.value.answer_en,
        question_fr: this.editFaqForm.value.question_fr,
        answer_fr: this.editFaqForm.value.answer_fr,
        question_de: this.editFaqForm.value.question_de,
        answer_de: this.editFaqForm.value.answer_de,
        question_it: this.editFaqForm.value.question_it,
        answer_it: this.editFaqForm.value.answer_it,
      };
      this.service.UpdateFAQ(this.token, requestBody).subscribe((response: any) => {
        if (response.code === 200) {
          Swal.fire({
            icon: 'success',
            title: 'Faq Question Answer Updated successfully!',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
          this.router.navigate(['/admin/cms/faq']);
        } else {
          this.handleError(response.code, response.message);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/cms/faq']);
  }
}
