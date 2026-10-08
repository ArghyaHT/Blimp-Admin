import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CloudinaryService } from 'src/app/service/cloudinary.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { S3Service } from 'src/app/service/s3.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-add-teams',
  templateUrl: './add-teams.component.html',
  styleUrls: ['./add-teams.component.css']
})
export class AddTeamsComponent extends BaseComponent {
  submitting = false; // true while the form is being saved ("Please wait..." on the submit button)
  addTeamsForm: FormGroup | any;
  is_submited = false;
  selectedFile: any;
  teamFileName: any;
  teamImage: any;
  token: any;
  disable = false;
  selectedItems: string[] = [];
  selectAllChecked = new FormControl(false);
  passwordVisible: boolean = false;


  modules = [
    // { label: 'Dashboard', value: 'dashboard' },
    { label: 'Manage Campaigns', value: 'campaign' },
    { label: 'Manage Articles', value: 'article' },
    { label: 'Manage Blogs', value: 'blogs' },
    // { label: 'Manage Country', value: 'country' },
    // { label: 'Manage Category', value: 'category' },
    // { label: 'Manage Sub Category', value: 'sub-category' },
    // { label: 'Manage Customers', value: 'customers' },
    // { label: 'Manage Notifications', value: 'notification' },
    // { label: 'Manage Earning', value: 'earning' },
    // { label: 'Manage Reports', value: 'reports' },
    // { label: 'CMS Page', value: 'cms' },
  ];



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
    this.setTeamForms();
  }

  setTeamForms() {
    this.addTeamsForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      image: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      description: ['', [Validators.required]],
      linkedin_profile: ['', [Validators.required]],
      permission: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$')]],
    });
  }

  get addTeamsControl() { return this.addTeamsForm.controls; }


  toggleSelectAll() {
    this.disable = !this.disable;
    if (this.selectAllChecked.value) {
      this.selectedItems = this.modules.map((module) => module.value);
      this.addTeamsControl['permission'].setValue(this.selectedItems);
    } else {
      this.selectedItems = [];
      this.addTeamsControl['permission'].setValue('');
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }


  uploadProfileImage(event: any) {
    this.selectedFile = event.target.files[0];
    this.teamFileName = this.selectedFile.name;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.teamImage = e.target.result;
    };
    reader.readAsDataURL(this.selectedFile);
  }


  async addTeams() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.is_submited = true;
    if (this.addTeamsForm.valid) {

      let teamFileName = this.randomString() + this.selectedFile.name;
      const teamFileKey = `blimp/teams/${teamFileName}`;

      try {
        // await this.s3Service.uploadFile(this.selectedFile, 'hlis-bhavin-bucket', teamFileKey)

        const uploadResponse = await this.cloudinaryService.uploadFile(this.selectedFile, 'teams');
        teamFileName = uploadResponse.public_id.split('/').pop() || '';

        const teamBody = {
          'image': teamFileName,
          'name': this.addTeamsForm.value.name,
          'email': this.addTeamsForm.value.email,
          'description': this.addTeamsForm.value.description,
          'linkedin_profile': this.addTeamsForm.value.linkedin_profile,
          'designation': this.addTeamsForm.value.designation,
          'permissions': this.selectedItems,
          'password': this.addTeamsForm.value.password
        }
        this.service.Add_Teams(this.token, teamBody).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
          this.submitting = false;
          if (response.code === 200) {
            this.showToast('success', response.message);
            this.router.navigate(['/admin/teams']);
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
    this.router.navigate(['/admin/teams']);
  }






}
