import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { TaskStatus, Prisma } from '@prisma/client';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  /*
   |--------------------------------------------------------------------------
   | CREATE
   |--------------------------------------------------------------------------
   | Regra:
   | - Somente owner do projeto pode criar task
   | - Validar que assignee existe (se fornecido)
   | - Status e dueDate são opcionais
   | - Retornar task criada com dados do projeto e assignee
   -------------------------------------------------------------------------
   */

  async create(dto: CreateTaskDto, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: dto.projectId },
      select: { ownerId: true },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Sem acesso a este projeto');
    }

    // Validar assignee se informado
    if (dto.assigneeId !== undefined) {
      const userExists = await this.prisma.user.findUnique({
        where: { id: dto.assigneeId },
      });

      if (!userExists) {
        throw new NotFoundException('Assignee não encontrado');
      }
    }

    return this.prisma.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status ?? TaskStatus.TODO,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        project: {
          connect: { id: dto.projectId },
        },
        ...(dto.assigneeId !== undefined && {
          assignee: { connect: { id: dto.assigneeId } },
        }),
      },
      include: {
        project: true,
        assignee: true,
      },
    });
  }

  /*
   |--------------------------------------------------------------------------
   | FIND ALL (tasks visíveis ao usuário)
   |--------------------------------------------------------------------------
   | Usuário só enxerga tasks de projetos que ele é owner.
   */

  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: {
        project: {
          ownerId: userId,
        },
      },
      include: {
        project: true,
        assignee: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  /*
   |--------------------------------------------------------------------------
   | FIND BY PROJECT
   |--------------------------------------------------------------------------
   */

  async findByProject(projectId: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: userId,
      },
    });

    if (!project) {
      throw new ForbiddenException('Projeto não encontrado ou sem acesso');
    }

    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: true,
      },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    });
  }

  /*
   |--------------------------------------------------------------------------
   | FIND ONE
   |--------------------------------------------------------------------------
   */

  async findOne(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { ownerId: true },
        },
        assignee: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException('Sem acesso a esta task');
    }

    return task;
  }

  /*
   |--------------------------------------------------------------------------
   | UPDATE
   |--------------------------------------------------------------------------
   | - Não permite mover task de projeto
   | - Autorização via Project
   */

  async update(id: number, dto: UpdateTaskDto, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: { select: { ownerId: true } },
      },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException('Sem acesso a esta task');
    }

    // Validar assignee se fornecido
    if (dto.assigneeId !== undefined && dto.assigneeId !== null) {
      const userExists = await this.prisma.user.findUnique({
        where: { id: dto.assigneeId },
      });

      if (!userExists) {
        throw new NotFoundException('Assignee não encontrado');
      }
    }

    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.assigneeId !== undefined && {
          assignee:
            dto.assigneeId === null
              ? { disconnect: true }
              : { connect: { id: dto.assigneeId } },
        }),
      },
      include: {
        project: true,
        assignee: true,
      },
    });
  }

  /*
   |--------------------------------------------------------------------------
   | REMOVE
   |--------------------------------------------------------------------------
   */

  async remove(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: { ownerId: true },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException('Sem acesso a esta task');
    }

    return this.prisma.task.delete({
      where: { id },
    });
  }

  /*
   |--------------------------------------------------------------------------
   | FIND BY ASSIGNEE
   |--------------------------------------------------------------------------
   | Usuário pode ver tasks atribuídas a ele,
   | mas somente se pertencerem a projetos dele.
   |--------------------------------------------------------------------------
   */

  async findByAssignee(
    assigneeId: number,
    userId: number,
    filters?: { status?: TaskStatus; projectId?: number },
  ) {
    return this.prisma.task.findMany({
      where: {
        assigneeId,
        project: {
          ownerId: userId,
        },
        ...(filters?.status && { status: filters.status }),
        ...(filters?.projectId && { projectId: filters.projectId }),
      },
      include: {
        project: true,
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
