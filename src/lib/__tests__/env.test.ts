// Environment configuration tests
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock import.meta.env
const mockEnv = {
  VITE_SUPABASE_URL: '',
  VITE_SUPABASE_PUBLISHABLE_KEY: '',
  VITE_SUPABASE_PROJECT_ID: '',
};

vi.stubGlobal('import', {
  meta: {
    env: mockEnv,
  },
});

describe('Environment Configuration', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Reset mock environment variables
    mockEnv.VITE_SUPABASE_URL = '';
    mockEnv.VITE_SUPABASE_PUBLISHABLE_KEY = '';
    mockEnv.VITE_SUPABASE_PROJECT_ID = '';

    // Clear module cache to ensure fresh imports
    vi.resetModules();
  });

  it('should load valid environment variables', async () => {
    // Arrange
    mockEnv.VITE_SUPABASE_URL = 'https://test.supabase.co';
    mockEnv.VITE_SUPABASE_PUBLISHABLE_KEY = 'test-key-123';
    mockEnv.VITE_SUPABASE_PROJECT_ID = 'test-project-id';

    // Act
    const { env } = await import('../env');

    // Assert
    expect(env.VITE_SUPABASE_URL).toBe('https://test.supabase.co');
    expect(env.VITE_SUPABASE_PUBLISHABLE_KEY).toBe('test-key-123');
    expect(env.VITE_SUPABASE_PROJECT_ID).toBe('test-project-id');
  });

  it('should trim whitespace from environment variables', async () => {
    // Arrange
    mockEnv.VITE_SUPABASE_URL = '  https://test.supabase.co  ';
    mockEnv.VITE_SUPABASE_PUBLISHABLE_KEY = '  test-key-123  ';
    mockEnv.VITE_SUPABASE_PROJECT_ID = '  test-project-id  ';

    // Act
    const { env } = await import('../env');

    // Assert
    expect(env.VITE_SUPABASE_URL).toBe('https://test.supabase.co');
    expect(env.VITE_SUPABASE_PUBLISHABLE_KEY).toBe('test-key-123');
    expect(env.VITE_SUPABASE_PROJECT_ID).toBe('test-project-id');
  });

  it('should throw error when VITE_SUPABASE_URL is missing', async () => {
    // Arrange
    mockEnv.VITE_SUPABASE_URL = '';
    mockEnv.VITE_SUPABASE_PUBLISHABLE_KEY = 'test-key-123';
    mockEnv.VITE_SUPABASE_PROJECT_ID = 'test-project-id';

    // Act & Assert
    await expect(async () => {
      await import('../env');
    }).rejects.toThrow('Environment variable VITE_SUPABASE_URL is missing or empty');
  });

  it('should throw error when VITE_SUPABASE_PUBLISHABLE_KEY is missing', async () => {
    // Arrange
    mockEnv.VITE_SUPABASE_URL = 'https://test.supabase.co';
    mockEnv.VITE_SUPABASE_PUBLISHABLE_KEY = '';
    mockEnv.VITE_SUPABASE_PROJECT_ID = 'test-project-id';

    // Act & Assert
    await expect(async () => {
      await import('../env');
    }).rejects.toThrow('Environment variable VITE_SUPABASE_PUBLISHABLE_KEY is missing or empty');
  });

  it('should throw error when VITE_SUPABASE_PROJECT_ID is missing', async () => {
    // Arrange
    mockEnv.VITE_SUPABASE_URL = 'https://test.supabase.co';
    mockEnv.VITE_SUPABASE_PUBLISHABLE_KEY = 'test-key-123';
    mockEnv.VITE_SUPABASE_PROJECT_ID = '';

    // Act & Assert
    await expect(async () => {
      await import('../env');
    }).rejects.toThrow('Environment variable VITE_SUPABASE_PROJECT_ID is missing or empty');
  });

  it('should throw error when environment variable is only whitespace', async () => {
    // Arrange
    mockEnv.VITE_SUPABASE_URL = '   ';
    mockEnv.VITE_SUPABASE_PUBLISHABLE_KEY = 'test-key-123';
    mockEnv.VITE_SUPABASE_PROJECT_ID = 'test-project-id';

    // Act & Assert
    await expect(async () => {
      await import('../env');
    }).rejects.toThrow('Environment variable VITE_SUPABASE_URL is missing or empty');
  });

  it('should export individual environment variables', async () => {
    // Arrange
    mockEnv.VITE_SUPABASE_URL = 'https://test.supabase.co';
    mockEnv.VITE_SUPABASE_PUBLISHABLE_KEY = 'test-key-123';
    mockEnv.VITE_SUPABASE_PROJECT_ID = 'test-project-id';

    // Act
    const {
      VITE_SUPABASE_URL,
      VITE_SUPABASE_PUBLISHABLE_KEY,
      VITE_SUPABASE_PROJECT_ID,
    } = await import('../env');

    // Assert
    expect(VITE_SUPABASE_URL).toBe('https://test.supabase.co');
    expect(VITE_SUPABASE_PUBLISHABLE_KEY).toBe('test-key-123');
    expect(VITE_SUPABASE_PROJECT_ID).toBe('test-project-id');
  });
});
