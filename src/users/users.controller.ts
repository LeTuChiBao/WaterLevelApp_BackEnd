import { storageConfig } from '@src/helpers/config';
import { Controller, Get,Post, Body, Param, ValidationPipe,UsePipes, Put, Delete, Query, Req, UploadedFile, UseInterceptors, BadRequestException, ParseArrayPipe, SetMetadata, ParseIntPipe } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FilterUserDto } from './dtos/filter-usser.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { Roles } from '@src/auth/decorator/roles.decorator';


@Controller('users')
export class UsersController {

    constructor(
        private userService: UsersService
    ){}

    @Get()
    @Roles('Admin','User','Supper')
    findAll(@Query() query: FilterUserDto): Promise<User[]> {
        return this.userService.findAll(query)
    }

    @Get('profile')
    @Roles('Admin','User','Supper')
    profile(@Req() req:any):Promise<User>{
        return this.userService.findOne(Number(req.user_data.id))
    }


    @Get(':id')
    @Roles('Admin','User','Supper')
    findOne(@Param('id') id:string):Promise<User> {
        return this.userService.findOne(Number(id))
    }

    @Post()
    @Roles('Admin','User','Supper')
    @UsePipes(ValidationPipe)
    create(@Body() createUserDto:CreateUserDto): Promise<User>{
        return this.userService.create(createUserDto)
    }

    @Put(':id')
    @Roles('Admin','User','Supper')
    update(@Param('id', ParseIntPipe) id:number, @Body() updateUserDto : UpdateUserDto) {
        return this.userService.update(id,updateUserDto)
    }

    @Delete('multiple')
    @Roles('Admin','Supper')
    multipleDelete(@Query('ids',new ParseArrayPipe({items:String, separator: ','})) ids: string[]) {
        return this.userService.multipleDelete(ids)
    }

    @Delete(':id')
    @Roles('Admin','Supper')
    delete(@Param('id', ParseIntPipe) id:number) {
        return this.userService.delete(id)
    }


    @Post('upload-avatar')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: storageConfig('avatar'),
        fileFilter: (req, file ,cb) => {
            const ext = extname(file.originalname);
            const allowedExt = ['.jpg', '.png', '.jpeg']
            if(!allowedExt.includes(ext)){
                req.fileValidationError = `Wrong extension type. Accepted file ext are : ${allowedExt.toString()} `
                cb(null,false)
            }else{
                const filesize = parseInt(req.headers['content-length']);
                if(filesize > 1024 * 1024 * 5){
                    req.fileValidationError =  `Your file size is too large ${filesize.toString()}. Accepted file size is less than 5MB`;
                    cb(null,false)
                }else{
                    cb(null,true)
                }

            }
        }

    }))
    uploadAvata(@Req() req:any, @UploadedFile() file:Express.Multer.File){
        if(req.fileValidationError)  throw new BadRequestException(req.fileValidationError)
        if(!file) throw new BadRequestException('File is require')
        console.log(file)
        return this.userService.updataAvatar(req.user_data.id, file.fieldname+'/'+file.filename)
   
    }

}