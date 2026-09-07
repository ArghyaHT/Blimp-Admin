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

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
  return this.http.post(cloudinaryUrl, formData).toPromise();
}
}
