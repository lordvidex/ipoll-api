import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PollOptionEntity } from 'src/database/poll-option.entity';
import { PollEntity } from 'src/database/poll.entity';
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
    private readonly optionRepo: Repository<PollOptionEntity>,
  ) {}

  async create(poll: Poll) {
    // save the poll
    let pollEntity = new PollEntity()
    pollEntity.author = poll.author
    pollEntity.isAnonymous = poll.anonymous 
    pollEntity.title = poll.title
    pollEntity = await this.pollRepository.save(pollEntity)

    // save it's options
    await this.optionRepo.save(poll.options.map((each) => {
      let optionEntity = new PollOptionEntity()
      optionEntity.poll = pollEntity
      optionEntity.title = each
      return optionEntity
    }))

    return await this.pollRepository.findOne(pollEntity.id)
  }

  findAll() {
    return `This action returns all poll`;
  }

  async findOne(id: string) {
    const poll = await this.pollRepository.findOne(id, {relations: ['options']})
    if (!poll) {
      throw new NotFoundException('Poll does not exist')
    }
    return poll
  }

  update(id: number, updatePollDto: UpdatePollDto) {
    return `This action updates a #${id} poll`;
  }

  remove(id: number) {
    return `This action removes a #${id} poll`;
  }

  async getPoll(id: number) {
    return await this.pollRepository.findOne(id);
  }
}
