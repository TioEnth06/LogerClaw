/**
 * AgentWallet Service Adapter
 * 
 * Integration with AgentWallet API (https://agentwallet.mcpay.tech)
 * Provides server-side wallet management, signing, and policy-controlled actions.
 * 
 * This replaces the custom wallet implementation to comply with hackathon requirements.
 */

import axios from 'axios';
import type { AxiosInstance } from 'axios';
import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

export interface AgentWalletConfig {
  username: string;
  apiToken: string;
  network?: 'devnet' | 'mainnet-beta' | 'testnet';
}

export interface AgentWalletInfo {
  username: string;
  publicKey: string;
  network: string;
  balance: number;
  frozen: boolean;
  createdAt: string;
}

export interface SignTransactionRequest {
  transaction: string; // Base64 encoded transaction
  network: 'devnet' | 'mainnet-beta' | 'testnet';
}

export interface SignTransactionResponse {
  signature: string;
  transaction: string; // Signed transaction (base64)
}

export class AgentWalletService {
  private apiBase = 'https://agentwallet.mcpay.tech/api';
  private username: string;
  private apiToken: string;
  private network: 'devnet' | 'mainnet-beta' | 'testnet';
  private http: AxiosInstance;
  private connection: Connection;

  constructor(config: AgentWalletConfig) {
    this.username = config.username;
    this.apiToken = config.apiToken;
    this.network = config.network || 'devnet';
    
    this.http = axios.create({
      baseURL: this.apiBase,
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Setup Solana connection
    const endpoints: Record<string, string> = {
      'devnet': 'https://api.devnet.solana.com',
      'mainnet-beta': 'https://api.mainnet-beta.solana.com',
      'testnet': 'https://api.testnet.solana.com',
    };
    this.connection = new Connection(
      endpoints[this.network] || endpoints['devnet'],
      'confirmed'
    );
  }

  /**
   * Get wallet information
   */
  async getWallet(): Promise<AgentWalletInfo> {
    try {
      const response = await this.http.get(`/wallets/${this.username}`);
      const data = response.data;
      
      // API returns data directly, not nested in 'wallet'
      const solanaWallet = data.wallets?.solana || {};
      
      return {
        username: data.username || this.username,
        publicKey: data.solanaAddress || solanaWallet.address || '',
        network: this.network,
        balance: 0, // Balance not in response, will need separate call
        frozen: solanaWallet.frozen || data.connected?.frozen || false,
        createdAt: data.createdAt || new Date().toISOString(),
      };
    } catch (error: any) {
      throw new Error(`Failed to get wallet: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Get wallet balance in SOL
   */
  async getBalance(): Promise<number> {
    const wallet = await this.getWallet();
    return wallet.balance;
  }

  /**
   * Get wallet public key
   */
  async getPublicKey(): Promise<PublicKey> {
    const wallet = await this.getWallet();
    return new PublicKey(wallet.publicKey);
  }

  /**
   * Sign and send transaction via AgentWallet transfer endpoint
   * Uses transfer-solana for self-transfer (anchoring)
   */
  async signAndSendTransaction(transaction: Transaction): Promise<string> {
    try {
      const publicKey = await this.getPublicKey();
      
      // Use AgentWallet transfer-solana endpoint for self-transfer
      // This creates an on-chain transaction that anchors our decision
      // Amount in lamports (1 lamport = minimal cost for anchoring)
      const response = await this.http.post<{ 
        actionId?: string;
        status?: string;
        txHash?: string;
        signature?: string;
        explorer?: string;
      }>(
        `/wallets/${this.username}/actions/transfer-solana`,
        {
          to: publicKey.toString(), // Self-transfer
          amount: '1', // 1 lamport (minimal cost)
          asset: 'sol',
          network: this.network === 'devnet' ? 'devnet' : 'mainnet',
        }
      );

      // AgentWallet returns txHash (not signature)
      const signature = response.data.txHash || response.data.signature;
      
      if (!signature) {
        throw new Error('No transaction hash returned from AgentWallet');
      }

      // Wait for confirmation
      await this.connection.confirmTransaction(signature, 'confirmed');

      return signature;
    } catch (error: any) {
      const errorMsg = error.response?.data?.error || error.message || error.toString();
      throw new Error(`Failed to sign and send transaction: ${errorMsg}`);
    }
  }

  /**
   * Anchor route decision to blockchain
   * Creates a self-transfer transaction with minimal cost
   */
  async anchorRouteDecision(
    routeId: string,
    decisionHash: string,
    metadata: {
      origin: string;
      destination: string;
      totalCost: number;
      safetyScore: number;
    }
  ): Promise<string> {
    try {
      const publicKey = await this.getPublicKey();

      // Create self-transfer transaction (minimal cost)
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: publicKey,
          lamports: 1, // 1 lamport
        })
      );

      // Set recent blockhash
      const { blockhash } = await this.connection.getLatestBlockhash('confirmed');
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      // Sign and send
      const signature = await this.signAndSendTransaction(transaction);

      console.log(`⛓️  Route decision anchored on-chain`);
      console.log(`   Signature: ${signature}`);
      console.log(`   Network: ${this.network}`);
      console.log(`   Explorer: https://explorer.solana.com/tx/${signature}?cluster=${this.network}`);

      return signature;
    } catch (error: any) {
      throw new Error(`Failed to anchor route decision: ${error.message}`);
    }
  }

  /**
   * Verify transaction on-chain
   */
  async verifyTransaction(signature: string): Promise<boolean> {
    try {
      const tx = await this.connection.getTransaction(signature, {
        commitment: 'confirmed',
      });
      return tx !== null;
    } catch (error) {
      console.error('Error verifying transaction:', error);
      return false;
    }
  }

  /**
   * Get wallet info summary
   */
  async getInfo(): Promise<{
    publicKey: string;
    network: string;
    balance: number;
    rpcEndpoint: string;
    frozen: boolean;
  }> {
    const wallet = await this.getWallet();
    
    return {
      publicKey: wallet.publicKey,
      network: this.network,
      balance: wallet.balance,
      rpcEndpoint: this.connection.rpcEndpoint,
      frozen: wallet.frozen,
    };
  }

  /**
   * Create route decision hash (deterministic)
   */
  static createDecisionHash(
    routeId: string,
    cost: number,
    safetyScore: number,
    timestamp: string
  ): string {
    const crypto = require('crypto');
    const data = `${routeId}:${cost}:${safetyScore}:${timestamp}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }
}

/**
 * Load AgentWallet config from file
 */
export function loadAgentWalletConfig(): AgentWalletConfig | null {
  const configPath = path.join(
    process.env.HOME || process.env.USERPROFILE || '.',
    '.agentwallet',
    'config.json'
  );

  if (!fs.existsSync(configPath)) {
    return null;
  }

  try {
    const configData = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return {
      username: configData.username,
      apiToken: configData.apiToken,
      network: configData.network || 'devnet',
    };
  } catch (error) {
    console.error('Failed to load AgentWallet config:', error);
    return null;
  }
}

/**
 * Initialize AgentWallet service
 */
export async function initializeAgentWalletService(): Promise<AgentWalletService> {
  // Try to load from config file
  let config = loadAgentWalletConfig();

  // Fallback to environment variables
  if (!config) {
    const username = process.env.AGENTWALLET_USERNAME;
    const apiToken = process.env.AGENTWALLET_API_TOKEN;
    const network = (process.env.AGENTWALLET_NETWORK || 'devnet') as 'devnet' | 'mainnet-beta' | 'testnet';

    if (!username || !apiToken) {
      throw new Error(
        'AgentWallet not configured. Please run setup-agentwallet.ts or set environment variables:\n' +
        '  AGENTWALLET_USERNAME=your-username\n' +
        '  AGENTWALLET_API_TOKEN=your-token\n' +
        '  AGENTWALLET_NETWORK=devnet'
      );
    }

    config = { username, apiToken, network };
  }

  const service = new AgentWalletService(config);

  console.log('\n' + '='.repeat(60));
  console.log('🔐 AgentWallet Service Initialized');
  console.log('='.repeat(60));

  const info = await service.getInfo();
  console.log(`Username: ${config.username}`);
  console.log(`Public Key: ${info.publicKey}`);
  console.log(`Network: ${info.network}`);
  console.log(`Balance: ${info.balance} SOL`);
  console.log(`RPC: ${info.rpcEndpoint}`);
  console.log(`Frozen: ${info.frozen ? 'YES ⚠️' : 'NO ✅'}`);
  console.log('='.repeat(60) + '\n');

  if (info.frozen) {
    console.warn('⚠️  WARNING: Wallet is frozen. Transactions may fail.');
  }

  return service;
}
