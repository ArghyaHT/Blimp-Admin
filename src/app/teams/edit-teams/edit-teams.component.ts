import { Component, Injector } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CloudinaryService } from 'src/app/service/cloudinary.service';
import { DashboardService } from 'src/app/service/dashboard.service';
import { S3Service } from 'src/app/service/s3.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-edit-teams',
  templateUrl: './edit-teams.component.html',
  styleUrls: ['./edit-teams.component.css']
})
export class EditTeamsComponent extends BaseComponent {
  submitting = false; // true while the form is being saved ("Please wait..." on the submit button)
  editTeamForm: FormGroup | any;
  is_submited = false;
  selectedFile: File | any;
  token: any
  teamId: any
  teamImageContent: any;
  disable = false;
  selectedItems: string[] = [];
  selectAllChecked = new FormControl(false);

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

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.teamId = +params['id'];
        this.fetchTeamDetails(this.teamId);
      }
    });

    this.editTeamForms();
  }


  editTeamForms() {
    this.editTeamForm = this.formBuilder.group({
      id: [{ value: '', disabled: true }, Validators.required],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      teams_image: [''],
      designation: ['', [Validators.required]],
      description: ['', [Validators.required]],
      linkedin_profile: ['', [Validators.required]],
      permission: ['', [Validators.required]],
    });
  }
  get editTeam() { return this.editTeamForm.controls; }

  fetchTeamDetails(teamId: any): void {
    const teamData = { id: teamId };
    this.service.Teams_details(this.token, teamData).subscribe((teamsData: any) => {
      this.teamImageContent = teamsData.data.image,
        this.editTeamForm.patchValue({
          id: teamsData.data.id,
          name: teamsData.data.name,
          email: teamsData.data.email,
          linkedin_profile: teamsData.data.linkedin_profile,
          description: teamsData.data.description,
          designation: teamsData.data.designation,

        });
      const permissions = teamsData.data.admin.permissions.split(',');
      this.selectedItems = permissions;
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
      this.teamImageContent = reader.result
      this.editTeamForm.patchValue({
        // image: reader.result
      });
      reader.readAsDataURL(this.selectedFile);
    };
  }

  toggleSelectAll() {
    this.disable = !this.disable;
    if (this.selectAllChecked.value) {
      this.selectedItems = this.modules.map((module) => module.value);
      this.editTeam['permission'].setValue(this.selectedItems);
    } else {
      this.selectedItems = [];
      this.editTeam['permission'].setValue('');
    }
  }

  async editTeams() {
    if (this.submitting) {
      return;
    }
    this.submitting = true;
    this.is_submited = true;

    console.log("this.editTeamForm.valid==?", this.editTeamForm.value)


    if (this.editTeamForm.valid) {
      this.editTeamForm.get('id')?.enable();

      let teamFileName = '';
      let teamFileKey = '';

      if (this.selectedFile) {
        teamFileName = this.randomString() + this.selectedFile.name;
        teamFileKey = `blimp/teams/${teamFileName}`;
      }


      try {
        // if (this.selectedFile) {
        //   await this.s3Service.uploadFile(this.selectedFile, 'hlis-bhavin-bucket', teamFileKey);
        // }

        if (this.selectedFile) {
          const uploadResponse = await this.cloudinaryService.uploadFile(this.selectedFile, 'teams');
          teamFileName = uploadResponse.public_id.split('/').pop() || '';
        }

        const teamBody: any = {
          'id': this.editTeamForm.value.id,
          'image': this.editTeamForm.value.image,
          'name': this.editTeamForm.value.name,
          'email': this.editTeamForm.value.email,
          'description': this.editTeamForm.value.description,
          'linkedin_profile': this.editTeamForm.value.linkedin_profile,
          'designation': this.editTeamForm.value.designation,
          'permissions': this.selectedItems,
        };
        if (teamFileName) {
          teamBody.image = teamFileName;
        }

        this.service.Edit_Teams(this.token, teamBody).pipe(finalize(() => (this.submitting = false))).subscribe((response: any) => {
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
