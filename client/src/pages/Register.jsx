import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phoneNumber: '',
        department: '',
        address: '',
    });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/student/register', formData);
            login(data);
            navigate('/student');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="relative min-h-screen bg-[#f8fafc] flex items-center justify-center overflow-hidden font-sans py-12 px-6">
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

            <div className="relative z-10 w-full max-w-2xl animate-in fade-in zoom-in-95 duration-1000">
                <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[3rem] border border-white/40 shadow-[0_32px_128px_rgba(0,0,0,0.08)]">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase leading-none">Register</h2>
                        <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] animate-status-pulse">Create Student Identity</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/10 text-red-600 px-5 py-4 rounded-2xl mb-8 text-xs font-black uppercase tracking-widest flex items-center animate-in slide-in-from-top-2 duration-500">
                            <span className="w-2 h-2 bg-red-600 rounded-full mr-3 animate-ping"></span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 animate-in slide-in-from-bottom-4 duration-700">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Full Name</label>
                                <input name="name" type="text" className="w-full px-6 py-4 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm" placeholder="John Doe" onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">College Email</label>
                                <input name="email" type="email" className="w-full px-6 py-4 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm" placeholder="john@college.edu" onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Credential</label>
                                <input name="password" type="password" className="w-full px-6 py-4 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm" placeholder="••••••••" onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Phone Number</label>
                                <input name="phoneNumber" type="text" className="w-full px-6 py-4 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm" placeholder="+91 98765 43210" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Department</label>
                                <input name="department" type="text" className="w-full px-6 py-4 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm" placeholder="Computer Science" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">City / Address</label>
                                <input name="address" type="text" className="w-full px-6 py-4 bg-white/50 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm" placeholder="New York, USA" onChange={handleChange} />
                            </div>
                        </div>
                        <button type="submit" className="group relative w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all duration-500 shadow-2xl active:scale-95 mt-4 overflow-hidden">
                            <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <span className="relative z-10">Seal Identity</span>
                        </button>
                    </form>

                    <div className="mt-12 text-center animate-in fade-in duration-1000 delay-500">
                        <p className="text-gray-500 font-black text-[10px] uppercase tracking-[0.2em]">
                            Found your credentials?{' '}
                            <Link to="/login" className="text-blue-600 font-black hover:text-indigo-600 transition-colors border-b-2 border-blue-600/10 hover:border-indigo-600/30">
                                Authenticate Identity
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
