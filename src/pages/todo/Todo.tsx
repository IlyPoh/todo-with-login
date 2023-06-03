// modules
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';

// components
import { Button } from '../../components/UI/Button/Button';

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
    const todos = await fetch(`https://jsonplaceholder.typicode.com/todos`)
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

    const newTodo = {
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

  const filterTodo = useCallback(() => {
    let filtered = todos;

    if (filters.complitionFilter !== 'allComplitions') {
      filtered = filtered.filter((todo) =>
        filters.complitionFilter === 'completed'
          ? todo.completed
          : !todo.completed
      );
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
  }, [todos, filters, inputsValue]);

  const checkLocalStorageFavoriteState = () => {
    localStorage.favoriteTodos
      ? localStorage.favoriteTodos
      : (localStorage.favoriteTodos = JSON.stringify([]));

    setFavoriteTodos(JSON.parse(localStorage.favoriteTodos));
  };

  const handleFavourite = (id: number) => {
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

  const checkFavorite = (id: number) => {
    return favoriteTodos.includes(id);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userInfo = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      )
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
              <select
                onChange={handleComplitionFilterChange}
                value={filters.complitionFilter}
                name="complition"
                id="complition"
              >
                <option value="allComplitions">All</option>
                <option value="completed">Completed</option>
                <option value="uncompleted">Uncompleted</option>
                <option value="favourites">Favorites</option>
              </select>
            </div>
            <div className={styles['todo-filter']}>
              <select
                onChange={handleUserFilterChange}
                value={filters.userFilter}
                name="user"
                id="user"
              >
                <option value="allUsers">All</option>
                <option value={userId}>{userId}</option>
              </select>
            </div>
          </div>

          <ul className={styles['todo-list']}>
            {filteredTodos.length ? (
              filteredTodos.map((todo: ITodo) => (
                <li className={styles['todo-list-item']} key={todo.id}>
                  {todo.title}
                  <Button
                    classes={
                      checkFavorite(todo.id)
                        ? 'btn btn-star btn-star-active'
                        : 'btn btn-star'
                    }
                    onClick={() => handleFavourite(todo.id)}
                  >
                    <span className="icon-star" />
                  </Button>
                </li>
              ))
            ) : (
              <li className={styles['todo-list-item']}>No Todos</li>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};
