import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

// icon
import { IconModule } from 'src/app/shared/icon/icon.module';

import { BoxedSigninComponent } from './boxed-signin';
import { ReactiveFormsModule } from '@angular/forms';


// headlessui
import { MenuModule } from 'headlessui-angular';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { loginGuard } from '../authguard/login.guard';


const routes: Routes = [
    {
        path: '',
        component: BoxedSigninComponent,
        canActivate: [loginGuard],
    },
    { 
        path: 'change-password',
        component: ChangePasswordComponent,
    },

];
@NgModule({
    imports: [RouterModule.forChild(routes),
        CommonModule,
        MenuModule,
        IconModule,
        ReactiveFormsModule
    ],
    declarations: [
        BoxedSigninComponent,
        ChangePasswordComponent,
    ],
})
export class AuthModule { }
