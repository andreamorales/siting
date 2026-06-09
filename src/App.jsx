import { Route, Routes } from 'react-router-dom';
import DesignCanvasPage from './pages/DesignCanvasPage.jsx';
import ExperiencePage from './pages/ExperiencePage.jsx';
import HomePage from './pages/HomePage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/map" element={<ExperiencePage />} />
      <Route path="/canvas" element={<DesignCanvasPage />} />
    </Routes>
  );
}
