import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, HttpException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from '@src/users/user.entity';
import { Request } from "express";
import { Repository } from "typeorm";

@Injectable()
export class AuthGuard implements CanActivate{
   
    constructor(private jwtService:JwtService,
        private configService:ConfigService,
        @InjectRepository(User) private userRepository: Repository<User>,
        private reflector : Reflector
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const isPublicCheck = this.reflector.getAllAndOverride<string[]>('isPublic',[
            context.getHandler(),
            context.getClass()
        ])
        if(isPublicCheck) return true;

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request)
        if(!token) {
            throw new UnauthorizedException();
        }
        try {
            const payload = await this.jwtService.verifyAsync(token,{
                secret: this.configService.get('JWT_SECRET')
            })
            request['user_data'] = payload;
            console.log(payload);
            return true
           
        } catch (error) {
            throw new HttpException({
                status: 419,
                message: "Token Expired"
            },419)
        }
    }
    private extractTokenFromHeader(request:Request):string|undefined {
        const[type, token ] = request.headers.authorization?.split(' ')??[];

        return type === 'Bearer' ? token : undefined
    }
}