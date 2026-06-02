import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus, UserRole } from '@prisma/client';

export class TaskProjectResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Taskflow MVP' })
  name!: string;

  @ApiProperty({ example: 7 })
  ownerId!: number;
}

export class TaskAssigneeResponseDto {
  @ApiProperty({ example: 12 })
  id!: number;

  @ApiProperty({ example: 'Maria Silva' })
  name!: string;

  @ApiProperty({ example: 'maria@email.com' })
  email!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.USER })
  role!: UserRole;
}

export class TaskResponseDto {
  @ApiProperty({ example: 101 })
  id!: number;

  @ApiProperty({ example: 'Implementar coluna do kanban' })
  title!: string;

  @ApiProperty({
    required: false,
    nullable: true,
    example: 'Criar estrutura inicial com drag and drop',
  })
  description?: string | null;

  @ApiProperty({ enum: TaskStatus, example: TaskStatus.TODO })
  status!: TaskStatus;

  @ApiProperty({ example: 1 })
  projectId!: number;

  @ApiProperty({
    example: 12,
    required: false,
    nullable: true,
  })
  assigneeId?: number | null;

  @ApiProperty({
    required: false,
    nullable: true,
    type: String,
    format: 'date-time',
    example: '2026-06-10T14:00:00.000Z',
  })
  dueDate?: Date | string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-06-02T18:00:00.000Z',
  })
  createdAt!: Date | string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2026-06-02T19:30:00.000Z',
  })
  updatedAt!: Date | string;

  @ApiProperty({
    type: () => TaskProjectResponseDto,
    required: false,
  })
  project?: TaskProjectResponseDto;

  @ApiProperty({
    type: () => TaskAssigneeResponseDto,
    required: false,
    nullable: true,
  })
  assignee?: TaskAssigneeResponseDto | null;
}
