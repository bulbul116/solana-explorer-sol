const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const HELIUS_API_KEY = process.env.HELIUS_API_KEY;

// Helius RPC Endpoint
const HELIUS_RPC = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;

app.use(cors());
app.use(express.json());

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Solana Explorer API is running' });
});

// 2. Main Wallet Data Endpoint
app.get('/api/wallet/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    const [infoRes, txRes] = await Promise.allSettled([
      axios.post(HELIUS_RPC, {
        jsonrpc: '2.0', id: '1', method: 'getAccountInfo',
        params: [address, { encoding: 'jsonParsed' }]
      }),
      axios.get(`https://api-mainnet.helius-rpc.com/v0/addresses/${address}/transactions/`, {
        params: { 'api-key': HELIUS_API_KEY, limit: 10 }
      })
    ]);

    res.json({
      address,
      balance: (infoRes.value?.data?.result?.value?.lamports || 0) / 1e9,
      transactions: txRes.value?.data || [],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: 'Data fetch failed', details: error.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server ready on port ${PORT}`));
