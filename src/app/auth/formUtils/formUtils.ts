import { FormGroup } from '@angular/forms';

export class FormUtils {
  static InvalidInput(form: FormGroup, value: string) {
    return form.controls[value].errors && form.controls[value].touched;
  }

  static GetMessageError(form: FormGroup, value: string): string | null {
    if (!form.controls[value]) return null;

    const errors = form.controls[value].errors ?? {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es obligatorio';
          break;
        case 'email':
          return 'Debe de ser un email correcto';
          break;
        case 'minlength':
          return 'No cumple con el minimo de caracteres necesarios';
          break;

        case 'maxlength':
          return 'Te has pasado de caracteres ';
          break;
        default:
          break;
      }
    }
    return null;
  }
}
