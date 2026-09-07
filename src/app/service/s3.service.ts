import { Injectable } from '@angular/core';
import {S3}  from 'aws-sdk';
import { environment } from '../../app/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class S3Service {

  public s3: S3;

  constructor() {
    this.s3 = new S3({
      accessKeyId: environment.ACCESSKEY_ID,
      secretAccessKey: environment.SECERET_KEY,
      region: environment.REGION,
    });
  }

  uploadFile(file: any, bucketName: string, key: string):  Promise<any> {
    const params = {
      Bucket: bucketName,
      Key: key,
      Body: file,
      ACL: 'public-read',
    };

    return this.s3.upload(params).promise();
  }
}
