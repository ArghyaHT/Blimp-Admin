import { Component, Injector } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DashboardService } from 'src/app/service/dashboard.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})
export class PrivacyPolicyComponent extends BaseComponent {

  constructor(injector: Injector, private service: DashboardService) {
    super(injector);
  }
  token: any;

  htmlContentEnglish: any;
  htmlContentFrench: any;
  htmlContentGerman: any;
  htmlContentItalian: any;
  titleEnglish: any;
  titleFrench: any;
  titleGerman: any;
  titleItalian: any;


  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      [
        'textColor',
        'backgroundColor',
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  configFrench: AngularEditorConfig = this.config;
  configGerman: AngularEditorConfig = this.config;
  configItalian: AngularEditorConfig = this.config;


  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fetchContent();
  };

  fetchContent() {
    this.service.contentListingPage(this.token, '').subscribe((response: any) => {
      if (response.code == 200) {
        this.processContent(response.data);
      } else {
        this.handleError(response.code, response.message);
      }
    });
  }

  processContent(data: any) {
    const englishContent = data.find((item: any) => item.tag === '2' && item.language_code === 'en');
    const frenchContent = data.find((item: any) => item.tag === '2' && item.language_code === 'fr');
    const germanContent = data.find((item: any) => item.tag === '2' && item.language_code === 'de');
    const italianContent = data.find((item: any) => item.tag === '2' && item.language_code === 'it');

    this.htmlContentEnglish = englishContent ? englishContent.content : 'No content found for English';
    this.titleEnglish = englishContent ? englishContent.title : '';

    this.htmlContentFrench = frenchContent ? frenchContent.content : 'No content found for French';
    this.titleFrench = frenchContent ? frenchContent.title : '';

    this.htmlContentGerman = germanContent ? germanContent.content : 'No content found for German';
    this.titleGerman = germanContent ? germanContent.title : '';

    this.htmlContentItalian = italianContent ? italianContent.content : 'No content found for Italian';
    this.titleItalian = italianContent ? italianContent.title : '';
  }

  updateContent(language: string) {
    let contentToUpdate, titleToUpdate, language_code;

    switch (language) {
      case 'English':
        contentToUpdate = this.htmlContentEnglish;
        titleToUpdate = this.titleEnglish;
        language_code = 'en';
        break;
      case 'French':
        contentToUpdate = this.htmlContentFrench;
        titleToUpdate = this.titleFrench;
        language_code = 'fr';
        break;
      case 'German':
        contentToUpdate = this.htmlContentGerman;
        titleToUpdate = this.titleGerman;
        language_code = 'de';
        break;
      case 'Italian':
        contentToUpdate = this.htmlContentItalian;
        titleToUpdate = this.titleItalian;
        language_code = 'it';
        break;
    }

    const requestData = {
      tag: 2,
      title: titleToUpdate,
      language_code: language_code,
      content: contentToUpdate
    };
    this.service.UpdateContentPage(this.token, requestData).subscribe((response: any) => {
      if (response.code === 200) {
        Swal.fire({
          icon: 'success',
          title: 'Privacy Policy Content Updated Successfully!',
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
}
