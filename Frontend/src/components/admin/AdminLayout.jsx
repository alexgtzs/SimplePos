import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminHeader from '../layout/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100 flex-col">
      {/* Header fijo */}
      <AdminHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="flex-shrink-0 h-full overflow-y-auto">
          <AdminSidebar />
        </div>
        
        {/* Área de contenido principal */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet /> {/* Aquí se renderizan las páginas */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;