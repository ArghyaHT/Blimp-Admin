import { Component, ElementRef, Injector, Input, OnInit } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DashboardService } from 'src/app/service/dashboard.service';
import { BaseComponent } from 'src/app/utils/components/base/base.component';
import Swal from 'sweetalert2';

interface CmsLanguage {
  code: string;
  label: string;
  title: string;
  content: string;
  submitted: boolean;
  saving: boolean;
}

// Shared editor for the About Us / Privacy Policy / Terms & Conditions pages: one title + rich-text
// content per language, saved per language. `tag` identifies the page on the API ('1', '2', '3').
@Component({
  selector: 'app-cms-content-editor',
  templateUrl: './cms-content-editor.component.html',
})
export class CmsContentEditorComponent extends BaseComponent implements OnInit {
  @Input() tag = '';
  @Input() pageName = '';

  constructor(injector: Injector, private service: DashboardService, private elementRef: ElementRef<HTMLElement>) {
    super(injector);
  }

  token: any;
  loading = true;
  activeCode = 'en';

  languages: CmsLanguage[] = [
    { code: 'en', label: 'English', title: '', content: '', submitted: false, saving: false },
    { code: 'fr', label: 'French', title: '', content: '', submitted: false, saving: false },
    { code: 'de', label: 'German', title: '', content: '', submitted: false, saving: false },
    { code: 'it', label: 'Italian', title: '', content: '', submitted: false, saving: false },
  ];

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '18rem',
    minHeight: '5rem',
    placeholder: 'Enter content here...',
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

  ngOnInit() {
    this.token = localStorage.getItem('token');
    this.fetchContent();
  }

  // the rich-text editor renders its own editable <div> without an id, so name it from the visible label
  // (called once the editors exist, i.e. after the content has loaded)
  private labelEditors() {
    this.elementRef.nativeElement.querySelectorAll<HTMLElement>('angular-editor[data-labelledby]').forEach((editor) => {
      const textarea = editor.querySelector('.angular-editor-textarea');
      textarea?.setAttribute('role', 'textbox');
      textarea?.setAttribute('aria-multiline', 'true');
      textarea?.setAttribute('aria-required', 'true');
      textarea?.setAttribute('aria-labelledby', editor.getAttribute('data-labelledby')!);
    });
  }

  fetchContent() {
    this.loading = true;
    this.service.contentListingPage(this.token, '').subscribe({
      next: (response: any) => {
        this.loading = false;
        if (response.code == 200) {
          for (const language of this.languages) {
            const item = (response.data || []).find((row: any) => String(row.tag) === this.tag && row.language_code === language.code);
            // empty when missing, so the editor shows its placeholder instead of text that could be saved by mistake
            language.title = item?.title || '';
            language.content = item?.content || '';
          }
          setTimeout(() => this.labelEditors());
        } else {
          this.handleError(response.code, response.message);
        }
      },
      error: () => { this.loading = false; },
    });
  }

  get active(): CmsLanguage {
    return this.languages.find((language) => language.code === this.activeCode)!;
  }

  titleMissing(language: CmsLanguage): boolean {
    return !String(language.title || '').trim();
  }

  // the editor leaves markup such as "<p><br></p>" behind when cleared
  contentMissing(language: CmsLanguage): boolean {
    const html = String(language.content || '');
    const text = html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    return !text && !/<img/i.test(html);
  }

  hasErrors(language: CmsLanguage): boolean {
    return language.submitted && (this.titleMissing(language) || this.contentMissing(language));
  }

  save(language: CmsLanguage) {
    language.submitted = true;
    if (this.titleMissing(language) || this.contentMissing(language)) {
      return;
    }

    const requestData = {
      tag: Number(this.tag),
      title: language.title,
      language_code: language.code,
      content: language.content
    };

    language.saving = true;
    this.service.UpdateContentPage(this.token, requestData).subscribe({
      next: (response: any) => {
        language.saving = false;
        if (response.code === 200) {
          Swal.fire({
            icon: 'success',
            title: `${this.pageName} (${language.label}) updated successfully!`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000
          });
        } else {
          this.handleError(response.code, response.message);
        }
      },
      error: () => { language.saving = false; },
    });
  }
}
