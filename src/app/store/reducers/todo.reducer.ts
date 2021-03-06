import { createReducer, on } from '@ngrx/store';
import uuid from 'uuid';
import { TodoInterface } from '../../services/todo.interface';
import { onClearCompleted, onCompleteAll, onCreate, onLoad, onRemove, onUpdate } from '../actions/todo.action';
import { selectCompleted, selectNotCompleted } from '../selectors/todo.selector';

export const createTodoReducer = (initialState: TodoInterface[] = []) =>
  createReducer(
    initialState,
    on(onLoad, (state: TodoInterface[], { todos }) => {
      return todos;
    }),
    on(onCreate, (state: TodoInterface[], { name }) => {
      return [...state, { id: uuid.v4(), name, completed: false }];
    }),
    on(onUpdate, (state: TodoInterface[], { values }) => {
      return state.map(
        todo => todo.id === values.id ? { ...todo, ...values } : todo
      );
    }),
    on(onRemove, (state: TodoInterface[], { id }) => {
      return state.filter(todo => todo.id !== id);
    }),
    on(onCompleteAll, (state: TodoInterface[]) => {
      const areAllCompleted = state.length && selectCompleted(state).length === state.length;
      return state.map(
        todo => ({ ...todo, ...{ completed: !areAllCompleted } })
      );
    }),
    on(onClearCompleted, (state: TodoInterface[]) => {
      return selectNotCompleted(state);
    })
  );
