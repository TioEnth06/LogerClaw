# 🎬 Demo Video Recording Guide - LogerClaw

**Target Duration:** 2 minutes (120 seconds)  
**Demo URL:** http://76.13.193.185:3000  
**Status:** ✅ All systems ready

---

## ✅ PRE-RECORDING CHECKLIST

### System Verification
- [x] ✅ VPS Online: http://76.13.193.185:3000
- [x] ✅ API Health: `{"status":"healthy","blockchain":true}`
- [x] ✅ Blockchain: Working (tested & verified)
- [x] ✅ UI: Accessible and responsive
- [ ] ⏳ Browser tabs prepared
- [ ] ⏳ Terminal ready with curl command
- [ ] ⏳ Screen recorder configured
- [ ] ⏳ Audio tested

### Pre-Recording Setup
1. **Close unnecessary applications**
   - Close Slack, Discord, email notifications
   - Disable system notifications
   - Close unnecessary browser tabs

2. **Prepare browser**
   - Open: http://76.13.193.185:3000/
   - Make sure UI loads correctly
   - Test one optimization to ensure it works

3. **Prepare terminal**
   - Clear terminal history: `clear`
   - Have curl command ready (see below)
   - Test command works before recording

4. **Audio setup**
   - Test microphone
   - Check audio levels
   - Speak clearly and at moderate pace

5. **Screen recording**
   - Choose recording tool (see below)
   - Set recording area (full screen or browser window)
   - Test recording for 5 seconds
   - Check audio is captured

---

## 🎥 RECORDING TOOLS

### Mac (Recommended)
**QuickTime Player:**
1. Open QuickTime Player
2. File → New Screen Recording
3. Click dropdown arrow → Select microphone
4. Click record button
5. Select area to record (full screen or window)
6. Click "Record" button

**Alternative: OBS Studio**
- Download: https://obsproject.com/
- More control over audio/video settings
- Can add overlays, transitions

### Windows
**OBS Studio (Recommended):**
- Download: https://obsproject.com/
- Free, open-source
- Professional quality

**Windows Game Bar:**
- Press `Win + G`
- Click record button
- Less control but built-in

### Linux
**SimpleScreenRecorder:**
```bash
sudo apt install simplescreenrecorder
simplescreenrecorder
```

**OBS Studio:**
- Available for Linux
- Best option for professional recording

---

## 📝 DEMO SCRIPT (120 seconds)

### **Part 1: Introduction (15 seconds)**

**Say:**
> "This is LogerClaw - an AI-powered logistics optimization agent with blockchain verification. Built for the Colosseum Agent Hackathon, it combines intelligent route optimization with immutable on-chain proof."

**Show:**
- Browser window with http://76.13.193.185:3000/
- Point to UI: "Clean, modern interface"
- Highlight: "AI + Blockchain for supply chain"

**Timing:** 15s

---

### **Part 2: Input Shipment (10 seconds)**

**Say:**
> "Let's optimize a real-world cross-border shipment."

**Do:**
- Show pre-filled form:
  - Origin: Shanghai, China
  - Destination: Los Angeles, USA
  - Cargo: 500kg electronics, $25,000 value
  - Priority: Balanced
  - Blockchain: Enabled ✓

**Say:**
> "500kg electronics shipment, balanced optimization, with blockchain anchoring enabled."

**Timing:** 10s

---

### **Part 3: Optimize (5 seconds)**

**Do:**
- Click "🚀 Optimize Route" button
- Show loading animation

**Say:**
> "The AI analyzes multiple routes, considering cost, time, safety, and customs complexity."

**Timing:** 5s

---

### **Part 4: Results (30 seconds) - CRITICAL**

**Say:**
> "Here's the AI's recommendation:"

**Point out (in order):**

1. **Route Decision (5s)**
   - "Air Freight Direct - fastest option"
   - "1.9 days delivery time"
   - "Recommended with 85% confidence"

2. **Cost Breakdown (5s)**
   - "Total cost: $6,348"
   - "Complete transparency: shipping, fuel, customs, insurance"
   - "All costs broken down in USD"

3. **Risk Analysis (5s)**
   - "Safety score: 6.7 out of 10"
   - "Medium delay risk"
   - "Medium customs complexity"

4. **AI Reasoning (10s)**
   - Scroll through explanation
   - "Natural language explanation of WHY this route"
   - "Cost comparison with alternatives"
   - "Risk mitigation strategies"

