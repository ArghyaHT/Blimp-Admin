import { ModalComponent } from 'angular-custom-modal';
import { Component, Injector, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent extends BaseComponent {

  @ViewChild(DatatableComponent) table!: DatatableComponent;

  addFaqForm: FormGroup | any;
  editFaqForm: FormGroup | any;

  constructor(injector: Injector, private service: DashboardService, private formBuilder: FormBuilder) {
    super(injector);
  }

  columnMode = ColumnMode.force;
  editUserId: number = 0;
  is_submited = false;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalFaq: number = 0;
  rows: any[] = [];
  token: any;
  editFaqId: any;

  columns = [
    { prop: 'id', name: 'Id', sortable: true },
    { prop: 'question', name: 'Question', sortable: true },
    { prop: 'answer', name: 'Answer', sortable: true },
    { prop: 'action', name: 'Action', sortable: false }
  ];

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fetchData();
  }

  onSort(event: any) {
    const sort = event.sorts[0];
    this.fetchData(sort.prop);
  }

  fetchData(searchTerm: string = '') {
    const requestData = {
      page: this.page,
      search_text: this.search,
      record_count: parseInt(this.per_page),
    };
    this.service.faqQuestionAnswerList(this.token, requestData).subscribe((response: any) => {
      if (response.code == 200) {
        this.rows = response.data.Faq;
        this.totalFaq = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalFaq / this.per_page);
      } else {
        this.handleError(response.code, response.message);
        this.totalFaq = 0;
        this.totalPages = 0;
        this.rows = [];
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

  changePerPage(event: Event) {
    this.page = 1;
    this.per_page = Number((event.target as HTMLSelectElement).value);
    this.fetchData();
  }

  getRange(): string {
    if (this.totalFaq === 0) {
      return 'No entries to display';
    }
    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalFaq) {
      end = this.page * this.per_page;
    } else {
      end = this.totalFaq;
    }
    const totalEntries = this.totalFaq;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }

  toggleFAQStatus(id: number, isActive: boolean) {
    const requestBody = { faq_id: id };
    const actionText = isActive ? ' Inactivate ' : 'Activate';
    const confirmationText = isActive ? 'Inactive' : 'Active';
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to ${actionText} this FAQ!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${actionText} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.active_Inactive_FAQ(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: `FAQ ${confirmationText.toLowerCase()} successfully!`,
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

  deleteFAQ(id: number) {
    const requestBody = { faq_id: id };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Delete this FAQ!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.deleteFAQ(this.token, requestBody).subscribe((response: any) => {
          if (response.code == 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'FAQ Deleted successfully!',
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


  navigateToAddFaq() {
    this.router.navigate(['/admin/cms/add-faq']);
  }

  navigateToEditFaq(id: number) {
    this.router.navigate(['/admin/cms/edit-faq', id]);
  }

}
