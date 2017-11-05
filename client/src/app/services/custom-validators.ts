import * as _ from 'lodash';
import { FormControl, ValidatorFn } from '@angular/forms';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/first';

export interface IValidationResult {
  [key: string]: any;
}

export class CustomValidators {

  public static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    const value = validatorValue || {};
    const config = {
      'required': 'This is required',
      'required_name': 'Either first or last name is required',
      'required_contact_method': 'Either phone or email is required',
      'invalidCVC': 'Invalid CVC',
      'invalidBankAccount': 'Invalid bank account number',
      'invalidRoutingNumber': 'Invalid routing number',
      'invalidRoutingNumberBankNotFound': 'Bank not found',
      'invalidCreditCard': 'Invalid credit card number',
      'invalidExpiration': 'Invalid expiration date',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPhoneNumber': 'Invalid phone number',
      'invalidPassword': 'Invalid password. Password must be at least 8 characters long, and contain a number.',
      'verifiedPassword': 'Passwords do not match',
      'minlength': `Minimum length ${value.requiredLength}`,
      'maxlength': `Maximum length ${value.requiredLength}`,
      'nonUniqueEmail': 'E-Mail already taken',
      'invalidAmount': 'Donation amount must be at least $1.00',
      'invalidDate': 'Donation date is not valid',
      'invalidVerificationAmount': 'Verification amount must be between $0.01 and $0.99 (must include decimal)',
      'date_min': `Choose a date after ${value}`,
      'date_max': `Choose an date before ${value}`,
      'pattern': 'Invalid'
    };

    if (!config[validatorName]) {
      console.warn('Missing error message for', validatorName);
      return 'Unknown error!';
    } else {
      return config[validatorName];
    }
  }

  public static getValidNameValidator(otherControl: FormControl): ValidatorFn {
    return (control: FormControl) => {
      let returnValue: any = null;
      if (!control.value && !otherControl.value) {
        returnValue = {'required_name': true};
      }
      setTimeout(() => {
        otherControl.updateValueAndValidity();
      }, 0);
      return returnValue;
    };
  }

  public static getValidContactMethodValidator(otherControl: FormControl): ValidatorFn {
    return (control: FormControl) => {
      let returnValue: any = null;
      if (!control.value && !otherControl.value) {
        returnValue = {'required_contact_method': true};
      }
      setTimeout(() => {
        otherControl.updateValueAndValidity();
      }, 0);
      return returnValue;
    };
  }

  public static validEmail(control: FormControl): IValidationResult {
    // RFC 2822 compliant regex
    if (!control || !control.value || control.value.match(
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return {'invalidEmailAddress': true};
    }
  }

  public static validPhoneNumber(control: FormControl): IValidationResult {
    let errorValue = {'invalidPhoneNumber': true};
    if (!control || !control.value || _.filter(control.value, function (val) {
        return parseInt(val) >= 0;
      }).join('').length === 10) {
      return null;
    } else {
      return errorValue;
    }
  }

  // public static validUniqueEmail(userService: UserProvider): AsyncValidatorFn {
  //   return (control: FormControl) => {
  //     return new Observable(observer => {
  //       userService.validateUsername(control.value)
  //         .subscribe((response: any) => {
  //           console.log(response);
  //           if (!!response.username_available) {
  //             observer.next(null);
  //           } else {
  //             observer.next({'nonUniqueEmail': true});
  //           }
  //         }, () => {
  //           observer.next({'invalidEmailAddress': true});
  //         });
  //     }).first();
  //   };
  // }

  public static validPassword(control: FormControl): IValidationResult {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return {'invalidPassword': true};
    }
  }

  public static getValidVerifiedPasswordValidator(passwordControl: FormControl): ValidatorFn {
    return (verifiedPasswordControl: FormControl) => {
      if (verifiedPasswordControl.value === passwordControl.value) {
        return null;
      } else {
        return {'verifiedPassword': true};
      }
    };
  }

  // public static validUniqueUpdatedEmail(userService: UserProvider, currentEmailAddress: string): AsyncValidatorFn {
  //   return (control: FormControl) => {
  //     return new Observable(observer => {
  //       if (currentEmailAddress === control.value) {
  //         observer.next(null);
  //         return;
  //       }
  //
  //       userService.validateUsername(control.value)
  //         .subscribe((response: any) => {
  //           console.log(response);
  //           if (!!response.username_available) {
  //             observer.next(null);
  //           } else {
  //             observer.next({'nonUniqueEmail': true});
  //           }
  //         });
  //     }).first();
  //   };
  // }
}
