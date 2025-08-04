#!/usr/bin/env node

/**
 * Documentation Consistency Validator
 * 
 * Validates that CURRENT_STATUS.md and generated STATUS.json are consistent
 * and that no conflicting information exists across documentation files
 */

const fs = require('fs');
const path = require('path');

// File paths
const CURRENT_STATUS_PATH = path.join(__dirname, '..', 'CURRENT_STATUS.md');
const STATUS_JSON_PATH = path.join(__dirname, '..', 'STATUS.json');

/**
 * Check if STATUS.json is up to date with CURRENT_STATUS.md
 */
function validateStatusJsonFreshness() {
  const errors = [];

  if (!fs.existsSync(STATUS_JSON_PATH)) {
    errors.push('STATUS.json does not exist - run npm run generate-status');
    return errors;
  }

  if (!fs.existsSync(CURRENT_STATUS_PATH)) {
    errors.push('CURRENT_STATUS.md does not exist');
    return errors;
  }

  const statusJsonStat = fs.statSync(STATUS_JSON_PATH);
  const currentStatusStat = fs.statSync(CURRENT_STATUS_PATH);

  // Check if CURRENT_STATUS.md is newer than STATUS.json
  if (currentStatusStat.mtime > statusJsonStat.mtime) {
    errors.push('STATUS.json is outdated - CURRENT_STATUS.md was modified more recently');
    errors.push('Solution: Run npm run generate-status to update STATUS.json');
  }

  return errors;
}

/**
 * Validate that key metrics match between CURRENT_STATUS.md and STATUS.json
 */
function validateDataConsistency() {
  const errors = [];

  try {
    const statusJson = JSON.parse(fs.readFileSync(STATUS_JSON_PATH, 'utf8'));
    const currentStatus = fs.readFileSync(CURRENT_STATUS_PATH, 'utf8');

    // Check if key numbers match
    const toolsTestedMatch = currentStatus.match(/✅ \*\*Tested & Verified\*\* \| \*\*(\d+)\*\*/);
    if (toolsTestedMatch) {
      const mdToolsTested = parseInt(toolsTestedMatch[1]);
      const jsonToolsTested = statusJson.tools.tested;
      
      if (mdToolsTested !== jsonToolsTested) {
        errors.push(`Tools tested mismatch: CURRENT_STATUS.md shows ${mdToolsTested}, STATUS.json shows ${jsonToolsTested}`);
      }
    }

    // Check if next tool matches
    const nextToolMatch = currentStatus.match(/\*\*Tool\*\*: (.+?)\s*\n/);
    if (nextToolMatch) {
      const mdNextTool = nextToolMatch[1].replace(/`/g, '').trim();
      const jsonNextTool = statusJson.testing.nextTool;
      
      if (mdNextTool !== jsonNextTool) {
        errors.push(`Next tool mismatch: CURRENT_STATUS.md shows "${mdNextTool}", STATUS.json shows "${jsonNextTool}"`);
      }
    }

  } catch (error) {
    errors.push(`Error reading files: ${error.message}`);
  }

  return errors;
}

/**
 * Check for deprecated status files that might contain conflicting information
 */
function validateNoConflictingFiles() {
  const warnings = [];
  const deprecatedFiles = [
    'MCP_TOOL_TESTING_STATUS.md',
    'TESTING_PROGRESS.md'
  ];

  deprecatedFiles.forEach(file => {
    const filePath = path.join(__dirname, '..', 'archive', file);
    const rootPath = path.join(__dirname, '..', file);
    
    if (fs.existsSync(rootPath)) {
      warnings.push(`${file} still exists in root directory - should be in archive/`);
    }
  });

  return warnings;
}

/**
 * Main validation function
 */
function main() {
  console.log('🔍 Documentation Consistency Validator Starting...');
  
  let totalErrors = 0;
  let totalWarnings = 0;

  // Check STATUS.json freshness
  console.log('\n📅 Checking STATUS.json freshness...');
  const freshnessErrors = validateStatusJsonFreshness();
  if (freshnessErrors.length === 0) {
    console.log('✅ STATUS.json is up to date');
  } else {
    freshnessErrors.forEach(error => console.error(`❌ ${error}`));
    totalErrors += freshnessErrors.length;
  }

  // Check data consistency
  console.log('\n📊 Checking data consistency...');
  const consistencyErrors = validateDataConsistency();
  if (consistencyErrors.length === 0) {
    console.log('✅ CURRENT_STATUS.md and STATUS.json are consistent');
  } else {
    consistencyErrors.forEach(error => console.error(`❌ ${error}`));
    totalErrors += consistencyErrors.length;
  }

  // Check for conflicting files
  console.log('\n🗂️  Checking for conflicting files...');
  const conflictWarnings = validateNoConflictingFiles();
  if (conflictWarnings.length === 0) {
    console.log('✅ No conflicting status files found');
  } else {
    conflictWarnings.forEach(warning => console.warn(`⚠️  ${warning}`));
    totalWarnings += conflictWarnings.length;
  }

  // Summary
  console.log('\n📋 Validation Summary:');
  console.log(`   Errors: ${totalErrors}`);
  console.log(`   Warnings: ${totalWarnings}`);

  if (totalErrors === 0 && totalWarnings === 0) {
    console.log('🎉 All documentation consistency checks passed!');
    process.exit(0);
  } else if (totalErrors === 0) {
    console.log('✅ No errors found, but there are warnings to address');
    process.exit(0);
  } else {
    console.log('❌ Documentation consistency issues found');
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { validateStatusJsonFreshness, validateDataConsistency };