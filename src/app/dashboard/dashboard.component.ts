import { Component } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  filterOptions = [
    { value: '', label: 'Select Filter' },
    { label: 'Today', value: 'day' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
    { label: 'This Year', value: 'year' },
    { label: 'Custom', value: 'custom' }
  ];

  selectedFilterType: string = '';
  startDate: Date | null = null;
  endDate: Date | null = null;
  dashboardData: any;
  adminId:any
  token: any
  userPermission: string[] = [];
  constructor(private service: DashboardService, private router: Router,private Auth: AuthService) { }
  dashboard_count: any;


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');
    this.getPermission();
    this.fetchDashboardData(); 
  }


  onFilterChange() {
    if (this.selectedFilterType !== 'custom') {
      this.startDate = null;
      this.endDate = null;
    }
  }

  fetchDashboardData(){
    const requestBody = {
      filterType: this.selectedFilterType,
      startDate: this.startDate,
      endDate: this.endDate
    };


    this.service.getDashbordData(this.token, requestBody).subscribe((response: any) => {
      if (response.code === 200) {
        this.dashboardData = response.data;
      }
    });
  }


  getPermission() {
    const data = {
        id : this.adminId,
    }
    this.service.getPermissions(data).subscribe((response: any) => {
      if (response.code === 200) {
        this.userPermission = response.data.permissions || [];;
      } 
    });
  }

  checkPermission(permissionType: string): void {
    if (this.userPermission.includes('0') || this.userPermission.includes(permissionType)) {
      switch (permissionType) {
        case 'independent-customers':
          this.router.navigate(['/admin/customers']);
          break;
        case 'organization-customers':
          this.router.navigate(['/admin/customers']);
          break;
        case 'donors':
          this.router.navigate(['/admin/donors']); 
          break;
        case 'campaign':
          this.router.navigate(['/admin/campaign']);
          break;
        case 'campaign':
          this.router.navigate(['/admin/campaign']);
          break;
        case 'earnings':
          this.router.navigate(['/admin/earning']);
          break;
        default:
          this.router.navigate(['/access-denied']);
      }
    } else {
      this.router.navigate(['/access-denied']);
    }
  }

}
