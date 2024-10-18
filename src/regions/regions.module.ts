import { Module } from '@nestjs/common';
import { RegionsController } from './regions.controller';
import { RegionsService } from './regions.service';
import { User } from 'src/users/user.entity';
import { Sensor } from 'src/sensors/sessor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from './region.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JwtModule,
    ConfigModule,
    TypeOrmModule.forFeature([
      Region,
      User,
      Sensor
    ])
  ],  
  controllers: [RegionsController],
  providers: [RegionsService]
})
export class RegionsModule {}
