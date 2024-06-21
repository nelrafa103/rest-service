import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { readFileSync } from 'fs';
import {
  Observable,
  firstValueFrom,
  from,
  lastValueFrom,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { TranslateService } from 'src/services/translate/translate.service';

@Injectable()
export class GamesInterceptor implements NestInterceptor {
  translateService: TranslateService = new TranslateService();
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();

    const clientLanguage = 'en';
    if (clientLanguage != 'en')
      return next.handle().pipe(
        switchMap((responseBody) =>
          from(
            this.translateService.translate('en', responseBody),
          ).pipe(
            map((translatedResponse) => {
              return translatedResponse;
            }),
          ),
        ),
      );
    return next.handle();
  }

  getRequestLanguage(request: any): string {
    const rawHeaders: string[] = request.raw.rawHeaders;
    const index = rawHeaders.findIndex((i) => i === 'Accept-Language');
    const language = rawHeaders[index + 1];
    const file = readFileSync('./src/data/languages.json', 'utf-8');
    const supportedLanguages = JSON.parse(file);
    return supportedLanguages[language || 'en-US'];
  }
}
