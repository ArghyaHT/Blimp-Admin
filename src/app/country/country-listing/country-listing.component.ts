import { ModalComponent } from 'angular-custom-modal';
import { finalize } from 'rxjs/operators';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import { S3Service } from 'src/app/service/s3.service';
import { CloudinaryService } from 'src/app/service/cloudinary.service';

@Component({
  selector: 'app-country-listing',
  templateUrl: './country-listing.component.html',
  styleUrls: ['./country-listing.component.css']
})
export class CountryListingComponent extends BaseComponent {
  submitting = false; // true while the form is being saved ("Please wait..." on the submit button)

  @ViewChild('editcountry') editCountryModal!: ModalComponent;
  @ViewChild('addcountry') addCountryModal!: ModalComponent;
  @ViewChild(DatatableComponent) table!: DatatableComponent;

  addCountryForm!: FormGroup;
  editCountryForm!: FormGroup;
  token: string | null = '';
  columnMode = ColumnMode.force;
  is_submitted = false;
  search = '';
  page = 1;
  per_page = 10;
  totalPages = 0;
  totalCountry = 0;
  totalCustomer = 0;
  rows: any[] = [];
  loading = false; // true while the list is being fetched (shows the table skeleton)
  columns = [

  ];
  selectedFile: any
  countryIconName: any
  countryIcon: any
  countryIconContent: any;
  selectedCountryIconFile: any

  constructor(injector: Injector,
    private formBuilder: FormBuilder,
    private service: DashboardService,
    // private s3Service: S3Service,
    private cloudinaryService: CloudinaryService,

  ) {
    super(injector);
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.initializeForms();
    this.fetchData();
  }

