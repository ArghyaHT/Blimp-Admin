import { Component, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from 'src/app/service/dashboard.service';
import { S3Service } from 'src/app/service/s3.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.css']
})
export class AddNotificationComponent extends BaseComponent {
  addNotificationForm: FormGroup | any;
  is_submited = false;
  token: any;
  selectedItems: number[] = [];
  selectedUser: any;
  selectUserList: any[] = [];
  selectAllChecked = new FormControl(false);
  disable = false;
  adminId: any
  today = new Date();

  constructor(
    injector: Injector,
    private formBuilder: FormBuilder,
    private service: DashboardService,

  ) {
    super(injector);
  }


  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');
    this.setNotificaionForms();
    this.getUserList();
  }

  setNotificaionForms() {
    this.addNotificationForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      message: ['', [Validators.required]],
      sender_id: ['',],
      reciver_id: ['', [Validators.required]],
    });
  }

  get addNotificationControl() { return this.addNotificationForm.controls; }


  getUserList() {
    this.service.getUserList(this.token, '').subscribe((response: any) => {
      if (response.code === 200) {
        this.selectedUser = response.data;
        this.selectUserList = this.selectedUser.map((user: { id: any; }) => user.id);
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }


  toggleSelectAll() {
    this.disable = !this.disable;
    if (this.selectAllChecked.value) {
      this.selectedItems = this.selectedUser.map((user: { id: any; }) => user.id);
    } else {
      this.selectedItems = [];
      this.addNotificationControl['reciver_id'].setValue('');
    }
  }

  async addNotification() {
    this.spinner.show();
    this.is_submited = true;
    if (this.addNotificationForm.valid) {
      try {

        if (this.selectUserList.length === this.selectedItems.length) {
          this.addNotificationControl['reciver_id'].setValue('all');
        }

        const teamBody = {
          'title': this.addNotificationForm.value.title,
          'message': this.addNotificationForm.value.message,
          'sender_id': this.adminId,
          'reciver_id': String(this.selectedItems),
        }


        this.service.addNotification(this.token, teamBody).subscribe((response: any) => {
          this.spinner.hide();
          if (response.code === 200) {
            this.showToast('success', response.message);
            this.router.navigate(['/admin']);
          } else {
            this.handleError(response.code, response.message);
          }
        });
      } catch (error) {
        this.spinner.hide()
        this.showToast('error', 'Notification failed');
      }
    } else {
      this.spinner.hide();
    }
  }

  cancel() {
    this.router.navigate(['/admin']);
  }




}
