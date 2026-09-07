import { Component, Injector, OnInit } from '@angular/core';
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
      peers: ['', [Validators.required]],
      peer_image: ['', [Validators.required]],
      video_url: ['', [Validators.required]],
      video_title: ['', [Validators.required]],
      video_description: ['', [Validators.required]],
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
    this.spinner.show();
    this.is_submited = true;
    if (this.addArticleForm.valid) {

      const articlefileName = this.randomString() + this.selectedArticleImage.name;
      const articlefileKey = `blimp/articles/${articlefileName}`;

      const peersfileName = this.randomString() + this.selectedPeersImage.name;
      const peersfileKey = `blimp/peers/${peersfileName}`;

      const videofileName = this.randomString() + this.selectedArticleVideo.name;
      const videofileKey = `blimp/videos/${videofileName}`;

      try {
        // await this.s3Service.uploadFile(this.selectedArticleImage, 'hlis-bhavin-bucket', articlefileKey);
        // await this.s3Service.uploadFile(this.selectedPeersImage, 'hlis-bhavin-bucket', peersfileKey);
        // await this.s3Service.uploadFile(this.selectedArticleVideo, 'hlis-bhavin-bucket', videofileKey);

        // Upload files to Cloudinary folders
        const articleImageResponse = await this.cloudinaryService.uploadFile(this.selectedArticleImage, 'articles');
        const peersImageResponse = await this.cloudinaryService.uploadFile(this.selectedPeersImage, 'peers');
        const videoResponse = await this.cloudinaryService.uploadFile(this.selectedArticleVideo, 'bannerVideo');

        // Use Cloudinary returned public_id or secure_url for references
        // const articleImagePublicId = articleImageResponse.public_id;  // or use articleImageResponse.secure_url
        // const peersImagePublicId = peersImageResponse.public_id;
        // const videoPublicId = videoResponse.public_id;


        const articleImagePublicId = extractFilename(articleImageResponse.public_id);  // or use articleImageResponse.secure_url
        const peersImagePublicId = extractFilename(peersImageResponse.public_id);
        const videoPublicId = extractFilename(videoResponse.public_id);


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

        this.service.add_article(this.token, articleBody).subscribe((response: any) => {
          this.spinner.hide();
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
        this.spinner.hide();
        this.showToast('error', 'Upload failed');
      }
    } else {
      this.spinner.hide();
    }
  }


  uploadArticleImage(event: any) {
    this.selectedArticleImage = event.target.files[0];
    this.articleImageName = this.selectedArticleImage.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.articleImage = e.target.result;
    };
    reader.readAsDataURL(this.selectedArticleImage);
  }

  uploadPeerImage(event: any) {
    this.selectedPeersImage = event.target.files[0];
    this.articlePeersImageName = this.selectedPeersImage.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.articlePeersImage = e.target.result;
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
