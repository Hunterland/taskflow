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
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user-dto';

@ApiTags('projects')
@ApiBearerAuth('JWT')
@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}
  
  // endpoints para criar, listar, obter detalhes, atualizar e remover projetos do usuário autenticado,
  //  protegidos por guardas de autenticação e autorização (apenas o owner do projeto pode acessar)
  @Post()
  @ApiOperation({ summary: 'Criar projeto do usuário autenticado' })
  @ApiCreatedResponse({ description: 'Projeto criado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  create(@Body() dto: CreateProjectDto, @GetUser() user: UserDto) {
    return this.projectsService.create(dto, user.id);
  }
  
  // endpoint para listar os projetos do usuário autenticado, protegido por guarda de autenticação (token JWT)
  @Get()
  @ApiOperation({ summary: 'Listar projetos do usuário autenticado' })
  @ApiOkResponse({ description: 'Projetos retornados com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  findAll(@GetUser() user: UserDto) {
    return this.projectsService.findAll(user.id);
  }
  
  // endpoint para obter detalhes de um projeto do usuário autenticado por ID,
  //  protegido por guarda de autenticação (token JWT)
  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de um projeto do owner' })
  @ApiOkResponse({ description: 'Projeto encontrado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a este projeto' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  findOne(@Param('id') id: string, @GetUser() user: UserDto) {
    return this.projectsService.findOne(+id, user.id);
  }

  // endpoint para atualizar um projeto do usuário autenticado por ID,
  //  protegido por guarda de autenticação (token JWT)
  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar projeto do owner' })
  @ApiOkResponse({ description: 'Projeto atualizado com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a este projeto' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProjectDto,
    @GetUser() user: UserDto,
  ) {
    return this.projectsService.update(+id, dto, user.id);
  }
  
  // endpoint para remover um projeto do usuário autenticado por ID,
  // protegido por guarda de autenticação (token JWT)
  @Delete(':id')
  @ApiOperation({ summary: 'Remover projeto e suas tasks' })
  @ApiOkResponse({ description: 'Projeto removido com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a este projeto' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  remove(@Param('id') id: string, @GetUser() user: UserDto) {
    return this.projectsService.remove(+id, user.id);
  }
}