import { IsArray, IsBoolean, IsOptional, IsString } from "class-validator";

export class CreatePollDto {
  @IsString()
  title: string;
  
  @IsString({each: true})
  options: string[];

  @IsOptional()
  @IsBoolean()
  anonymous?: boolean;
}
