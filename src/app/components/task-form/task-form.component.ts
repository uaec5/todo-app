import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ChatgptService } from '@services/chatgpt.service';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card mb-4">
      <div class="card-body">
        <form (ngSubmit)="onSubmit()" #taskForm="ngForm">
          <div class="input-group mb-3">
            <input
              type="text"
              class="form-control"
              [(ngModel)]="taskTitle"
              name="taskTitle"
              placeholder="أدخل مهمة جديدة..."
              required
            />
            <button
              class="btn btn-primary"
              type="submit"
              [disabled]="!taskTitle.trim()"
            >
              إضافة
            </button>
          </div>
        </form>
        
        <div class="d-grid gap-2">
          <button
            class="btn btn-outline-primary"
            (click)="getAISuggestions()"
            [disabled]="isLoading || cooldownActive"
          >
            <span *ngIf="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
            {{ getButtonText() }}
          </button>
        </div>

        <div *ngIf="error" class="alert alert-danger mt-3">
          {{ error }}
        </div>

        <div *ngIf="suggestions.length > 0" class="mt-3">
          <h6 class="mb-3">اقتراحات المهام:</h6>
          <div class="list-group">
            <button
              *ngFor="let suggestion of suggestions"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              (click)="addSuggestion(suggestion)"
              [class.disabled]="isLoading"
            >
              <span>{{ suggestion }}</span>
              <span class="badge bg-primary rounded-pill">إضافة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .list-group-item:hover {
      background-color: #f8f9fa;
    }
    .list-group-item:hover .badge {
      background-color: #0d6efd !important;
    }
    .list-group-item.disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
    .cooldown {
      cursor: not-allowed;
    }
  `]
})
export class TaskFormComponent implements OnDestroy {
  taskTitle: string = '';
  suggestions: string[] = [];
  isLoading: boolean = false;
  error: string = '';
  cooldownActive: boolean = false;
  cooldownTime: number = 30; // 30 seconds cooldown
  cooldownRemaining: number = 0;
  private cooldownInterval: any;

  constructor(
    private taskService: TaskService,
    private chatgptService: ChatgptService
  ) {}

  onSubmit() {
    if (this.taskTitle.trim()) {
      this.taskService.addTask(this.taskTitle);
      this.taskTitle = '';
    }
  }

  getButtonText(): string {
    if (this.isLoading) {
      return 'جاري التحميل...';
    }
    if (this.cooldownActive) {
      return `انتظر ${this.cooldownRemaining} ثانية`;
    }
    return 'اقتراح مهام ذكية';
  }

  getAISuggestions() {
    if (this.isLoading || this.cooldownActive) {
      return;
    }

    this.isLoading = true;
    this.error = '';
    
    console.log('Requesting AI suggestions...');
    this.chatgptService.getSuggestions('اقترح ثلاث مهام يومية مفيدة').subscribe({
      next: (suggestions: string[]) => {
        console.log('Received suggestions:', suggestions);
        this.suggestions = suggestions;
        this.isLoading = false;
        if (suggestions.length === 0) {
          this.error = 'عذراً، لم نتمكن من الحصول على اقتراحات في الوقت الحالي';
        } else {
          this.startCooldown();
        }
      },
      error: (error: Error) => {
        console.error('Error getting suggestions:', error);
        this.error = error.message;
        this.isLoading = false;
        this.startCooldown();
      }
    });
  }

  private startCooldown() {
    this.cooldownActive = true;
    this.cooldownRemaining = this.cooldownTime;
    
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
    
    this.cooldownInterval = setInterval(() => {
      this.cooldownRemaining--;
      if (this.cooldownRemaining <= 0) {
        this.cooldownActive = false;
        clearInterval(this.cooldownInterval);
      }
    }, 1000);
  }

  addSuggestion(suggestion: string) {
    if (this.isLoading) {
      return;
    }
    this.taskService.addTask(suggestion);
    this.suggestions = this.suggestions.filter(s => s !== suggestion);
  }

  ngOnDestroy() {
    if (this.cooldownInterval) {
      clearInterval(this.cooldownInterval);
    }
  }
}
