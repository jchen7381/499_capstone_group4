import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/home/home';
import Login from './pages/login/login';
import Register from './pages/register/register';
import Workspace from './pages/workspace/workspace';
import Dashboard from './pages/dashboard/dashboard';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workspace" element={<Workspace />} />
        <Route path="/dashboard/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}