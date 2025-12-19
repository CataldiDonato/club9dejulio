import React, { useState, useEffect } from 'react';
import { UserCheck, CreditCard, ShieldCheck, LogOut, Eye, EyeOff } from 'lucide-react';
import { API_URL } from '../config';

const Socios = () => {
  // Estado local
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ dni: '', password: '' });
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${API_URL}/socios`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const data = await response.json();
          if (response.ok) {
            setUserData(data.user);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
            console.error("Session check failed");
        }
      }
    };
    checkSession();
  }, []);

  // Toggle Register Mode
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Extra fields for registration
  const [regData, setRegData] = useState({
    nombre: '',
    apellido: '',
    dni: '',
    nro_socio: '',
    password: '',
    email: '',
    telefono: '',
    foto_perfil: null // File object
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const data = new FormData();
    data.append('nombre', regData.nombre);
    data.append('apellido', regData.apellido);
    data.append('dni', regData.dni);
    data.append('nro_socio', regData.nro_socio);
    data.append('password', regData.password);
    data.append('email', regData.email);
    data.append('telefono', regData.telefono);
    if (regData.foto_perfil) {
        data.append('foto_perfil', regData.foto_perfil);
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        // Headers content-type is set automatically with FormData
        body: data
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        localStorage.setItem('token', resData.token);
        setUserData(resData.user);
        setIsLoggedIn(true);
      } else {
        setError(resData.error || 'Error al registrarse');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión con el servidor.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('token', data.token);
        setUserData(data.user);
        setIsLoggedIn(true);
      } else {
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error(err);
      setError('Error de conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    setFormData({ dni: '', password: '' });
  };

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    telefono: '',
    email: '',
    foto_perfil: null // File object or null
  });

  const openEditModal = () => {
    setEditData({
        telefono: userData.telefono || '',
        email: userData.email || '',
        foto_perfil: null // Reset file input
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const data = new FormData();
    data.append('telefono', editData.telefono);
    data.append('email', editData.email);
    if (editData.foto_perfil) {
       data.append('foto_perfil', editData.foto_perfil);
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/me/update`, {
            method: 'PUT',
            headers: { 
                'Authorization': `Bearer ${token}`
            },
            body: data
        });
        const resData = await response.json();
        if (response.ok && resData.success) {
            setUserData(resData.user);
            setIsEditModalOpen(false);
        } else {
            alert(resData.error || 'Error al actualizar');
        }
    } catch (error) {
        console.error(error);
        alert('Error de conexión');
    } finally {
        setIsLoading(false);
    }
  };

  if (isLoggedIn && userData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 relative">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-black p-6 flex justify-between items-center text-white">
            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
              <ShieldCheck /> Dashboard del Socio
            </h2>
            <div className="flex gap-4">
               {userData.rol === 'admin' && (
                  <>
                    <button onClick={() => window.location.href='/admin/users'} className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors flex items-center gap-2">
                      <UserCheck size={18} /> Solicitudes
                    </button>
                    <button onClick={() => window.location.href='/admin/sports'} className="hidden md:block bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors">
                      Deportes +
                    </button>
                    <button onClick={() => window.location.href='/admin/news'} className="hidden md:block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors">
                      Noticias +
                    </button>
                    <button onClick={() => window.location.href='/admin/prode'} className="hidden lg:block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors">
                      Prode +
                    </button>
                    <button onClick={() => window.location.href='/admin/sponsors'} className="hidden lg:block bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-bold uppercase transition-colors">
                      Publicidad +
                    </button>
                  </>
               )}
              <button  
                onClick={handleLogout}
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-bold uppercase"
              >
                <LogOut size={16} /> <span className="hidden md:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>
          
          {/* Pending Banner */}
          {userData.account_status === 'pending' && (
            <div className="bg-yellow-50 border-b-4 border-yellow-400 p-6 text-center">
                <h3 className="text-xl font-bold text-yellow-800 mb-2">⚠ Cuenta Pendiente de Aprobación</h3>
                <p className="text-yellow-700 max-w-2xl mx-auto">
                    Tu registro fue exitoso, pero un administrador debe aprobar tu cuenta antes de que puedas utilizar todas las funciones (Prode, Reservas, etc).
                    <br/>Podrás navegar por el sitio, pero algunas acciones estarán restringidas.
                </p>
            </div>
          )}
          
          <div className="p-8 grid md:grid-cols-2 gap-8">
            {/* Carnet Digital */}
            <div className="flex flex-col items-center">
              <div className="w-full max-w-sm bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white rounded-xl shadow-2xl overflow-hidden relative aspect-[1.586/1] border-2 border-white/10">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-5 -mb-5"></div>
                
                <div className="p-4 relative z-10 flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-black text-lg tracking-wider uppercase">Club 9 de Julio</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-widest">Berabevú</p>
                    </div>
                    <ShieldCheck className="text-white/80" size={28} />
                  </div>
                  
                  <div className="text-center my-1">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto border-4 border-white/20 mb-2 overflow-hidden flex items-center justify-center relative">
                       {userData.foto_perfil ? (
                           <img src={userData.foto_perfil} alt="Perfil" className="w-full h-full object-cover" />
                       ) : (
                           <UserCheck size={32} className="text-gray-400" />
                       )}
                    </div>
                    <p className="font-bold text-lg uppercase leading-tight">{userData.nombre} {userData.apellido}</p>
                    <p className="text-xs text-gray-300">{userData.tipo_socio}</p>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] uppercase text-gray-400 mb-1">Nº Socio</p>
                      <p className="font-mono text-lg text-white font-bold leading-none">{userData.nro_socio || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-500">Tu carnet digital es válido para ingresar al club.</p>
            </div>

            {/* Estado de Cuenta */}
            <div className="flex flex-col justify-center space-y-6">
              <div className={`border rounded-xl p-6 ${userData.estado_cuota === 'Al Día' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-4 mb-2">
                  <div className={`p-3 rounded-full ${userData.estado_cuota === 'Al Día' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    <CreditCard size={24} />
                  </div>
                  <div>
                    <h4 className={`text-lg font-bold ${userData.estado_cuota === 'Al Día' ? 'text-green-800' : 'text-red-800'}`}>
                        {userData.estado_cuota === 'Al Día' ? 'Cuota al Día' : 'Cuota Pendiente'}
                    </h4>
                    <p className={`${userData.estado_cuota === 'Al Día' ? 'text-green-600' : 'text-red-600'} text-sm`}>
                        Próximo vencimiento: {userData.vencimiento_cuota ? new Date(userData.vencimiento_cuota).toLocaleDateString() : 'Consultar'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-green-100">
                  <p className="text-sm text-green-700">
                    Gracias por apoyar al club. Tu aporte es fundamental para que sigamos creciendo.
                  </p>
                </div>
              </div>

              {userData.account_status !== 'pending' && (
                  <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                    <h4 className="font-bold text-slate-700 mb-4">Acciones Rápidas</h4>
                    <div className="space-y-3">
                      <button className="w-full text-left px-4 py-3 bg-white rounded-lg border border-slate-200 hover:border-black hover:text-black transition-colors shadow-sm text-sm font-medium">
                        Ver historial de pagos
                      </button>
                      <button onClick={openEditModal} className="w-full text-left px-4 py-3 bg-white rounded-lg border border-slate-200 hover:border-black hover:text-black transition-colors shadow-sm text-sm font-medium">
                        Actualizar datos personales
                      </button>
                      <button className="w-full text-left px-4 py-3 bg-white rounded-lg border border-slate-200 hover:border-black hover:text-black transition-colors shadow-sm text-sm font-medium">
                        Reservar cancha / quincho
                      </button>
                    </div>
                  </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Editar Datos */}
        {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
                    <h3 className="text-xl font-bold mb-4 uppercase">Actualizar Datos</h3>
                    <form onSubmit={handleUpdate} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                            <input type="email" value={editData.email} onChange={e => setEditData({...editData, email: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none" placeholder="ejemplo@email.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Teléfono</label>
                            <input type="text" value={editData.telefono} onChange={e => setEditData({...editData, telefono: e.target.value})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none" placeholder="Sin 0 y sin 15" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Foto de Perfil</label>
                            <input type="file" accept="image/*" onChange={e => setEditData({...editData, foto_perfil: e.target.files[0]})}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none" />
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold">Cancelar</button>
                            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg font-bold">
                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-theme(spacing.20))] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-black rounded-full flex items-center justify-center mb-4">
             <ShieldCheck size={32} className="text-white" />
          </div>
          <h2 className="mt-2 text-3xl font-black text-gray-900 uppercase tracking-tighter">
            {isRegistering ? 'Crear Cuenta' : 'Portal de Socios'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegistering ? 'Completá tus datos para registrarte.' : 'Ingresá con tu DNI y Contraseña para gestionar tu cuenta.'}
          </p>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-bold border border-red-200 mt-4">
              {error}
            </div>
          )}
        </div>

        {isRegistering ? (
          /* REGISTRATION FORM */
          <form className="mt-8 space-y-4" onSubmit={handleRegister}>
             <input type="text" placeholder="Nombre" required 
                className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                value={regData.nombre} onChange={e => setRegData({...regData, nombre: e.target.value})} />
             <input type="text" placeholder="Apellido" required 
                className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                value={regData.apellido} onChange={e => setRegData({...regData, apellido: e.target.value})} />
             <input type="text" placeholder="DNI" required 
                className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                value={regData.dni} onChange={e => setRegData({...regData, dni: e.target.value})} />
             <input type="text" placeholder="Nro Socio (Si tenés)" 
                className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                value={regData.nro_socio} onChange={e => setRegData({...regData, nro_socio: e.target.value})} />
             
             {/* Nuevos campos */}
             <input type="email" placeholder="Email (Opcional)" 
                className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                value={regData.email} onChange={e => setRegData({...regData, email: e.target.value})} />
             <input type="text" placeholder="Teléfono" 
                className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                value={regData.telefono} onChange={e => setRegData({...regData, telefono: e.target.value})} />
             <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Foto de Perfil</label>
                <input type="file" accept="image/*"
                    className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    onChange={e => setRegData({...regData, foto_perfil: e.target.files[0]})} />
             </div>

             <div className="relative">
                <input type={showRegPassword ? "text" : "password"} placeholder="Contraseña" required 
                    className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                    value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} />
                <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                >
                    {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
             </div>
             
             <button type="submit" disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors">
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="dni" className="sr-only">DNI / Nro Socio</label>
                <input
                  id="dni"
                  name="dni"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="DNI o Número de Socio"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type={showLoginPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm pr-10"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 z-20"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-gray-600 hover:text-black hover:underline">
                  ¿Olvidaste tu clave?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase rounded-lg text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-black hover:bg-gray-800'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors`}
              >
                {isLoading ? 'Ingresando...' : 'Ingresar'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-4">
           {isRegistering ? (
             <p className="text-xs text-gray-500">¿Ya sos socio? <button onClick={() => setIsRegistering(false)} className="text-black font-bold hover:underline">Iniciar Sesión</button></p>
           ) : (
             <p className="text-xs text-gray-500">¿Aún no sos socio? <button onClick={() => setIsRegistering(true)} className="text-black font-bold hover:underline">Asociate online</button></p>
           )}
        </div>
      </div>
    </div>
  );
};

export default Socios;
