import { Component } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd, NavigationError } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
})
export class AppComponent {
    constructor(router: Router) {
        // Hide the loader from index.html once the first page is ready (it covers the app download/startup)
        const subscription = router.events.subscribe((event) => {
            if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
                const loader = document.getElementById('app-initial-loader');
                loader?.classList.add('is-hidden');
                setTimeout(() => loader?.remove(), 250);
                subscription.unsubscribe();
            }
        });
    }
}
