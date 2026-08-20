import type { Metadata } from 'next';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import { isAdminAuthenticated } from './actions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Portfolio Admin | Satish Yadav',
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const isAuthenticated = await isAdminAuthenticated();
  return isAuthenticated ? <AdminDashboard /> : <AdminLogin />;
}
