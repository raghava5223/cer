import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                const { data } = await api.get(`/events/${id}`);
                setEvent(data);

                if (user && user.role === 'student') {
                    const { data: myRegs } = await api.get('/registrations/my');
                    const registered = myRegs.some(reg => reg.eventId._id === id);
                    setIsRegistered(registered);
                }
            } catch (error) {
                console.error('Error fetching event details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEventDetails();
    }, [id, user]);

    const handleRegister = () => {
        if (!user) return navigate('/login');
        setIsPaymentModalOpen(true);
    };

    const onPaymentSuccess = async (paymentData) => {
        try {
            await api.post('/registrations', {
                eventId: id,
                ...paymentData
            });
            alert('Payment Confirmed & Registered successfully!');
            setIsRegistered(true);
            setEvent(prev => ({ ...prev, currentEnrollmentCount: prev.currentEnrollmentCount + 1 }));
        } catch (error) {
            alert(error.response?.data?.message || 'Registration failed after payment');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!event) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
                <button onClick={() => navigate(-1)} className="text-blue-600 font-bold hover:underline italic">← Go Back</button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-transparent pb-12 animate-in fade-in duration-1000">
            <div className="h-[32rem] w-full relative overflow-hidden">
                <img
                    src={event.image || '/api/placeholder/1200/400'}
                    className="w-full h-full object-cover scale-105 animate-pulse-slow transition-transform hover:scale-100 duration-1000"
                    alt={event.eventName}
                />
                {/* Cinematic Overlay Stack */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-gray-50/20 to-transparent"></div>
                <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-gray-50 to-transparent"></div>
                <div className="absolute inset-0 bg-blue-600/5 mix-blend-overlay"></div>

                <div className="absolute bottom-0 left-0 right-0 p-12 md:max-w-[85%] lg:max-w-[80%] mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-full mb-8 flex items-center text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all active:scale-95 border border-white/20 shadow-xl"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Experiences
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                        <div className="animate-in slide-in-from-left-8 duration-1000">
                            <span className="bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.3em] px-4 py-1.5 rounded-lg mb-4 inline-block shadow-lg shadow-blue-200">
                                {event.conductedBy}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-4 tracking-tighter leading-none uppercase">{event.eventName}</h1>
                            <div className="flex items-center gap-6">
                                <p className="text-gray-500 font-bold text-xl flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {event.venue}
                                </p>
                                <span className="px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-gray-400 border border-gray-200">{event.category}</span>
                            </div>
                        </div>

                        <div className="bg-white/80 backdrop-blur-3xl p-8 rounded-[2rem] border border-white min-w-[240px] shadow-2xl animate-in zoom-in-95 duration-1000 delay-300">
                            <p className="text-gray-400 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Access Fee</p>
                            <div className="flex items-baseline">
                                <span className="text-sm font-black text-blue-600 mr-1 italic">₹</span>
                                <span className="text-5xl font-black text-gray-900 tracking-tight">{event.fees}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:max-w-[85%] lg:max-w-[80%] mx-auto px-12 -mt-8 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Left Column: Description & Details */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/40 shadow-sm animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                            <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest mb-8 pb-4 border-b border-gray-100">Experience Overview</h2>
                            <p className="text-gray-600 text-lg leading-relaxed font-medium whitespace-pre-wrap">{event.description}</p>

                            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-gray-100">
                                <div className="group">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-blue-500 transition-colors">Date & Time</p>
                                    <p className="text-lg font-black text-gray-900 uppercase">{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' })} • {event.time || '10:00 AM'}</p>
                                </div>
                                <div className="group">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">Seat Availability</p>
                                    <p className="text-lg font-black text-gray-900 uppercase">{event.currentEnrollmentCount} / {event.maxSeats} Booked</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Actions & Quick Info */}
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-1000 delay-700">
                        <div className="bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] border border-white/40 shadow-sm sticky top-32">
                            {isRegistered ? (
                                <div className="text-center py-4">
                                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100 shadow-inner">
                                        <svg className="w-10 h-10 text-emerald-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                    </div>
                                    <h3 className="text-2xl font-black text-emerald-600 uppercase tracking-tight mb-2">Access Secured</h3>
                                    <p className="text-gray-500 font-bold mb-8">You are successfully registered for this experience.</p>
                                    <button
                                        onClick={() => navigate('/student/my-registrations')}
                                        className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-black transition-all active:scale-95 shadow-xl"
                                    >
                                        View Entry Ticket
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="mb-8">
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Progress</span>
                                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{Math.round((event.currentEnrollmentCount / event.maxSeats) * 100)}% Full</span>
                                        </div>
                                        <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-50">
                                            <div
                                                className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-1000 shadow-lg"
                                                style={{ width: `${(event.currentEnrollmentCount / event.maxSeats) * 100}%` }}
                                            ></div>
                                        </div>
                                    </div>

                                    {event.currentEnrollmentCount >= event.maxSeats ? (
                                        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 text-center">
                                            <p className="text-rose-600 font-black uppercase tracking-widest text-xs">Maximum Capacity Reached</p>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={handleRegister}
                                            className="w-full py-5 bg-pay-gradient text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:shadow-2xl hover:shadow-blue-200 hover:-translate-y-1 transition-all active:scale-95 shadow-xl relative overflow-hidden group/btn"
                                        >
                                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                            Secure Access Now
                                        </button>
                                    )}
                                    <p className="mt-6 text-center text-gray-400 font-bold text-[10px] uppercase tracking-widest">Instant confirmation via QR-PDF</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={onPaymentSuccess}
                eventDetails={event}
            />
        </div>
    );
};

export default EventDetails;

