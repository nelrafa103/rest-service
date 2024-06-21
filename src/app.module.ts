import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GamesModule } from './controllers/games/games.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TranslateService } from './services/translate/translate.service';
import { Translate } from '@google-cloud/translate/build/src/v2';
import { RedisModule } from './redis/redis.module';
import { GamesConsumer } from './redis/consumers/games/games.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
//import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    GamesModule,
    Translate,
    ConfigModule.forRoot({
      envFilePath: ['.env.dev', '.env.prod'],
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 60000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 10,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 50,
      },
    ]),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService, TranslateService],
})
export class AppModule {}
