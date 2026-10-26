'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { z } from 'zod';

const onboardingSchema = z.object({
  organisationName: z.string().min(2, 'Organisation name must be at least 2 characters'),
  sector: z.string().min(1, 'Please select a sector'),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

const sectors = [
  'Construction',
  'IT & Technology',
  'Healthcare',
  'Education',
  'Social Care',
  'Facilities Management',
  'Consulting',
  'Engineering',
  'Logistics',
  'Security',
  'Other',
];

export default function Onboarding() {
  const router = useRouter();
  const [formData, setFormData] = useState<OnboardingFormData>({
    organisationName: '',
    sector: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);

  // Check if user is authenticated
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/sign-in');
      } else {
        setUserLoading(false);
      }
    };
    checkSession();
  }, [router]);

  // Check if user already has an organisation
  useEffect(() => {
    if (!userLoading) {
      checkOrganisationMembership();
    }
  }, [userLoading]);

  const checkOrganisationMembership = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data: memberships, error } = await supabase
      .from('memberships')
      .select('organisation_id, role, active')
      .eq('user_id', session.user.id)
      .eq('active', true);

    if (error) {
      console.error('Error checking memberships:', error);
      return;
    }

    // If user has any active membership, redirect to dashboard
    if (memberships && memberships.length > 0) {
      router.push('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setErrors({});

    // Validate form
    const result = onboardingSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const path = error.path.join('.');
        fieldErrors[path] = error.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No session found');
      }

      const userId = session.user.id;

      // Create organisation with atomic onboarding
      const response = await fetch('/api/organisations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.data.organisationName,
          sector: result.data.sector,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create organisation');
      }

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof OnboardingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-center text-gray-900">
            Welcome to bidsmith
          </h1>
          <p className="mt-2 text-center text-gray-600">
            Let&apos;s set up your organisation
          </p>
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          <div>
            <label htmlFor="organisationName" className="label">
              Organisation Name *
            </label>
            <input
              id="organisationName"
              name="organisationName"
              type="text"
              autoComplete="organization"
              required
              value={formData.organisationName}
              onChange={(e) => handleChange('organisationName', e.target.value)}
              className={`input ${errors.organisationName ? 'border-red-500' : ''}`}
              placeholder="Enter your organisation name"
            />
            {errors.organisationName && (
              <p className="mt-1 text-sm text-red-600">{errors.organisationName}</p>
            )}
          </div>

          <div>
            <label htmlFor="sector" className="label">
              Sector *
            </label>
            <select
              id="sector"
              name="sector"
              required
              value={formData.sector}
              onChange={(e) => handleChange('sector', e.target.value)}
              className={`input ${errors.sector ? 'border-red-500' : ''}`}
            >
              <option value="">Select your sector</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>
                  {sector}
                </option>
              ))}
            </select>
            {errors.sector && (
              <p className="mt-1 text-sm text-red-600">{errors.sector}</p>
            )}
          </div>

          <div className="pt-4">
            <p className="text-sm text-gray-500 text-center">
              This will create your first organisation. You can add more organisations later in settings.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn btn-primary"
          >
            {loading ? 'Creating Organisation...' : 'Create Organisation'}
          </button>
        </form>
      </div>
    </div>
  );
}
