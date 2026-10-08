import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CloudinaryService } from 'src/app/service/cloudinary.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { S3Service } from 'src/app/service/s3.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent extends BaseComponent {
  submitting = false; // true while the form is being saved ("Please wait..." on the submit button)
  addArticleForm: FormGroup | any;
  is_submited = false;
  selectedArticleImage: any;
  selectedPeersImage: any;
  selectedArticleVideo: any;
  articleImageName: any;
  articleImage: any;
  articlePeersImageName: any;
  articlePeersImage: any;
  articleVideoName: any;
  articleVideo: any;
  articleImageError = false;
  peerImageError = false;
  categories: any[] = [];
  subcategories: any[] = [];

  token: any;
  adminId: any


  constructor(injector: Injector,
    private formBuilder: FormBuilder,
    // private s3Service: S3Service,
    private cloudinaryService: CloudinaryService,
    private service: DashboardService,
  ) { super(injector); }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');
    this.setArticleForms();
    this.fetchCategories();
  }

  setArticleForms() {
    this.addArticleForm = this.formBuilder.group({
      image: ['', [Validators.required]],
      title: ['', [Validators.required]],
      author_name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      //sub_category_id: ['', [Validators.required]],
      peers: [''],
      peer_image: [''],
      video_url: [''],
      video_title: [''],
      video_description: [''],
      other_details: ['', [Validators.required]],
    });
  }

  get addArticleControl() { return this.addArticleForm.controls; }

  fetchCategories() {
    this.service.activeCategoryList(this.token, { page: 1, record_count: 100 }).subscribe((response: any) => {
      if (response.code === 200) {
        this.categories = response.data.category;
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }

  onCategoryChange(event: any) {
    let category_id = event.target.value;
    const categoryId = { category_id: category_id };
    this.service.fetch_sub_category(this.token, categoryId).subscribe((response: any) => {
      if (response.code === 200) {
        this.subcategories = response.data;
      } else {
        this.subcategories = [];
        this.handleError(response.code, response.message);
      }
    });
  }


  async addArticleFunction() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.is_submited = true;
    if (this.addArticleForm.valid) {
      if (!this.selectedArticleImage) {
        this.submitting = false;
        this.showToast('error', 'Please select an article image');
        return;
      }

      try {
        const articleImageResponse = await this.cloudinaryService.uploadFile(this.selectedArticleImage, 'articles');
        const articleImagePublicId = extractFilename(articleImageResponse.public_id);  // or use articleImageResponse.secure_url
        let peersImagePublicId = '';
        let videoPublicId = '';

        if (this.selectedPeersImage) {
          const peersImageResponse = await this.cloudinaryService.uploadFile(this.selectedPeersImage, 'peers');
          peersImagePublicId = extractFilename(peersImageResponse.public_id);
        }

        if (this.selectedArticleVideo) {
          const videoResponse = await this.cloudinaryService.uploadFile(this.selectedArticleVideo, 'bannerVideo');
          videoPublicId = extractFilename(videoResponse.public_id);
        }


        const articleBody = {
          'image': articleImagePublicId,
          'title': this.addArticleForm.value.title,
          'author_name': this.addArticleForm.value.author_name,
          'description': this.addArticleForm.value.description,
          'category_id': this.addArticleForm.value.category_id,
          //'sub_category_id': this.addArticleForm.value.sub_category_id,
          'peers': this.addArticleForm.value.peers,
          // 'peer_images': peersfileName,
          // 'video_url': videofileName,
          'peer_images': peersImagePublicId,
          'video_url': videoPublicId,
          'video_title': this.addArticleForm.value.video_title,
          'video_description': this.addArticleForm.value.video_description,
          'other_details': this.addArticleForm.value.other_details,
          'loggedInUserId': this.adminId
        }

        this.service.add_article(this.token, articleBody).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
          this.submitting = false;
          if (response.code === 200) {
            this.showToast('success', response.message);
            this.router.navigate(['/admin/article']);
          } else {
            this.handleError(response.code, response.message);
          }
        });


        function extractFilename(publicId: string): string {
          const parts = publicId.split('/');
          return parts[parts.length - 1];  // last part after '/'
        }
      } catch (error) {
        this.submitting = false;
        this.showToast('error', 'Upload failed');
      }
    } else {
      this.submitting = false;
    }
  }


  uploadArticleImage(event: any) {
    this.selectedArticleImage = event.target.files[0];
    this.articleImageName = this.selectedArticleImage.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.articleImage = e.target.result;
      this.articleImageError = false;
    };
    reader.readAsDataURL(this.selectedArticleImage);
  }

  uploadPeerImage(event: any) {
    this.selectedPeersImage = event.target.files[0];
    this.articlePeersImageName = this.selectedPeersImage.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.articlePeersImage = e.target.result;
      this.peerImageError = false;
    };
    reader.readAsDataURL(this.selectedPeersImage);
  }

  uploadArticleVideo(event: any) {
    this.selectedArticleVideo = event.target.files[0];
    this.articleVideoName = this.selectedArticleVideo.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.articleVideo = e.target.result;
    };
    reader.readAsDataURL(this.selectedArticleVideo);
  }

  cancel() {
    this.router.navigate(['/admin/article']);
  }


}
