import { animate, style, transition, trigger } from '@angular/animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { BaseComponent } from '../utils/components/base/base.component';

@Component({
    moduleId: module.id,
    templateUrl: './boxed-signin.html',
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class BoxedSigninComponent extends BaseComponent {
  submitting = false; // true while the form is being saved ("Please wait..." on the submit button)
    loginForm: FormGroup;
    is_submited = false;
    passwordVisible: boolean = false;

    constructor(injector: Injector, private fb: FormBuilder, private Auth: AuthService) {
        super(injector);

        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')]],
            password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')]],
        })
    }

    ngOnInit() {
        this.Auth.reloadLogin()
    }

    get loginControl() {
        return this.loginForm.controls;
    }

    // Add a method to toggle the password visibility
    togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }

    handleLogin() {
        if (this.submitting) {
          return;
        }
        this.is_submited = true;
        if (this.loginForm.valid) {
            this.submitting = true;
            this.Auth.Login(this.loginForm.value).pipe(finalize(() => (this.submitting = false))).subscribe(
                (response: any) => {
                    if (response.code == 200) {
                        this.Auth.is_loggedIn.next(true);

                        localStorage.setItem('token', response.data.token);
                        localStorage.setItem('adminId', response.data.id);
                        localStorage.setItem('name', response.data.firstname);
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('profile', response.data.profile_picture);
                        Swal.fire({
                            icon: 'success',
                            title: response.message,
                            toast: true,
                            position: 'top-end',
                            showConfirmButton: false,
                            timer: 3000,
                        });

                        this.router.navigate(['/admin']);
                    } else {
                        this.handleError(response.code, response.message);
                    }
                },
            );
        }
    }


  

}
