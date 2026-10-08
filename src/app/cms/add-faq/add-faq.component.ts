import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
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
  submitting = false; // true while the form is being saved ("Please wait..." on the submit button)
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
    if (this.submitting) {
      return;
    }
    this.is_submited = true;
    this.showFirstLanguageWithError();
    if (this.addFaqForm.valid) {
      const formData = this.addFaqForm.value;
      if (formData) {
        formData.id = this.faqId;
        this.submitting = true;
        this.service.addFAQ(this.token, formData).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
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

  // Language tabs: one question + answer per language
  faqLanguages = [
    { code: 'en', label: 'English' },
    { code: 'fr', label: 'French' },
    { code: 'de', label: 'German' },
    { code: 'it', label: 'Italian' },
  ];
  activeLang = 'en';

  langHasError(code: string): boolean {
    return ['question_', 'answer_'].some((prefix) => {
      const control = this.faqF[prefix + code];
      return control.invalid && (this.is_submited || control.touched);
    });
  }

  // after a failed save, open the first language that still has missing fields
  private showFirstLanguageWithError() {
    const first = this.faqLanguages.find((language) => this.langHasError(language.code));
    if (first && !this.langHasError(this.activeLang)) {
      this.activeLang = first.code;
    }
  }
}
