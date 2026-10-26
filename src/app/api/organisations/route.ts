import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const createOrganisationSchema = z.object({
  name: z.string().min(2, 'Organisation name must be at least 2 characters'),
  sector: z.string().min(1, 'Sector is required'),
});

export async function POST(request: Request) {
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
          // Cannot set cookies in Server Components / Route Handlers directly
          // This should be handled by middleware
        },
      },
    }
  );

  // Get session
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  // Parse request body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON' },
      { status: 400 }
    );
  }

  // Validate request
  const result = createOrganisationSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { 
        error: 'Validation failed',
        details: result.error.format() 
      },
      { status: 422 }
    );
  }

  const { name, sector } = result.data;

  // Generate slug
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 50);

  try {
    // First, check if user already has any active memberships
    const { data: existingMemberships, error: checkMembershipError } = await supabase
      .from('memberships')
      .select('id')
      .eq('user_id', userId)
      .eq('active', true);

    if (checkMembershipError) {
      throw checkMembershipError;
    }

    if (existingMemberships && existingMemberships.length > 0) {
      return NextResponse.json(
        { error: 'User already has an organisation' },
        { status: 409 }
      );
    }

    // Create organisation with a unique slug
    // Try to insert with generated slug, retry if exists
    let organisationId: string | null = null;
    let finalSlug = slug;
    let attempt = 0;
    const maxAttempts = 5;

    while (attempt < maxAttempts && organisationId === null) {
      const { data: org, error: orgError } = await supabase
        .from('organisations')
        .insert({
          name,
          slug: finalSlug,
          sector,
          lifecycle: 'active',
          retention: 'standard',
        })
        .select('id')
        .single();

      if (orgError) {
        // If slug conflict, append random suffix and retry
        if (orgError.code === '23505' && attempt < maxAttempts - 1) {
          const randomSuffix = Math.random().toString(36).substring(2, 6);
          finalSlug = `${slug}-${randomSuffix}`;
          attempt++;
          continue;
        }
        throw orgError;
      }

      organisationId = org?.id || null;
    }

    if (!organisationId) {
      throw new Error('Failed to create organisation');
    }

    // Create owner membership
    const { error: createMembershipError } = await supabase
      .from('memberships')
      .insert({
        organisation_id: organisationId,
        user_id: userId,
        role: 'owner',
        active: true,
      });

    if (createMembershipError) {
      // Rollback: delete organisation if membership creation fails
      await supabase
        .from('organisations')
        .delete()
        .eq('id', organisationId);
      
      throw createMembershipError;
    }

    // Return success
    return NextResponse.json({
      success: true,
      organisationId,
      name,
      slug: finalSlug,
      role: 'owner',
    });

  } catch (error) {
    console.error('Organisation creation error:', error);
    
    // Extract error message
    const message = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

// GET /api/organisations - List user's organisations
export async function GET(request: Request) {
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
          // Cannot set cookies in Server Components / Route Handlers directly
        },
      },
    }
  );

  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const userId = session.user.id;

  try {
    // Get user's organisations through memberships
    const { data: memberships, error: fetchError } = await supabase
      .from('memberships')
      .select(`
        organisation_id, 
        role, 
        active,
        organisations:organisation_id (id, name, slug, sector, lifecycle, retention, created_at, updated_at)
      `)
      .eq('user_id', userId)
      .eq('active', true);

    if (fetchError) {
      throw fetchError;
    }

    // Type-safe mapping of memberships to organisations
    const organisations = memberships?.map((m: any) => ({
      id: m.organisations?.id,
      name: m.organisations?.name,
      slug: m.organisations?.slug,
      sector: m.organisations?.sector,
      lifecycle: m.organisations?.lifecycle,
      retention: m.organisations?.retention,
      role: m.role,
      createdAt: m.organisations?.created_at,
      updatedAt: m.organisations?.updated_at,
    })) || [];

    return NextResponse.json({
      organisations,
    });

  } catch (error) {
    console.error('Error fetching organisations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
