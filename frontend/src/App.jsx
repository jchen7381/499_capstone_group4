import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Workspace from './pages/workspace/workspace';
import Dashboard from './pages/dashboard/dashboard';
import Favorite from './pages/favorite/favorite';
import Library from './pages/library/library';
import Recent from './pages/recent/recent';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/dashboard/" element={<Dashboard />} />
        <Route path="/favorite" element={<Favorite />} />
        <Route path="/recent" element={<Recent />} />
        <Route path="/library" element={<Library />} />
      </Routes>
    </BrowserRouter>
  );
}

