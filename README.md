# 🦞 LogerClaw

**AI-Powered Logistics Optimization with Blockchain Verification**

*Production mindset. MVP execution. Ship it.*

---

## 🎯 What is LogerClaw?

LogerClaw is an autonomous AI agent that optimizes end-to-end logistics routes for domestic and cross-border shipments. It combines:

- **AI Decision-Making**: Multi-factor route optimization (cost, time, safety, risk)
- **Blockchain Anchoring**: Immutable on-chain proof via Solana
- **Production-Ready API**: REST endpoints for seamless integration
- **Real-Time Simulation**: GPS-tracked event generation

**Built for:** [Colosseum Agent Hackathon](https://colosseum.com/agent-hackathon/)

---

## ✨ Key Features

### 🤖 **Intelligent Route Generation**
- Multiple realistic route options (air, sea, truck, rail)
- Multimodal logistics sequences
- Cross-border customs detection
- Operational realism (handovers, delays)

### 💰 **Comprehensive Cost Analysis**
- Shipping, fuel, port/airport fees
- Customs (export & import)
- Insurance & warehousing
- Transparent breakdowns in USD

### 🛡️ **Risk & Safety Assessment**
- Safety scoring (1-10)
- Delay probability (low/medium/high)
- Customs complexity analysis
- Mitigation recommendations

### 📍 **Event Simulation**
- Chronological logistics events
- Mocked but realistic GPS coordinates
- Tracking from origin to delivery
- Customs clearance stages

### ⛓️ **Blockchain Integration**
- Route decisions anchored to Solana
- Cryptographic verification
- Immutable audit trail
- Explorer links for transparency

### 🌐 **REST API**
- 7 production-ready endpoints
- JSON request/response
- Auto-documentation
- CORS enabled

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- VPS or localhost

### Installation

```bash
# Clone repository
git clone <your-repo>
cd agent-hackathon

# Install dependencies
npm install

# Build project
npm run build
```

### Run Demo (CLI)

```bash
# Basic demo
npm run dev

# With blockchain anchoring
npm run blockchain
```

### Run API Server

```bash
# Start server
npm run api

# Server runs on http://localhost:3000
```

### Access Demo UI

Open browser: `http://localhost:3000/`

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/docs` | GET | Full documentation |
| `/api/v1/decide` | POST | **Main: Optimize route** |
| `/api/v1/tools/generate-routes` | POST | Generate route options |
| `/api/v1/tools/calculate-cost` | POST | Calculate cost breakdown |
| `/api/v1/tools/evaluate-risk` | POST | Assess risks |
| `/api/v1/tools/simulate-events` | POST | Generate GPS events |

**Full API docs:** [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)

---

## 🛠️ Architecture

### Tool-Based Design

```
User Request
     ↓
generate_routes → 3+ route options
     ↓
calculate_cost → Cost for each route
     ↓
evaluate_risk → Risk for each route
     ↓
Agent Scoring & Ranking
     ↓
generate_explanation → Natural language reasoning
     ↓
(Optional) Blockchain Anchoring
     ↓
Response with recommended route
```

### File Structure

```
agent-hackathon/
├── src/
│   ├── agent/
│   │   └── logerclaw-agent.ts       # Main orchestrator
│   ├── tools/
│   │   ├── generate-routes.tool.ts   # Route generation
│   │   ├── calculate-cost.tool.ts    # Cost calculation
│   │   ├── evaluate-risk.tool.ts     # Risk assessment
│   │   ├── simulate-events.tool.ts   # Event simulation
│   │   ├── generate-explanation.tool.ts  # Reasoning
│   │   └── index.ts                  # Tool registry
│   ├── solana/
│   │   ├── agent-wallet.ts           # Wallet management
│   │   ├── route-anchor.ts           # On-chain anchoring
│   │   └── index.ts
│   ├── types/
│   │   └── tool-types.ts             # TypeScript types
│   ├── api-server.ts                 # REST API
│   ├── index.ts                      # CLI demo
│   └── index-blockchain.ts           # Blockchain demo
├── public/
│   └── index.html                    # Demo UI
├── keys/
│   └── logerclaw-agent.json          # Solana keypair
└── package.json
```

---

## 💡 Usage Examples

### JavaScript
```javascript
const response = await fetch('http://localhost:3000/api/v1/decide', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    origin: { city: 'Shanghai', country: 'China', countryCode: 'CN' },
    destination: { city: 'Los Angeles', country: 'United States', countryCode: 'US' },
    cargo: { weight: 500, volume: 2, value: 25000, type: 'electronics' },
    preferences: { priority: 'balanced', anchorToBlockchain: true }
  })
});

const { data } = await response.json();
console.log(data.recommended_route);
console.log(data.blockchainSignature); // Solana transaction
```

### Python
```python
import requests

result = requests.post('http://localhost:3000/api/v1/decide', json={
    'origin': {'city': 'Shanghai', 'country': 'China', 'countryCode': 'CN'},
    'destination': {'city': 'Los Angeles', 'country': 'United States', 'countryCode': 'US'},
    'cargo': {'weight': 500, 'volume': 2, 'value': 25000, 'type': 'electronics'},
    'preferences': {'priority': 'balanced', 'anchorToBlockchain': True}
}).json()

print(result['data']['recommended_route'])
print(result['data']['blockchainSignature'])
```

### cURL
```bash
curl -X POST http://localhost:3000/api/v1/decide \
  -H "Content-Type: application/json" \
  -d '{"origin":{"city":"Shanghai","country":"China","countryCode":"CN"},...}'
