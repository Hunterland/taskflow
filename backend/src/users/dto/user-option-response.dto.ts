import { ApiProperty } from '@nestjs/swagger';

export class UserOptionResponseDto {
  @ApiProperty({ example: 1 })
  id!: number;

  @ApiProperty({ example: 'Alan Barroncas' })
  name!: string;

  @ApiProperty({ example: 'alan@email.com' })
  email!: string;

  @ApiProperty({ example: 'ADMIN', enum: ['USER', 'ADMIN'] })
  role!: 'USER' | 'ADMIN';
}