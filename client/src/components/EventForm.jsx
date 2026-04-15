import React, { useState, useEffect } from 'react';

const EventForm = ({ isOpen, onClose, onSubmit, initialData = null, organizers = [] }) => {
    const [formData, setFormData] = useState({
        eventName: '',
        description: '',
        image: '',
        venue: '',
        date: '',
        time: '',
        rules: '',
        fees: 0,
        studentEnrollmentLimit: 0,
        conductedBy: '',
        prizes: '',
        organizerId: '',
        status: 'open'
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                ...initialData,
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : ''
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'fees' || name === 'studentEnrollmentLimit' ? Number(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-500 overflow-hidden">
            {/* Background Aurora Blobs for Modal Depth */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[20%] left-[20%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[20%] w-[40%] h-[40%] bg-indigo-400 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="relative z-10 bg-white/70 backdrop-blur-3xl rounded-[3rem] border border-white/40 shadow-[0_32px_128px_rgba(0,0,0,0.15)] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-8 duration-700">
                <div className="p-8 border-b border-white/20 flex items-center justify-between sticky top-0 z-10 bg-transparent">
                    <div className="animate-in slide-in-from-left-4 duration-700">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight uppercase leading-none">{initialData ? 'Edit Event' : 'Create New Event'}</h2>
                        <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em] mt-2 animate-status-pulse">Enter details for the college event</p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-white/50 hover:bg-white rounded-2xl transition-all active:scale-90 border border-white/40 shadow-sm group">
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 overflow-y-scroll space-y-8 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        <div className="md:col-span-2 animate-in slide-in-from-bottom-2 duration-700 delay-100">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Event Name</label>
                            <input
                                name="eventName"
                                value={formData.eventName}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                placeholder="e.g. Annual Tech Symposium"
                            />
                        </div>

                        <div className="md:col-span-2 animate-in slide-in-from-bottom-2 duration-700 delay-150">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Full Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm resize-none"
                                placeholder="Describe the event, objectives, and highlights..."
                            />
                        </div>

                        <div className="animate-in slide-in-from-left-2 duration-700 delay-200">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Venue</label>
                            <input
                                name="venue"
                                value={formData.venue}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                placeholder="e.g. Main Auditorium"
                            />
                        </div>

                        <div className="animate-in slide-in-from-right-2 duration-700 delay-200">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Organizing Department</label>
                            <input
                                name="conductedBy"
                                value={formData.conductedBy}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                placeholder="e.g. CSE Department"
                            />
                        </div>

                        <div className="animate-in slide-in-from-left-2 duration-700 delay-300">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Event Date</label>
                            <input
                                name="date"
                                type="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 shadow-sm"
                            />
                        </div>

                        <div className="animate-in slide-in-from-right-2 duration-700 delay-300">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Start Time</label>
                            <input
                                name="time"
                                type="text"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                placeholder="e.g. 10:00 AM"
                            />
                        </div>

                        <div className="animate-in slide-in-from-left-2 duration-700 delay-400">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Enrollment Limit</label>
                            <input
                                name="studentEnrollmentLimit"
                                type="number"
                                value={formData.studentEnrollmentLimit}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 shadow-sm"
                            />
                        </div>

                        <div className="animate-in slide-in-from-right-2 duration-700 delay-400">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Registration Fee (₹)</label>
                            <input
                                name="fees"
                                type="number"
                                value={formData.fees}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 shadow-sm"
                            />
                        </div>

                        <div className="md:col-span-2 animate-in slide-in-from-bottom-2 duration-700 delay-500">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Assign Organizer</label>
                            <select
                                name="organizerId"
                                value={formData.organizerId}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 shadow-sm appearance-none"
                            >
                                <option value="">Select an Organizer</option>
                                {organizers.map(org => (
                                    <option key={org._id} value={org._id}>{org.name} ({org.email})</option>
                                ))}
                            </select>
                        </div>

                        <div className="md:col-span-2 animate-in slide-in-from-bottom-2 duration-700 delay-600">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Event Image URL</label>
                            <input
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                required
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                placeholder="https://unsplash.com/..."
                            />
                        </div>

                        <div className="md:col-span-2 animate-in slide-in-from-bottom-2 duration-700 delay-700">
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-3 ml-1">Rules (Comma separated)</label>
                            <input
                                name="rules"
                                value={formData.rules}
                                onChange={handleChange}
                                className="w-full px-6 py-4 bg-white/40 border border-white/60 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-gray-900 placeholder:text-gray-300 shadow-sm"
                                placeholder="e.g. College ID required, No outside food"
                            />
                        </div>
                    </div>

                    <div className="pt-6 sticky bottom-0 bg-transparent animate-in slide-in-from-bottom-4 duration-1000 delay-800">
                        <button
                            type="submit"
                            className="group relative w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-blue-600 transition-all duration-500 shadow-2xl active:scale-95 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-pay-gradient translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <span className="relative z-10">{initialData ? 'Update Event Details' : 'Create Event Now'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EventForm;
