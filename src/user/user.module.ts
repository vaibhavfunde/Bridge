import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from './schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports:[MongooseModule.forFeature([{
      name:User.name,
      schema:UserSchema
    }
  ]),
  PassportModule,
  JwtModule.register({}),
     ThrottlerModule.forRoot({
        throttlers: [
          {
            ttl: 60000,
            limit: 5,
          },
        ],
      }),
],
  controllers: [UserController],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
