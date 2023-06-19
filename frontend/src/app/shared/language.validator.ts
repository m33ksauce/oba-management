import { AbstractControl } from '@angular/forms';

export function ValidateLanguage(control: AbstractControl) {
  let regExp = new RegExp(/^[a-zA-Z0-9]*$/);
  if (!regExp.test(control.value)) {
    return { invalidLanguage: true };
  }
  return null;
}
