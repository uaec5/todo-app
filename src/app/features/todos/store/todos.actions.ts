import { createAction, props } from '@ngrx/store';
import { Todo } from '../models/todo.model';

export const loadTodos = createAction('[Todos] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todos] Load Todos Success',
  props<{ todos: Todo[] }>()
);

export const addTodo = createAction(
  '[Todos] Add Todo',
  props<{ text: string }>()
);
export const addTodoSuccess = createAction(
  '[Todos] Add Todo Success',
  props<{ todo: Todo }>()
);

export const toggleTodo = createAction(
  '[Todos] Toggle Todo',
  props<{ id: string }>()
);
export const toggleTodoSuccess = createAction(
  '[Todos] Toggle Todo Success',
  props<{ todo: Todo }>()
);

export const deleteTodo = createAction(
  '[Todos] Delete Todo',
  props<{ id: string }>()
);
export const deleteTodoSuccess = createAction(
  '[Todos] Delete Todo Success',
  props<{ id: string }>()
);
