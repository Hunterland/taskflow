import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
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
  ApiNoContentResponse,
} from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user-dto';

@ApiTags('projects')
@ApiBearerAuth('JWT')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar projeto do usuário autenticado' })
  @ApiCreatedResponse({
    description: 'Projeto criado com sucesso',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  create(
    @Body() dto: CreateProjectDto,
    @GetUser() user: UserDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar projetos do usuário autenticado' })
  @ApiOkResponse({
    description: 'Projetos retornados com sucesso',
    type: ProjectResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  findAll(@GetUser() user: UserDto): Promise<ProjectResponseDto[]> {
    return this.projectsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um projeto do owner' })
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
    return this.projectsService.findOne(+id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar projeto do owner' })
  @ApiOkResponse({
    description: 'Projeto atualizado com sucesso',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a este projeto' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @GetUser() user: UserDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.update(+id, dto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover projeto e suas tasks' })
  @ApiOkResponse({
    description: 'Projeto removido com sucesso',
    type: ProjectResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a este projeto' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  remove(
    @Param('id') id: string,
    @GetUser() user: UserDto,
  ): Promise<ProjectResponseDto> {
    return this.projectsService.remove(+id, user.id);
  }
}
