
import { AfterViewInit, Component, ElementRef, Injector, OnDestroy, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardService } from 'src/app/service/dashboard.service';
import { CloudinaryService } from 'src/app/service/cloudinary.service';
import Swal from 'sweetalert2';
import { ColumnMode, DatatableComponent } from '@swimlane/ngx-datatable';
import { FormBuilder } from '@angular/forms';
import { CONSTANTS } from 'src/app/service/constant.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-article-listing',
  templateUrl: './article-listing.component.html',
  styleUrls: ['./article-listing.component.css']
})
export class ArticleListingComponent extends BaseComponent implements AfterViewInit, OnDestroy {

  constructor(injector: Injector, private service: DashboardService, private formBuilder: FormBuilder, private cloudinaryService: CloudinaryService) {
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
  loading = false; // true while the list is being fetched (shows the table skeleton)
  token: any;
  constant = CONSTANTS
  adminId:any

  @ViewChild(DatatableComponent, { read: ElementRef }) tableElement?: ElementRef<HTMLElement>;
  private stickyFrame = 0;
  private stickyResizeObserver?: ResizeObserver;

  columns = [
    // { prop: 'id', name: 'Id', sortable: true },
    // { prop: 'name', name: 'Article Name', sortable: true },
    // { prop: 'action', name: 'Action', sortable: false }
  ];


  // Turns the stored image value into a loadable URL (same handling as country icons)
  articleImageUrl(value: string | null | undefined, folder: string): string {
    return this.cloudinaryService.getImageUrl(value, folder);
  }

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

    this.loading = true;
    this.service.article_list(this.token, requestData).pipe(finalize(() => (this.loading = false))).subscribe((response: any) => {
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

  // Image + Title stay at the table's left edge while the other columns scroll (same approach as the Campaigns list).
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
    // querySelector returns the first sticky column (Image); the rest follow it with the same shift.
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

  navigateToAddArticle() {
    this.router.navigate(['/admin/article/add-article']);
  }

  navigateToEditArticle(id: number) {
    this.router.navigate(['/admin/article/edit-article', id]);
  }


}
