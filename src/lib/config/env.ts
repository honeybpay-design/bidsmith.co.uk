import { z } from 'zod';

const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  
  // Optional: Service role key for server-only operations
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // Application URL
  NEXT_PUBLIC_APP_URL: z.string().url(),
  
  // AI Provider Configuration
  AI_PROVIDER: z.enum(['google', 'openai', 'anthropic', 'local']).optional(),
  AI_MODEL: z.string().optional(),
  
  // Provider-specific keys (server-only)
  GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().min(1).optional(),
  ANTHROPIC_API_KEY: z.string().min(1).optional(),
  
  // Embedding model
  EMBEDDING_MODEL: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
});

export type Env = z.infer<typeof envSchema>;

// Validate environment variables at build time
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}

// Runtime validation for server-side
export function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    const errors = result.error.format();
    throw new Error(
      'Invalid environment configuration:\n' +
      Object.entries(errors)
        .map(([key, value]) => {
          const path = (value as any)._errors?.join(', ') || 'required';
          return `  ${key}: ${path}`;
        })
        .join('\n')
    );
  }
  
  return result.data;
}

// Check if required env vars are set (for development warnings)
export function checkEnvWarnings(): string[] {
  const warnings: string[] = [];
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    warnings.push('NEXT_PUBLIC_SUPABASE_URL is not set');
  }
  if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    warnings.push('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set');
  }
  
  return warnings;
}
