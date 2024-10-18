import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector : Reflector
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const requireRoles = this.reflector.getAllAndOverride<string[]>('roles',[
            context.getHandler(),
            context.getClass()
        ])
        if(!requireRoles) return true
        const {user_data} = context.switchToHttp().getRequest()

        console.log("Role guard: ", requireRoles, user_data)
        return requireRoles.some(role=> user_data.roles.split(',').includes(role))
    }

}