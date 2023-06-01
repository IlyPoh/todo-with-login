// modules
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// styles
import styles from './Todo.module.scss';
import { IUser, ITodo } from '../../types';

export const Todo: React.FC = () => {
  const { userId } = useParams();
  const [user, setUser] = useState<IUser | null>(null);
  const [todos, setTodos] = useState<ITodo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const userInfo = await fetch(
        `https://jsonplaceholder.typicode.com/users/${userId}`
      )
        .then((response) => response.json())
        .catch((error) => console.log(error));
      const todos = await fetch(
        `https://jsonplaceholder.typicode.com/todos?userId=${userId}`
      )
        .then((response) => response.json())
        .catch((error) => console.log(error));

      setTodos(todos);
      setUser(userInfo);
    };
    fetchTodos();
  }, [userId]);

  return (
    <>
      <div className={styles['todo']}>
        <div className={styles['todo-block']}>
          <div className={styles['todo-title']}>
            {user?.name ?? 'No username'}
          </div>

          <ul className={styles['todo-list']}>
            {todos.length ? (
              todos.map((todo: ITodo) => (
                <li className={styles['todo-list-item']} key={todo.id}>
                  {todo.title}
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
