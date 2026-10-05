
import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONSTANTS } from 'src/app/service/constant.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import { FlatpickrOptions, Ng2FlatpickrComponent } from 'ng2-flatpickr';
import * as ExcelJS from 'exceljs'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-campaign-listing',
  templateUrl: './campaign-listing.component.html',
  styleUrls: ['./campaign-listing.component.css']
})
export class CampaignListingComponent extends BaseComponent implements AfterViewInit, OnDestroy {

  constructor(injector: Injector, private service: DashboardService, private formBuilder: FormBuilder) {
    super(injector);
  }

  form1!: FormGroup;
  columnMode = ColumnMode.force;
  is_submited = false;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalCampaigns: number = 0;
  rows: any[] = [];
  loading = false; // true while the list is being fetched (shows the table skeleton)
  token: any;
  constant = CONSTANTS
  adminId:any
  selectedCampaignOption: any;

  @ViewChildren(Ng2FlatpickrComponent) datePickers!: QueryList<Ng2FlatpickrComponent>;
  @ViewChild(DatatableComponent, { read: ElementRef }) tableElement?: ElementRef<HTMLElement>;
  private stickyFrame = 0;
  private stickyResizeObserver?: ResizeObserver;
  options: any[] = [];
  columns = [
    { name: 'ID', prop: 'id' },
    { name: 'categories', prop: 'categories.name' },
    { name: 'Sub Categories', prop: 'subCategories.name' },
    { name: 'Country Name', prop: 'country.name' },
    { name: 'Campaign Name', prop: 'campaign_name' },
    { name: 'Description', prop: 'description' },
    { name: 'Target Amount', prop: 'target_amount' },
    { name: 'Name', prop: 'name' },
    { name: 'Email', prop: 'email' },
    { name: 'Beneficiary Details', prop: 'beneficiary_details' },
    { name: 'Team Member Name', prop: 'team_memeber_name' },
  ];

  basic: FlatpickrOptions = {
    //defaultDate: new Date().toISOString().split('T')[0],
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
    this.form1 = this.formBuilder.group({
      start_date: [null, Validators.required],
      end_date: [null, Validators.required],
    });
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

  fetchData(sortBy: any = '', searchTerm: string = '', onComplete?: () => void) {
    const requestData: any = {
      page: this.page,
      search_text: this.search,
      record_count: parseInt(this.per_page),
      campaign_id: this.selectedCampaignOption ? this.selectedCampaignOption : null,
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
    this.service.getCampaigns(this.token, requestData).pipe(finalize(() => (this.loading = false))).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.rows = response.data.Campaigns;
          this.totalCampaigns = response.data.total_record_count;
          this.totalPages = Math.ceil(this.totalCampaigns / this.per_page);

        } else {
          this.handleError(response.code, response.message);
          this.totalCampaigns = 0;
          this.totalPages = 0;
          this.rows = [];

        }
        onComplete?.();
      },
      error: () => onComplete?.(),
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

  ngAfterViewInit() {
    const table = this.tableElement?.nativeElement;
    if (table && typeof ResizeObserver !== 'undefined') {
      this.stickyResizeObserver = new ResizeObserver(() => this.scheduleStickyUpdate());
      this.stickyResizeObserver.observe(table);
    }
    this.scheduleStickyUpdate();
  }

  ngOnDestroy() {
    this.stickyResizeObserver?.disconnect();
    cancelAnimationFrame(this.stickyFrame);
  }

  // Campaign Name scrolls normally until it reaches the table's left edge, then stays there.
  // Positions are read from the DOM (not from scroll events) so it stays correct after resizes and reloads.
  scheduleStickyUpdate() {
    cancelAnimationFrame(this.stickyFrame);
    this.stickyFrame = requestAnimationFrame(() => this.updateStickyColumn());
  }

  private updateStickyColumn() {
    const table = this.tableElement?.nativeElement;
    const body = table?.querySelector<HTMLElement>('.datatable-body');
    const headerCell = table?.querySelector<HTMLElement>('.datatable-header-cell.sticky-col');
    if (!table || !body || !headerCell) {
      return;
    }
    // offsetLeft ignores transforms, so this is the column's normal position within its row
    const columnLeft = headerCell.offsetLeft;
    // The header row is moved by the table with a transform instead of scrolling, so read its own offset
    const headerTransform = getComputedStyle(headerCell.parentElement as HTMLElement).transform;
    const headerOffset = headerTransform && headerTransform !== 'none' ? -new DOMMatrixReadOnly(headerTransform).m41 : 0;

    const bodyShift = Math.max(0, body.scrollLeft - columnLeft);
    const headerShift = Math.max(0, headerOffset - columnLeft);
    table.style.setProperty('--sticky-col-shift', `${bodyShift}px`);
    table.style.setProperty('--sticky-col-header-shift', `${headerShift}px`);
    table.classList.toggle('sticky-col-active', bodyShift > 0);
  }

  get hasActiveFilters(): boolean {
    const { start_date, end_date } = this.form1?.value || {};
    return !!(this.search || this.selectedCampaignOption || start_date || end_date);
  }

  resetFilters() {
    this.search = '';
    this.selectedCampaignOption = undefined;
    // ng2-flatpickr doesn't clear its input on form reset, so clear the pickers directly (without firing change events)
    this.datePickers.forEach((picker: any) => picker.flatpickr?.clear(false));
    this.form1.reset();
    this.page = 1;
    this.fetchData();
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
    if (this.totalCampaigns === 0) {
      return 'No entries to display';
    }
    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalCampaigns) {
      end = this.page * this.per_page;
    } else {
      end = this.totalCampaigns;
    }
    const totalEntries = this.totalCampaigns;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }


