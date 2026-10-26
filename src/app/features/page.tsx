import Link from 'next/link';

export default function Features() {
  const features = [
    {
      title: 'Document Intake',
      description: 'Upload and process PDF/DOCX tender documents automatically',
      icon: '📄',
    },
    {
      title: 'Requirement Extraction',
      description: 'Extract and link requirements with source references',
      icon: '🔍',
    },
    {
      title: 'Content Library',
      description: 'Organise approved company knowledge and evidence',
      icon: '📚',
    },
    {
      title: 'AI Drafting',
      description: 'Generate evidence-backed drafts with citations',
      icon: '✨',
    },
    {
      title: 'Human Review',
      description: 'Persistent editing and versioned approval workflows',
      icon: '👥',
    },
    {
      title: 'Readiness Checks',
      description: 'Verify compliance before final export',
      icon: '✅',
    },
    {
      title: 'DOCX/PDF Export',
      description: 'Generate genuine, validated export files',
      icon: '📥',
    },
    {
      title: 'Multi-Tenant',
      description: 'Complete tenant isolation with RLS and private storage',
      icon: '🏢',
    },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-gray-900">
              bidsmith
            </Link>
            <div className="flex gap-4">
              <Link href="/sign-in" className="btn btn-primary text-sm">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Features</h1>
          <p className="text-xl text-gray-600">
            Evidence-backed tender response preparation for UK public sector suppliers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h2>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
