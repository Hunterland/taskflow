import { Injectable, computed, signal } from '@angular/core';
import type {
  CreateTaskDto,
  TaskResponseDto,
  TasksControllerFindAllParams,
  TasksControllerFindMyTasksParams,
  UpdateTaskDto,
} from '../../../core/api/generated/model';
import {
  tasksControllerCreate,
  tasksControllerFindAll,
  tasksControllerFindByProject,
  tasksControllerFindMyTasks,
  tasksControllerFindOne,
  tasksControllerRemove,
  tasksControllerUpdate,
} from '../../../core/api/generated/tasks/tasks';

@Injectable({
  providedIn: 'root',
})
export class TasksFacade {
  private readonly _tasks = signal<TaskResponseDto[]>([]);
  private readonly _selectedTask = signal<TaskResponseDto | null>(null);
  private readonly _loading = signal(false);
  private readonly _submitting = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly tasks = this._tasks.asReadonly();
  readonly selectedTask = this._selectedTask.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly submitting = this._submitting.asReadonly();
  readonly error = this._error.asReadonly();
  readonly hasTasks = computed(() => this._tasks().length > 0);

  async loadAll(params?: TasksControllerFindAllParams): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await tasksControllerFindAll(params);
      this._tasks.set(response ?? []);
    } catch (error) {
      this._error.set('Não foi possível carregar as tasks.');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async loadMyTasks(params?: TasksControllerFindMyTasksParams): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await tasksControllerFindMyTasks(params);
      this._tasks.set(response ?? []);
    } catch (error) {
      this._error.set('Não foi possível carregar suas tasks.');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async loadByProject(projectId: number): Promise<void> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await tasksControllerFindByProject(projectId);
      this._tasks.set(response ?? []);
    } catch (error) {
      this._error.set('Não foi possível carregar as tasks do projeto.');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async loadOne(id: number): Promise<TaskResponseDto> {
    this._loading.set(true);
    this._error.set(null);

    try {
      const response = await tasksControllerFindOne(id);
      this._selectedTask.set(response);
      return response;
    } catch (error) {
      this._error.set('Não foi possível carregar os detalhes da task.');
      throw error;
    } finally {
      this._loading.set(false);
    }
  }

  async create(payload: CreateTaskDto): Promise<TaskResponseDto> {
    this._submitting.set(true);
    this._error.set(null);

    try {
      const created = await tasksControllerCreate(payload);
      this._tasks.update((tasks) => [created, ...tasks]);
      return created;
    } catch (error) {
      this._error.set('Não foi possível criar a task.');
      throw error;
    } finally {
      this._submitting.set(false);
    }
  }

  async update(id: number, payload: UpdateTaskDto): Promise<TaskResponseDto> {
    this._submitting.set(true);
    this._error.set(null);

    try {
      const updated = await tasksControllerUpdate(id, payload);

      this._tasks.update((tasks) =>
        tasks.map((task) => (task.id === id ? updated : task)),
      );

      if (this._selectedTask()?.id === id) {
        this._selectedTask.set(updated);
      }

      return updated;
    } catch (error) {
      this._error.set('Não foi possível atualizar a task.');
      throw error;
    } finally {
      this._submitting.set(false);
    }
  }

  async remove(id: number): Promise<void> {
    this._submitting.set(true);
    this._error.set(null);

    try {
      await tasksControllerRemove(id);
      this._tasks.update((tasks) => tasks.filter((task) => task.id !== id));

      if (this._selectedTask()?.id === id) {
        this._selectedTask.set(null);
      }
    } catch (error) {
      this._error.set('Não foi possível remover a task.');
      throw error;
    } finally {
      this._submitting.set(false);
    }
  }

  clearSelectedTask(): void {
    this._selectedTask.set(null);
  }

  clearError(): void {
    this._error.set(null);
  }

  setTasks(tasks: TaskResponseDto[]): void {
    this._tasks.set(tasks);
  }
}
