<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Solana AI Agent × Bitget</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;800&display=swap');

  :root {
    --bg: #050810;
    --panel: #0c1120;
    --border: #1a2540;
    --accent: #00f5a0;
    --accent2: #00c8ff;
    --warn: #ff6b35;
    --text: #e8edf5;
    --muted: #5a6a85;
    --glow: 0 0 20px rgba(0,245,160,0.3);
    --glow2: 0 0 20px rgba(0,200,255,0.3);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Syne', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Animated grid background */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(0,245,160,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,245,160,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .app {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 24px 16px;
  }

  /* Header */
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .logo-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    box-shadow: var(--glow);
  }

  .logo-text h1 {
    font-size: 20px;
    font-weight: 800;
    letter-spacing: -0.5px;
  }

  .logo-text span {
    font-size: 11px;
    color: var(--muted);
    font-family: 'Space Mono', monospace;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  /* Wallet button */
  #connectBtn {
    background: transparent;
    border: 1px solid var(--accent);
    color: var(--accent);
    padding: 10px 20px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  #connectBtn:hover {
    background: rgba(0,245,160,0.1);
    box-shadow: var(--glow);
  }

  #connectBtn.connected {
    border-color: var(--accent2);
    color: var(--accent2);
  }

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--muted);
  }

  .dot.live {
    background: var(--accent);
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }

  /* Wallet info card */
  #walletInfo {
    display: none;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px 20px;
    margin-bottom: 24px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    opacity: 0;
    pointer-events: none;
  }

  #walletInfo.show {
    opacity: 1;
    pointer-events: auto;
  }

  .stat-item label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--muted);
    font-family: 'Space Mono', monospace;
    display: block;
    margin-bottom: 4px;
  }

  .stat-item .val {
    font-size: 15px;
    font-weight: 600;
    font-family: 'Space Mono', monospace;
  }

  .stat-item .val.green { color: var(--accent); }
  .stat-item .val.blue { color: var(--accent2); }

  /* Main layout */
  .main-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 20px;
  }

  @media (max-width: 640px) {
    .main-grid { grid-template-columns: 1fr; }
  }

  /* Chat panel */
  .panel {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
  }

  .panel-header {
    padding: 14px 18px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  .panel-header .icon {
    font-size: 16px;
  }

  /* Chat messages */
  #chatMessages {
    height: 320px;
    overflow-y: auto;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .msg {
    max-width: 85%;
    padding: 10px 14px;
    border-radius: 12px;
    font-size: 13px;
    line-height: 1.5;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .msg.user {
    align-self: flex-end;
    background: rgba(0,245,160,0.12);
    border: 1px solid rgba(0,245,160,0.2);
    color: var(--text);
  }

  .msg.agent {
    align-self: flex-start;
    background: rgba(0,200,255,0.08);
    border: 1px solid rgba(0,200,255,0.15);
    color: var(--text);
    font-family: 'Space Mono', monospace;
    font-size: 12px;
  }

  .msg.agent .agent-label {
    color: var(--accent2);
    font-size: 10px;
    letter-spacing: 1px;
    margin-bottom: 4px;
    display: block;
  }

  .msg.system {
    align-self: center;
    background: rgba(255,107,53,0.1);
    border: 1px solid rgba(255,107,53,0.2);
    color: var(--warn);
    font-size: 11px;
    font-family: 'Space Mono', monospace;
    text-align: center;
  }

  /* Chat input */
  .chat-input-row {
    padding: 12px 16px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 8px;
  }

  #chatInput {
    flex: 1;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    outline: none;
    transition: border-color 0.2s;
  }

  #chatInput:focus { border-color: var(--accent); }
  #chatInput::placeholder { color: var(--muted); }

  #sendBtn {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    border: none;
    border-radius: 8px;
    width: 40px;
    height: 40px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: opacity 0.2s, transform 0.1s;
    flex-shrink: 0;
  }

  #sendBtn:hover { opacity: 0.85; }
  #sendBtn:active { transform: scale(0.95); }
  #sendBtn:disabled { opacity: 0.4; cursor: not-allowed; }

  /* Suggestions panel */
  .suggestions {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .suggest-label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: var(--muted);
    font-family: 'Space Mono', monospace;
    margin-bottom: 4px;
  }

  .suggest-btn {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
    font-size: 12px;
    cursor: pointer;
    text-align: left;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .suggest-btn:hover {
    border-color: var(--accent);
    background: rgba(0,245,160,0.05);
  }

  /* Activity feed */
  #activityFeed {
    padding: 12px 16px;
    height: 250px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  .activity-item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 8px 10px;
    background: rgba(255,255,255,0.02);
    border-radius: 8px;
    border-left: 2px solid var(--border);
    animation: fadeIn 0.3s ease;
  }

  .activity-item.success { border-left-color: var(--accent); }
  .activity-item.info { border-left-color: var(--accent2); }
  .activity-item.warn { border-left-color: var(--warn); }

  .activity-icon { font-size: 14px; flex-shrink: 0; margin-top: 1px; }
  .activity-text { font-size: 12px; font-family: 'Space Mono', monospace; }
  .activity-text .time { color: var(--muted); font-size: 10px; display: block; margin-top: 2px; }

  /* Status bar */
  .status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--muted);
  }

  .status-bar .status-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .badge {
    background: rgba(0,245,160,0.12);
    color: var(--accent);
    border: 1px solid rgba(0,245,160,0.25);
    border-radius: 4px;
    padding: 2px 8px;
    font-size: 10px;
  }

  .badge.blue {
    background: rgba(0,200,255,0.12);
    color: var(--accent2);
    border-color: rgba(0,200,255,0.25);
  }

  /* Loading dots */
  .loading-dots span {
    animation: blink 1.4s infinite both;
    font-size: 18px;
    line-height: 1;
  }
  .loading-dots span:nth-child(2) { animation-delay: 0.2s; }
  .loading-dots span:nth-child(3) { animation-delay: 0.4s; }

  @keyframes blink {
    0%, 80%, 100% { opacity: 0.1; }
    40% { opacity: 1; }
  }

  /* Typing indicator */
  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 10px 14px;
    background: rgba(0,200,255,0.08);
    border: 1px solid rgba(0,200,255,0.15);
    border-radius: 12px;
    align-self: flex-start;
    width: fit-content;
  }

  .typing-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent2);
    animation: typingBounce 1.2s infinite;
  }

  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typingBounce {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
    30% { transform: translateY(-6px); opacity: 1; }
  }

  /* Setup guide */
  .setup-guide {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .setup-guide h3 {
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 14px;
    color: var(--accent);
    font-family: 'Space Mono', monospace;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  .steps {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }

  .step {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 12px;
  }

  .step-num {
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    font-weight: 700;
    color: #000;
    margin-bottom: 8px;
    font-family: 'Space Mono', monospace;
  }

  .step h4 {
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 4px;
  }

  .step p {
    font-size: 11px;
    color: var(--muted);
    line-height: 1.4;
    font-family: 'Space Mono', monospace;
  }

  .code-snippet {
    background: rgba(0,0,0,0.4);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 10px 14px;
    font-family: 'Space Mono', monospace;
    font-size: 11px;
    color: var(--accent2);
    margin-top: 8px;
    overflow-x: auto;
    white-space: nowrap;
  }
</style>
</head>
<body>
<div class="app">

  <!-- Header -->
  <header>
    <div class="logo">
      <div class="logo-icon">⚡</div>
      <div class="logo-text">
        <h1>SolAgent AI</h1>
        <span>Bitget Wallet × Solana</span>
      </div>
    </div>
    <button id="connectBtn" onclick="connectWallet()">
      <div class="dot" id="walletDot"></div>
      Connect Bitget
    </button>
  </header>

  <!-- Wallet Info Bar -->
  <div id="walletInfo">
    <div class="stat-item">
      <label>Wallet Address</label>
      <div class="val blue" id="walletAddr">—</div>
    </div>
    <div class="stat-item">
      <label>SOL Balance</label>
      <div class="val green" id="solBalance">—</div>
    </div>
    <div class="stat-item">
      <label>Network</label>
      <div class="val" id="networkName">Mainnet-Beta</div>
    </div>
  </div>

  <!-- Setup Guide -->
  <div class="setup-guide">
    <h3>🚀 Free Setup — No Payment Required</h3>
    <div class="steps">
      <div class="step">
        <div class="step-num">1</div>
        <h4>Install Bitget Wallet</h4>
        <p>Free Chrome extension — supports Solana natively</p>
      </div>
      <div class="step">
        <div class="step-num">2</div>
        <h4>Get Free RPC</h4>
        <p>Sign up at helius.dev — free 10M credits/month</p>
        <div class="code-snippet">HELIUS_RPC=your_url</div>
      </div>
      <div class="step">
        <div class="step-num">3</div>
        <h4>Claude API</h4>
        <p>Get free API key at console.anthropic.com</p>
        <div class="code-snippet">ANTHROPIC_KEY=sk-ant-...</div>
      </div>
      <div class="step">
        <div class="step-num">4</div>
        <h4>Install & Run</h4>
        <p>npm install then npm start — totally free!</p>
        <div class="code-snippet">npm i @solana/web3.js</div>
      </div>
    </div>
  </div>

  <!-- Main Grid -->
  <div class="main-grid">

    <!-- Chat Panel -->
    <div class="panel">
      <div class="panel-header">
        <span class="icon">🤖</span>
        AI Agent Chat
        <div style="margin-left:auto; display:flex; gap:6px; align-items:center;">
          <div class="dot live"></div>
          <span style="font-size:10px; color: var(--accent); font-family: Space Mono; font-weight:400;">LIVE</span>
        </div>
      </div>

      <div id="chatMessages">
        <div class="msg agent">
          <span class="agent-label">◈ SOLAGENT</span>
          Gm! I'm your Solana AI agent. Connect your Bitget Wallet and I can help you check balances, analyze tokens, send SOL, swap tokens, and monitor your portfolio. What would you like to do?
        </div>
      </div>

      <div class="chat-input-row">
        <input
          id="chatInput"
          type="text"
          placeholder="Ask me anything about your wallet..."
          onkeydown="if(event.key==='Enter') sendMessage()"
        />
        <button id="sendBtn" onclick="sendMessage()">➤</button>
      </div>
    </div>

    <!-- Suggestions + Activity -->
    <div style="display:flex; flex-direction:column; gap:16px;">
      <!-- Quick Commands -->
      <div class="panel">
        <div class="panel-header">
          <span class="icon">⚡</span>
          Quick Commands
        </div>
        <div class="suggestions">
          <div class="suggest-label">Tap to ask →</div>
          <button class="suggest-btn" onclick="quickAsk('Check my SOL balance')">
            💰 Check my SOL balance
          </button>
          <button class="suggest-btn" onclick="quickAsk('Show my recent transactions')">
            📋 Show recent transactions
          </button>
          <button class="suggest-btn" onclick="quickAsk('What is the current SOL price?')">
            📈 Current SOL price
          </button>
          <button class="suggest-btn" onclick="quickAsk('How do I swap tokens on Solana?')">
            🔄 How to swap tokens
          </button>
          <button class="suggest-btn" onclick="quickAsk('Analyze my portfolio risk')">
            🛡️ Analyze portfolio risk
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Activity Feed -->
  <div class="panel" style="margin-bottom:16px;">
    <div class="panel-header">
      <span class="icon">📡</span>
      Agent Activity Log
    </div>
    <div id="activityFeed">
      <div class="activity-item info">
        <span class="activity-icon">🚀</span>
        <div class="activity-text">
          Agent initialized — Waiting for wallet connection
          <span class="time">just now</span>
        </div>
      </div>
      <div class="activity-item info">
        <span class="activity-icon">🔑</span>
        <div class="activity-text">
          Bitget Wallet SDK ready — Click "Connect Bitget" to begin
          <span class="time">just now</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Status Bar -->
  <div class="status-bar">
    <div class="status-item">
      <span>Network:</span>
      <span class="badge">Solana Mainnet</span>
    </div>
    <div class="status-item">
      <span>Wallet:</span>
      <span class="badge blue" id="walletBadge">Not Connected</span>
    </div>
    <div class="status-item">
      <span>Agent:</span>
      <span class="badge">Claude Sonnet</span>
    </div>
  </div>

</div>

<script>
// ─── CONFIG ───────────────────────────────────────────────────────────────
// 🔑 Replace with your free Anthropic API key from console.anthropic.com
const ANTHROPIC_API_KEY = "YOUR_API_KEY_HERE";

// 🔑 Replace with your free Helius RPC from helius.dev
const SOLANA_RPC = "https://api.mainnet-beta.solana.com"; // or your Helius URL

let walletAddress = null;
let solBalance = null;
let conversationHistory = [];

// ─── WALLET CONNECTION ────────────────────────────────────────────────────
async function connectWallet() {
  const btn = document.getElementById('connectBtn');

  try {
    // Check for Bitget Wallet
    const provider = window.bitkeep?.solana || window.solana;

    if (!provider) {
      addActivity('warn', '⚠️', 'Bitget Wallet not found — Please install from Chrome Web Store');
      addMessage('system', '⚠️ Bitget Wallet not detected. Please install it from the Chrome Web Store at bitget.com/web3/downloads');
      return;
    }

    addActivity('info', '🔄', 'Requesting wallet connection...');

    const resp = await provider.connect();
    walletAddress = resp.publicKey.toString();

    // Update UI
    btn.textContent = walletAddress.slice(0,4) + '...' + walletAddress.slice(-4);
    btn.classList.add('connected');
    document.getElementById('walletDot').classList.add('live');
    document.getElementById('walletBadge').textContent = 'Connected';
    document.getElementById('walletAddr').textContent = walletAddress.slice(0,6) + '...' + walletAddress.slice(-4);
    document.getElementById('networkName').textContent = 'Mainnet-Beta';

    // Show wallet info bar
    const infoBar = document.getElementById('walletInfo');
    infoBar.style.display = 'grid';
    setTimeout(() => infoBar.classList.add('show'), 50);

    // Fetch SOL balance
    await fetchBalance();

    addActivity('success', '✅', `Wallet connected: ${walletAddress.slice(0,8)}...`);
    addMessage('agent', `✅ Connected! Your wallet: <strong>${walletAddress.slice(0,6)}...${walletAddress.slice(-4)}</strong>\n\nSOL Balance: <strong>${solBalance} SOL</strong>\n\nWhat would you like me to help you with?`);

  } catch (err) {
    addActivity('warn', '❌', 'Connection failed: ' + err.message);
    addMessage('system', 'Connection failed. Make sure Bitget Wallet is installed and unlocked.');
  }
}

async function fetchBalance() {
  try {
    const res = await fetch(SOLANA_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 1, method: 'getBalance',
        params: [walletAddress]
      })
    });
    const data = await res.json();
    solBalance = (data.result.value / 1e9).toFixed(4);
    document.getElementById('solBalance').textContent = solBalance + ' SOL';
    addActivity('success', '💰', `Balance fetched: ${solBalance} SOL`);
  } catch(e) {
    document.getElementById('solBalance').textContent = 'Error';
  }
}

