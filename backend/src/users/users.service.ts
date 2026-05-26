// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { SearchUsersQueryDto } from './dto/search-users-query.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // Retorna user "seguro" (sem passwordHash)
  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        // passwordHash: false (omitido)
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        ownedProjects: {
          select: {
            id: true,
            name: true,
          },
        },
        projectMembers: {
          select: {
            project: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async findOptions(query: SearchUsersQueryDto) {
    const search = query.search?.trim();
    const limit = query.limit ?? 20;

    return this.prisma.user.findMany({
      where: search
        ? {
            OR: [
              {
                name: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {},
      orderBy: {
        name: 'asc',
      },
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  }

  async update(id: number, data: Prisma.UserUpdateInput) {
    const user = await this.prisma.user.update({
      where: { id },
      data,
    });

    // remove passwordHash antes de devolver
    const { passwordHash, ...safeUser } = user;
    return safeUser;
  }

  // create() continua sendo usado pelo módulo auth
  create(createUserDto: any) {
    /* auth usa */
  }
}
