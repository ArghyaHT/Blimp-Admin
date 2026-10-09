
import { Component, ElementRef, Injector, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import { FlatpickrOptions, Ng2FlatpickrComponent } from 'ng2-flatpickr';
import * as ExcelJS from 'exceljs'
import { CloudinaryService } from 'src/app/service/cloudinary.service';


// (pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
(pdfMake as any).vfs = pdfFonts.vfs;

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class customerListingComponent extends BaseComponent {

  constructor(injector: Injector, private service: DashboardService, public fb: FormBuilder, private cloudinaryService: CloudinaryService) {
    super(injector);
  }

  // Phone code (digits only) -> flag image URL, from the countries managed in Manage Country
  countryFlags: Record<string, string> = {};

  @ViewChildren(Ng2FlatpickrComponent) datePickers!: QueryList<Ng2FlatpickrComponent>;

  form1!: FormGroup;
  columnMode = ColumnMode.force;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalCustomer: number = 0;
  rows: any[] = [];
  loading = false; // true while the list is being fetched (shows the table skeleton)
  token: any;
  selectedOption: any;
  options: any[] = [];
  selectedEmailOption: any;
  selectedUserType: any;


  basic: FlatpickrOptions = {
    //defaultDate: new Date().toISOString().split('T')[0],
    dateFormat: 'Y-m-d',
    maxDate: 'today'
  };

  end_date_options: FlatpickrOptions = {
    dateFormat: 'Y-m-d',
    disable: []
  };


  columns = [
    { name: 'Name', prop: 'fullname' },
    { name: 'Email', prop: 'email' },
    { name: 'Counry Code', prop: 'country_code' },
    { name: 'Phone Number', prop: 'phone_number' },
    { name: 'User TYpe', prop: 'user_type' },
    { name: 'Account TYpe', prop: 'account_type' },
    { name: 'Idenetity TYpe', prop: 'identity_type' },
    { name: 'Status', prop: 'is_active' },
  ];

  userTypeOptions = [
    { label: 'Donor', value: 1 },
    { label: 'Campaign', value: 2 },
  ];

  ngOnInit() {
    this.token = localStorage.getItem('token');

    this.form1 = this.fb.group({
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
    });


    this.loadCountryFlags();
    this.fetchData();
  }

  loadCountryFlags() {
    this.service.getCountry(this.token, {}).subscribe((response: any) => {
      if (response.code === 200) {
        for (const country of response.data || []) {
          const code = this.phoneCodeDigits(country.phone_code);
          if (code && !this.countryFlags[code]) {
            this.countryFlags[code] = this.cloudinaryService.getImageUrl(country.country_icon, 'country');
          }
        }
      }
    });
  }

  phoneCodeDigits(code: any): string {
    return String(code ?? '').replace(/\D/g, '');
  }

  get hasActiveFilters(): boolean {
    const { start_date, end_date } = this.form1?.value || {};
    return !!(this.search || this.selectedOption || this.selectedEmailOption || this.selectedUserType || start_date || end_date);
  }

  resetFilters() {
    this.search = '';
    this.selectedOption = undefined;
    this.selectedEmailOption = undefined;
    this.selectedUserType = undefined;
    // ng2-flatpickr doesn't clear its input on form reset, so clear the pickers directly (without firing change events)
    this.datePickers.forEach((picker: any) => picker.flatpickr?.clear(false));
    this.form1.reset();
    this.page = 1;
    this.fetchData();
  }

  // onComplete runs once the list has been refreshed (used to close the "Please wait..." loader)
  fetchData(searchTerm: string = '', onComplete?: () => void) {
    const requestData: any = {
      page: this.page,
      search_text: this.search,
      record_count: parseInt(this.per_page),
      customer_id: this.selectedOption ? this.selectedOption : null,
      email: this.selectedEmailOption ? this.selectedEmailOption : null,
      user_type: this.selectedUserType,
    };

    const startDate = this.form1.get('start_date')?.value;
    const endDate = this.form1.get('end_date')?.value;

    if (startDate) {
      requestData.start_date = this.formatDate(startDate);
    }
    if (endDate) {
      requestData.end_date = this.formatDate(endDate);
    }

    this.loading = true;
    this.service.customer_listing(this.token, requestData).pipe(finalize(() => {
      this.loading = false;
      onComplete?.();
    })).subscribe((response: any) => {
      if (response.code == 200) {
        this.options = response.data.customersList.map((customer: any) => ({ id: customer.id, name: customer.fullname, email: customer.email, user_type: customer.user_type }));
        this.rows = response.data.customersList;
        this.totalCustomer = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalCustomer / this.per_page);
      } else {
        this.rows = []
        this.handleError(response.code, response.message);
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

  toggleCustomerStatus(id: number, isActive: boolean) {
    const requestBody = { user_id: id };
    const actionText = isActive ? 'Block' : 'Unblock';
    const confirmationText = isActive ? 'Blocked' : 'Unblocked';
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to ${actionText} this Customer!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${actionText} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        // Full-screen "Please wait..." loader until the update and the list refresh are done (same as Campaigns)
        this.spinner.show();
        this.service.block_Unblock_Customer(this.token, requestBody).subscribe({
          next: (response: any) => {
            if (response.code === 200) {
              this.fetchData(this.search, () => {
                this.spinner.hide();
                Swal.fire({
                  icon: 'success',
                  title: `Customer ${confirmationText} Successfully!`,
                  toast: true,
                  position: 'top-end',
                  showConfirmButton: false,
                  timer: 3000
                });
              });
            } else {
              this.spinner.hide();
              Swal.fire({
                icon: 'error',
                title: response.message,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000
              });
            }
          },
          error: () => {
            this.spinner.hide();
            this.showToast('error', 'Something went wrong. Please check your internet connection and try again.');
          },
        });
      }
    });
  }

  deleteCustomer(id: any) {
    const requestBody = { user_id: id };
    console.log(requestBody);

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Delete this Customer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteCustomer(this.token, requestBody).subscribe((response: any) => {
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Customer Deleted successfully!',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000
            });
          } else {
            this.handleError(response.code, response.message);
          }
        });
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

    // Define mappings for user_type, account_type, and identity_type
    const userTypeMapping: any = {
      1: 'Donor',
      2: 'Campaigner',
    };

    const accountTypeMapping: any = {
      1: 'Independent',
      2: 'Organization',
    };

    const identityTypeMapping: any = {
      1: 'Anonymous',
      2: 'Share Identity',
      0: 'Not Defined',   
     };

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
          // Fetch the nested value using the prop
          const value = this.getNestedValue(row, column.prop);

          // Apply mapping based on the column.prop (e.g., user_type, account_type, identity_type)
          if (column.prop === 'user_type' && userTypeMapping[value] !== undefined) {
            return userTypeMapping[value];
          }

          if (column.prop === 'account_type' && accountTypeMapping[value] !== undefined) {
            return accountTypeMapping[value];
          }

          if (column.prop === 'identity_type' && identityTypeMapping[value] !== undefined) {
            return identityTypeMapping[value];
          }

          // Apply mapping for 'status' (is_active)
          if (column.prop === 'is_active') {
            return value === 1 ? 'Unblock' : 'Block';
          }

          // Return the value (or empty string if undefined)
          return value || '';
        });

        worksheet.addRow(rowData);
      });

      workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        this.downloadCustomerFile(blob, 'customer.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      });
    } else {
      console.error('Rows are missing or empty');
    }
  }


  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  downloadCustomerFile(data: Blob | string, filename: string, type: string) {
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

