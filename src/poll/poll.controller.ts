import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './poll.model';
import { AuthGuard } from './auth.guard';

@Controller('poll')
@UseGuards(AuthGuard)
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  async create(
    @Body() createDto: CreatePollDto,
    @Headers('user_id') userId: string,
  ) {
    const poll = new Poll(createDto, userId);
    return await this.pollService.create(poll);
  }

  @Post(':id/:optionId')
  async vote(
    @Param('id') pollId: string,
    @Param('optionId') optionId: string,
    @Headers('user_id') userId: string,
  ) {
    return await this.pollService.vote(pollId, optionId, userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Headers('user_id') userId: string) {
    return await this.pollService.findOne(id, userId);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {}

  // @Delete(':id')
  // remove(@Param('id') id: string) {}
}
