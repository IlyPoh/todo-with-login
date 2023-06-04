// libraries
import classNames from 'classnames';

// types
import { ButtonProps } from '../../../types';
// style
import styles from './Button.module.scss';

export const Button: React.FC<ButtonProps> = ({
  text,
  classes = '',
  children,
  ...props
}: ButtonProps) => {
  const classList = classes.split(' ');

  const buttonClasses = classNames(
    ...classList.map((classItem) =>
      styles[classItem] ? styles[classItem] : classItem
    )
  );

  return (
    <button className={buttonClasses} {...props}>
      {text ?? children}
    </button>
  );
};
