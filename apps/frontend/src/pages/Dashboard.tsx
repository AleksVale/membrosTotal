import ProtectedRoute from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your dashboard
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2">Members</h2>
            <p className="text-muted-foreground mb-4">
              Manage your members
            </p>
            <Button variant="outline">View Members</Button>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2">Reports</h2>
            <p className="text-muted-foreground mb-4">
              View analytics and reports
            </p>
            <Button variant="outline">View Reports</Button>
          </div>

          <div className="rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-2">Settings</h2>
            <p className="text-muted-foreground mb-4">
              Configure your preferences
            </p>
            <Button variant="outline">Open Settings</Button>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
}

