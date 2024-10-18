import { Body, Controller, Get, Post } from '@nestjs/common';
import { Role } from './role.entity';
import { RoleService } from './role.service';
import { Public } from '@src/auth/decorator/public.decorator';
import { CreateRoleDto } from './dtos/create-role.dto';
import { Roles } from '@src/auth/decorator/roles.decorator';

@Controller('roles')
export class RoleController {

    constructor(private roleService: RoleService){}

    @Post()
    @Roles('Supper')
    createRole(@Body() body:CreateRoleDto): Promise<Role> {
      return this,this.roleService.create(body.name);
    }

    @Get()
    @Roles('Supper','Admin')
    findAll():Promise<Role[]> {
      return this.roleService.findAll()
    }
}