import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function CollaboratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'collaborator') {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <nav className="bg-white shadow-sm p-4 border-b border-blue-100">
        <div className="container mx-auto font-bold text-xl text-blue-800">
          Collaborator Workspace
        </div>
      </nav>
      <main className="container mx-auto p-4">{children}</main>
    </div>
  );
}
