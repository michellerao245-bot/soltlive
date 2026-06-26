const express = require('express');
const cors = require('cors');
const app = express();

// Middleware: Cors ko har jagah se allow karo
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST"]
}));
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.send("Backend server is working fine!");
});

// Data API
const tokens = [
    { pairAddress: '0x1', symbol: 'BNB', name: 'Binance Coin', price: 600.5, change24h: 1.2, marketCap: 90000000, liquidity: 50000 },
    { pairAddress: '0x2', symbol: 'SOLT', name: 'Solana Token', price: 150.2, change24h: -0.5, marketCap: 4000000, liquidity: 20000 },
    { pairAddress: '0x3', symbol: 'ETH', name: 'Ethereum', price: 3400.1, change24h: 2.1, marketCap: 400000000, liquidity: 100000 }
];

app.get('/api/tokens', (req, res) => {
    console.log("Frontend se request aayi!"); // Ye console mein dikhna chahiye
    res.json(tokens);
});

// Port 5000 par chalao
const PORT = 5001;
app.listen(PORT, () => {
    console.log(`Server live hai http://localhost:${PORT} par`);
});