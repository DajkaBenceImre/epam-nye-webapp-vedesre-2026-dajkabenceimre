const BASE_URL = 'http://localhost:5000/api';

export const customFetch = async (endpoint, options = {}) => {
    const token = localStorage.getItem('token');
    
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        // Hiba esetén dobunk egy hibát, amit a komponensben elkaphatunk
        throw new Error(data.error || 'Ismeretlen hiba történt a hálózati kérés során.');
    }

    return data;
};
