import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, In, Like, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcrypt'
import { UpdateUserDto } from './dtos/update-user.dto';
import { FilterUserDto } from './dtos/filter-usser.dto';
import { Role } from '@src/role/role.entity';
import { Region } from '@src/regions/region.entity';

@Injectable()
export class UsersService {
    constructor(
      @InjectRepository(User) private userRepository:Repository<User>,
      @InjectRepository(Role) private roleRepository:Repository<Role>,
      @InjectRepository(Region) private regionRepository:Repository<Region>,
    ){}

    async findAll(query: FilterUserDto):Promise<any> {
      const limit = Number(query.limit) || 10 ;
      const page = Number(query.page) || 1;
      const skip = (page -1)* limit
      const keyword = query.search || ''
      const [res,total] =  await this.userRepository.findAndCount({
          where: [
              {firstName: Like('%'+ keyword+'%')},
              {lastName: Like('%'+ keyword+ '%')},
              {email: Like('%'+ keyword+ '%')},
          ],
          relations: {
              role:true,
              region: true
          },
          order: {created_at: "DESC"},
          take : limit,
          skip : skip,
          select: ['id', 'firstName', 'lastName','email','status','created_at','updated_at']
      })

      const lastPage = Math.ceil(total/limit);
      const nextPage = page + 1 > lastPage ? null : page + 1;
      const prevPage = page - 1 < 1 ? null : page -1;

      return {
          data : res,
          total : total,
          currentPage : page,
          nextPage,
          prevPage,
          lastPage
      }
    }

    async findOne(id:number):Promise<User> {
      let user = await this.userRepository.findOne({
        where: {id},
        relations: {
          role: true,
          region: true
        },
        select: ['id', 'firstName', 'lastName','email','status','avatar','created_at','updated_at']
      });
      if(!user) {
        throw new BadRequestException ('User id not found');
      }
      return user;
    }

    async create(createUserDto:CreateUserDto):Promise<User> {
      const emailCheck = await this.userRepository.findOneBy({email: createUserDto?.email})
      if(emailCheck) {
        throw new BadRequestException ('Email is Exits');
      }

      const checkRole = await this.roleRepository.findOneBy({id : createUserDto.roleId})
      if (!checkRole) throw new BadRequestException('Role id not found')
      
      const checkRegion = await this.regionRepository.findOneBy({id : createUserDto.regionId})
      if (!checkRegion) throw new BadRequestException('Region id not found')
      
      const hassPassword = await this.hassPassword(createUserDto.password)
      const createUser = await this.userRepository.create({...createUserDto,password: hassPassword, role: checkRole, region: checkRegion});
      console.log(createUser)

      return await this.userRepository.save(createUser);
    }

    async update(id:number ,updateUserDto:UpdateUserDto): Promise<User> {
      let user = await this.userRepository.findOneBy({id});
      if(!user) {
        throw new BadRequestException ('User id not found');
      }

      if(updateUserDto.roleId) {
        const checkRole = await this.roleRepository.findOneBy({id : updateUserDto.roleId})
        if (!checkRole) throw new BadRequestException('Role id not found')
        user.role = checkRole
      }
      
      
      if(updateUserDto.regionId) {
        const checkRegion = await this.regionRepository.findOneBy({id : updateUserDto.regionId})
        if (!checkRegion) throw new BadRequestException('Region id not found')
        user.region = checkRegion
      }
      Object.assign(user,updateUserDto);

      return await this.userRepository.save(user);
    }

    async delete(id:number):Promise<any> {
      let user = await this.userRepository.findOneBy({id});
      if(!user) throw new HttpException('Not Found',HttpStatus.NOT_FOUND)

      await this.userRepository.remove(user);

      return { status: 'Success',action: 'Delete User', user: user };
    }

    async updataAvatar(id: number , avatar:string): Promise<User>{
      let user = await this.userRepository.findOneBy({id});
      if(!user) {
        throw new BadRequestException ('User id not found');
      }
      Object.assign(user, {avatar})
      return await this.userRepository.save(user);
    }

    private async hassPassword(password:string): Promise<string> {
      const saltRound = 10;
      const salt = await bcrypt.genSalt(saltRound);
      const hash = await bcrypt.hash(password, salt)

      return hash
    }

    async multipleDelete(ids: string[]): Promise<any>{
      const users = await this.userRepository.findBy({ id: In(ids) });
      if (users.length !== ids.length) {
        throw new BadRequestException('Some User IDs not found');
      }
        return await this.userRepository.remove(users);
    }

}