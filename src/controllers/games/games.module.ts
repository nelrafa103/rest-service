import { Module } from '@nestjs/common';
import { GamesController } from './games.controller';
import { HttpModule } from '@nestjs/axios';
import { FieldsService } from 'src/services/fields/fields.service';
import { ClientService } from 'src/services/client/client.service';
import { TranslateService } from 'src/services/translate/translate.service';
import { Translate } from '@google-cloud/translate/build/src/v2';
import { RedisModule } from 'src/redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [HttpModule, Translate, RedisModule, CacheModule.register()],
  providers: [FieldsService, ClientService, TranslateService],
  controllers: [GamesController],
  exports: [FieldsService],
})
export class GamesModule {}
