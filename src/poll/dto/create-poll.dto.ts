import { IsBoolean, IsDateString, IsOptional, IsString, ValidateIf } from "class-validator";

export class CreatePollDto {
  @IsString()
  title: string;
  
  @IsString({each: true})
  options: string[];

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;

  @IsBoolean()
  hasTime: boolean;

  @ValidateIf(obj => obj.hasTime)
  @IsDateString()
  startTime?: string;

  @ValidateIf(obj => obj.hasTime)
  @IsDateString()
  endTime?: string;

}
