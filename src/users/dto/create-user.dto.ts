import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'email@gmail.com', description: 'Email address' })
  @IsString()
  @IsEmail()
  readonly email: string;

  @ApiProperty({ example: 'password123', description: 'Password' })
  @Length(4, 16)
  readonly password: string;
}
