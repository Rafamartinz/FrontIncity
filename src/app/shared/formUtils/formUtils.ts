import { FormGroup } from '@angular/forms';

export class FormUtils {
  //Para las validaciones de los formularios creo mensajes personalizados dependiendo  del Validators
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

        case 'email':
          return 'Debe de ser un email correcto';

        case 'minlength':
          return 'No cumple con el minimo de caracteres necesarios';

        case 'maxlength':
          return 'Te has pasado de caracteres ';

        case 'min':
        case 'max':
          if (value === 'lat') {
            return 'La latitud debe estar entre -90 y 90';
          } else if (value === 'lgn') {
            return 'La longitud debe estar entre -180 y 180';
          } else {
            return 'El valor está fuera del rango permitido';
          }
        default:
          break;
      }
    }
    return null;
  }
}
