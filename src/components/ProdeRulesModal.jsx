import React from 'react';
import { X, HelpCircle, Trophy, CheckCircle, Clock } from 'lucide-react';

const ProdeRulesModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 bg-club-blue text-white flex justify-between items-center shadow-md z-10 bg-blue-600">
                    <h3 className="text-lg font-black uppercase flex items-center gap-2">
                        <HelpCircle className="h-6 w-6" /> Cómo Jugar
                    </h3>
                    <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto custom-scrollbar">
                    
                    {/* Sección Sistema de Puntas */}
                    <div className="mb-6">
                        <h4 className="text-club-dark font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2">
                            <Trophy className="text-yellow-500" size={20} /> Sistema de Puntos
                        </h4>
                        
                        <div className="space-y-4">
                            <div className="flex gap-4 p-3 bg-green-50 rounded-lg border border-green-100">
                                <div className="text-3xl font-black text-green-600 w-12 text-center">3</div>
                                <div>
                                    <div className="font-bold text-gray-800">Puntos (Pleno)</div>
                                    <p className="text-sm text-gray-600">Acertando el resultado exacto.</p>
                                    <div className="mt-1 text-xs text-gray-500 bg-white p-2 rounded border border-gray-100 inline-block">
                                        Tu pronóstico: <b>2-1</b> | Resultado Real: <b>2-1</b>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
                                <div className="text-3xl font-black text-blue-600 w-12 text-center">1</div>
                                <div>
                                    <div className="font-bold text-gray-800">Punto (Tendencia)</div>
                                    <p className="text-sm text-gray-600">Acertando quién gana o el empate, pero no el resultado exacto.</p>
                                    <div className="mt-1 text-xs text-gray-500 bg-white p-2 rounded border border-gray-100 inline-block">
                                        Tu pronóstico: <b>2-0</b> | Resultado Real: <b>3-1</b>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-3xl font-black text-gray-400 w-12 text-center">0</div>
                                <div>
                                    <div className="font-bold text-gray-800">Puntos</div>
                                    <p className="text-sm text-gray-600">No acertando nada.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Reglas Importantes */}
                    <div>
                        <h4 className="text-club-dark font-bold text-lg mb-4 flex items-center gap-2 border-b pb-2">
                             Reglas Importantes
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <Clock className="text-orange-500 mt-1 flex-shrink-0" size={18} />
                                <span className="text-sm text-gray-600">
                                    Podés cargar o modificar tu pronóstico hasta <b>1 hora antes</b> del comienzo del partido.
                                </span>
                            </li>
                             <li className="flex items-start gap-3">
                                <CheckCircle className="text-club-blue mt-1 flex-shrink-0" size={18} />
                                <span className="text-sm text-gray-600">
                                    Los puntos se actualizan automáticamente al finalizar la fecha.
                                </span>
                            </li>
                        </ul>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-6 py-2 bg-black text-white rounded-lg font-bold uppercase text-sm hover:bg-gray-800 transition-colors shadow-lg"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProdeRulesModal;
