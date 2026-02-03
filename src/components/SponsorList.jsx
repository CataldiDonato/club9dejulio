import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const SponsorList = ({ location = 'footer', className = '', isSidebar = false }) => {
    const [sponsors, setSponsors] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/sponsors`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Filter active sponsors
                    let filtered = data.filter(s => s.activo !== false);

                    if (isSidebar) {
                       // Sidebar still uses specific filtering or just random distinct ones
                       // Let's grab random 5
                       const shuffled = [...filtered].sort(() => 0.5 - Math.random());
                       setSponsors(shuffled.slice(0, 5));
                    } else {
                       // For footer and home carousel, we want ALL sponsors to show support
                       // Just shuffle them so it's not always same order
                       const shuffled = [...filtered].sort(() => 0.5 - Math.random());
                       setSponsors(shuffled);
                    }
                } else {
                    console.error('Data is not an array:', data);
                    setSponsors([]);
                }
            })
            .catch(err => console.error('Error fetching sponsors:', err));
    }, [isSidebar]);

    const handleSponsorClick = async (id) => {
        try {
            await fetch(`${API_URL}/sponsors/${id}/click`, { method: 'POST' });
        } catch (err) {
            console.error('Error tracking click:', err);
        }
    };

    if (sponsors.length === 0) return null;

    // --- SIDEBAR VIEW (Vertical Stack) ---
    if (isSidebar) {
        return (
            <div className={`space-y-4 ${className}`}>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 px-2">Publicidad</p>
                {sponsors.map(sponsor => (
                    <a 
                        key={sponsor.id} 
                        href={sponsor.link || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => handleSponsorClick(sponsor.id)}
                        className="block group relative overflow-hidden rounded-xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-md"
                    >
                        <div className="aspect-[4/3] overflow-hidden bg-white p-4 flex items-center justify-center">
                            <img 
                                src={`${API_URL}${sponsor.imagen_url}`} 
                                alt={sponsor.nombre} 
                                className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <div className="absolute top-2 right-2 bg-black/5 backdrop-blur-sm text-[8px] font-black uppercase px-2 py-0.5 rounded-full text-black/20">
                            Ad
                        </div>
                    </a>
                ))}
            </div>
        );
    }

    // --- MARQUEE VIEW (Footer & Home) ---
    // We duplicate the array to ensure smooth infinity loop visual
    const marqueeSponsors = [...sponsors, ...sponsors, ...sponsors]; // Triple it for safety on wide screens

    return (
        <div className={`w-full overflow-hidden bg-white border-y border-gray-100 py-6 ${className}`}>
            <div className="relative w-full">
                <div 
                    className="flex items-center gap-12 animate-marquee whitespace-nowrap"
                    style={{ animationDuration: `${sponsors.length * 5}s` }} // Adjust speed based on count
                >
                    {marqueeSponsors.map((sponsor, index) => (
                        <a 
                            key={`${sponsor.id}-${index}`} 
                            href={sponsor.link || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => handleSponsorClick(sponsor.id)}
                            className="inline-block flex-shrink-0 group grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                        >
                            <div className="h-16 md:h-20 w-auto px-4 flex items-center justify-center bg-white rounded-lg">
                                <img 
                                    src={`${API_URL}${sponsor.imagen_url}`} 
                                    alt={sponsor.nombre} 
                                    className="h-full w-auto max-w-[200px] object-contain"
                                />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
            {/* Add global style specifically for this animation if needed, or assume tailwind config. 
                Since we can't easily edit tailwind config, we inject style here or rely on standard if available.
                Standard tailwind doesn't have 'animate-marquee'. We'll inject a style tag.
            */}
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); } 
                }
                .animate-marquee {
                    animation: marquee linear infinite;
                }
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default SponsorList;
