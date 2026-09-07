import { Routes } from '@angular/router';
import { guardGuard } from './authguard/guard.guard';


// layouts
import { AppLayout } from './layouts/app-layout';
import { AuthLayout } from './layouts/auth-layout';

// pages
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccessDeniedComponent } from './access-denied/access-denied.component';


export const routes: Routes = [


    { path: '', loadChildren: () => import('./auth/auth.module').then((d) => d.AuthModule) },
    { path: 'access-denied', component: AccessDeniedComponent },
    {
        path: 'admin',
        component: AppLayout,
        children: [
            { path: '', component: DashboardComponent, canActivate: [guardGuard], data: { permission: '' } },

            { path: '', loadChildren: () => import('./commission/commission.module').then((d) => d.CommissionModule), canActivate: [guardGuard], data: { permission: '' } },

            { path: '', loadChildren: () => import('./users/user.module').then((d) => d.UsersModule), canActivate: [guardGuard], data: { permission: '' } },

            { path: 'chef', loadChildren: () => import('./chef/chef.module').then((d) => d.ChefModule), canActivate: [guardGuard], data: { permission: 'chef' } },

            { path: 'report', loadChildren: () => import('./customer/customer.module').then((d) => d.CustomerModule), canActivate: [guardGuard], data: { permission: 'report' } },

            { path: 'category', loadChildren: () => import('./categories/categories.module').then((d) => d.CategoriesModule), canActivate: [guardGuard], data: { permission: 'category' } },

            { path: 'sub-category', loadChildren: () => import('./sub-categories/sub-categories.module').then((d) => d.SubCategoriesModule), canActivate: [guardGuard], data: { permission: 'sub-category' } },

            { path: 'article', loadChildren: () => import('./articles/articles.module').then((d) => d.ArticlesModule), canActivate: [guardGuard], data: { permission: 'article' } },

            { path: 'blogs', loadChildren: () => import('./blogs/blogs.module').then((d) => d.BlogsModule), canActivate: [guardGuard], data: { permission: 'blogs' } },

            { path: 'teams', loadChildren: () => import('./teams/teams.module').then((d) => d.TeamsModule), canActivate: [guardGuard], data: { permission: 'teams' } },

            { path: 'customers', loadChildren: () => import('./customers/customer.module').then((d) => d.customerModule), canActivate: [guardGuard], data: { permission: 'customers' } },

            { path: 'earning', loadChildren: () => import('./earning/earning.module').then((d) => d.EarningModule), canActivate: [guardGuard], data: { permission: 'earning' } },

            { path: 'transaction', loadChildren: () => import('./transaction/transaction.module').then((d) => d.TransactionModule), canActivate: [guardGuard], data: { permission: 'transaction' } },

            { path: 'country', loadChildren: () => import('./country/country.module').then((d) => d.CountryModule), canActivate: [guardGuard], data: { permission: 'country' } },

            { path: 'cms', loadChildren: () => import('./cms/cms.module').then((d) => d.CmsModule), canActivate: [guardGuard], data: { permission: 'cms' } },

            { path: 'notification', loadChildren: () => import('./notifications/notification.module').then((d) => d.NotificationsModule), canActivate: [guardGuard], data: { permission: 'notification' } },

            { path: 'campaign', loadChildren: () => import('./campaigns/campaigns.module').then((d) => d.CampaignsModule), canActivate: [guardGuard], data: { permission: 'campaign' } },

            { path: 'subscribe-newsletters', loadChildren: () => import('./subscribe-news-letters/subscribe-news-letters.module').then((d) => d.SubScribeNewsLettersModule), canActivate: [guardGuard], data: { permission: 'subscribe-newsletters' } },

        ],
    },

    {
        path: '',
        component: AuthLayout,
        children: [
            // pages
            { path: '', loadChildren: () => import('./pages/pages.module').then((d) => d.PagesModule) },


        ],
    },
];
