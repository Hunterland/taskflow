import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class QueryTasksDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar tasks por projeto',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  projectId?: number;

  @ApiPropertyOptional({
    example: 12,
    description: 'Filtrar tasks por responsável',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  assigneeId?: number;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: 'Filtrar tasks por status',
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}
