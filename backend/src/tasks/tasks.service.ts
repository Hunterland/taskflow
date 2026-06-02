import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskStatus } from '@prisma/client';

import { PrismaService } from '../core/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}
  
  // Definindo um include padrão para evitar repetição de código nas queries
  private readonly taskInclude = {
    project: {
      select: {
        id: true,
        name: true,
        ownerId: true,
      },
    },
    assignee: {
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    },
  } as const;
  
  // Método para verificar se o usuário é o dono do projeto, usado em várias operações
  private async ensureProjectOwnerAccess(projectId: number, userId: number) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        ownerId: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    if (project.ownerId !== userId) {
      throw new ForbiddenException('Sem acesso a este projeto');
    }

    return project;
  }
  
  // Método para verificar se o assignee existe, usado na criação e atualização de tasks
  private async ensureAssigneeExists(assigneeId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: assigneeId },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('Assignee não encontrado');
    }

    return user;
  }
  
  // Implementação dos métodos de criação, leitura,
  // atualização e exclusão de tasks, utilizando os métodos auxiliares
  // para validação de acesso e existência de recursos relacionados
  async create(dto: CreateTaskDto, userId: number) {
    await this.ensureProjectOwnerAccess(dto.projectId, userId);

    if (dto.assigneeId !== undefined) {
      await this.ensureAssigneeExists(dto.assigneeId);
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
          assignee: {
            connect: { id: dto.assigneeId },
          },
        }),
      },
      include: this.taskInclude,
    });
  }
  
  // O método findAll retorna todas as tasks dos projetos que o usuário é dono,
  // incluindo informações
  async findAll(userId: number) {
    return this.prisma.task.findMany({
      where: {
        project: {
          ownerId: userId,
        },
      },
      include: this.taskInclude,
      orderBy: { updatedAt: 'desc' },
    });
  }
  
  // O método findByProject retorna as tasks de um projeto específico, verificando
  // se o usuário tem acesso ao projeto antes de realizar a consulta
  async findByProject(projectId: number, userId: number) {
    await this.ensureProjectOwnerAccess(projectId, userId);

    return this.prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
    });
  }
   
  // O método findOne retorna os detalhes de uma task específica, verificando se o
  // usuário é o dono do projeto antes de realizar a consulta
  async findOne(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: this.taskInclude,
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException('Sem acesso a esta task');
    }

    return task;
  }
  
  // O método update permite atualizar os detalhes de uma task, verificando se o usuário
  // é o dono
  async update(id: number, dto: UpdateTaskDto, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        project: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!task) {
      throw new NotFoundException('Task não encontrada');
    }

    if (task.project.ownerId !== userId) {
      throw new ForbiddenException('Sem acesso a esta task');
    }

    if (dto.assigneeId !== undefined && dto.assigneeId !== null) {
      await this.ensureAssigneeExists(dto.assigneeId);
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
      include: this.taskInclude,
    });
  }
  
  // O método remove permite excluir uma task, verificando se o usuário é o dono do projeto 
  async remove(id: number, userId: number) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      select: {
        id: true,
        project: {
          select: {
            ownerId: true,
          },
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
  
  // O método findByAssignee retorna as tasks atribuídas a um usuário específico,
  // com filtros opcionais por status e projeto, verificando se o usuário é o dono
  // do projeto antes de realizar a consulta
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
        project: {
          select: {
            id: true,
            name: true,
            ownerId: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }
}
