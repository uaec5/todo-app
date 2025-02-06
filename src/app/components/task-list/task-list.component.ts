import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { TaskItemComponent } from '../task-item/task-item.component';
import { ChatgptService } from '@services/chatgpt.service';
import { DigitalClockComponent } from '../digital-clock/digital-clock.component';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskItemComponent, DigitalClockComponent],
  template: `
    <div class="row">
      <!-- Digital Clock Column -->
      <div class="col-md-4">
        <app-digital-clock class="clock-wrapper"></app-digital-clock>
      </div>

      <!-- Tasks Column -->
      <div class="col-md-8">
        <div class="card shadow-sm">
          <div class="card-body">
            <h2 class="card-title mb-4 text-center">
              <i class="bi bi-list-task me-2"></i>
              قائمة المهام
            </h2>
            
            <div class="add-task-form mb-4">
              <div class="input-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="أضف مهمة جديدة..."
                  [(ngModel)]="newTaskTitle"
                  (keyup.enter)="addTask()"
                />
                <button
                  class="btn btn-primary btn-lg"
                  (click)="addTask()"
                  [disabled]="!newTaskTitle.trim()"
                >
                  <i class="bi bi-plus-lg"></i>
                  إضافة
                </button>
              </div>
            </div>

            <div class="task-list">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0">
                  <i class="bi bi-card-checklist me-2"></i>
                  المهام ({{ tasks.length }})
                </h5>
                <button
                  class="btn btn-outline-primary btn-sm"
                  (click)="suggestTask()"
                  [disabled]="isLoadingSuggestion"
                >
                  <i class="bi bi-lightbulb me-1"></i>
                  {{ isLoadingSuggestion ? 'جاري التفكير...' : 'اقترح مهمة' }}
                </button>
              </div>

              <div class="task-items">
                <app-task-item
                  *ngFor="let task of tasks"
                  [task]="task"
                  class="task-item"
                ></app-task-item>

                <div *ngIf="tasks.length === 0" class="text-center text-muted p-4">
                  <i class="bi bi-inbox-fill display-4"></i>
                  <p class="mt-2">لا توجد مهام حالياً</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 2rem 0;
      background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
      min-height: 100vh;
    }

    .clock-wrapper {
      display: block;
      position: sticky;
      top: 2rem;
    }

    .card {
      border: none;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .card-title {
      color: #2c3e50;
      font-weight: 700;
      font-size: 1.8rem;
      margin-bottom: 2rem;
    }

    .add-task-form {
      .form-control {
        border: 2px solid #e9ecef;
        border-radius: 15px;
        padding: 1rem 1.5rem;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        background: rgba(255, 255, 255, 0.9);

        &:focus {
          border-color: #3498db;
          box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.1);
          background: #ffffff;
        }
      }

      .btn {
        border-radius: 15px;
        padding: 1rem 2rem;
        font-weight: 600;
        letter-spacing: 0.5px;
        background: linear-gradient(135deg, #3498db, #2980b9);
        border: none;
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(135deg, #2980b9, #2573a7);
          transform: translateY(-2px);
        }

        &:active {
          transform: translateY(0);
        }
      }
    }

    .task-list {
      margin-top: 2rem;

      h5 {
        color: #34495e;
        font-weight: 600;
        font-size: 1.2rem;
      }

      .btn-outline-primary {
        border-radius: 12px;
        padding: 0.5rem 1.2rem;
        border: 2px solid #3498db;
        color: #3498db;
        font-weight: 600;
        transition: all 0.3s ease;

        &:hover {
          background: linear-gradient(135deg, #3498db, #2980b9);
          border-color: transparent;
          color: white;
          transform: translateY(-2px);
        }

        &:disabled {
          opacity: 0.7;
          transform: none;
        }
      }

      .task-items {
        max-height: 60vh;
        overflow-y: auto;
        padding: 0.5rem;
        margin: 1rem -0.5rem;
        border-radius: 15px;

        &::-webkit-scrollbar {
          width: 8px;
        }

        &::-webkit-scrollbar-track {
          background: #f8f9fa;
          border-radius: 10px;
        }

        &::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;

          &:hover {
            background: #a0aec0;
          }
        }
      }

      .text-muted {
        i {
          font-size: 3rem;
          opacity: 0.3;
          margin-bottom: 1rem;
        }

        p {
          font-size: 1.1rem;
          color: #718096;
        }
      }
    }
  `]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  isLoadingSuggestion: boolean = false;

  constructor(
    private taskService: TaskService,
    private chatgptService: ChatgptService
  ) {}

  ngOnInit() {
    this.taskService.getTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  addTask() {
    const title = this.newTaskTitle.trim();
    if (title) {
      this.taskService.addTask(title);
      this.newTaskTitle = '';
    }
  }

  async suggestTask() {
    if (this.isLoadingSuggestion) return;
    
    this.isLoadingSuggestion = true;
    try {
      const suggestion = await this.chatgptService.suggestTask();
      if (suggestion) {
        this.taskService.addTask(suggestion, true);
      }
    } finally {
      this.isLoadingSuggestion = false;
    }
  }
}
