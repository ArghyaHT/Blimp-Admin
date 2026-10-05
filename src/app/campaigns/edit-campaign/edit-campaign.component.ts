import { AfterViewInit, Component, ElementRef, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { CloudinaryService } from 'src/app/service/cloudinary.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { S3Service } from 'src/app/service/s3.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-campaign',
  templateUrl: './edit-campaign.component.html',
  styleUrls: ['./edit-campaign.component.css']
})
export class EditCampaignComponent extends BaseComponent implements AfterViewInit {
  editCampaignForm: FormGroup | any;
  is_submited = false;
  selectedBannerImage: any;
  bannerImageName: any;
  bannerImage: any;
  bannerImageError = false;
  campaignVideo: any;
  campaignCategories: any[] = [];
  subcategories: any[] = [];
  token: any;
  campaignId: any;
  countries: any;
  adminId: any;
  existingProductImages: any;
  files: File[] = [];
  selectedCampaignVideo: any;
  campaignVideoName: any;

  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = '/assets/images/default.jpg';
  maxFileSize = 50 * 1024 * 1024; // 50 MB in bytes
  allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  youtubeLink: any;

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    // private s3Service: S3Service,
    private cloudinaryService: CloudinaryService,
    private service: DashboardService,
    private elementRef: ElementRef<HTMLElement>,
  ) {
    super(injector);
  }


  purposes = [
    { id: 1, name: 'Medical' },
    { id: 2, name: 'Education' },
    { id: 3, name: 'Community Service' }
  ];

  patientRelation = [
    { id: 1, name: 'Family' },
    { id: 2, name: 'Friend' },
    { id: 3, name: 'Other' }
  ];

  educationStatus = [
    { id: 1, name: 'High School' },
    { id: 2, name: 'Bachelor\'s Degree' },
    { id: 3, name: 'Master\'s Degree' }
  ];

  employmentStatus = [
    { id: 1, name: 'Employed' },
    { id: 2, name: 'Unemployed' },
    { id: 3, name: 'Self-employed' }
  ];

  contactMethod = [
    { id: 1, name: 'Email' },
    { id: 2, name: 'Phone' },
    { id: 3, name: 'Mail' }
  ];

  requestForDonor = [
    { id: 1, name: 'Financial Assistance' },
    { id: 2, name: 'Volunteer' },
    { id: 3, name: 'Other' }
  ];

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText',
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };



  // the rich-text editor renders its own editable <div> without an id, so <label for> can't reach it;
  // name it from the visible label instead
  ngAfterViewInit(): void {
    this.elementRef.nativeElement.querySelectorAll<HTMLElement>('angular-editor[data-labelledby]').forEach((editor) => {
      const textarea = editor.querySelector('.angular-editor-textarea');
      textarea?.setAttribute('role', 'textbox');
      textarea?.setAttribute('aria-multiline', 'true');
      textarea?.setAttribute('aria-required', 'true');
      textarea?.setAttribute('aria-labelledby', editor.getAttribute('data-labelledby')!);
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.campaignId = +params['id'];
        this.fetchCampaignDetails(this.campaignId);
      }
    });
    this.fetchCategories();
    this.setEditCampaignForms();
    this.getCountryList();
  }


  setEditCampaignForms() {
    this.editCampaignForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      category_id: ['', Validators.required],
      //sub_category_id: [null, Validators.required],
      country: ['', Validators.required],
      target_amount: [''],
      campaign_details: ['', Validators.required],
      purpose: ['', Validators.required],
      campaign_name: ['', Validators.required],
      description: ['', Validators.required],
      campagin_date: [''],
      hear_about_blimp: ['', Validators.required],
      banner_image: [''],
      youtube_link: [''],
      campaign_video: [''],
      name: ['', Validators.required],
      email: ['', [Validators.required, this.validationService.emailValidator]],
      beneficiary_details: ['', Validators.required],
      // optional: older campaigns were saved without these, which blocked updating them
      patient_relation: [''],
      education_status: [''],
      employee_status: [''],
      contact_method: [''],
      request_for_donor: [null, Validators.required],
      rasing_funds_decription: ['', Validators.required],
    });
  }

  get editCampaignControl() { return this.editCampaignForm.controls; }

  fetchCategories() {
    this.service.activeCategoryList(this.token, { page: 1, record_count: 100 }).subscribe((response: any) => {
      if (response.code === 200) {
        this.campaignCategories = response.data.category;
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }

  // onCategoryChange(event: any) {
  //   const category_id = event.target.value;
  //   this.editCampaignForm.patchValue({ sub_category_id: '' });
  //   const categoryId = { category_id: category_id };
  //   this.service.fetch_sub_category(this.token, categoryId).subscribe((response: any) => {
  //     if (response.code === 200) {
  //       this.subcategories = response.data;
  //       // const selectedSubcategoryId = this.editCampaignForm.value.sub_category_id;
  //       // this.editCampaignForm.patchValue({ sub_category_id: selectedSubcategoryId });
  //     } else {
  //       this.subcategories = [];
  //     }
  //   });
  // }

  getCountryList() {
    this.service.getCountry('').subscribe((response: any) => {
      if (response.code === 200) {
        this.countries = response.data;
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }


  fetchCampaignDetails(campaignId: any) {
    let campaign = { id: campaignId }
    this.service.campaign_details(this.token, campaign).subscribe((response: any) => {
      if (response.code === 200) {
        const campaign = response.data;
        this.editCampaignForm.patchValue({
          id: campaign?.id,
          category_id: campaign?.categories?.id,
          //sub_category_id: campaign?.subCategories?.id,
          country: campaign?.country?.id,
          target_amount: campaign?.target_amount,
          campaign_details: campaign?.campaign_details,
          purpose: campaign?.purpose,
          campaign_name: campaign?.campaign_name,
          description: campaign?.description,
          campagin_date: campaign?.campagin_date,
          hear_about_blimp: campaign?.hear_about_blimp,
          name: campaign?.name,
          email: campaign?.email,
          beneficiary_details: campaign?.beneficiary_details,
          patient_relation: campaign?.patient_relation ?? '',
          education_status: campaign?.education_status ?? '',
          employee_status: campaign?.employee_status ?? '',
          contact_method: campaign?.contact_method ?? '',
          request_for_donor: campaign?.request_for_donor,
          rasing_funds_decription: campaign?.rasing_funds_decription,
          youtube_link: campaign?.youtube_link,
        });

        // the API returns "cloudinary://…" values (or bare ids) that a browser can't load;
        // turn them into public Cloudinary URLs, using the folders this page uploads to
        this.existingProductImages = (campaign.campaignsImages || []).map((img: any) => ({
          ...img,
          url: this.cloudinaryService.getImageUrl(img?.image, 'multipleImages'),
        }));
        this.bannerImage = this.cloudinaryService.getImageUrl(campaign.banner_image, 'bannerImages');
        this.bannerImageError = false;
        this.campaignVideo = this.cloudinaryService
          .getImageUrl(campaign.campaign_video, 'bannerVideo')
          .replace('/image/upload/', '/video/upload/');
        this.youtubeLink = campaign?.youtube_link
        //  this.onCategoryChange({ target: { value: campaign?.categories?.id }
        //  }

        //  );

        if (this.youtubeLink) {
          this.editCampaignForm.get('campaign_video')?.clearValidators();
          this.editCampaignForm.get('campaign_video')?.updateValueAndValidity();
        } else if (this.campaignVideo) {
          this.editCampaignForm.get('youtube_link')?.clearValidators();
          this.editCampaignForm.get('youtube_link')?.updateValueAndValidity();
        }

      }
    }
    );
  }

  uploadCampaignImage(event: any): void | boolean {
    this.selectedBannerImage = event.target.files[0];
    if (!this.selectedBannerImage || !this.selectedBannerImage.type.startsWith('image/')) {
      return false;
    }
    if ((this.selectedBannerImage.size / 1024 / 1024) > 5) {
      return false;
    }
    this.bannerImageName = this.selectedBannerImage;
    const reader = new FileReader();
    reader.onload = () => {
      this.bannerImage = reader.result;
      this.bannerImageError = false;
    };
    reader.readAsDataURL(this.selectedBannerImage);
  }

  uploadCampaignVideo(event: any): void | boolean {
    this.selectedCampaignVideo = event.target.files[0];
    this.campaignVideoName = this.selectedCampaignVideo;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.campaignVideo = reader.result
    };
    reader.readAsDataURL(this.selectedCampaignVideo);
  }



  onSelect(event: any) {
    const selectedFiles = event.addedFiles;

    if (selectedFiles.length) {
      const allowedExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
      const maxSizeInMB = 50;

      for (const file of selectedFiles) {
        if (!allowedExtensions.includes(file.type)) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid file type',
            text: 'Only jpg, jpeg, and png files are allowed.',
          });
          return;
        }

        if (file.size > maxSizeInMB * 1024 * 1024) {
          Swal.fire({
            icon: 'error',
            title: 'File too large',
            text: `The file size exceeds ${maxSizeInMB}MB.`,
          });
          return;
        }
      }

      // Check if total files exceed limit
      if (this.files.length + selectedFiles.length + this.existingProductImages.length > 6) {
        Swal.fire({
          icon: 'error',
          title: 'Image limit exceeded',
          text: 'You can upload a maximum of 6 images.',
        });
        return;
      }

      // Read and store each file
      for (const file of selectedFiles) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = () => {
            // if (img.width !== 550 || img.height !== 550) {
            //   Swal.fire({
            //     icon: 'error',
            //     title: 'Invalid dimensions',
            //     text: 'Image dimensions should be 550x550 pixels.',
            //   });
            //   return;
            // }
            this.files.push(file);
            this.editCampaignForm.patchValue({
              campaignImagesUpload: this.files
            });
            this.editCampaignForm.get('campaignImagesUpload')?.markAsTouched();
          };
        };
        reader.readAsDataURL(file);
      }
    }
  }

  onRemove(event: any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  removePreloadedImage(image: any): void {
    const id = image?.id;
    if (id) {
      Swal.fire({
        title: `Are you sure ?`,
        text: `You won't be able to revert this!`,
        icon: 'warning',
        showDenyButton: true,
        confirmButtonColor: "#003074",
        cancelButtonColor: "#F34E4E",
        confirmButtonText: 'Yes delete it',
        denyButtonText: `Cancel`,
      }).then((result: { isConfirmed: any; }) => {
        if (result.isConfirmed) {
          this.deleteCampaignImage(id)
        }
      });
    }
  }

  async updateCampaignFunction() {
    this.spinner.show();
    this.is_submited = true;
    if (this.editCampaignForm.valid) {
      this.editCampaignForm.get('id')?.enable();

      let campaignfileName = '';
      let campaignfileKey = '';
      if (this.selectedBannerImage) {
        campaignfileName = this.randomString() + this.selectedBannerImage.name;
        campaignfileKey = `blimp/bannerImage/${campaignfileName}`;
      }

      let campaignVideoFileName = '';
      let campaignVideoFileKey = '';
      if (this.selectedCampaignVideo) {
        campaignVideoFileName = this.randomString() + this.selectedCampaignVideo.name;
        campaignVideoFileKey = `blimp/bannerVideo/${campaignVideoFileName}`;
      }


      try {
        // Upload selected banner image if it exists
        // if (this.selectedBannerImage) {
        //   await this.s3Service.uploadFile(this.selectedBannerImage, 'hlis-bhavin-bucket', campaignfileKey);
        // }

        if (this.selectedBannerImage) {
          const bannerResponse = await this.cloudinaryService.uploadFile(this.selectedBannerImage, 'bannerImages');
          campaignfileName = bannerResponse.public_id.split('/').pop() || '';
        }

        // if (this.selectedCampaignVideo) {
        //   await this.s3Service.uploadFile(this.selectedCampaignVideo, 'hlis-bhavin-bucket', campaignVideoFileKey);
        // }

        if (this.selectedCampaignVideo) {
          const videoResponse = await this.cloudinaryService.uploadFile(this.selectedCampaignVideo, 'bannerVideo');
          campaignVideoFileName = videoResponse.public_id.split('/').pop() || '';
        }

        // Upload multiple campaign images
        // const uploadedImageKeys = [];
        // for (const file of this.files) {
        //   const uniqueFileName = this.randomString() + file.name; // Generate unique name
        //   const imageKey = `blimp/multipleImages/${uniqueFileName}`;
        //   await this.s3Service.uploadFile(file, 'hlis-bhavin-bucket', imageKey);
        //   uploadedImageKeys.push(uniqueFileName);
        // }

        const uploadedImageKeys: string[] = [];
        for (const file of this.files) {
          const cloudinaryResponse = await this.cloudinaryService.uploadFile(file, 'multipleImages');
          const fileName = cloudinaryResponse.public_id.split('/').pop() || '';
          uploadedImageKeys.push(fileName);
        }

        const campaignBody: any = {
          id: this.editCampaignForm.value.id,
          category: this.editCampaignForm.value.category_id,
          //sub_category: this.editCampaignForm.value.sub_category_id,
          country: this.editCampaignForm.value.country,
          campaign_details: this.editCampaignForm.value.campaign_details,
          purpose: this.editCampaignForm.value.purpose,
          campaign_name: this.editCampaignForm.value.campaign_name,
          description: this.editCampaignForm.value.description,
          hear_about_blimp: this.editCampaignForm.value.hear_about_blimp,
          name: this.editCampaignForm.value.name,
          email: this.editCampaignForm.value.email,
          beneficiary_details: this.editCampaignForm.value.beneficiary_details,
          patient_relation: this.editCampaignForm.value.patient_relation || null,
          education_status: this.editCampaignForm.value.education_status || null,
          employee_status: this.editCampaignForm.value.employee_status || null,
          contact_method: this.editCampaignForm.value.contact_method || null,
          request_for_donor: this.editCampaignForm.value.request_for_donor,
          rasing_funds_decription: this.editCampaignForm.value.rasing_funds_decription,
          loggedInUserId: this.adminId,
          uploaded_images: uploadedImageKeys
        };

        if (campaignfileName) {
          campaignBody.banner_image = campaignfileName;
        }

        if (campaignVideoFileName) {
          campaignBody.campaign_video = campaignVideoFileName;
        }

        if (this.youtubeLink) {
          campaignBody.youtube_link = this.editCampaignForm.value.youtube_link;
        }

        this.service.edit_campaign(this.token, campaignBody).subscribe((response: any) => {
          this.spinner.hide();
          if (response.code === 200) {
            this.showToast('success', response.message);
            this.router.navigate(['/admin/campaign']);
          } else {
            this.handleError(response.code, response.message);
          }
        });
      } catch (error) {
        this.spinner.hide();
        this.showToast('error', 'Upload failed');
      }
    } else {
      this.spinner.hide();
    }
  }


  deleteCampaignImage(id: any) {
    const data = {
      id: id
    }
    this.service.deleteCampaignImage(this.token, data).subscribe({
      next: (response: any) => {
        if (response.code === 200) {
          this.existingProductImages = this.existingProductImages.filter((img: any, index: string | number) => this.existingProductImages[index].id !== id);
          this.showToast('success', response.message);
        }
        else {
          this.showToast('error', 'Upload failed');
        }
      }
    })

  }

  cancel() {
    this.router.navigate(['/admin/campaign']);
  }
}
