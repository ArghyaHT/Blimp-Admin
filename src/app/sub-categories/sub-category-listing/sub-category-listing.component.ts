import { ModalComponent } from 'angular-custom-modal';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-subcategory-listing',
  templateUrl: './sub-category-listing.component.html',
  styleUrls: ['./sub-category-listing.component.css']
})
export class SubCategoryListingComponent extends BaseComponent {
  submitting = false; // true while the form is being saved ("Please wait..." on the submit button)

  @ViewChild('editsubcategory') editsubcategory!: ModalComponent;
  @ViewChild('addsubcategory') addsubcategory!: ModalComponent;
  @ViewChild(DatatableComponent) table!: DatatableComponent;

  AddSubcategoryForm: FormGroup | any;
  EditSubcategoryForm: FormGroup | any;
  token: string | null = '';
  columnMode = ColumnMode.force;
  editUserId: number = 0;
  is_submitted = false;
  search = '';
  page = 1;
  per_page = 10;
  totalPages = 0;
  totalSubcategory = 0;
  rows: any[] = [];
  categories: any[] = [];
  columns = [
    // { prop: 'id', name: 'Id', sortable: true },
    // { prop: 'name', name: 'Subcategory Name', sortable: true },
    // { prop: 'category_name', name: 'Category Name', sortable: true },
    // { prop: 'action', name: 'Action', sortable: false }
  ];

  constructor(injector: Injector, private formBuilder: FormBuilder, private service: DashboardService,) {
    super(injector);
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.initializeForms();
    this.fetchData();
    this.fetchCategories();
  }

  private initializeForms() {
    this.AddSubcategoryForm = this.formBuilder.group({
      category_id: ['', [Validators.required]],
      sub_category_name: [{ value: '', disabled: true }, [Validators.required]],
    });

    this.EditSubcategoryForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      category_id: ['', Validators.required],
      sub_category_name: ['', Validators.required],
    });
  }

  get addSubcategoryControl() {
    return this.AddSubcategoryForm.controls;
  }

  get editSubcategoryControl() {
    return this.EditSubcategoryForm.controls;
  }

  fetchData(sortBy: string = '', searchTerm: string = '') {
    const requestData = {
      page: this.page,
      search_text: this.search,
      record_count: this.per_page,
    };

    this.service.sub_category_list(this.token, requestData).subscribe((response: any) => {
      if (response.code === 200) {
        this.rows = response.data.SubCategories.map((item: any) => ({
          id: item.id,
          name: item.name,
          is_active: item.is_active,
          category: item.category ? item.category.name : null
        }));

        this.totalSubcategory = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalSubcategory / this.per_page);
      } else {
        this.handleError(response.code, response.message);
        this.totalSubcategory = 0;
        this.totalPages = 0;
        this.rows = [];
      }
    });
  }

  fetchCategories() {
    this.service.category_list(this.token, { page: 1, record_count: 100 }).subscribe((response: any) => {
      if (response.code === 200) {
        this.categories = response.data.category;
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }

  addSubcategory() {
    this.AddSubcategoryForm.get('sub_category_name')?.enable();
    this.AddSubcategoryForm.reset({ category_id: '', sub_category_name: '' });
    this.is_submitted = false;
    this.addsubcategory.open();
  }

  Add_Subcategory() {
    if (this.submitting) {
      return;
    }
    this.is_submitted = true;
    if (this.AddSubcategoryForm.valid) {
      const subcategoryData = {
        name: this.AddSubcategoryForm.value.sub_category_name,
        category_id: this.AddSubcategoryForm.value.category_id
      };
      this.submitting = true;
      this.service.add_sub_category(this.token, subcategoryData).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
        if (response.code === 200) {
          this.fetchData();
          this.AddSubcategoryForm.reset({ category_id: '', sub_category_name: '' });
          this.is_submitted = false;
          this.addsubcategory.close();
          this.showToast('success', response.message);
        }
      });
    }
  }
  editSubcategoryButton(id: number) {
    const subcategory = this.rows.find(row => row.id === id);
    if (subcategory) {
      const category = this.categories.find(cat => cat.name === subcategory.category);
      this.EditSubcategoryForm.patchValue({
        id: subcategory.id,
        category_id: category ? category.id : '',
        sub_category_name: subcategory.name
      });

      this.editsubcategory.open();
    } else {
      console.error(`Subcategory with id ${id} not found in rows array.`);
    }
  }

  Edit_Subcategory(): void | boolean {
    if (this.submitting) {
      return;
    }
    this.is_submitted = true;
    if (this.EditSubcategoryForm.valid) {
      this.EditSubcategoryForm.get('id')?.enable();
      const subcategoryData = {
        id: this.EditSubcategoryForm.value.id,
        name: this.EditSubcategoryForm.value.sub_category_name,
        category_id: this.EditSubcategoryForm.value.category_id
      };

      this.submitting = true;

      this.service.edit_sub_category(this.token, subcategoryData).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
        if (response.code === 200) {
          this.fetchData();
          this.editsubcategory.close();
          this.showToast('success', response.message);
        }
      });
    }
  }

  DeleteSubcategory(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this subcategory!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete_sub_category(this.token, { id }).subscribe((response: any) => {
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
    if (this.totalSubcategory === 0) {
      return 'No entries to display';
    }
    const start = (this.page - 1) * this.per_page + 1;
    const end = Math.min(this.page * this.per_page, this.totalSubcategory);
    return `Showing ${start} to ${end} of ${this.totalSubcategory} entries`;
  }

  cancel() {
    this.addsubcategory.close();
    this.editsubcategory.close();
    this.AddSubcategoryForm.reset({ category_id: '', sub_category_name: '' });
    this.AddSubcategoryForm.get('sub_category_name')?.disable();
  }

  toggleSubCategorytatus(id: number, isActive: boolean) {
    const requestBody = { id: id };
    const actionText = isActive ? ' Inactivate ' : 'Activate';
    const confirmationText = isActive ? 'Inactive' : 'Active';
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to ${actionText} this Sub Category!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${actionText} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.activeInactiveSubCategory(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: `Sub Category ${confirmationText.toLowerCase()} successfully!`,
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
