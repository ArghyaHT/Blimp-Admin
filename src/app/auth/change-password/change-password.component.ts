import { Component, Injector } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import * as CryptoJS from 'crypto-js';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent extends BaseComponent {
  passwordForm: FormGroup;
  is_submitted = false;
  adminId : any;
  passwordVisible = false;
  newPasswordVisible = false;
  confirmPasswordVisible = false;

  constructor(injector: Injector,private fb: FormBuilder, private Auth: AuthService,) {
    super(injector);

    this.passwordForm = this.fb.group({
      old_password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$') ]],
      new_password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')]],
      match_password: ['', Validators.required],
      adminId : []
    }, {
      validator: this.ConfirmedValidator('new_password', 'match_password')
    })
  }

  get passwordControl() {
    return this.passwordForm.controls;
  }

  ngOnInit() {
    const adminId = localStorage.getItem('adminId');
    this.adminId = adminId
  }


  ConfirmedValidator(new_password: string, match_password: string) {
    return (registerformGroup: FormGroup) => {
      const pass = registerformGroup.controls[new_password];
      const cpass = registerformGroup.controls[match_password];

      if (cpass.errors && !cpass.errors['confirmedValidator']) {
        return;
      }

      if (pass.value !== cpass.value) {
        cpass.setErrors({ confirmedValidator: true });
      } else {
        if (cpass.hasError('confirmedValidator')) {
          cpass.setErrors(null);
        }
      }
    };
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleNewPasswordVisibility() {
    this.newPasswordVisible = !this.newPasswordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }
  
  submitForm() {
    const token : any = localStorage.getItem('token');
    this.passwordForm.value.adminId = this.adminId;
    this.is_submitted = true;
    if (this.passwordForm.valid) {
      this.Auth.Change_Password(token, this.passwordForm.value).subscribe((response: any) => {
        if (response.code == '200') {
          Swal.fire({ icon: 'success', title: response.message, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
          localStorage.removeItem('token');
          localStorage.removeItem('email');
          localStorage.removeItem('adminId');
          localStorage.clear()
          this.router.navigate(['']);
        } else {
          this.handleError(response.code, response.message); 
        }
      })
    } else {
      console.log('invalid');
    }
  }

}
