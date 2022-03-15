import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { PollService } from './poll.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll } from './poll.model';

@Controller('poll')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post()
  async create(@Body() createDto: CreatePollDto, @Headers('user_id') userId: string) {
    const poll = new Poll(createDto, userId)
    return await this.pollService.create(poll);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.pollService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
   
  }
}
