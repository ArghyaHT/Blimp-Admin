import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CloudinaryService } from 'src/app/service/cloudinary.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { S3Service } from 'src/app/service/s3.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-blogs',
  templateUrl: './edit-blogs.component.html',
  styleUrls: ['./edit-blogs.component.css']
})
export class EditBlogsComponent extends BaseComponent {
  submitting = false; // true while the form is being saved ("Please wait..." on the submit button)
  editBlogsForm: FormGroup | any;
  is_submited = false;
  selectedFile: File | any;
  token: any
  editBlogsControl: any;
  blogsId: any
  BlogImageContent: any
  adminId: any

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
        this.blogsId = +params['id'];
        this.fetchBlogsDetails(this.blogsId);
      }
    });

    this.editBlogsForms();
  }


  editBlogsForms() {
    this.editBlogsForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      blogs_image: [''],
      blogs_title: ['', Validators.required],
      blogs_description: ['', Validators.required],
    });
  }
  get editBlog() { return this.editBlogsForm.controls; }



  fetchBlogsDetails(blog_id: any): void {
    const blogId = { blog_id: blog_id };
    this.service.Blog_details(this.token, blogId).subscribe((blogsData: any) => {
      this.BlogImageContent = blogsData.data.blogs_image,
        this.editBlogsForm.patchValue({
          id: blogsData.data.id,
          blogs_title: blogsData.data.blogs_title,
          blogs_description: blogsData.data.blogs_description,
        });
    });
  }




  uploadProfileImage(event: any): void | boolean {
    const file = event.target.files[0];

    if (!file || !file.type.startsWith('image/')) {
      return false;
    }

    if ((file.size / 1024 / 1024) > 5) {
      // Handle file size error
      return false;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.BlogImageContent = reader.result
      this.editBlogsForm.patchValue({
        // image: reader.result
      });
      reader.readAsDataURL(this.selectedFile);
    };
  }

  async editBlogs() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.is_submited = true;

    if (this.editBlogsForm.valid) {
      this.editBlogsForm.get('id')?.enable();

      let blogFileName = '';
      let blogFileKey = '';


      if (this.selectedFile) {
        blogFileName = this.randomString() + this.selectedFile.name;
        blogFileKey = `blimp/blogs/${blogFileName}`;
      }

      try {
        // if (this.selectedFile) {
        //   await this.s3Service.uploadFile(this.selectedFile, 'hlis-bhavin-bucket', blogFileKey);
        // }

          // Upload video if selected
      if (this.selectedFile) {
        const videoResponse = await this.cloudinaryService.uploadFile(this.selectedFile, 'blogs');
        blogFileName = videoResponse.public_id.split('/').pop();
      }

        const blogBody: any = {
          'id': this.editBlogsForm.value.id,
          'image': this.editBlogsForm.value.image,
          'blogs_title': this.editBlogsForm.value.blogs_title,
          'blogs_description': this.editBlogsForm.value.blogs_description,
          'loggedInUserId': this.adminId
        };

        if (blogFileName) {
          blogBody.image = blogFileName;
        }

        this.service.Edit_Blogs(this.token, blogBody).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
          this.submitting = false;
          if (response.code === 200) {
            this.showToast('success', response.message);
            this.router.navigate(['/admin/blogs']);
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

  cancel() {
    this.router.navigate(['/admin/blogs']);
  }
}
