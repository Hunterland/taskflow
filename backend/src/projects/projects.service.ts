import { Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../core/prisma/prisma.service';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto, ownerId: number) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        ownerId, // ← user.id do JWT
      },
      include: { owner: true, tasks: true },
    });
  }

  async findAll() {
    return this.prisma.project.findMany({
      include: { owner: true, tasks: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { owner: true, tasks: true },
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: updateProjectDto,
      include: { owner: true, tasks: true },
    });
  }

  async remove(id: number) {
    return this.prisma.project.delete({
      where: { id },
      include: { owner: true, tasks: true },
    });
  }
}
