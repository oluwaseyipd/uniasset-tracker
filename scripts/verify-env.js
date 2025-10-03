#!/usr/bin/env node

/**
 * Environment Variables Verification Script
 * This script verifies that all required environment variables are properly set
 * and can be loaded without quotes or other formatting issues.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message) {
  log(`✅ ${message}`, colors.green);
}

function logError(message) {
  log(`❌ ${message}`, colors.red);
}

function logWarning(message) {
  log(`⚠️  ${message}`, colors.yellow);
}

function logInfo(message) {
  log(`ℹ️  ${message}`, colors.blue);
}

// Parse .env file manually to verify format
function parseEnvFile(filePath) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    const env = {};
    const issues = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();

      // Skip empty lines and comments
      if (!trimmedLine || trimmedLine.startsWith('#')) {
        return;
      }

      // Check for proper format
      const match = trimmedLine.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
      if (!match) {
        issues.push(`Line ${index + 1}: Invalid format - ${trimmedLine}`);
        return;
      }

      const [, key, value] = match;

      // Check for quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        issues.push(`Line ${index + 1}: Variable ${key} has quotes around value`);
      }

      // Check for empty values
      if (!value.trim()) {
        issues.push(`Line ${index + 1}: Variable ${key} has empty value`);
      }

      env[key] = value;
    });

    return { env, issues };
  } catch (error) {
    throw new Error(`Failed to read .env file: ${error.message}`);
  }
}

// Required environment variables
const requiredVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_PUBLISHABLE_KEY',
  'VITE_SUPABASE_PROJECT_ID',
];

function validateEnvVar(key, value) {
  const issues = [];

  if (!value) {
    issues.push(`${key} is missing`);
    return issues;
  }

  const trimmedValue = value.trim();
  if (!trimmedValue) {
    issues.push(`${key} is empty`);
    return issues;
  }

  // Specific validations
  switch (key) {
    case 'VITE_SUPABASE_URL':
      if (!trimmedValue.startsWith('https://')) {
        issues.push(`${key} should start with https://`);
      }
      if (!trimmedValue.includes('.supabase.co')) {
        issues.push(`${key} should contain .supabase.co`);
      }
      break;

    case 'VITE_SUPABASE_PUBLISHABLE_KEY':
      if (!trimmedValue.startsWith('eyJ')) {
        issues.push(`${key} appears to be invalid (should start with 'eyJ')`);
      }
      break;

    case 'VITE_SUPABASE_PROJECT_ID':
      if (trimmedValue.length < 10) {
        issues.push(`${key} appears to be too short`);
      }
      break;
  }

  return issues;
}

function main() {
  log(`${colors.bold}🔍 Environment Variables Verification${colors.reset}\n`);

  const envFilePath = join(__dirname, '..', '.env');
  let envData;
  let parseIssues = [];

  // Step 1: Parse .env file
  try {
    logInfo('Parsing .env file...');
    const result = parseEnvFile(envFilePath);
    envData = result.env;
    parseIssues = result.issues;

    if (parseIssues.length === 0) {
      logSuccess('.env file format is valid');
    } else {
      logWarning('.env file has formatting issues:');
      parseIssues.forEach(issue => log(`  - ${issue}`, colors.yellow));
    }
  } catch (error) {
    logError(`Failed to parse .env file: ${error.message}`);
    process.exit(1);
  }

  // Step 2: Validate required variables
  logInfo('\nValidating required environment variables...');
  let hasErrors = false;
  const validationResults = {};

  requiredVars.forEach(key => {
    const value = envData[key];
    const issues = validateEnvVar(key, value);
    validationResults[key] = { value, issues };

    if (issues.length === 0) {
      logSuccess(`${key}: ✓`);
    } else {
      hasErrors = true;
      logError(`${key}: ✗`);
      issues.forEach(issue => log(`  - ${issue}`, colors.red));
    }
  });

  // Step 3: Summary
  log(`\n${colors.bold}📊 Summary${colors.reset}`);

  const totalVars = requiredVars.length;
  const validVars = Object.values(validationResults).filter(r => r.issues.length === 0).length;
  const totalIssues = parseIssues.length + Object.values(validationResults).reduce((sum, r) => sum + r.issues.length, 0);

  log(`Valid variables: ${validVars}/${totalVars}`);
  log(`Total issues found: ${totalIssues}`);

  if (hasErrors || parseIssues.length > 0) {
    log(`\n${colors.bold}🔧 Recommendations:${colors.reset}`);

    if (parseIssues.some(issue => issue.includes('quotes'))) {
      log('- Remove quotes from around environment variable values in .env file');
    }

    if (Object.values(validationResults).some(r => r.issues.some(issue => issue.includes('missing') || issue.includes('empty')))) {
      log('- Set all required environment variables in your .env file');
    }

    log('- Check your Supabase project settings for correct URL and keys');
    log('- Ensure no extra whitespace around variable values');

    process.exit(1);
  } else {
    logSuccess('\n🎉 All environment variables are properly configured!');
    process.exit(0);
  }
}

main();
