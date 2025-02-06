import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="task-item"
      [class.completed]="task.completed"
      [class.ai-suggested]="task.aiSuggested"
    >
      <div class="d-flex align-items-center">
        <div class="checkbox-wrapper">
          <input
            type="checkbox"
            class="form-check-input"
            [checked]="task.completed"
            (change)="toggleComplete()"
          />
        </div>
        <div class="task-content">
          <span class="task-title">{{ task.title }}</span>
          <span *ngIf="task.aiSuggested" class="ai-badge">
            <i class="bi bi-stars"></i>
            ذكاء اصطناعي
          </span>
        </div>
      </div>
      <button class="delete-btn" (click)="deleteTask()">
        <i class="bi bi-trash3"></i>
      </button>
    </div>
  `,
  styles: [`
    .task-item {
      background: white;
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: all 0.3s ease;
      border: 2px solid transparent;
      margin-bottom: 0.5rem;

      &:hover {
        border-color: #e9ecef;
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);

        .delete-btn {
          opacity: 1;
        }
      }

      &.completed {
        background-color: #f8f9fa;
        
        .task-title {
          color: #6c757d;
          text-decoration: line-through;
        }
      }

      &.ai-suggested {
        border-left: 3px solid #3498db;
      }
    }

    .checkbox-wrapper {
      margin-left: 1rem;

      .form-check-input {
        width: 1.25rem;
        height: 1.25rem;
        margin-top: 0;
        cursor: pointer;
        border: 2px solid #dee2e6;

        &:checked {
          background-color: #3498db;
          border-color: #3498db;
        }

        &:focus {
          box-shadow: none;
          border-color: #3498db;
        }
      }
    }

    .task-content {
      flex-grow: 1;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .task-title {
      font-size: 1rem;
      color: #2c3e50;
      transition: all 0.3s ease;
    }

    .ai-badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
      background-color: #e8f4fd;
      color: #3498db;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;

      i {
        font-size: 0.875rem;
      }
    }

    .delete-btn {
      background: none;
      border: none;
      color: #e74c3c;
      padding: 0.5rem;
      border-radius: 8px;
      opacity: 0;
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        background-color: #fdf1f0;
      }

      i {
        font-size: 1.1rem;
      }
    }
  `]
})
export class TaskItemComponent {
  @Input() task!: Task;

  constructor(private taskService: TaskService) {}

  toggleComplete() {
    this.task.completed = !this.task.completed;
    this.taskService.updateTask(this.task);
  }

  deleteTask() {
    this.taskService.deleteTask(this.task.id);
  }
}
