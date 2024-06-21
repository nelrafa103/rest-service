//import tracer from './tracer';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs'
/*import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AuthGuard } from './app.guard'; */
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  /* await tracer.start();
   const app = await NestFactory.create<NestFastifyApplication>(
     AppModule,
     new FastifyAdapter(),
   );
   app.useGlobalGuards(new AuthGuard());
 
   app.enableCors();
   const config = new DocumentBuilder()
     .setTitle('List all games')
     .setDescription('List the games with this fields: ')
     .setVersion('1.0')
     .addTag('games')
     .build();
   const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api', app, document);
   app.connectMicroservice({
     transport: Transport.TCP,
     options: {
       port: 3001,
     },
   }); */
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
      /*  tlsOptions: {
          cert: fs.readFileSync(join(__dirname,'../ca.pem')),
          key: fs.readFileSync(join(__dirname,'../key.pem'))
        }, */
        host: '0.0.0.0',
        port: 3000,
      },
    },
  );
  await app.listen();
}
bootstrap();
