#!/usr/bin/env ts-node

/**
 * AgentWallet Setup Script
 * 
 * Interactive script to connect LogerClaw to AgentWallet service.
 * Follows the email OTP verification flow.
 */

import * as readline from 'readline';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

const API_BASE = 'https://agentwallet.mcpay.tech/api';

interface SetupConfig {
  email: string;
  username: string;
  apiToken: string;
  network: string;
}

function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function checkExistingConfig(): Promise<boolean> {
  const configPath = path.join(
    process.env.HOME || process.env.USERPROFILE || '.',
    '.agentwallet',
    'config.json'
  );

  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      if (config.apiToken) {
        console.log('✅ Found existing AgentWallet configuration!');
        console.log(`   Username: ${config.username}`);
        console.log(`   Network: ${config.network || 'devnet'}`);
        console.log('\nIf you want to reconnect, delete the config file first:');
        console.log(`   rm ${configPath}\n`);
        return true;
      }
    } catch (error) {
      // Config file exists but invalid, continue with setup
    }
  }
  return false;
}

async function startConnection(email: string): Promise<{ username: string }> {
  console.log(`\n📧 Sending OTP to ${email}...`);
  
  try {
    const response = await axios.post(`${API_BASE}/connect/start`, {
      email,
    });

    if (response.data.success) {
      console.log('✅ OTP sent! Check your email for the verification code.');
      return { username: response.data.username };
    } else {
      throw new Error(response.data.error || 'Failed to send OTP');
    }
  } catch (error: any) {
    if (error.response?.status === 400) {
      throw new Error(error.response.data.error || 'Invalid email or already connected');
    }
    throw error;
  }
}

async function completeConnection(
  email: string,
  username: string,
  otp: string
): Promise<{ username: string; apiToken: string }> {
  console.log('\n🔐 Verifying OTP...');

  try {
    const response = await axios.post(`${API_BASE}/connect/complete`, {
      email,
      username,
      otp,
    });

    if (response.data.success) {
      // Handle different response structures
      // Response might be: { success: true, wallet: {...}, apiToken: "..." }
      // Or: { success: true, username: "...", apiToken: "..." }
      const wallet = response.data.wallet;
      const apiToken = response.data.apiToken || response.data.token;
      const finalUsername = wallet?.username || response.data.username || username;

      if (!apiToken) {
        console.error('Response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('API token not received from AgentWallet. Check response structure above.');
      }

      if (!finalUsername) {
        console.error('Response structure:', JSON.stringify(response.data, null, 2));
        throw new Error('Username not found in response. Check response structure above.');
      }

      return {
        username: finalUsername,
        apiToken: apiToken,
      };
    } else {
      throw new Error(response.data.error || 'OTP verification failed');
    }
  } catch (error: any) {
    if (error.response?.status === 400 || error.response?.status === 401) {
      const errorMsg = error.response.data?.error || error.response.data?.message || 'Invalid OTP or request';
      throw new Error(errorMsg);
    }
    if (error.response?.data) {
      console.error('API Error Response:', JSON.stringify(error.response.data, null, 2));
    }
    throw new Error(error.message || 'Connection failed');
  }
}

function saveConfig(config: SetupConfig): void {
  const configDir = path.join(
    process.env.HOME || process.env.USERPROFILE || '.',
    '.agentwallet'
  );

  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  const configPath = path.join(configDir, 'config.json');
  const configData = {
    username: config.username,
    apiToken: config.apiToken,
    network: config.network,
    email: config.email, // Optional, for reference
  };

  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), {
    mode: 0o600, // Read/write only for owner
  });

  console.log(`\n✅ Configuration saved to: ${configPath}`);
  console.log('   File permissions set to 600 (owner read/write only)');
}

async function main() {
  console.log('='.repeat(60));
  console.log('🔐 AgentWallet Setup for LogerClaw');
  console.log('='.repeat(60));
  console.log('\nThis script will connect LogerClaw to AgentWallet service.');
  console.log('You will need:');
  console.log('  1. An email address (for OTP verification)');
  console.log('  2. Access to that email (to receive OTP code)');
  console.log('\n');

  // Check for existing config
  const hasConfig = await checkExistingConfig();
  if (hasConfig) {
    console.log('Setup cancelled. Using existing configuration.');
    process.exit(0);
  }

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    // Step 1: Get email
    const email = await askQuestion(rl, 'Enter your email address: ');
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }

    // Step 2: Start connection (send OTP)
    let assignedUsername: string;
    try {
      const startResult = await startConnection(email);
      assignedUsername = startResult.username;
      console.log(`   Assigned username: ${assignedUsername}`);
    } catch (error: any) {
      throw new Error(`Failed to start connection: ${error.message}`);
    }

    // Step 3: Get OTP
    const otp = await askQuestion(rl, '\nEnter the OTP code from your email: ');
    if (!otp || otp.length < 4) {
      throw new Error('Invalid OTP code');
    }

    // Step 4: Complete connection
    let username: string;
    let apiToken: string;
    try {
      const result = await completeConnection(email, assignedUsername, otp);
      username = result.username;
      apiToken = result.apiToken;
      console.log(`\n✅ Successfully connected!`);
      console.log(`   Username: ${username}`);
    } catch (error: any) {
      console.error(`\n❌ Connection failed: ${error.message}`);
      console.log('\n💡 Tips:');
      console.log('   - Make sure OTP code is correct (check spam folder)');
      console.log('   - OTP expires in 10 minutes');
      console.log('   - You can request a new OTP by running setup again');
      throw error;
    }

    // Step 5: Get network preference
    const network = await askQuestion(
      rl,
      '\nSelect network (devnet/mainnet-beta/testnet) [devnet]: '
    ) || 'devnet';

    if (!['devnet', 'mainnet-beta', 'testnet'].includes(network)) {
      throw new Error('Invalid network. Must be devnet, mainnet-beta, or testnet');
    }

    // Step 6: Save config
    const config: SetupConfig = {
      email,
      username,
      apiToken,
      network,
    };

    saveConfig(config);

    console.log('\n' + '='.repeat(60));
    console.log('🎉 Setup Complete!');
    console.log('='.repeat(60));
    console.log('\nAgentWallet is now configured for LogerClaw.');
    console.log('You can now use AgentWallet service for Solana operations.\n');

    // Test connection
    console.log('Testing connection...');
    try {
      const testResponse = await axios.get(
        `${API_BASE}/wallets/${username}`,
        {
          headers: { Authorization: `Bearer ${apiToken}` },
        }
      );
      const wallet = testResponse.data.wallet;
      console.log(`✅ Wallet verified:`);
      console.log(`   Public Key: ${wallet.publicKey}`);
      console.log(`   Balance: ${wallet.balance || 0} SOL`);
    } catch (error) {
      console.warn('⚠️  Could not verify wallet (this is OK if wallet is new)');
    }

  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}
