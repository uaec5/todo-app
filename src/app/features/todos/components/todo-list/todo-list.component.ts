import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import * as TodoActions from '../../store/todos.actions';
import * as TodoSelectors from '../../store/todos.selectors';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.todos$ = this.store.select(TodoSelectors.selectAllTodos);
    this.loading$ = this.store.select(TodoSelectors.selectTodosLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  onAddTodo(text: string): void {
    this.store.dispatch(TodoActions.addTodo({ text }));
  }

  onToggleTodo(id: string): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  onDeleteTodo(id: string): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }
}
