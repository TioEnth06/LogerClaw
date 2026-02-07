# 🌐 LogerClaw API Documentation

**Version:** 1.0.0  
**Base URL:** `http://your-vps-ip:3000`  
**Protocol:** HTTP/JSON  
**Blockchain:** Solana Devnet

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
4. [Error Handling](#error-handling)
5. [Examples](#examples)
6. [Rate Limits](#rate-limits)

---

## 🚀 Quick Start

### Start API Server
```bash
ssh hostinger-logerclaw
cd ~/agent-hackathon
npm run api
```

### Test Connection
```bash
curl http://localhost:3000/health
```

### Expected Response
```json
{
  "status": "healthy",
  "service": "LogerClaw API",
  "version": "1.0.0",
  "blockchain": true
}
```

---

## 🔐 Authentication

**Current Version:** No authentication required (demo/hackathon)

**Production:** Add API key authentication:
```javascript
headers: {
  'Authorization': 'Bearer YOUR_API_KEY'
}
```

---

## 📡 Endpoints

### 1. Health Check

**GET** `/health`

**Description:** Check API server status

**Response:**
```json
{
  "status": "healthy",
  "service": "LogerClaw API",
  "version": "1.0.0",
  "timestamp": "2026-02-05T14:00:00.000Z",
  "blockchain": true
}
```

---

### 2. API Documentation

**GET** `/api/v1/docs`

**Description:** Get complete API documentation

**Response:** Full endpoint specifications

---

### 3. **Optimize Route (MAIN)**

**POST** `/api/v1/decide`

**Description:** Get AI-powered optimal route recommendation with cost, risk analysis, and blockchain anchoring.

**Request Body:**
```json
{
  "origin": {
    "city": "Shanghai",
    "country": "China",
    "countryCode": "CN"
  },
  "destination": {
    "city": "Los Angeles",
    "country": "United States",
    "countryCode": "US"
  },
  "cargo": {
    "weight": 500,
    "volume": 2,
    "value": 25000,
    "type": "electronics",
    "hazardous": false
  },
  "preferences": {
    "priority": "balanced",
    "anchorToBlockchain": false
  }
}
```

**Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `origin.city` | string | ✅ | Origin city name |
| `origin.country` | string | ✅ | Origin country |
| `origin.countryCode` | string | ✅ | ISO country code |
| `destination.*` | string | ✅ | Same as origin |
| `cargo.weight` | number | ✅ | Weight in kg |
| `cargo.volume` | number | ❌ | Volume in m³ |
| `cargo.value` | number | ❌ | Value in USD |
| `cargo.type` | string | ❌ | Cargo type |
| `preferences.priority` | enum | ❌ | cost\|time\|safety\|balanced |
| `preferences.anchorToBlockchain` | boolean | ❌ | Enable Solana anchoring |

**Response:**
```json
{
  "success": true,
  "data": {
    "recommended_route": {
      "route_id": "uuid",
      "route_name": "Air Freight Direct",
      "logistics_sequence": [...],
      "estimated_distance_km": 12300,
      "estimated_time_hours": 46,
      "handover_points_count": 2,
      "customs_required": true
    },
    "cost_analysis": {
      "total_cost_usd": 6348,
      "cost_breakdown": {
        "shipping": 4750,
        "fuel": 603,
        "port_or_airport_fee": 250,
        "customs": 350,
        "insurance": 375,
        "warehousing": 20
      }
    },
    "risk_analysis": {
      "safety_score": 6.7,
      "delay_risk": "medium",
      "customs_complexity": "medium",
      "risk_factors": [...]
    },
    "reasoning": "Selected Route: Air Freight Direct...",
    "alternatives": [...],
    "confidence": 0.85,
    "timestamp": "2026-02-05T14:00:00.000Z",
    "blockchainSignature": "5YH8...",
    "blockchainExplorer": "https://explorer.solana.com/tx/..."
  }
}
```

---

### 4. Generate Routes

**POST** `/api/v1/tools/generate-routes`

**Description:** Generate multiple route options without cost/risk analysis

**Request:**
```json
{
  "origin": {
    "city": "Tokyo",
    "country": "Japan",
    "countryCode": "JP"
  },
  "destination": {
    "city": "Singapore",
    "country": "Singapore",
    "countryCode": "SG"
  },
  "cargo": {
    "weight": 200
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "routes": [
      {
        "route_id": "uuid",
        "route_name": "Standard Multimodal Route",
        "logistics_sequence": [...],
        "estimated_distance_km": 7335,
        "estimated_time_hours": 209,
        "handover_points_count": 2,
        "customs_required": true
      }
    ],
    "generated_at": "2026-02-05T14:00:00.000Z",
    "request_id": "uuid"
  }
}
```

---

### 5. Calculate Cost

**POST** `/api/v1/tools/calculate-cost`

**Description:** Calculate detailed cost breakdown for a specific route

**Request:**
```json
{
  "route": {
    "route_id": "uuid",
    "logistics_sequence": [...],
    "customs_required": true
  },
  "cargo": {
    "weight": 500,
    "volume": 2,
    "value": 25000
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "route_id": "uuid",
    "total_cost_usd": 6348,
    "cost_breakdown": {
      "shipping": 4750,
      "fuel": 603,
      "port_or_airport_fee": 250,
      "customs": 350,
      "insurance": 375,
      "warehousing": 20
    },
    "currency": "USD",
    "calculated_at": "2026-02-05T14:00:00.000Z"
  }
}
```

---

### 6. Evaluate Risk

**POST** `/api/v1/tools/evaluate-risk`

**Description:** Assess safety and operational risks

**Request:**
```json
{
  "route": {
    "route_id": "uuid",
    "logistics_sequence": [...],
    "handover_points_count": 2
  },
  "cargo": {
    "weight": 500,
    "hazardous": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "evaluation": {
      "route_id": "uuid",
      "safety_score": 6.7,
      "delay_risk": "medium",
      "customs_complexity": "medium",
      "risk_factors": [...],
      "mitigation_recommendations": [...]
    },
    "evaluated_at": "2026-02-05T14:00:00.000Z"
  }
}
```

---

### 7. Simulate Events

**POST** `/api/v1/tools/simulate-events`

**Description:** Generate GPS-tracked shipment events

**Request:**
```json
{
  "route": {
    "route_id": "uuid",
    "logistics_sequence": [...]
  },
  "start_time": "2026-02-05T14:00:00.000Z",
  "speed_multiplier": 1
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "route_id": "uuid",
    "events": [
      {
        "event_time": "2026-02-05T14:00:00.000Z",
        "location_name": "Shanghai",
        "status_description": "Truck departed from Shanghai",
        "gps_latitude": 31.2304,
        "gps_longitude": 121.4737,
        "event_type": "DEPARTED"
      }
    ],
    "total_duration_hours": 46,
    "simulated_at": "2026-02-05T14:00:00.000Z"
  }
}
```

---

## ❌ Error Handling

### Error Response Format
```json
{
  "error": {
    "message": "Missing required fields: origin, destination, cargo",
    "code": "INVALID_INPUT"
  }
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (invalid input) |
| 404 | Endpoint not found |
| 500 | Internal Server Error |

---

## 📚 Code Examples

### JavaScript/Node.js
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

const result = await response.json();
console.log(result.data.recommended_route);
```

### Python
```python
import requests

response = requests.post('http://localhost:3000/api/v1/decide', json={
    'origin': {'city': 'Shanghai', 'country': 'China', 'countryCode': 'CN'},
    'destination': {'city': 'Los Angeles', 'country': 'United States', 'countryCode': 'US'},
    'cargo': {'weight': 500, 'volume': 2, 'value': 25000, 'type': 'electronics'},
    'preferences': {'priority': 'balanced', 'anchorToBlockchain': True}
})

result = response.json()
print(result['data']['recommended_route'])
```

### cURL
```bash
curl -X POST http://localhost:3000/api/v1/decide \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {"city": "Shanghai", "country": "China", "countryCode": "CN"},
    "destination": {"city": "Los Angeles", "country": "United States", "countryCode": "US"},
    "cargo": {"weight": 500, "volume": 2, "value": 25000, "type": "electronics"},
    "preferences": {"priority": "balanced", "anchorToBlockchain": true}
  }'
```

---

## ⚡ Rate Limits

**Current:** No rate limiting (demo)

**Production Recommendation:**
- 60 requests/minute per IP
- 1000 requests/hour per API key
- Burst: 10 requests/second

---

## 🔗 Integration Guide

### Frontend Integration
1. Set `API_URL` constant
2. Handle loading states
3. Display results with proper formatting
4. Handle blockchain signatures

### Backend Integration
1. Use as microservice
2. Cache responses when appropriate
3. Implement retry logic
4. Monitor blockchain anchoring status

---

## 🛡️ Security Best Practices

1. **Use HTTPS in production**
2. **Implement API key authentication**
3. **Validate all inputs**
4. **Rate limit requests**
5. **Log all decisions**
6. **Monitor blockchain anchoring**

---

## 📞 Support

- **Documentation:** http://localhost:3000/api/v1/docs
- **Health Check:** http://localhost:3000/health
- **Demo UI:** http://localhost:3000/

---

**Built with:** TypeScript, Express, Solana, AI 🦞
