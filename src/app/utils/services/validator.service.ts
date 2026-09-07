import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  static getValidatorErrorMessage(validatorName: string, validatorValue?: any, fieldName?: string) {
    if (!fieldName) fieldName = 'This';

    const config: any = {
      required: `${fieldName} is required`,
      email: 'Please enter a valid email address',
      emailNotFound: 'Email address is not registered with us',
      invalidPassword: 'Password must be at least 8 characters long, and contain at least 1 number, lower case letter and upper case letter',
      passwordMatch: 'Confirm password should be same as new password',
      invalidPhoneNumber: `Please enter a valid Phone Number`,
      invalidUrl: `Please enter a valid url`,
      invalidSpace: 'Spaces not allowed',
    }
    return config[validatorName];
  }

  passwordValidator({ value }: any) {
    if (value && value.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*'|,.#?&^_-]{8,}$/)) {
      return null;
    }
    return { invalidPassword: true };
  }

  // Validate all fields on submit
  validateAllFormFields(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      } else if (control instanceof FormArray) {
        this.validateAllFormFields(control);
      }
    });
    const invalidFields: any = [].slice.call(document.getElementsByClassName('ng-invalid'));
    for (const invalid of invalidFields) {
      invalid.focus();
      if (invalid === document.activeElement) {
        break;
      }
    }
  }

  onlyPhoneNumber(control: any) {
    if (control.value && control.value.toString().match(/^(?=(?:\D*\d){10,15}\D*$)\+?[0-9]{1,3}[\s-]?(?:\(0?[0-9]{1,5}\)|[0-9]{1,5})[-\s]?[0-9][\d\s-]{5,7}\s?(?:x[\d-]{0,4})?$/)) {
      return null;
    }
    return { invalidPhoneNumber: true };
  }

  emailValidator(control: any) {
    if (control.value && control.value.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      return null;
    }
    return { email: true };
  }

  urlValidator(control: any) {
    if (control.value && control.value.match(/^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/)) {
      return null;
    }
    return { invalidUrl: true };
  }

  notAllowSpace(control: any) {
    if (control.value && control.value.toString().match(/^\S.*$/)) {
      return null;
    }
    return { invalidSpace: true };
  }

  youtubeValidator(control: any) {
    const youtubeEmbedPattern = /^https:\/\/(www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+(\?[\w&=]*)?$/;
  
    if (control.value && youtubeEmbedPattern.test(control.value)) {
      return null;
    }
    
    return { youtubeLink: true }; 
  }
  

}
