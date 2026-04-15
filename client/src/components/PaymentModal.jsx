import React, { useState, useEffect } from 'react';

const PaymentModal = ({ isOpen, onClose, onPaymentSuccess, eventDetails }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState(1); // 1: QR Code, 2: Processing, 3: Success

    useEffect(() => {
        if (!isOpen) {
            setStep(1);
            setIsProcessing(false);
        }
    }, [isOpen]);

    const handleSimulatePayment = () => {
        setStep(2);
        setIsProcessing(true);

        // Simulate a delay for payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setStep(3);

            // Wait a bit on success screen before closing and triggering callback
            setTimeout(() => {
                const simulatedTxnId = `TXN${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                onPaymentSuccess({ paymentStatus: 'paid', transactionId: simulatedTxnId });
                onClose();
            }, 2000);
        }, 3000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="p-6 pb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5 pointer-events-none"></div>
                    <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 animate-shield-pulse">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-7.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900 tracking-tighter uppercase">Secure Payment</h2>
                                <p className="text-[9px] font-black text-blue-600 uppercase tracking-[0.2em] opacity-70">Authenticated Transaction</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-all active:scale-90">
                            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 pt-2">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[2rem] text-center shadow-lg shadow-blue-200">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                <p className="relative z-10 text-[9px] font-black text-white/60 uppercase tracking-[0.3em] mb-1">Total Amount</p>
                                <p className="relative z-10 text-5xl font-black text-white italic tracking-tighter">₹{eventDetails?.fees}</p>
                            </div>

                            <div className="relative p-1.5 bg-white rounded-[2.5rem] border border-gray-100 shadow-inner group">
                                <div className="flex flex-col items-center py-5 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200 relative overflow-hidden">
                                    {/* Scan Line Animation */}
                                    <div className="absolute inset-0 pointer-events-none z-10">
                                        <div className="w-full h-[2px] bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.8)] absolute animate-scan"></div>
                                    </div>

                                    <div className="bg-white p-4 rounded-2xl shadow-xl mb-4 relative z-20 transform group-hover:scale-105 transition-transform duration-500 border border-gray-100">
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=9573894159@paytm%26pn=CollegeEventRegistration%26am=${eventDetails?.fees}%26cu=INR`}
                                            alt="UPI QR Code"
                                            className="w-36 h-36 rounded-lg mix-blend-multiply"
                                        />
                                    </div>

                                    <div className="flex items-center gap-6 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg" alt="UPI" className="h-5" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Pay_Logo.svg" alt="GPay" className="h-5" />
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/7/71/PhonePe_Logo.svg" alt="PhonePe" className="h-5" />
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleSimulatePayment}
                                className="w-full relative overflow-hidden bg-gray-900 text-white py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all group"
                            >
                                <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                                <span className="relative flex items-center justify-center space-x-3">
                                    <span>Payment Done</span>
                                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="py-10 flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in-95 duration-700">
                            <div className="relative">
                                <div className="w-24 h-24 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-16 h-16 bg-blue-600/10 rounded-full flex items-center justify-center animate-pulse">
                                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-1">Syncing Status</h3>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest">Verifying transaction with secure node...</p>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="py-10 flex flex-col items-center justify-center space-y-6 animate-in zoom-in duration-700">
                            <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center shadow-xl shadow-emerald-100 border border-emerald-100 relative group">
                                <div className="absolute inset-0 bg-emerald-400/20 rounded-[2rem] animate-ping scale-75 opacity-20"></div>
                                <svg className="w-12 h-12 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-1">Success!</h3>
                                <p className="text-gray-400 text-[9px] font-black uppercase tracking-widest leading-relaxed">
                                    Entry Pass Reserved for <br />
                                    <span className="text-emerald-600">{eventDetails?.eventName}</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 pt-0 flex items-center justify-center space-x-3 grayscale opacity-30">
                    <div className="h-[1px] w-6 bg-gray-300"></div>
                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-[0.4em]">
                        SSL v3 End-to-End Encryption
                    </p>
                    <div className="h-[1px] w-6 bg-gray-300"></div>
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
