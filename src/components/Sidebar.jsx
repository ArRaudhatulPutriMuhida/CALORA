import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, HeartPulse, UtensilsCrossed, Leaf, ChevronRight, Home, Calculator, BookOpen } from 'lucide-react';

const NAV_ITEMS = [
    ['/', Home, 'Beranda'],
    ['/dashboard', LayoutDashboard, 'Dashboard'],
    ['/hospital', HeartPulse, 'Hospital Nutrition'],
    ['/mbg', Calculator, 'MBG Planner'],
    ['/recipes', BookOpen, 'Recipe Management'],
    ['/foods', UtensilsCrossed, 'Food Management'],
];

export default function Sidebar({ open, close }) {
    return (
        <>
            <div className={`scrim ${open ? 'show' : ''}`} onClick={close} />
            <aside className={`sidebar ${open ? 'open' : ''}`}>

                {/* Brand */}
                <Link to="/" className="brand" onClick={close}>
                    <span className="brandmark"><Leaf size={23} /></span>
                    <span>
                        CALORA
                        <small>SMART NUTRITION</small>
                    </span>
                </Link>

                {/* Navigation */}
                <div className="nav-caption">WORKSPACE</div>
                <nav>
                    {NAV_ITEMS.map(([to, Icon, label]) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={close}
                            className={({ isActive }) => `navlink ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={19} />
                            {label}
                            <ChevronRight className="chevron" size={15} />
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
}
