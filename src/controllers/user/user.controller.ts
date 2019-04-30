import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { UserService } from '../../services/user/user.service';
import { User } from '../../models';

@Controller('user')
export class UserController {
  
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param('id') userId: ObjectId): Promise<User> {
    return this.userService.get(userId);
  }

  @Post()
  addUser(@Body() user: User): Promise<User> {
    return this.userService.add(user);
  }

  constructor(
    private readonly userService: UserService,
  ) {}
}
