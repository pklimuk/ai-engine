import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Configurator from './pages/Configurator';
import Admin from './pages/Admin';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="min-h-screen">
      {!isAdminPage && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Configurator />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {!isAdminPage && (
        <elevenlabs-convai agent-id="agent_6701k7v7hw5hebfsyk6nm81nnh0g"></elevenlabs-convai>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
