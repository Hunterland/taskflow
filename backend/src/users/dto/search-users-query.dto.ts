
// DTO de validação para busca de usuários com termo de busca e limite opcionais
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class SearchUsersQueryDto {
  @ApiPropertyOptional({
    example: 'alan',
    description: 'Busca por nome ou e-mail',
  })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  search?: string;

  @ApiPropertyOptional({
    example: 20,
    description: 'Limite máximo de resultados',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}