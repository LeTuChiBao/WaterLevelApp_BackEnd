import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { RegionsService } from './regions.service';
import { Region } from './region.entity';
import { CreateRegionDto } from './dtos/create-region.dto';
import { Public } from '@src/auth/decorator/public.decorator';
import { UpdateRegionDto } from './dtos/update-region.dto';
import { Roles } from '@src/auth/decorator/roles.decorator';
import { FilterRegionDto } from './dtos/filter-region.dto';


@Controller('regions')
export class RegionsController {

  constructor(private readonly regionService: RegionsService) {}

  @Roles('User','Admin','Supper')
  @Post()
  async create(@Body() regionData: CreateRegionDto): Promise<Region> {
    return this.regionService.create(regionData);
  }

  @Get()
  @Public()
  async findAll(): Promise<Region[]> {
    return this.regionService.findAll();
  }

  @Roles('User','Admin','Supper')
  @Get('/params')
  async findAllParams(@Query() query: FilterRegionDto): Promise<Region[]> {
    return this.regionService.findAllParams(query);
  }

  @Get(':id')
  @Roles('User','Admin','Supper')
  async findOne(@Param('id',ParseIntPipe) id: number): Promise<Region> {
    return this.regionService.findOne(id);
  }

  @Roles('User','Admin','Supper')
  @Put(':id')
  async update(@Param('id',ParseIntPipe) id: number, @Body() regionData: UpdateRegionDto): Promise<Region> {
    return this.regionService.update(id, regionData);
  }

  @Delete('multiple')
  @Roles('User','Admin','Supper')
  multipleDelete(@Query('ids',new ParseArrayPipe({items:String, separator: ','})) ids: string[]) {
      return this.regionService.multipleDelete(ids)
  }

  @Roles('User','Admin','Supper')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Region> {
    return this.regionService.remove(id);
  }
}
