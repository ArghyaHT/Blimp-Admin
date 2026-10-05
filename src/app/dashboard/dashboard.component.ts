import { Component } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Router } from '@angular/router';

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
  constructor(private service: DashboardService, private router: Router) { }
  dashboard_count: any;

  // Dashboard stat cards: key = field in the dashboard API response, route = page opened on click
  // (access is checked by the route guard; route null = not clickable)
  statGroups = [
    {
      title: 'Customers',
      cards: [
        { label: 'Independent Customers', key: 'totalIndependentCustomers', route: '/admin/customers', format: '1.0-0', icon: 'fa-user', iconClass: 'bg-primary/10 text-primary' },
        { label: 'Organization Customers', key: 'totalOrganizationCustomers', route: '/admin/customers', format: '1.0-0', icon: 'fa-building', iconClass: 'bg-info/10 text-info' },
        { label: 'Donors', key: 'totalDonors', route: '/admin/customers', format: '1.0-0', icon: 'fa-hand-holding-heart', iconClass: 'bg-danger/10 text-danger' },
      ],
    },
    {
      title: 'Campaigns & Funds',
      cards: [
        { label: 'Campaigners', key: 'totalCampaigners', route: '/admin/customers', format: '1.0-0', icon: 'fa-bullhorn', iconClass: 'bg-warning/10 text-warning' },
        { label: 'Campaigns', key: 'totalCampaigns', route: '/admin/campaign', format: '1.0-0', icon: 'fa-flag', iconClass: 'bg-secondary/10 text-secondary' },
        { label: 'Total Earning', key: 'totalFundsRaised', route: null, format: '1.0-2', icon: 'fa-sack-dollar', iconClass: 'bg-success/10 text-success' },
      ],
    },
  ];


  private compactFormatter = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

  // 950 -> "950", 1284 -> "1.3K", 1250430.5 -> "1.3M"
  compactNumber(value: any): string {
    const number = Number(value ?? 0);
    return isNaN(number) ? String(value) : this.compactFormatter.format(number);
  }

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.adminId = localStorage.getItem('adminId');
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


  openCard(route: string | null) {
    if (route) {
      this.router.navigate([route]);
    }
  }

}
