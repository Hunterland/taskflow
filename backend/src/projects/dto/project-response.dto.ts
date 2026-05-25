import { ApiProperty } from '@nestjs/swagger';

export class ProjectUserResponseDto {
  @ApiProperty({ example: 2 })
  id!: number;

  @ApiProperty({ example: 'Alan Barroncas' })
  name!: string;

  @ApiProperty({ example: 'alan@email.com' })
  email!: string;

  @ApiProperty({ example: 'ADMIN', enum: ['USER', 'ADMIN'] })
  role!: 'USER' | 'ADMIN';
}

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

  @ApiProperty({
    type: ProjectUserResponseDto,
    isArray: true,
    example: [
      {
        id: 2,
        name: 'Alan Barroncas',
        email: 'alan@email.com',
        role: 'ADMIN',
      },
      {
        id: 5,
        name: 'Maria Silva',
        email: 'maria@email.com',
        role: 'USER',
      },
    ],
  })
  users!: ProjectUserResponseDto[];
}
