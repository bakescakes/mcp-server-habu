import axios, { AxiosInstance } from 'axios';

export interface AuthConfig {
  baseUrl: string;
  method: 'bearer' | 'apikey' | 'basic' | 'oauth_password' | 'oauth_client_credentials';
  credentials: {
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
    clientId?: string;
    clientSecret?: string;
  };
  additionalHeaders?: Record<string, string>;
}

export class HabuAuthenticator {
  private config: AuthConfig;
  private axiosInstance: AxiosInstance | null = null;
  private cachedToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(config: AuthConfig) {
    this.config = config;
  }

  async getAuthenticatedClient(): Promise<AxiosInstance> {
    if (this.axiosInstance && this.isTokenValid()) {
      return this.axiosInstance;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(this.config.additionalHeaders || {}),
    };

    switch (this.config.method) {
      case 'bearer':
        if (!this.config.credentials.token) {
          throw new Error('Bearer token is required');
        }
        headers['Authorization'] = `Bearer ${this.config.credentials.token}`;
        break;

      case 'apikey':
        if (!this.config.credentials.apiKey) {
          throw new Error('API key is required');
        }
        headers['X-API-Key'] = this.config.credentials.apiKey;
        break;

      case 'basic':
        if (!this.config.credentials.username || !this.config.credentials.password) {
          throw new Error('Username and password are required for basic auth');
        }
        const basicAuth = Buffer.from(
          `${this.config.credentials.username}:${this.config.credentials.password}`
        ).toString('base64');
        headers['Authorization'] = `Basic ${basicAuth}`;
        break;

      case 'oauth_password':
      case 'oauth_client_credentials':
        const token = await this.getOAuthToken();
        headers['Authorization'] = `Bearer ${token}`;
        break;

      default:
        throw new Error(`Unsupported auth method: ${this.config.method}`);
    }

    this.axiosInstance = axios.create({
      baseURL: this.config.baseUrl,
      headers,
    });

    return this.axiosInstance;
  }

  private async getOAuthToken(): Promise<string> {
    if (this.cachedToken && this.isTokenValid()) {
      return this.cachedToken;
    }

    // Use the official token endpoint from the API specification
    const tokenEndpoint = 'https://api.habu.com/v1/oauth/token';

    try {
      return await this.requestOAuthToken(tokenEndpoint);
    } catch (error) {
      console.error(`OAuth authentication failed:`, error);
      throw new Error(`Failed to obtain OAuth token: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async requestOAuthToken(endpoint: string): Promise<string> {
    if (!this.config.credentials.clientId || !this.config.credentials.clientSecret) {
      throw new Error('Client ID and secret are required for OAuth client credentials grant');
    }

    // Use Basic Auth for client credentials (RFC 6749 standard)
    const credentials = Buffer.from(
      `${this.config.credentials.clientId}:${this.config.credentials.clientSecret}`
    ).toString('base64');
    
    const params = { grant_type: 'client_credentials' };

    const response = await axios.post(endpoint, new URLSearchParams(params), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
    });

    const token = response.data.accessToken || response.data.access_token;
    if (!token) {
      throw new Error('No access token received from OAuth endpoint');
    }
    
    this.cachedToken = token;
    const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
    this.tokenExpiry = new Date(Date.now() + expiresIn * 1000);

    return token;
  }

  private isTokenValid(): boolean {
    return !!(this.cachedToken && this.tokenExpiry && this.tokenExpiry > new Date());
  }

  async getAccessToken(): Promise<string> {
    if (this.isTokenValid() && this.cachedToken) {
      return this.cachedToken;
    }
    
    if (this.config.method === 'oauth_client_credentials') {
      return await this.getOAuthToken();
    }
    
    if (this.config.method === 'bearer' && this.config.credentials.token) {
      return this.config.credentials.token;
    }
    
    throw new Error('No access token available for this authentication method');
  }

  async testConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      const client = await this.getAuthenticatedClient();
      const response = await client.get('/cleanrooms', { timeout: 10000 });
      
      return {
        success: true,
        details: {
          status: response.status,
          cleanroomCount: response.data?.length || 0,
          authMethod: this.config.method,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        details: {
          status: error.response?.status,
          authMethod: this.config.method,
        },
      };
    }
  }
}

// Helper function to create common auth configurations
export function createAuthConfig(method: string, ...credentials: string[]): AuthConfig {
  const baseUrl = process.env.HABU_API_BASE_URL || 'https://api.habu.com/v1';
  
  switch (method) {
    case 'bearer':
      return {
        baseUrl,
        method: 'bearer',
        credentials: { token: credentials[0] },
      };
    
    case 'apikey':
      return {
        baseUrl,
        method: 'apikey',
        credentials: { apiKey: credentials[0] },
      };
    
    case 'basic':
      return {
        baseUrl,
        method: 'basic',
        credentials: { username: credentials[0], password: credentials[1] },
      };
    
    case 'oauth_password':
      return {
        baseUrl,
        method: 'oauth_password',
        credentials: { username: credentials[0], password: credentials[1] },
      };
    
    case 'oauth_client_credentials':
      return {
        baseUrl,
        method: 'oauth_client_credentials',
        credentials: { clientId: credentials[0], clientSecret: credentials[1] },
      };
    
    default:
      throw new Error(`Unknown auth method: ${method}`);
  }
}