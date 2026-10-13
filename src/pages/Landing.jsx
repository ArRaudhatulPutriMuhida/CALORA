import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, GraduationCap, Leaf, ArrowRight, CheckCircle2, Calculator } from 'lucide-react';
import Tag from '../components/Tag.jsx';
import { rupiah } from '../utils/format.js';
import { sum } from '../utils/nutrition.js';
import { initialFoods } from '../data/foods.js';
import { targets } from '../data/nutrition.js';

export default function Landing({ foods = initialFoods }) {
    const [calcGroup, setCalcGroup] = useState('SD');
    const [calcQty, setCalcQty] = useState({ 1: 1, 2: 1, 4: 1, 5: 1 });

    const calcTotals = sum(foods, calcQty);
    const calcTarget = targets[calcGroup];

    const adjustQty = (id, delta) => {
        setCalcQty(prev => ({
            ...prev,
            [id]: Math.max(0, (prev[id] || 0) + delta)
        }));
    };

    return (
        <div className="landing">

            {/* Hero */}
            <div className="hero">
                <div className="hero-copy">
                    <Tag>PLATFORM MANAJEMEN GIZI</Tag>
                    <h1>
                        Gizi lebih terencana.<br />
                        <em>Hidup lebih berkualitas.</em>
                    </h1>
                    <p>
                        CALORA menyajikan solusi terintegrasi perencanaan nutrisi klinis rumah sakit
                        dan program pemenuhan gizi seimbang dengan kalkulasi terstandar.
                    </p>
                    <div className="hero-actions">
                        <Link className="btn primary" to="/mbg">
                            <Calculator size={17} /> Buka Kalkulator Gizi
                        </Link>
                        <Link className="btn outline" to="/dashboard">
                            Buka Dashboard
                        </Link>
                    </div>
                    <div className="hero-notes">
                        <span><CheckCircle2 size={16} /> Standar AKG Kemenkes</span>
                        <span><CheckCircle2 size={16} /> Kalkulasi Cepat & Presisi</span>
                    </div>
                </div>

                {/* Decorative Art */}
                <div className="hero-art">
                    <div className="art-ring">
                        <div className="art-center">
                            <Leaf size={65} />
                            <strong>CALORA</strong>
                            <span>Nutrition, simplified.</span>
                        </div>
                    </div>
                    <div className="art-float float-a">✦ Nutrisi seimbang</div>
                    <div className="art-float float-b">◉ Smart planning</div>
                </div>
            </div>

            {/* Quick Calculator Tool Directly on Home */}
            <section className="home-calc-section">
                <div className="section-heading">
                    <span className="eyebrow">TOOLS KALKULATOR GIZI</span>
                    <h2>Kalkulator Cepat Nutrisi & Porsi</h2>
                    <p className="muted">Hitung pemenuhan kalori, makronutrien, dan estimasi biaya per porsi secara instan</p>
                </div>

                <div className="home-calc-card">
                    <div className="calc-grid-layout">
                        <div>
                            <div className="card-title">
                                <h3>Pilih Kelompok Usia</h3>
                                <Tag tone="joy">{calcGroup}</Tag>
                            </div>
                            <div className="calc-age-pills">
                                {Object.keys(targets).map(g => (
                                    <button
                                        key={g}
                                        type="button"
                                        className={`calc-age-pill ${calcGroup === g ? 'active' : ''}`}
                                        onClick={() => setCalcGroup(g)}
                                    >
                                        Jenjang {g}
                                    </button>
                                ))}
                            </div>

                            <h4 style={{ margin: '14px 0 10px', fontSize: '13px', fontWeight: 800 }}>Pilih Menu Porsi Cepat</h4>
                            <div className="calc-food-list">
                                {foods.slice(0, 5).map(f => (
                                    <div className="calc-food-row" key={f.id}>
                                        <div className="calc-food-info">
                                            <b>{f.name}</b>
                                            <small>{f.calories} kkal · {rupiah(f.price)}</small>
                                        </div>
                                        <div className="stepper">
                                            <button type="button" aria-label={`Kurangi ${f.name}`} onClick={() => adjustQty(f.id, -1)}>−</button>
                                            <span>{calcQty[f.id] || 0}</span>
                                            <button type="button" aria-label={`Tambah ${f.name}`} onClick={() => adjustQty(f.id, 1)}>+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Panel */}
                        <div className="calc-summary-panel">
                            <div>
                                <div className="calc-summary-header">
                                    <small>ESTIMASI ENERGI PER PORSI</small>
                                    <h3>{Math.round(calcTotals.calories)} <span style={{ fontSize: '18px', color: 'var(--joy)' }}>kkal</span></h3>
                                    <span>Target AKG {calcTarget.calories} kkal ({Math.round(calcTotals.calories / calcTarget.calories * 100)}%)</span>
                                </div>

                                <div className="progress-track" style={{ marginTop: '12px', background: 'rgba(255,255,255,.15)' }}>
                                    <span style={{
                                        width: `${Math.min(100, (calcTotals.calories / calcTarget.calories) * 100)}%`,
                                        background: 'linear-gradient(90deg, var(--joy), var(--disgust))'
                                    }} />
                                </div>

                                <div className="calc-stat-row">
                                    <div className="calc-stat-col">
                                        <small>PROTEIN</small>
                                        <strong>{Math.round(calcTotals.protein * 10) / 10}g</strong>
                                    </div>
                                    <div className="calc-stat-col">
                                        <small>KARBO</small>
                                        <strong>{Math.round(calcTotals.carbs * 10) / 10}g</strong>
                                    </div>
                                    <div className="calc-stat-col">
                                        <small>LEMAK</small>
                                        <strong>{Math.round(calcTotals.fat * 10) / 10}g</strong>
                                    </div>
                                </div>

                                <div className="calc-cost-row">
                                    <span>Estimasi Biaya:</span>
                                    <span>{rupiah(calcTotals.price)}</span>
                                </div>
                            </div>

                            <Link to="/mbg" className="btn primary full" style={{ marginTop: '16px' }}>
                                <Calculator size={16} /> Buka Kalkulator Lengkap (MBG Planner) <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Feature Cards */}
            <div className="section-heading">
                <span className="eyebrow">MODUL UTAMA PLATFORM</span>
                <h2>Kelola gizi dengan lebih mudah & efisien</h2>
            </div>

            <div className="two-col">
                <Link className="feature-card" to="/hospital">
                    <span className="feature-icon"><HeartPulse /></span>
                    <h3>Hospital Nutrition</h3>
                    <p>
                        Perencanaan menu diet pasien berdasarkan kategori klinis
                        dan pemantauan distribusi makanan ruang rawat inap.
                    </p>
                    <span className="feature-link">Jelajahi modul <ArrowRight size={17} /></span>
                </Link>

                <Link className="feature-card" to="/mbg">
                    <span className="feature-icon blue"><GraduationCap /></span>
                    <h3>MBG Nutrition Planner</h3>
                    <p>
                        Susun menu terstandar, bandingkan target gizi kelompok usia anak sekolah,
                        dan kendalikan anggaran per porsi makan.
                    </p>
                    <span className="feature-link">Jelajahi modul <ArrowRight size={17} /></span>
                </Link>
            </div>

            <p className="disclaimer">
                CALORA dirancang untuk mendukung efisiensi perencanaan porsi dan estimasi nutrisi seimbang.
            </p>
        </div>
    );
}
