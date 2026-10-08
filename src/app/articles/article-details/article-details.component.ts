import { Component, Injector } from '@angular/core';
import { DashboardService } from 'src/app/service/dashboard.service';
import { CloudinaryService } from 'src/app/service/cloudinary.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.css']
})
export class ArticleDetailsComponent extends BaseComponent {

  constructor(injector: Injector, private service: DashboardService, private cloudinaryService: CloudinaryService) {
    super(injector);
  }

  articleData: any
  id: any;
  token: any
  loading = true;

  // resolved, browser-loadable media addresses (the API returns "cloudinary://…" values or bare ids)
  imageUrl = '';
  imageError = false;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params['id']
    })
    this.token = localStorage.getItem('token');
    this.fetchData();
  }

  fetchData() {
    const body = {
      "id": this.id
    }
    this.loading = true;
    this.service.article_details(this.token, body).subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.code === 200) {
          this.articleData = response.data;
          const a = this.articleData || {};
          this.imageUrl = this.cloudinaryService.getImageUrl(a.image, 'articles');
        } else {
          this.handleError(response.code, response.message);
        }
      },
      error: () => { this.loading = false; },
    });
  }

}
