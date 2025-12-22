import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const SponsorList = ({ location = 'footer', className = '' }) => {
    const [sponsors, setSponsors] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth >= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/sponsors`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    const filtered = data.filter(s => s.ubicacion === location);
                    setSponsors(filtered);
                } else {
                    console.error('Data is not an array:', data);
                    setSponsors([]);
                }
            })
            .catch(err => console.error('Error fetching sponsors:', err));
    }, [location]);

    const handleSponsorClick = async (id) => {
        try {
            await fetch(`${API_URL}/sponsors/${id}/click`, { method: 'POST' });
        } catch (err) {
            console.error('Error tracking click:', err);
        }
    };

    // Carousel Auto-slide logic
    useEffect(() => {
        if (sponsors.length === 0 || location === 'footer') return;

        // Desktop: show 3, Mobile: show 1
        // We move 1 item at a time for smooth scrolling
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % sponsors.length);
        }, 3000); // 3 seconds

        return () => clearInterval(interval);
    }, [sponsors.length, location]);

    const nextSlide = () => {
        setCurrentIndex(prev => (prev + 1) % sponsors.length);
    };

    const prevSlide = () => {
        setCurrentIndex(prev => (prev - 1 + sponsors.length) % sponsors.length);
    };

    if (sponsors.length === 0) return null;

    if (location === 'footer') {
        return (
            <div className={`py-8 bg-gray-50 border-t border-b overflow-hidden ${className}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 text-center">Nuestros Sponsors Institucionales</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        {sponsors.map(sponsor => (
                            <a 
                                key={sponsor.id} 
                                href={sponsor.link || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={() => handleSponsorClick(sponsor.id)}
                                className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-500"
                            >
                                <img 
                                    src={`${API_URL}${sponsor.imagen_url}`} 
                                    alt={sponsor.nombre} 
                                    className="h-8 md:h-12 w-auto object-contain"
                                />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (location === 'home' || location === 'prode') {
        const visibleItems = 3; // For Desktop logic mainly
        
        return (
            <div className={`my-8 relative group ${className}`}>
                 {/* Carousel Container */}
                <div className="overflow-hidden w-full relative">
                    <div 
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{ 
                            // Mobile: 100% width per item, translate 100% per index
                            // Desktop: 33.33% width per item, translate 33.33% per index
                            // We use a CSS variable or media query logic implicitly via tailwind classes if possible, 
                            // but for transform we need specific calculations.
                            // Let's rely on standard Tailwind Responsive values implies we might need JS matchMedia or just accept standard behavior.
                            // Simple approach: Always translate by percentage * index.
                            // To handle responsive 'width' cleanly in transform:
                            // We will simply render items with strictly defined widths: w-full (mobile) vs w-1/3 (desktop).
                            // And the translateX will be -100% * currentIndex (mobile) or -33.33% * currentIndex (desktop).
                            transform: `translateX(-${currentIndex * (isDesktop ? 33.33 : 100)}%)` 
                        }}
                    >
                         {/* 
                            NOTE: For a true infinite loop we'd need duplicated items. 
                            For simple carousel we just slide to end and jump back.
                         */}
                        {sponsors.map(sponsor => (
                            <div 
                                key={sponsor.id} 
                                className="w-full md:w-1/3 flex-shrink-0 px-2"
                            >
                                <a 
                                    href={sponsor.link || '#'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => handleSponsorClick(sponsor.id)}
                                    className="block relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="aspect-[21/9] md:aspect-[21/9] overflow-hidden">
                                        <img 
                                            src={`${API_URL}${sponsor.imagen_url}`} 
                                            alt={sponsor.nombre} 
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/10 backdrop-blur-sm text-[8px] font-black uppercase px-2 py-0.5 rounded-full text-white/50">
                                        Publicidad
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Controls - Hidden on mobile usually, or small overlays */}
                {sponsors.length > 1 && (
                    <>
                        <button 
                            onClick={prevSlide}
                            className="absolute left-0 top-1/2 -translate-y-1/2 -ml-3 md:ml-0 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button 
                            onClick={nextSlide}
                            className="absolute right-0 top-1/2 -translate-y-1/2 -mr-3 md:mr-0 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        );
    }

    return null;
};

export default SponsorList;
