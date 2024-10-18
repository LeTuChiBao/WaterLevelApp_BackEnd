import { Controller, Get, Param, ParseIntPipe, Body, Put, Post, Delete, Query, ParseArrayPipe } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { Sensor } from './sessor.entity';
import { Roles } from '@src/auth/decorator/roles.decorator';
import { UpdateSensorDto } from './dtos/update-sensor.dto';
import { CreateSensorDto } from './dtos/create-sessor.dto';
import { FilterSensorDto } from './dtos/filter-sensor.dto';

@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService){}

  @Get()
  @Roles('User','Admin','Supper')
  async findAll(@Query() query: FilterSensorDto): Promise<Sensor[]> {
    return await this.sensorsService.findAll(query);
  }

  @Get(':id')
  @Roles('User','Admin','Supper')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Sensor> {
    return await this.sensorsService.findOne(id);
  }

  @Post()
  @Roles('User','Admin','Supper')
  async create(@Body() bodyUpdate: CreateSensorDto): Promise<Sensor> {
    return await this.sensorsService.create(bodyUpdate);
  }

  @Put(':id')
  @Roles('User','Admin','Supper')
  async update(@Param('id', ParseIntPipe) id: number, @Body() bodyUpdate: UpdateSensorDto): Promise<Sensor> {
    return await this.sensorsService.update(id,bodyUpdate);
  }
  @Delete('multiple')
  @Roles('User','Admin','Supper')
  multipleDelete(@Query('ids', new ParseArrayPipe({ items: String, separator: ',' })) ids: string[]) {
    console.log("IDs:", ids);  // Kiểm tra xem mảng ids có đúng định dạng không
    return this.sensorsService.multipleDelete(ids);
  }

  @Delete(':id')
  @Roles('User','Admin','Supper')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<Sensor> {
    return await this.sensorsService.delete(id);
  }



}
