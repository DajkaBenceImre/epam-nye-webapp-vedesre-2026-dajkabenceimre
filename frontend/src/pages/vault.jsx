import React from 'react';
import { useSelector } from 'react-redux';

const Vault = () => {
    const { items: transactions } = useSelector((state) => state.transactions);
    const vaultTransactions = transactions.filter(t => t.type === 'vault');
    
    const totalDepositedAmount = vaultTransactions.reduce((acc, curr) => acc + curr.amount, 0);
    const totalExpectedAmount = vaultTransactions.reduce((acc, curr) => acc + (curr.expectedAmount || curr.amount), 0);

    const getDurationText = (duration) => {
        if (duration === '0.5') return 'Fél év (5%)';
        if (duration === '1') return '1 év (10%)';
        if (duration === '3') return '3 év (30%)';
        return 'Egyedi';
    };

    return (
        <div style={{ padding: '20px', background: '#e3f2fd', borderRadius: '8px', minHeight: '60vh' }}>
            <h2 style={{ color: '#1565c0' }}>A te Széfed</h2>
            <p>Itt gyűlnek a lekötött megtakarításaid.</p>
            
            <div style={{ display: 'flex', gap: '20px', margin: '20px 0', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', padding: '20px', background: '#fff', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Befizetett tőke:</h3>
                    <h1 style={{ color: '#333', fontSize: '2.5rem', margin: '10px 0' }}>
                        {totalDepositedAmount.toLocaleString()} HUF
                    </h1>
                </div>
                <div style={{ flex: '1', padding: '20px', background: '#1565c0', color: 'white', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                    <h3>Várható végösszeg (kamatokkal):</h3>
                    <h1 style={{ color: '#64b5f6', fontSize: '2.5rem', margin: '10px 0' }}>
                        {totalExpectedAmount.toLocaleString()} HUF
                    </h1>
                </div>
            </div>

            <h3>Aktív Lekötések</h3>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {vaultTransactions.map(t => (
                    <li key={t.id} style={{ background: '#fff', padding: '15px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div>
                            <span style={{ display: 'block', fontSize: '1.1rem' }}><strong>{t.title}</strong></span>
                            <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                Befizetve: {new Date(t.date).toLocaleDateString('hu-HU')} | Lekötés: {getDurationText(t.vaultDuration)}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span style={{ display: 'block', color: '#666', textDecoration: 'line-through', fontSize: '0.9rem' }}>
                                {t.amount.toLocaleString()} HUF
                            </span>
                            <span style={{ color: '#2e7d32', fontWeight: 'bold', fontSize: '1.2rem' }}>
                                ➜ {t.expectedAmount.toLocaleString()} HUF
                            </span>
                        </div>
                    </li>
                ))}
                {vaultTransactions.length === 0 && (
                    <li>Még nincs lekötésed. Készíts egyet a Vezérlőpulton!</li>
                )}
            </ul>
        </div>
    );
};

export default Vault;