import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, GraduationCap, UtensilsCrossed, ArrowRight, Users, ClipboardList, Info, BookOpen } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import Card from '../components/Card.jsx';
import Heading from '../components/Heading.jsx';
import Stat from '../components/Stat.jsx';
import Tag from '../components/Tag.jsx';
import { rupiah } from '../utils/format.js';
import { initialPatients } from '../data/patients.js';

export default function Dashboard({ foods, recipes = [], plans = [], hospitalPlans = {}, patients = initialPatients }) {
    const [chartMode, setChartMode] = useState('diet'); // 'diet' | 'foods'

    // FR-006: Grafik kategori diet pasien
    const dietCounts = useMemo(() => {
        const counts = {};
        patients.forEach(p => {
            counts[p.diet] = (counts[p.diet] || 0) + 1;
        });
        return Object.entries(counts).map(([name, jumlah]) => ({ name, jumlah }));
    }, [patients]);

    const foodCounts = [
        { name: 'Karbo', jumlah: foods.filter(f => f.category === 'Karbohidrat').length },
        { name: 'Protein', jumlah: foods.filter(f => f.category === 'Protein').length },
        { name: 'Sayur', jumlah: foods.filter(f => f.category === 'Sayuran').length },
        { name: 'Buah', jumlah: foods.filter(f => f.category === 'Buah').length },
    ];

    // FR-008: Aktivitas terbaru
    const recentActivities = useMemo(() => {
        const acts = [];
        // Dari hospital plans
        Object.entries(hospitalPlans).forEach(([pid, plan]) => {
            acts.push({
                id: `hosp-${pid}`,
                type: 'hospital',
                title: `Rencana Diet: ${plan.patient}`,
                desc: `${plan.slot} · ${plan.meal} (Diet ${plan.diet})`,
                date: plan.date || 'Terkini',
            });
        });
        // Dari mbg plans
        plans.slice(0, 3).forEach(p => {
            acts.push({
                id: `mbg-${p.id}`,
                type: 'mbg',
                title: `Paket MBG: ${p.title}`,
                desc: `Jenjang ${p.group} · ${rupiah(p.totals?.price)}`,
                date: p.date || 'Terkini',
            });
        });
        return acts.slice(0, 4);
    }, [hospitalPlans, plans]);

    return (
        <>
            <Heading
                eyebrow="OVERVIEW"
                title="Dashboard"
                description="Selamat datang di CALORA. Pantau ringkasan perencanaan gizi dari satu tempat."
            />

            {/* Stat Cards (FR-002 s/d FR-005) */}
            <div className="stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
                <Stat icon={Users} label="Pasien Terdata" value={patients.length} foot="Rawat inap aktif" />
                <Stat icon={UtensilsCrossed} label="Bahan Makanan" value={foods.length} foot="Dalam katalog" />
                <Stat icon={BookOpen} label="Resep Tersedia" value={recipes.length} foot="Koleksi menu resep" />
                <Stat icon={ClipboardList} label="Rencana MBG" value={plans.length} foot="Menu siap distribusi" />
                <Stat icon={HeartPulse} label="Rencana Diet" value={Object.keys(hospitalPlans).length} foot="Pasien dengan menu" />
            </div>

            <div className="two-col dashboard-grid">

                {/* Charts (FR-006 & FR-009) */}
                <Card>
                    <div className="card-title">
                        <h3>{chartMode === 'diet' ? 'Sebaran Kategori Diet Pasien' : 'Komposisi Bahan Makanan'}</h3>
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                                type="button"
                                className={`filter-pill ${chartMode === 'diet' ? 'active' : ''}`}
                                onClick={() => setChartMode('diet')}
                            >
                                Diet Pasien
                            </button>
                            <button
                                type="button"
                                className={`filter-pill ${chartMode === 'foods' ? 'active' : ''}`}
                                onClick={() => setChartMode('foods')}
                            >
                                Bahan Makanan
                            </button>
                        </div>
                    </div>
                    <p className="muted">
                        {chartMode === 'diet'
                            ? 'Jumlah pasien aktif berdasarkan klasifikasi instruksi diet medis'
                            : 'Jumlah bahan makanan berdasarkan kategori nutrisi utama'}
                    </p>
                    <div className="chart">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={chartMode === 'diet' ? dietCounts : foodCounts}
                                margin={{ top: 20, right: 8, bottom: 25, left: -25 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8efeb" />
                                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                                <Tooltip />
                                <Bar
                                    dataKey="jumlah"
                                    fill={chartMode === 'diet' ? '#4A90D9' : '#FFB800'}
                                    radius={[8, 8, 0, 0]}
                                    barSize={38}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                {/* Quick Links (FR-007) & Recent Activities (FR-008) */}
                <div className="stack">
                    <Card>
                        <div className="card-title"><h3>Akses Cepat Modul</h3></div>
                        <p className="muted">Lanjutkan aktivitas perencanaan gizi</p>
                        <div className="quick-links">
                            <Link to="/hospital">
                                <span className="quick-icon"><HeartPulse /></span>
                                <span><b>Hospital Nutrition</b><small>Atur menu diet medis pasien</small></span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link to="/mbg">
                                <span className="quick-icon"><GraduationCap /></span>
                                <span><b>MBG Nutrition Planner</b><small>Hitung gizi dan budgeting porsi</small></span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link to="/recipes">
                                <span className="quick-icon" style={{ background: 'linear-gradient(135deg, #9B59B6, #7B3FA8)' }}>
                                    <BookOpen />
                                </span>
                                <span><b>Recipe Management</b><small>Kelola komposisi menu resep</small></span>
                                <ArrowRight size={18} />
                            </Link>
                            <Link to="/foods">
                                <span className="quick-icon"><UtensilsCrossed /></span>
                                <span><b>Food Management</b><small>Kelola database bahan makanan</small></span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    </Card>

                    {/* FR-008: Aktivitas Perencanaan Terbaru */}
                    <Card>
                        <div className="card-title">
                            <h3>Aktivitas Perencanaan Terbaru</h3>
                            <Tag>{recentActivities.length} aktivitas</Tag>
                        </div>
                        {recentActivities.length > 0 ? (
                            <div className="activity-list">
                                {recentActivities.map(act => (
                                    <div className="activity-item" key={act.id}>
                                        <div className="activity-icon">
                                            {act.type === 'hospital' ? <HeartPulse size={16} /> : <GraduationCap size={16} />}
                                        </div>
                                        <div className="activity-info">
                                            <b>{act.title}</b>
                                            <small>{act.desc}</small>
                                        </div>
                                        <span className="activity-time">{act.date}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="muted">Belum ada aktivitas perencanaan tersimpan.</p>
                        )}
                    </Card>
                </div>
            </div>

            <div className="notice">
                <Info size={18} />
                Seluruh data statistik dan grafik dihitung secara dinamis dari database lokal aplikasi secara real-time.
            </div>
        </>
    );
}
