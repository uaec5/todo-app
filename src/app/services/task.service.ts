import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task } from '../models/task.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  private storageKey = 'tasks';

  constructor() {
    this.loadTasks();
  }

  private loadTasks(): void {
    const savedTasks = localStorage.getItem(this.storageKey);
    if (savedTasks) {
      this.tasks = JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt)
      }));
      this.tasksSubject.next(this.tasks);
    }
  }

  private saveTasks(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
    this.tasksSubject.next(this.tasks);
  }

  getTasks(): Observable<Task[]> {
    return this.tasksSubject.asObservable();
  }

  addTask(title: string, aiSuggested: boolean = false): void {
    const newTask: Task = {
      id: uuidv4(),
      title,
      completed: false,
      aiSuggested,
      createdAt: new Date()
    };

    this.tasks.unshift(newTask);
    this.saveTasks();
  }

  updateTask(task: Task): void {
    const index = this.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      this.tasks[index] = { ...task };
      this.saveTasks();
    }
  }

  deleteTask(taskId: string): void {
    this.tasks = this.tasks.filter(task => task.id !== taskId);
    this.saveTasks();
  }

  toggleTask(taskId: string): void {
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTasks();
    }
  }
}
