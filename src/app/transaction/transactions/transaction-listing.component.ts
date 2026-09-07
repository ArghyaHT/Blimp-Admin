
import { Component, Injector, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-transaction-listing',
  templateUrl: './transaction-listing.component.html',
  styleUrls: ['./transaction-listing.component.css']
})
export class TransactionListingComponent extends BaseComponent {

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  constructor(injector: Injector, private service: DashboardService) {
    super(injector);
  }

  columnMode = ColumnMode.force;
  is_submited = false;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalTransaction: number = 0;
  rows: any[] = [];
  token: any;
  adminId:any
  columns = [];
  selectedCampaignOption: any;
  options: any[] = [];


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');
    this.getCampaignName();
    this.fetchData();
  }


  getCampaignName() {
    this.service.getCampaignName(this.token, '').subscribe((response: any) => {
      if (response.code === 200) {
        this.options = response.data;
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }


  fetchData(sortBy: any = '', searchTerm: string = '') {
    const requestData = {
      page: this.page,
      search_text: this.search,
      record_count: parseInt(this.per_page),
      campaign_id: this.selectedCampaignOption ? this.selectedCampaignOption : null,
    };

    this.service.transactionList(this.token, requestData).subscribe((response: any) => {
      if (response.code === 200) {
        this.rows = response.data.Donations;
        this.totalTransaction = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalTransaction / this.per_page);

      } else {
        this.handleError(response.code, response.message);
        this.totalTransaction = 0;
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
    if (this.totalTransaction === 0) {
      return 'No entries to display';
    }

    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalTransaction) {
      end = this.page * this.per_page;
    } else {
      end = this.totalTransaction;
    }
    const totalEntries = this.totalTransaction;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }


}
