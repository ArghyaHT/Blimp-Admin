import { Component, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode,SortType  } from '@swimlane/ngx-datatable';
import * as ExcelJS from 'exceljs'

@Component({
  selector: 'app-customerlisting',
  templateUrl: './customerlisting.component.html',
  styleUrls: ['./customerlisting.component.css']
})
export class CustomerlistingComponent {

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  constructor(private service: DashboardService) { }

  convertToCSV(rows: any[]): string {
    let csvContent = '';

    // Add headers
    const headers = this.columns.map(column => column.name);
    csvContent += headers.join(',') + '\n';

    // Add data rows
    rows.forEach(row => {
      const rowData = this.columns.map(column => row[column.prop]);
      csvContent += rowData.join(',') + '\n';
    });

    return csvContent;
  }

  exportTable(format: string) {
    switch (format) {
      case 'excel':
        this.exportExcel();
        break;
      case 'csv':
        this.downloadFile(this.convertToCSV(this.rows), 'data.csv', 'text/csv');
        break;
      case 'txt':
        this.downloadFile(this.convertToTXT(this.rows), 'data.txt', 'text/plain');
        break;
      default:
        break;
    }
  }
  
  convertToTXT(rows: any[]): string {
    let txtContent = '';

    // Add data rows
    rows.forEach(row => {
      this.columns.forEach(column => {
        txtContent += row[column.prop] + '\t'; 
      });
      txtContent += '\n';
    });

    return txtContent;
  }
  
  exportExcel() {
    // Create an Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Add headers
    const headers = this.columns.map(column => column.name);
    worksheet.addRow(headers);

    // Add data rows
    this.rows.forEach(row => {
      const rowData = this.columns.map(column => row[column.prop]);
      worksheet.addRow(rowData);
    });

    // Generate Excel file
    workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      this.downloadFile(blob, 'data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    });
  }

  downloadFile(data: Blob | string, filename: string, type: string) {
    const blob = typeof data === 'string' ? new Blob([data], { type: type }) : data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  columnMode = ColumnMode.force;
  search = '';
  page: number = 1;
  per_page: number = 10;
  totalPages: number = 0;
  totalCustomer: number = 0;
  rows: any[] = [];
  columns = [
    { prop: 'id', name: 'Id', sortable: true },
    { prop: 'profile_pic', name: 'Profile image', sortable: false },
    { prop: 'customer_name', name: 'Name', sortable: true },
    { prop: 'email', name: 'Email', sortable: true },
    { prop: 'total_order', name: 'Total Orders', sortable: false },
    { prop: 'registered_at', name: 'Registration Date', sortable: true },
    { prop: 'action', name: 'Action', sortable: false }
  ];

  fetchData(sortBy: any = '', searchTerm: string = '') {
    const Token = localStorage.getItem('token');
    const requestData = {
      page: this.page,
      search: this.search,
      per_page: this.per_page,
    };    
    this.service.Customer_Listing(Token, requestData).subscribe((response: any) => {
      if (response.code == 1) {
        this.rows = response.data.result;
        this.totalCustomer = response.data.cResults[0].total_customer;
        this.totalPages = Math.ceil(this.totalCustomer / this.per_page);
      } else if (response.code == 2) {
        this.rows = [];
      } else {
        Swal.fire({ icon: 'error', title: response.message, toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
      }
    });
  }

  Blockuser(id: number) {
    const Token = localStorage.getItem('token');
    const requestBody = { id: id };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to block this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, block it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.block_unblock__user(Token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code == 1) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'User blocked successfully!',
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

  UnBlockuser(id: number) {
    const Token = localStorage.getItem('token');
    const requestBody = { id: id };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Unblock this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, unblock it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.block_unblock__user(Token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code == 1) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'User unblocked successfully!',
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

  DeleteUser(id: number) {
    const Token = localStorage.getItem('token');
    const requestBody = { id: id };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Delete this user!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Delete_user(Token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code == 1) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'User Deleted successfully!',
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
    const end = Math.min(this.page * this.per_page, this.totalCustomer);
    return `Showing ${start} to ${end} of ${this.totalCustomer} entries`;
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

  ngOnInit() {
    this.fetchData();
  }
}
