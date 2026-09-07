// import { ToastrService } from 'ngx-toastr';
import { Component, Injector } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from "ngx-spinner";


// Services
import { HttpService } from 'src/app/utils/services/http.service';
import { CONSTANTS } from 'src/app/utils/services/constant.service';
import { ValidationService } from 'src/app/utils/services/validator.service';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
    template: ''
})
export class BaseComponent {

    protected router: Router;
    protected route: ActivatedRoute
    public CONSTANTS = CONSTANTS;
    currentDate: Date = new Date();
    // protected toastr: ToastrService;
    protected httpService: HttpService;
    protected spinner: NgxSpinnerService
    protected activatedRoute: ActivatedRoute;
    protected validationService: ValidationService;
    protected datePipe: DatePipe | any;

    constructor(injector: Injector) {
        this.router = injector.get(Router);
        this.route = injector.get(ActivatedRoute);
        // this.toastr = injector.get(ToastrService);
        this.httpService = injector.get(HttpService);
        this.spinner = injector.get(NgxSpinnerService);
        this.activatedRoute = injector.get(ActivatedRoute);
        this.validationService = injector.get(ValidationService);
    }

    setToken(key: string, value: string) {
        return localStorage.setItem(key, value);
    }

    getToken(key: string) {
        return localStorage.getItem(key);
    }

    removeToken(key: string) {
        return localStorage.removeItem(key);
    }

    logout() {
        localStorage.clear();
        this.router.navigate([this.CONSTANTS.login]);
    }

    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    copyToClipboard(item: string): void {
        const listener = (e: any) => {
            e.clipboardData.setData('text/plain', (item));
            e.preventDefault();
        };
        document.addEventListener('copy', listener);
        document.execCommand('copy');
        document.removeEventListener('copy', listener);
        // this.toastr.success('Copied!');
    }

    downloadFile(url: string, fileName: string) {
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    dateFormat(date: any) {
        const formattedActiveDate = new Date(date.year, date.month - 1, date.day);
        if (formattedActiveDate) {
            const formatDate = this.datePipe.transform(formattedActiveDate, 'yyyy') + '-'
                + this.datePipe.transform(formattedActiveDate, 'MM') + '-'
                + this.datePipe.transform(formattedActiveDate, 'dd');

            date = this.datePipe.transform(formatDate, 'dd') +
                '-' + this.datePipe.transform(formatDate, 'MM')
                + '-' + this.datePipe.transform(formatDate, 'yyyy');
        }
        return date;
    }

    randomString() {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < 8; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return result;
    }

    handleError(errorCode: number, errorMessage: string) {
        if (errorCode === 401) {
          this.logout();
        //this.showToast('error', errorMessage);
        } else {
          this.showToast('error', errorMessage);
        }
      }


    showToast(icon: 'success' | 'error', title: string) {
        Swal.fire({
            icon,
            title,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
        });
    }



}
