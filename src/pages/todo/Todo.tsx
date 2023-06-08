// modules
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

// components
import { TodoList } from './TodoList/TodoList';
import { Button } from '../../components/UI/Button/Button';
import { Select } from '../../components/UI/Select/Select';

// utils
import { todoApi, userApi } from '../../utils/api';
import {
  handleAddChange,
  handleAddTodo,
  handleComplitionFilterChange,
  handleFavourite,
  handleUserFilterChange,
} from '../../utils/handlers';
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
  const [favoriteTodos, setFavoriteTodos] = useState<number[]>(
    useMemo(() => localStorage.favoriteTodos, [])
  );

  const fetchAllTodos = useCallback(async () => {
    try {
      const response = await fetch(todoApi);
      const todos = await response.json();
      setTodos(todos);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const checkFavorite = (id: number): boolean => {
    return favoriteTodos.includes(id);
  };

  const filteredTodos = useMemo(() => {
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
      const searchValueLower = inputsValue.searchValue.toLowerCase();

      filtered = filtered.filter((todo) =>
        todo.title.toLowerCase().includes(searchValueLower)
      );
    }
    return filtered;
  }, [todos, filters, inputsValue, favoriteTodos]);

  const checkLocalStorageFavoriteState = () => {
    const storedFavoriteTodos = localStorage.getItem('favoriteTodos');
    if (!storedFavoriteTodos) {
      localStorage.setItem('favoriteTodos', JSON.stringify([]));
    } else {
      setFavoriteTodos(JSON.parse(storedFavoriteTodos));
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${userApi}/${userId}`);
        const userInfo = await response.json();
        setUser(userInfo);
      } catch (error) {
        console.log(error);
      }
    };

    fetchUser();
    fetchAllTodos();
    checkLocalStorageFavoriteState();
  }, [userId, fetchAllTodos]);

  return (
    <div className={styles['todo']}>
      <div className={styles['todo-block']}>
        <div className={styles['todo-title']}>
          {user?.name ?? 'No username'}
        </div>

        <form
          onSubmit={(event) =>
            handleAddTodo(
              event,
              inputsValue,
              setInputsValue,
              todos,
              setTodos,
              userId
            )
          }
          className={styles['todo-add']}
        >
          <input
            onChange={(event) =>
              handleAddChange(event, inputsValue, setInputsValue)
            }
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
              onChange={(event) =>
                handleComplitionFilterChange(event, filters, setFilters)
              }
              value={filters.complitionFilter}
              name="complition"
              id="complition"
            />
          </div>

          <div className={styles['todo-filter']}>
            <Select
              options={userFilterOptions(userId)}
              onChange={(event) =>
                handleUserFilterChange(event, filters, setFilters)
              }
              value={filters.userFilter}
              name="user"
              id="user"
            />
          </div>
        </div>

        <TodoList
          filteredTodos={filteredTodos}
          checkFavorite={checkFavorite}
          handleFavourite={(id) =>
            handleFavourite(id, favoriteTodos, setFavoriteTodos)
          }
        />
      </div>
    </div>
  );
};
