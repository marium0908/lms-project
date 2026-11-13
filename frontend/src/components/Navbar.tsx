import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, LogIn } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const isAdmin = Boolean(localStorage.getItem('adminToken'));

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <nav className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-indigo-400">
          LMS
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <Link to="/" className="hover:text-indigo-300 transition">
            Courses
          </Link>

          {isAdmin ? (
            <>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-700 px-3 py-1.5 rounded-md transition"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-slate-300 hover:text-red-400 transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="flex items-center gap-1 border border-slate-700 hover:border-indigo-400 px-3 py-1.5 rounded-md transition"
            >
              <LogIn className="w-4 h-4" />
              Admin Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