  private initializeForms() {
    this.addCountryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(32)]],
      phone_code: ['', [Validators.required, Validators.pattern('^[0-9]{1,3}$')]],
      country_icon: [''] // optional: no new file keeps the current icon


    });

    this.editCountryForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      name: ['', [Validators.required, Validators.maxLength(32)]],
      phone_code: ['', [Validators.required, Validators.pattern('^[0-9]{1,3}$')]],
      country_icon: [''] // optional: no new file keeps the current icon

    });
  }

  get addCountryControl() {
    return this.addCountryForm.controls;
  }

  get editCountryControl() {
    return this.editCountryForm.controls;
  }

  private fetchData(sortBy: string = '', searchTerm: string = '') {
    const requestData = {
      page: this.page,
      search_text: this.search,
      record_count: this.per_page,
    };

    this.loading = true;
    this.service.country_list(this.token, requestData).pipe(finalize(() => (this.loading = false))).subscribe((response: any) => {
      if (response.code === 200) {
        this.rows = response.data.country.map((row: any) => ({
          ...row,
          iconUrl: this.cloudinaryService.getImageUrl(row.country_icon, 'country'),
        }));
        this.totalCountry = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalCountry / this.per_page);
      } else {
        this.handleError(response.code, response.message);
        this.totalCountry = 0;
        this.totalPages = 0;
        this.rows = [];
      }
    });
  }

  addCountryModalOpen() {
    this.addCountryModal.open();
    this.addCountryForm.reset({ name: '', phone_code: '', country_icon: '' });
    // clear a file picked the last time the pop-up was open
    this.selectedFile = null;
    this.countryIcon = null;
    this.is_submitted = false;
  }

  async addCountryFunction() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.is_submitted = true;
    if (this.addCountryForm.valid) {

      try {
        const categoryData: any = {
          'name': this.addCountryForm.value.name,
          'phone_code': this.addCountryForm.value.phone_code,
        }

        // The icon is optional: upload it to Cloudinary ('country' folder) only when a file was picked
        if (this.selectedFile) {
          const uploadResponse = await this.cloudinaryService.uploadFile(this.selectedFile, 'country');
          categoryData.country_icon = uploadResponse.public_id.split('/').pop() || '';
        }

        this.service.add_country(this.token, categoryData).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
          this.submitting = false;
          if (response.code === 200) {
            this.fetchData();
            this.addCountryForm.reset({ name: '', phone_code: '', country_icon: '' });
            this.selectedFile = null;
            this.countryIcon = null;
            this.is_submitted = false;
            this.addCountryModal.close();
            this.showToast('success', response.message);
          } else {
            this.handleError(response.code, response.message);
          }
        });
      } catch (error) {
        this.submitting = false;
        this.showToast('error', 'Upload failed');
      }
    } else {
      this.submitting = false;
    }
  }



  editCountryButton(id: number) {
    const country = this.rows.find(row => row.id === id);
    if (country) {
      this.editCountryForm.patchValue({
        id: country.id,
        name: country.name,
        phone_code: country.phone_code,
        country_icon: ''
      });
      // show the current icon; clear a file picked while editing another country
      this.selectedCountryIconFile = null;
      this.countryIconContent = country.iconUrl;
      this.editCountryModal.open();
    } else {
      console.error(`Country with id ${id} not found.`);
    }
  }

  async editCountryFunction() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.is_submitted = true;

    if (this.editCountryForm.valid) {
      this.editCountryForm.get('id')?.enable();

      let countryIconFileName = '';
      let countryFileKey = '';


      if (this.selectedCountryIconFile) {
        countryIconFileName = this.randomString() + this.selectedCountryIconFile.name;
        countryFileKey = `blimp/country/${countryIconFileName}`;
      }

      try {
        // if (this.selectedCountryIconFile) {
        //   await this.s3Service.uploadFile(this.selectedCountryIconFile, 'hlis-bhavin-bucket', countryFileKey);
        // }

         // Upload new country icon if selected
      if (this.selectedCountryIconFile) {
        const uploadResponse = await this.cloudinaryService.uploadFile(this.selectedCountryIconFile, 'country');
        countryIconFileName = uploadResponse.public_id.split('/').pop() || '';
      }

        // country_icon is only sent when a new file was uploaded, so the current icon is kept otherwise
        // (the file input's own value is just the picked file's name, never a stored icon)
        const countryData: any = {
          id: this.editCountryForm.value.id,
          name: this.editCountryForm.value.name,
          phone_code: this.editCountryForm.value.phone_code,
        };

        if (countryIconFileName) {
          countryData.country_icon = countryIconFileName;
        }

        this.service.edit_country(this.token, countryData).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
          this.submitting = false;
          if (response.code === 200) {
            this.fetchData();
            this.editCountryModal.close();
            this.showToast('success', response.message);
          } else {
            this.handleError(response.code, response.message);
          }
        });
      } catch (error) {
        this.submitting = false;
        this.showToast('error', 'Upload failed');
      }
    } else {
      this.submitting = false;
    }
  }

  deleteCountryFunction(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to delete this country!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.delete_counry(this.token, { id }).subscribe((response: any) => {
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
    if (this.totalCountry === 0) {
      return 'No entries to display';
    }
    const start = (this.page - 1) * this.per_page + 1;
    const end = Math.min(this.page * this.per_page, this.totalCountry);
    return `Showing: ${start} to ${end} of ${this.totalCountry} entries`;
  }

  cancel() {
    this.addCountryModal.close();
    this.editCountryModal.close();
  }

  validateNumber(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  validatePaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData?.getData('text') || '';
    if (!/^[0-9]{1,3}$/.test(clipboardData)) {
      event.preventDefault();
    }
  }


  toggleCountryStatus(id: number, isActive: boolean) {
    const requestBody = { id: id };
    const actionText = isActive ? ' Inactivate ' : 'Activate';
    const confirmationText = isActive ? 'Inactive' : 'Active';
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to ${actionText} this Country!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: `Yes, ${actionText} it!`
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.activeInactiveCountry(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: `Country ${confirmationText.toLowerCase()} successfully!`,
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


  uploadCountryIcon(event: any) {
    this.selectedFile = event.target.files[0];
    if (!this.selectedFile) {
      // file picker cancelled: the icon is optional, so just clear the preview
      this.countryIcon = null;
      return;
    }
    this.countryIconName = this.selectedFile.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.countryIcon = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }


  uploadEditCountryIcon(event: any): void | boolean {
    const file = event.target.files[0];

    if (!file || !file.type.startsWith('image/')) {
      return false;
    }

    if ((file.size / 1024 / 1024) > 5) {
      return false;
    }

    this.selectedCountryIconFile = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.countryIconContent = reader.result as string;
    };
  }


  limitLength(event: any, maxLength: number) {
    if (event.target.value.length > maxLength) {
      event.target.value = event.target.value.slice(0, maxLength);
    }
  }



}
