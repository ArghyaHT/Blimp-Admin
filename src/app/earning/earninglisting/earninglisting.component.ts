import { Component, ViewChild, OnInit, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import * as ExcelJS from 'exceljs'

@Component({
  selector: 'app-earninglisting',
  templateUrl: './earninglisting.component.html',
  styleUrls: ['./earninglisting.component.css']
})


export class EarninglistingComponent extends BaseComponent {


  @ViewChild(DatatableComponent) table!: DatatableComponent;

  constructor(injector: Injector, private service: DashboardService, public fb: FormBuilder) {
    super(injector);
  }

  columnMode = ColumnMode.force;
  form1!: FormGroup;

  is_submited = false;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalEarnings: number = 0;
  rows: any[] = [];
  token: any;
  adminId: any
  selectedCampaignOption: any;
  options: any[] = [];


  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'Total Amount', prop: 'final_amount' },
    { name: 'Admin Final Amount', prop: 'admin_final_amount' },
    { name: 'Tip Amount', prop: 'tip_amount' },
    { name: 'Processing Fees', prop: 'processing_fees' },
    { name: 'User Fullname', prop: 'userInfo.fullname' },
    { name: 'User Email', prop: 'userInfo.email' },
    { name: 'Campaign Name', prop: 'campaignInfo.campaign_name' }
  ];


  basic: FlatpickrOptions = {
    defaultDate: new Date().toISOString().split('T')[0],
    dateFormat: 'Y-m-d',
    maxDate: 'today'
  };

  end_date_options: FlatpickrOptions = {
    dateFormat: 'Y-m-d',
    disable: []
  };


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');

    this.form1 = this.fb.group({
      start_date: [new Date().toISOString().split('T')[0], Validators.required],
      end_date: [new Date().toISOString().split('T')[0], Validators.required],

    });

    // this.form1 = this.fb.group({
    //   start_date: [null, Validators.required],
    //   end_date: [null, Validators.required],
    // });

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
    // Saare request parameters ko initialize karna
    const requestData: any = {
      page: this.page,
      search_text: this.search,
      record_count: parseInt(this.per_page),
      campaign_id: this.selectedCampaignOption ? this.selectedCampaignOption : null,
      start_date: this.formatDate(this.form1.get('start_date')?.value),
      end_date: this.formatDate(this.form1.get('end_date')?.value),
    };

    // const startDate = this.form1.get('start_date')?.value;
    // const endDate = this.form1.get('end_date')?.value;

    // if (startDate) {
    //   requestData.start_date = this.formatDate(startDate);
    // }
    // if (endDate) {
    //   requestData.end_date = this.formatDate(endDate);
    // }

    // API call for fetching data
    this.service.earningList(this.token, requestData).subscribe((response: any) => {
      if (response.code === 200) {
        this.rows = response.data.Earnings;
        this.totalEarnings = response.data.found_record_count; 
        this.totalPages = Math.ceil(this.totalEarnings / this.per_page);
      } else {
        this.handleError(response.code, response.message);
        this.totalEarnings = 0;
        this.totalPages = 0;
        this.rows = [];
      }
    });
  }



  formatDate(date: string): string {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1 < 10 ? `0${dateObj.getMonth() + 1}` : dateObj.getMonth() + 1;
    const day = dateObj.getDate() < 10 ? `0${dateObj.getDate()}` : dateObj.getDate();
    return `${year}-${month}-${day}`;
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
    if (this.totalEarnings === 0) {
      return 'No entries to display';
    }

    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalEarnings) {
      end = this.page * this.per_page;
    } else {
      end = this.totalEarnings;
    }
    const totalEntries = this.totalEarnings;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }


  exportTable(format: string) {
    switch (format) {
      case 'excel':
        this.exportExcel();
        break;
      // case 'csv':
      //   this.downloadFile(this.convertToCSV(this.rows), 'data.csv', 'text/csv');
      //   break;
      // case 'txt':
      //   this.downloadFile(this.convertToTXT(this.rows), 'data.txt', 'text/plain');
      //   break;
      default:
        break;
    }
  }

  exportExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Data');

    // Ensure that 'this.columns' is available and has the necessary structure
    if (!this.columns || this.columns.length === 0) {
      console.error('Columns are missing or empty');
      return;
    }

    // Add headers
    const headers = this.columns.map((column: any) => column.name);
    worksheet.addRow(headers);
    if (this.rows && this.rows.length > 0) {
      this.rows.forEach(row => {
        const rowData = this.columns.map((column: any) => {
          return this.getNestedValue(row, column.prop) || ''; 
        });
        worksheet.addRow(rowData);
      });

      workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        this.downloadEarningFile(blob, 'data.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      });
    } else {
      console.error('Rows are missing or empty');
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  downloadEarningFile(data: Blob | string, filename: string, type: string) {
    const blob = typeof data === 'string' ? new Blob([data], { type: type }) : data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }


}
