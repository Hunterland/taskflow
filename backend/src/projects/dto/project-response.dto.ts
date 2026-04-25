import { ApiProperty } from '@nestjs/swagger';

export class ProjectResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Taskflow MVP' })
  name!: string;

  @ApiProperty({
    example: 'Sistema de gerenciamento de tarefas do projeto',
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ example: 7 })
  ownerId!: number;

  @ApiProperty({ example: '2026-04-25T12:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-04-25T12:00:00.000Z' })
  updatedAt!: Date;
}