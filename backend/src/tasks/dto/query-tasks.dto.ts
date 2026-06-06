import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { TaskStatus } from '@prisma/client';

export class QueryTasksDto {
  @ApiPropertyOptional({
    example: 1,
    description: 'Filtrar tasks por ID do projeto',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  projectId?: number;

  @ApiPropertyOptional({
    example: 12,
    description: 'Filtrar tasks por ID do responsável',
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
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
