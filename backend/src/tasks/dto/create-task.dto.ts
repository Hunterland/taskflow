import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class CreateTaskDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsNumber()
  projectId: number;  // ← ADICIONE

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  assigneeId?: number;

  @ApiProperty()
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
