import { Module } from '@nestjs/common';
import { GamesProvider } from './providers/games/redis.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { createClient } from 'redis';
import { BullModule } from '@nestjs/bull';
import { GamesConsumer } from './consumers/games/games.service';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

const FirestoreService = {
		provide: 'FIRESTORE_SERVICE',
		inject: [ConfigService],
		useFactory: (configService: ConfigService) => {
			return ClientProxyFactory.create({
				transport: Transport.TCP,
				options: {
					host: 'firestore-service',
					port: 3000,
				},
			});
		},
	}

@Module({
	imports: [ConfigModule, BullModule.registerQueue({
		name: 'games',
		prefix: 'crowbar',
		redis: {
			password: 'HYSuQGLjPaT5Vpy9GzNgmbWA4UzbU4b5',
			host: 'redis-19325.c240.us-east-1-3.ec2.redns.redis-cloud.com',
			port: 19325,
		},
	})],
	providers: [GamesProvider, GamesConsumer, FirestoreService],
	exports: [GamesProvider, GamesConsumer, FirestoreService]
})

export class RedisModule {}


