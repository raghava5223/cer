import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PaymentModal from '../components/PaymentModal';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data } = await api.get('/events');
                setEvents(data);
            } catch (error) {
                console.error('Error fetching events:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const categories = ['All', ...new Set(events.map(event => event.category || event.conductedBy || 'Other'))];

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.venue.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || (event.category || event.conductedBy || 'Other') === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleRegister = async (event) => {
        try {
            await api.post('/registrations', {
                eventId: event._id,
                paymentStatus: 'pending'
            });
            alert('Event added to My Registrations! You can pay for it later.');
            const { data } = await api.get('/events');
            setEvents(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to add event to registrations');
        }
    };

    return (
        <div className="min-h-screen bg-transparent p-6 animate-in fade-in duration-1000">
            <div className="md:max-w-[85%] lg:max-w-[80%] mx-auto w-full space-y-10">
                {/* Premium Header */}
                <div className="relative overflow-hidden bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-sm border border-white/40 animate-in slide-in-from-top-6 duration-1000">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse delay-1000"></div>

                    <div className="relative z-10">
                        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase animate-in fade-in slide-in-from-left-4 duration-700 delay-100">Student Portal</h1>
                        <p className="text-gray-500 font-bold text-lg animate-in fade-in slide-in-from-left-4 duration-700 delay-200">
                            Welcome back, <span className="text-blue-600 font-black italic">{user?.name}</span>. Explore <span className="text-indigo-600 italic">exclusive campus experiences</span>.
                        </p>

                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mt-8 pt-8 border-t border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                            <div className="flex gap-10">
                                <div className="flex flex-col group/stat cursor-default">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 group-hover/stat:text-blue-500 transition-colors">Total Events</span>
                                    <span className="text-3xl font-black text-gray-900 group-hover/stat:scale-110 transition-transform origin-left">{events.length}</span>
                                </div>
                                <div className="flex flex-col group/stat cursor-default">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 group-hover/stat:text-indigo-500 transition-colors">My Registrations</span>
                                    <span className="text-3xl font-black text-blue-600 group-hover/stat:scale-110 transition-transform origin-left">{events.filter(e => e.isRegistered).length}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/student/my-registrations')}
                                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all flex items-center gap-2 group"
                            >
                                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                                My Registrations
                            </button>
                        </div>
                    </div>
                </div>

                {/* Search & Filters */}
                {/* ... (Search & Filters section unchanged) */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 ${activeCategory === cat
                                    ? 'bg-admin-gradient text-white shadow-lg shadow-slate-200'
                                    : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-100'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <input
                            type="text"
                            placeholder="Find your next experience..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold shadow-sm focus:ring-2 focus:ring-blue-100 transition-all group-hover:shadow-md"
                        />
                        <svg className="w-5 h-5 absolute left-4 top-4 text-gray-300 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="space-y-6">
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Available Events</h2>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="bg-white rounded-[2.5rem] h-96 animate-pulse"></div>
                            ))}
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-gray-100 animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">No Events Matches</h3>
                            <p className="text-gray-500 font-medium">Try adjusting your filters or search term to explore more.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-12">
                            {filteredEvents.map((event, index) => (
                                <div
                                    key={event._id}
                                    className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="relative h-56 overflow-hidden">
                                        <img
                                            src={event.image || `https://source.unsplash.com/featured/?${event.eventName.split(' ')[0]}`}
                                            alt={event.eventName}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-2xl shadow-xl">
                                            <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors">₹{event.fees}</span>
                                        </div>

                                        <div className="absolute bottom-4 left-6">
                                            <span className="text-[10px] font-black text-white/90 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full uppercase tracking-wider border border-white/30">
                                                {event.category || event.conductedBy || 'Community'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-8 space-y-4">
                                        <div>
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-2xl font-black text-gray-900 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors line-clamp-1">{event.eventName}</h3>
                                            </div>
                                            <p className="text-gray-500 text-sm font-medium line-clamp-2 leading-relaxed">
                                                {event.description || 'Join us for an incredible experience filled with learning, networking, and fun.'}
                                            </p>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-gray-50">
                                            <div className="flex items-center text-xs font-black text-gray-400">
                                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                                <span className="uppercase tracking-widest">{event.venue}</span>
                                            </div>
                                            <div className="flex items-center text-xs font-black text-gray-400">
                                                <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                <span className="uppercase tracking-widest">{new Date(event.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                onClick={() => handleRegister(event)}
                                                disabled={event.isRegistered || event.currentEnrollmentCount >= event.studentEnrollmentLimit || event.status === 'closed'}
                                                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 shadow-xl active:scale-95 flex items-center justify-center gap-2 group/btn ${event.isRegistered
                                                    ? 'bg-registered-gradient text-white animate-success-pulse cursor-default shadow-emerald-100'
                                                    : event.currentEnrollmentCount >= event.studentEnrollmentLimit || event.status === 'closed'
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200'
                                                        : 'bg-pay-gradient text-white animate-pay-pulse hover:scale-[1.02] hover:shadow-indigo-200'
                                                    }`}
                                            >
                                                {event.isRegistered ? (
                                                    <>
                                                        <svg className="w-4 h-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Registered
                                                    </>
                                                ) : event.currentEnrollmentCount >= event.studentEnrollmentLimit ? (
                                                    'Event Full'
                                                ) : event.status === 'closed' ? (
                                                    'Registration Closed'
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                        </svg>
                                                        Register (Pending Payment)
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
