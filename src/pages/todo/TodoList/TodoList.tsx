// components
import { Button } from '../../../components/UI/Button/Button';

// types
import { ITodo } from '../../../types';

// styles
import styles from './TodoList.module.scss';

interface TodoListProps {
  filteredTodos: ITodo[];
  checkFavorite: (id: number) => boolean;
  handleFavourite: (id: number) => void;
}

export const TodoList = ({
  filteredTodos,
  checkFavorite,
  handleFavourite,
}: TodoListProps) => {
  return (
    <>
      <ul className={styles['list']}>
        {filteredTodos.length ? (
          filteredTodos.map((todo: ITodo) => (
            <li className={styles['list-item']} key={todo.id}>
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
          <li className={styles['list-item']}>No Todos</li>
        )}
      </ul>
    </>
  );
};
