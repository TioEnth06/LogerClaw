# 🚀 QUICK START - Connect Cursor ke VPS

## ✅ Setup Sudah Selesai!

SSH Key passwordless login sudah configured. Sekarang tinggal **connect Cursor dan mulai coding!**

---

## 📋 STEP 1: Connect Cursor ke VPS (2 menit)

### A. Buka Cursor

### B. Open Remote Connection
- **Mac**: Tekan `Cmd+Shift+P`
- **Windows/Linux**: Tekan `Ctrl+Shift+P`

### C. Connect to SSH Host
Ketik: `Remote-SSH: Connect to Host...`

Pilih: **`hostinger-logerclaw`**

### D. Tunggu Connection (pertama kali ~1-2 menit)
Cursor akan:
- Connect ke VPS
- Install Cursor Server di VPS
- Setup remote environment

### E. Open Folder di VPS
Setelah connected, open folder:
```
/root/agent-hackathon
```

### F. ✅ DONE! You're now coding on VPS directly from Cursor!

---

## 📋 STEP 2: Setup TypeScript & Create Agent Structure (5 menit)

Di **Cursor Terminal** (yang sudah connected ke VPS):

```bash
# Install TypeScript & tools
npm install --save-dev typescript @types/node ts-node nodemon

# Initialize TypeScript
npx tsc --init

# Create directory structure
mkdir -p src/agent src/solana src/utils

# Create main entry file
cat > src/index.ts << 'EOF'
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import fs from 'fs';
import path from 'path';

console.log('🤖 LogerClaw Agent Starting...');
console.log('🏆 Agent Hackathon 2026 - Powered by OpenClaw');

const DEVNET_URL = 'https://api.devnet.solana.com';

async function initializeAgent() {
    console.log('\n📡 Connecting to Solana Devnet...');
    const connection = new Connection(DEVNET_URL, 'confirmed');
    
    // Test connection
    const version = await connection.getVersion();
    console.log('✅ Connected! Solana Version:', version['solana-core']);
    
    // Create or load wallet
    const walletPath = path.join(__dirname, '../wallet.json');
    let keypair: Keypair;
    
    if (fs.existsSync(walletPath)) {
        console.log('\n💰 Loading existing wallet...');
        const walletData = JSON.parse(fs.readFileSync(walletPath, 'utf-8'));
        keypair = Keypair.fromSecretKey(Uint8Array.from(walletData.secretKey));
    } else {
        console.log('\n💰 Creating new wallet...');
        keypair = Keypair.generate();
        const walletData = {
            publicKey: keypair.publicKey.toBase58(),
            secretKey: Array.from(keypair.secretKey)
        };
        fs.writeFileSync(walletPath, JSON.stringify(walletData, null, 2));
    }
    
    console.log('📝 Wallet Address:', keypair.publicKey.toBase58());
    
    // Check balance
    const balance = await connection.getBalance(keypair.publicKey);
    console.log('💵 Balance:', balance / 1e9, 'SOL');
    
    if (balance === 0) {
        console.log('⚠️  No SOL balance. Request airdrop at:');
        console.log('   https://faucet.solana.com');
    }
    
    console.log('\n🎯 Agent initialized successfully!');
    console.log('🔨 Ready to build for Agent Hackathon!');
    
    return { connection, keypair };
}

async function main() {
    try {
        const { connection, keypair } = await initializeAgent();
        
        console.log('\n🤖 Agent is running...');
        console.log('📚 Check skill.md for hackathon requirements');
        console.log('🌐 Visit https://openclaw.ai/ for framework docs\n');
        
        // Your agent logic here
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

main();
EOF

# Update package.json with scripts
npm pkg set scripts.start="ts-node src/index.ts"
npm pkg set scripts.dev="nodemon --watch src --ext ts --exec ts-node src/index.ts"
npm pkg set scripts.build="tsc"

echo "✅ Project structure created!"
```

---

## 📋 STEP 3: Test Your Agent (1 menit)

```bash
# Run agent
npm start
```

Expected output:
```
🤖 LogerClaw Agent Starting...
🏆 Agent Hackathon 2026 - Powered by OpenClaw
📡 Connecting to Solana Devnet...
✅ Connected! Solana Version: x.xx.x
💰 Creating new wallet...
📝 Wallet Address: [your-wallet-address]
💵 Balance: 0 SOL
⚠️  No SOL balance. Request airdrop at: https://faucet.solana.com
🎯 Agent initialized successfully!
```

