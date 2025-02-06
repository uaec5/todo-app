import { TestBed } from '@angular/core/testing';
import { TaskService } from './task.service';
import { Task } from '../models/task.model';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaskService]
    });
    service = TestBed.inject(TaskService);
    // Clear tasks before each test
    service['tasks'] = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a task', () => {
    const title = 'Test Task';
    const aiSuggested = false;
    service.addTask(title, aiSuggested);
    
    const tasks = service.getTasks();
    expect(tasks.length).toBe(1);
    expect(tasks[0].title).toBe(title);
    expect(tasks[0].completed).toBeFalse();
    expect(tasks[0].aiSuggested).toBe(aiSuggested);
  });

  it('should toggle task completion', () => {
    const title = 'Test Task';
    service.addTask(title, false);
    const task = service.getTasks()[0];
    
    service.toggleTaskComplete(task.id);
    expect(service.getTasks()[0].completed).toBeTrue();
    
    service.toggleTaskComplete(task.id);
    expect(service.getTasks()[0].completed).toBeFalse();
  });

  it('should delete a task', () => {
    const title = 'Test Task';
    service.addTask(title, false);
    const task = service.getTasks()[0];
    
    service.deleteTask(task.id);
    expect(service.getTasks().length).toBe(0);
  });

  it('should get all tasks', () => {
    service.addTask('Task 1', false);
    service.addTask('Task 2', true);
    
    const tasks = service.getTasks();
    expect(tasks.length).toBe(2);
    expect(tasks[0].title).toBe('Task 1');
    expect(tasks[1].title).toBe('Task 2');
  });

  it('should generate unique IDs for tasks', () => {
    service.addTask('Task 1', false);
    service.addTask('Task 2', false);
    
    const tasks = service.getTasks();
    expect(tasks[0].id).not.toBe(tasks[1].id);
  });
});
