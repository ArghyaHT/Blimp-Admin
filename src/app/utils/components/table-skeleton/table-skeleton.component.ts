import { Component, Input } from '@angular/core';

// Placeholder shown in place of a data table while its first page of data is loading
@Component({
    selector: 'app-table-skeleton',
    template: `
        <div class="w-full animate-pulse" role="status" aria-label="Loading data">
            <div class="flex items-center gap-4 border-b border-white-light px-2 py-4 dark:border-[#1b2e4b]">
                <div *ngFor="let col of columnList" class="flex-1">
                    <div class="h-2.5 w-1/2 rounded bg-white-light dark:bg-[#1b2e4b]"></div>
                </div>
            </div>
            <div *ngFor="let row of rowList; let odd = odd" class="flex items-center gap-4 px-2 py-4" [ngClass]="odd ? 'bg-[#f5f5f5] dark:bg-[#1b2e4b]/30' : ''">
                <div *ngFor="let col of columnList" class="flex-1">
                    <div class="h-3 rounded bg-white-light dark:bg-[#1b2e4b]" [style.width]="barWidth(row, col)"></div>
                </div>
            </div>
            <span class="sr-only">Loading…</span>
        </div>
    `,
})
export class TableSkeletonComponent {
    @Input() rows = 6;
    @Input() columns = 5;

    private readonly widths = ['75%', '55%', '90%', '65%', '80%'];

    get rowList(): number[] {
        return Array.from({ length: this.rows }, (_, index) => index);
    }

    get columnList(): number[] {
        return Array.from({ length: this.columns }, (_, index) => index);
    }

    // Varied bar lengths so the placeholder looks like real content
    barWidth(row: number, col: number): string {
        return this.widths[(row + col * 2) % this.widths.length];
    }
}
