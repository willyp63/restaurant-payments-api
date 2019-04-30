import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { UserService } from '../../services/user/user.service';
import { User } from 'models';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post()
  addUser(@Body() user: User): Promise<User> {
    return this.userService.add(user);
  }

  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  getUserById(@Param('id') userId: ObjectId): Promise<User> {
    return this.userService.get(userId);
  }
}
