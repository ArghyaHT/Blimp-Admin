
import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONSTANTS } from 'src/app/service/constant.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import { FlatpickrOptions } from 'ng2-flatpickr';
import * as ExcelJS from 'exceljs'

@Component({
  selector: 'app-campaign-listing',
  templateUrl: './campaign-listing.component.html',
  styleUrls: ['./campaign-listing.component.css']
})
export class CampaignListingComponent extends BaseComponent {

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
  token: any;
  constant = CONSTANTS
  adminId:any
  selectedCampaignOption: any;
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

  fetchData(sortBy: any = '', searchTerm: string = '') {
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


    this.service.getCampaigns(this.token, requestData).subscribe((response: any) => {
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


  toggleSupport(id: number, action: number) {
    const requestBody = { id: id, action: action, column: 'is_support',loggedInUserId : this.adminId };
    this.confirmAction('support', action)
      .then((result) => {
        if (result.isConfirmed) {
          this.service.updateCampaignStatus(this.token, requestBody).subscribe((response: any) => {
            this.handleResponse(response, 'Support status updated successfully!');
            if (response.status === 'success') {
              this.rows.forEach((campaign) => {
                campaign.is_support = 0;
              });
              const updatedCampaign = this.rows.find(campaign => campaign.id === id);
              if (updatedCampaign) {
                updatedCampaign.is_support = 1;
              }
            }
          });
        }
      });
  }

  toggleDiscover(id: number, action: number) {
    const requestBody = { id: id, action: action, column: 'is_discover', loggedInUserId : this.adminId };
    this.confirmAction('discover', action)
      .then((result) => {
        if (result.isConfirmed) {
          this.service.updateCampaignStatus(this.token, requestBody).subscribe((response: any) => {
            this.handleResponse(response, 'Discoverability status updated successfully!');
          });
        }
      });
  }


  toggleFeatured(id: number, action: number) {
    const requestBody = { id: id, action: action, column: 'is_featured', loggedInUserId : this.adminId };
    this.confirmAction('featured', action)
      .then((result) => {
        if (result.isConfirmed) {
          this.service.updateCampaignStatus(this.token, requestBody).subscribe((response: any) => {
            this.handleResponse(response, 'Featured status updated successfully!');
          });
        }
      });
  }


  toggleVerification(id: number, action: number) {
    const requestBody = { id: id, action: action, column: 'is_verified', loggedInUserId : this.adminId };
    this.confirmAction('verification', action)
      .then((result) => {
        if (result.isConfirmed) {
          this.service.updateCampaignStatus(this.token, requestBody).subscribe((response: any) => {
            this.handleResponse(response, 'Verification status updated successfully!');
          });
        }
      });
  }

  // toggleTaxBenefits(id: number, action: number) {
  //   const requestBody = { id: id, action: action, column: 'is_tax_benefits', loggedInUserId : this.adminId };
  //   this.confirmAction('tax benefits', action)
  //     .then((result) => {
  //       if (result.isConfirmed) {
  //         this.service.updateCampaignStatus(this.token, requestBody).subscribe((response: any) => {
  //           this.handleResponse(response, 'Tax benefits status updated successfully!');
  //         });
  //       }
  //     });
  // }
  

  confirmAction(type: string, action: number) {
    const actionText = action === 1 ? 'mark as' : 'revoke';
    return Swal.fire({
      title: `Are you sure?`,
      text: `You are about to ${actionText} ${type}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!'
    });
  }

  handleResponse(response: any, successMessage: string) {
    if (response.code === 200) {
      this.fetchData();
      Swal.fire({
        icon: 'success',
        title: successMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      this.handleError(response.code, response.message);
    }
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
        this.service.activateDeactivateCampaign(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Campaign InActivate successfully!',
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
        this.service.activateDeactivateCampaign(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Campaign Active successfully!',
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
        this.service.activateDeactivateTaxCampaign(this.token, requestBody).subscribe((response: any) => {
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Tax benefits removed successfully!',
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
        this.service.activateDeactivateTaxCampaign(this.token, requestBody).subscribe((response: any) => {
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Tax benefits activated successfully!',
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
    this.service.approveRejectCampaign(this.token, requestBody).subscribe((response: any) => {
      console.log(response);
      if (response.code === 200) {
        this.fetchData(); // Refresh the list to reflect changes
        Swal.fire({
          icon: 'success',
          title: successMessage,
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
        this.service.deleteCampaign(this.token, requestBody).subscribe((response: any) => {
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Campaign Deleted successfully!',
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
