import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Todo } from '../models/todo.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todos: Todo[] = [];

  getTodos(): Observable<Todo[]> {
    return of(this.todos);
  }

  addTodo(text: string): Observable<Todo> {
    const todo: Todo = {
      id: uuidv4(),
      text,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.todos.push(todo);
    return of(todo);
  }

  toggleTodo(id: string): Observable<Todo> {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = new Date();
      return of({ ...todo });
    }
    throw new Error('Todo not found');
  }

  deleteTodo(id: string): Observable<void> {
    const index = this.todos.findIndex(t => t.id === id);
    if (index !== -1) {
      this.todos.splice(index, 1);
      return of(void 0);
    }
    throw new Error('Todo not found');
  }
}