5. **Blockchain Proof (5s)**
   - Show signature: `5Nj1LrY9yynkQm9biAdN3ZyGCyQWym91ZZ5kKhHpXbXfLzMT2aX2msdpJ5mLzFAYogVkTeJZ85sYfpFpkiRNinFM`
   - "Anchored on Solana blockchain - immutable and verifiable"
   - "Click explorer link" (optional, if time permits)

**Timing:** 30s

---

### **Part 5: API Demo (30 seconds)**

**Say:**
> "This is production-ready. Here's the REST API."

**Do:**
- Switch to terminal
- Run curl command:

```bash
curl -X POST http://76.13.193.185:3000/api/v1/decide \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"city": "Shanghai", "country": "China", "countryCode": "CN"},
    "destination": {"city": "Los Angeles", "country": "United States", "countryCode": "US"},
    "cargo": {"weight": 500, "volume": 2, "value": 25000, "type": "electronics"},
    "preferences": {"priority": "balanced", "anchorToBlockchain": true}
  }' | python3 -m json.tool | head -30
```

**Say:**
> "JSON in, JSON out. Easy integration with any system."

**Point out:**
- Recommended route in response
- Cost analysis
- Blockchain signature
- "Production-ready API, fully documented"

**Timing:** 30s

---

### **Part 6: Value Proposition (30 seconds) - CRITICAL**

**Say:**
> "Why LogerClaw matters:"

**Key Points:**

1. **Immutable Decisions (10s)**
   > "Every routing decision is anchored to Solana blockchain. Can't be altered. Can't be disputed. Cryptographically verifiable. This creates trust in AI decisions."

2. **Real-World Application (10s)**
   > "This enables: Supply chain financing with on-chain proof. Insurance automation. Regulatory compliance. Multi-party trust without intermediaries. Dispute resolution with immutable audit trail."

3. **Production Ready (10s)**
   > "This isn't a prototype. Full REST API. TypeScript. Error handling. Complete documentation. Deploy anywhere. Integrate with anything. Built for production, ready to ship."

**Close:**
> "LogerClaw: AI-powered logistics optimization with blockchain proof. Built for the Colosseum Agent Hackathon. Thank you."

**Timing:** 30s

---

## 🎯 KEY TALKING POINTS

### Emphasize:
- ✅ **"Blockchain verification"** - Say this multiple times
- ✅ **"Production-ready"** - Not a prototype
- ✅ **"Immutable"** - Decisions can't be changed
- ✅ **"Real-world value"** - Business applications
- ✅ **"AI + Blockchain"** - Unique combination

### Technical Highlights (if time):
- 5 specialized tools
- Multi-factor optimization
- Natural language reasoning
- Solana integration via AgentWallet
- REST API with 7 endpoints
- TypeScript for type safety

---

## 📋 RECORDING CHECKLIST

### Before Recording:
- [ ] All browser tabs closed except demo URL
- [ ] Terminal cleared and ready
- [ ] Microphone tested
- [ ] Screen recorder configured
- [ ] Notifications disabled
- [ ] Desktop background clean
- [ ] Demo URL tested and working
- [ ] API endpoint tested
- [ ] One practice run completed

### During Recording:
- [ ] Speak clearly and confidently
- [ ] Point to specific UI elements
- [ ] Emphasize "blockchain verification"
- [ ] Show Solana signature clearly
- [ ] Mention "production-ready"
- [ ] Stay within 2 minutes
- [ ] Don't rush critical sections

### After Recording:
- [ ] Save video file
- [ ] Review recording
- [ ] Check audio quality
- [ ] Verify all sections captured
- [ ] Edit if needed (trim start/end)
- [ ] Export in good quality (1080p minimum)

---

## 🎬 RECORDING COMMANDS

### Quick Test Command (Before Recording)
```bash
# Test API works
curl -s http://76.13.193.185:3000/health | jq '.'

# Test decision endpoint
curl -s -X POST http://76.13.193.185:3000/api/v1/decide \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"city": "Shanghai", "country": "China", "countryCode": "CN"},
    "destination": {"city": "Los Angeles", "country": "United States", "countryCode": "US"},
    "cargo": {"weight": 500, "volume": 2, "value": 25000, "type": "electronics"},
    "preferences": {"priority": "balanced", "anchorToBlockchain": true}
  }' | jq '{success, recommended_route: .data.recommended_route.route_name, blockchainSignature: .data.blockchainSignature}'
```

