// Types for STATUS.json structure from GitHub repo
export interface StatusMetadata {
  generated_from: string;
  generated_at: string;
  note: string;
}

export interface ProjectStatus {
  name: string;
  phase: string;
  status: string;
  nextMilestone: string;
}

export interface ToolsStatus {
  total: number;
  tested: number;
  testingProgress: string;
  successRate: string;
  verified: string;
}

export interface TestingInfo {
  methodology: string;
  nextTool: string;
  environment: string;
}

export interface StatusData {
  _meta: StatusMetadata;
  project: ProjectStatus;
  tools: ToolsStatus;
  testing: TestingInfo;
  recentAchievements: any[];
  categories: Record<string, number>;
  // Legacy interface for backward compatibility
  implementation: {
    totalTools: number;
    completedTools: number;
    inProgressTools: number;
    plannedTools: number;
  };
  _api?: {
    source: string;
    url: string;
    fetchedAt: string;
    cached: boolean;
  };
}

export interface RepositoryInfo {
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  updated_at: string;
  pushed_at: string;
  stargazers_count: number;
  language: string;
  default_branch: string;
  _api?: {
    fetchedAt: string;
  };
}

export interface ApiError {
  error: string;
  message?: string;
  status?: number;
  statusText?: string;
  timestamp: string;
}

// Tool status types for future enhancement
export type ToolStatus = 'verified' | 'partial' | 'issues' | 'untested';

export interface Tool {
  name: string;
  category: string;
  status: ToolStatus;
  description?: string;
  lastTested?: string;
}

// Hook return types
export interface UseStatusResult {
  data: StatusData | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  lastFetch: Date | null;
}

export interface UseRepoResult {
  data: RepositoryInfo | null;
  loading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
}