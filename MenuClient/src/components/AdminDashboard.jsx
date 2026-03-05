import { SuperAdminPanel } from './SuperAdminPanel.jsx';
import { TenantAdminPanel } from './TenantAdminPanel.jsx';

export function AdminDashboard({ user, onLogout }) {
  if (user?.role === 'super_admin') {
    return <SuperAdminPanel onLogout={onLogout} user={user} />;
  }

  return <TenantAdminPanel onLogout={onLogout} user={user} />;
}