### Terminal Command for Demo
```bash
curl -X POST http://76.13.193.185:3000/api/v1/decide \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"city": "Shanghai", "country": "China", "countryCode": "CN"},
    "destination": {"city": "Los Angeles", "country": "United States", "countryCode": "US"},
    "cargo": {"weight": 500, "volume": 2, "value": 25000, "type": "electronics"},
    "preferences": {"priority": "balanced", "anchorToBlockchain": true}
  }' | python3 -m json.tool | head -30
```

---

## ⏱️ TIMING BREAKDOWN

| Section | Time | Priority | Notes |
|---------|------|----------|-------|
| Intro | 15s | HIGH | Set context |
| Input | 10s | HIGH | Show form |
| Optimize | 5s | HIGH | Loading animation |
| Results | 30s | **CRITICAL** | Main demo - don't rush |
| API | 30s | HIGH | Show production-ready |
| Value | 30s | **CRITICAL** | Why it matters |
| **TOTAL** | **120s** | | |

**Buffer:** 10-15 seconds for natural pauses

---

## 🎤 PRESENTATION TIPS

### Do's:
- ✅ Speak clearly and confidently
- ✅ Point to specific UI elements with cursor
- ✅ Emphasize "blockchain verification" multiple times
- ✅ Show the Solana signature clearly
- ✅ Mention "production-ready" and "real API"
- ✅ Highlight real-world business value
- ✅ Pause briefly between sections
- ✅ Smile and be enthusiastic

### Don'ts:
- ❌ Apologize for anything
- ❌ Say "this is just a demo" or "prototype"
- ❌ Mention missing features
- ❌ Get too technical (unless asked)
- ❌ Rush through blockchain proof section
- ❌ Forget to show API endpoint
- ❌ Go over 2 minutes significantly

---

## 🎥 POST-RECORDING

### Immediate Actions:
1. **Save video**
   - Save as: `logerclaw-demo-2026-02-07.mp4`
   - Keep original high-quality version

2. **Review recording**
   - Watch full video
   - Check audio quality
   - Verify all sections captured
   - Note any issues

3. **Edit if needed**
   - Trim start/end (remove dead time)
   - Adjust audio levels if needed
   - Add title card (optional)
   - Keep it under 2:15 max

4. **Export settings**
   - Resolution: 1080p (1920x1080) minimum
   - Format: MP4 (H.264)
   - Audio: AAC, 128kbps
   - Frame rate: 30fps

### Upload:
1. **YouTube (Recommended)**
   - Upload as **Unlisted**
   - Title: "LogerClaw - AI-Powered Logistics with Blockchain Verification | Colosseum Hackathon"
   - Description: Include demo URL, GitHub link, key features
   - Tags: #ColosseumHackathon #Solana #AI #Blockchain #Logistics

2. **Alternative Platforms**
   - Vimeo (if preferred)
   - Loom (quick sharing)
   - Google Drive (if YouTube not available)

---

## 📸 SCREENSHOTS TO TAKE

After recording, take these screenshots for submission:

1. **Landing Page**
   - URL: http://76.13.193.185:3000/
   - Clean UI showing form

2. **Results Page**
   - After optimization
   - Showing route, cost, risk, reasoning

3. **Blockchain Proof**
   - Signature visible
   - Explorer link (if shown)

4. **Terminal - API Call**
   - curl command
   - JSON response visible

5. **Code Structure** (Optional)
   - File structure in IDE
   - Show tool-based architecture

---

## 🆘 BACKUP PLANS

### If UI Fails During Recording:
- Switch to terminal demo:
  ```bash
  ssh hostinger-logerclaw
  cd ~/agent-hackathon
  npm run blockchain
  ```

### If API Fails:
- Show documentation:
  ```bash
  curl http://76.13.193.185:3000/api/v1/docs | python3 -m json.tool
  ```

### If Everything Fails:
- Show code structure
- Explain architecture
- Show documentation
- Emphasize what was built

---

## ✅ FINAL CHECKLIST

### Ready to Record:
- [x] System verified and working
- [x] Demo URL accessible
- [x] API tested and working
- [x] Blockchain verified
- [ ] Browser prepared
- [ ] Terminal ready
- [ ] Screen recorder ready
- [ ] Audio tested
- [ ] Script memorized/rehearsed
- [ ] One practice run completed

---

## 🚀 YOU'RE READY!

**Everything is prepared.**  
**System is working.**  
**Script is ready.**  
**Go record your demo!** 🎬🦞

**Remember:**
- Stay confident
- Emphasize blockchain verification
- Show production-ready API
- Highlight real-world value
- Keep it under 2 minutes

**Good luck!** 🏆

---

**Last Updated:** February 7, 2026  
**Status:** Ready for recording
