import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const ParticipantModal = ({ isOpen, onClose, eventId, eventName }) => {
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchParticipants = async () => {
        try {
            setLoading(true);
            const { data } = await api.get(`/registrations/event/${eventId}`);
            setParticipants(data);
        } catch (error) {
            console.error('Error fetching participants:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen && eventId) {
            fetchParticipants();
        }
    }, [isOpen, eventId]);

    const markAttendance = async (regId) => {
        try {
            await api.patch(`/registrations/${regId}/attendance`);
            // Update local state
            setParticipants(prev => prev.map(p => p._id === regId ? { ...p, status: 'attended' } : p));
        } catch (error) {
            alert('Failed to mark attendance');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500 overflow-hidden">
            {/* Background Aurora Blobs for Modal Depth */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[10%] right-[10%] w-[50%] h-[50%] bg-blue-500 rounded-full blur-[140px] animate-pulse"></div>
                <div className="absolute bottom-[10%] left-[10%] w-[50%] h-[50%] bg-indigo-500 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '3s' }}></div>
            </div>

            <div className="relative z-10 bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white/40 shadow-[0_32px_128px_rgba(0,0,0,0.15)] w-full max-w-5xl max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-700">
                <div className="p-8 border-b border-white/20 flex items-center justify-between sticky top-0 z-10 bg-transparent">
                    <div className="animate-in slide-in-from-left-4 duration-700">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">Participants List</h2>
                        <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mt-2 animate-status-pulse">{eventName}</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/50 hover:bg-white rounded-2xl transition-all active:scale-90 border border-white/40 shadow-sm group">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar relative min-h-0">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-32 space-y-6">
                            <div className="relative">
                                <div className="w-16 h-16 rounded-full border-4 border-blue-50 animate-spin border-t-blue-600"></div>
                                <div className="absolute inset-0 w-16 h-16 rounded-full bg-blue-600/10 animate-ping"></div>
                            </div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] animate-pulse">Synchronizing Records</p>
                        </div>
                    ) : participants.length === 0 ? (
                        <div className="text-center py-32 animate-in zoom-in-95 duration-700">
                            <div className="w-24 h-24 bg-gray-50/50 rounded-full flex items-center justify-center mx-auto mb-8 border border-white/40">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-2">No Registrations Yet</h3>
                            <p className="text-gray-400 font-bold text-sm tracking-wide">Join the experience to see participants here.</p>
                        </div>
                    ) : (
                        <>
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/40 backdrop-blur-xl sticky top-0 z-20 border-b border-white/20">
                                    <tr>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Student Info</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Contact</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Dept</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Payment</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Status</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/20">
                                    {participants.map((reg, index) => (
                                        <tr
                                            key={reg._id}
                                            className="hover:bg-white/60 backdrop-blur-sm hover:backdrop-blur-xl hover:scale-[1.01] hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4 relative z-0 hover:z-10"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <td className="px-6 py-5">
                                                <p className="font-black text-gray-900 text-base group-hover:text-blue-600 transition-colors uppercase tracking-tight">{reg.studentId?.name}</p>
                                                <p className="text-[10px] text-gray-400 font-black font-mono uppercase tracking-widest mt-1 opacity-70">RegID: #{reg._id.slice(-8).toUpperCase()}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-bold text-gray-700 tracking-tight">{reg.studentId?.email}</p>
                                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">{reg.studentId?.phoneNumber}</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-[10px] font-black text-gray-500 italic uppercase tracking-widest bg-gray-50/50 px-2.5 py-1.5 rounded-lg border border-white/20 shadow-inner">
                                                    {reg.studentId?.department || 'GEN'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col space-y-1">
                                                    <span className={`px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-[0.1em] w-fit shadow-sm border ${reg.paymentStatus === 'paid'
                                                        ? 'bg-emerald-500 text-white border-emerald-400 shadow-emerald-200'
                                                        : 'bg-rose-500 text-white border-rose-400 shadow-rose-200'
                                                        }`}>
                                                        {reg.paymentStatus || 'unknown'}
                                                    </span>
                                                    <p className="text-[8px] text-gray-400 font-black font-mono tracking-widest uppercase opacity-60">TXN: {reg.transactionId?.slice(0, 8)}...</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border shadow-sm ${reg.status === 'attended'
                                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                    : 'bg-blue-50 text-blue-600 border-blue-100'
                                                    }`}>
                                                    {reg.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {reg.status !== 'attended' && (
                                                    <button
                                                        onClick={() => markAttendance(reg._id)}
                                                        className="group/btn relative bg-gray-900 text-white px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-xl hover:shadow-blue-200 hover:-translate-y-0.5 transition-all active:scale-95 overflow-hidden"
                                                    >
                                                        <div className="absolute inset-0 bg-blue-600 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500"></div>
                                                        <span className="relative z-10 whitespace-nowrap">Mark Present</span>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ParticipantModal;
