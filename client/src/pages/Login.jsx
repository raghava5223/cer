import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            login(data);
            if (data.role === 'admin') navigate('/admin');
            else if (data.role === 'organizer') navigate('/organizer');
            else navigate('/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="relative min-h-screen bg-[#f8fafc] flex items-center justify-center overflow-hidden font-sans">
            {/* Vibrant Light Aurora Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/20 rounded-full blur-[120px] animate-aurora"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-rose-400/20 rounded-full blur-[150px] animate-aurora" style={{ animationDelay: '-5s' }}></div>
                <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] bg-indigo-400/20 rounded-full blur-[100px] animate-aurora" style={{ animationDelay: '-10s' }}></div>

                {/* Floating Particles (Sparkles) */}
                <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-20"></div>
                <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-rose-400 rounded-full animate-ping opacity-20" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping opacity-20" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in-95 duration-1000">
                <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/40 shadow-[0_32px_128px_rgba(0,0,0,0.08)]">
                    <div className="text-center mb-10">
                        <div className="group relative w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mx-auto mb-6 transform transition-transform duration-700 hover:rotate-12 active:scale-90">
                            <div className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <svg className="w-10 h-10 text-white relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase leading-none">Welcome</h2>
                        <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] animate-status-pulse">Event Portal Access</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/10 text-red-600 px-5 py-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest flex items-center animate-in slide-in-from-top-2 duration-500">
                            <span className="w-2 h-2 bg-red-600 rounded-full mr-3 animate-ping"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="animate-in slide-in-from-bottom-2 duration-700 delay-100">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Identity</label>
                            <input
                                type="email"
                                className="w-full px-6 py-5 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                placeholder="name@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="animate-in slide-in-from-bottom-2 duration-700 delay-200">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Credential</label>
                            <input
                                type="password"
                                className="w-full px-6 py-5 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="group relative w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all duration-500 shadow-2xl active:scale-95 mt-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-1000 delay-300"
                        >
                            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <span className="relative z-10">Authorize Access</span>
                        </button>
                    </form>

                    <div className="mt-12 text-center animate-in fade-in duration-1000 delay-500">
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.2em]">
                            New around here?{' '}
                            <Link to="/register" className="text-blue-600 font-black hover:text-indigo-600 transition-colors border-b-2 border-blue-600/10 hover:border-indigo-600/30">
                                Register Identity
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
