
import { ModalComponent } from 'angular-custom-modal';
import { finalize } from 'rxjs/operators';
import { Component, Injector, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-subscribe-news-letters-listing',
  templateUrl: './subscribe-news-letters-listing.component.html',
  styleUrls: ['./subscribe-news-letters-listing.component.css']
})
export class SubscribeNewsLettersListingComponent extends BaseComponent {

  constructor(injector: Injector, private service: DashboardService, private formBuilder: FormBuilder) {
    super(injector);

  }
  columnMode = ColumnMode.force;
  is_submited = false;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalSubscribNewsLetters: number = 0;
  rows: any[] = [];
  loading = false; // true while the list is being fetched (shows the table skeleton)
  columns = [];
  token:any;


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fetchData();
  }

  fetchData(sortBy: any = '', searchTerm: string = '') {
    const requestData = {
      page: this.page,
      search_text: this.search,
      record_count: parseInt(this.per_page),
    };

    this.loading = true;
    this.service.subscribeNewsLetters(this.token,requestData).pipe(finalize(() => (this.loading = false))).subscribe((response: any) => {
      if (response.code === 200) {
        this.rows = response.data.SubscribeNewsLetters;
        this.totalSubscribNewsLetters = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalSubscribNewsLetters / this.per_page);

      } else {
        this.handleError(response.code, response.message);
        this.totalSubscribNewsLetters = 0;
        this.totalPages = 0;
        this.rows = [];
      }
    });
  }

  onSort(event: any) {
    const sort = event.sorts[0];
    this.fetchData(sort.prop);
  }

  moveToFirstPage() {
    this.page = 1;
    this.fetchData();
  }

  moveToLastPage() {
    this.page = this.totalPages;
    this.fetchData();
  }

  moveToNextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchData();
    }
  }

  moveToPreviousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchData();
    }
  }

  searchData() {
    this.page = 1;

    this.fetchData(this.search);
  }

  changePerPage(event: Event) {
    this.page = 1;
    this.per_page = Number((event.target as HTMLSelectElement).value);
    this.fetchData();
  }


  getRange(): string {
    if (this.totalSubscribNewsLetters === 0) {
      return 'No entries to display';
    }
    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalSubscribNewsLetters) {
      end = this.page * this.per_page;
    } else {
      end = this.totalSubscribNewsLetters;
    }
    const totalEntries = this.totalSubscribNewsLetters;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }

}
