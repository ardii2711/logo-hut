"use client";

export default function SubmissionDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">
          Detail Submission
        </h1>
        <p className="text-slate-600">
          ID: {params.id}
        </p>
        <p className="text-slate-600 mt-2">
          Detail Page - Coming Soon (Full Implementation di FE-3)
        </p>
      </div>
    </div>
  );
}
