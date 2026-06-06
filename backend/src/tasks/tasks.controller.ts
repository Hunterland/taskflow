import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserDto } from '../auth/dto/user-dto';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';

@ApiTags('tasks')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Criar task em um projeto do usuário autenticado' })
  @ApiCreatedResponse({
    description: 'Task criada com sucesso',
    type: TaskResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({
    description: 'Você não tem acesso ao projeto informado',
  })
  @ApiNotFoundResponse({ description: 'Projeto ou assignee não encontrado' })
  create(@Body() createTaskDto: CreateTaskDto, @GetUser() user: UserDto) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary:
      'Listar tasks dos projetos do usuário autenticado com filtros opcionais',
  })
  @ApiOkResponse({
    description: 'Tasks retornadas com sucesso',
    type: TaskResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  findAll(@GetUser() user: UserDto, @Query() query: QueryTasksDto) {
    return this.tasksService.findAll(user.id, query);
  }

  @Get('my-tasks')
  @ApiOperation({
    summary:
      'Listar tasks atribuídas ao usuário autenticado, com filtros opcionais',
  })
  @ApiOkResponse({
    description: 'Tasks atribuídas retornadas com sucesso',
    type: TaskResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  findMyTasks(@GetUser() user: UserDto, @Query() query: QueryTasksDto) {
    return this.tasksService.findByAssignee(user.id, user.id, {
      status: query.status,
      projectId: query.projectId,
    });
  }

  @Get('project/:projectId')
  @ApiOperation({ summary: 'Listar tasks de um projeto para o kanban' })
  @ApiParam({ name: 'projectId', type: Number, example: 1 })
  @ApiOkResponse({
    description: 'Tasks do projeto retornadas com sucesso',
    type: TaskResponseDto,
    isArray: true,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a este projeto' })
  @ApiNotFoundResponse({ description: 'Projeto não encontrado' })
  findByProject(
    @Param('projectId', ParseIntPipe) projectId: number,
    @GetUser() user: UserDto,
  ) {
    return this.tasksService.findByProject(projectId, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter detalhes de uma task do owner' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    description: 'Task encontrada com sucesso',
    type: TaskResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a esta task' })
  @ApiNotFoundResponse({ description: 'Task não encontrada' })
  findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: UserDto) {
    return this.tasksService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar task do owner' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    description: 'Task atualizada com sucesso',
    type: TaskResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a esta task' })
  @ApiNotFoundResponse({ description: 'Task não encontrada' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @GetUser() user: UserDto,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover task do owner' })
  @ApiParam({ name: 'id', type: Number, example: 1 })
  @ApiOkResponse({
    description: 'Task removida com sucesso',
    type: TaskResponseDto,
  })
  @ApiUnauthorizedResponse({ description: 'Token ausente ou inválido' })
  @ApiForbiddenResponse({ description: 'Você não tem acesso a esta task' })
  @ApiNotFoundResponse({ description: 'Task não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: UserDto) {
    return this.tasksService.remove(id, user.id);
  }
}
