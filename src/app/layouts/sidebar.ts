import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { slideDownUp } from '../shared/animations';
import { AuthService } from '../service/auth.service';
import { Subscription } from 'rxjs';

@Component({
    moduleId: module.id,
    selector: 'sidebar',
    templateUrl: './sidebar.html',
    animations: [slideDownUp],
})
export class SidebarComponent implements OnDestroy {
    private routerEvents?: Subscription;
    active = false;
    store: any;
    userPermission:any;
    role : any;
    adminId :any
    activeDropdown: string[] = [];
    parentDropdown: string = '';
    constructor(public translate: TranslateService, public storeData: Store<any>, public router: Router,
        private auth: AuthService,
    ) {
        this.initStore();
    }
    async initStore() {
        this.storeData.select((d) => d.index).subscribe((d) => {this.store = d;
        });
    }

    ngOnInit() {
        this.role = localStorage.getItem('role');
        this.adminId = localStorage.getItem('adminId');
        this.setActiveDropdown();
        this.getPermission();
    }

    // Open the CMS sub-menu whenever a CMS page is shown (also its details/add/edit pages and after a refresh).
    // Decided from the URL, because the menu items are not rendered yet when this first runs.
    setActiveDropdown() {
        this.openSectionFor(window.location.pathname);
        this.routerEvents = this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.openSectionFor(event.urlAfterRedirects);
            }
        });
    }

    ngOnDestroy() {
        this.routerEvents?.unsubscribe();
    }

    private openSectionFor(url: string) {
        if (url.startsWith('/admin/cms/') && !this.activeDropdown.includes('pages')) {
            this.activeDropdown.push('pages');
        }
    }

    // CMS sub-links whose pages live next to each other (/admin/cms/faq, /admin/cms/faq-details/5, …),
    // which routerLinkActive does not treat as the same section
    isCmsLinkActive(paths: string[]): boolean {
        const url = this.router.url.split(/[?#]/)[0];
        return paths.some((path) => url === path || url.startsWith(path + '/'));
    }

    toggleMobileMenu() {
        if (window.innerWidth < 1024) {
            this.storeData.dispatch({ type: 'toggleSidebar' });
        }
    }

    toggleAccordion(name: string, parent?: string) {
        if (this.activeDropdown.includes(name)) {
            this.activeDropdown = this.activeDropdown.filter((d) => d !== name);
        } else {
            this.activeDropdown.push(name);
        }
    }

    getPermission() {
        // Show the menu immediately from the last confirmed permissions, then refresh from the server
        this.userPermission = this.auth.getCachedAccess() || this.userPermission;
        this.auth.getPermission().subscribe({
            next: (response: any) => {
                if (response.code === 200) {
                    this.userPermission = { role: Number(response.role), permissions: response.permissions || [] };
                }
            },
            error: () => {},
        });
    }
}
