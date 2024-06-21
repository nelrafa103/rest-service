import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import ValidationService from './shared/validation.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor() {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateUrl(request);
  }

  validateUrl(request) {
    // Metodo de verificacion de identidad de la aplicacion frontend
    //console.log(request)
    return true;
  }
}
