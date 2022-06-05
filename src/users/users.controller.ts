import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../poll/auth.guard';
import { UserCreateDto } from './dto/user_create.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async registerUser(@Body() createDto: UserCreateDto) {
    return await this.usersService.registerUser(createDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@Headers('user_id') userId: string) {
    return await this.usersService.loginUser(userId);
  }
}