// ─── AI AGENT ─────────────────────────────────────────────────────────────
async function sendMessage() {
  const input = document.getElementById('chatInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  document.getElementById('sendBtn').disabled = true;

  addMessage('user', text);
  addActivity('info', '💬', `User: ${text.slice(0, 40)}...`);

  // Show typing
  const typingId = showTyping();

  try {
    const systemPrompt = `You are SolAgent, an expert Solana blockchain AI assistant integrated with Bitget Wallet.

Current wallet state:
- Address: ${walletAddress || 'Not connected'}
- SOL Balance: ${solBalance || 'Unknown'}
- Network: Solana Mainnet-Beta
- Wallet: Bitget Wallet

You help users with:
1. Checking balances and portfolio analysis
2. Explaining Solana transactions and fees
3. Token swaps using Jupiter Aggregator
4. NFT analysis and floor prices
5. DeFi strategies on Solana (Raydium, Orca, Marinade)
6. Security best practices
7. Gas fee optimization

Be concise, technical, and helpful. Use ◈ bullet points. Include tx hashes or addresses when relevant.
If user asks to send/swap tokens, explain the steps they need to take but note you cannot execute transactions directly — they must confirm in their Bitget Wallet.`;

    conversationHistory.push({ role: 'user', content: text });

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 600,
        system: systemPrompt,
        messages: conversationHistory
      })
    });

    const data = await response.json();
    removeTyping(typingId);

    if (data.content && data.content[0]) {
      const reply = data.content[0].text;
      conversationHistory.push({ role: 'assistant', content: reply });
      addMessage('agent', reply);
      addActivity('success', '🤖', 'Agent responded successfully');
    } else if (data.error) {
      removeTyping(typingId);
      if (ANTHROPIC_API_KEY === 'YOUR_API_KEY_HERE') {
        addMessage('agent', '⚠️ No API key set yet! To enable real AI responses:\n\n◈ Go to console.anthropic.com\n◈ Create a free account\n◈ Generate an API key\n◈ Replace YOUR_API_KEY_HERE in the code\n\nFor now, I can still help with wallet operations!');
      } else {
        addMessage('system', 'API Error: ' + (data.error.message || 'Unknown error'));
      }
    }

  } catch (err) {
    removeTyping(typingId);
    addMessage('agent', '◈ I\'m in demo mode. To enable AI: Add your free Anthropic API key to the code.\n\nYou can get one free at console.anthropic.com — no credit card needed for testing!');
    addActivity('warn', '⚠️', 'API key not configured — demo mode');
  }

  document.getElementById('sendBtn').disabled = false;
}