---

## 📋 STEP 4: Get Devnet SOL (1 menit)

1. Copy your wallet address from output
2. Visit: https://faucet.solana.com
3. Paste address & request airdrop
4. Run agent again: `npm start`

---

## 📋 STEP 5: Read Hackathon Requirements

```bash
# Read skill file
cat skill.md

# Or open in Cursor
```

Visit: https://colosseum.com/agent-hackathon/

---

## 🏗️ Project Structure

```
agent-hackathon/
├── src/
│   ├── index.ts          ← Main entry point (created)
│   ├── agent/            ← Your agent logic
│   │   ├── brain.ts      ← Decision making
│   │   └── actions.ts    ← Agent actions
│   ├── solana/           ← Solana interactions
│   │   ├── transactions.ts
│   │   └── programs.ts
│   └── utils/            ← Helper functions
│       └── logger.ts
├── wallet.json           ← Generated on first run
├── package.json          ← Dependencies
├── tsconfig.json         ← TypeScript config
└── skill.md              ← Hackathon info
```

---

## 🎯 What to Build?

Check the hackathon requirements, but ideas:

1. **Trading Agent**: Automated trading on Solana DEXs
2. **NFT Agent**: Automated NFT minting/trading
3. **DeFi Agent**: Yield farming, staking automation
4. **Social Agent**: On-chain social interactions
5. **Data Agent**: On-chain analytics & insights
6. **Security Agent**: Smart contract auditing
7. **GameFi Agent**: Gaming automation

**Requirements**: Must be autonomous, use Solana, and leverage OpenClaw!

---

## 🔨 Development Workflow

```bash
# Development mode (auto-restart on changes)
npm run dev

# Run once
npm start

# Build TypeScript
npm run build

# Install new packages
npm install [package-name]

# Check logs
tail -f logs/agent.log  # if you implement logging
```

---

## 📚 Useful Code Snippets

### Create Transaction
```typescript
import { Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';

const transaction = new Transaction().add(
    SystemProgram.transfer({
        fromPubkey: keypair.publicKey,
        toPubkey: recipient,
        lamports: 1000000, // 0.001 SOL
    })
);

const signature = await sendAndConfirmTransaction(connection, transaction, [keypair]);
console.log('Transaction:', signature);
```

### Monitor Account
```typescript
connection.onAccountChange(
    accountPublicKey,
    (accountInfo) => {
        console.log('Account changed:', accountInfo);
    },
    'confirmed'
);
```

### Get Recent Transactions
```typescript
const signatures = await connection.getSignaturesForAddress(publicKey, { limit: 10 });
console.log('Recent transactions:', signatures);
```

---

## 🐛 Troubleshooting

### "Module not found"
```bash
npm install
```

### "Connection refused"
Check if you're using correct RPC:
```typescript
const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
```

### TypeScript errors
```bash
npx tsc --noEmit  # Check errors without building
```

### Cursor disconnected
- Check internet connection
- Reconnect: `Cmd+Shift+P` → `Remote-SSH: Connect to Host...`

---

## 🔐 Security Reminder

⚠️ **JANGAN LUPA GANTI PASSWORD VPS!**

```bash
passwd
# Masukkan password baru yang kuat
```

---

## ✅ Checklist Sebelum Submit Hackathon

- [ ] Agent berjalan autonomous (tidak perlu manual intervention)
- [ ] Menggunakan Solana blockchain (devnet OK)
- [ ] Integration dengan OpenClaw framework
- [ ] Code well-documented
- [ ] README.md dengan setup instructions
- [ ] Demo video (jika diminta)
- [ ] Register agent di Colosseum platform
- [ ] Claim code ke wallet Solana Anda

---

## 🏆 Hackathon Deadline

**February 12, 2026** - Submit before deadline!

---

## 📞 Need Help?

- **Hackathon**: https://colosseum.com/agent-hackathon/
- **OpenClaw Docs**: https://openclaw.ai/
- **Solana Docs**: https://docs.solana.com/
- **Discord**: Check hackathon page for community

---

**🚀 YOU'RE ALL SET! START BUILDING YOUR AGENT NOW!**

Good luck! 🍀
