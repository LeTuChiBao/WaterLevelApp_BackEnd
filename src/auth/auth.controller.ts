import { AuthService } from './auth.service';
import { Controller, Post, Body, UsePipes, ValidationPipe, SetMetadata } from '@nestjs/common';
import { RegisterUserDto } from './dtos/register-user.dto';
import { User } from '@src/users/user.entity';
import { LoginUserDto } from './dtos/login-user.dto';
import { Public } from './decorator/public.decorator';

@Controller('auth')
export class AuthController {

    constructor(private authService:AuthService){}

    @Post('register')
    @Public()
    register(@Body() registerUserDto:RegisterUserDto):Promise<User> {
        return this.authService.register(registerUserDto);
    }

    @Post('login')
    @Public()
    login(@Body() loginUserDto:LoginUserDto): Promise<any> {
        return this.authService.login(loginUserDto);
    }

    @Post('refresh-token')
    @Public()
    refreshToken(@Body() {refresh_token}):Promise<any> {
        return this.authService.refreshToken(refresh_token);
    }

}