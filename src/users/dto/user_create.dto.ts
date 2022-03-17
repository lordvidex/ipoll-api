import { IsOptional, IsString } from "class-validator";

export class UserCreateDto {
  @IsString()
  user_id: string;

  @IsOptional()
  @IsString()
  name: string;
}