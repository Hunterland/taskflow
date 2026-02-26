import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

/**
 * ProjectsService - Gerencia CRUD Projects com RBAC ownerId
 * Integra Prisma PostgreSQL + Relations (User, Tasks)
 * Segurança: só ownerId = user.id acessa
 */
@Injectable()
export class ProjectsService {
  /**
   * Dependency Injection - PrismaService singleton
   */
  constructor(private prisma: PrismaService) {}

  /**
   * CRIAR Project Novo
   * @param dto - name + description (CreateProjectDto)
   * @param ownerId - user.id do JWT (RBAC auto)
   * @returns Project criado + owner + tasks vazias
   */
  async create(dto: CreateProjectDto, ownerId: number) {
    return this.prisma.project.create({
      data: {
        ...dto,
        owner: { connect: { id: ownerId } },  // ownerId via FK
      },
      include: {
        owner: true,   // User que criou
        tasks: true,   // Tasks do project (kanban)
      },
    });
  }

  /**
   * LISTAR MEUS Projects (RBAC)
   * @param userId - JWT user.id
   * @returns Array projects ownerId=userId ordenados updatedAt desc
   */
  async findAll(userId: number) {
    return this.prisma.project.findMany({
      where: {
        ownerId: userId,  // Só projetos do usuário logado
      },
      include: {
        owner: true,
        tasks: true,
      },
      orderBy: {
        updatedAt: 'desc',  // Recentes primeiro
      },
    });
  }

  /**
   * DETALHES 1 Project (RBAC + NotFound)
   * @param id - Project ID
   * @param userId - JWT user.id
   * @returns Project completo OU NotFoundException
   * @throws 404 se id não existe OU não é owner
   */
  async findOne(id: number, userId: number) {
    const project = await this.prisma.project.findFirst({
      where: {
        id,
        ownerId: userId,  // Dupla verificação segurança
      },
      include: {
        owner: true,
        tasks: true,  // Kanban preview
      },
    });

    if (!project) {
      throw new NotFoundException(`Projeto ID ${id} não encontrado`);
    }

    return project;
  }

  /**
   * ATUALIZAR Project (RBAC)
   * @param id - Project ID
   * @param dto - name/description novos
   * @param userId - JWT user.id
   * @returns Project atualizado
   * @throws 403 se não é owner
   */
  async update(id: number, dto: UpdateProjectDto, userId: number) {
    // Verifica owner ANTES update
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },  // Leve, só ID
    });

    if (!project || project.ownerId !== userId) {
      throw new ForbiddenException('Projeto não autorizado');
    }

    return this.prisma.project.update({
      where: { id },
      data: dto,
      include: {
        owner: true,
      },
    });
  }

  /**
   * DELETAR Project + Tasks Cascade (RBAC)
   * @param id - Project ID
   * @param userId - JWT user.id
   * @returns Project deletado
   * @throws 403 se não é owner
   * @note Cascade deleta tasks automágico (schema onDelete)
   */
  async remove(id: number, userId: number) {
    // Verifica owner ANTES delete
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!project || project.ownerId !== userId) {
      throw new ForbiddenException('Projeto não autorizado');
    }

    return this.prisma.project.delete({
      where: { id },
    });
  }
}
