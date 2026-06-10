import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import type { TaskResponseDto } from '../../../../core/api/generated/model';
import { TaskCardComponent } from '../task-card/task-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  tasks = input<TaskResponseDto[]>([]);

  edit = output<number>();
  remove = output<number>();
  open = output<number>();

  trackByTaskId(_: number, task: TaskResponseDto): number {
    return task.id;
  }

  onEdit(id: number): void {
    this.edit.emit(id);
  }

  onRemove(id: number): void {
    this.remove.emit(id);
  }

  onOpen(id: number): void {
    this.open.emit(id);
  }
}
