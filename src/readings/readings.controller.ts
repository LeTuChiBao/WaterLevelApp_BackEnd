import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ReadingsService } from './readings.service';
import { Roles } from '@src/auth/decorator/roles.decorator';
import { CreateReadingDto } from './dtos/create-reading.dto';
import { Reading } from './reading.entity';
import { FilterReadingDto } from './dtos/filter-reading.dto';
import { UpdateReadingDto } from './dtos/update-reading.dto';


@Controller('readings')
export class ReadingsController {

  constructor(private readonly readingService: ReadingsService){}

  @Roles('Admin','Supper')
  @Post()
  async create(@Body() regionData: CreateReadingDto): Promise<Reading> {
    return this.readingService.create(regionData);
  }

  @Roles('User','Admin','Supper')
  @Get('date/:date')
  getReadingsByDate(@Param('date') date: string) {
    console.log(date)
    return this.readingService.getReadingsByDate(date);
  }

  @Roles('User','Admin','Supper')
  @Get('/params')
  async findAllParams(@Query() query: FilterReadingDto): Promise<Reading[]> {
    return this.readingService.findAllParams(query);
  }



  @Get()
  @Roles('User','Admin','Supper')
  async findAll(): Promise<Reading[]> {
    return this.readingService.findAll();
  }

  @Roles('User','Admin','Supper')
  @Get('/sensor/:id')
  async findBySensorId(@Param('id', ParseIntPipe) id: number): Promise<Reading[]> {
    console.log(id)
    return this.readingService.findBySensorId(id);
  }

  @Get(':id')
  @Roles('User','Admin','Supper')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Reading> {
    return this.readingService.findOne(id);
  }

  @Roles('User','Admin','Supper')
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() regionData: UpdateReadingDto): Promise<Reading> {
    return this.readingService.update(id, regionData);
  }
  @Delete('multiple')
  @Roles('Admin','Supper')
  multipleDelete(@Query('ids',new ParseArrayPipe({items:String, separator: ','})) ids: string[]) {
      return this.readingService.multipleDelete(ids)
  }

  @Roles('Admin','Supper')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Reading> {
    return this.readingService.remove(id);
  }
}
