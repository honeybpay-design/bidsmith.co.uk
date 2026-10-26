'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push('/sign-in');
  };

  return (
    <button
      onClick={handleSignOut}
      className="btn btn-secondary text-sm"
    >
      Sign Out
    </button>
  );
}