```

---

## 🎬 Demo

### CLI Demo
[![Demo](https://img.shields.io/badge/Demo-CLI-blue)]()

```bash
npm run blockchain
```

Output:
```
🦞 LogerClaw - AI-Powered Logistics with Blockchain Verification

📦 Shipment: Shanghai → Los Angeles (500kg electronics)

🏆 RECOMMENDED ROUTE: Air Freight Direct
💰 Cost: $6,348
⏱️  Time: 1.9 days
🛡️  Safety: 6.7/10
✅ Confidence: 85%

⛓️  BLOCKCHAIN PROOF:
Signature: 5YH8mK...
Explorer: https://explorer.solana.com/tx/5YH8mK...?cluster=devnet
Status: ✅ ANCHORED ON SOLANA
```

### Web UI
![UI Screenshot](https://via.placeholder.com/800x400?text=LogerClaw+Demo+UI)

Access: `http://localhost:3000/`

---

## ⛓️ Blockchain Integration

### Solana Devnet

LogerClaw anchors route decisions to Solana for:
- **Immutability**: Decisions can't be altered
- **Verification**: Anyone can verify decisions on-chain
- **Audit Trail**: Complete history of AI recommendations
- **Trust**: No centralized authority needed

### How It Works

1. Agent makes routing decision
2. Decision hash generated (SHA-256)
3. Transaction posted to Solana
4. Signature & explorer link returned
5. Anyone can verify on Solana Explorer

### Wallet

Generated automatically on first run:
- Location: `./keys/logerclaw-agent.json`
- Network: Solana Devnet
- Balance: Airdropped for testing

---

## 🏗️ Production Deployment

### VPS Deployment

```bash
# SSH to VPS
ssh your-vps

# Clone & install
git clone <repo> && cd agent-hackathon
npm install
npm run build

# Start API (with PM2)
pm2 start dist/api-server.js --name logerclaw-api
pm2 startup
pm2 save

# Configure firewall
ufw allow 3000/tcp
```

### Environment Variables

```env
PORT=3000
WALLET_KEYPAIR_PATH=./keys/logerclaw-agent.json
ALLOWED_ORIGINS=https://yourdomain.com
NODE_ENV=production
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name api.logerclaw.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 📊 Performance

- **Decision Time**: ~2-4 seconds
- **Route Generation**: ~500ms
- **Cost Calculation**: ~100ms per route
- **Risk Assessment**: ~200ms per route
- **Blockchain Anchoring**: ~2-5 seconds (Solana)

---

## 🛡️ Security

- ✅ Input validation
- ✅ Error handling
- ✅ CORS configuration
- ✅ Secure keypair storage (600 permissions)
- ⏳ Rate limiting (TODO)
- ⏳ API key authentication (TODO)

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Core routing engine
- [x] 5 specialized tools
- [x] Blockchain integration
- [x] REST API
- [x] Demo UI

### Phase 2: Production (Q2 2026)
- [ ] Custom Anchor program
- [ ] Real-time carrier APIs
- [ ] Dynamic pricing
- [ ] User authentication
- [ ] Rate limiting
- [ ] Analytics dashboard

### Phase 3: Scale (Q3 2026)
- [ ] Multi-chain support
- [ ] Token-gated features
- [ ] Decentralized oracle network
- [ ] NFT route certificates
- [ ] On-chain governance

---

## 🌐 Website Architecture

LogerClaw website serves as an **AI-powered logistics intelligence layer** with 3 main functions:
1. **🧠 Education & Information** - Clear value proposition for users
2. **⚙️ Interface for AI Tools** - Demo & early access collection
3. **🔌 Gateway to LogerChain** - Future infrastructure layer

### Website Structure (7 Pages)

- **`/`** - Landing Page (Hero, problem/solution, showcase)
- **`/agent`** - AI Agent Demo (Current demo page)
- **`/tools`** - Tools & Capabilities (5 AI tools showcase)
- **`/request-access`** - Request Access Form (Lead collection)
- **`/logerchain`** - LogerChain Protocol (Future infrastructure)
- **`/docs`** - Documentation (Lightweight technical docs)
- **`/about`** - About & Vision (Project context)

**Documentation:**
- 📐 [WEBSITE-ARCHITECTURE.md](./WEBSITE-ARCHITECTURE.md) - Complete architecture
- 🗺️ [WEBSITE-ROADMAP.md](./WEBSITE-ROADMAP.md) - Implementation roadmap
- 🚀 [WEBSITE-QUICK-START.md](./WEBSITE-QUICK-START.md) - Quick reference guide

**Status:** Architecture defined, ready for implementation (2-5 days)

---

## 🤝 Contributing

LogerClaw is built for the [Colosseum Agent Hackathon](https://colosseum.com/agent-hackathon/). 

Contributions welcome after hackathon submission.

---

## 📄 License

MIT License - See LICENSE file

---

## 🙏 Acknowledgments

- **Colosseum** - Agent Hackathon platform
- **Solana** - Blockchain infrastructure
- **OpenClaw** - Inspiration for agent frameworks

---

## 📞 Support & Contact

- **Documentation**: [API-DOCUMENTATION.md](./API-DOCUMENTATION.md)
- **Issues**: GitHub Issues
- **Discord**: [Join LogerChain Community](#)

---

## 🎯 Hackathon Submission

**Project**: LogerClaw  
**Category**: AI Agent + Blockchain  
**Tech Stack**: TypeScript, Node.js, Express, Solana, @solana/web3.js  
**Deployment**: Hostinger VPS  
**Demo**: http://76.13.193.185:3000

---

**Built with 🦞 by LogerChain Team**

*Decisive. Technical. Production-ready.*
# LogerClaw
