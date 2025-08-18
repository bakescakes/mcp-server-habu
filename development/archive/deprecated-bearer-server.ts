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

if (!HABU_API_TOKEN) {
  console.error("HABU_API_TOKEN environment variable is required");
  process.exit(1);
}

// Axios instance with authentication
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
  try {
    console.error(`🔍 Looking for cleanroom with displayID: ${TARGET_CLEANROOM_DISPLAY_ID}`);
    
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
}

async function findCleanroomQuestion(cleanroomId: string): Promise<string> {
  try {
    console.error(`🔍 Looking for question with displayID: ${TARGET_QUESTION_DISPLAY_ID}`);
    
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
}

async function executeQuestion(cleanroomQuestionId: string): Promise<string> {
  try {
    console.error(`🚀 Executing cleanroom question: ${cleanroomQuestionId}`);
    
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
}

async function pollForCompletion(runId: string): Promise<CleanroomQuestionRun> {
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
}

async function getQueryResults(runId: string): Promise<QuestionRunResult> {
  try {
    console.error(`📥 Fetching results for run: ${runId}`);
    
    const response = await habuApi.get(`/cleanroom-question-runs/${runId}/data`);
    const results: QuestionRunResult = response.data;
    
    console.error(`✅ Results fetched: ${results.count} rows`);
    return results;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}

function formatResults(results: QuestionRunResult): string {
  const { metadata, stats, count } = results;
  
  let output = `# Query Results\n\n`;
  output += `**Total Rows:** ${count}\n\n`;
  
  if (metadata && metadata.length > 0) {
    output += `## Schema\n\n| Field | Type | Column |\n|-------|------|--------|\n`;
    metadata.forEach(field => {
      output += `| ${field.fieldName} | ${field.dataType} | ${field.columnName} |\n`;
    });
    output += `\n`;
  }
  
  if (stats && stats.length > 0) {
    output += `## Sample Data\n\n`;
    
    // Get column names from first row
    const firstRow = stats[0];
    const columns = Object.keys(firstRow);
    
    // Create table header
    output += `| ${columns.join(' | ')} |\n`;
    output += `|${columns.map(() => '---').join('|')}|\n`;
    
    // Add data rows (limit to first 10)
    const sampleRows = stats.slice(0, 10);
    sampleRows.forEach(row => {
      const values = columns.map(col => row[col] || '');
      output += `| ${values.join(' | ')} |\n`;
    });
    
    if (stats.length > 10) {
      output += `\n*Showing first 10 of ${stats.length} rows*\n`;
    }
  }
  
  return output;
}

async function runQuery(): Promise<string> {
  try {
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
        description: "Execute the predefined Habu cleanroom question and return results",
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
  console.error("Habu Query Runner MCP server started 🚀");
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});