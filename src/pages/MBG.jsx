import { useState, useMemo } from 'react';
import { UtensilsCrossed, Trash2, Wallet, CheckCircle2, AlertTriangle, Save, Info, BookOpen, Sparkles } from 'lucide-react';
import Card from '../components/Card.jsx';
import Heading from '../components/Heading.jsx';
import Tag from '../components/Tag.jsx';
import { rupiah } from '../utils/format.js';
import { sum, getRecipeNutrition, generateMealRecommendation } from '../utils/nutrition.js';
import { targets } from '../data/nutrition.js';

const NUTRIENT_ROWS = [
    ['Kalori', 'calories', 'kkal'],
    ['Protein', 'protein', 'g'],
    ['Karbohidrat', 'carbs', 'g'],
    ['Lemak', 'fat', 'g'],
];

export default function MBG({ foods, recipes = [], plans, setPlans, notify }) {
    const [group, setGroup] = useState('SD');
    const [budget, setBudget] = useState(15000);
    const [qty, setQty] = useState({ 1: 1, 2: 1, 4: 1, 5: 1 });
    const [recipeQty, setRecipeQty] = useState({});
    const [title, setTitle] = useState('Menu Bergizi Harian');
    const [itemTab, setItemTab] = useState('foods'); // 'foods' | 'recipes'

    // Total dari bahan makanan langsung
    const foodTotals = sum(foods, qty);

    // Total dari resep yang dipilih
    const recipeTotals = useMemo(() => {
        let calories = 0, protein = 0, carbs = 0, fat = 0, price = 0;
        Object.entries(recipeQty).forEach(([rid, count]) => {
            if (count > 0) {
                const rec = recipes.find(r => r.id === Number(rid));
                if (rec) {
                    const nutri = getRecipeNutrition(rec, foods);
                    calories += nutri.calories * count;
                    protein += nutri.protein * count;
                    carbs += nutri.carbs * count;
                    fat += nutri.fat * count;
                    price += nutri.price * count;
                }
            }
        });
        return { calories, protein, carbs, fat, price };
    }, [recipeQty, recipes, foods]);

    // Total gabungan
    const totals = {
        calories: foodTotals.calories + recipeTotals.calories,
        protein: foodTotals.protein + recipeTotals.protein,
        carbs: foodTotals.carbs + recipeTotals.carbs,
        fat: foodTotals.fat + recipeTotals.fat,
        price: foodTotals.price + recipeTotals.price,
    };

    const target = targets[group];
    const over = totals.price > Number(budget);

    const addFood = (id, change) =>
        setQty(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + change) }));

    const addRecipe = (id, change) =>
        setRecipeQty(prev => ({ ...prev, [id]: Math.max(0, (prev[id] || 0) + change) }));

    // FR-040: Smart Meal Recommendation
    const recommendation = useMemo(() => {
        return generateMealRecommendation(foods, target, Number(budget) || 15000);
    }, [foods, target, budget]);

    function handleApplyRecommendation() {
        if (!recommendation) return;
        setQty(recommendation.items);
        setRecipeQty({});
        setTitle(`Paket Rekomendasi ${group}`);
        notify('Rekomendasi menu cerdas berhasil diterapkan!');
    }

    function handleSavePlan() {
        setPlans(prev => [{
            id: Date.now(),
            title, group,
            budget: Number(budget),
            qty, recipeQty, totals,
            date: new Date().toLocaleString('id-ID'),
        }, ...prev]);
        notify('Rencana MBG berhasil disimpan');
    }

    function handleDeletePlan(id) {
        if (window.confirm('Hapus rencana ini?')) {
            setPlans(prev => prev.filter(p => p.id !== id));
        }
    }

    const canSave =
        title.trim() &&
        (Object.values(qty).some(n => n > 0) || Object.values(recipeQty).some(n => n > 0)) &&
        Number(budget) >= 0;

    return (
        <>
            <Heading
                eyebrow="MBG MODULE"
                title="MBG Nutrition Planner"
                description="Susun menu bergizi, hitung kandungan nutrisi, dan sesuaikan dengan anggaran per porsi anak sekolah."
            />

            {/* FR-040: Smart Meal Recommendation Card */}
            {recommendation && (
                <div className="smart-rec-box">
                    <div className="smart-rec-top">
                        <b><Sparkles size={18} color="#FFB800" /> Smart Meal Recommendation</b>
                        <button
                            type="button"
                            className="btn primary"
                            style={{ padding: '7px 14px', fontSize: '11px' }}
                            onClick={handleApplyRecommendation}
                        >
                            Terapkan Rekomendasi Menu
                        </button>
                    </div>
                    <div className="smart-rec-body">
                        <p>{recommendation.reason}</p>
                        <div className="smart-rec-stats">
                            <span>Energi: <b>{Math.round(recommendation.calories)} kkal</b></span>
                            <span>Protein: <b>{Math.round(recommendation.protein)} g</b></span>
                            <span>Karbo: <b>{Math.round(recommendation.carbs)} g</b></span>
                            <span>Lemak: <b>{Math.round(recommendation.fat)} g</b></span>
                            <span>Biaya: <b>{rupiah(recommendation.cost)}</b></span>
                        </div>
                    </div>
                </div>
            )}

            <div className="planner-grid">

                {/* Left Column */}
                <div className="stack">

                    {/* Settings */}
                    <Card>
                        <div className="card-title">
                            <h3>Pengaturan Perencanaan</h3>
                            <Tag>Kalkulator</Tag>
                        </div>

                        <label>
                            Nama rencana
                            <input
                                value={title}
                                maxLength={60}
                                onChange={e => setTitle(e.target.value)}
                            />
                        </label>

                        <label>
                            Kelompok usia (FR-024)
                            <select value={group} onChange={e => setGroup(e.target.value)}>
                                {Object.keys(targets).map(g => <option key={g}>{g}</option>)}
                            </select>
                        </label>

                        <label>
                            Batas anggaran per porsi (Rp) (FR-033)
                            <input
                                type="number"
                                min="0"
                                value={budget}
                                onChange={e => setBudget(e.target.value)}
                            />
                        </label>

                        <div className="notice compact">
                            <Info size={17} />
                            Target nutrisi dihitung berdasarkan Angka Kecukupan Gizi (AKG) per porsi makan menurut kelompok usia.
                        </div>
                    </Card>

                    {/* Food & Recipe Picker (FR-026 & FR-027 & FR-063) */}
                    <Card>
                        <div className="card-title">
                            <h3>Pilih Bahan Makanan & Resep</h3>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    type="button"
                                    className={`filter-pill ${itemTab === 'foods' ? 'active' : ''}`}
                                    onClick={() => setItemTab('foods')}
                                >
                                    Bahan Tunggal ({Object.values(qty).filter(v => v > 0).length})
                                </button>
                                <button
                                    type="button"
                                    className={`filter-pill ${itemTab === 'recipes' ? 'active' : ''}`}
                                    onClick={() => setItemTab('recipes')}
                                >
                                    Menu Resep ({Object.values(recipeQty).filter(v => v > 0).length})
                                </button>
                            </div>
                        </div>

                        {itemTab === 'foods' ? (
                            <div className="food-picker">
                                {foods.map(f => (
                                    <div className="food-pick" key={f.id}>
                                        <div className="food-icon"><UtensilsCrossed size={18} /></div>
                                        <div className="food-desc">
                                            <b>{f.name}</b>
                                            <small>{f.calories} kkal · {rupiah(f.price)}/porsi</small>
                                        </div>
                                        <div className="stepper">
                                            <button aria-label={`Kurangi ${f.name}`} onClick={() => addFood(f.id, -1)}>−</button>
                                            <span>{qty[f.id] || 0}</span>
                                            <button aria-label={`Tambah ${f.name}`} onClick={() => addFood(f.id, +1)}>+</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="food-picker">
                                {recipes.map(r => {
                                    const nutri = getRecipeNutrition(r, foods);
                                    return (
                                        <div className="food-pick" key={r.id}>
                                            <div className="food-icon" style={{ background: 'var(--joy-light)', color: '#7A5C00' }}>
                                                <BookOpen size={18} />
                                            </div>
                                            <div className="food-desc">
                                                <b>{r.name}</b>
                                                <small>{nutri.calories} kkal · {rupiah(nutri.price)}/porsi ({r.category})</small>
                                            </div>
                                            <div className="stepper">
                                                <button aria-label={`Kurangi ${r.name}`} onClick={() => addRecipe(r.id, -1)}>−</button>
                                                <span>{recipeQty[r.id] || 0}</span>
                                                <button aria-label={`Tambah ${r.name}`} onClick={() => addRecipe(r.id, +1)}>+</button>
                                            </div>
                                        </div>
                                    );
                                })}
                                {recipes.length === 0 && (
                                    <p className="muted">Belum ada menu resep. Tambahkan di Recipe Management.</p>
                                )}
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column */}
                <div className="stack">

                    {/* Nutrition Summary (FR-029 s/d FR-032, FR-036) */}
                    <Card className="result-card">
                        <div className="card-title">
                            <h3>Ringkasan Nutrisi</h3>
                            <Tag>Real-time</Tag>
                        </div>

                        <div className="result-big">
                            <span>Total Energi</span>
                            <strong>{Math.round(totals.calories)} <small>kkal</small></strong>
                            <p>Target AKG: {target.calories} kkal ({Math.round(totals.calories / target.calories * 100)}%)</p>
                        </div>

                        {NUTRIENT_ROWS.map(([label, key, unit]) => (
                            <div className="progress-row" key={key}>
                                <div>
                                    <span>{label}</span>
                                    <b>{Math.round(totals[key] * 10) / 10} / {target[key]} {unit} ({Math.round(totals[key] / target[key] * 100)}%)</b>
                                </div>
                                <div className="progress-track">
                                    <span style={{ width: `${Math.min(100, totals[key] / target[key] * 100)}%` }} />
                                </div>
                            </div>
                        ))}
                    </Card>

                    {/* Budget (FR-033 s/d FR-035) */}
                    <Card>
                        <div className="card-title">
                            <h3>Meal Budgeting</h3>
                            <Wallet size={21} color="#FFB800" />
                        </div>

                        <div className="budget-numbers">
                            <div>
                                <small>Total estimasi biaya</small>
                                <strong>{rupiah(totals.price)}</strong>
                            </div>
                            <div>
                                <small>Batas anggaran</small>
                                <strong>{rupiah(budget)}</strong>
                            </div>
                        </div>

                        <div className={`budget-status ${over ? 'over' : 'ok'}`}>
                            {over
                                ? <><AlertTriangle size={18} /> Melebihi anggaran sebesar {rupiah(totals.price - Number(budget))}</>
                                : <><CheckCircle2 size={18} /> Sesuai anggaran · sisa {rupiah(Number(budget) - totals.price)}</>
                            }
                        </div>

                        <button
                            className="btn primary full"
                            disabled={!canSave}
                            onClick={handleSavePlan}
                        >
                            <Save size={17} /> Simpan Rencana MBG
                        </button>
                    </Card>

                    {/* Saved Plans (FR-038 & FR-039) */}
                    <Card>
                        <div className="card-title">
                            <h3>Rencana Tersimpan</h3>
                            <Tag>{plans.length} rencana</Tag>
                        </div>

                        {plans.length > 0
                            ? plans.slice(0, 5).map(p => (
                                <div className="saved-plan" key={p.id}>
                                    <div>
                                        <b>{p.title}</b>
                                        <small>{p.group} · {p.date} · {rupiah(p.totals?.price)}</small>
                                    </div>
                                    <button
                                        className="icon-button"
                                        title="Hapus rencana"
                                        onClick={() => handleDeletePlan(p.id)}
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            ))
                            : <p className="muted">Belum ada rencana tersimpan.</p>
                        }
                    </Card>
                </div>
            </div>
        </>
    );
}
