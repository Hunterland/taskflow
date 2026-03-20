import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  /**
   * CREATE Project
   * Owner vem do JWT
   */
  async create(dto: CreateProjectDto, ownerId: number) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        owner: { connect: { id: ownerId } },
      },
      include: {
        owner: true,
      },
    });
  }

  /**
   * LIST Projects do usuário logado
   * Retorna contagem de tasks (evita payload pesado)
   */
  async findAll(userId: number) {
    return this.prisma.project.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        owner: true,
        _count: {
          select: { tasks: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  /**
   * DETALHES de 1 Project
   * 404 se não existe OU não pertence ao usuário
   */
  async findOne(id: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId: userId,
      },
      include: {
        owner: true,
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return project;
  }

  /**
   * UPDATE Project
   * 404 se não existe OU não pertence
   */
  async update(id: number, dto: UpdateProjectDto, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!project || project.ownerId !== userId) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
      },
      include: {
        owner: true,
      },
    });
  }

  /**
   * DELETE Project
   * Cascade automático nas tasks (definido no schema)
   * 404 se não existe OU não pertence
   */
  async remove(id: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!project || project.ownerId !== userId) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }
}