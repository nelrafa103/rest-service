import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { firstValueFrom, retry, timer } from 'rxjs';
import { Cache } from 'cache-manager';


@Injectable()
export class ClientService {
  constructor(private readonly httpService: HttpService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async post(fields: string, query: string) {
    /*console.log(process.env.IGDB_BASE_API + query);
    console.log(fields);
    console.log(process.env.CLIENT_ID);
    console.log(process.env.BEARER_TOKEN); */
    const value = await this.cacheManager.get(process.env.IGDB_BASE_API + query)
    console.log("Cache value",value)
    if(value != null) return value

    
    try {
      const begin = new Date();
      const response = this.httpService
        .post(process.env.IGDB_BASE_API + query, fields, {
          headers: {
            'Client-ID': process.env.CLIENT_ID,
            Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
            'Content-Type': 'text/plain',
          },
        })
        .pipe(
          retry({
            count: 3,
            delay: (error, count) => {
              return timer(Math.min(60000, 2 ^ (count * 1000)));
            },
          }),
        );

      const firstResult = (await firstValueFrom(response)).data;

      const end = new Date();

      console.log(process.env.IGDB_BASE_API + query)
      console.log(firstResult)
      await this.cacheManager.set(process.env.IGDB_BASE_API + query,firstResult)
      console.log('IGDB REQUEST:', end.getTime() - begin.getTime());
      /* if(firstResult != null) {

                const data = await firstResult;   
                data.forEach(element => {
                   element.summary != null || undefined ? this.translateService.translate("",element.summary) : console.log("No se pudo")
                });
              
            } */
      //  console.log((await firstValueFrom(response)).headers);
      //console.log(firstResult);
      return firstResult;
    } catch (e) {
      console.log(e);
      return JSON.stringify({
        error: 'Is been a error on the app',
        message: 'Try in phew moments, stay please',
      });
    }
  }
}
