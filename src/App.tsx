// modules
import { Routes, Route } from 'react-router-dom';

// components
import { Layout } from './components/Layout/Layout';

// pages
import { Login } from './pages/login/Login';
import { Todo } from './pages/todo/Todo';

// style
import './styles/app.scss';

function App(): JSX.Element {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Login />} />
          <Route path="todo/:userId" element={<Todo />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
