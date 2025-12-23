import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const AlertModal = ({ isOpen, onClose, title = "Atención", message, buttonText = "Aceptar" }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6 text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                        <AlertCircle className="h-6 w-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-black text-gray-900 uppercase mb-2">
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm text-gray-500">
                            {message}
                        </p>
                    </div>
                </div>
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <button
                        type="button"
                        className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2 bg-black text-base font-bold text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:text-sm uppercase transition-colors"
                        onClick={onClose}
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlertModal;
