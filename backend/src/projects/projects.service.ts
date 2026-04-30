import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { UserRole } from '../auth/decorators/role.decorator';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  private toProjectResponse(project: {
    id: number;
    name: string;
    description: string | null;
    ownerId: number;
    createdAt: Date;
    updatedAt: Date;
  }): ProjectResponseDto {
    return {
      id: project.id,
      name: project.name,
      description: project.description,
      ownerId: project.ownerId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };
  }

  async create(
    dto: CreateProjectDto,
    ownerId: number,
  ): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        owner: { connect: { id: ownerId } },
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
              ownerId: userId,
            },
      orderBy: [
        {
          createdAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],
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
              ownerId: userId,
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
    });

    if (!existingProject) {
      throw new NotFoundException('Projeto não encontrado');
    }

    const updatedProject = await this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
      },
    });

    return this.toProjectResponse(updatedProject);
  }

  async remove(id: number): Promise<ProjectResponseDto> {
    const existingProject = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      throw new NotFoundException('Projeto não encontrado');
    }

    const deletedProject = await this.prisma.project.delete({
      where: { id },
    });

    return this.toProjectResponse(deletedProject);
  }
}
