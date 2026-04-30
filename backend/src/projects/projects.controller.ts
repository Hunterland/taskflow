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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user-dto';

@ApiTags('projects')
@ApiBearerAuth('JWT')
@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Criar projeto (apenas admin)' })
  @ApiCreatedResponse({
    description: 'Projeto criado com sucesso',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({
    description: 'Apenas administradores podem criar projetos',
  })
  create(
    @Body() dto: CreateProjectDto,
    @GetUser() user: UserDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(dto, user.id);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  @ApiOperation({
    summary: 'Listar projetos acessíveis ao usuário autenticado',
  })
  @ApiOkResponse({
    description: 'Projetos retornados com sucesso',
    type: ProjectResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  findAll(@GetUser() user: UserDto): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll(user.id, user.role);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  @ApiOperation({
    summary: 'Obter detalhes de um projeto acessível ao usuário',
  })
  @ApiOkResponse({
    description: 'Projeto encontrado com sucesso',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a este projeto' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  findOne(
    @Param('id') id: string,
    @GetUser() user: UserDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.findOne(+id, user.id, user.role);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Atualizar projeto (apenas admin)' })
  @ApiOkResponse({
    description: 'Projeto atualizado com sucesso',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({
    description: 'Apenas administradores podem atualizar projetos',
  })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(+id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Remover projeto e suas tasks (apenas admin)' })
  @ApiOkResponse({
    description: 'Projeto removido com sucesso',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({
    description: 'Apenas administradores podem remover projetos',
  })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  remove(@Param('id') id: string): Promise<ProjectResponseDto> {
    return this.projectsService.remove(+id);
  }
}
