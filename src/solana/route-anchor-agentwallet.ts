/**
 * Route Anchor Service (AgentWallet Version)
 * 
 * Handles on-chain anchoring of LogerClaw route decisions using AgentWallet service.
 * Creates immutable audit trail for AI-powered logistics decisions.
 * 
 * This version uses AgentWallet API instead of custom wallet management.
 */

import { AgentWalletService } from './agentwallet-service';
import { RouteOption } from '../types/tool-types';

export interface RouteAnchorData {
  routeId: string;
  routeName: string;
  origin: string;
  destination: string;
  totalCostUSD: number;
  safetyScore: number;
  estimatedTimeHours: number;
  decisionTimestamp: string;
  decisionHash: string;
}

export interface AnchorResult {
  success: boolean;
  signature?: string;
  explorerUrl?: string;
  error?: string;
  anchorData: RouteAnchorData;
}

export class RouteAnchorService {
  private walletService: AgentWalletService;
  private enabled: boolean;

  constructor(walletService: AgentWalletService, enabled: boolean = true) {
    this.walletService = walletService;
    this.enabled = enabled;
  }

  /**
   * Anchor route decision to Solana blockchain
   */
  async anchorDecision(
    route: RouteOption,
    cost: number,
    safetyScore: number
  ): Promise<AnchorResult> {
    if (!this.enabled) {
      console.log('⚠️  Blockchain anchoring disabled (demo mode)');
      return {
        success: false,
        error: 'Anchoring disabled',
        anchorData: this.buildAnchorData(route, cost, safetyScore, ''),
      };
    }

    try {
      const timestamp = new Date().toISOString();
      const decisionHash = AgentWalletService.createDecisionHash(
        route.route_id,
        cost,
        safetyScore,
        timestamp
      );

      const anchorData = this.buildAnchorData(route, cost, safetyScore, decisionHash);

      console.log('\n⛓️  Anchoring route decision to Solana (via AgentWallet)...');
      console.log(`   Route: ${route.route_name}`);
      console.log(`   Hash: ${decisionHash.substring(0, 16)}...`);

      const signature = await this.walletService.anchorRouteDecision(
        route.route_id,
        decisionHash,
        {
          origin: route.logistics_sequence[0]?.from || 'Unknown',
          destination: route.logistics_sequence[route.logistics_sequence.length - 1]?.to || 'Unknown',
          totalCost: cost,
          safetyScore: safetyScore,
        }
      );

      const info = await this.walletService.getInfo();
      const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=${info.network}`;

      console.log(`✅ Route decision anchored successfully`);
      console.log(`   View on Explorer: ${explorerUrl}\n`);

      return {
        success: true,
        signature,
        explorerUrl,
        anchorData,
      };
    } catch (error: any) {
      console.error('❌ Failed to anchor route decision:', error.message);
      
      return {
        success: false,
        error: error.message,
        anchorData: this.buildAnchorData(route, cost, safetyScore, ''),
      };
    }
  }

  /**
   * Verify anchored decision on-chain
   */
  async verifyDecision(signature: string): Promise<boolean> {
    try {
      return await this.walletService.verifyTransaction(signature);
    } catch (error) {
      console.error('Error verifying decision:', error);
      return false;
    }
  }

  /**
   * Get anchoring service status
   */
  async getStatus(): Promise<{
    enabled: boolean;
    walletAddress: string;
    network: string;
    balance: number;
    frozen: boolean;
  }> {
    const info = await this.walletService.getInfo();
    
    return {
      enabled: this.enabled,
      walletAddress: info.publicKey,
      network: info.network,
      balance: info.balance,
      frozen: info.frozen,
    };
  }

  /**
   * Build anchor data structure
   */
  private buildAnchorData(
    route: RouteOption,
    cost: number,
    safetyScore: number,
    decisionHash: string
  ): RouteAnchorData {
    return {
      routeId: route.route_id,
      routeName: route.route_name,
      origin: route.logistics_sequence[0]?.from || 'Unknown',
      destination: route.logistics_sequence[route.logistics_sequence.length - 1]?.to || 'Unknown',
      totalCostUSD: cost,
      safetyScore: safetyScore,
      estimatedTimeHours: route.estimated_time_hours,
      decisionTimestamp: new Date().toISOString(),
      decisionHash,
    };
  }

  /**
   * Batch anchor multiple route alternatives
   * (For audit trail of all considered options)
   */
  async anchorAlternatives(
    alternatives: Array<{
      route: RouteOption;
      cost: number;
      safetyScore: number;
    }>
  ): Promise<AnchorResult[]> {
    const results: AnchorResult[] = [];

    for (const alt of alternatives) {
      const result = await this.anchorDecision(
        alt.route,
        alt.cost,
        alt.safetyScore
      );
      results.push(result);
      
      // Rate limiting: wait 1 second between anchors
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

/**
 * Initialize route anchor service with AgentWallet service
 */
export async function initializeRouteAnchor(
  walletService: AgentWalletService,
  enabled: boolean = true
): Promise<RouteAnchorService> {
  const service = new RouteAnchorService(walletService, enabled);
  
  const status = await service.getStatus();
  console.log('⛓️  Route Anchor Service Initialized');
  console.log(`   Status: ${status.enabled ? 'ENABLED' : 'DISABLED'}`);
  console.log(`   Network: ${status.network}`);
  console.log(`   Wallet: ${status.walletAddress}`);
  console.log(`   Balance: ${status.balance} SOL`);
  console.log(`   Frozen: ${status.frozen ? 'YES ⚠️' : 'NO ✅'}`);
  
  return service;
}
