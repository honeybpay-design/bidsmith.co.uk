import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { code?: string; error?: string };
}) {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => {
          const allCookies = cookieStore.getAll();
          return Object.entries(allCookies).map(([name, cookie]) => ({
            name,
            value: cookie.value,
          }));
        },
        setAll: () => {
          // Cannot set cookies in Server Components
        },
      },
    }
  );

  if (searchParams.error) {
    console.error('Auth callback error:', searchParams.error);
    redirect('/sign-in?error=' + encodeURIComponent(searchParams.error));
  }

  if (searchParams.code) {
    await supabase.auth.exchangeCodeForSession(searchParams.code);
  }

  // Check if we have a session
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in?error=no_session');
  }

  // Check if user has any active organisation memberships
  const { data: memberships, error: membershipError } = await supabase
    .from('memberships')
    .select('id')
    .eq('user_id', session.user.id)
    .eq('active', true);

  if (membershipError) {
    console.error('Error checking memberships:', membershipError);
    // Fallback to dashboard
    redirect('/dashboard');
  }

  // If user has no organisations, redirect to onboarding
  if (!memberships || memberships.length === 0) {
    redirect('/onboarding');
  }

  // User has organisations, redirect to dashboard
  redirect('/dashboard');
}
