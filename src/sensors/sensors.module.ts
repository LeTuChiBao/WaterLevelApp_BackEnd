import { Module } from '@nestjs/common';
import { SensorsController } from './sensors.controller';
import { SensorsService } from './sensors.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Region } from 'src/regions/region.entity';
import { Reading } from 'src/readings/reading.entity';
import { Sensor } from './sessor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Sensor,
    Region,
    Reading
  ])],
  controllers: [SensorsController],
  providers: [SensorsService]
})
export class SensorsModule {}
