import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            bidsmith.co.uk
          </h1>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Evidence-backed tender response preparation for UK public sector suppliers
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in" className="btn btn-primary">
              Sign In
            </Link>
            <Link href="/features" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
