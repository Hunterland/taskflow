import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-task-form-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-form-modal.component.html',
  styleUrl: './task-form-modal.component.css',
})
export class TaskFormModalComponent {
  mode = input<'create' | 'edit'>('create');
  taskId = input<number | null>(null);

  close = output<void>();
  saved = output<void>();

  get title(): string {
    return this.mode() === 'create' ? 'Nova tarefa' : 'Editar tarefa';
  }

  get description(): string {
    return this.mode() === 'create'
      ? 'Preencha os dados para criar uma nova tarefa.'
      : `Edite os dados da tarefa #${this.taskId()}.`;
  }

  onBackdropClick(): void {
    this.close.emit();
  }

  onClose(): void {
    this.close.emit();
  }

  onSave(): void {
    this.saved.emit();
  }
}
