// libraries
import { Dispatch, SetStateAction } from 'react';

// types
import { IFilters, IInputs, ITodo } from '../types';

export const handleAddChange = (
  event: React.ChangeEvent<HTMLInputElement>,
  inputsValue: IInputs,
  setInputsValue: Dispatch<SetStateAction<IInputs>>
) => {
  setInputsValue({ ...inputsValue, addValue: event.target.value });
};

export const handleAddTodo = (
  event: React.FormEvent<HTMLFormElement>,
  inputsValue: IInputs,
  setInputsValue: Dispatch<SetStateAction<IInputs>>,
  todos: ITodo[],
  setTodos: Dispatch<SetStateAction<ITodo[]>>,
  userId: string | undefined
) => {
  event.preventDefault();
  if (!inputsValue.addValue.trim()) return;

  const newTodo: ITodo = {
    userId: Number(userId),
    id: new Date().getTime(),
    title: inputsValue.addValue,
    completed: false,
  };

  setTodos([newTodo, ...todos]);
  setInputsValue({ ...inputsValue, addValue: '' });
};

export const handleComplitionFilterChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
  filters: IFilters,
  setFilters: Dispatch<SetStateAction<IFilters>>
) => {
  setFilters({ ...filters, complitionFilter: event.target.value });
};

export const handleUserFilterChange = (
  event: React.ChangeEvent<HTMLSelectElement>,
  filters: IFilters,
  setFilters: Dispatch<SetStateAction<IFilters>>
) => {
  setFilters({ ...filters, userFilter: event.target.value });
};

export const handleFavourite = (
  id: number,
  favoriteTodos: number[],
  setFavoriteTodos: Dispatch<SetStateAction<number[]>>
): void => {
  if (favoriteTodos.includes(id)) {
    const newFavoriteTodos = favoriteTodos.filter(
      (todoId: number) => todoId !== id
    );

    localStorage.favoriteTodos = JSON.stringify(newFavoriteTodos);
    setFavoriteTodos(newFavoriteTodos);
    return;
  }

  const newFavoriteTodos = [...favoriteTodos, id];

  localStorage.favoriteTodos = JSON.stringify(newFavoriteTodos);
  setFavoriteTodos(newFavoriteTodos);
};
