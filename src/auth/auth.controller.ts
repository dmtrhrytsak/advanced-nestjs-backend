import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authSerivce: AuthService) {}

  @Post('/login')
  login(@Body() dto: CreateUserDto) {
    return this.authSerivce.login(dto);
  }

  @Post('/registration')
  registration(@Body() dto: CreateUserDto) {
    return this.authSerivce.registration(dto);
  }
}
