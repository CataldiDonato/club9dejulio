import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import { Check, X, User, Search, Download, Key, Calendar } from 'lucide-react';
import { API_URL } from '../config';
import { getImageUrl } from '../utils/imageUtils';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState({ isOpen: false, type: null, userId: null, userName: null });
    const [passwordModal, setPasswordModal] = useState({ isOpen: false, userId: null, userName: null, newPassword: '' });
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.status === 401 || res.status === 403) {
                 window.location.href = '/socios';
                 return;
            }
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
            setError('Error al cargar usuarios');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAction = async () => {
        const { type, userId } = modal;
        const token = localStorage.getItem('token');
        
        try {
            if (type === 'APPROVE') {
                const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ status: 'approved' })
                });
                if (res.ok) fetchUsers();
            } else if (type === 'REJECT') {
                // For "Rechazar", we might just want to delete? Or set status 'rejected'? 
                // User requirement: "admin accepts". 
                // Let's assume reject = delete for clean up, or maybe status rejected.
                // Doing status update to 'rejected' for now.
                const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ status: 'rejected' })
                });
                if (res.ok) fetchUsers();
            } else if (type === 'REVOKE') {
                const res = await fetch(`${API_URL}/admin/users/${userId}/status`, {
                    method: 'PUT',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ status: 'pending' })
                });
                if (res.ok) fetchUsers();
            } else if (type === 'DELETE') {
                const res = await fetch(`${API_URL}/admin/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) fetchUsers();
            }
        } catch (err) {
            console.error(err);
            alert('Error');
        } finally {
            setModal({ ...modal, isOpen: false });
        }
    };

    const confirmApprove = (user) => {
        setModal({
            isOpen: true,
            type: 'APPROVE',
            userId: user.id,
            userName: `${user.nombre} ${user.apellido}`,
            title: 'Aprobar Usuario',
            message: `¿Estás seguro de aceptar a ${user.nombre} ${user.apellido}? Podrá acceder a todas las funciones.`
        });
    };

    const confirmReject = (user) => {
        setModal({
            isOpen: true,
            type: 'REJECT',
            userId: user.id,
            userName: `${user.nombre} ${user.apellido}`,
            title: 'Rechazar Usuario',
            message: `¿Rechazar solicitud de ${user.nombre} ${user.apellido}?`,
            isDestructive: true
        });
    };

    const confirmRevoke = (user) => {
        setModal({
            isOpen: true,
            type: 'REVOKE',
            userId: user.id,
            userName: `${user.nombre} ${user.apellido}`,
            title: 'Revocar Aprobación',
            message: `¿Quitar permiso a ${user.nombre} ${user.apellido}? Volverá a estado Pendiente.`,
            isDestructive: true
        });
    };

    const confirmDelete = (user) => {
        setModal({
            isOpen: true,
            type: 'DELETE',
            userId: user.id,
            userName: `${user.nombre} ${user.apellido}`,
            title: 'Eliminar Usuario',
            message: `¿ELIMINAR DEFINITIVAMENTE a ${user.nombre} ${user.apellido}? Esta acción no se puede deshacer.`,
            isDestructive: true
        });
    };

    const [editingNroSocio, setEditingNroSocio] = useState({ userId: null, value: '' });

    const handleUpdateNroSocio = async (userId) => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/nro_socio`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ nro_socio: editingNroSocio.value })
            });

            const data = await res.json();
            if (res.ok) {
                setEditingNroSocio({ userId: null, value: '' });
                fetchUsers();
            } else {
                alert(data.error || 'Error al actualizar');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión');
        }
    };
    
    const openPasswordModal = (user) => {
        setPasswordModal({
            isOpen: true,
            userId: user.id,
            userName: `${user.nombre} ${user.apellido}`,
            newPassword: ''
        });
    };

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        const { userId, newPassword } = passwordModal;
        
        if (!newPassword || newPassword.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/password`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ newPassword })
            });
            const data = await res.json();
            
            if (res.ok) {
                alert(`Contraseña actualizada correctamente para ${passwordModal.userName}`);
                setPasswordModal({ isOpen: false, userId: null, userName: null, newPassword: '' });
            } else {
                alert(data.error || 'Error al restablecer contraseña');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión');
        }
    };

    const exportToCSV = () => {
        if (users.length === 0) return;

        const headers = ["Nombre", "Apellido", "DNI", "Nro Socio", "Email", "Telefono", "Estado", "Rol"];
        const rows = users.map(u => [
            u.nombre,
            u.apellido,
            u.dni,
            u.nro_socio || 'N/A',
            u.email || '',
            u.telefono || '',
            u.account_status,
            u.rol
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map(r => r.map(val => `"${val}"`).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `socios_club_9_de_julio_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Filter pending vs others + Search
    const filteredUsers = users.filter(u => {
        const searchLower = searchTerm.toLowerCase();
        const fullName = `${u.nombre} ${u.apellido}`.toLowerCase();
        const nroSocio = (u.nro_socio || '').toLowerCase();
        const dni = (u.dni || '').toLowerCase();
        
        return fullName.includes(searchLower) || 
               nroSocio.includes(searchLower) || 
               dni.includes(searchLower);
    });

    const pendingUsers = filteredUsers.filter(u => u.account_status === 'pending');
    const otherUsers = filteredUsers.filter(u => u.account_status !== 'pending');

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <ConfirmationModal 
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                onConfirm={handleAction}
                title={modal.title}
                message={modal.message}
                isDestructive={modal.isDestructive}
                confirmText={modal.type === 'APPROVE' ? 'Aprobar' : (modal.type === 'REVOKE' ? 'Revocar' : (modal.type === 'DELETE' ? 'Eliminar' : 'Rechazar'))}
                cancelText="Cancelar"
            />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h1 className="text-3xl font-black uppercase">Administración de Socios</h1>
                <div className="flex gap-2 w-full md:w-auto">
                    <button 
                        onClick={exportToCSV}
                        className="flex-1 md:flex-none bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition-colors uppercase text-sm"
                    >
                        Exportar Lista
                    </button>
                    <button onClick={() => window.location.href='/socios'} className="flex-1 md:flex-none bg-gray-200 px-4 py-2 rounded font-bold hover:bg-gray-300 uppercase text-sm">Volver</button>
                </div>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <div className="mb-8 relative">
                <input 
                    type="text" 
                    placeholder="Buscar por nombre, apellido, DNI o número de socio..." 
                    className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-gray-200 focus:border-black outline-none transition-colors shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute right-3 top-3.5 text-gray-400">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                </div>
            ) : (
                <div className="space-y-12">
                     {/* Pending Section */}
                     <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600 uppercase tracking-tighter">
                             Solicitudes Pendientes ({pendingUsers.length})
                        </h2>
                        {pendingUsers.length === 0 ? (
                            <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-xl text-center">
                                <p className="text-gray-500 italic">No hay solicitudes que coincidan con la búsqueda.</p>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 uppercase text-[10px] font-black tracking-widest text-gray-500">
                                            <tr>
                                                <th className="px-6 py-4 text-left">Usuario</th>
                                                <th className="px-6 py-4 text-left">Nacimiento</th>
                                                <th className="px-6 py-4 text-left">DNI</th>
                                                <th className="px-6 py-4 text-left">Nro Socio</th>
                                                <th className="px-6 py-4 text-left">Contacto</th>
                                                <th className="px-6 py-4 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {pendingUsers.map(user => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            {user.foto_perfil ? (
                                                                <img 
                                                                    src={getImageUrl(user.foto_perfil)} 
                                                                    loading="lazy"
                                                                    className="w-10 h-10 rounded-full object-cover border shadow-sm" 
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border"><User size={20} /></div>
                                                            )}
                                                            <div className="text-sm font-bold text-gray-900">{user.nombre} {user.apellido}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dni}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {editingNroSocio.userId === user.id ? (
                                                            <div className="flex items-center gap-1">
                                                                <input 
                                                                    type="text" 
                                                                    className="border rounded px-2 w-24 py-1 text-sm outline-none focus:border-black" 
                                                                    value={editingNroSocio.value} 
                                                                    onChange={e => setEditingNroSocio({...editingNroSocio, value: e.target.value})}
                                                                    placeholder="Número"
                                                                    autoFocus
                                                                />
                                                                <button onClick={() => handleUpdateNroSocio(user.id)} className="bg-black text-white px-2 py-1 rounded text-xs font-bold transition-colors">OK</button>
                                                                <button onClick={() => setEditingNroSocio({ userId: null, value: '' })} className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold transition-colors">X</button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 group">
                                                                <span className="font-bold text-gray-900">{user.nro_socio || 'N/A'}</span>
                                                                <button 
                                                                    onClick={() => setEditingNroSocio({ userId: user.id, value: user.nro_socio || '' })}
                                                                    className="opacity-0 group-hover:opacity-100 text-black text-[10px] font-black hover:underline transition-opacity"
                                                                >
                                                                    ASIGNAR
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <div>{user.email || '-'}</div>
                                                        <div className="text-[10px] uppercase font-bold text-gray-400">{user.telefono || '-'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => confirmApprove(user)} className="bg-green-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-green-700 transition-colors flex items-center gap-1">
                                                                <Check size={14} /> Aprobar
                                                            </button>
                                                            <button onClick={() => confirmReject(user)} className="text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-3 py-1 text-[10px] font-black uppercase transition-colors flex items-center gap-1">
                                                                <X size={14} /> Rechazar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                     </div>

                     {/* Approved List */}
                     <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-800 border-t pt-8 uppercase tracking-tighter">
                            Usuarios Activos ({otherUsers.length})
                        </h2>
                        {otherUsers.length === 0 ? (
                             <div className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-xl text-center">
                                <p className="text-gray-500 italic">No hay usuarios activos que coincidan con la búsqueda.</p>
                             </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50 uppercase text-[10px] font-black tracking-widest text-gray-500">
                                            <tr>
                                                <th className="px-6 py-4 text-left">Usuario</th>
                                                <th className="px-6 py-4 text-left">Nacimiento</th>
                                                <th className="px-6 py-4 text-left">DNI</th>
                                                <th className="px-6 py-4 text-left">Nro Socio</th>
                                                <th className="px-6 py-4 text-left">Estado</th>
                                                <th className="px-6 py-4 text-left">Rol</th>
                                                <th className="px-6 py-4 text-right">Acciones</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {otherUsers.map(user => (
                                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center gap-3">
                                                            {user.foto_perfil ? (
                                                                <img 
                                                                    src={getImageUrl(user.foto_perfil)} 
                                                                    loading="lazy"
                                                                    className="w-10 h-10 rounded-full object-cover border shadow-sm" 
                                                                />
                                                            ) : (
                                                                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 border"><User size={20} /></div>
                                                            )}
                                                            <div className="text-sm font-bold text-gray-900">{user.nombre} {user.apellido}</div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dni}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {editingNroSocio.userId === user.id ? (
                                                            <div className="flex items-center gap-1">
                                                                <input 
                                                                    type="text" 
                                                                    className="border rounded px-2 w-24 py-1 text-sm outline-none focus:border-black" 
                                                                    value={editingNroSocio.value} 
                                                                    onChange={e => setEditingNroSocio({...editingNroSocio, value: e.target.value})}
                                                                    placeholder="Número"
                                                                    autoFocus
                                                                />
                                                                <button onClick={() => handleUpdateNroSocio(user.id)} className="bg-black text-white px-2 py-1 rounded text-xs font-bold transition-colors">OK</button>
                                                                <button onClick={() => setEditingNroSocio({ userId: null, value: '' })} className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold transition-colors">X</button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center gap-2 group">
                                                                <span className="font-bold text-gray-900">{user.nro_socio || 'N/A'}</span>
                                                                <button 
                                                                    onClick={() => setEditingNroSocio({ userId: user.id, value: user.nro_socio || '' })}
                                                                    className="opacity-0 group-hover:opacity-100 text-black text-[10px] font-black hover:underline transition-opacity"
                                                                >
                                                                    EDITAR
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-[10px] leading-5 font-black uppercase rounded-full border ${
                                                            user.account_status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                                                        }`}>
                                                            {user.account_status === 'approved' ? 'ACTIVO' : user.account_status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-500 uppercase">{user.rol}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {user.rol !== 'admin' && ( 
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => openPasswordModal(user)} className="text-gray-600 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1 text-[10px] font-black uppercase transition-colors flex items-center gap-1">
                                                                    <Key size={14} /> Reset
                                                                </button>
                                                                <button onClick={() => confirmRevoke(user)} className="text-yellow-600 hover:bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-1 text-[10px] font-black uppercase transition-colors">Revocar</button>
                                                                <button onClick={() => confirmDelete(user)} className="text-red-600 hover:bg-red-50 border border-red-200 rounded-lg px-3 py-1 text-[10px] font-black uppercase transition-colors">Eliminar</button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                     </div>
                </div>
            )}

            {/* Modal Reset Password */}
            {passwordModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
                        <h3 className="text-lg font-bold mb-2 uppercase">Restablecer Contraseña</h3>
                        <p className="text-sm text-gray-500 mb-4">Ingresá la nueva contraseña para <b>{passwordModal.userName}</b>.</p>
                        
                        <form onSubmit={handlePasswordReset}>
                            <input 
                                type="text"
                                className="w-full border-2 border-gray-200 rounded-lg p-2 mb-4 focus:border-black outline-none"
                                placeholder="Nueva contraseña"
                                value={passwordModal.newPassword}
                                onChange={(e) => setPasswordModal({...passwordModal, newPassword: e.target.value})}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button 
                                    type="button" 
                                    onClick={() => setPasswordModal({...passwordModal, isOpen: false})}
                                    className="px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-100 rounded-lg"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-4 py-2 bg-black text-white font-bold text-sm hover:bg-gray-800 rounded-lg"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
