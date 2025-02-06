import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DigitalClockComponent } from './shared/components/digital-clock/digital-clock.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, DigitalClockComponent],
  template: `
    <div class="container">
      <app-digital-clock></app-digital-clock>
      <h1>Todo App</h1>
      <div class="add-todo">
        <input [(ngModel)]="newTodo" placeholder="Add new todo" (keyup.enter)="addTodo()">
        <button (click)="addTodo()">Add</button>
      </div>
      <ul class="todo-list">
        <li *ngFor="let todo of todos; let i = index">
          <input type="checkbox" [(ngModel)]="todo.completed">
          <span [class.completed]="todo.completed">{{ todo.text }}</span>
          <button (click)="removeTodo(i)">Delete</button>
        </li>
      </ul>
    </div>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo-app';
  todos: { text: string; completed: boolean }[] = [];
  newTodo = '';

  addTodo() {
    if (this.newTodo.trim()) {
      this.todos.push({ text: this.newTodo.trim(), completed: false });
      this.newTodo = '';
    }
  }

  removeTodo(index: number) {
    this.todos.splice(index, 1);
  }
}
