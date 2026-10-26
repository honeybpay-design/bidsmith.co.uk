import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  '/dashboard',
  '/tenders',
  '/tenders/new',
  '/library',
  '/evidence',
  '/settings',
];

const publicRoutes = [
  '/',
  '/features',
  '/pricing',
  '/security',
  '/contact',
  '/privacy',
  '/terms',
  '/ai-policy',
  '/sign-in',
  '/sign-up',
  '/auth/callback',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          const cookieHeader = request.headers.get('cookie');
          if (!cookieHeader) return [];
          
          return cookieHeader.split(';').reduce((acc: { name: string; value: string; }[], cookie) => {
            const [name, ...rest] = cookie.trim().split('=');
            if (name && rest.length > 0) {
              acc.push({ name, value: rest.join('=') });
            }
            return acc;
          }, []);
        },
        setAll: (cookiesToSet, headers) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            const maxAge = options?.maxAge !== undefined ? `; Max-Age=${options.maxAge}` : '';
            const path = options?.path ? `; Path=${options.path}` : '';
            const httpOnly = options?.httpOnly ? '; HttpOnly' : '';
            const sameSite = options?.sameSite ? `; SameSite=${options.sameSite}` : '';
            const secure = options?.secure ? '; Secure' : '';
            
            response.cookies.set(name, value, {
              maxAge: options?.maxAge,
              path: options?.path || '/',
              httpOnly: options?.httpOnly !== false,
              sameSite: options?.sameSite as 'lax' | 'strict' | 'none' | undefined,
              secure: options?.secure,
            });
          });
          
          Object.entries(headers).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  // Redirect authenticated users away from auth pages
  if (session && (pathname.startsWith('/sign-in') || pathname.startsWith('/sign-up'))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Protect routes that require authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)',
  ],
};
