#!/usr/bin/env node

/**
 * Redirect Verification Script
 * Tests all configured redirects to ensure they work correctly
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { exec as execCallback } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCallback);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read redirects from TypeScript file
const redirectsContent = readFileSync(join(__dirname, '../src/data/redirects.ts'), 'utf-8');
const redirectsMatch = redirectsContent.match(/export const redirects[^=]*=\s*(\[[^;]+\])/s);
const redirectsData = eval(redirectsMatch[1].replace(/permanent:/g, '"permanent":').replace(/source:/g, '"source":').replace(/destination:/g, '"destination":'));

// Simple console colors
const chalk = {
  blue: (str) => `\x1b[34m${str}\x1b[0m`,
  green: (str) => `\x1b[32m${str}\x1b[0m`,
  red: (str) => `\x1b[31m${str}\x1b[0m`,
  yellow: (str) => `\x1b[33m${str}\x1b[0m`,
  gray: (str) => `\x1b[90m${str}\x1b[0m`,
};

// Configuration
const BASE_URL = process.env.SITE_URL || 'http://localhost:4321';
const TIMEOUT = 5000; // 5 seconds timeout for each request

// Test results
let passed = 0;
let failed = 0;
const results = [];

/**
 * Test a single redirect
 */
async function testRedirect(redirect) {
  const sourceUrl = `${BASE_URL}${redirect.source}`;
  const expectedUrl = `${BASE_URL}${redirect.destination}`;
  const expectedStatus = redirect.permanent ? 301 : 302;
  
  try {
    // Use curl to test the redirect
    const { stdout, stderr } = await exec(
      `curl -s -o /dev/null -w "%{http_code} %{redirect_url}" -I "${sourceUrl}"`,
      { timeout: TIMEOUT }
    );
    
    const [status, redirectUrl] = stdout.trim().split(' ');
    const statusCode = parseInt(status);
    
    // Check if redirect works correctly
    if (statusCode === expectedStatus && redirectUrl === expectedUrl) {
      passed++;
      results.push({
        source: redirect.source,
        status: 'PASS',
        message: `${statusCode} → ${redirect.destination}`
      });
      return true;
    } else {
      failed++;
      results.push({
        source: redirect.source,
        status: 'FAIL',
        message: `Expected ${expectedStatus} → ${expectedUrl}, got ${statusCode} → ${redirectUrl}`
      });
      return false;
    }
  } catch (error) {
    failed++;
    results.push({
      source: redirect.source,
      status: 'ERROR',
      message: error.message
    });
    return false;
  }
}

/**
 * Check if server is running
 */
async function checkServer() {
  try {
    await exec(`curl -s -o /dev/null -w "%{http_code}" "${BASE_URL}"`, { timeout: 2000 });
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(chalk.blue('🔍 Redirect Verification Script\n'));
  console.log(chalk.gray(`Testing against: ${BASE_URL}\n`));
  
  // Check if server is running
  const serverRunning = await checkServer();
  if (!serverRunning) {
    console.log(chalk.red('❌ Server is not running!'));
    console.log(chalk.yellow('Please start the dev server with: npm run dev'));
    process.exit(1);
  }
  
  console.log(chalk.green('✅ Server is running\n'));
  console.log(chalk.blue(`Testing ${redirectsData.length} redirects...\n`));
  
  // Test all redirects
  for (const redirect of redirectsData) {
    process.stdout.write(chalk.gray(`Testing ${redirect.source}... `));
    const result = await testRedirect(redirect);
    
    if (result) {
      console.log(chalk.green('✓'));
    } else {
      console.log(chalk.red('✗'));
    }
  }
  
  // Print summary
  console.log('\n' + chalk.blue('Summary:'));
  console.log(chalk.green(`✅ Passed: ${passed}`));
  console.log(chalk.red(`❌ Failed: ${failed}`));
  
  // Print detailed results if there are failures
  if (failed > 0) {
    console.log('\n' + chalk.red('Failed redirects:'));
    results
      .filter(r => r.status !== 'PASS')
      .forEach(r => {
        console.log(chalk.red(`  ${r.source}: ${r.message}`));
      });
  }
  
  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run the script
main().catch(error => {
  console.error(chalk.red('Script error:'), error);
  process.exit(1);
});