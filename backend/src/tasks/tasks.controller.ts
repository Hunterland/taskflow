import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user-dto';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '@prisma/client';

// controlador para gerenciar as tasks,
// com endpoints para criar, listar, obter detalhes, atualizar e remover tasks,
//  protegidos por guardas de autenticação e autorização (apenas o owner da task ou do projeto pode acessar)
@ApiTags('tasks')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
  
  @Post()
  @ApiOperation({ summary: 'Criar task em um projeto do usuário autenticado' })
  @ApiCreatedResponse({ description: 'Task criada com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso ao projeto informado' })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: UserDto) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tasks do usuário autenticado' })
  @ApiOkResponse({ description: 'Tasks retornadas com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  findAll(@GetUser() user: UserDto) {
    return this.tasksService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma task do owner' })
  @ApiOkResponse({ description: 'Task encontrada com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a esta task' })
  @ApiNotFoundResponse({ description: 'Task não encontrada' })
  findOne(@Param('id') id: string, @GetUser() user: UserDto) {
    return this.tasksService.findOne(+id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar task do owner' })
  @ApiOkResponse({ description: 'Task atualizada com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a esta task' })
  @ApiNotFoundResponse({ description: 'Task não encontrada' })
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: UserDto,
  ) {
    return this.tasksService.update(+id, updateTaskDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover task do owner' })
  @ApiOkResponse({ description: 'Task removida com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a esta task' })
  @ApiNotFoundResponse({ description: 'Task não encontrada' })
  remove(@Param('id') id: string, @GetUser() user: UserDto) {
    return this.tasksService.remove(+id, user.id);
  }

  @Get('my-tasks')
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  @ApiOperation({ summary: 'Listar minhas tasks como assignee, com filtro opcional por status' })
  @ApiOkResponse({ description: 'Tasks atribuídas retornadas com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  findMyTasks(@GetUser() user: UserDto, @Query('status') status?: TaskStatus) {
    return this.tasksService.findByAssignee(user.id, user.id, { status });
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Listar tasks de um projeto para o kanban' })
  @ApiOkResponse({ description: 'Tasks do projeto retornadas com sucesso' })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a este projeto' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  findByProject(@Param('projectId') projectId: string, @GetUser() user: UserDto) {
    return this.tasksService.findByProject(+projectId, user.id);
  }
}