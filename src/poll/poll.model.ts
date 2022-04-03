import { CreatePollDto } from './dto/create-poll.dto';

export class Poll extends CreatePollDto {
  author: string;

  constructor(createDto: CreatePollDto, author: string) {
    super();
    this.author = author;
    this.options = createDto.options;
    this.title = createDto.title;
    this.anonymous = createDto.anonymous;
    this.hasTime = createDto.hasTime;
    this.startTime = createDto.startTime;
    this.endTime = createDto.endTime;
  }
}
