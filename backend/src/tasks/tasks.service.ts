// src/tasks/tasks.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Prisma, Task, TaskStatus } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto & { assigneeId?: number; projectId: number }): Promise<Task> {
    return this.prisma.task.create({
      data: {
      ...createTaskDto,
      status: createTaskDto.status || 'TODO'
    },
    include: { project: true, assignee: true }
    });
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany({
      include: { project: true, assignee: true }
    });
  }

  async findByAssignee(assigneeId: number, filters?: { status?: TaskStatus }): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { assigneeId, ...filters },
      include: { project: true }
    });
  }

  async findByProject(projectId: number, userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: { projectId, assigneeId: userId },
      include: { assignee: true }
    });
  }

  async findOne(id: number): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id },
      include: { project: true, assignee: true }
    });
  }

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      data,
    });
  }

  async remove(id: number): Promise<Task> {
    return this.prisma.task.delete({ where: { id } });
  }
}
