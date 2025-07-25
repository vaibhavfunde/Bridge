import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi'; // Use `import * as Joi` if esModuleInterop is false

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { UserModule } from './user/user.module';
// import { UserModule } from './user/user.module';
import appConfig from './config/app.config';
import { MongooseModule } from '@nestjs/mongoose'; // Import MongooseModule for MongoDB connection
import { AuthModule } from './auth/auth.module';
import { LinkModule } from './link/link.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';


@Module({
  imports: [
  MongooseModule.forRoot('mongodb://127.0.0.1/URL_SHORTER_bRIDGR'),

    ConfigModule.forRoot({
      isGlobal: true,
      load :[appConfig],
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        PORT: Joi.number().default(3000),
      }),
    }),
    UserModule,
    
    AuthModule,
    
    LinkModule,

     ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 5,
        },
      ],
    }),

     CacheModule.register({
      isGlobal: true,
      ttl: 30000, 
      max: 100,
      
    }),
   
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
