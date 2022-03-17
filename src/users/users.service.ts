import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/database/user.entity';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user_create.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async registerUser(createDto: UserCreateDto) {
    // try to login i.e. if user already exists before
    const result = await this.findUser(createDto.user_id);
    if (result) {
      throw new ConflictException('User already exists')
    } else {
      // create a new user
      let userEntity = new UserEntity();
      userEntity.id = createDto.user_id;
      userEntity.name = createDto.name;
      userEntity = await this.userRepository.save(userEntity);
      return await this.findUser(userEntity.id);
    }
  }

  async loginUser(id: string): Promise<UserEntity> {
    const user = await this.findUser(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    } else {
      return user;
    }
  }

  private async findUser(id: string): Promise<UserEntity> {
    return this.userRepository.findOne(id);
  }
}
