import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { TodoService } from '../services/todo.service';
import * as TodoActions from './todos.actions';

@Injectable()
export class TodosEffects {
  loadTodos$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      mergeMap(() =>
        this.todoService.getTodos().pipe(
          map(todos => TodoActions.loadTodosSuccess({ todos })),
          catchError(error => of({ type: '[Todos] Load Error', payload: error }))
        )
      )
    )
  );

  addTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.addTodo),
      mergeMap(action =>
        this.todoService.addTodo(action.text).pipe(
          map(todo => TodoActions.addTodoSuccess({ todo })),
          catchError(error => of({ type: '[Todos] Add Error', payload: error }))
        )
      )
    )
  );

  toggleTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      mergeMap(action =>
        this.todoService.toggleTodo(action.id).pipe(
          map(todo => TodoActions.toggleTodoSuccess({ todo })),
          catchError(error => of({ type: '[Todos] Toggle Error', payload: error }))
        )
      )
    )
  );

  deleteTodo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap(action =>
        this.todoService.deleteTodo(action.id).pipe(
          map(() => TodoActions.deleteTodoSuccess({ id: action.id })),
          catchError(error => of({ type: '[Todos] Delete Error', payload: error }))
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private todoService: TodoService
  ) {}
