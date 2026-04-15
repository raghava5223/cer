import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import PaymentModal from '../components/PaymentModal';

const MyRegistrations = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedReg, setSelectedReg] = useState(null);
    const [isTicketOpen, setIsTicketOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const fetchMyRegistrations = async () => {
        try {
            const { data } = await api.get('/registrations/my');
            setRegistrations(data);
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyRegistrations();
    }, []);

    const openTicket = (reg) => {
        setSelectedReg(reg);
        setIsTicketOpen(true);
    };

    const handlePrint = () => {
        window.print();
    };

    const pendingRegistrations = registrations.filter(reg => reg.paymentStatus === 'pending');
    const confirmedRegistrations = registrations.filter(reg => reg.paymentStatus === 'paid');
    const totalPendingAmount = pendingRegistrations.reduce((sum, reg) => sum + (reg.eventId?.fees || 0), 0);

    const onBulkPaymentSuccess = async (paymentData) => {
        try {
            await api.post('/registrations/bulk-pay', {
                registrationIds: pendingRegistrations.map(reg => reg._id),
                transactionId: paymentData.transactionId
            });
            alert('Bulk Payment Successful! All events are now confirmed.');
            fetchMyRegistrations();
        } catch (error) {
            alert(error.response?.data?.message || 'Bulk payment failed');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 animate-in fade-in duration-1000">
            <div className="md:max-w-[85%] lg:max-w-[80%] mx-auto space-y-10">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 animate-in slide-in-from-top-4 duration-1000 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase">My Registrations</h1>
                        <p className="text-gray-500 font-medium text-lg">Track the events you're participating in and access your entry tickets.</p>
                    </div>
                    {pendingRegistrations.length > 0 && (
                        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 flex flex-col items-center gap-2">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Pending Payment</span>
                            <span className="text-2xl font-black text-indigo-600">₹{totalPendingAmount}</span>
                            <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="bg-pay-gradient text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all"
                            >
                                Pay Total Now
                            </button>
                        </div>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-[2.5rem] h-48 animate-pulse shadow-sm border border-gray-50"></div>
                        ))}
                    </div>
                ) : registrations.length === 0 ? (
                    <div className="bg-white p-20 rounded-[3rem] text-center shadow-sm border border-gray-100 animate-in zoom-in-95 duration-500">
                        {/* ... (No registrations content) */}
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">No Registrations Yet</h3>
                        <p className="text-gray-500 font-medium mb-8">You haven't joined any experiences. Time to explore!</p>
                        <a href="/student" className="inline-flex bg-pay-gradient text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:scale-105 transition-all">Browse Events</a>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {pendingRegistrations.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                                    Pending Payment ({pendingRegistrations.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {pendingRegistrations.map((reg, index) => (
                                        <RegistrationCard key={reg._id} reg={reg} index={index} />
                                    ))}
                                </div>
                            </section>
                        )}

                        {confirmedRegistrations.length > 0 && (
                            <section className="space-y-6">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    Confirmed ({confirmedRegistrations.length})
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {confirmedRegistrations.map((reg, index) => (
                                        <RegistrationCard key={reg._id} reg={reg} index={index} openTicket={openTicket} />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </div>

            <PaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onPaymentSuccess={onBulkPaymentSuccess}
                eventDetails={{ fees: totalPendingAmount, eventName: `${pendingRegistrations.length} Events Bulk Payment` }}
            />

            {/* Ambient Ticket Modal (unchanged logic) */}
            {isTicketOpen && selectedReg && (
                <TicketModal reg={selectedReg} onClose={() => setIsTicketOpen(false)} handlePrint={handlePrint} />
            )}
        </div>
    );
};

const RegistrationCard = ({ reg, index, openTicket }) => {
    return (
        <div
            className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100 flex gap-8 hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8"
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <div className="w-32 h-32 rounded-3xl overflow-hidden flex-shrink-0 bg-gray-50 shadow-inner group-hover:shadow-md transition-shadow">
                <img
                    src={reg.eventId?.image || `https://source.unsplash.com/featured/?${reg.eventId?.eventName?.split(' ')[0]}`}
                    alt={reg.eventId?.eventName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-2xl font-black text-gray-800 leading-tight uppercase tracking-tight group-hover:text-blue-600 transition-colors">{reg.eventId?.eventName}</h3>
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${reg.paymentStatus === 'paid'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50'
                            : 'bg-amber-50 text-amber-600 border-amber-100 shadow-amber-50'
                            }`}>
                            {reg.paymentStatus === 'paid' ? 'Confirmed' : 'Pending'}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center text-xs font-black text-gray-400">
                            <span className="text-indigo-600 mr-2">₹{reg.eventId?.fees}</span>
                            <span className="uppercase tracking-widest">{reg.eventId ? new Date(reg.eventId.date).toLocaleDateString() : 'TBA'}</span>
                        </div>
                        <div className="flex items-center text-xs font-black text-gray-400">
                            <svg className="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            <span className="uppercase tracking-widest truncate">{reg.eventId?.venue}</span>
                        </div>
                    </div>
                </div>

                {reg.paymentStatus === 'paid' && (
                    <button
                        onClick={() => openTicket(reg)}
                        className="mt-6 flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] hover:text-blue-700 transition-colors group/btn"
                    >
                        <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center group-hover/btn:bg-blue-600 group-hover/btn:text-white transition-all">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        View Entry Ticket
                        <svg className="w-3 h-3 ml-1 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7" /></svg>
                    </button>
                )}
            </div>
        </div>
    );
};

const TicketModal = ({ reg, onClose, handlePrint }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:p-0 print:block">
            {/* Ambient Aura */}
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-xl animate-in fade-in duration-500 print:hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
            </div>

            <div className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden flex flex-col shadow-[0_32px_128px_rgba(0,0,0,0.3)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 print:shadow-none print:rounded-none">
                {/* High-End Header */}
                <div className="relative h-24 bg-gray-900 print:h-20">
                    <div className="absolute inset-0 bg-blue-600/40 opacity-40"></div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-[0.4em] mb-1">Secure Entry</span>
                        <h2 className="text-2xl font-black text-white uppercase tracking-widest italic">V-Ticket</h2>
                    </div>
                </div>

                <div className="p-6 space-y-5 print:p-5 print:space-y-3">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Authenticated Experience</p>
                            <h3 className="text-xl font-black text-gray-900 leading-tight uppercase tracking-tight">{reg.eventId?.eventName}</h3>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Verification ID</p>
                            <p className="font-mono text-[10px] font-black bg-gray-50 px-2.5 py-1.5 rounded-xl border border-gray-100 uppercase text-gray-600">#{reg._id.slice(-8)}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 print:gap-3">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">Live Date</p>
                            <p className="text-base font-black text-gray-900">{new Date(reg.eventId?.date).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">Check-in</p>
                            <p className="text-base font-black text-gray-900">{reg.eventId?.time || '10:00 AM'}</p>
                        </div>
                        <div className="col-span-2 space-y-0.5">
                            <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em]">Assigned Venue</p>
                            <p className="text-base font-black text-gray-900 truncate">{reg.eventId?.venue}</p>
                        </div>
                    </div>

                    <div className="flex flex-col items-center py-5 border-y border-dashed border-gray-100 relative print:py-3">
                        <div className="bg-white p-4 rounded-[2rem] shadow-xl relative group/qr hover:scale-105 transition-transform duration-500">
                            <img src={reg.qrCode} alt="Registration QR" className="w-40 h-40 relative z-10 print:w-32 print:h-32" />
                        </div>
                        <p className="mt-4 text-[9px] font-black text-gray-300 uppercase tracking-[0.4em]">Scan to mark attendance</p>
                    </div>
                </div>

                <div className="p-6 pt-0 flex gap-4 print:hidden">
                    <button
                        onClick={handlePrint}
                        className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center hover:bg-blue-600 transition-all active:scale-95"
                    >
                        Print Ticket
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 border-2 border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-50 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyRegistrations;
