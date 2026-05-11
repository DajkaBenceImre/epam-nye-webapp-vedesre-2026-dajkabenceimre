import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactions, addTransaction } from '../store/transactionSlice';
import { useModal } from '../context/ModalContext';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { showAlert } = useModal();
    const { items: transactions, status } = useSelector((state) => state.transactions);

    // Aktuális dátum YYYY-MM-DD formátumban az alapértelmezett értékhez
    const today = new Date().toISOString().split('T')[0];

    // Űrlap állapota (bővítve dátummal és lekötési idővel)
    const [formData, setFormData] = useState({ 
        title: '', amount: '', type: 'expense', date: today, vaultDuration: '0.5' 
    });

    // Szűrők állapota (típus és intervallum)
    const [filter, setFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState({ from: '', to: '' });

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchTransactions());
        }
    }, [status, dispatch]);

    // Kamat számító függvény
    const calculateExpectedAmount = (amount, duration) => {
        const numAmount = Number(amount) || 0;
        if (duration === '0.5') return numAmount * 1.05; // Fél év: 5%
        if (duration === '1') return numAmount * 1.10;   // 1 év: 10%
        if (duration === '3') return numAmount * 1.30;   // 3 év: 30%
        return numAmount;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title || !formData.amount || !formData.date) {
            showAlert('Kérlek tölts ki minden mezőt!', 'error');
            return;
        }

        // Ha széfbe teszünk, kiszámoljuk és elküldjük a várható végösszeget is
        let payload = { ...formData };
        if (formData.type === 'vault') {
            payload.expectedAmount = calculateExpectedAmount(formData.amount, formData.vaultDuration);
        }

        const resultAction = await dispatch(addTransaction(payload));
        if (addTransaction.fulfilled.match(resultAction)) {
            showAlert('Tranzakció sikeresen hozzáadva!', 'success');
            setFormData({ title: '', amount: '', type: 'expense', date: today, vaultDuration: '0.5' });
        } else {
            showAlert(`Hiba történt: ${resultAction.payload}`, 'error');
        }
    };

    // --- Szűrési logika (Típus ÉS Dátum alapján) ---
    const filteredTransactions = transactions.filter(t => {
        let isValid = true;
        // 1. Típus szűrés (a széf sose jelenjen meg a napi listában)
        if (filter === 'all' && t.type === 'vault') isValid = false;
        if (filter !== 'all' && t.type !== filter) isValid = false;

        // 2. Dátum szűrés
        const tDate = new Date(t.date).getTime();
        if (dateFilter.from && tDate < new Date(dateFilter.from).getTime()) isValid = false;
        if (dateFilter.to && tDate > new Date(dateFilter.to).getTime()) isValid = false;

        return isValid;
    });

    const income = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    
    const chartData = [
        { name: 'Bevétel', value: income, color: '#4CAF50' },
        { name: 'Kiadás', value: expense, color: '#F44336' }
    ];

    return (
        <div>
            <h2>Vezérlőpult</h2>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                
                {/* Űrlap */}
                <div style={{ flex: '1', minWidth: '300px', background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
                    <h3>Új tranzakció rögzítése</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} title="Tranzakció dátuma" />
                        <input type="text" placeholder="Megnevezés" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        <input type="number" placeholder="Összeg (HUF)" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                        
                        <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                            <option value="expense">Kiadás</option>
                            <option value="income">Bevétel</option>
                            <option value="vault">Széf (Megtakarítás)</option>
                        </select>

                        {/* Csak akkor jelenik meg, ha Széf típust választunk */}
                        {formData.type === 'vault' && (
                            <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '4px', border: '1px solid #90caf9' }}>
                                <label style={{ display: 'block', marginBottom: '5px' }}>Lekötés időtartama:</label>
                                <select value={formData.vaultDuration} onChange={e => setFormData({...formData, vaultDuration: e.target.value})} style={{ width: '100%', marginBottom: '10px' }}>
                                    <option value="0.5">Fél év (5% hozam)</option>
                                    <option value="1">1 év (10% hozam)</option>
                                    <option value="3">3 év (30% hozam)</option>
                                </select>
                                <div style={{ color: '#1565c0', fontWeight: 'bold' }}>
                                    Várható végösszeg: {calculateExpectedAmount(formData.amount, formData.vaultDuration).toLocaleString()} HUF
                                </div>
                            </div>
                        )}

                        <button type="submit" style={{ padding: '10px', background: '#282c34', color: '#fff', border: 'none', cursor: 'pointer' }}>Mentés</button>
                    </form>
                </div>

                {/* Grafikon */}
                <div style={{ flex: '1', minWidth: '300px', height: '250px' }}>
                    <h3>Egyenleg vizualizáció</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tranzakciók listája és szűrés */}
            <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                    <h3>Eddigi tranzakciók</h3>
                    
                    {/* Dátum és Típus Szűrők */}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <span>Szűrés:</span>
                        <input type="date" value={dateFilter.from} onChange={e => setDateFilter({...dateFilter, from: e.target.value})} title="Ettől" style={{ padding: '5px' }} />
                        <span>-</span>
                        <input type="date" value={dateFilter.to} onChange={e => setDateFilter({...dateFilter, to: e.target.value})} title="Eddig" style={{ padding: '5px' }} />
                        
                        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '5px' }}>
                            <option value="all">Minden típus</option>
                            <option value="income">Csak bevételek</option>
                            <option value="expense">Csak kiadások</option>
                        </select>
                    </div>
                </div>
                
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee' }}>
                            <th style={{ padding: '10px 0' }}>Dátum</th>
                            <th>Megnevezés</th>
                            <th>Típus</th>
                            <th>Összeg</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map(t => (
                            <tr key={t.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px 0' }}>{new Date(t.date).toLocaleDateString('hu-HU')}</td>
                                <td>{t.title}</td>
                                <td style={{ color: t.type === 'income' ? 'green' : 'red' }}>
                                    {t.type === 'income' ? 'Bevétel' : 'Kiadás'}
                                </td>
                                <td>{t.amount.toLocaleString()} HUF</td>
                            </tr>
                        ))}
                        {filteredTransactions.length === 0 && (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Nincs megjeleníthető tranzakció ebben az időszakban.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;