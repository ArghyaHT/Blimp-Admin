import { Component, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CloudinaryService } from 'src/app/service/cloudinary.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { S3Service } from 'src/app/service/s3.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-edit-article',
  templateUrl: './edit-article.component.html',
  styleUrls: ['./edit-article.component.css']
})
export class EditArticleComponent extends BaseComponent {
  editArticleForm: FormGroup | any;
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
  articleId: any;
  adminId: any;


  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    // private s3Service: S3Service,
    private cloudinaryService: CloudinaryService,
    private service: DashboardService,

  ) {
    super(injector);
  }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.articleId = +params['id'];
        this.fetchArticleDetails(this.articleId);
      }
    });
    this.fetchCategories();
    this.setEditArticleForms();
  }


  setEditArticleForms() {
    this.editArticleForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      image: [''],
      title: ['', [Validators.required]],
      author_name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      category_id: ['', [Validators.required]],
      //sub_category_id: [null, [Validators.required]],
      peers: ['', [Validators.required]],
      peer_image: [''],
      video_url: [''],
      video_title: ['', [Validators.required]],
      video_description: ['', [Validators.required]],
      other_details: ['', [Validators.required]],
    });
  }

  get editArticleControl() { return this.editArticleForm.controls; }

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
    const category_id = event.target.value;
    this.editArticleForm.patchValue({ sub_category_id: '' });
    const categoryId = { category_id: category_id };
    this.service.fetch_sub_category(this.token, categoryId).subscribe((response: any) => {
      if (response.code === 200) {
        this.subcategories = response.data;
        // const selectedSubcategoryId = this.editArticleForm.value.sub_category_id;
        // this.editArticleForm.patchValue({ sub_category_id: selectedSubcategoryId });
      } else {
        this.subcategories = [];
      }
    });
  }


  fetchArticleDetails(articleId: any) {
    let article = { id: articleId }
    this.service.article_details(this.token, article).subscribe((response: any) => {
      if (response.code === 200) {
        const article = response.data;
        this.editArticleForm.patchValue({
          id: article.id,
          title: article.title,
          author_name: article.author_name,
          description: article.description,
          category_id: article.category.id,
          //sub_category_id: article.subCategory.id,
          peers: article.peers,
          video_title: article.video_title,
          video_description: article.video_description,
          other_details: article.other_details,
        });
        this.articleImage = article.image;
        this.articlePeersImage = article.peer_images;
        this.articleVideo = article.video_url;
        //this.onCategoryChange({ target: { value: article.category.id } });

      }
    });
  }

  uploadArticleImage(event: any): void | boolean {
    this.selectedArticleImage = event.target.files[0];
    if (!this.selectedArticleImage || !this.selectedArticleImage.type.startsWith('image/')) {
      return false;
    }
    if ((this.selectedArticleImage.size / 1024 / 1024) > 5) {
      return false;
    }
    this.articleImageName = this.selectedArticleImage;
    const reader = new FileReader();
    reader.onload = () => {
      this.articleImage = reader.result
    };
    reader.readAsDataURL(this.selectedArticleImage);
  }

  uploadPeerImage(event: any): void | boolean {
    this.selectedPeersImage = event.target.files[0];
    if (!this.selectedPeersImage || !this.selectedPeersImage.type.startsWith('image/')) {
      return false;
    }
    if ((this.selectedPeersImage.size / 1024 / 1024) > 5) {
      return false;
    }
    this.articlePeersImageName = this.selectedPeersImage;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.articlePeersImage = reader.result
    };
    reader.readAsDataURL(this.selectedPeersImage);
  }

  uploadArticleVideo(event: any): void | boolean {
    this.selectedArticleVideo = event.target.files[0];
    this.articleVideoName = this.selectedArticleVideo;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.articleVideo = reader.result
    };
    reader.readAsDataURL(this.selectedArticleVideo);
  }

  async updateArticleFunction() {
    this.spinner.show();
    this.is_submited = true;

    if (this.editArticleForm.valid) {
      this.editArticleForm.get('id')?.enable();

      let articlefileName = '';
      let articlefileKey = '';
      let peersfileName = '';
      let peersfileKey = '';
      let videofileName = '';
      let videofileKey = '';

      if (this.selectedArticleImage) {
        articlefileName = this.randomString() + this.selectedArticleImage.name;
        articlefileKey = `blimp/articles/${articlefileName}`;
      }

      if (this.selectedPeersImage) {
        peersfileName = this.randomString() + this.selectedPeersImage.name;
        peersfileKey = `blimp/peers/${peersfileName}`;
      }

      if (this.selectedArticleVideo && this.selectedArticleVideo.name) {
        videofileName = this.randomString() + this.selectedArticleVideo.name;
        videofileKey = `blimp/videos/${videofileName}`;
      }

      try {
        // if (this.selectedArticleImage) {
        //   await this.s3Service.uploadFile(this.selectedArticleImage, 'hlis-bhavin-bucket', articlefileKey);
        // }
        // if (this.selectedPeersImage) {
        //   await this.s3Service.uploadFile(this.selectedPeersImage, 'hlis-bhavin-bucket', peersfileKey);
        // }
        // if (this.selectedArticleVideo && this.selectedArticleVideo.name) {
        //   await this.s3Service.uploadFile(this.selectedArticleVideo, 'hlis-bhavin-bucket', videofileKey);
        // }

           // Upload article image if selected
      if (this.selectedArticleImage) {
        const articleImageResponse = await this.cloudinaryService.uploadFile(this.selectedArticleImage, 'articles');
        // Extract filename only (without folder)
        articlefileName = articleImageResponse.public_id.split('/').pop();
      }

      // Upload peers image if selected
      if (this.selectedPeersImage) {
        const peersImageResponse = await this.cloudinaryService.uploadFile(this.selectedPeersImage, 'peers');
        peersfileName = peersImageResponse.public_id.split('/').pop();
      }

      // Upload video if selected
      if (this.selectedArticleVideo && this.selectedArticleVideo.name) {
        const videoResponse = await this.cloudinaryService.uploadFile(this.selectedArticleVideo, 'videos');
        videofileName = videoResponse.public_id.split('/').pop();
      } 

        const articleBody: any = {
          'id': this.editArticleForm.value.id,
          'title': this.editArticleForm.value.title,
          'author_name': this.editArticleForm.value.author_name,
          'description': this.editArticleForm.value.description,
          'category_id': this.editArticleForm.value.category_id,
          //'sub_category_id': this.editArticleForm.value.sub_category_id,
          'peers': this.editArticleForm.value.peers,
          'video_title': this.editArticleForm.value.video_title,
          'video_description': this.editArticleForm.value.video_description,
          'other_details': this.editArticleForm.value.other_details,
          'loggedInUserId': this.adminId
        };

        if (articlefileName) {
          articleBody.image = articlefileName;
        }
        if (peersfileName) {
          articleBody.peer_images = peersfileName;
        }
        if (videofileName) {
          articleBody.video_url = videofileName;
        }

        this.service.edit_article(this.token, articleBody).subscribe((response: any) => {
          this.spinner.hide();
          if (response.code === 200) {
            this.showToast('success', response.message);
            this.router.navigate(['/admin/article']);
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

  cancel() {
    this.router.navigate(['/admin/article']);
  }
}
