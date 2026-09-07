import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

@Pipe({
  name: 'numberFormat'
})
export class NumberFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    } else {
      return value.toString();
    }
  }
}


@Pipe({ name: 'Status' })
export class StatusPipe implements PipeTransform {
  transform(value: any): any {
    if (value === 0) {
      return 'In-Active';
    }
    if (value === 1) {
      return 'Active';
    }
  }
}

@Pipe({ name: 'customDate' })
export class CustomDatePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;

    const date = new Date(value);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear().toString().substr(-2);
    const suffix = this.getDaySuffix(day);

    return `${day}${suffix} ${month} '${year}`;
  }

  private getDaySuffix(day: number): string {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  }
}

@Pipe({ name: 'Draft' })
export class DraftPipe implements PipeTransform {
  transform(value: any): any {
    if (value === 0) {
      return 'Published';
    }
    if (value === 1) {
      return 'Draft';
    }
  }
}


@Pipe({ name: 'Support' })
export class SupoprtPipe implements PipeTransform {
  transform(value: any): any {
    if (value === 0) {
      return 'Not Supported';
    }
    if (value === 1) {
      return 'Supported';
    }
  }
}

@Pipe({ name: 'Discover' })
export class DiscoverPipe implements PipeTransform {
  transform(value: any): any {
    if (value === 0) {
      return 'Not Discoverable';
    }
    if (value === 1) {
      return 'Discoverable';
    }
  }
}

@Pipe({ name: 'Featured' })
export class FeaturedPipe implements PipeTransform {
  transform(value: any): any {
    if (value === 0) {
      return 'Not Featured';
    }
    if (value === 1) {
      return 'Featured';
    }
  }
}


@Pipe({ name: 'Verfied' })
export class VerifiedPipe implements PipeTransform {
  transform(value: any): any {
    if (value === 0) {
      return 'Not Verified';
    }
    if (value === 1) {
      return 'Verified';
    }
  }
}

@Pipe({ name: 'TaxBenefits' })
export class TaxBenefitsPipe implements PipeTransform {
  transform(value: any): any {
    if (value === 0) {
      return 'No Tax Benefits';
    }
    if (value === 1) {
      return 'Tax Benefits';
    }
  }
}



@Pipe({ name: 'ApprovalAction' })
export class ApprovalActionPipe implements PipeTransform {
  transform(value: any): any {
    if (value === 0) {
      return 'Pending';
    }
    if (value === 1) {
      return 'Approved';
    }
    if (value === 2) {
      return 'Rejected';
    }
  }
}

@Pipe({ name: 'purposeAction' })
export class PurposePipe implements PipeTransform {
  transform(value: any): any {
    const numericValue = Number(value);
    switch (numericValue) {
      case 1:
        return 'Medical';
      case 2:
        return 'Education';
      case 3:
        return 'Community Service';
      default:
        return 'Unknown';
    }
  }
}


@Pipe({ name: 'patientRelationAction' })
export class PatientRelationPipe implements PipeTransform {
  transform(value: any): any {
    const numericValue = Number(value);
    switch (numericValue) {
      case 1:
        return 'Family';
      case 2:
        return 'Friend';
      case 3:
        return 'Other';
      default:
        return 'Unknown';
    }
  }
}

@Pipe({ name: 'educationStatusAction' })
export class EducationStatusPipe implements PipeTransform {
  transform(value: any): any {
    const numericValue = Number(value);
    switch (numericValue) {
      case 1:
        return 'High School';
      case 2:
        return "Bachelor's Degree";
      case 3:
        return "Master's Degree";
      default:
        return 'Unknown';
    }
  }
}


@Pipe({ name: 'employmentStatusAction' })
export class EmploymentStatusPipe implements PipeTransform {
  transform(value: any): any {
    const numericValue = Number(value);
    switch (numericValue) {
      case 1:
        return 'Employed';
      case 2:
        return 'Unemployed';
      case 3:
        return 'Self-employed';
      default:
        return 'Unknown';
    }
  }
}

@Pipe({ name: 'contactMethodAction' })
export class ContactMethodPipe implements PipeTransform {
  transform(value: any): any {
    const numericValue = Number(value);
    switch (numericValue) {
      case 1:
        return 'Email';
      case 2:
        return 'Phone';
      case 3:
        return 'Mail';
      default:
        return 'Unknown';
    }
  }
}

@Pipe({ name: 'donorRequestAction' })
export class DonorRequestPipe implements PipeTransform {
  transform(value: any): any {
    const numericValue = Number(value);
    switch (numericValue) {
      case 1:
        return 'Financial Assistance';
      case 2:
        return 'Volunteer';
      case 3:
        return 'Other';
      default:
        return 'Unknown';
    }
  }
}


@Pipe({ name: 'safeUrl' })
export class SafeUrlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}