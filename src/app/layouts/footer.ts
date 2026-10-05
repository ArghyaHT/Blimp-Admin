import { Component } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'footer',
    templateUrl: './footer.html',
    host: { role: 'contentinfo' },
})
export class FooterComponent {
    currYear: number = new Date().getFullYear();
    constructor() {}
    ngOnInit() {}
}
