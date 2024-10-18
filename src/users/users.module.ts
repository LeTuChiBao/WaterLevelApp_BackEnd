import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from 'src/regions/region.entity';
import { User } from './user.entity';
import { Role } from '@src/role/role.entity';
import { Notify } from '@src/notify/notify.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule,
    ConfigModule,
    TypeOrmModule.forFeature([
    Region,
    User,
    Role,
    Notify
  ])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule {}
