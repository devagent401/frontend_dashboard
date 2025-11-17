import { requireAuth } from '@/lib/auth-server';
import { DashboardLayout } from '@/components/DashboardLayout';

export default async function DashboardLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    // Ensure user is authenticated (redirect to auth if they are not)
    await requireAuth();

    return (
        <DashboardLayout>
            {children}
        </DashboardLayout>
    );
}