import React, { useState, useEffect } from 'react';
import { API_URL } from '../config';

const SponsorList = ({ location = 'footer', className = '' }) => {
    const [sponsors, setSponsors] = useState([]);

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
        // Just show the first active sponsor for that spot, or rotate if we have many
        // For now, let's show a grid if multiple, or a nice banner if one
        return (
            <div className={`my-8 ${className}`}>
                <div className="flex flex-col gap-4">
                    {sponsors.map(sponsor => (
                        <a 
                            key={sponsor.id}
                            href={sponsor.link || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => handleSponsorClick(sponsor.id)}
                            className="group relative block overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1"
                        >
                            <div className="aspect-[21/9] md:aspect-[5/1] overflow-hidden">
                                <img 
                                    src={`${API_URL}${sponsor.imagen_url}`} 
                                    alt={sponsor.nombre} 
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute top-2 right-2 bg-black/10 backdrop-blur-sm text-[8px] font-black uppercase px-2 py-0.5 rounded-full text-white/50">
                                Publicidad
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    return null;
};

export default SponsorList;
