import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Menu, CheckCircle2, ChevronRight, Home, Calculator } from 'lucide-react';
import Card from './components/Card.jsx';
import Sidebar from './components/Sidebar.jsx';
import useLocalStorage from './hooks/useLocalStorage.js';
import { initialFoods } from './data/foods.js';
import { initialPatients } from './data/patients.js';
import { initialRecipes } from './data/recipes.js';
import Dashboard from './pages/Dashboard.jsx';
import Foods from './pages/Foods.jsx';
import Hospital from './pages/Hospital.jsx';
import Landing from './pages/Landing.jsx';
import MBG from './pages/MBG.jsx';
import Recipes from './pages/Recipes.jsx';

export default function App() {
    const [foods, setFoods] = useLocalStorage('calora-foods', initialFoods);
    const [recipes, setRecipes] = useLocalStorage('calora-recipes', initialRecipes);
    const [patients, setPatients] = useLocalStorage('calora-patients', initialPatients);
    const [plans, setPlans] = useLocalStorage('calora-mbg-plans', []);
    const [hospitalPlans, setHospitalPlans] = useLocalStorage('calora-hospital-plans', {});
    const [menuOpen, setMenuOpen] = useState(false);
    const [toast, setToast] = useState('');

    const loc = useLocation();

    // Close sidebar on route change
    useEffect(() => { setMenuOpen(false); }, [loc.pathname]);

    // Auto-dismiss toast
    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(''), 3000);
        return () => clearTimeout(timer);
    }, [toast]);

    const pageLabel = loc.pathname === '/'
        ? 'Beranda'
        : loc.pathname.replace('/', '').toUpperCase();

    return (
        <div className="app">
            <Sidebar open={menuOpen} close={() => setMenuOpen(false)} />

            <main className="main">

                {/* Top Bar */}
                <header className="topbar">
                    <button
                        className="mobile-menu icon-button"
                        onClick={() => setMenuOpen(true)}
                        aria-label="Buka menu"
                    >
                        <Menu size={23} />
                    </button>

                    <div className="breadcrumb">
                        <Link to="/" className="breadcrumb-brand">CALORA</Link>
                        <ChevronRight size={14} />
                        <b>{pageLabel}</b>
                    </div>

                    <div className="top-right">
                        {loc.pathname !== '/' && (
                            <Link to="/" className="top-nav-btn" title="Kembali ke Beranda">
                                <Home size={15} />
                                <span>Beranda</span>
                            </Link>
                        )}
                        <Link to="/mbg" className="top-calc-btn" title="Buka Kalkulator Gizi">
                            <Calculator size={15} />
                            <span>Kalkulator Gizi</span>
                        </Link>
                        <span className="top-avatar">C</span>
                    </div>
                </header>

                {/* Page Content */}
                <div className={`content ${loc.pathname === '/' ? 'home-content' : ''}`}>
                    <Routes>
                        <Route path="/" element={<Landing foods={foods} />} />
                        <Route path="/dashboard" element={
                            <Dashboard
                                foods={foods}
                                recipes={recipes}
                                plans={plans}
                                hospitalPlans={hospitalPlans}
                                patients={patients}
                            />
                        } />
                        <Route path="/hospital" element={
                            <Hospital
                                foods={foods}
                                recipes={recipes}
                                plans={hospitalPlans}
                                setPlans={setHospitalPlans}
                                notify={setToast}
                                patients={patients}
                                setPatients={setPatients}
                            />
                        } />
                        <Route path="/mbg" element={
                            <MBG
                                foods={foods}
                                recipes={recipes}
                                plans={plans}
                                setPlans={setPlans}
                                notify={setToast}
                            />
                        } />
                        <Route path="/recipes" element={
                            <Recipes
                                recipes={recipes}
                                setRecipes={setRecipes}
                                foods={foods}
                                notify={setToast}
                            />
                        } />
                        <Route path="/foods" element={
                            <Foods
                                foods={foods}
                                setFoods={setFoods}
                                notify={setToast}
                            />
                        } />
                        <Route path="*" element={
                            <Card>
                                <h2>Halaman tidak ditemukan</h2>
                                <Link className="btn primary" to="/dashboard">Kembali ke Dashboard</Link>
                            </Card>
                        } />
                    </Routes>
                </div>

                <footer>© 2026 CALORA · Smart Nutrition System. All rights reserved.</footer>
            </main>

            {/* Toast */}
            {toast && (
                <div role="status" className="toast">
                    <CheckCircle2 size={19} /> {toast}
                </div>
            )}
        </div>
    );
}
