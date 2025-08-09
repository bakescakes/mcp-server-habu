#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Habu API configuration
const HABU_API_BASE_URL = process.env.HABU_API_BASE_URL || "https://api.habu.com/v1";
const HABU_API_TOKEN = process.env.HABU_API_TOKEN;
const TARGET_CLEANROOM_DISPLAY_ID = process.env.TARGET_CLEANROOM_DISPLAY_ID || "CR-045487";
const TARGET_QUESTION_DISPLAY_ID = process.env.TARGET_QUESTION_DISPLAY_ID || "CRQ-138038";

// Mock data for demonstration
const MOCK_DATA = {
  cleanrooms: [
    {
      id: "cleanroom-12345",
      displayId: "CR-045487",
      name: "Media Intelligence (Mapping File Required) - DEMO",
      status: "active",
      description: "Demo cleanroom for media intelligence analysis"
    }
  ],
  questions: [
    {
      id: "question-67890",
      displayId: "CRQ-138038",
      title: "6: Attribute Level Overlap and Index Report",
      cleanroomId: "cleanroom-12345",
      status: "ready",
      category: "overlap_analysis"
    }
  ],
  run: {
    id: "run-" + Date.now(),
    name: "Run_" + Date.now(),
    status: "QUEUED",
    submittedAt: new Date().toISOString(),
    completedAt: null,
    runMessage: "Query initiated successfully"
  },
  results: {
    metadata: [
      { fieldName: "segment_name", dataType: "STRING", columnName: "segment_name" },
      { fieldName: "overlap_count", dataType: "INTEGER", columnName: "overlap_count" },
      { fieldName: "index_score", dataType: "DOUBLE", columnName: "index_score" },
      { fieldName: "total_audience", dataType: "INTEGER", columnName: "total_audience" },
      { fieldName: "match_rate", dataType: "DOUBLE", columnName: "match_rate" }
    ],
    stats: [
      { segment_name: "Premium Auto Shoppers", overlap_count: "45320", index_score: "2.34", total_audience: "125000", match_rate: "0.856" },
      { segment_name: "Luxury Brand Enthusiasts", overlap_count: "32150", index_score: "1.89", total_audience: "98000", match_rate: "0.742" },
      { segment_name: "High Income Households", overlap_count: "67890", index_score: "3.12", total_audience: "156000", match_rate: "0.901" },
      { segment_name: "Tech Early Adopters", overlap_count: "28450", index_score: "1.67", total_audience: "89000", match_rate: "0.693" },
      { segment_name: "Travel Frequent Flyers", overlap_count: "15670", index_score: "1.23", total_audience: "67000", match_rate: "0.587" }
    ],
    count: 5
  }
};

