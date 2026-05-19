const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const SECRET_KEY = "super_secret_finance_key_dont_use_in_production";

const users = []; 
let transactions = [];

app.post('/api/auth/register', async (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: "A felhasználónév már létezik!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ id: users.length + 1, username, password: hashedPassword });
    res.status(201).json({ message: "Sikeres regisztráció!" });
});

app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: "Hibás felhasználónév vagy jelszó!" });
    }
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token, username: user.username });
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: "Hiányzó token!" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Érvénytelen token!" });
        req.user = user;
        next();
    });
};

app.get('/api/transactions', authenticateToken, (req, res) => {
    const userTransactions = transactions.filter(t => t.userId === req.user.id);
    res.json(userTransactions);
});

app.post('/api/transactions', authenticateToken, (req, res) => {
    const { title, amount, type, category, date, vaultDuration, expectedAmount } = req.body;
    const newTransaction = {
        id: Date.now(),
        userId: req.user.id,
        title,
        amount: Number(amount),
        type, 
        category,
        date: date ? new Date(date).toISOString() : new Date().toISOString(),
        vaultDuration,       
        expectedAmount: expectedAmount ? Number(expectedAmount) : Number(amount)
    };
    transactions.push(newTransaction);
    res.status(201).json(newTransaction);
});

app.listen(PORT, () => {
    console.log(`Backend szerver fut a http://localhost:${PORT} címen`);
});