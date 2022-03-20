import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PollOptionEntity } from 'src/database/poll-option.entity';
import { PollEntity } from 'src/database/poll.entity';
import { UserEntity } from 'src/database/user.entity';
import { Repository } from 'typeorm';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './poll.model';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(PollEntity)
    private readonly pollRepository: Repository<PollEntity>,
    @InjectRepository(PollOptionEntity)
    private readonly optionRepository: Repository<PollOptionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(poll: Poll) {
    // save the poll
    let pollEntity = new PollEntity();
    pollEntity.author = await this.userRepository.findOne(poll.author);
    pollEntity.isAnonymous = poll.anonymous;
    pollEntity.title = poll.title;
    pollEntity = await this.pollRepository.save(pollEntity); // saved

    // save it's options
    await this.optionRepository.save(
      poll.options.map((each) => {
        const optionEntity = new PollOptionEntity();
        optionEntity.poll = pollEntity;
        optionEntity.title = each;
        return optionEntity;
      }),
    ); // saved options

    return await this.pollRepository.findOne(pollEntity.id);
  }

  findAll() {
    return `This action returns all poll`;
  }

  async findOne(id: string, userId: string) {
    const poll = await this.pollRepository.findOne(id, {
      relations: ['options'],
    });
    if (!poll) {
      throw new NotFoundException('Poll does not exist');
    }
    return poll;
  }

  update(id: number, updatePollDto: UpdatePollDto) {
    return `This action updates a #${id} poll`;
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }

  async vote(
    pollId: string,
    optionId: string,
    userId: string,
  ): Promise<PollEntity> {
    const option = this.optionRepository.findOne(optionId, {
      relations: ['votes'],
    });
    const poll = this.pollRepository.findOne(pollId, {
      relations: ['participants'],
    });
    const user = this.userRepository.findOne(userId);

    const [optionEntity, pollEntity, userEntity] = await Promise.all([
      option,
      poll,
      user,
    ]);

    if (optionEntity && pollEntity && userEntity) {
      pollEntity.participants.push(userEntity);
      optionEntity.votes.push(userEntity);

      await Promise.all([
        this.optionRepository.save(optionEntity),
        this.pollRepository.save(pollEntity),
      ]);
      return await this.findOne(pollEntity.id, userEntity.id);
    } else {
      throw new NotFoundException('Poll or User or Option not found');
    }
  }
}
