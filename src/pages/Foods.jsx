import { useState } from 'react';
import { X, Plus, Search, Trash2, Pencil, RefreshCcw, Save } from 'lucide-react';
import Card from '../components/Card.jsx';
import Heading from '../components/Heading.jsx';
import Tag from '../components/Tag.jsx';
import { rupiah } from '../utils/format.js';
import { initialFoods } from '../data/foods.js';

const emptyForm = {
    name: '', category: 'Protein',
    calories: '', protein: '', carbs: '', fat: '', price: '',
};

const FOOD_CATEGORIES = ['Karbohidrat', 'Protein', 'Sayuran', 'Buah', 'Lainnya'];

const FORM_FIELDS = [
    ['calories', 'Kalori (kkal)'],
    ['protein', 'Protein (g)'],
    ['carbs', 'Karbohidrat (g)'],
    ['fat', 'Lemak (g)'],
    ['price', 'Harga (Rp)'],
];

export default function Foods({ foods, setFoods, notify }) {
    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Semua');
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [show, setShow] = useState(false);

    // FR-046 & FR-047: Pencarian dan filter kategori bahan makanan
    const filtered = foods.filter(f => {
        const matchSearch = `${f.name} ${f.category}`.toLowerCase().includes(search.toLowerCase());
        const matchCat = categoryFilter === 'Semua' || f.category === categoryFilter;
        return matchSearch && matchCat;
    });

    function openModal(food = null) {
        setEditing(food?.id || null);
        setForm(food ? { ...food } : emptyForm);
        setShow(true);
    }

    function handleSave(e) {
        e.preventDefault();
        if (!form.name.trim()) return;

        const data = {
            ...form,
            name: form.name.trim(),
            calories: Number(form.calories),
            protein: Number(form.protein),
            carbs: Number(form.carbs),
            fat: Number(form.fat),
            price: Number(form.price),
        };

        const numericKeys = ['calories', 'protein', 'carbs', 'fat', 'price'];
        if (numericKeys.some(k => !Number.isFinite(data[k]) || data[k] < 0)) {
            notify('Nilai gizi dan harga tidak boleh negatif');
            return;
        }

        if (editing) {
            setFoods(prev => prev.map(f => f.id === editing ? { ...data, id: editing } : f));
        } else {
            setFoods(prev => [...prev, { ...data, id: Date.now() }]);
        }

        setShow(false);
        notify(editing ? 'Bahan makanan berhasil diperbarui' : 'Bahan makanan berhasil ditambahkan');
    }

    function handleDelete(food) {
        if (window.confirm(`Hapus ${food.name}?`)) {
            setFoods(prev => prev.filter(f => f.id !== food.id));
            notify('Bahan makanan dihapus');
        }
    }

    function handleReset() {
        if (window.confirm('Kembalikan seluruh bahan makanan ke data awal?')) {
            setFoods(initialFoods);
            notify('Data bahan makanan direset');
        }
    }

    return (
        <>
            <Heading
                eyebrow="DATA MANAGEMENT"
                title="Food Management"
                description="Kelola database bahan makanan, nilai makronutrien, serta estimasi harga per porsi."
            />

            <Card>
                {/* Toolbar */}
                <div className="table-actions">
                    <div className="search">
                        <Search size={18} />
                        <input
                            placeholder="Cari bahan makanan..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="action-group">
                        <button className="btn outline" onClick={handleReset}>
                            <RefreshCcw size={16} /> Reset Data
                        </button>
                        <button className="btn primary" onClick={() => openModal()}>
                            <Plus size={17} /> Tambah Bahan
                        </button>
                    </div>
                </div>

                {/* FR-047: Filter Kategori Bahan */}
                <div className="filter-pills">
                    {['Semua', ...FOOD_CATEGORIES].map(cat => (
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

                {/* Table */}
                <div className="table-wrap">
                    <table>
                        <thead>
                            <tr>
                                <th>Nama Bahan</th>
                                <th>Kategori</th>
                                <th>Kalori</th>
                                <th>Protein</th>
                                <th>Karbo</th>
                                <th>Lemak</th>
                                <th>Harga / Porsi</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(f => (
                                <tr key={f.id}>
                                    <td><b>{f.name}</b></td>
                                    <td><Tag>{f.category}</Tag></td>
                                    <td>{f.calories} kkal</td>
                                    <td>{f.protein} g</td>
                                    <td>{f.carbs} g</td>
                                    <td>{f.fat} g</td>
                                    <td>{rupiah(f.price)}</td>
                                    <td>
                                        <div className="table-buttons">
                                            <button className="icon-button" title="Edit" onClick={() => openModal(f)}>
                                                <Pencil size={17} />
                                            </button>
                                            <button className="icon-button danger" title="Hapus" onClick={() => handleDelete(f)}>
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!filtered.length && (
                        <div className="empty">Tidak ada bahan makanan yang cocok dengan kriteria filter.</div>
                    )}
                </div>
            </Card>

            {/* Add / Edit Modal */}
            {show && (
                <div className="modal-backdrop" onClick={() => setShow(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>

                        <div className="card-title">
                            <h3>{editing ? 'Edit Bahan Makanan' : 'Tambah Bahan Makanan'}</h3>
                            <button className="icon-button" onClick={() => setShow(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <label>
                                Nama bahan
                                <input
                                    required
                                    maxLength={80}
                                    value={form.name}
                                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </label>

                            <label>
                                Kategori
                                <select
                                    value={form.category}
                                    onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                                >
                                    {FOOD_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </label>

                            <div className="form-row">
                                {FORM_FIELDS.map(([key, label]) => (
                                    <label key={key}>
                                        {label}
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step={key === 'price' ? '1' : '0.1'}
                                            value={form[key]}
                                            onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
                                        />
                                    </label>
                                ))}
                            </div>

                            <div className="modal-actions">
                                <button type="button" className="btn outline" onClick={() => setShow(false)}>
                                    Batal
                                </button>
                                <button type="submit" className="btn primary">
                                    <Save size={16} /> Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
