import React, { useState, useEffect } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';
import { Check, X, User } from 'lucide-react';
import { API_URL } from '../config';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modal, setModal] = useState({ isOpen: false, type: null, userId: null, userName: null });

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

    // Filter pending vs others
    const pendingUsers = users.filter(u => u.account_status === 'pending');
    const otherUsers = users.filter(u => u.account_status !== 'pending');

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

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black uppercase">Solicitudes de Acceso</h1>
                <button onClick={() => window.location.href='/socios'} className="bg-gray-200 px-4 py-2 rounded font-bold hover:bg-gray-300">Volver</button>
            </div>

            {loading ? <p>Cargando...</p> : (
                <div className="space-y-12">
                     {/* Pending Section */}
                     <div>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-yellow-600">
                             Pendientes ({pendingUsers.length})
                        </h2>
                        {pendingUsers.length === 0 ? <p className="text-gray-500 italic">No hay solicitudes pendientes.</p> : (
                             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pendingUsers.map(user => (
                                    <div key={user.id} className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-400">
                                        <div className="flex items-center gap-4 mb-4">
                                            {user.foto_perfil ? (
                                                <img src={user.foto_perfil} className="w-12 h-12 rounded-full object-cover" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center"><User /></div>
                                            )}
                                            <div>
                                                <h3 className="font-bold text-lg">{user.nombre} {user.apellido}</h3>
                                                <p className="text-sm text-gray-500">DNI: {user.dni}</p>
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1 mb-4">
                                            <p><strong>Email:</strong> {user.email || '-'}</p>
                                            <p><strong>Tel:</strong> {user.telefono || '-'}</p>
                                            <div className="flex items-center gap-2">
                                                <strong>Socio:</strong> 
                                                {editingNroSocio.userId === user.id ? (
                                                    <div className="flex gap-1">
                                                        <input 
                                                            type="text" 
                                                            className="border rounded px-1 w-20 py-0.5 text-xs" 
                                                            value={editingNroSocio.value} 
                                                            onChange={e => setEditingNroSocio({...editingNroSocio, value: e.target.value})}
                                                            placeholder="Nro"
                                                        />
                                                        <button onClick={() => handleUpdateNroSocio(user.id)} className="bg-black text-white px-1.5 py-0.5 rounded text-[10px]">OK</button>
                                                        <button onClick={() => setEditingNroSocio({ userId: null, value: '' })} className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">X</button>
                                                    </div>
                                                ) : (
                                                    <span className="flex items-center gap-1">
                                                        {user.nro_socio || 'N/A'}
                                                        <button 
                                                            onClick={() => setEditingNroSocio({ userId: user.id, value: user.nro_socio || '' })}
                                                            className="text-blue-600 hover:underline text-[10px] ml-2"
                                                        >
                                                            Editar
                                                        </button>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => confirmApprove(user)} className="flex-1 bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700 flex justify-center items-center gap-2">
                                                <Check size={18} /> Aprobar
                                            </button>
                                            <button onClick={() => confirmReject(user)} className="flex-1 bg-red-100 text-red-700 py-2 rounded font-bold hover:bg-red-200 flex justify-center items-center gap-2">
                                                <X size={18} /> Rechazar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        )}
                     </div>

                     {/* Approved List */}
                     <div>
                        <h2 className="text-xl font-bold mb-4 text-gray-800 border-t pt-8">Usuarios Activos</h2>
                        <div className="bg-white rounded-lg shadow overflow-hidden border">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nro Socio</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {otherUsers.map(user => (
                                            <tr key={user.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="text-sm font-medium text-gray-900">{user.nombre} {user.apellido}</div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.dni}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {editingNroSocio.userId === user.id ? (
                                                        <div className="flex items-center gap-1">
                                                            <input 
                                                                type="text" 
                                                                className="border rounded px-2 w-24 py-1 text-sm mr-2" 
                                                                value={editingNroSocio.value} 
                                                                onChange={e => setEditingNroSocio({...editingNroSocio, value: e.target.value})}
                                                                placeholder="Número"
                                                            />
                                                            <button onClick={() => handleUpdateNroSocio(user.id)} className="bg-black text-white px-2 py-1 rounded text-xs font-bold">OK</button>
                                                            <button onClick={() => setEditingNroSocio({ userId: null, value: '' })} className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs font-bold">CANCELAR</button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 group">
                                                            <span>{user.nro_socio || 'N/A'}</span>
                                                            <button 
                                                                onClick={() => setEditingNroSocio({ userId: user.id, value: user.nro_socio || '' })}
                                                                className="opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-bold hover:underline transition-opacity"
                                                            >
                                                                EDITAR
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        user.account_status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {user.account_status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.rol}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {user.rol !== 'admin' && ( // Protect admins from deleting each other easily or logic backend handles self-delete lock
                                                        <div className="flex gap-2">
                                                            <button onClick={() => confirmRevoke(user)} className="text-yellow-600 hover:text-yellow-900 border border-yellow-600 rounded px-2 py-1 text-xs">Revocar</button>
                                                            <button onClick={() => confirmDelete(user)} className="text-red-600 hover:text-red-900 border border-red-600 rounded px-2 py-1 text-xs">Eliminar</button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                     </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
