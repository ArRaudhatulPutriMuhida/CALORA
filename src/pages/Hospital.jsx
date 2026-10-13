import { useState, useEffect, useMemo } from 'react';
import { HeartPulse, X, Plus, Search, Trash2, Users, CheckCircle2, Save, ChevronRight, ClipboardList, Info } from 'lucide-react';
import Card from '../components/Card.jsx';
import Heading from '../components/Heading.jsx';
import Tag from '../components/Tag.jsx';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { rupiah } from '../utils/format.js';
import { getRecipeNutrition } from '../utils/nutrition.js';
import { dietMenus } from '../data/nutrition.js';
import { initialPatients } from '../data/patients.js';

export default function Hospital({ foods, recipes = [], plans, setPlans, notify, patients = initialPatients, setPatients }) {
    const [search, setSearch] = useState('');
    const [dietFilter, setDietFilter] = useState('Semua'); // FR-013: Filter kategori diet
    const [pid, setPid] = useState(patients[0]?.id || '');
    const [diet, setDiet] = useState(patients[0]?.diet || 'Diabetes Melitus');
    const [meal, setMeal] = useState('');
    const [slot, setSlot] = useState('Siang');
    const [delivered, setDelivered] = useLocalStorage('calora-distribution', {});

    // State untuk Modal Tambah Pasien
    const [showAddModal, setShowAddModal] = useState(false);
    const [patientForm, setPatientForm] = useState({
        name: '',
        age: '',
        room: '',
        diet: 'Diabetes Melitus',
    });

    const patient = patients.find(p => p.id === pid) || patients[0];

    // Sinkronkan diet jika pasien yang dipilih berubah
    useEffect(() => {
        if (patient) {
            setDiet(patient.diet);
            if (!pid) setPid(patient.id);
        }
    }, [patient, pid]);

    // Pilihan menu mencakup bahan makanan dan resep yang cocok dengan kategori diet
    const menuItems = useMemo(() => {
        const allowedNames = dietMenus[diet] || [];
        const matchedFoods = foods.filter(f => allowedNames.includes(f.name)).map(f => ({ ...f, type: 'Bahan' }));
        const matchedRecipes = recipes.filter(r => allowedNames.includes(r.name)).map(r => {
            const nutri = getRecipeNutrition(r, foods);
            return {
                id: `rec-${r.id}`,
                name: r.name,
                category: r.category,
                type: 'Resep',
                ...nutri,
            };
        });
        return [...matchedFoods, ...matchedRecipes];
    }, [diet, foods, recipes]);

    useEffect(() => { setMeal(''); }, [diet, pid]);

    const chosen = menuItems.find(item => item.name === meal);
    const saved = pid ? plans[pid] : null;

    // Hitung sebaran klasifikasi diet pasien
    const DIET_CATEGORIES = ['Semua', 'Diabetes Melitus', 'Rendah Garam', 'Pascaoperasi', 'Diet Umum'];
    const DIET_FORM_OPTIONS = ['Diabetes Melitus', 'Rendah Garam', 'Pascaoperasi', 'Diet Umum'];

    const dietCounts = useMemo(() => {
        const counts = { 'Semua': patients.length };
        DIET_FORM_OPTIONS.forEach(d => { counts[d] = 0; });
        patients.forEach(p => {
            if (counts[p.diet] !== undefined) counts[p.diet]++;
        });
        return counts;
    }, [patients]);

    // FR-012 & FR-013: Filter berdasarkan pencarian nama, kamar, dan kategori diet
    const filteredPatients = patients.filter(p => {
        const matchSearch = (p.name + p.room + p.id).toLowerCase().includes(search.toLowerCase());
        const matchDiet = dietFilter === 'Semua' || p.diet === dietFilter;
        return matchSearch && matchDiet;
    });

    function handleSavePlan() {
        if (!patient || !chosen) return;
        setPlans(prev => ({
            ...prev,
            [pid]: {
                patient: patient.name,
                diet, meal, slot,
                food: chosen,
                date: new Date().toLocaleDateString('id-ID'),
            },
        }));
        notify(`Rencana menu untuk ${patient.name} berhasil disimpan`);
    }

    function handleToggleDelivery() {
        if (!pid) return;
        setDelivered(prev => ({ ...prev, [pid]: !prev[pid] }));
        notify('Status distribusi diperbarui');
    }

    // Fitur Tambah Pasien Baru
    function handleAddPatient(e) {
        e.preventDefault();
        const trimmedName = patientForm.name.trim();
        const trimmedRoom = patientForm.room.trim();
        const numAge = parseInt(patientForm.age, 10);

        if (!trimmedName || !trimmedRoom || isNaN(numAge) || numAge <= 0) {
            notify('Harap lengkapi nama, usia, dan kamar dengan benar!');
            return;
        }

        const maxNum = patients.reduce((max, p) => {
            const num = parseInt((p.id || '').replace(/^P-/, ''), 10);
            return !isNaN(num) && num > max ? num : max;
        }, 0);

        const newId = `P-${String(maxNum + 1).padStart(3, '0')}`;
        const newPatient = {
            id: newId,
            name: trimmedName,
            age: numAge,
            room: trimmedRoom,
            diet: patientForm.diet,
            status: 'Direncanakan',
        };

        if (setPatients) {
            setPatients(prev => [newPatient, ...prev]);
        }
        setPid(newId);
        setDiet(newPatient.diet);
        setShowAddModal(false);
        setPatientForm({ name: '', age: '', room: '', diet: 'Diabetes Melitus' });
        notify(`Pasien ${newPatient.name} berhasil didaftarkan ke diet ${newPatient.diet}`);
    }

    // Fitur Hapus Pasien
    function handleDeletePatient(e, patientToDelete) {
        e.stopPropagation();
        if (window.confirm(`Hapus data pasien "${patientToDelete.name}" (${patientToDelete.room}) dari daftar?`)) {
            if (setPatients) {
                setPatients(prev => {
                    const updated = prev.filter(p => p.id !== patientToDelete.id);
                    if (pid === patientToDelete.id) {
                        const nextP = updated[0];
                        if (nextP) {
                            setPid(nextP.id);
                            setDiet(nextP.diet);
                        } else {
                            setPid('');
                        }
                    }
                    return updated;
                });
            }
            if (setPlans) {
                setPlans(prev => {
                    const next = { ...prev };
                    delete next[patientToDelete.id];
                    return next;
                });
            }
            notify(`Data pasien ${patientToDelete.name} berhasil dihapus`);
        }
    }

    // Helper class untuk styling badge kategori diet
    function getDietClass(dietName) {
        if (!dietName) return 'diet-umum';
        const map = {
            'Diabetes Melitus': 'diet-dm',
            'Rendah Garam': 'diet-rg',
            'Pascaoperasi': 'diet-po',
            'Diet Umum': 'diet-umum',
        };
        return map[dietName] || 'diet-umum';
    }

    return (
        <>
            <Heading
                eyebrow="HOSPITAL MODULE"
                title="Hospital Nutrition"
                description="Susun dan pantau pemenuhan menu diet pasien berdasarkan kategori klinis dan instruksi medis."
            />

            <div className="hospital-grid">

                {/* Patient List Card */}
                <Card className="patient-list-card">
                    <div className="card-title">
                        <div>
                            <h3>Daftar Pasien</h3>
                            <small className="card-subtitle">
                                Klasifikasi diet & instruksi medis
                            </small>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <Tag>{patients.length} pasien</Tag>
                            <button
                                type="button"
                                className="btn primary btn-sm"
                                onClick={() => setShowAddModal(true)}
                                title="Tambah Pasien Baru"
                            >
                                <Plus size={15} /> Tambah
                            </button>
                        </div>
                    </div>

                    <div className="search">
                        <Search size={18} />
                        <input
                            placeholder="Cari nama, ID, atau kamar..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Klasifikasi Diet Counter & Filter Strip */}
                    <div className="diet-summary-strip">
                        <button
                            type="button"
                            className={`diet-summary-chip ${dietFilter === 'Semua' ? 'active' : ''}`}
                            onClick={() => setDietFilter('Semua')}
                        >
                            <span className="chip-dot dot-all" />
                            <span className="chip-label">Semua</span>
                            <span className="chip-count">{dietCounts['Semua']}</span>
                        </button>
                        <button
                            type="button"
                            className={`diet-summary-chip ${dietFilter === 'Diabetes Melitus' ? 'active' : ''}`}
                            onClick={() => setDietFilter('Diabetes Melitus')}
                        >
                            <span className="chip-dot dot-dm" />
                            <span className="chip-label">DM</span>
                            <span className="chip-count">{dietCounts['Diabetes Melitus']}</span>
                        </button>
                        <button
                            type="button"
                            className={`diet-summary-chip ${dietFilter === 'Rendah Garam' ? 'active' : ''}`}
                            onClick={() => setDietFilter('Rendah Garam')}
                        >
                            <span className="chip-dot dot-rg" />
                            <span className="chip-label">R. Garam</span>
                            <span className="chip-count">{dietCounts['Rendah Garam']}</span>
                        </button>
                        <button
                            type="button"
                            className={`diet-summary-chip ${dietFilter === 'Pascaoperasi' ? 'active' : ''}`}
                            onClick={() => setDietFilter('Pascaoperasi')}
                        >
                            <span className="chip-dot dot-po" />
                            <span className="chip-label">Pasca-Op</span>
                            <span className="chip-count">{dietCounts['Pascaoperasi']}</span>
                        </button>
                        <button
                            type="button"
                            className={`diet-summary-chip ${dietFilter === 'Diet Umum' ? 'active' : ''}`}
                            onClick={() => setDietFilter('Diet Umum')}
                        >
                            <span className="chip-dot dot-umum" />
                            <span className="chip-label">Umum</span>
                            <span className="chip-count">{dietCounts['Diet Umum']}</span>
                        </button>
                    </div>

                    <div className="patient-list">
                        {filteredPatients.map(p => (
                            <div
                                key={p.id}
                                className={`patient ${pid === p.id ? 'selected' : ''}`}
                                onClick={() => { setPid(p.id); setDiet(p.diet); }}
                                role="button"
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        setPid(p.id);
                                        setDiet(p.diet);
                                    }
                                }}
                            >
                                <span className={`avatar ${getDietClass(p.diet)}`}>
                                    {p.name.split(' ').map(x => x[0]).slice(0, 2).join('')}
                                </span>
                                <div className="patient-info">
                                    <div className="patient-header-row">
                                        <b>{p.name}</b>
                                        <span className={`diet-badge ${getDietClass(p.diet)}`}>
                                            {p.diet}
                                        </span>
                                    </div>
                                    <small>{p.room} · {p.age} thn · <span className="patient-id">{p.id}</span></small>
                                </div>
                                <div className="patient-actions">
                                    <button
                                        type="button"
                                        className="patient-delete-btn"
                                        title={`Hapus pasien ${p.name}`}
                                        onClick={e => handleDeletePatient(e, p)}
                                        aria-label={`Hapus ${p.name}`}
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                    <ChevronRight size={17} className="patient-chevron" />
                                </div>
                            </div>
                        ))}
                        {filteredPatients.length === 0 && (
                            <div className="patient-empty">
                                <Users size={32} style={{ color: 'var(--text-light)', margin: '0 auto 8px' }} />
                                <p className="muted">Pasien dengan filter ini tidak ditemukan.</p>
                                <button
                                    type="button"
                                    className="btn outline btn-sm"
                                    onClick={() => { setSearch(''); setDietFilter('Semua'); }}
                                    style={{ marginTop: '8px' }}
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}
                    </div>
                </Card>

                <div className="stack">
                    {patient ? (
                        <>
                            {/* Diet Plan */}
                            <Card>
                                <div className="card-title">
                                    <h3>Rencana Diet Pasien</h3>
                                    <Tag>Instruksi Medis</Tag>
                                </div>

                                <div className="patient-summary">
                                    <span className={`avatar large ${getDietClass(patient.diet)}`}>
                                        {patient.name.split(' ').map(x => x[0]).slice(0, 2).join('')}
                                    </span>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                            <h3>{patient.name}</h3>
                                            <span className={`diet-badge ${getDietClass(patient.diet)}`}>
                                                {patient.diet}
                                            </span>
                                        </div>
                                        <p>{patient.id} · Ruang {patient.room} · {patient.age} tahun</p>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <label>
                                        Kategori diet
                                        <select value={diet} onChange={e => setDiet(e.target.value)}>
                                            {Object.keys(dietMenus).map(d => <option key={d}>{d}</option>)}
                                        </select>
                                    </label>
                                    <label>
                                        Jadwal makanan
                                        <select value={slot} onChange={e => setSlot(e.target.value)}>
                                            {['Pagi', 'Siang', 'Malam'].map(x => <option key={x}>{x}</option>)}
                                        </select>
                                    </label>
                                </div>

                                <h4>Menu contoh & resep yang sesuai kategori diet</h4>
                                <div className="menu-options">
                                    {menuItems.map(f => (
                                        <button
                                            key={f.id}
                                            type="button"
                                            className={`menu-choice ${meal === f.name ? 'picked' : ''}`}
                                            onClick={() => setMeal(f.name)}
                                        >
                                            <span>
                                                <b>{f.name}</b>
                                                <small>{f.type === 'Resep' ? '★ Paket Resep · ' : ''}{f.calories} kkal · {rupiah(f.price)}</small>
                                            </span>
                                            <span className="radio-dot" />
                                        </button>
                                    ))}
                                    {!menuItems.length && (
                                        <p className="muted">
                                            Menu untuk kategori ini belum tersedia. Tambahkan melalui Recipe atau Food Management.
                                        </p>
                                    )}
                                </div>

                                {/* FR-017 & FR-019: Info nutrisi dari menu yang dipilih */}
                                {chosen && (
                                    <div className="nutrition-inline">
                                        <span>Energi  <b>{chosen.calories} kkal</b></span>
                                        <span>Protein <b>{chosen.protein} g</b></span>
                                        <span>Karbo   <b>{chosen.carbs} g</b></span>
                                        <span>Lemak   <b>{chosen.fat} g</b></span>
                                    </div>
                                )}

                                <button
                                    className="btn primary full"
                                    disabled={!chosen}
                                    onClick={handleSavePlan}
                                >
                                    <Save size={17} /> Simpan Rencana Menu Pasien
                                </button>
                            </Card>

                            {/* Distribution Status */}
                            <Card>
                                <div className="card-title">
                                    <h3>Status Distribusi Makanan</h3>
                                    <Tag>{saved ? 'Terencana' : 'Belum ada rencana'}</Tag>
                                </div>

                                {saved ? (
                                    <>
                                        <p className="muted">{saved.slot} · {saved.meal} · Diet {saved.diet}</p>
                                        <button
                                            className={`btn ${delivered[pid] ? 'outline' : 'primary'}`}
                                            onClick={handleToggleDelivery}
                                        >
                                            {delivered[pid]
                                                ? <><CheckCircle2 size={17} /> Sudah didistribusikan (Klik untuk ubah)</>
                                                : <><ClipboardList size={17} /> Tandai Sudah Didistribusikan</>
                                            }
                                        </button>
                                    </>
                                ) : (
                                    <p className="muted">
                                        Pilih menu dan simpan rencana untuk memperbarui status distribusi.
                                    </p>
                                )}
                            </Card>
                        </>
                    ) : (
                        <Card>
                            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                <HeartPulse size={44} style={{ color: 'var(--text-light)', margin: '0 auto 12px' }} />
                                <h3>Belum Ada Pasien Terpilih</h3>
                                <p className="muted" style={{ maxWidth: '360px', margin: '0 auto 18px' }}>
                                    Pilih pasien dari daftar atau klik tombol Tambah untuk mendaftarkan pasien baru ke dalam klasifikasi diet.
                                </p>
                                <button
                                    type="button"
                                    className="btn primary"
                                    onClick={() => setShowAddModal(true)}
                                >
                                    <Plus size={16} /> Tambah Pasien Baru
                                </button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modal Tambah Pasien Baru */}
            {showAddModal && (
                <div className="modal-backdrop" onClick={() => setShowAddModal(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="card-title">
                            <div>
                                <h3>Tambah Pasien Baru</h3>
                                <small style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                                    Klasifikasikan pasien ke dalam kategori diet klinis
                                </small>
                            </div>
                            <button
                                type="button"
                                className="icon-button"
                                onClick={() => setShowAddModal(false)}
                                aria-label="Tutup modal"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddPatient}>
                            <label>
                                Nama Lengkap Pasien
                                <input
                                    required
                                    maxLength={70}
                                    placeholder="Contoh: Siti Rahmawati"
                                    value={patientForm.name}
                                    onChange={e => setPatientForm(prev => ({ ...prev, name: e.target.value }))}
                                />
                            </label>

                            <div className="form-row">
                                <label>
                                    Usia (Tahun)
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        max="120"
                                        placeholder="Contoh: 42"
                                        value={patientForm.age}
                                        onChange={e => setPatientForm(prev => ({ ...prev, age: e.target.value }))}
                                    />
                                </label>

                                <label>
                                    Kamar / Ruangan
                                    <input
                                        required
                                        maxLength={30}
                                        placeholder="Contoh: Mawar 204"
                                        value={patientForm.room}
                                        onChange={e => setPatientForm(prev => ({ ...prev, room: e.target.value }))}
                                    />
                                </label>
                            </div>

                            <label>
                                Klasifikasi Kategori Diet Medis
                                <select
                                    value={patientForm.diet}
                                    onChange={e => setPatientForm(prev => ({ ...prev, diet: e.target.value }))}
                                >
                                    {DIET_FORM_OPTIONS.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </label>

                            <div className="notice" style={{ margin: '14px 0 20px', padding: '10px 14px', fontSize: '11px' }}>
                                <Info size={16} />
                                <span>
                                    Pasien baru akan otomatis diklasifikasikan ke kategori <b>{patientForm.diet}</b> dan terhubung dengan menu medis yang sesuai.
                                </span>
                            </div>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="btn outline"
                                    onClick={() => setShowAddModal(false)}
                                >
                                    Batal
                                </button>
                                <button type="submit" className="btn primary">
                                    <Plus size={16} /> Daftarkan Pasien
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="notice">
                <Info size={18} />
                Penyusunan menu diet dan porsi pasien disesuaikan dengan rekam medis serta anjuran dokter penanggung jawab.
            </div>
        </>
    );
}
