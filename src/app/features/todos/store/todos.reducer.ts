import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Todo } from '../models/todo.model';
import * as TodoActions from './todos.actions';

export interface TodosState extends EntityState<Todo> {
  loading: boolean;
  error: string | null;
}

export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>();

export const initialState: TodosState = adapter.getInitialState({
  loading: false,
  error: null
});

export const todosReducer = createReducer(
  initialState,
  on(TodoActions.loadTodos, state => ({
    ...state,
    loading: true
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => 
    adapter.setAll(todos, { ...state, loading: false })
  ),
  on(TodoActions.addTodoSuccess, (state, { todo }) =>
    adapter.addOne(todo, state)
  ),
  on(TodoActions.toggleTodoSuccess, (state, { todo }) =>
    adapter.updateOne({ id: todo.id, changes: todo }, state)
  ),
  on(TodoActions.deleteTodoSuccess, (state, { id }) =>
    adapter.removeOne(id, state)
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
