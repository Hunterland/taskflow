import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { TaskStatus } from '@prisma/client';  // Remova Prisma import desnecessário
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateTaskDto & { ownerId: number; projectId: number; assigneeId?: number }): Promise<any> {  // any temporário
    // Verifica owner project
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      select: { ownerId: true }
    });
    if (!project || project.ownerId !== dto.ownerId) {
      throw new ForbiddenException('Projeto não autorizado');
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,           // ← Explícito, SEM spread
        description: dto.description,
        status: dto.status || 'TODO',
        project: { connect: { id: dto.projectId } },
        assignee: dto.assigneeId ? { connect: { id: dto.assigneeId } } : undefined,
        owner: { connect: { id: dto.ownerId } }  // ← owner connect
      },
      include: { project: true, assignee: true, owner: true }
    });
  }

  async findAll(userId: number): Promise<any[]> {
    return this.prisma.task.findMany({
      where: { ownerId: userId },
      include: { project: true, assignee: true },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async findByProject(projectId: number, userId: number): Promise<any[]> {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, ownerId: userId }
    });
    if (!project) throw new ForbiddenException('Projeto não encontrado');

    return this.prisma.task.findMany({
      where: { projectId },
      include: { assignee: true, owner: true },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }]
    });
  }

  async findOne(id: number, userId: number): Promise<any | null> {
    return this.prisma.task.findFirst({
      where: { id, ownerId: userId },
      include: { project: true, assignee: true }
    });
  }

  async update(id: number, data: UpdateTaskDto, userId: number): Promise<any> {
    const task = await this.prisma.task.findUnique({ where: { id }, select: { ownerId: true } });
    if (!task || task.ownerId !== userId) {
      throw new ForbiddenException('Task não autorizada');
    }
    return this.prisma.task.update({
      where: { id },
      data,
      include: { project: true, assignee: true }
    });
  }

  async remove(id: number, userId: number): Promise<any> {
    const task = await this.prisma.task.findUnique({ where: { id }, select: { ownerId: true } });
    if (!task || task.ownerId !== userId) {
      throw new ForbiddenException('Task não autorizada');
    }
    return this.prisma.task.delete({ where: { id } });
  }

  async findByAssignee(assigneeId: number, filters?: { status?: TaskStatus; projectId?: number }): Promise<any[]> {  // TaskStatus enum
    return this.prisma.task.findMany({
      where: { 
        assigneeId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.projectId && { projectId: filters.projectId })
      },
      include: { project: true },
      orderBy: { updatedAt: 'desc' }
    });
  }
}
