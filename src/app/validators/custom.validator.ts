import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms"

export class CustomValidators extends Validators {
  static passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const regex = /^(?=.*\d).{8,}$/;
    return regex.test(control.value) ? null : { invalidPassword: true };
  }

  static conditionalRequired(name: string, company: boolean): ValidationErrors | null {
    if ((name === 'age' || name === 'position') && !company) {
      console.log(this.required)
      return { required: true };
    } else if (name === 'bank_account' && company) {
      console.log(this.required)
      return { required: true }
    }
    return null;
  }
}
