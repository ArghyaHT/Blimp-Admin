import { ModalComponent } from 'angular-custom-modal';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-category-listing',
  templateUrl: './category-listing.component.html',
  styleUrls: ['./category-listing.component.css']
})
export class CategoryListingComponent extends BaseComponent {

  @ViewChild('editcategory') editcategory!: ModalComponent;
  @ViewChild('addcategory') addcategory!: ModalComponent;
  @ViewChild(DatatableComponent) table!: DatatableComponent;

  AddcategoryForm!: FormGroup;
  EditcategoryForm!: FormGroup;
  token: string | null = '';
  columnMode = ColumnMode.force;
  editUserId: number = 0;
  is_submitted = false;
  search = '';
  page = 1;
  per_page = 10;
  totalPages = 0;
  totalCategory = 0;
  totalCustomer = 0;
  rows: any[] = [];
  columns = [
    { prop: 'id', name: 'Id', sortable: true },
    { prop: 'name', name: 'Category Name', sortable: true },
    { prop: 'action', name: 'Action', sortable: false }
  ];



  constructor(injector: Injector, private formBuilder: FormBuilder, private service: DashboardService,) {
    super(injector);
  }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.initializeForms();
    this.fetchData();
  }

  private initializeForms() {
    this.AddcategoryForm = this.formBuilder.group({
      category_name: ['', [Validators.required]],
    });

    this.EditcategoryForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      category_name: ['', Validators.required],
    });
  }

  get addcategoryControl() {
    return this.AddcategoryForm.controls;
  }

  get editcategoryControl() {
    return this.EditcategoryForm.controls;
  }

  fetchData(sortBy: string = '', searchTerm: string = '') {
    const requestData = {
      page: this.page,
      search_text: this.search,
      record_count: this.per_page,
    };


    this.service.category_list(this.token, requestData).subscribe((response: any) => {
      if (response.code === 200) {
        this.rows = response.data.category;
        this.totalCategory = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalCategory / this.per_page);
      } else {
         this.handleError(response.code, response.message);
         this.totalCategory = 0; 
         this.totalPages = 0; 
         this.rows = [];
      }
    });
  }

  addCategory() {
    this.addcategory.open();
    this.AddcategoryForm.reset({ category_name: '' });
    this.is_submitted = false;
  }

  Add_Category() {
    this.is_submitted = true;
    if (this.AddcategoryForm.valid) {
      const categoryData = { name: this.AddcategoryForm.value.category_name };
      this.service.add_category(this.token, categoryData).subscribe((response: any) => {
        if (response.code === 200) {
          this.fetchData();
          this.AddcategoryForm.reset({ category_name: '' });
          this.is_submitted = false;
          this.addcategory.close();
           this.showToast('success', response.message);
        }
      });
    }
  }

  editcategorybutton(id: number) {
    const category = this.rows.find(row => row.id === id);
    if (category) {
      this.EditcategoryForm.patchValue({ id, category_name: category.name });
      this.editcategory.open();
    } else {
      console.error(`Category with id ${id} not found.`);
    }
  }

  Edit_Category() {
    this.is_submitted = true;
    if (this.EditcategoryForm.valid) {
      this.EditcategoryForm.get('id')?.enable();
      const categoryData = {
        id: this.EditcategoryForm.value.id,
        name: this.EditcategoryForm.value.category_name
      };
      this.service.edit_category(this.token, categoryData).subscribe((response: any) => {
        if (response.code === 200) {
          this.fetchData();
          this.editcategory.close();
           this.showToast('success', response.message);
        }
      });
    }
  }

  DeleteCategory(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this category!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete_category(this.token, { id }).subscribe((response: any) => {
          if (response.code === 200) {
            this.fetchData();
             this.showToast('success', response.message);
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
    if (this.totalCategory === 0) {
        return 'No entries to display';
    }
    const start = (this.page - 1) * this.per_page + 1;
    const end = Math.min(this.page * this.per_page, this.totalCategory);
    return `Showing ${start} to ${end} of ${this.totalCategory} entries`;
}

  cancel() {
    this.addcategory.close();
    this.editcategory.close();
  }


  toggleCategorytatus(id: number, isActive: boolean) {
    const requestBody = { id: id };
    const actionText = isActive ? ' Inactivate ' : 'Activate';
    const confirmationText = isActive ? 'Inactive' : 'Active';
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to ${actionText} this Category!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${actionText} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.activeInactiveCategory(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: `Category ${confirmationText.toLowerCase()} successfully!`,
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

}
