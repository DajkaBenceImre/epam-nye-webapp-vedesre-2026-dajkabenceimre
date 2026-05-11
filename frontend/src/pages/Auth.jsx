import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginSuccess } from '../store/authSlice';
import { customFetch } from '../utils/api';
import { useModal } from '../context/ModalContext';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', password: '' });
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showAlert } = useModal();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.password) {
            showAlert('Minden mezőt ki kell tölteni!', 'error');
            return;
        }

        const endpoint = isLogin ? '/auth/login' : '/auth/register';

        try {
            const data = await customFetch(endpoint, {
                method: 'POST',
                body: JSON.stringify(formData)
            });

            if (isLogin) {
                dispatch(loginSuccess({ token: data.token, username: data.username }));
                showAlert(`Üdvözlünk, ${data.username}!`, 'success');
                navigate('/'); // Sikeres belépés után irány a Dashboard
            } else {
                showAlert('Sikeres regisztráció! Most már bejelentkezhetsz.', 'success');
                setIsLogin(true); // Visszaváltunk bejelentkezés nézetre
                setFormData({ username: '', password: '' });
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>{isLogin ? 'Bejelentkezés' : 'Regisztráció'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" placeholder="Felhasználónév" 
                    value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})}
                    style={{ padding: '8px' }}
                />
                <input 
                    type="password" placeholder="Jelszó" 
                    value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})}
                    style={{ padding: '8px' }}
                />
                <button type="submit" style={{ padding: '10px', background: '#282c34', color: 'white', border: 'none' }}>
                    {isLogin ? 'Belépés' : 'Regisztrálok'}
                </button>
            </form>
            <p style={{ marginTop: '15px', cursor: 'pointer', color: 'blue', textAlign: 'center' }} onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? 'Nincs még fiókod? Regisztrálj!' : 'Már van fiókod? Jelentkezz be!'}
            </p>
        </div>
    );
};

export default Auth;