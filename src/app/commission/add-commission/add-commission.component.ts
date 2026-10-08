import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardService } from 'src/app/service/dashboard.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-add-commission',
  templateUrl: './add-commission.component.html',
  styleUrls: ['./add-commission.component.css']
})
export class AddCommissionComponent extends BaseComponent {

  commissionForm: FormGroup | any;
  is_submited = false;
  token: any;
  adminId: any
  loading = true;     // true until the saved percentages have loaded
  submitting = false; // true while the update request is in progress ("Please wait..." on the button)

  constructor(injector: Injector, private fb: FormBuilder, private service: DashboardService,) {
    super(injector);


  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');
    this.setCommissionForm();
    this.getCommisionDetails();
  }

  setCommissionForm() {
    this.commissionForm = this.fb.group({
      commission: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      stripe_commission: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      adminId: []
    });
  }

  get commissioncontrol() { return this.commissionForm.controls; }

  getCommisionDetails() {
    this.loading = true;
    this.service.getCommissionDetails('').pipe(finalize(() => (this.loading = false))).subscribe((response: any) => {
      if (response.code === 200) {
        this.commissionForm.patchValue({
          commission: response.data.admin_commission,
          stripe_commission: response.data.admin_stripe_commission
        });
      }
    });
  }

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    const numericValue = Number(value);
    if (numericValue < 1 || numericValue > 100) {
      input.value = '';
    } else {
      input.value = value;
    }
  }

  submitForm() {
    this.commissionForm.value.adminId = this.adminId;
    this.is_submited = true;
    if (this.commissionForm.valid) {
      this.submitting = true;
      this.service.add_update_commission(this.token, this.commissionForm.value).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
        if (response.code == '200') {
          this.showToast('success', response.message);
          this.router.navigate(['/admin'])
        } else {
          this.handleError(response.code, response.message);
        }
      })
    } else {
      this.commissionForm.markAllAsTouched();
    }
  }
}
