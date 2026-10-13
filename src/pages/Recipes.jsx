import { useState, useMemo } from 'react';
import { X, Plus, Search, Trash2, Pencil, RefreshCcw, Save } from 'lucide-react';
import Card from '../components/Card.jsx';
import Heading from '../components/Heading.jsx';
import Tag from '../components/Tag.jsx';
import { rupiah } from '../utils/format.js';
import { getRecipeNutrition } from '../utils/nutrition.js';
import { initialRecipes } from '../data/recipes.js';

const RECIPE_CATEGORIES = ['Menu Utama', 'Diet Medis', 'Pascaoperasi', 'Menu Umum', 'Kudapan Sehat'];

export default function Recipes({ recipes, setRecipes, foods, notify }) {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const [editing, setEditing] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [formName, setFormName] = useState('');
    const [formCategory, setFormCategory] = useState('Menu Utama');
    const [formServings, setFormServings] = useState(1);
    const [formItems, setFormItems] = useState([]); // [{ foodId, qty }]

    function openModal(recipe = null) {
        if (recipe) {
            setEditing(recipe.id);
            setFormName(recipe.name);
            setFormCategory(recipe.category);
            setFormServings(recipe.servings || 1);
            setFormItems([...(recipe.items || [])]);
        } else {
            setEditing(null);
            setFormName('');
            setFormCategory('Menu Utama');
            setFormServings(1);
            // Default 1 bahan
            setFormItems([{ foodId: foods[0]?.id || 1, qty: 1 }]);
        }
        setShowModal(true);
    }

    function handleAddItem() {
        setFormItems(prev => [...prev, { foodId: foods[0]?.id || 1, qty: 1 }]);
    }

    function handleRemoveItem(idx) {
        setFormItems(prev => prev.filter((_, i) => i !== idx));
    }

    function handleItemChange(idx, field, val) {
        setFormItems(prev => prev.map((item, i) => {
            if (i === idx) {
                return { ...item, [field]: field === 'foodId' ? Number(val) : Math.max(0.1, Number(val)) };
            }
            return item;
        }));
    }

    // Hitung live nutrisi form
    const currentNutri = useMemo(() => {
        return getRecipeNutrition({ servings: formServings, items: formItems }, foods);
    }, [formServings, formItems, foods]);

    function handleSave(e) {
        e.preventDefault();
        if (!formName.trim() || formItems.length === 0) {
            notify('Mohon lengkapi nama resep dan minimal satu bahan');
            return;
        }

        const data = {
            name: formName.trim(),
            category: formCategory,
            servings: Math.max(1, Number(formServings)),
            items: formItems,
        };

        if (editing) {
            setRecipes(prev => prev.map(r => r.id === editing ? { ...data, id: editing } : r));
            notify('Resep berhasil diperbarui');
        } else {
            setRecipes(prev => [...prev, { ...data, id: Date.now() }]);
            notify('Resep baru berhasil ditambahkan');
        }
        setShowModal(false);
    }

    function handleDelete(recipe) {
        if (window.confirm(`Hapus resep "${recipe.name}"?`)) {
            setRecipes(prev => prev.filter(r => r.id !== recipe.id));
            notify('Resep berhasil dihapus');
        }
    }

    function handleReset() {
        if (window.confirm('Kembalikan seluruh resep ke data awal?')) {
            setRecipes(initialRecipes);
            notify('Data resep berhasil direset');
        }
    }

    const filtered = recipes.filter(r => {
        const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === 'Semua' || r.category === categoryFilter;
        return matchSearch && matchCat;
    });

    return (
        <>
            <Heading
                eyebrow="RECIPE MODULE"
                title="Recipe Management"
                description="Kelola komposisi menu resep, takaran bahan, serta kalkulasi otomatis nutrisi dan biaya per porsi."
            />

            <Card>
                {/* Toolbar */}
                <div className="table-actions">
                    <div className="search">
                        <Search size={18} />
                        <input
                            placeholder="Cari resep..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="action-group">
                        <button className="btn outline" onClick={handleReset}>
                            <RefreshCcw size={16} /> Reset Resep
                        </button>
                        <button className="btn primary" onClick={() => openModal()}>
                            <Plus size={17} /> Tambah Resep
                        </button>
                    </div>
                </div>

                {/* Filter Pills */}
                <div className="filter-pills">
                    {['Semua', ...RECIPE_CATEGORIES].map(cat => (
                        <button
                            key={cat}
                            type="button"
                            className={`filter-pill ${categoryFilter === cat ? 'active' : ''}`}
                            onClick={() => setCategoryFilter(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Recipe Grid (FR-054) */}
                <div className="recipe-grid">
                    {filtered.map(recipe => {
                        const nutri = getRecipeNutrition(recipe, foods);
                        return (
                            <Card className="recipe-card" key={recipe.id}>
                                <div>
                                    <div className="recipe-header">
                                        <div>
                                            <Tag tone="joy">{recipe.category}</Tag>
                                            <h3 style={{ marginTop: '8px' }}>{recipe.name}</h3>
                                        </div>
                                        <div className="table-buttons">
                                            <button className="icon-button" title="Edit" onClick={() => openModal(recipe)}>
                                                <Pencil size={16} />
                                            </button>
                                            <button className="icon-button danger" title="Hapus" onClick={() => handleDelete(recipe)}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Bahan Penyusun (FR-056 & FR-057) */}
                                    <div className="recipe-ingredients-box">
                                        <small>Komposisi Bahan ({recipe.servings || 1} Porsi):</small>
                                        <div className="recipe-ingredients-tags">
                                            {(recipe.items || []).map((item, idx) => {
                                                const food = foods.find(f => f.id === item.foodId);
                                                return (
                                                    <span className="recipe-ing-chip" key={idx}>
                                                        {food?.name || 'Bahan'} × {item.qty}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Nutrisi per porsi (FR-058 & FR-059) */}
                                    <div className="recipe-nutri-grid">
                                        <div className="recipe-nutri-item">
                                            <small>ENERGI</small>
                                            <b>{nutri.calories} kkal</b>
                                        </div>
                                        <div className="recipe-nutri-item">
                                            <small>PROTEIN</small>
                                            <b>{nutri.protein} g</b>
                                        </div>
                                        <div className="recipe-nutri-item">
                                            <small>KARBO</small>
                                            <b>{nutri.carbs} g</b>
                                        </div>
                                        <div className="recipe-nutri-item">
                                            <small>LEMAK</small>
                                            <b>{nutri.fat} g</b>
                                        </div>
                                    </div>
                                </div>

                                <div className="recipe-card-footer">
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700 }}>
                                        Biaya per porsi:
                                    </span>
                                    <span className="recipe-price-tag">
                                        {rupiah(nutri.price)}
                                    </span>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {filtered.length === 0 && (
                    <div className="empty">Tidak ada resep yang sesuai.</div>
                )}
            </Card>

            {/* Modal Tambah / Edit Resep (FR-055 s/d FR-060) */}
            {showModal && (
                <div className="modal-backdrop" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()} style={{ width: 'min(100%, 620px)' }}>
                        <div className="card-title">
                            <h3>{editing ? 'Edit Resep' : 'Tambah Resep Baru'}</h3>
                            <button className="icon-button" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <label>
                                Nama resep
                                <input
                                    required
                                    value={formName}
                                    maxLength={70}
                                    onChange={e => setFormName(e.target.value)}
                                    placeholder="Contoh: Paket Nasi Tim Ikan Kukus"
                                />
                            </label>

                            <div className="form-row">
                                <label>
                                    Kategori resep
                                    <select value={formCategory} onChange={e => setFormCategory(e.target.value)}>
                                        {RECIPE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </label>
                                <label>
                                    Hasil porsi (servings)
                                    <input
                                        type="number"
                                        min="1"
                                        required
                                        value={formServings}
                                        onChange={e => setFormServings(e.target.value)}
                                    />
                                </label>
                            </div>

                            <div style={{ marginTop: '14px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <b style={{ fontSize: '12px', color: 'var(--text)' }}>Bahan Penyusun Resep:</b>
                                <button type="button" className="btn outline" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={handleAddItem}>
                                    + Tambah Bahan
                                </button>
                            </div>

                            <div style={{ display: 'grid', gap: '8px', maxHeight: '180px', overflowY: 'auto', marginBottom: '14px' }}>
                                {formItems.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <select
                                            style={{ flex: 1, margin: 0 }}
                                            value={item.foodId}
                                            onChange={e => handleItemChange(idx, 'foodId', e.target.value)}
                                        >
                                            {foods.map(f => (
                                                <option key={f.id} value={f.id}>
                                                    {f.name} ({f.calories} kkal · {rupiah(f.price)})
                                                </option>
                                            ))}
                                        </select>
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            style={{ width: '80px', margin: 0 }}
                                            value={item.qty}
                                            onChange={e => handleItemChange(idx, 'qty', e.target.value)}
                                            title="Porsi / kuantitas bahan"
                                        />
                                        <button
                                            type="button"
                                            className="icon-button danger"
                                            onClick={() => handleRemoveItem(idx)}
                                            disabled={formItems.length <= 1}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Live preview kalkulasi nutrisi & biaya per porsi */}
                            <div className="recipe-nutri-grid" style={{ marginBottom: '20px' }}>
                                <div className="recipe-nutri-item">
                                    <small>EST. ENERGI</small>
                                    <b>{currentNutri.calories} kkal</b>
                                </div>
                                <div className="recipe-nutri-item">
                                    <small>PROTEIN</small>
                                    <b>{currentNutri.protein} g</b>
                                </div>
                                <div className="recipe-nutri-item">
                                    <small>EST. BIAYA</small>
                                    <b>{rupiah(currentNutri.price)}</b>
                                </div>
                                <div className="recipe-nutri-item">
                                    <small>STATUS</small>
                                    <b style={{ color: 'var(--accent)' }}>Otomatis</b>
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn outline" onClick={() => setShowModal(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn primary">
                                    <Save size={16} /> Simpan Resep
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
