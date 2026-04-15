import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ParticipantModal from '../components/ParticipantModal';
import QRScannerModal from '../components/QRScannerModal';

const OrganizerDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isParticipantModalOpen, setIsParticipantModalOpen] = useState(false);
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchOrganizerData = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/events');
            const myEvents = data.filter(event => event.organizerId === user._id);
            setEvents(myEvents);
        } catch (error) {
            console.error('Error fetching coordinator data:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizerData();
    }, [user._id]);

    const filteredEvents = events.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleOpenParticipants = (event) => {
        setSelectedEvent(event);
        setIsParticipantModalOpen(true);
    };

    const handleOpenScanner = (event) => {
        setSelectedEvent(event);
        setIsQRModalOpen(true);
    };

    const onAttendanceMarked = () => {
        fetchOrganizerData();
    };

    return (
        <div className="min-h-screen bg-transparent p-6 animate-in fade-in duration-700">
            <div className="md:max-w-[85%] lg:max-w-[80%] mx-auto w-full space-y-8">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-sm border border-white/40 animate-in slide-in-from-top-6 duration-1000">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase tracking-tighter">Coordinator Hub</h1>
                            <p className="text-gray-500 font-bold text-lg">Managing <span className="text-blue-600 italic">your assigned experiences</span></p>
                        </div>

                        <div className="relative w-full md:w-96 group">
                            <input
                                type="text"
                                placeholder="Filter your events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-white/50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                            />
                            <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full flex flex-col items-center py-20 animate-pulse">
                            <div className="rounded-full h-16 w-16 border-4 border-blue-100 border-t-blue-600 animate-spin mb-4"></div>
                            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Loading Your Events...</p>
                        </div>
                    ) : filteredEvents.length === 0 ? (
                        <div className="col-span-full bg-white p-12 rounded-[2.5rem] text-center shadow-sm border border-gray-100 animate-in zoom-in-95 duration-500">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">No Events Found</h3>
                            <p className="text-gray-500 font-medium">Try a different search term or contact admin for assignments.</p>
                        </div>
                    ) : (
                        filteredEvents.map((event, index) => (
                            <div
                                key={event._id}
                                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-8"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="p-8 flex-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors leading-tight uppercase tracking-tight">{event.eventName}</h3>
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${event.status === 'open'
                                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50'
                                            : 'bg-rose-50 text-rose-600 border-rose-100 shadow-rose-50'
                                            }`}>
                                            {event.status}
                                        </span>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 p-3 rounded-2xl group-hover:bg-blue-50 transition-colors">
                                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-blue-500 mr-3 shadow-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            </div>
                                            {new Date(event.date).toLocaleDateString()} at {event.time}
                                        </div>
                                        <div className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 p-3 rounded-2xl group-hover:bg-indigo-50 transition-colors">
                                            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-indigo-500 mr-3 shadow-sm">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                            </div>
                                            {event.venue}
                                        </div>
                                    </div>

                                    <div className="mt-auto space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration Capacity</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-blue-600">{event.currentEnrollmentCount}</span>
                                                <span className="text-xs font-black text-gray-300">/ {event.studentEnrollmentLimit}</span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden shadow-inner">
                                            <div
                                                className="bg-pay-gradient h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                                                style={{ width: `${Math.min(100, (event.currentEnrollmentCount / event.studentEnrollmentLimit) * 100)}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 p-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleOpenScanner(event)}
                                        className="bg-white text-gray-700 py-4 rounded-2xl text-xs font-black uppercase tracking-widest border border-gray-200 hover:bg-gray-100 hover:shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h2M4 8h2m12-4h2M4 4h2m10 0v4" /></svg>
                                        Scan QR
                                    </button>
                                    <button
                                        onClick={() => handleOpenParticipants(event)}
                                        className="bg-pay-gradient text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                        Manage
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modals */}
                <ParticipantModal
                    isOpen={isParticipantModalOpen}
                    onClose={() => setIsParticipantModalOpen(false)}
                    eventId={selectedEvent?._id}
                    eventName={selectedEvent?.eventName}
                />

                <QRScannerModal
                    isOpen={isQRModalOpen}
                    onClose={() => setIsQRModalOpen(false)}
                    onAttendanceMarked={onAttendanceMarked}
                    eventId={selectedEvent?._id}
                    eventName={selectedEvent?.eventName}
                />
            </div>
        </div>
    );
};

export default OrganizerDashboard;
