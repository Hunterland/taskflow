// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany({
      include: { projects: true }  // eager loading
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  // Prisma auto-generated (não delete)
  create(createUserDto: any) { /* auth usa */ }
  // ...
}
