import { Component, Injector } from '@angular/core';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { DashboardService } from 'src/app/service/dashboard.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})


export class ContactUsComponent extends BaseComponent {
  constructor(injector: Injector,private service: DashboardService) { 
    super(injector);

  }
  columnMode = ColumnMode.force;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalContactInfo = 0;
  rows: any;
  token: any

  columns = [
  
  ];

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fetchContactData();
  }

  moveToFirstPage() {
    this.page = 1;
    this.fetchContactData();
  }

  moveToLastPage() {
    this.page = this.totalPages;
    this.fetchContactData();
  }

  moveToNextPage() {
    if (this.page < this.totalPages) {
      this.page++;
      this.fetchContactData();
    }
  }

  moveToPreviousPage() {
    if (this.page > 1) {
      this.page--;
      this.fetchContactData();
    }
  }

  searchData() {
    this.page = 1;

    this.fetchContactData(this.search);
    console.log(this.search);
  }


  changePerPage() {
    this.page = 1;
    this.fetchContactData();
  }

  getRange(): string {
    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalContactInfo) {
      end = this.page * this.per_page;
    } else {
      end = this.totalContactInfo;
    }
    const totalEntries = this.totalContactInfo;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }

  fetchContactData(searchTerm: string = '') {
    const requestData = {
      page: this.page,
      search_text: this.search,
      record_count: parseInt(this.per_page),
    };

    this.service.contactInfo(this.token, requestData).subscribe((response: any) => {
      if (response.code == 200) {
        this.rows = response.data.contactList;
        this.totalContactInfo = response.data.total_record_count;
        console.log(this.totalContactInfo)
        this.totalPages = Math.ceil(this.totalContactInfo / this.per_page);
      } else {
        this.handleError(response.code, response.message); 
      }
    });
  }



}
