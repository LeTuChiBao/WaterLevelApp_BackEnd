import { IsEmail } from 'class-validator';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from './dtos/register-user.dto';
import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@src/users/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { LoginUserDto } from './dtos/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Role } from '@src/role/role.entity';
import { Region } from '@src/regions/region.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository:Repository<User>,
        @InjectRepository(Role) private roleRepository:Repository<Role>,
        @InjectRepository(Region) private regionRepository:Repository<Region>,
        private jwtService:JwtService,
        private configService:ConfigService
    ){}

    async register(registerUserDto:RegisterUserDto):Promise<any>{
        const region = await this.regionRepository.findOneBy({id: registerUserDto.regionId})
        if(!region){
          throw new BadRequestException('Register Fail: Region not found')
        }

        let user = await this.userRepository.findOne({where: {email : registerUserDto.email}})
        if(!user){
            let role = await this.roleRepository.findOneBy({id: 1})
            const hassPassword = await this.hassPassword(registerUserDto.password);

            const res = await this.userRepository.save({
              ...registerUserDto, password: hassPassword,role: role , region: region
            });
            const payload = {id: res.id, email: res.email, roles: res.role.name};
            
            return await this.generateToken(payload);
        }else {
            throw new HttpException("Email is already exist", HttpStatus.BAD_REQUEST);
        }
    } 

    async login(loginUserDto:LoginUserDto):Promise<any>{
        const user = await this.userRepository.findOne({
            where : {email: loginUserDto.email},
            relations: {
                role:true,
                region: true
            },
            select: {
                role : {
                    id: true,
                    name: true
                },
                region : {
                  id: true,
                  ward: true,
                  district: true,
                  damage_level: true
                }
            }
        })
        if(!user) {
            throw new HttpException("Email is not exist", HttpStatus.BAD_REQUEST);
        }
        const checkPass = bcrypt.compareSync(loginUserDto.password, user.password);
        if(!checkPass){
            throw new HttpException("Password is not correct", HttpStatus.BAD_REQUEST);
        }
        // genarate access token and refresh token
        const payload = {id: user.id, email: user.email, roles: user.role.name};
        console.log(payload)
        return await this.generateToken(payload);
    }

    async refreshToken(refresh_token: string ): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token,{
                secret:this.configService.get<string>('JWT_SECRET')
            })
            const checkExitToken = await this.userRepository.findOneBy({email: verify.email, refresh_token})
            if(checkExitToken){
                return this.generateToken({id: verify.id, email: verify.email, roles: verify.roles})
            }else {
                throw new HttpException('Refresh token is not valid',HttpStatus.BAD_REQUEST)
            }

        } catch (error) {
            throw new HttpException('Refresh token is not valid', HttpStatus.BAD_REQUEST)
        }
    }

    private async generateToken(payload: {id:number, email:string, roles:string}){
        const access_token = await this.jwtService.sign(payload, {
          expiresIn: '30m'
        });
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('EX_IN_REFRESH_TOKEN')
        });

        await this.userRepository.update(
            {email: payload.email},
            {refresh_token: refresh_token}
        
        )
        return {access_token : `Bearer ${access_token}`, refresh_token}
    }

    private async hassPassword(password:string): Promise<string> {
        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const hash = await bcrypt.hash(password, salt)

        return hash
    }

  
   
}