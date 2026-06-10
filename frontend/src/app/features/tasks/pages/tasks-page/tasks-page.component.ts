import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TasksFacade } from '../../facade/tasks.facade';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [CommonModule, TaskListComponent],
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

  onEditTask(taskId: number): void {
    console.log('Editar task:', taskId);
  }

  async onRemoveTask(taskId: number): Promise<void> {
    const confirmed = window.confirm('Deseja remover esta task?');

    if (!confirmed) {
      return;
    }

    await this.tasksFacade.remove(taskId);
  }
}
