import { Notify } from './notify.entity';
import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { NotifyService } from './notify.service';
import { Roles } from '@src/auth/decorator/roles.decorator';
import { Public } from '@src/auth/decorator/public.decorator';
import { CreateNotifyDto } from './dtos/create-notify.dto';
import { FilterNotifyDto } from './dtos/filter-notify.dto';
import { FilterNotifyUserDto } from './dtos/filter-notify-user.dto';
import { MultipleCreateNotifyDto } from './dtos/multiple-create-notify.dto';
import { User } from '@src/users/user.entity';

@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Roles('Admin','Supper')
  @Post()
  async create(@Body() regionData: CreateNotifyDto): Promise<Notify> {
    return this.notifyService.create(regionData);
  }

  @Roles('Admin','Supper')
  @Post('multiple-create')
  async multipleCreate(@Body() regionData: MultipleCreateNotifyDto): Promise<User[]> {
    console.log(regionData)
    return this.notifyService.multipleCreate(regionData);
  }



  @Get('/user/:id')
  @Roles('User','Admin','Supper')
  async findAllByUserId(@Param('id', ParseIntPipe) userId: number, @Query() query: FilterNotifyUserDto): Promise<Notify[]> {
    return this.notifyService.findAllByUserId(userId,query);
  }

  @Roles('User','Admin','Supper')
  @Get()
  async findAll(@Query() query: FilterNotifyDto): Promise<Notify[]> {
    return this.notifyService.findAll(query);
  }

  @Get(':id')
  @Roles('User','Admin','Supper')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Notify> {
    return this.notifyService.findOne(id);
  }

  @Put('read/:id')
  @Roles('User','Admin','Supper')
  async readed(@Param('id', ParseIntPipe) id: number): Promise<Notify> {
    return this.notifyService.read(id);
  }

  @Delete('multiple')
  @Roles('User','Admin','Supper')
  async multipleDelete(@Query('ids',new ParseArrayPipe({items:String, separator: ','})) ids: string[]) {
      return this.notifyService.multipleDelete(ids)
  }

  @Roles('User','Admin','Supper')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Notify> {
    return this.notifyService.remove(id);
  }

}
