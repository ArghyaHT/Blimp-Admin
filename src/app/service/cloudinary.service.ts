import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {

  private cloudName = 'dpynxkjfq'; // from cloudinary dashboard
  private uploadPreset = 'blimp_upload';

  constructor(private http: HttpClient) {}

uploadFile(file: File, folder?: string): Promise<any> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', this.uploadPreset);

    if (folder) {
    formData.append('folder', folder);
  }

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/${resourceType}/upload`;
  return this.http.post(cloudinaryUrl, formData).toPromise();
}

// Builds a browser-loadable image URL from the value the API returns.
// The API sends "cloudinary://<credentials>@<cloud><folder>/<id>", which is not a valid
// image URL, so the "<folder>/<id>" part after the cloud name is used. Bare ids are placed
// under `folder` when given. Full http(s) URLs pass through unchanged.
getImageUrl(storedValue: string | null | undefined, folder?: string): string {
  if (!storedValue || storedValue === 'null' || storedValue === 'undefined') {
    return '';
  }
  if (/^https?:\/\//.test(storedValue)) {
    return storedValue;
  }

  let path: string;
  const cloudPrefix = `@${this.cloudName}`;
  const prefixIndex = storedValue.indexOf(cloudPrefix);
  if (storedValue.startsWith('cloudinary://') && prefixIndex !== -1) {
    path = storedValue.slice(prefixIndex + cloudPrefix.length).replace(/^\/+/, '');
  } else {
    const id = storedValue.split('/').pop() || '';
    path = folder ? `${folder}/${id}` : id;
  }

  const publicId = path.split('/').pop();
  if (!publicId || publicId === 'null' || publicId === 'undefined') {
    return '';
  }
  return `https://res.cloudinary.com/${this.cloudName}/image/upload/${path}`;
}
}
