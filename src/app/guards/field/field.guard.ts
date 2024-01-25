import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FieldService } from '../../services/field/field.service';

export const FieldGuard: CanActivateFn = async (route, state) => {
  const fieldService = inject(FieldService);
  const router = inject(Router);
  const id: string = route.params['id'];

  if (isNaN(Number(id))) {
    router.navigate(['/home']);
    return false;
  }

  try {
    const field = await fieldService.getFieldById(Number(id));

    if (field) {
      return true;
    }

  } catch (error) {
    console.error('Error al obtener el campo:', error);
  }

  router.navigate(['/home']);
  return false;
};

