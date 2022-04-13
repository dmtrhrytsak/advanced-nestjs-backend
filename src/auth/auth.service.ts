import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from '../users/users.model';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService
  ) {}

  async login(dto: CreateUserDto) {
    const user = await this.validateUser(dto);

    return this.generateToken(user);
  }

  async registration(dto: CreateUserDto) {
    const candidate = await this.userService.getUserByEmail(dto.email);

    if (candidate) {
      throw new HttpException(
        `User with the email ${dto.email} already exists`,
        HttpStatus.BAD_REQUEST
      );
    }

    const hashPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.userService.createUser({
      ...dto,
      password: hashPassword,
    });

    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { id: user.id, roles: user.roles, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      token,
    };
  }

  private async validateUser(dto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(dto.email);
    const passwordEquals = await bcrypt.compare(dto.password, user.password);

    if (!user || !passwordEquals) {
      throw new ForbiddenException({ message: 'Incorrect email or password' });
    }

    return user;
  }
}
