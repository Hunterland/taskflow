import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {
  ProjectResponseDto,
  ProjectUserResponseDto,
} from './dto/project-response.dto';
import { UserRole } from '../auth/decorators/role.decorator';

type ProjectWithMembers = {
  id: number;
  name: string;
  description: string | null;
  ownerId: number;
  createdAt: Date;
  updatedAt: Date;
  members: {
    user: {
      id: number;
      name: string;
      email: string;
      role: 'USER' | 'ADMIN';
    };
  }[];
};

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private toProjectResponse(project: ProjectWithMembers): ProjectResponseDto {
    const users: ProjectUserResponseDto[] = project.members.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      role: member.user.role,
    }));

    return {
      id: project.id,
      name: project.name,
      description: project.description,
      ownerId: project.ownerId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      users,
    };
  }

  private async validateUserIds(userIds: number[]): Promise<number[]> {
    const uniqueUserIds = [...new Set(userIds)];

    if (uniqueUserIds.length === 0) {
      return [];
    }

    const users = await this.prisma.user.findMany({
      where: {
        id: {
          in: uniqueUserIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (users.length !== uniqueUserIds.length) {
      throw new BadRequestException(
        'Um ou mais usuários informados não existem.',
      );
    }

    return uniqueUserIds;
  }

  async create(
    dto: CreateProjectDto,
    ownerId: number,
  ): Promise<ProjectResponseDto> {
    const validatedUserIds = await this.validateUserIds(dto.userIds ?? []);

    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        owner: { connect: { id: ownerId } },
        members: {
          create: validatedUserIds.map((userId) => ({
            user: {
              connect: { id: userId },
            },
            assignedById: ownerId,
          })),
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return this.toProjectResponse(project);
  }

  async findAll(
    userId: number,
    userRole: UserRole,
  ): Promise<ProjectResponseDto[]> {
    const projects = await this.prisma.project.findMany({
      where:
        userRole === 'ADMIN'
          ? {}
          : {
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: {
                      userId,
                    },
                  },
                },
              ],
            },
      orderBy: [
        {
          createdAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return projects.map((project) => this.toProjectResponse(project));
  }

  async findOne(
    id: number,
    userId: number,
    userRole: UserRole,
  ): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findFirst({
      where:
        userRole === 'ADMIN'
          ? { id }
          : {
              id,
              OR: [
                { ownerId: userId },
                {
                  members: {
                    some: {
                      userId,
                    },
                  },
                },
              ],
            },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return this.toProjectResponse(project);
  }

  async update(id: number, dto: UpdateProjectDto): Promise<ProjectResponseDto> {
    const existingProject = await this.prisma.project.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });

    if (!existingProject) {
      throw new NotFoundException('Projeto não encontrado');
    }

    const validatedUserIds =
      dto.userIds !== undefined
        ? await this.validateUserIds(dto.userIds)
        : undefined;

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
        ...(validatedUserIds !== undefined && {
          members: {
            deleteMany: {},
            create: validatedUserIds.map((userId) => ({
              user: {
                connect: { id: userId },
              },
            })),
          },
        }),
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return this.toProjectResponse(updatedProject);
  }

  async remove(id: number): Promise<ProjectResponseDto> {
    const existingProject = await this.prisma.project.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    if (!existingProject) {
      throw new NotFoundException('Projeto não encontrado');
    }

    const deletedProject = await this.prisma.project.delete({
      where: { id },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
      },
    });

    return this.toProjectResponse(deletedProject);
  }
}
