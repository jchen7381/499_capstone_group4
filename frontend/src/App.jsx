import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/login/login';
import Register from './pages/register/register';
import Workspace from './pages/workspace/workspace';
import Dashboard from './pages/dashboard/dashboard';
import Favorite from './pages/favorite/favorite';
import Library from './pages/library/library';
import DashboardContextProvider from './utility/DashboardContext';
import WorkspaceContextProvider from './utility/WorkspaceContext';
import RequireAuth from './utility/AuthRoute'; 

export default function App() {
  return (  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/workspace/:id" element={<RequireAuth><WorkspaceContextProvider><Workspace /></WorkspaceContextProvider></RequireAuth>} />
        <Route path="/dashboard" element={<RequireAuth><DashboardContextProvider><Dashboard /></DashboardContextProvider></RequireAuth>} />
        <Route path="/library" element={<RequireAuth><DashboardContextProvider><Library /></DashboardContextProvider></RequireAuth>} />
      </Routes>
    </BrowserRouter>
  );
}