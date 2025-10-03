// Environment configuration utility
// This file validates and exports environment variables with proper type safety

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_PUBLISHABLE_KEY: string;
  VITE_SUPABASE_PROJECT_ID: string;
}

function validateEnvVar(key: string, value: string | undefined): string {
  const trimmedValue = value?.trim();

  if (!trimmedValue || trimmedValue === '') {
    throw new Error(
      `Environment variable ${key} is missing or empty. Please check your .env file.`
    );
  }

  return trimmedValue;
}

function loadEnvConfig(): EnvConfig {
  try {
    return {
      VITE_SUPABASE_URL: validateEnvVar(
        'VITE_SUPABASE_URL',
        import.meta.env.VITE_SUPABASE_URL
      ),
      VITE_SUPABASE_PUBLISHABLE_KEY: validateEnvVar(
        'VITE_SUPABASE_PUBLISHABLE_KEY',
        import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
      ),
      VITE_SUPABASE_PROJECT_ID: validateEnvVar(
        'VITE_SUPABASE_PROJECT_ID',
        import.meta.env.VITE_SUPABASE_PROJECT_ID
      ),
    };
  } catch (error) {
    console.error('Environment configuration error:', error);
    throw error;
  }
}

// Export the validated environment configuration
export const env = loadEnvConfig();

// Export individual variables for convenience
export const {
  VITE_SUPABASE_URL,
  VITE_SUPABASE_PUBLISHABLE_KEY,
  VITE_SUPABASE_PROJECT_ID,
} = env;
