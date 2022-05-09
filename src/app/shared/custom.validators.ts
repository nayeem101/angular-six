import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  //? custom email validator
  static emailDomain(domainName: string) {
    return function (control: AbstractControl): ValidationErrors | null {
      const email: string = control.value;
      const domain = email.substring(email.lastIndexOf('@') + 1);
      return email === '' || domain.toLowerCase() === domainName.toLowerCase()
        ? null
        : { emailDomain: true };
    };
  }
}
