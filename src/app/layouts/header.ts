import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import Swal from 'sweetalert2';
import { animate, style, transition, trigger } from '@angular/animations';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { CloudinaryService } from 'src/app/service/cloudinary.service';

@Component({
    moduleId: module.id,
    selector: 'header',
    templateUrl: './header.html',
    host: { role: 'banner' },
    animations: [
        trigger('toggleAnimation', [
            transition(':enter', [style({ opacity: 0, transform: 'scale(0.95)' }), animate('100ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))]),
            transition(':leave', [animate('75ms', style({ opacity: 0, transform: 'scale(0.95)' }))]),
        ]),
    ],
})
export class HeaderComponent {
    email: string | null = localStorage.getItem('email');

    store: any;
    search = false;
    notifications = [
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong class="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong class="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong class="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ];
    messages = [
        {
            id: 1,
            image: this.sanitizer.bypassSecurityTrustHtml(
                `<span class="grid place-content-center w-9 h-9 rounded-full bg-success-light dark:bg-success text-success dark:text-success-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></span>`
            ),
            title: 'Congratulations!',
            message: 'Your OS has been updated.',
            time: '1hr',
        },
        {
            id: 2,
            image: this.sanitizer.bypassSecurityTrustHtml(
                `<span class="grid place-content-center w-9 h-9 rounded-full bg-info-light dark:bg-info text-info dark:text-info-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></span>`
            ),
            title: 'Did you know?',
            message: 'You can switch between artboards.',
            time: '2hr',
        },
        {
            id: 3,
            image: this.sanitizer.bypassSecurityTrustHtml(
                `<span class="grid place-content-center w-9 h-9 rounded-full bg-danger-light dark:bg-danger text-danger dark:text-danger-light"> <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span>`
            ),
            title: 'Something went wrong!',
            message: 'Send Reposrt',
            time: '2days',
        },
        {
            id: 4,
            image: this.sanitizer.bypassSecurityTrustHtml(
                `<span class="grid place-content-center w-9 h-9 rounded-full bg-warning-light dark:bg-warning text-warning dark:text-warning-light"><svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">    <circle cx="12" cy="12" r="10"></circle>    <line x1="12" y1="8" x2="12" y2="12"></line>    <line x1="12" y1="16" x2="12.01" y2="16"></line></svg></span>`
            ),
            title: 'Warning',
            message: 'Your password strength is low.',
            time: '5days',
        },
    ];
    fullName : any;
    userProfileImage: any;
    profileImageError = false;
    constructor(
        private Auth: AuthService,
        private cloudinaryService: CloudinaryService,
        public translate: TranslateService,
        public storeData: Store<any>,
        public router: Router,
        private sanitizer: DomSanitizer
    ) {
        this.initStore();
    }
    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                this.store = d;
            });
    }


    ngOnInit() {
        this.setActiveDropdown();
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.setActiveDropdown();
            }
        });

        const name = localStorage.getItem('name');
        this.fullName = name && name !== 'null' && name !== 'undefined' ? name : '';
        this.userProfileImage = this.cloudinaryService.getImageUrl(localStorage.getItem('profile'));
        this.profileImageError = false;
    }

    // Shown in place of the profile photo when none is set or it fails to load
    get userInitials(): string {
        return (this.fullName || '')
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part: string) => part[0].toUpperCase())
            .join('');
    }

    isValidUserProfileImage(imageUrl: string | null): boolean {
        return imageUrl !== null && 
               imageUrl.startsWith(this.userProfileImage) && 
               imageUrl.length > this.userProfileImage.length;
    }

    setActiveDropdown() {
        const selector = document.querySelector('ul.horizontal-menu a[routerLink="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const all: any = document.querySelectorAll('ul.horizontal-menu .nav-link.active');
            for (let i = 0; i < all.length; i++) {
                all[0]?.classList.remove('active');
            }
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link');
                if (ele) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele?.classList.add('active');
                    });
                }
            }
        }
    }

    removeNotification(value: number) {
        this.notifications = this.notifications.filter((d) => d.id !== value);
    }

    removeMessage(value: number) {
        this.messages = this.messages.filter((d) => d.id !== value);
    }

    onLogout() {
        const token = localStorage.getItem('token');
        const admin_id = localStorage.getItem('adminId');
        this.Auth.Logout(token, admin_id ).subscribe((res: any) => {
            if (res) {
                Swal.fire({ icon: 'success', title: res.message, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
                localStorage.removeItem('token');
                localStorage.removeItem('email');
                localStorage.removeItem('adminId');
                localStorage.removeItem('name');
                localStorage.removeItem('profile');
                localStorage.removeItem('adminAccess');
                this.router.navigate(['']);
            }
        })
    }

    logOut() {
        Swal.fire({
          title: 'Are you sure?',
          text: 'You are about to Log Out',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, Log Out!'
        }).then((result) => {
          if (result.isConfirmed) {
           this.onLogout();
          }
        });
      }

  
}
