import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ExternalLink, BarChart3, ToggleLeft, ToggleRight, X, Save, Image as ImageIcon } from 'lucide-react';
import { API_URL } from '../config';

const AdminSponsors = () => {
    const [sponsors, setSponsors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSponsor, setEditingSponsor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        link: '',
        ubicacion: 'footer',
        imagen: null
    });

    const fetchSponsors = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/sponsors`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) {
                console.error('Error fetching sponsors:', res.statusText);
                setSponsors([]);
                return;
            }
            const data = await res.json();
            setSponsors(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSponsors();
    }, []);

    const filteredSponsors = sponsors.filter(s => 
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('link', formData.link);
        data.append('ubicacion', formData.ubicacion);
        if (formData.imagen) {
            data.append('imagen', formData.imagen);
        }

        try {
            const url = editingSponsor 
                ? `${API_URL}/sponsors/${editingSponsor.id}`
                : `${API_URL}/sponsors`;
            const method = editingSponsor ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                fetchSponsors();
                closeModal();
            } else {
                const errorData = await res.json().catch(() => ({ error: res.statusText }));
                alert(`Error: ${errorData.error || 'No se pudo guardar el sponsor'}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const toggleStatus = async (sponsor) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/sponsors/${sponsor.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ activo: !sponsor.activo })
            });
            if (res.ok) fetchSponsors();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteSponsor = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este sponsor?')) return;
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/sponsors/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) fetchSponsors();
        } catch (err) {
            console.error(err);
        }
    };

    const openModal = (sponsor = null) => {
        if (sponsor) {
            setEditingSponsor(sponsor);
            setFormData({
                nombre: sponsor.nombre,
                link: sponsor.link || '',
                ubicacion: sponsor.ubicacion,
                imagen: null
            });
        } else {
            setEditingSponsor(null);
            setFormData({
                nombre: '',
                link: '',
                ubicacion: 'footer',
                imagen: null
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingSponsor(null);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-12">
                <div>
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Publicidad</h1>
                    <p className="text-gray-500 font-medium">Gestioná los sponsors y banners de la plataforma.</p>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => window.location.href='/socios'}
                        className="bg-gray-200 text-black px-6 py-3 rounded-full font-bold hover:bg-gray-300 transition-all uppercase text-sm"
                    >
                        Volver
                    </button>
                    <button 
                        onClick={() => openModal()}
                        className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all flex items-center gap-2 shadow-lg active:scale-95 text-sm uppercase"
                    >
                        <Plus size={20} /> Nuevo Sponsor
                    </button>
                </div>
            </div>

            {/* SEARCH AND FILTERS */}
            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <input 
                        type="text" 
                        placeholder="Buscar sponsor por nombre..."
                        className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-black outline-none transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Plus size={20} className="rotate-45" /> {/* Using Plus as search icon for simplicity here, or just let it be */}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Sponsor</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Ubicación</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Clics</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
                                    <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredSponsors.map(sponsor => (
                                    <tr key={sponsor.id} className={`hover:bg-gray-50/50 transition-colors ${!sponsor.activo ? 'bg-gray-50/30' : ''}`}>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-10 bg-gray-50 rounded-lg border flex items-center justify-center p-1">
                                                    <img src={`${API_URL}${sponsor.imagen_url}`} alt="" className="max-w-full max-h-full object-contain" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{sponsor.nombre}</p>
                                                    {sponsor.link && (
                                                        <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 font-bold hover:underline flex items-center gap-1">
                                                            <ExternalLink size={10} /> VER LINK
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                sponsor.ubicacion === 'home' ? 'bg-blue-100 text-blue-700' :
                                                sponsor.ubicacion === 'prode' ? 'bg-purple-100 text-purple-700' :
                                                'bg-gray-100 text-gray-700'
                                            }`}>
                                                {sponsor.ubicacion}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="inline-flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg">
                                                <BarChart3 size={14} className="text-gray-400" />
                                                <span className="font-black text-sm">{sponsor.clics}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button 
                                                onClick={() => toggleStatus(sponsor)}
                                                className={`flex items-center gap-2 font-black text-[10px] ${sponsor.activo ? 'text-green-600' : 'text-red-500'}`}
                                            >
                                                {sponsor.activo ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                                                {sponsor.activo ? 'ACTIVO' : 'PAUSADO'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openModal(sponsor)}
                                                    className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Save size={16} />
                                                </button>
                                                <button 
                                                    onClick={() => deleteSponsor(sponsor.id)}
                                                    className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredSponsors.length === 0 && (
                            <div className="py-20 text-center text-gray-400 font-medium">
                                No se encontraron sponsors.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* MODAL FORM */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in duration-200">
                        <div className="p-8 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">
                                {editingSponsor ? 'Editar Sponsor' : 'Nuevo Sponsor'}
                            </h2>
                            <button onClick={closeModal} className="text-gray-400 hover:text-black">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-8 space-y-4">
                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-1 tracking-widest">Nombre del Comercio</label>
                                <input 
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black outline-none transition-all font-medium"
                                    value={formData.nombre}
                                    onChange={e => setFormData({...formData, nombre: e.target.value})}
                                    placeholder="Ej: Panadería El Sol"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-1 tracking-widest">Link Destino (Opcional)</label>
                                <input 
                                    type="url"
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black outline-none transition-all font-medium"
                                    value={formData.link}
                                    onChange={e => setFormData({...formData, link: e.target.value})}
                                    placeholder="https://wa.me/..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-1 tracking-widest">Ubicación</label>
                                <select 
                                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-black outline-none transition-all appearance-none font-bold"
                                    value={formData.ubicacion}
                                    onChange={e => setFormData({...formData, ubicacion: e.target.value})}
                                >
                                    <option value="home">Home (Principal)</option>
                                    <option value="prode">Prode (Ranking)</option>
                                    <option value="footer">Footer (Carrusel inferior)</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-black uppercase text-gray-400 mb-1 tracking-widest">Imagen / Banner</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-100 border-dashed rounded-xl hover:border-black transition-all cursor-pointer relative bg-gray-50">
                                    <input 
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={e => setFormData({...formData, imagen: e.target.files[0]})}
                                        required={!editingSponsor}
                                    />
                                    <div className="space-y-1 text-center">
                                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                        <div className="text-sm text-gray-600">
                                            {formData.imagen ? <span className="text-black font-bold">{formData.imagen.name}</span> : 'Subir un archivo'}
                                        </div>
                                        <p className="text-[10px] text-gray-400 italic">PNG, JPG o SVG</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg active:scale-95"
                            >
                                <Save size={20} /> {editingSponsor ? 'GUARDAR CAMBIOS' : 'CREAR SPONSOR'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSponsors;
