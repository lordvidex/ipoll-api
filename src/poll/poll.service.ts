import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PollOptionEntity } from 'src/poll/entities/poll-option.entity';
import { PollEntity } from './entities/poll.entity';
import { UserEntity } from '../users/user.entity';
import { Repository } from 'typeorm';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './poll.model';
import { OptionVotersDto } from './dto/option-voters.dto';

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

  async create(poll: Poll, userId: string) {
    // save the poll
    let pollEntity = new PollEntity();
    pollEntity.author = await this.userRepository.findOne(poll.author);
    pollEntity.isAnonymous = poll.anonymous;
    pollEntity.title = poll.title;
    pollEntity.hasTimeLimit = poll.hasTime;
    if (poll.hasTime) {
      pollEntity.startTime = new Date(poll.startTime);
      pollEntity.endTime = poll.endTime == null ? null : new Date(poll.endTime);
    }
    pollEntity = await this.pollRepository.save(pollEntity); // saved

    // save it's options
    await this.optionRepository.save(
      poll.options.map((each) => {
        const optionEntity = new PollOptionEntity();
        optionEntity.poll = pollEntity;
        optionEntity.title = each.title;
        return optionEntity;
      }),
    ); // saved options

    return await this.findOne(pollEntity.id, userId);
  }

  findAll() {
    return `This action returns all poll`;
  }

  async findOne(id: string, userId: string) {
    const poll = await this.pollRepository
      .createQueryBuilder('poll')
      .where('poll.id=:id', { id })
      .innerJoinAndSelect('poll.author', 'author')
      .innerJoinAndSelect('poll.options', 'options')
      .getOne();

    if (!poll) {
      throw new NotFoundException('Poll does not exist');
    }
    return poll;
  }

  async getOptionDetails(
    pollId: string,
    optionId: string,
    userId: string,
  ): Promise<OptionVotersDto> {
    const poll = await this.pollRepository.findOne(pollId);
    const option = await this.optionRepository.findOne(optionId, {
      relations: ['votes'],
    });
    if (poll.isAnonymous) {
      option.votes = [];
    }
    console.log(option);
    return {
      id: option.id,
      title: option.title,
      votes: option.votes.map((user) => {
        return {
          id: user.id ?? 'id',
          name: user.name ?? 'Anonymous',
        };
      }),
      pollId: poll.id,
      votesId: option.votesId,
    };
  }

  async update(id: string, userId: string, updatePollDto: UpdatePollDto) {
    const poll = await this.findOne(id, userId);
    const { anonymous, endTime, hasTime, options, title } = updatePollDto;
    poll.isAnonymous = anonymous ?? poll.isAnonymous;
    poll.hasTimeLimit = hasTime ?? poll.hasTimeLimit;
    if (hasTime && endTime == null) {
      throw new BadRequestException('endTime must be provided if hasTimeLimit');
    }
    if (hasTime) {
      poll.endTime =
        (endTime == null ? null : new Date(endTime)) ?? poll.endTime;
    }

    poll.title = title ?? poll.title;
    await this.pollRepository.save(poll); // save poll

    const result = await Promise.all(
      options.map(async (option) => {
        const opt =
          (await this.optionRepository.findOne(option.id)) ??
          new PollOptionEntity();
        opt.title = option.title;
        opt.poll = poll;
        return opt;
      }),
    );
    await this.optionRepository.save(result); // save it's options
    return await this.findOne(id, userId); // return
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
      // check if the poll has expired
      if (
        pollEntity.hasTimeLimit &&
        pollEntity.endTime != null &&
        new Date() >= pollEntity.endTime
      ) {
        throw new NotAcceptableException(
          'Vote cannot be counted because Poll has expired',
        );
      }

      const query = userEntity.participatedPolls.find(
        (poll) => poll.id === pollEntity.id,
      );
      if (query) {
        // user has voted already
        throw new NotAcceptableException('User has already voted');
      }

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
