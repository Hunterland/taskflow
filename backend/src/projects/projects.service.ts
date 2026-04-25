import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

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

  async findAll(userId: number): Promise<ProjectResponseDto[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return projects.map((project) => this.toProjectResponse(project));
  }

  async findOne(id: number, userId: number): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return this.toProjectResponse(project);
  }

  async update(
    id: number,
    dto: UpdateProjectDto,
    userId: number,
  ): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!project || project.ownerId !== userId) {
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

  async remove(id: number, userId: number): Promise<ProjectResponseDto> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!project || project.ownerId !== userId) {
      throw new NotFoundException('Projeto não encontrado');
    }

    const deletedProject = await this.prisma.project.delete({
      where: { id },
    });

    return this.toProjectResponse(deletedProject);
  }
}
