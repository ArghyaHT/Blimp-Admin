import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/app/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  is_loggedIn = new BehaviorSubject<boolean>(false);
  apiKey: string = environment.APIKEY;
  token: string | null = localStorage.getItem('token');


  constructor(private router: Router, private http: HttpClient) { }

  dashboard(token: any) {
    return this.http.post(environment.APIURL + "/adminDashboard", {}, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Customer_Listing(token: any, body: any) {
    return this.http.post(environment.APIURL + "/listCustomers", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  accept_reject_Chef_Listing(token: any, body: any) {
    return this.http.post(environment.APIURL + "/listChefnewrequest", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Chef_Listing(token: any, body: any) {
    return this.http.post(environment.APIURL + "/listchef", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  block_unblock_chef(token: any, body: any) {
    return this.http.post(environment.APIURL + "/block_chef", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  delete_chef(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete_chef", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  accept_chef(token: any, body: any) {
    return this.http.post(environment.APIURL + "/accept_chef_request", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  accept_reject_chef_detail(token: any, body: any) {
    return this.http.post(environment.APIURL + "/chef_detils_on_register_reqest", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  accepted_chef_detail(token: any, body: any) {
    return this.http.post(environment.APIURL + "/chef_detils_", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  block_unblock__user(token: any, body: any) {
    return this.http.post(environment.APIURL + "/block_User", body, {

      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Delete_user(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete_user", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  add_update_commission(token: any, body: any) {
    return this.http.post(environment.APIURL + "/updateCommision", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Earning_listing(token: any, body: any) {
    return this.http.post(environment.APIURL + "/admin_earning_details_list", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Order_Listing(token: any, body: any) {
    return this.http.post(environment.APIURL + "/listPlacedOrder", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Order_detail(token: any, body: any) {
    return this.http.post(environment.APIURL + "/placedOrderInfo", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  UpdateContentPage(token: any, body: any) {
    return this.http.post(environment.APIURL + "/page-contents-add-update", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  contentListingPage(token: any, body: any) {
    return this.http.post(environment.APIURL + "/page-contents-list", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }
  contactInfo(token: any, body: any) {
    return this.http.post(environment.APIURL + "/contact-us-list", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  contact_details(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-contact-details", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  customer_listing(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-customers-list", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  customer_details(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-customer-details", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  block_Unblock_Customer(token: any, body: any) {
    return this.http.post(environment.APIURL + "/block-unblock-customer", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  convertDocument(token: any, body: any): Observable<Blob> {
    return this.http.post(environment.APIURL + "/convert", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token,
      },
      responseType: 'blob' // Set responseType here
    });
  }

  uploadFile(token: any, body: any): Observable<ArrayBuffer> {
    return this.http.post(environment.APIURL + "/upload-file", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token,
      },
      responseType: 'arraybuffer' // Set responseType here
    });
  }


  bulkFile(token: any, body: any) {
    return this.http.post(environment.APIURL + "/bulk-uplaod", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token,
      },
    });
  }

  faqQuestionAnswerList(token: any, body: any) {
    return this.http.post(environment.APIURL + "/list-faq", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  addFAQ(token: any, body: any) {
    return this.http.post(environment.APIURL + "/add-faq", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  UpdateFAQ(token: any, body: any) {
    return this.http.post(environment.APIURL + "/edit-faq", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  deleteFAQ(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete-faq", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  active_Inactive_FAQ(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-faq", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  faq_details(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-faq-details", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Add_Blogs(token: any, body: any) {
    return this.http.post(environment.APIURL + "/add-blog", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Blogs_List(token: any, body: any) {
    return this.http.post(environment.APIURL + "/list-blogs", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Edit_Blogs(token: any, body: any) {
    return this.http.post(environment.APIURL + "/edit_blog", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Delete_Blog(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete-blog", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Active_Inactive_Blog(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-blog", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Blog_details(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-blog-details", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }



  Add_Teams(token: any, body: any) {
    return this.http.post(environment.APIURL + "/add-team", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Teams_List(token: any, body: any) {
    return this.http.post(environment.APIURL + "/list-team", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  Edit_Teams(token: any, body: any) {
    return this.http.post(environment.APIURL + "/edit-team", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Delete_Teams(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete-team", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Active_Inactive_Teams(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-team", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  Teams_details(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-team-details", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  category_list(token: any, body: any) {
    return this.http.post(environment.APIURL + "/list-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  activeCategoryList(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-category-list", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  activeSubCategoryList(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-sub-category-list", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }



  add_category(token: any, body: any) {
    return this.http.post(environment.APIURL + "/add-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  edit_category(token: any, body: any) {
    return this.http.post(environment.APIURL + "/edit-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  delete_category(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  sub_category_list(token: any, body: any) {
    return this.http.post(environment.APIURL + "/list-sub-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  add_sub_category(token: any, body: any) {
    return this.http.post(environment.APIURL + "/add-sub-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  edit_sub_category(token: any, body: any) {
    return this.http.post(environment.APIURL + "/edit-sub-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  delete_sub_category(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete-sub-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }



  country_list(token: any, body: any) {
    return this.http.post(environment.APIURL + "/list-country", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  add_country(token: any, body: any) {
    return this.http.post(environment.APIURL + "/add-country", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  edit_country(token: any, body: any) {
    return this.http.post(environment.APIURL + "/edit-country", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  delete_counry(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete-country", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  add_article(token: any, body: any) {
    return this.http.post(environment.APIURL + "/add-article", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  article_list(token: any, body: any) {
    return this.http.post(environment.APIURL + "/list-article", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  edit_article(token: any, body: any) {
    return this.http.post(environment.APIURL + "/edit-article", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  delete_article(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete-article", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  active_inactive_article(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-article", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  article_details(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-article-details", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  fetch_sub_category(token: any, body: any) {
    return this.http.post(environment.APIURL + "/getSubcategories", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  activeInactiveCategory(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  activeInactiveSubCategory(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-sub-category", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  activeInactiveCountry(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-country", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }


  addNotification(token: any, body: any) {
    return this.http.post(environment.APIURL + "/add-notification", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  getUserList(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-users-list", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  deleteCustomer(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete-customer", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }



  // Fetch all campaigns
  getCampaigns(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-campaigns", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }

  // Fetch details of a specific campaign
  getCampaignDetails(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-campaign-details", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }

  // Activate or deactivate a campaign
  activateDeactivateCampaign(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-in-campaign", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }

  // Approve or reject a campaign
  approveRejectCampaign(token: any, body: any) {
    return this.http.post(environment.APIURL + "/approve-reject-campaign", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }

  // Delete a campaign
  deleteCampaign(token: any, body: any) {
    return this.http.post(environment.APIURL + "/delete-campaign", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }


  updateCampaignStatus(token: any, body: any) {
    return this.http.post(environment.APIURL + "/update-campaign-status", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }
  

  subscribeNewsLetters(token: any,body: any) {
    return this.http.post(environment.APIURL + "/list-subscribe-newsletters", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }

  edit_campaign(token: any, body: any) {
    return this.http.post(environment.APIURL + "/edit-campaign", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  campaign_details(token: any, body: any) {
    return this.http.post(environment.APIURL + "/view-campaign-details", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  getCountry(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-countries", body, {
      headers: {
        "api-key": this.apiKey,
        // only sent when logged in: a null header value makes Angular throw
        ...(token ? { 'token': token } : {})
      },
    });
  }

  getPermissions(body: any) {
    return this.http.post(environment.APIURL + "/get-permission", body, {
      headers: {
        "api-key": this.apiKey
      },
    });
  }

  getDashbordData(token: any, body: any) {
    return this.http.post(environment.APIURL + "/dashboard", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  getCommissionDetails(token: any, body: any) {
    return this.http.post(environment.APIURL + "/get-commission", body, {
      headers: {
        "api-key": this.apiKey,
        // only sent when logged in: a null header value makes Angular throw
        ...(token ? { 'token': token } : {})
      },
    });
  }

  deleteCampaignImage(token: any,body: any) {
    return this.http.post(environment.APIURL + "/delete-camaignImage", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }
  
  activateDeactivateTaxCampaign(token: any, body: any) {
    return this.http.post(environment.APIURL + "/active-inactive-tax-campaign", body, {
      headers: {
        "api-key": this.apiKey,
        "token": token
      },
    });
  }

  transactionList(token: any, body: any) {
    return this.http.post(environment.APIURL + "/transaction-list", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  earningList(token: any, body: any) {
    return this.http.post(environment.APIURL + "/earning-list", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

  getCampaignName(token: any,body: any) {
    return this.http.post(environment.APIURL + "/get-campaign-name", body, {
      headers: {
        "api-key": this.apiKey,
        'token': token
      },
    });
  }

}
