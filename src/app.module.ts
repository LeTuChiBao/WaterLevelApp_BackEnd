
import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RegionsModule } from './regions/regions.module';
import { SensorsModule } from './sensors/sensors.module';
import { ReadingsModule } from './readings/readings.module';
import { NotifyModule } from './notify/notify.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { getDbOptions } from '../db/db-option';
import { RoleModule } from './role/role.module';
import { AuthGuard } from './auth/auth.guard';
import { RolesGuard } from './auth/roles.guard';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => getDbOptions(configService),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RegionsModule,
    SensorsModule,
    ReadingsModule,
    NotifyModule,
    RoleModule,
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: APP_PIPE,
      useValue:  new ValidationPipe({
        whitelist: true, //loại bỏ các trường không có trong dto
        forbidNonWhitelisted: true //Phần này để thông báo lỗi khi trường ko có trong dto
      })
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],
})
export class AppModule {}
