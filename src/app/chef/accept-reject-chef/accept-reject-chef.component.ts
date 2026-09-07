import { Component, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-accept-reject-chef',
  templateUrl: './accept-reject-chef.component.html',
  styleUrls: ['./accept-reject-chef.component.css']
})
export class AcceptRejectChefComponent {

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  constructor(private service: DashboardService) { }

  columnMode = ColumnMode.force;
  search = '';
  page: number = 1;
  per_page: number = 10;
  totalPages: number = 0;
  totalCustomer: number = 0;
  rows: any[] = [];
  columns = [
    { prop: 'id', name: 'Id', sortable: true },
    { prop: 'profile_pic', name: 'Profile image',sortable: false },
    { prop: 'chef_full_name', name: 'Chef Name' ,sortable: true },
    { prop: 'email', name: 'Email',sortable: true },
    { prop: 'mobile', name: 'Phone Number', sortable: true },
    { prop: 'accptance_status', name: 'Accptance Status', sortable: true },
    { prop: 'action', name: 'Action', sortable: false }
  ];



  fetchData(searchTerm: string = '') {
    const Token = localStorage.getItem('token');
    const requestData = {
      page: this.page,
      search: this.search,
      per_page: this.per_page,
    };
    this.service.accept_reject_Chef_Listing(Token, requestData).subscribe((response: any) => {
      if (response.code == 1) {
        this.rows = response.data.result;
        this.totalCustomer = response.data.cResults[0].total_request;
        this.totalPages = Math.ceil(this.totalCustomer / this.per_page);
      } else if (response.code == 2) {
        this.rows = [];
        Swal.fire({ icon: 'error', title: response.message, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      } else {
        Swal.fire({ icon: 'error', title: response.message, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      }
    });
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


  accept_chef(id: number) {
    const Token = localStorage.getItem('token');
    const requestBody = { id: id };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Accept this users request!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, accept it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.accept_chef(Token, requestBody).subscribe((response: any) => {
          if (response.code == 1) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'User request accepted successfully!',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: response.message,
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
          }
        });
      }
    });
  }

  searchData() {
    
    this.page = 1;

    this.fetchData(this.search);
  }

  changePerPage() {
    this.page = 1;
    this.fetchData();
  }

  getRange(): string {
    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalCustomer) {
      end = this.page * this.per_page;
    } else {
      end = this.totalCustomer;
    }
    const totalEntries = this.totalCustomer;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }

  ngOnInit() {
    this.fetchData();
  }
}
