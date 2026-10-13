import { Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/Sidebar.jsx';
import Card from './components/Card.jsx';

// Template dasar milik Anggota 1. Setelah kedua Pull Request fitur digabung,
// ganti file ini dengan integration/App.final.jsx dari ZIP Anggota 1.
function Welcome() {
  return (
    <Card>
      <h1>CALORA</h1>
      <p>Smart Nutrition Management Platform</p>
      <p>Template React + Vite siap. Modul aplikasi sedang diintegrasikan.</p>
      <p>Halaman Dashboard, Hospital, MBG, Recipes, dan Foods akan tersedia setelah merge.</p>
    </Card>
  );
}

export default function App() {
  return (
    <div className="app">
      <Sidebar open={false} close={() => {}} />
      <main className="main">
        <header className="topbar">
          <div className="breadcrumb"><Link to="/" className="breadcrumb-brand">CALORA</Link></div>
        </header>
        <div className="content">
          <Routes>
            <Route path="*" element={<Welcome />} />
          </Routes>
        </div>
        <footer>© 2026 CALORA · Smart Nutrition System. All rights reserved.</footer>
      </main>
    </div>
  );
}
