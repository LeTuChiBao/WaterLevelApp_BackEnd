import { Injectable } from '@nestjs/common';
import { Role } from './role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from '@src/auth/decorator/roles.decorator';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) private roleRepository: Repository<Role> ){}

    @Roles('Supper')
    async create(name: string): Promise<Role> {
      return await this.roleRepository.save({name});

    }

    async findAll():Promise<Role[]>{
      return await this.roleRepository.find();
    }
}