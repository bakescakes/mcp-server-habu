#!/usr/bin/env node

/**
 * Analyze Question SQL to Detect Partition Parameter Requirements
 * This script examines question SQL to determine what partition parameters are needed
 */

// Sample question data from our testing
const questions = [
  {
    id: "CRQ-138037",
    name: "What is the reach at the advertiser and campaign level and what is the overlap percentage with CRM?",
    sql: `from @exposures 
    INNER JOIN @pubmap 
    on @exposures.@cid = @pubmap.@cid`,
    parameters: {}
  },
  {
    id: "CRQ-138033", 
    name: "What is the attributed revenue of my campaign based on first touch with custom attribution window?",
    sql: `FROM @exposures
  join @pubmap on @exposures.@cid = @pubmap.@cid
  FROM
    (select @conversions.@transaction_id as transaction_id, @conversions.@cid as partner_cid, 
      unix_timestamp(@conversions.@conversion_timestamp) as conversion_timestamp_UNIX,`,
    parameters: {
      "click_attribution_window": "runtime",
      "imp_attribution_window": "runtime"
    }
  },
  {
    id: "CRQ-138038",
    name: "Attribute Level Overlap and Index Report", 
    sql: `FROM
    @partner_crm
    INNER JOIN @partnermap on @partner_crm.@cid = @partnermap.@cid
    INNER JOIN @pubmap on @partnermap.@rampid = @pubmap.@rampid
    INNER JOIN @publisher_audience on @publisher_audience.@cid = @pubmap.@cid`,
    parameters: {
      "CRM_ATTRIBUTE": "runtime"
    }
  }
];

/**
 * Analyze SQL to detect partition parameter requirements
 */
function analyzePartitionRequirements(question) {
  const sql = question.sql.toLowerCase();
  const results = {
    questionId: question.id,
    name: question.name,
    requiresPartitionParams: false,
    detectedTables: [],
    recommendedPartitionParams: []
  };
  
  // Check for different data tables that typically require partitioning
  const tablePatterns = [
    {
      pattern: /@exposures/g,
      table: '@exposures',
      partitionParams: [
        { name: 'exposures.date_start', description: 'Start date for exposure data filtering' },
        { name: 'exposures.date_end', description: 'End date for exposure data filtering' }
      ]
    },
    {
      pattern: /@conversions/g,
      table: '@conversions', 
      partitionParams: [
        { name: 'conversions.date_start', description: 'Start date for conversion data filtering' },
        { name: 'conversions.date_end', description: 'End date for conversion data filtering' }
      ]
    },
    {
      pattern: /@partner_crm/g,
      table: '@partner_crm',
      partitionParams: [
        { name: 'exposures.date_start', description: 'Date range for CRM data (often uses exposure dates)' },
        { name: 'exposures.date_end', description: 'Date range for CRM data (often uses exposure dates)' }
      ]
    }
  ];
  
  // Analyze each table pattern
  tablePatterns.forEach(tablePattern => {
    const matches = sql.match(tablePattern.pattern);
    if (matches) {
      results.requiresPartitionParams = true;
      results.detectedTables.push(tablePattern.table);
      
      // Add partition parameters (avoid duplicates)
      tablePattern.partitionParams.forEach(param => {
        if (!results.recommendedPartitionParams.find(p => p.name === param.name)) {
          results.recommendedPartitionParams.push(param);
        }
      });
    }
  });
  
  return results;
}

// Analyze all questions
console.log('🔍 **Partition Parameter Analysis**\n');

questions.forEach(question => {
  const analysis = analyzePartitionRequirements(question);
  
  console.log(`**${analysis.questionId}**: ${analysis.name}`);
  console.log(`  - Requires Partition Params: ${analysis.requiresPartitionParams ? '✅ YES' : '❌ NO'}`);
  
  if (analysis.detectedTables.length > 0) {
    console.log(`  - Tables Found: ${analysis.detectedTables.join(', ')}`);
  }
  
  if (analysis.recommendedPartitionParams.length > 0) {
    console.log(`  - Recommended Partition Parameters:`);
    analysis.recommendedPartitionParams.forEach(param => {
      console.log(`    * ${param.name}: ${param.description}`);
    });
  }
  
  console.log('');
});

// Generate detection rules
console.log('🧠 **Smart Detection Rules for MCP Server:**\n');
console.log('1. **@exposures table**: Requires exposures.date_start, exposures.date_end');
console.log('2. **@conversions table**: Requires conversions.date_start, conversions.date_end'); 
console.log('3. **@partner_crm with @exposures**: Uses exposure date range for CRM filtering');
console.log('4. **Attribution questions**: Need both exposure and conversion date ranges');
console.log('5. **Reach/overlap questions**: Need exposure date ranges only');
console.log('');

console.log('💡 **Implementation Strategy:**');
console.log('- Parse question SQL description in execute_question_run tool');
console.log('- Auto-detect required partition parameters based on table usage');  
console.log('- Provide intelligent defaults (e.g., last 30 days) if not specified');
console.log('- Show user what partition parameters were auto-applied');