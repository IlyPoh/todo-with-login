import { Button } from '../../UI/Button/Button';
import styles from './Login.module.scss';

export const Login: React.FC = () => {
  return (
    <>
      <div className={styles['block']}>
        <form className={styles['form']} action="submit">
          <div className={styles['title']}>
            <span>description</span>
          </div>
          <div className={styles['body']}>
            <div className={styles['information']}>description</div>
            <input type="text" placeholder="Username" />
            <input type="text" placeholder="Phone Number" />
            <Button classes="btn btn-green" text="Register" />
          </div>
        </form>
      </div>
    </>
  );
};
