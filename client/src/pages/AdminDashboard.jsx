import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import EventForm from '../components/EventForm';

const AdminDashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0 });
    const [loading, setLoading] = useState(true);
    const [organizers, setOrganizers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                const [eventsRes, organizersRes] = await Promise.all([
                    api.get('/events'),
                    api.get('/auth/organizers')
                ]);
                setEvents(eventsRes.data);
                setOrganizers(organizersRes.data);
                setStats({
                    totalEvents: eventsRes.data.length,
                    totalRegistrations: eventsRes.data.reduce((acc, curr) => acc + (curr.currentEnrollmentCount || 0), 0)
                });
            } catch (error) {
                console.error('Error fetching admin data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAdminData();
    }, []);

    const filteredEvents = events.filter(event =>
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (selectedEvent) {
                await api.put(`/events/${selectedEvent._id}`, formData);
                alert('Event updated successfully!');
            } else {
                await api.post('/events', formData);
                alert('Event created successfully!');
            }
            setIsModalOpen(false);
            const { data } = await api.get('/events');
            setEvents(data);
            setStats({
                totalEvents: data.length,
                totalRegistrations: data.reduce((acc, curr) => acc + (curr.currentEnrollmentCount || 0), 0)
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const openCreateModal = () => {
        setSelectedEvent(null);
        setIsModalOpen(true);
    };

    const openEditModal = (event) => {
        setSelectedEvent(event);
        setIsModalOpen(true);
    };

    const deleteEvent = async (id) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            try {
                await api.delete(`/events/${id}`);
                setEvents(events.filter(e => e._id !== id));
            } catch (error) {
                alert('Failed to delete event');
            }
        }
    };

    return (
        <div className="min-h-screen bg-transparent p-6 animate-in fade-in duration-1000">
            <div className="md:max-w-[85%] lg:max-w-[80%] mx-auto w-full space-y-8">
                {/* Header Section */}
                <div className="relative overflow-hidden bg-white/70 backdrop-blur-3xl p-10 rounded-[2.5rem] shadow-sm border border-white/40 animate-in slide-in-from-top-6 duration-1000">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl animate-pulse delay-700"></div>

                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight uppercase">System Admin</h1>
                            <p className="text-gray-500 font-bold text-lg">Central control for <span className="text-blue-600 italic">all platform activities</span></p>

                            <div className="flex gap-10 mt-8 pt-8 border-t border-gray-100">
                                <div className="flex flex-col group/stat cursor-default">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 group-hover/stat:text-blue-500 transition-colors">Active Events</span>
                                    <span className="text-3xl font-black text-gray-900 group-hover/stat:scale-110 transition-transform origin-left">{stats.totalEvents}</span>
                                </div>
                                <div className="flex flex-col group/stat cursor-default">
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1 group-hover/stat:text-indigo-500 transition-colors">Global Enrollment</span>
                                    <span className="text-3xl font-black text-blue-600 group-hover/stat:scale-110 transition-transform origin-left">{stats.totalRegistrations}</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={openCreateModal}
                            className="bg-admin-gradient text-white px-10 py-5 rounded-[1.5rem] font-black uppercase tracking-widest shadow-2xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 transition-all active:scale-95 flex items-center group overflow-hidden relative"
                        >
                            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <div className="bg-white/20 p-2 rounded-xl mr-4 group-hover:rotate-180 transition-transform duration-500">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <span className="relative z-10">New Event</span>
                        </button>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white/60 backdrop-blur-3xl p-4 rounded-[2rem] border border-white/40 flex items-center shadow-sm animate-in slide-in-from-bottom-4 duration-700 delay-200">
                    <div className="relative w-full group">
                        <input
                            type="text"
                            placeholder="Filter events by name or venue..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/50 border-none rounded-2xl py-5 pl-14 pr-6 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-300"
                        />
                        <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-blue-200 transition-all hover:shadow-md group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </div>
                            <span className="text-xs font-black text-blue-500 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Total Events</p>
                        <p className="text-4xl font-black text-gray-900">{stats.totalEvents}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-indigo-200 transition-all hover:shadow-md group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                            </div>
                            <span className="text-xs font-black text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">Growth</span>
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">Total Registrations</p>
                        <p className="text-4xl font-black text-indigo-600">{stats.totalRegistrations}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-emerald-200 transition-all hover:shadow-md group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                            </div>
                            <span className="text-xs font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">Secure</span>
                        </div>
                        <p className="text-sm font-black text-gray-400 uppercase tracking-widest mb-1">System Status</p>
                        <div className="flex items-center">
                            <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-status-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
                            <p className="text-lg font-black text-gray-900">HEALTHY</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <div className="p-8 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <h2 className="text-2xl font-black text-gray-900 tracking-tight">Event Management</h2>
                        <div className="relative w-full md:w-96 group">
                            <input
                                type="text"
                                placeholder="Search events or venues..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all group-hover:bg-gray-100"
                            />
                            <svg className="w-5 h-5 absolute left-4 top-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-widest border-b border-gray-100">
                                <tr>
                                    <th className="px-8 py-5">Event Details</th>
                                    <th className="px-8 py-5">Venue</th>
                                    <th className="px-8 py-5">Schedule</th>
                                    <th className="px-8 py-5">Participants</th>
                                    <th className="px-8 py-5">Status</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="6" className="text-center py-20">
                                        <div className="flex flex-col items-center">
                                            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Loading Records...</p>
                                        </div>
                                    </td></tr>
                                ) : filteredEvents.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-20">
                                        <div className="flex flex-col items-center">
                                            <div className="bg-gray-50 p-4 rounded-full mb-4">
                                                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                            </div>
                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No matching events found</p>
                                        </div>
                                    </td></tr>
                                ) : (
                                    filteredEvents.map((event) => (
                                        <tr key={event._id} className="hover:bg-blue-50/30 transition-all group">
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 text-lg group-hover:text-blue-600 transition-colors uppercase tracking-tight">{event.eventName}</span>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">{event.conductedBy}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center text-gray-600 font-bold">
                                                    <svg className="w-4 h-4 mr-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                                                    {event.venue}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-gray-700">{new Date(event.date).toLocaleDateString()}</span>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{event.time || '10:00 AM'}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col space-y-2 w-32">
                                                    <div className="flex justify-between items-end">
                                                        <span className="text-sm font-black text-blue-600">{event.currentEnrollmentCount}</span>
                                                        <span className="text-[10px] font-black text-gray-300">/ {event.studentEnrollmentLimit}</span>
                                                    </div>
                                                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                                            style={{ width: `${Math.min(100, (event.currentEnrollmentCount / event.studentEnrollmentLimit) * 100)}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${event.status === 'open'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50'
                                                    : 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-50'
                                                    }`}>
                                                    {event.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right space-x-3">
                                                <button
                                                    onClick={() => openEditModal(event)}
                                                    className="p-3 bg-gray-50 text-gray-400 hover:bg-blue-600 hover:text-white rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200"
                                                    title="Edit Event"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => deleteEvent(event._id)}
                                                    className="p-3 bg-gray-50 text-gray-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all hover:shadow-lg hover:shadow-rose-200"
                                                    title="Delete Event"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <EventForm
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSubmit={handleCreateOrUpdate}
                    initialData={selectedEvent}
                    organizers={organizers}
                />
            </div>
        </div>
    );
};

export default AdminDashboard;

