// pages

// style
import { Routes, Route } from 'react-router-dom';
import './styles/app.scss';
import { Layout } from './components/Layout/Layout';
import { Login } from './pages/login/Login';

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
