import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TodosState, adapter } from './todos.reducer';

export const selectTodosState = createFeatureSelector<TodosState>('todos');

export const {
  selectIds: selectTodoIds,
  selectEntities: selectTodoEntities,
  selectAll: selectAllTodos,
  selectTotal: selectTotalTodos,
} = adapter.getSelectors(selectTodosState);

export const selectTodosLoading = createSelector(
  selectTodosState,
  state => state.loading
);

export const selectTodosError = createSelector(
  selectTodosState,
  state => state.error
);