  // action 1 = mark the campaign, action 0 = remove the status again (undo)
  toggleSupport(id: number, action: number) {
    this.updateCampaignFlag(id, action, 'is_support', 'Supported');
  }

  toggleDiscover(id: number, action: number) {
    this.updateCampaignFlag(id, action, 'is_discover', 'Discoverable');
  }

  toggleFeatured(id: number, action: number) {
    this.updateCampaignFlag(id, action, 'is_featured', 'Featured');
  }

  toggleVerification(id: number, action: number) {
    this.updateCampaignFlag(id, action, 'is_verified', 'Verified');
  }

  private updateCampaignFlag(id: number, action: number, column: string, label: string) {
    const requestBody = { id: id, action: action, column: column, loggedInUserId: this.adminId };
    this.confirmAction(label, action).then((result) => {
      if (result.isConfirmed) {
        const successMessage = action === 1 ? `Campaign marked as ${label.toLowerCase()} successfully!` : `${label} status removed successfully!`;
        this.runCampaignUpdate(this.service.updateCampaignStatus(this.token, requestBody), successMessage);
      }
    });
  }

  confirmAction(label: string, action: number) {
    return Swal.fire({
      title: 'Are you sure?',
      text: action === 1 ? `You are about to mark this campaign as ${label}.` : `You are about to remove the "${label}" status from this campaign.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: action === 1 ? '#3085d6' : '#d33',
      cancelButtonColor: action === 1 ? '#d33' : '#3085d6',
      confirmButtonText: action === 1 ? 'Yes, proceed!' : 'Yes, remove it!'
    });
  }

  // Shows the full-screen "Please wait..." loader until the update and the list refresh are done
  private runCampaignUpdate(request: Observable<any>, successMessage: string) {
    this.spinner.show();
    request.subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.fetchData('', '', () => {
            this.spinner.hide();
            this.showToast('success', successMessage);
          });
        } else {
          this.spinner.hide();
          this.handleError(response.code, response.message);
        }
      },
      error: () => {
        this.spinner.hide();
        this.showToast('error', 'Something went wrong. Please check your internet connection and try again.');
      },
    });
  }

  activeCampaign(id: number) {
    const requestBody = { id: id, loggedInUserId : this.adminId };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to InActive Campaign!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Inactivate It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.runCampaignUpdate(this.service.activateDeactivateCampaign(this.token, requestBody), 'Campaign InActivate successfully!');
      }
    });
  }

  inactiveCampaign(id: number) {
    const requestBody = { id: id , loggedInUserId : this.adminId};
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Active this Campaign!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Activate It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.runCampaignUpdate(this.service.activateDeactivateCampaign(this.token, requestBody), 'Campaign Active successfully!');
      }
    });
  }

  taxBenefitsCampaign(id: number) {
    const requestBody = { id: id, loggedInUserId: this.adminId };
    Swal.fire({
      title: 'Are you sure you want to remove tax benefits from this campaign?',
      text: 'You are about to deactivate tax benefits for this campaign.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Deactivate Tax Benefits'
    }).then((result) => {
      if (result.isConfirmed) {
        this.runCampaignUpdate(this.service.activateDeactivateTaxCampaign(this.token, requestBody), 'Tax benefits removed successfully!');
      }
    });
  }
  
  noTaxBenefitsCampaign(id: number) {
    const requestBody = { id: id, loggedInUserId: this.adminId };
    Swal.fire({
      title: 'Are you sure you want to activate tax benefits for this campaign?',
      text: 'You are about to activate tax benefits for this campaign.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Activate Tax Benefits'
    }).then((result) => {
      if (result.isConfirmed) {
        this.runCampaignUpdate(this.service.activateDeactivateTaxCampaign(this.token, requestBody), 'Tax benefits activated successfully!');
      }
    });
  }
  

  approveRejectCampaign(id: number) {
    // Initialize requestBody with id only
    let requestBody: { id: number; action: number };

    Swal.fire({
      title: 'What action would you like to perform?',
      text: 'Choose to approve or reject this campaign.',
      icon: 'question',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonColor: '#28a745',
      denyButtonColor: '#dc3545', 
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Approve',
      denyButtonText: 'Reject',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        // User chose to approve the campaign
        requestBody = { id: id, action: 1 }; // Setting action to 1 for Approve
        this.processCampaignAction(requestBody, 'Campaign approved successfully!');
      } else if (result.isDenied) {
        // User chose to reject the campaign
        requestBody = { id: id, action: 2 }; // Setting action to 2 for Reject
        this.processCampaignAction(requestBody, 'Campaign rejected successfully!');
      }
    });
  }

  processCampaignAction(requestBody: { id: number; action: number }, successMessage: string) {
    this.runCampaignUpdate(this.service.approveRejectCampaign(this.token, requestBody), successMessage);
  }

  deleteCamaign(id: number) {

    const requestBody = { id: id, loggedInUserId : this.adminId };

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Delete this Campaign!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.runCampaignUpdate(this.service.deleteCampaign(this.token, requestBody), 'Campaign Deleted successfully!');
      }
    });
  }

  navigateToEditCampaign(id: number) {
    this.router.navigate(['/admin/campaign/edit-campaign', id]);
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
        this.downloadEarningFile(blob, 'campaign.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
