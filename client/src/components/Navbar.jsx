import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-50 shadow-sm">
            <div className="md:max-w-[85%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20"> {/* Slightly taller navbar */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group transition-transform active:scale-95">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 group-hover:rotate-12 transition-transform duration-500">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tighter">EventPortal</span>
                        </Link>

                        <div className="hidden md:ml-12 md:flex md:space-x-8">
                            {user.role === 'student' && (
                                <>
                                    <Link to="/student" className="text-gray-600 hover:text-blue-600 px-1 py-2 text-sm font-black uppercase tracking-widest transition-all relative group/nav">
                                        Dashboard
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover/nav:w-full"></span>
                                    </Link>
                                    <Link to="/student/my-registrations" className="text-gray-600 hover:text-blue-600 px-1 py-2 text-sm font-black uppercase tracking-widest transition-all relative group/nav">
                                        My Events
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover/nav:w-full"></span>
                                    </Link>
                                </>
                            )}
                            {user.role === 'organizer' && (
                                <>
                                    <Link to="/organizer" className="text-gray-600 hover:text-blue-600 px-1 py-2 text-sm font-black uppercase tracking-widest transition-all relative group/nav">
                                        Managed Events
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover/nav:w-full"></span>
                                    </Link>
                                </>
                            )}
                            {user.role === 'admin' && (
                                <>
                                    <Link to="/admin" className="text-gray-600 hover:text-blue-600 px-1 py-2 text-sm font-black uppercase tracking-widest transition-all relative group/nav">
                                        System Admin
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover/nav:w-full"></span>
                                    </Link>
                                    <Link to="/admin/users" className="text-gray-600 hover:text-blue-600 px-1 py-2 text-sm font-black uppercase tracking-widest transition-all relative group/nav">
                                        Users
                                        <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all group-hover/nav:w-full"></span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-sm font-black text-gray-900 leading-none">{user.name}</span>
                            <span className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] mt-1">{user.role}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="group flex items-center bg-gray-900 hover:bg-red-600 text-white px-5 py-3 rounded-2xl transition-all duration-700 shadow-lg hover:shadow-red-200 active:scale-95 space-x-0 hover:space-x-3 overflow-hidden border border-gray-800 hover:border-red-500"
                        >
                            <span className="max-w-0 group-hover:max-w-[80px] transition-all duration-700 ease-in-out overflow-hidden font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap opacity-0 group-hover:opacity-100 italic">
                                Logout
                            </span>
                            <svg className="w-5 h-5 group-hover:rotate-[360deg] transition-transform duration-1000 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
