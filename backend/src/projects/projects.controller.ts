import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * Services e DTOs
 */
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

/**
 * Auth - JWT + RBAC
 */
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user-dto';

@ApiTags('Projects')  // Swagger grouping
@Controller('projects')
@UseGuards(JwtAuthGuard)  // Protege TODAS rotas (RBAC ownerId)
@ApiBearerAuth('JWT')  // Swagger auth button
export class ProjectsController {
  /**
   * Dependency Injection - ProjectsService com Prisma
   */
  constructor(private readonly projectsService: ProjectsService) {}

  /**
   * Cria project NOVO
   * @param dto name + description
   * @param user JWT user.id → ownerId auto
   * @returns Project com owner/tasks include
   */
  @Post()
  @ApiOperation({ summary: 'Cria project (owner = user logado)' })
  @ApiResponse({ status: 201, description: 'Project criado' })
  create(@Body() dto: CreateProjectDto, @GetUser() user: UserDto) {
    return this.projectsService.create(dto, user.id);
  }

  /**
   * Lista TODOS projects do USER logado
   * @param user JWT → where ownerId = user.id
   * @returns Array projects com owner/tasks
   */
  @Get()
  @ApiOperation({ summary: 'Lista MEUS projects (RBAC ownerId)' })
  @ApiResponse({ status: 200, description: 'Lista vazia [] OK' })
  findAll(@GetUser() user: UserDto) {
    return this.projectsService.findAll(user.id);
  }

  /**
   * Detalhes 1 project (verifica owner)
   * @param id Project ID
   * @param user JWT → where id AND ownerId=user.id
   * @returns Project details ou 401 Forbidden
   */
  @Get(':id')
  @ApiOperation({ summary: 'Detalhes project (só owner)' })
  @ApiResponse({ status: 200, description: 'Project details' })
  @ApiResponse({ status: 401, description: 'Não é seu project' })
  findOne(@Param('id') id: string, @GetUser() user: UserDto) {
    return this.projectsService.findOne(+id, user.id);
  }

  /**
   * Atualiza project (só owner)
   * @param id Project ID
   * @param dto name/description
   * @param user JWT → verifica ownerId
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza project (só owner)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @GetUser() user: UserDto,
  ) {
    return this.projectsService.update(+id, dto, user.id);
  }

  /**
   * Deleta project (só owner)
   * @param id Project ID + cascade tasks
   * @param user JWT → verifica ownerId
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Deleta project + tasks (só owner)' })
  @ApiResponse({ status: 200, description: 'Project deletado' })
  remove(@Param('id') id: string, @GetUser() user: UserDto) {
    return this.projectsService.remove(+id, user.id);
  }
}
