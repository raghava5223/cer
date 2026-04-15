import React, { useState } from 'react';
import api from '../api/axios';

const QRScannerModal = ({ isOpen, onClose, onAttendanceMarked, eventId, eventName }) => {
    const [scanId, setScanId] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSimulateScan = async (e) => {
        e.preventDefault();
        if (!scanId) return;

        setLoading(true);
        setStatus({ type: '', message: '' });

        const cleanId = scanId.startsWith('#') ? scanId.slice(1) : scanId;

        try {
            const { data } = await api.patch(`/registrations/${cleanId}/attendance?eventId=${eventId}`);
            setStatus({ type: 'success', message: 'Attendance marked successfully!' });
            setScanId('');
            if (onAttendanceMarked) onAttendanceMarked();

            // Auto close after 2 seconds on success
            setTimeout(() => {
                setStatus({ type: '', message: '' });
            }, 2000);
        } catch (error) {
            setStatus({ type: 'error', message: error.response?.data?.message || 'Invalid or unregistered Ticket ID' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="p-8 pb-4 flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">QR Scanner</h2>
                        <p className="text-gray-500 text-sm font-medium italic">Simulating active camera feed...</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="px-8 py-6 flex flex-col items-center">
                    {/* Simulated Scanner UI */}
                    <div className="relative w-64 h-64 bg-gray-900 rounded-3xl overflow-hidden mb-8 shadow-inner border-4 border-gray-800">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-48 h-48 border-2 border-dashed border-blue-500 rounded-2xl animate-pulse"></div>
                        </div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-scan-line shadow-[0_0_15px_rgba(59,130,246,0.8)] opacity-60"></div>
                        <div className="absolute inset-0 bg-blue-500/5"></div>
                    </div>

                    <form onSubmit={handleSimulateScan} className="w-full space-y-4">
                        <div className="text-center">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Manual Entry (Simulation)</p>
                            <input
                                value={scanId}
                                onChange={(e) => setScanId(e.target.value)}
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono font-bold text-center"
                                placeholder="Paste Registration ID here..."
                                disabled={loading}
                            />
                        </div>

                        {status.message && (
                            <div className={`p-4 rounded-2xl text-center text-sm font-bold animate-in slide-in-from-top-2 ${status.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                }`}>
                                {status.message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading || !scanId}
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100"
                        >
                            {loading ? 'Processing...' : 'Verify Ticket'}
                        </button>
                    </form>
                </div>

                <div className="p-8 pt-2 text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
                        In a production environment, this module <br /> would access the device camera.
                    </p>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes scan-line {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan-line {
                    animation: scan-line 3s linear infinite;
                }
            `}} />
        </div>
    );
};

export default QRScannerModal;
