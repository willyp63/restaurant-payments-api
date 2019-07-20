import { Controller, Post, Body, Get, Param, BadRequestException } from '@nestjs/common';
import { ObjectId } from 'mongodb';

import { UserService } from '../../services/user/user.service';
import { User, Table } from '../../models';
import { ROUTE_NAMES } from '../../constants/route-names.constants';

@Controller(ROUTE_NAMES.Users)
export class UserController {
  @Get()
  getAllUsers(): Promise<User[]> {
    return this.userService.getAll();
  }

  @Get(':id')
  getUser(@Param('id') userId: ObjectId): Promise<User> {
    return this.userService.get(userId).then(user => {
      if (!user) { throw new BadRequestException('Invalid user'); }
      return user;
    });
  }

  @Get(`:id/${ROUTE_NAMES.Tables}`)
  getPastTablesForUser(@Param('id') userId: ObjectId): Promise<Table[]> {
    return this.userService.getPastTablesForUser(userId);
  }

  @Post()
  addUser(@Body() user: User): Promise<User> {
    return this.userService.add(user);
  }

  @Post('/login')
  async loginUser(@Body() user: Partial<User>): Promise<User> {
    const loggedInUser = await this.userService.getByEmailAndPassword(user.email, user.password);

    if (!loggedInUser) {
      throw new BadRequestException('Invalid credentials');
    }
    return loggedInUser;
  }

  constructor(
    private readonly userService: UserService,
  ) {}
}
