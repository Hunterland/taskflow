import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TasksFacade } from '../../facade/tasks.facade';
import { TaskFormModalComponent } from '../../components/task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFormModalComponent],
  templateUrl: './tasks-page.component.html',
  styleUrl: './tasks-page.component.css',
})
export class TasksPageComponent implements OnInit {
  private readonly tasksFacade = inject(TasksFacade);

  readonly tasks = this.tasksFacade.tasks;
  readonly loading = this.tasksFacade.loading;
  readonly submitting = this.tasksFacade.submitting;
  readonly error = this.tasksFacade.error;
  readonly hasTasks = this.tasksFacade.hasTasks;

  readonly viewMode = signal<'list' | 'kanban'>('list');
  readonly currentScope = signal<'all' | 'my-tasks'>('all');

  readonly isTaskModalOpen = signal(false);
  readonly taskModalMode = signal<'create' | 'edit'>('create');
  readonly selectedTaskId = signal<number | null>(null);

  ngOnInit(): void {
    void this.loadTasks();
  }

  async loadTasks(): Promise<void> {
    if (this.currentScope() === 'my-tasks') {
      await this.tasksFacade.loadMyTasks();
      return;
    }

    await this.tasksFacade.loadAll();
  }

  async showAllTasks(): Promise<void> {
    this.currentScope.set('all');
    await this.tasksFacade.loadAll();
  }

  async showMyTasks(): Promise<void> {
    this.currentScope.set('my-tasks');
    await this.tasksFacade.loadMyTasks();
  }

  toggleView(): void {
    this.viewMode.update((current) => (current === 'list' ? 'kanban' : 'list'));
  }

  async refresh(): Promise<void> {
    await this.loadTasks();
  }

  onOpenTask(taskId: number): void {
    console.log('Abrir detalhes da task:', taskId);
  }

  onCreateTask(): void {
    this.taskModalMode.set('create');
    this.selectedTaskId.set(null);
    this.isTaskModalOpen.set(true);

    console.log('Abrir modal de criação');
  }

  onEditTask(taskId: number): void {
    this.taskModalMode.set('edit');
    this.selectedTaskId.set(taskId);
    this.isTaskModalOpen.set(true);

    console.log('Abrir modal de edição da task:', taskId);
  }

  closeTaskModal(): void {
    this.isTaskModalOpen.set(false);
    this.selectedTaskId.set(null);
    this.taskModalMode.set('create');
  }

  async onTaskSaved(): Promise<void> {
    this.closeTaskModal();
    await this.refresh();
  }

  async onRemoveTask(taskId: number): Promise<void> {
    const confirmed = window.confirm('Deseja remover esta task?');

    if (!confirmed) {
      return;
    }

    await this.tasksFacade.remove(taskId);
  }
}
