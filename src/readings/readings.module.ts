import { Module } from '@nestjs/common';
import { ReadingsController } from './readings.controller';
import { ReadingsService } from './readings.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notify } from 'src/notify/notify.entity';
import { Sensor } from 'src/sensors/sessor.entity';
import { Reading } from './reading.entity';
import { NotifyModule } from '@src/notify/notify.module';

@Module({
  imports: [TypeOrmModule.forFeature([
    Reading,
    Notify,
    Sensor
  ]),
  NotifyModule
  ],
  controllers: [ReadingsController],
  providers: [ReadingsService]
})
export class ReadingsModule {}
