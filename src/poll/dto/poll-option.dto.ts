import { IsOptional, IsString } from "class-validator";

export class PollOptionDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title: string;
}