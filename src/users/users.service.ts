import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AddRoleDto } from 'src/roles/dto/add-role.dto';
import { BanUserDto } from 'src/roles/dto/ban-user.dto';
import { RolesService } from 'src/roles/roles.service';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './users.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private rolesService: RolesService
  ) {}

  async createUser(dto: CreateUserDto) {
    const user = await this.userRepository.create(dto);
    const role = await this.rolesService.getRoleByValue('ADMIN');

    await user.$set('roles', [role.id]);

    user.roles = [role];

    return user;
  }

  async getAllUsers() {
    const users = await this.userRepository.findAll({ include: { all: true } });

    return users;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: { all: true },
    });

    return user;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.rolesService.getRoleByValue(dto.value);

    if (!role || !user) {
      throw new BadRequestException({ message: "User or role wasn't found" });
    }

    await user.$add('role', role.id);
  }

  async ban(dto: BanUserDto) {
    const user = await this.userRepository.findByPk(dto.userId);

    if (!user) {
      throw new BadRequestException({ message: "User wasn't found" });
    }

    user.isBanned = true;
    user.banReason = dto.banReason;

    await user.save();

    return user;
  }
}
