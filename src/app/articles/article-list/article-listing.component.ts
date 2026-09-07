
import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder } from '@angular/forms';
import { CONSTANTS } from 'src/app/service/constant.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-article-listing',
  templateUrl: './article-listing.component.html',
  styleUrls: ['./article-listing.component.css']
})
export class ArticleListingComponent extends BaseComponent {

  constructor(injector: Injector, private service: DashboardService, private formBuilder: FormBuilder) {
    super(injector);
  }

  columnMode = ColumnMode.force;
  is_submited = false;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalArticle: number = 0;
  rows: any[] = [];
  token: any;
  constant = CONSTANTS
  adminId:any

  columns = [
    // { prop: 'id', name: 'Id', sortable: true },
    // { prop: 'name', name: 'Article Name', sortable: true },
    // { prop: 'action', name: 'Action', sortable: false }
  ];


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');
    this.fetchData();
  }

  fetchData(sortBy: any = '', searchTerm: string = '') {
    const requestData = {
      page: this.page,
      search_text: this.search,
      record_count: parseInt(this.per_page),
    };

    this.service.article_list(this.token, requestData).subscribe((response: any) => {
      if (response.code === 200) {
        this.rows = response.data.Articles;
        this.totalArticle = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalArticle / this.per_page);

      } else {
        this.handleError(response.code, response.message);
        this.totalArticle = 0;
        this.totalPages = 0;
        this.rows = [];

      }
    });
  }

  active_Article(id: number) {
    const requestBody = { id: id, loggedInUserId : this.adminId };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Inactive Article!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Inactivate It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.active_inactive_article(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Article InActivate successfully!',
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

  inactive_Article(id: number) {

    const requestBody = { id: id , loggedInUserId : this.adminId};
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Active this Article!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Activate It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.active_inactive_article(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Article Active successfully!',
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

  deleteArticle(id: number) {

    const requestBody = { id: id, loggedInUserId : this.adminId };

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Delete this Article!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete_article(this.token, requestBody).subscribe((response: any) => {
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Article Deleted successfully!',
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
    if (this.totalArticle === 0) {
      return 'No entries to display';
    }
    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalArticle) {
      end = this.page * this.per_page;
    } else {
      end = this.totalArticle;
    }
    const totalEntries = this.totalArticle;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }

  navigateToAddArticle() {
    this.router.navigate(['/admin/article/add-article']);
  }

  navigateToEditArticle(id: number) {
    this.router.navigate(['/admin/article/edit-article', id]);
  }


}
