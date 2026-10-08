import { Component, Injector, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import { S3Service } from 'src/app/service/s3.service';
import { CloudinaryService } from 'src/app/service/cloudinary.service';

@Component({
  selector: 'app-add-blogs',
  templateUrl: './add-blogs.component.html',
  styleUrls: ['./add-blogs.component.css']
})
export class AddBlogsComponent extends BaseComponent {
  submitting = false; // true while the form is being saved ("Please wait..." on the submit button)
  addBlogsForm: FormGroup | any;
  is_submited = false;
  selectedFile: any;
  blogsFileName: any;
  blogsImage: any;
  token: any;
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
    this.setBlogsForms();
  }

  setBlogsForms() {
    this.addBlogsForm = this.formBuilder.group({
      image: ['', [Validators.required]],
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
    });
  }

  get addBlogsControl() { return this.addBlogsForm.controls; }


  async addBlogs() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.is_submited = true;
    if (this.addBlogsForm.valid) {

      const blogFileName = this.randomString() + this.selectedFile.name;
      const blogFileKey = `blimp/blogs/${blogFileName}`;

      try {
        // await this.s3Service.uploadFile(this.selectedFile, 'hlis-bhavin-bucket', blogFileKey)

        const blogImageResponse = await this.cloudinaryService.uploadFile(this.selectedFile, 'blogs');
        
        const blogImagePublicId = extractFilename(blogImageResponse.public_id);  // or use articleImageResponse.secure_url


        const blogBody = {
          'image': blogImagePublicId,
          'title': this.addBlogsForm.value.title,
          'description': this.addBlogsForm.value.description,
          'loggedInUserId': this.adminId
        }
        this.service.Add_Blogs(this.token, blogBody).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
          this.submitting = false;
          if (response.code === 200) {
            this.showToast('success', response.message);
            this.router.navigate(['/admin/blogs']);
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

  cancel() {
    this.router.navigate(['/admin/blogs']);
  }

  uploadProfileImage(event: any) {
    this.selectedFile = event.target.files[0];
    this.blogsFileName = this.selectedFile.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.blogsImage = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }
}
