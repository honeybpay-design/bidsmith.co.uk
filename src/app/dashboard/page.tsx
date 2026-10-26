import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

export default async function Dashboard() {
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

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/sign-in');
  }

  // Check if user has any active organisation memberships
  const { data: memberships, error: membershipError } = await supabase
    .from('memberships')
    .select('organisation_id, role, active, organisations(name, slug)')
    .eq('user_id', session.user.id)
    .eq('active', true);

  if (membershipError) {
    console.error('Error fetching memberships:', membershipError);
    redirect('/onboarding');
  }

  // If no organisations, redirect to onboarding
  if (!memberships || memberships.length === 0) {
    redirect('/onboarding');
  }

  // TODO: Fetch recent tenders

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/dashboard" className="text-xl font-bold text-gray-900">
              bidsmith
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to bidsmith
          </h1>
          <p className="text-gray-600 mb-8">
            Evidence-backed tender response preparation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/tenders"
              className="card hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">My Tenders</h2>
              <p className="text-gray-600 text-sm">
                View and manage your tender responses
              </p>
            </Link>

            <Link
              href="/tenders/new"
              className="card hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">New Tender</h2>
              <p className="text-gray-600 text-sm">
                Start a new tender response
              </p>
            </Link>

            <Link
              href="/library"
              className="card hover:shadow-lg transition-shadow"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Content Library</h2>
              <p className="text-gray-600 text-sm">
                Approved content and evidence
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
