import { Controller, Inject, UseInterceptors } from '@nestjs/common';
//import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ClientService } from 'src/services/client/client.service';
import { FieldsService } from 'src/services/fields/fields.service';
import { GamesInterceptor } from './games.interceptor';

import { ClientProxy, EventPattern, MessagePattern } from '@nestjs/microservices';
import { GamesProvider } from 'src/redis/providers/games/redis.service';
import { firstValueFrom } from 'rxjs';

@UseInterceptors(new GamesInterceptor())
//@ApiSecurity('bearer')
//@ApiTags('games')
@Controller()
export class GamesController {
  constructor(
    private readonly fieldsService: FieldsService,
    private readonly clientService: ClientService,
    private readonly redisService: GamesProvider,
    @Inject('FIRESTORE_SERVICE') private client: ClientProxy
  ) {}

  //@ApiForbiddenResponse({ description: 'Forbidden.' })
  @MessagePattern({ cmd: 'all' })
  @EventPattern("all_games")
  async findAll(param: { limit, offset }) {
    const x = Date.now()
    try {
      const begin = Date.now()

      const firestoreResult = await firstValueFrom(this.client.send({ cmd: 'read_on_firestore' }, { key: `all${param.limit}:${param.offset}` }))
      if (firestoreResult != null) {

        console.log('firestore')
        const end = Date.now()
        console.log(end - begin)

        return firestoreResult.value
      } else {
        const begin = Date.now()
        console.log('not firestore')
        const result = await this.clientService.post(
          this.fieldsService.short(param.limit, param.offset),
          'games',
        );
        const mid = Date.now()
         
        console.log("Mid time", mid - begin)
        this.redisService.setOnQueue(`all${param.limit}:${param.offset}`, result);
        const end = Date.now()
        console.log("End time:", end - begin)
        //console.log()
        return result;

      }
    
 
    } catch (e) {
      console.log(e)
      const begin = Date.now()
      console.log('not firestore, esto se esta ejecutando')
      const result = await this.clientService.post(
        this.fieldsService.short(param.limit, param.offset),
        'games',
      );
       const mid = Date.now()
      console.log("Mid:",mid - begin)
      this.redisService.setOnQueue(`all${param.limit}:${param.offset}`, result);
      const end = Date.now()
      console.log('Queaue:',end - mid)
      console.log("Catch:",end - begin)
      console.log('Init:', end - x)
      return result;
    }
    
   
    
 
  }

  @MessagePattern({ cmd: 'search' })
  findByName(param: {
    name,
    genres: [],
    platforms: []
    developers: []
    publishers: []
    limit, 
    offset
  }) {
    return this.clientService.post(
      this.fieldsService.shortSearchByName(param.genres, param.name, param.developers, param.publishers, param.platforms, param.limit, param.offset),
      'games',
    );
  }

  @MessagePattern({ cmd: 'byId' })
  async findById(param: { id: number }) {
    //this.redisService.setOnQueue("games", param.id.toString());
    return await this.clientService.post(
      this.fieldsService.shortFilterById(param.id),
      'games',
    );
  }




}
