import { Elysia } from 'elysia';
import { AppError } from '../Errors/AppError';
import { TContext } from '../types/context';
import jwt from 'jsonwebtoken';
import { Logger } from '../logger/logger';
import { env } from 'src/conf/env';
import { getMessage } from '../constants/messages';
import { LanguagesEnum } from '../constants/i18n';

// Supabase JWT token payload interface
export interface ITokenPayload {
  iss: string;
  sub: string;
  aud: number;
  exp: number;
  iat: number;
  email: string;
  phone: string;
  app_metadata: { provider: string; providers: [string] };
  user_metadata: Record<string, unknown>;
  role: string;
  aal: string;
  amr: [{ method: string; timestamp: number }];
  session_id: string;
  is_anonymous: boolean;
}

// Extended context with auth information
export interface AuthContext extends TContext {
  auth: {
    user: ITokenPayload;
    token: string;
    tenantId?: string;
  };
}

export const X_TENANT_ID = 'x-tenant-id';

// Helper function to extract JWT token from headers
const extractToken = (
  headers: Record<string, string | undefined>
): string | null => {
  const authHeader = headers.authorization || headers.Authorization;
  if (!authHeader) {
    return null;
  }

  // Handle "Bearer <token>" format
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Handle direct token
  return authHeader;
};

// Helper function to decode and verify JWT token
const decodeAndVerifyToken = (token: string, language: LanguagesEnum = LanguagesEnum.en): ITokenPayload => {
  const jwtSecret = env.SUPABASE_JWT_SECRET;

  if (!jwtSecret) {
    throw new AppError({
      error: getMessage('JWT_SECRET_NOT_CONFIGURED', language),
      statusCode: 500,
    });
  }

  try {
    // Verify and decode the token
    const decoded = JSON.parse(
      JSON.stringify(jwt.verify(token, jwtSecret))
    ) as ITokenPayload;

    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      throw new AppError({
        error: getMessage('TOKEN_EXPIRED', language),
        statusCode: 401,
      });
    }

    return decoded;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError({
      error: getMessage('TOKEN_INVALID', language),
      statusCode: 401,
    });
  }
};

// Main auth guard middleware
export const authGuard = new Elysia<string, TContext>().derive(
  { as: 'global' },
  async (context) => {
    console.log('🚀 ~ authGuard:');
    const { headers } = context;

    // Get user's preferred language from headers (default to English)
    const acceptLanguage = headers['accept-language'] || 'en';
    const language = acceptLanguage.startsWith('fr') ? LanguagesEnum.fr : 
                    acceptLanguage.startsWith('ar') ? LanguagesEnum.ar : LanguagesEnum.en;

    // Extract token from headers
    const token = extractToken(headers);

    if (!token) {
      throw new AppError({
        error: getMessage('TOKEN_REQUIRED', language),
        statusCode: 401,
      });
    }

    // Decode and verify the token
    const user = decodeAndVerifyToken(token, language);

    // Check if user is anonymous
    if (user.is_anonymous) {
      throw new AppError({
        error: getMessage('ANONYMOUS_NOT_ALLOWED', language),
        statusCode: 401,
      });
    }

    const tenantId: string | undefined = headers[X_TENANT_ID];

    return {
      auth: {
        user,
        token,
        tenantId,
      },
    };
  }
);

// Optional auth guard (doesn't throw if no token)
export const optionalAuthGuard = new Elysia<string, TContext>().derive(
  { as: 'global' },
  async (context) => {
    console.log('🚀 ~ optionalAuthGuard:');
    const { headers } = context;

    // Extract token from headers
    const token = extractToken(headers);

    if (!token) {
      return {
        auth: null,
      };
    }

    try {
      // Decode and verify the token
      const user = decodeAndVerifyToken(token);

      // Check if user is anonymous
      if (user.is_anonymous) {
        Logger.info('Anonymous access is not allowed');
        return {
          auth: null,
        };
      }

      return {
        auth: {
          user,
          token,
        },
      };
    } catch (error) {
      // Return null auth if token is invalid
      Logger.error(error);
      Logger.info('Invalid JWT token');
      return {
        auth: null,
      };
    }
  }
);
