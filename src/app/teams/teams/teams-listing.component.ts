
import { ModalComponent } from 'angular-custom-modal';
import { Component, Injector, ViewChild } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import Swal from 'sweetalert2';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONSTANTS } from 'src/app/service/constant.service';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-teams-listing',
  templateUrl: './teams-listing.component.html',
  styleUrls: ['./teams-listing.component.css']
})
export class TeamsListingComponent extends BaseComponent {

  @ViewChild('editTeams') editTeams!: ModalComponent;
  @ViewChild('addTeams') addTeams!: ModalComponent;
  @ViewChild(DatatableComponent) table!: DatatableComponent;

  addTeamsForm: FormGroup | any;
  editTeamsForm: FormGroup | any;

  constructor(injector: Injector, private service: DashboardService, private formBuilder: FormBuilder) {
    super(injector);

  }

  columnMode = ColumnMode.force;
  editTeamId: number = 0;
  is_submited = false;
  search = '';
  page: number = 1;
  per_page: any = 10;
  totalPages: number = 0;
  totalTeams: number = 0;
  rows: any[] = [];
  token: any;
  constant = CONSTANTS
  teamProfileName: any;
  teamImage: any;
  selectedFile: any;


  columns = [];


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fetchData();

  }

  fetchData(sortBy: any = '', searchTerm: string = '') {
    const requestData = {
      page: this.page,
      search_text: this.search,
      record_count: parseInt(this.per_page),
    };

    this.service.Teams_List(this.token, requestData).subscribe((response: any) => {
      if (response.code === 200) {
        this.rows = response.data.Teams;
        this.totalTeams = response.data.total_record_count;
        this.totalPages = Math.ceil(this.totalTeams / this.per_page);

      } else {
        this.handleError(response.code, response.message);
        this.totalTeams = 0;
        this.totalPages = 0;
        this.rows = [];
      }
    });
  }

  handleTeamStatus(id: number, action: 'activate' | 'inactivate') {
    const requestBody = { id: id };
    const actionText = action === 'activate' ? 'Activate' : 'Inactivate';
    const confirmButtonText = `Yes, ${actionText} it!`;
    const successMessage = `Team ${actionText}d successfully!`;

    Swal.fire({
      title: 'Are you sure?',
      text: `You Are About To ${actionText} This Team!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: confirmButtonText
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Active_Inactive_Teams(this.token, requestBody).subscribe((response: any) => {
          console.log(response);
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: successMessage,
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

  // Usage:
  active_Team(id: number) {
    this.handleTeamStatus(id, 'activate');
  }

  inactive_Team(id: number) {
    this.handleTeamStatus(id, 'inactivate');
  }


  deleteTeam(id: number) {

    const requestBody = { id: id };
    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to Delete this Team!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, Delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.Delete_Teams(this.token, requestBody).subscribe((response: any) => {
          if (response.code === 200) {
            this.fetchData();
            Swal.fire({
              icon: 'success',
              title: 'Team Deleted successfully!',
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
    if (this.totalTeams === 0) {
      return 'No entries to display';
    }
    const start = (this.page - 1) * this.per_page + 1;
    let end;
    if (this.page * this.per_page <= this.totalTeams) {
      end = this.page * this.per_page;
    } else {
      end = this.totalTeams;
    }
    const totalEntries = this.totalTeams;
    return `Showing ${start} to ${end} of ${totalEntries} entries`;
  }

  cancel() {
    this.is_submited = false;
    this.addTeamsForm.reset();
    this.addTeams.close();
    this.editTeams.close();
  }

  navigateToAddTeams() {
    this.router.navigate(['/admin/teams/add-teams']);
  }

  navigateToEditTeams(id: number) {
    this.router.navigate(['/admin/teams/edit-teams', id]);
  }


}
