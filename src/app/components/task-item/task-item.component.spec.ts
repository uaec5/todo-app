import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskItemComponent } from './task-item.component';
import { TaskService } from '../../services/task.service';

describe('TaskItemComponent', () => {
  let component: TaskItemComponent;
  let fixture: ComponentFixture<TaskItemComponent>;
  let taskService: jasmine.SpyObj<TaskService>;

  beforeEach(async () => {
    taskService = jasmine.createSpyObj('TaskService', ['toggleTaskComplete', 'deleteTask']);

    await TestBed.configureTestingModule({
      imports: [TaskItemComponent],
      providers: [
        { provide: TaskService, useValue: taskService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskItemComponent);
    component = fixture.componentInstance;
    
    // Provide the required task input
    component.task = {
      id: '1',
      title: 'Test Task',
      completed: false,
      aiSuggested: false
    };
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task title', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.task-title')?.textContent).toContain('Test Task');
  });

  it('should toggle task completion', () => {
    component.toggleComplete();
    expect(taskService.toggleTaskComplete).toHaveBeenCalledWith('1');
  });

  it('should delete task', () => {
    component.deleteTask();
    expect(taskService.deleteTask).toHaveBeenCalledWith('1');
  });
});
