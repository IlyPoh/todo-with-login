// modules
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

// components
import { TodoList } from './TodoList/TodoList';
import { Button } from '../../components/UI/Button/Button';
import { Select } from '../../components/UI/Select/Select';

// utils
import { todoApi, userApi } from '../../utils/api';
import {
  complitionFilterOptions,
  userFilterOptions,
} from '../../utils/selectorOptions';

// types
import { IUser, ITodo, IFilters, IInputs } from '../../types';

// styles
import styles from './Todo.module.scss';

export const Todo: React.FC = () => {
  const { userId } = useParams<string>();
  const [user, setUser] = useState<IUser | null>(null);
  const [inputsValue, setInputsValue] = useState<IInputs>({
    addValue: '',
    searchValue: '',
  });
  const [filters, setFilters] = useState<IFilters>({
    complitionFilter: 'allComplitions',
    userFilter: 'allUsers',
  });
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<ITodo[]>([]);
  const [favoriteTodos, setFavoriteTodos] = useState(
    localStorage.favoriteTodos
  );

  const fetchAllTodos = async () => {
    const todos = await fetch(todoApi)
      .then((response) => response.json())
      .catch((error) => console.log(error));
    setTodos(todos);
  };

  const handleAddChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputsValue({ ...inputsValue, addValue: event.target.value });
  };

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
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

  const handleComplitionFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilters({ ...filters, complitionFilter: event.target.value });
  };

  const handleUserFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilters({ ...filters, userFilter: event.target.value });
  };

  const checkFavorite = (id: number): ITodo[] => {
    return favoriteTodos.includes(id);
  };

  const filterTodo = useCallback(() => {
    let filtered = todos;

    if (
      filters.complitionFilter !== 'allComplitions' &&
      filters.complitionFilter !== 'favourites'
    ) {
      filtered = filtered.filter((todo) =>
        filters.complitionFilter === 'completed'
          ? todo.completed
          : !todo.completed
      );
    }

    if (filters.complitionFilter === 'favourites') {
      filtered = filtered.filter((todo) => favoriteTodos.includes(todo.id));
    }

    if (filters.userFilter !== 'allUsers') {
      filtered = filtered.filter(
        (todo) => todo.userId === parseInt(filters.userFilter)
      );
    }

    if (inputsValue.searchValue) {
      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(inputsValue.searchValue.toLowerCase())
      );
    }

    setFilteredTodos(filtered);
  }, [todos, filters, inputsValue, favoriteTodos]);

  const checkLocalStorageFavoriteState = () => {
    localStorage.favoriteTodos
      ? localStorage.favoriteTodos
      : (localStorage.favoriteTodos = JSON.stringify([]));

    setFavoriteTodos(JSON.parse(localStorage.favoriteTodos));
  };

  const handleFavourite = (id: number): void => {
    if (checkFavorite(id)) {
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

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await fetch(`${userApi}/${userId}`)
        .then((response) => response.json())
        .catch((error) => console.log(error));
      setUser(userInfo);
    };
    fetchUser();
    fetchAllTodos();
    checkLocalStorageFavoriteState();
  }, [userId]);

  useEffect(() => {
    filterTodo();
  }, [filterTodo]);

  return (
    <>
      <div className={styles['todo']}>
        <div className={styles['todo-block']}>
          <div className={styles['todo-title']}>
            {user?.name ?? 'No username'}
          </div>

          <form onSubmit={handleAddTodo} className={styles['todo-add']}>
            <input
              onChange={handleAddChange}
              value={inputsValue.addValue}
              type="text"
            />
            <Button type="submit" classes="btn btn-green" text="Add" />
          </form>

          <div className={styles['todo-filters']}>
            <input
              type="text"
              value={inputsValue.searchValue}
              onChange={(e) =>
                setInputsValue({ ...inputsValue, searchValue: e.target.value })
              }
            />
            <div className={styles['todo-filter']}>
              <Select
                options={complitionFilterOptions}
                onChange={handleComplitionFilterChange}
                value={filters.complitionFilter}
                name="complition"
                id="complition"
              />
            </div>
            <div className={styles['todo-filter']}>
              <Select
                options={userFilterOptions(userId)}
                onChange={handleUserFilterChange}
                value={filters.userFilter}
                name="user"
                id="user"
              />
            </div>
          </div>

          <TodoList
            filteredTodos={filteredTodos}
            checkFavorite={checkFavorite}
            handleFavourite={handleFavourite}
          />
        </div>
      </div>
    </>
  );
};
