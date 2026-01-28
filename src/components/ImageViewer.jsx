import React from 'react';
import { X, Download } from 'lucide-react';

const ImageViewer = ({ imageUrl, onClose }) => {
    if (!imageUrl) return null;

    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            // Extract filename or default
            const filename = imageUrl.split('/').pop() || 'download.jpg';
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading image:', error);
            // Fallback
            window.open(imageUrl, '_blank');
        }
    };

    return (
        <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-4">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors bg-white/10 p-2 rounded-full"
            >
                <X size={32} />
            </button>

            <div className="relative max-w-full max-h-screen">
                 <img 
                    src={imageUrl} 
                    alt="Full View" 
                    className="max-h-[85vh] max-w-full object-contain mx-auto rounded-lg shadow-2xl"
                />
                
                <div className="absolute bottom-[-60px] left-1/2 transform -translate-x-1/2">
                     <button 
                        onClick={handleDownload}
                        className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors shadow-lg"
                    >
                        <Download size={20} /> Descargar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageViewer;