function quickAsk(text) {
  document.getElementById('chatInput').value = text;
  sendMessage();
}

// ─── UI HELPERS ───────────────────────────────────────────────────────────
function addMessage(type, text) {
  const feed = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `msg ${type}`;

  if (type === 'agent') {
    div.innerHTML = `<span class="agent-label">◈ SOLAGENT</span>${text.replace(/\n/g, '<br>')}`;
  } else {
    div.textContent = text;
  }

  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
}

function showTyping() {
  const feed = document.getElementById('chatMessages');
  const id = 'typing_' + Date.now();
  const div = document.createElement('div');
  div.id = id;
  div.className = 'typing-indicator';
  div.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
  feed.appendChild(div);
  feed.scrollTop = feed.scrollHeight;
  return id;
}

function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function addActivity(type, icon, text) {
  const feed = document.getElementById('activityFeed');
  const div = document.createElement('div');
  div.className = `activity-item ${type}`;
  const now = new Date().toLocaleTimeString();
  div.innerHTML = `<span class="activity-icon">${icon}</span><div class="activity-text">${text}<span class="time">${now}</span></div>`;
  feed.prepend(div);

  // Keep max 20 items
  while (feed.children.length > 20) feed.lastChild.remove();
}

// Animate on load
window.addEventListener('load', () => {
  const app = document.querySelector('.app');
  app.style.opacity = '0';
  app.style.transform = 'translateY(20px)';
  setTimeout(() => {
    app.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    app.style.opacity = '1';
    app.style.transform = 'translateY(0)';
  }, 100);
});
</script>
</body>
</html>
