import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';

import styles from './Layout.module.scss';
import { Footer } from '../Footer/Footer';

export const Layout: React.FC = () => {
  return (
    <>
      <Header />

      <div className={styles['content']}>
        <Outlet />
      </div>

      <Footer />
    </>
  );
};
