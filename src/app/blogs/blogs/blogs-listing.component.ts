
import { ModalComponent } from 'angular-custom-modal';
import { Component, Injector, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONSTANTS } from 'src/app/service/constant.service';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-blogs-listing',
  templateUrl: './blogs-listing.component.html',
  styleUrls: ['./blogs-listing.component.css']
})
export class BlogsListingComponent extends BaseComponent {

  @ViewChild('editBlogs') editBlogs!: ModalComponent;
  @ViewChild('addBlogs') addBlogs!: ModalComponent;
  @ViewChild(DatatableComponent) table!: DatatableComponent;

  addBlogsForm: FormGroup | any;
  editBlogsForm: FormGroup | any;

  constructor(injector: Injector, private service: DashboardService, private formBuilder: FormBuilder) {
    super(injector);
  }

  columnMode = ColumnMode.force;
  editBlogsId: number = 0;
  is_submited = false;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalBlogs: number = 0;
  rows: any[] = [];
  token: any;
  constant = CONSTANTS
  blogsFileName: any;
  blogsFile: any;
  // blogsImage: any;
  selectedFile: any;
  adminId:any

  columns = [
    // { prop: 'id', name: 'Id', sortable: true },
    // { prop: 'name', name: 'Blog Name', sortable: true },
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

    this.service.Blogs_List(this.token, requestData).subscribe((response: any) => {
      if (response.code === 200) {
        this.rows = response.data.Blogs;
        this.totalBlogs = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalBlogs / this.per_page);

      } else {
        this.handleError(response.code, response.message);
        this.totalBlogs = 0;
        this.totalPages = 0;
        this.rows = [];
      }
    });
  }


  active_Blogs(id: number) {
    const requestBody = { blog_id: id ,loggedInUserId : this.adminId};
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Inactive Blogs!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Inactivate It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Active_Inactive_Blog(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Blog InActivate successfully!',
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

  inactive_Blogs(id: number) {

    const requestBody = { blog_id: id, loggedInUserId : this.adminId};
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Active this Blog!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Activate It!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Active_Inactive_Blog(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Blog Active successfully!',
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

  deleteBlogs(id: number) {

    const requestBody = { blogs_id: id, loggedInUserId : this.adminId };
    console.log(requestBody);

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Delete this Blog!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Delete_Blog(this.token, requestBody).subscribe((response: any) => {
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Blog Deleted successfully!',
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
    if (this.totalBlogs === 0) {
      return 'No entries to display';
    }

    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalBlogs) {
      end = this.page * this.per_page;
    } else {
      end = this.totalBlogs;
    }
    const totalEntries = this.totalBlogs;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }

  cancel() {
    this.addBlogs.close();
    this.editBlogs.close();
  }

  navigateToAddBlogs() {
    this.router.navigate(['/admin/blogs/add-blogs']);
  }

  navigateToEditBlogs(id: number) {
    this.router.navigate(['/admin/blogs/edit-blogs', id]);
  }


}