// Set up axios with authentication (when working)
const habuApi = axios.create({
  baseURL: HABU_API_BASE_URL,
  headers: {
    'Authorization': `Bearer ${HABU_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

interface CleanroomQuestionRun {
  id: string;
  name: string;
  status: string;
  submittedAt?: string;
  completedAt?: string;
  runMessage?: string;
}

interface QuestionRunResult {
  metadata: Array<{
    fieldName: string;
    dataType: string;
    columnName: string;
  }>;
  stats: Array<Record<string, string>>;
  count: number;
}

async function findCleanroom(): Promise<string> {
  console.error(`🔍 Looking for cleanroom with displayID: ${TARGET_CLEANROOM_DISPLAY_ID}`);
  
  // For now, use mock data - replace this with real API call when auth is working
  const useMockData = true;
  
  if (useMockData) {
    console.error("🧪 Using mock data for demonstration");
    const targetCleanroom = MOCK_DATA.cleanrooms.find(cr => cr.displayId === TARGET_CLEANROOM_DISPLAY_ID);
    if (!targetCleanroom) {
      throw new Error(`Mock cleanroom with displayID ${TARGET_CLEANROOM_DISPLAY_ID} not found`);
    }
    console.error(`✅ Found cleanroom: ${targetCleanroom.name} (ID: ${targetCleanroom.id})`);
    return targetCleanroom.id;
  }
  
  // Real API call (commented out due to auth issues)
  /*
  try {
    const response = await habuApi.get('/cleanrooms');
    const cleanrooms = response.data;
    
    if (!Array.isArray(cleanrooms)) {
      throw new Error("Invalid response format from cleanrooms endpoint");
    }
    
    const targetCleanroom = cleanrooms.find((cr: any) => 
      cr.displayId === TARGET_CLEANROOM_DISPLAY_ID
    );
    
    if (!targetCleanroom) {
      throw new Error(`Cleanroom with displayID ${TARGET_CLEANROOM_DISPLAY_ID} not found`);
    }
    
    console.error(`✅ Found cleanroom: ${targetCleanroom.name} (ID: ${targetCleanroom.id})`);
    return targetCleanroom.id;
  } catch (error) {
    console.error("Error finding cleanroom:", error);
    throw error;
  }
  */
  
  throw new Error("Real API not implemented - authentication issues");
}

async function findCleanroomQuestion(cleanroomId: string): Promise<string> {
  console.error(`🔍 Looking for question with displayID: ${TARGET_QUESTION_DISPLAY_ID}`);
  
  // For now, use mock data
  const useMockData = true;
  
  if (useMockData) {
    const targetQuestion = MOCK_DATA.questions.find(q => 
      q.displayId === TARGET_QUESTION_DISPLAY_ID && q.cleanroomId === cleanroomId
    );
    
    if (!targetQuestion) {
      throw new Error(`Mock question with displayID ${TARGET_QUESTION_DISPLAY_ID} not found`);
    }
    
    console.error(`✅ Found question: ${targetQuestion.title} (ID: ${targetQuestion.id})`);
    return targetQuestion.id;
  }
  
  // Real API call (commented out)
  /*
  try {
    const response = await habuApi.get(`/cleanrooms/${cleanroomId}/cleanroom-questions`);
    const questions = response.data;
    
    if (!Array.isArray(questions)) {
      throw new Error("Invalid response format from cleanroom-questions endpoint");
    }
    
    const targetQuestion = questions.find((q: any) => 
      q.displayId === TARGET_QUESTION_DISPLAY_ID
    );
    
    if (!targetQuestion) {
      throw new Error(`Question with displayID ${TARGET_QUESTION_DISPLAY_ID} not found`);
    }
    
    console.error(`✅ Found question: ${targetQuestion.title} (ID: ${targetQuestion.id})`);
    return targetQuestion.id;
  } catch (error) {
    console.error("Error finding cleanroom question:", error);
    throw error;
  }
  */
  
  throw new Error("Real API not implemented - authentication issues");
}

async function executeQuestion(cleanroomQuestionId: string): Promise<string> {
  console.error(`🚀 Executing cleanroom question: ${cleanroomQuestionId}`);
  
  // Mock execution
  const runId = MOCK_DATA.run.id;
  console.error(`✅ Question run created: ${runId}`);
  return runId;
  
  // Real API call (commented out)
  /*
  try {
    const response = await habuApi.post(
      `/cleanroom-questions/${cleanroomQuestionId}/create-run`,
      {
        name: `Run_${Date.now()}`,
      }
    );
    
    const run = response.data;
    console.error(`✅ Question run created: ${run.id}`);
    return run.id;
  } catch (error) {
    console.error("Error executing question:", error);
    throw error;
  }
  */
}

async function pollForCompletion(runId: string): Promise<CleanroomQuestionRun> {
  console.error(`⏳ Simulating query execution...`);
  
  // Simulate polling with progress updates
  const statuses = ["QUEUED", "RUNNING", "RUNNING", "RUNNING", "COMPLETED"];
  
  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    const progress = Math.round((i / (statuses.length - 1)) * 100);
    
    console.error(`📊 Status: ${status} (${progress}% complete)`);
    
    if (status === "COMPLETED") {
      console.error(`✅ Run completed successfully!`);
      return {
        ...MOCK_DATA.run,
        status: "COMPLETED",
        completedAt: new Date().toISOString(),
        runMessage: "Query completed successfully"
      };
    }
    
    // Wait 1 second between status updates
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error("Unexpected error in polling simulation");
  
  // Real polling code (commented out)
  /*
  const maxAttempts = 60; // 5 minutes max
  const pollInterval = 5000; // 5 seconds
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      console.error(`⏳ Polling run status (attempt ${attempt + 1}/${maxAttempts})`);
      
      const response = await habuApi.get(`/cleanroom-question-runs/${runId}`);
      const run: CleanroomQuestionRun = response.data;
      
      console.error(`📊 Current status: ${run.status}`);
      
      if (run.status === "COMPLETED") {
        console.error(`✅ Run completed successfully!`);
        return run;
      } else if (run.status === "FAILED") {
        throw new Error(`Query run failed: ${run.runMessage || "Unknown error"}`);
      }
      
      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    } catch (error) {
      console.error("Error polling run status:", error);
      throw error;
    }
  }
  
  throw new Error("Query run timed out after 5 minutes");
  */
}

async function getQueryResults(runId: string): Promise<QuestionRunResult> {
  console.error(`📥 Fetching results for run: ${runId}`);
  
  // Return mock results
  console.error(`✅ Results fetched: ${MOCK_DATA.results.count} rows`);
  return MOCK_DATA.results;
  
  // Real API call (commented out)
  /*
  try {
    const response = await habuApi.get(`/cleanroom-question-runs/${runId}/data`);
    const results: QuestionRunResult = response.data;
    
    console.error(`✅ Results fetched: ${results.count} rows`);
    return results;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
  */
}

function formatResults(results: QuestionRunResult): string {
  const { metadata, stats, count } = results;
  
  let output = `# 🎯 Attribute Level Overlap and Index Report\n\n`;
  output += `**Execution completed successfully**\n`;
  output += `**Total segments analyzed:** ${count}\n`;
  output += `**Generated:** ${new Date().toLocaleString()}\n\n`;
  
  if (metadata && metadata.length > 0) {
    output += `## 📊 Data Schema\n\n| Field | Type | Description |\n|-------|------|-------------|\n`;
    metadata.forEach(field => {
      let description = "";
      switch(field.fieldName) {
        case "segment_name": description = "Target audience segment identifier"; break;
        case "overlap_count": description = "Number of overlapping users between segments"; break;
        case "index_score": description = "Relative performance index (higher = better)"; break;
        case "total_audience": description = "Total addressable audience size"; break;
        case "match_rate": description = "Percentage of successful matches (0-1)"; break;
        default: description = "Data field";
      }
      output += `| **${field.fieldName}** | \`${field.dataType}\` | ${description} |\n`;
    });
    output += `\n`;
  }
  
  if (stats && stats.length > 0) {
    output += `## 📈 Analysis Results\n\n`;
    
    // Get column names from first row
    const firstRow = stats[0];
    const columns = Object.keys(firstRow);
    
    // Create formatted table header
    output += `| Segment | Overlap | Index | Audience | Match Rate |\n`;
    output += `|---------|---------|-------|----------|------------|\n`;
    
    // Add data rows with formatting
    stats.forEach(row => {
      const name = row.segment_name || '';
      const overlap = parseInt(row.overlap_count || '0').toLocaleString();
      const index = parseFloat(row.index_score || '0').toFixed(2);
      const audience = parseInt(row.total_audience || '0').toLocaleString();
      const matchRate = (parseFloat(row.match_rate || '0') * 100).toFixed(1) + '%';
      
      output += `| ${name} | ${overlap} | ${index}x | ${audience} | ${matchRate} |\n`;
    });
    
    output += `\n`;
  }
  
  // Add insights
  output += `## 💡 Key Insights\n\n`;
  if (stats && stats.length > 0) {
    const bestPerforming = stats.reduce((best, current) => 
      parseFloat(current.index_score || '0') > parseFloat(best.index_score || '0') ? current : best
    );
    
    const totalOverlap = stats.reduce((sum, row) => sum + parseInt(row.overlap_count || '0'), 0);
    const avgMatchRate = stats.reduce((sum, row) => sum + parseFloat(row.match_rate || '0'), 0) / stats.length;
    
    output += `• **Top performing segment:** ${bestPerforming.segment_name} (${bestPerforming.index_score}x index)\n`;
    output += `• **Total overlap across all segments:** ${totalOverlap.toLocaleString()} users\n`;
    output += `• **Average match rate:** ${(avgMatchRate * 100).toFixed(1)}%\n`;
    output += `• **Segments analyzed:** ${stats.length} audience segments\n\n`;
  }
  
  output += `> 📌 **Note:** This is a demonstration using mock data. In production, this would show real cleanroom analysis results.\n`;
  
  return output;
}

async function runQuery(): Promise<string> {
  try {
    console.error("🚀 Starting Habu cleanroom query execution...");
    
    // Step 1: Find the cleanroom
    const cleanroomId = await findCleanroom();
    
    // Step 2: Find the cleanroom question
    const cleanroomQuestionId = await findCleanroomQuestion(cleanroomId);
    
    // Step 3: Execute the question
    const runId = await executeQuestion(cleanroomQuestionId);
    
    // Step 4: Poll for completion
    const completedRun = await pollForCompletion(runId);
    
    // Step 5: Get results
    const results = await getQueryResults(runId);
    
    // Step 6: Format and return
    return formatResults(results);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Query execution failed:", errorMessage);
    throw new McpError(ErrorCode.InternalError, `Query execution failed: ${errorMessage}`);
  }
}

// Create MCP server
const server = new Server(
  {
    name: "habu-query-runner",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "run_query",
        description: "Execute the predefined Habu cleanroom question 'Attribute Level Overlap and Index Report' and return formatted results with insights",
        inputSchema: {
          type: "object",
          properties: {
            question_name: {
              type: "string",
              description: "Name of the question to run (currently hardcoded to 'Attribute Level Overlap and Index Report')",
              default: "Attribute Level Overlap and Index Report"
            }
          },
          required: []
        },
      },
    ],
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "run_query") {
    try {
      const result = await runQuery();
      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      if (error instanceof McpError) {
        throw error;
      }
      throw new McpError(
        ErrorCode.InternalError,
        `Failed to execute query: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  } else {
    throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🚀 Habu Query Runner MCP server started successfully!");
  console.error("📋 Available tools:");
  console.error("  • run_query - Execute cleanroom analysis and get formatted results");
  console.error("🧪 Currently using mock data for demonstration");
}

main().catch((error) => {
  console.error("❌ Server failed to start:", error);
  process.exit(1);
});