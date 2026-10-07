import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import RequireAuth from './components/RequireAuth.jsx';
import CasePage from './pages/CasePage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import DesignCanvasPage from './pages/DesignCanvasPage.jsx';
import ExperiencePage from './pages/ExperiencePage.jsx';
import HomePage from './pages/HomePage.jsx';
import NewCasePage from './pages/NewCasePage.jsx';
import SignInPage from './pages/SignInPage.jsx';

function LegacyCaseRedirect() {
  const { id } = useParams();
  const { search, hash } = useLocation();
  return <Navigate to={`/app/site/${id}${search}${hash}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/signin" element={<SignInPage />} />
      <Route path="/app" element={<RequireAuth><DashboardPage /></RequireAuth>} />
      <Route path="/app/new" element={<RequireAuth><NewCasePage /></RequireAuth>} />
      <Route path="/app/site/:id" element={<RequireAuth><CasePage /></RequireAuth>} />
      <Route path="/app/case/:id" element={<LegacyCaseRedirect />} />
      <Route path="/map" element={<ExperiencePage />} />
      <Route path="/canvas" element={<DesignCanvasPage />} />
    </Routes>
  );
}
