import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInstance,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { PollOptionDto } from './poll-option.dto';

export class CreatePollDto {
  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  options: PollOptionDto[];

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsBoolean()
  hasTime: boolean;

  @ValidateIf((obj) => obj.hasTime)
  @IsDateString()
  startTime?: string;

  @ValidateIf((obj) => obj.hasTime)
  @IsDateString()
  endTime?: string;
}
