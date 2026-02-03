import React, { useState, useEffect } from "react";
import {
  UserCheck,
  CreditCard,
  ShieldCheck,
  LogOut,
  Eye,
  EyeOff,
  Edit,
  Camera,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import ImageCropperModal from "../components/ImageCropperModal";
import { getImageUrl } from "../utils/imageUtils";
import { API_URL } from "../config";

const Socios = () => {
  // Helper for images imported from utils now

  // Estado local
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({ dni: "", password: "" });
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [stats, setStats] = useState([]);
  const [showHelpModal, setShowHelpModal] = useState(false);
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${API_URL}/socios`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            setUserData(data.user);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem("token");
          }
        } catch (err) {
          console.error("Session check failed");
        }
      }
    };
    checkSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetch(`${API_URL}/predictions/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setPredictions(data);
          // Calculate stats
          const statsByYear = {};
          data.forEach((p) => {
            const year = p.season || "General";
            if (!statsByYear[year])
              statsByYear[year] = { points: 0, full: 0, total: 0 };
            statsByYear[year].points += p.points || 0;
            if (p.points === 3) statsByYear[year].full += 1;
            statsByYear[year].total += 1;
          });
          setStats(
            Object.entries(statsByYear)
              .map(([year, data]) => ({ year, ...data }))
              .sort((a, b) => b.year - a.year)
          );
        })
        .catch(console.error);
    }
  }, [isLoggedIn]);

  // Toggle Register Mode
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(
    new URLSearchParams(location.search).get("mode") === "register"
  );

  // Extra fields for registration
  const [regData, setRegData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    nro_socio: "",
    password: "",
    email: "",
    telefono: "",
    fecha_nacimiento: "",
    foto_perfil: null, // File object
  });
  
  const [regPreviewImage, setRegPreviewImage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const data = new FormData();
    data.append("nombre", regData.nombre);
    data.append("apellido", regData.apellido);
    data.append("dni", regData.dni);
    data.append("nro_socio", regData.nro_socio);
    data.append("password", regData.password);
    data.append("email", regData.email);
    data.append("telefono", regData.telefono);
    data.append("fecha_nacimiento", regData.fecha_nacimiento);
    if (regData.foto_perfil) {
      data.append("foto_perfil", regData.foto_perfil);
    }

    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        // Headers content-type is set automatically with FormData
        body: data,
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        localStorage.setItem("token", resData.token);
        setUserData(resData.user);
        setIsLoggedIn(true);
      } else {
        setError(resData.error || "Error al registrarse");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem("token", data.token);
        setUserData(data.user);
        setIsLoggedIn(true);
      } else {
        setError(data.error || "Error al iniciar sesión");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserData(null);
    setFormData({ dni: "", password: "" });
  };

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [selectedImageSrc, setSelectedImageSrc] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("datos");

  const [editData, setEditData] = useState({
    telefono: "",
    email: "",
    fecha_nacimiento: "",
    nro_socio: "",
    foto_perfil: null, // File object or null
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const openEditModal = () => {
    // Sanitize phone number if it got corrupted (e.g. "{"3465668393","3465668393"}")
    let cleanTelefono = userData.telefono || "";
    if (cleanTelefono.startsWith("{") && cleanTelefono.endsWith("}")) {
      cleanTelefono = cleanTelefono.replace(/[{"]/g, "").split(",")[0];
    }

    let formattedDate = "";
    if (userData.fecha_nacimiento) {
      const date = new Date(userData.fecha_nacimiento);
      if (!isNaN(date.getTime())) {
        formattedDate = date.toISOString().split('T')[0];
      }
    }

    setEditData({
      telefono: cleanTelefono,
      email: userData.email || "",
      fecha_nacimiento: formattedDate,
      nro_socio: userData.nro_socio || "",
      foto_perfil: null,
    });

    setPreviewImage(getImageUrl(userData.foto_perfil));
    setIsEditModalOpen(true);
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setSelectedImageSrc(reader.result?.toString() || "");
        setCropModalOpen(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (croppedBlob) => {
    // Create a File object from Blob
    const file = new File([croppedBlob], "profile_pic.webp", {
      type: "image/webp",
    });
    
    if (isLoggedIn) {
      setEditData({ ...editData, foto_perfil: file });
      setPreviewImage(URL.createObjectURL(croppedBlob));
    } else {
      setRegData({ ...regData, foto_perfil: file });
      setRegPreviewImage(URL.createObjectURL(croppedBlob));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("telefono", editData.telefono);
    data.append("email", editData.email);
    data.append("fecha_nacimiento", editData.fecha_nacimiento);
    data.append("nro_socio", editData.nro_socio);
    if (editData.foto_perfil) {
      data.append("foto_perfil", editData.foto_perfil);
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/me/update`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        setUserData(resData.user);
        setIsEditModalOpen(false);
      } else {
        alert(resData.error || "Error al actualizar");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validaciones
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      alert("Por favor completa todos los campos");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/me/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });
      const resData = await response.json();
      if (response.ok && resData.success) {
        alert("Contraseña cambiada exitosamente");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsEditModalOpen(false);
      } else {
        alert(resData.error || "Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn && userData) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 relative">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-black p-4 md:p-6 flex flex-col md:flex-row justify-between items-center text-white gap-4">
            <h2 className="text-2xl font-black uppercase flex items-center gap-2">
              <ShieldCheck /> Dashboard del Socio
            </h2>
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button
                onClick={handleLogout}
                className="whitespace-nowrap flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors text-sm font-bold uppercase"
              >
                <LogOut size={16} />{" "}
                <span className="hidden md:inline">Cerrar Sesión</span>
              </button>
            </div>
          </div>

          {/* Pending Banner */}
          {userData.account_status === "pending" && (
            <div className="bg-yellow-50 border-b-4 border-yellow-400 p-4 md:p-6 text-center">
              <h3 className="text-xl font-bold text-yellow-800 mb-2">
                ⚠ Cuenta Pendiente de Aprobación
              </h3>
              <p className="text-yellow-700 max-w-2xl mx-auto">
                Tu registro fue exitoso, pero un administrador debe aprobar tu
                cuenta antes de que puedas utilizar todas las funciones (Prode,
                Reservas, etc).
                <br />
                Podrás navegar por el sitio, pero algunas acciones estarán
                restringidas.
              </p>
            </div>
          )}

          <div className="p-4 md:p-8">
            <div
              className={`grid grid-cols-1 ${
                userData.rol === "admin" ? "lg:grid-cols-[1fr_300px]" : ""
              } gap-8`}
            >
              {/* Columna Izquierda: Contenido Socio (Grid 2x2) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 content-start">
                {/* 1. Carnet Digital */}
                <div className="flex flex-col items-center h-full">
                  <div className="w-full bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white rounded-xl shadow-2xl overflow-hidden relative aspect-[1.586/1] border-2 border-white/10 group hover:scale-[1.02] transition-transform duration-300">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-5 -mb-5"></div>
                    {/* Escudo de fondo (Marca de agua) */}
                    <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-48 h-48 opacity-15 pointer-events-none z-0">
                      <img src="/9dejulio.svg" alt="" className="w-full h-full object-contain" />
                    </div>
                    <div className="p-4 relative z-10 flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-black text-lg tracking-wider uppercase">
                            Club 9 de Julio
                          </h3>
                          <p className="text-xs text-gray-400 uppercase tracking-widest">
                            Berabevú
                          </p>
                        </div>
                      </div>
                      <div className="text-center my-1">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto border-4 border-white/20 mb-2 overflow-hidden flex items-center justify-center relative">
                          {userData.foto_perfil ? (
                            <img
                              src={getImageUrl(userData.foto_perfil)}
                              alt="Perfil"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <UserCheck size={32} className="text-gray-400" />
                          )}
                        </div>
                        <p className="font-bold text-lg uppercase leading-tight">
                          {userData.nombre} {userData.apellido}
                        </p>
                        <p className="text-xs text-gray-300">
                          {userData.tipo_socio}
                        </p>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-[10px] uppercase text-gray-400 mb-1">
                            Nº Socio
                          </p>
                          <p className="font-mono text-lg text-white font-bold leading-none">
                            {userData.nro_socio || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-500">
                    Carnet Digital Oficial
                  </p>
                </div>



                {/* 3. Estadísticas de Prode */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-bl-full -mr-4 -mt-4 -z-0"></div>
                  <h4 className="font-bold text-gray-800 mb-4 uppercase flex items-center gap-2 relative z-10">
                    <div className="p-1.5 bg-gray-100 text-black rounded-lg">
                      <Eye size={18} />
                    </div>{" "}
                    Rendimiento Prode
                  </h4>

                  <div className="flex-1 overflow-y-auto max-h-48 scrollbar-hide relative z-10">
                    {stats.length > 0 ? (
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs text-gray-500 uppercase border-b border-gray-100">
                            <th className="text-left pb-2">Temp.</th>
                            <th className="text-center pb-2">Pts</th>
                            <th className="text-center pb-2">Plenos</th>
                            <th className="text-right pb-2">PJ</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {stats.map((s) => (
                            <tr key={s.year}>
                              <td className="py-2 font-bold text-gray-800">
                                {s.year}
                              </td>
                              <td className="py-2 text-center font-black text-black text-lg">
                                {s.points}
                              </td>
                              <td className="py-2 text-center text-gray-600">
                                {s.full}
                              </td>
                              <td className="py-2 text-right text-gray-500">
                                {s.total}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center py-4">
                        <p>Sin datos aún.</p>
                        <a
                          href="/prode/jugar"
                          className="text-black font-bold text-xs mt-1 hover:underline bg-gray-100 px-2 py-1 rounded"
                        >
                          ¡Jugá ahora!
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. Opciones de Menu / Acciones Rápidas */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm h-full flex flex-col">
                  <h4 className="font-bold text-gray-800 mb-4 uppercase flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 text-gray-600 rounded-lg">
                      <UserCheck size={18} />
                    </div>{" "}
                    Mi Club
                  </h4>
                  <div className="space-y-3 flex-1">
                    <button
                      onClick={openEditModal}
                      className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all text-sm font-bold flex items-center justify-between group"
                    >
                      Mis Datos
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </button>
                    <a
                      href="https://wa.me/543465659238"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all text-sm font-bold flex items-center justify-between group"
                    >
                      Reservas
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </a>
                    <button
                      onClick={() => setShowHelpModal(true)}
                      className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-black hover:text-white transition-all text-sm font-bold flex items-center justify-between group"
                    >
                      Ayuda
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Sidebar Admin / Representante */}
              {(userData.rol === "admin" || userData.rol === "representante") && (
                <div className="flex flex-col h-full">
                  <div className="bg-black rounded-xl p-6 border border-gray-800 shadow-xl sticky top-8">
                    <h4 className="font-bold text-white mb-6 uppercase flex items-center gap-2 border-b border-gray-800 pb-4">
                      <ShieldCheck size={20} className="text-yellow-500" />{" "}
                      Administración
                    </h4>
                    <div className="space-y-3">
                      {userData.rol === "admin" && (
                        <button
                          onClick={() => (window.location.href = "/admin/users")}
                          className="w-full text-left px-4 py-3 bg-transparent text-gray-300 rounded-lg border border-gray-800 hover:border-white hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase flex items-center gap-3 group"
                        >
                          <UserCheck
                            size={18}
                            className="group-hover:text-yellow-400 transition-colors"
                          />{" "}
                          <span>Usuarios</span>
                        </button>
                      )}
                      
                      <button
                        onClick={() => (window.location.href = "/admin/sports")}
                        className="w-full text-left px-4 py-3 bg-transparent text-gray-300 rounded-lg border border-gray-800 hover:border-white hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase flex items-center gap-3 group"
                      >
                         <div className="w-[18px]" /> {/* Spacer/Icon placeholder if needed to align with Users icon */}
                        <span>Actividades</span>
                      </button>
                      
                      <button
                        onClick={() => (window.location.href = "/admin/news")}
                        className="w-full text-left px-4 py-3 bg-transparent text-gray-300 rounded-lg border border-gray-800 hover:border-white hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase flex items-center gap-3 group"
                      >
                         <div className="w-[18px]" />
                        <span>Noticias</span>
                      </button>
                      
                      <button
                        onClick={() =>
                          (window.location.href = "/admin/galeria")
                        }
                        className="w-full text-left px-4 py-3 bg-transparent text-gray-300 rounded-lg border border-gray-800 hover:border-white hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase flex items-center gap-3 group"
                      >
                         <div className="w-[18px]" />
                        <span>Galería</span>
                      </button>

                      {userData.rol === "admin" && (
                        <>
                          <button
                            onClick={() => (window.location.href = "/admin/prode")}
                            className="w-full text-left px-4 py-3 bg-transparent text-gray-300 rounded-lg border border-gray-800 hover:border-white hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase flex items-center gap-3 group"
                          >
                             <div className="w-[18px]" />
                            <span>Prode</span>
                          </button>
                          <button
                            onClick={() =>
                              (window.location.href = "/admin/sponsors")
                            }
                            className="w-full text-left px-4 py-3 bg-transparent text-gray-300 rounded-lg border border-gray-800 hover:border-white hover:text-white hover:bg-white/5 transition-all text-sm font-bold uppercase flex items-center gap-3 group"
                          >
                             <div className="w-[18px]" />
                            <span>Publicidad</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Editar Datos */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4 uppercase">Mi Perfil</h3>

              <div className="flex gap-2 mb-6 border-b border-gray-200">
                <button
                  onClick={() => {
                    setActiveTab("datos");
                    setPasswordData({
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                  className={`flex-1 py-2 px-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "datos"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-black"
                  }`}
                >
                  Mis Datos
                </button>
                <button
                  onClick={() => {
                    setActiveTab("password");
                    setEditData({ telefono: "", email: "", foto_perfil: null });
                  }}
                  className={`flex-1 py-2 px-3 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === "password"
                      ? "border-black text-black"
                      : "border-transparent text-gray-500 hover:text-black"
                  }`}
                >
                  Contraseña
                </button>
              </div>

              {/* TAB 1: Datos Personales */}
              {activeTab === "datos" && (
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                      placeholder="ejemplo@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Teléfono
                    </label>
                    <input
                      type="text"
                      value={editData.telefono}
                      onChange={(e) =>
                        setEditData({ ...editData, telefono: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                      placeholder="Sin 0 y sin 15"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <input
                      type="date"
                      value={editData.fecha_nacimiento}
                      onChange={(e) =>
                        setEditData({ ...editData, fecha_nacimiento: e.target.value })
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Número de Socio
                    </label>
                    <input
                      type="text"
                      value={editData.nro_socio}
                      onChange={(e) =>
                        setEditData({ ...editData, nro_socio: e.target.value })
                      }
                      placeholder="Ej: 1234"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Foto de Perfil
                    </label>

                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                        {previewImage ? (
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <UserCheck />
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          id="photo_upload"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="photo_upload"
                          className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 text-sm transition-colors"
                        >
                          <Camera size={16} /> Cambiar Foto
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-black text-white hover:bg-gray-800 rounded-lg font-bold"
                    >
                      {isLoading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: Cambiar Contraseña */}
              {activeTab === "password" && (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 font-bold">
                      Por favor ingresa tu contraseña actual y la nueva
                      contraseña dos veces para confirmar.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={passwordData.currentPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            currentPassword: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Contraseña Nueva
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={passwordData.newPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            newPassword: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">
                      Confirmar Contraseña Nueva
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={passwordData.confirmPassword}
                        onChange={(e) =>
                          setPasswordData({
                            ...passwordData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none pr-10"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditModalOpen(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg font-bold"
                    >
                      {isLoading ? "Cambiando..." : "Cambiar Contraseña"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        <ImageCropperModal
          isOpen={cropModalOpen}
          onClose={() => setCropModalOpen(false)}
          imageSrc={selectedImageSrc}
          onCropComplete={handleCropComplete}
        />

        {/* Modal de Ayuda */}
        {showHelpModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4 transition-all animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center relative overflow-hidden transform transition-all animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 left-0 w-full h-2 bg-black"></div>
              <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <ShieldCheck size={40} className="text-black" />
              </div>
              <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter">Próximamente</h3>
              <p className="text-gray-600 font-medium mb-8">
                Estamos trabajando en esta sección para brindarte una mejor experiencia.
              </p>
              <button
                onClick={() => setShowHelpModal(false)}
                className="w-full py-4 bg-black text-white rounded-xl font-black uppercase tracking-widest hover:bg-gray-800 transition-colors shadow-lg shadow-black/20"
              >
                Entendido
              </button>
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
            {isRegistering ? "Crear Cuenta" : "Portal de Socios"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {isRegistering
              ? "Completá tus datos para registrarte."
              : "Ingresá con tu DNI y Contraseña para gestionar tu cuenta."}
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
            <input
              type="text"
              placeholder="Nombre"
              required
              className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              value={regData.nombre}
              onChange={(e) =>
                setRegData({ ...regData, nombre: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Apellido"
              required
              className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              value={regData.apellido}
              onChange={(e) =>
                setRegData({ ...regData, apellido: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="DNI"
              required
              className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              value={regData.dni}
              onChange={(e) => setRegData({ ...regData, dni: e.target.value })}
            />
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Fecha de Nacimiento
              </label>
              <input
                type="date"
                required
                className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                value={regData.fecha_nacimiento}
                onChange={(e) =>
                  setRegData({ ...regData, fecha_nacimiento: e.target.value })
                }
              />
            </div>
            <input
              type="text"
              placeholder="Nro Socio (Si tenés)"
              className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              value={regData.nro_socio}
              onChange={(e) =>
                setRegData({ ...regData, nro_socio: e.target.value })
              }
            />

            {/* Nuevos campos */}
            <input
              type="email"
              placeholder="Email (Opcional)"
              className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              value={regData.email}
              onChange={(e) =>
                setRegData({ ...regData, email: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Teléfono"
              className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              value={regData.telefono}
              onChange={(e) =>
                setRegData({ ...regData, telefono: e.target.value })
              }
            />
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                Foto de Perfil
              </label>
              
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                  {regPreviewImage ? (
                    <img
                      src={regPreviewImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <UserCheck />
                    </div>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="reg_photo_upload"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="reg_photo_upload"
                    className="cursor-pointer bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-2 px-4 rounded-lg inline-flex items-center gap-2 text-sm transition-colors"
                  >
                    <Camera size={16} /> Subir Foto
                  </label>
                </div>
              </div>
            </div>

            <div className="relative">
              <input
                type={showRegPassword ? "text" : "password"}
                placeholder="Contraseña"
                required
                className="appearance-none rounded-lg block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                value={regData.password}
                onChange={(e) =>
                  setRegData({ ...regData, password: e.target.value })
                }
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowRegPassword(!showRegPassword)}
              >
                {showRegPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>
        ) : (
          /* LOGIN FORM */
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div className="mb-4">
                <label htmlFor="dni" className="sr-only">
                  DNI / Nro Socio
                </label>
                <input
                  id="dni"
                  name="dni"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm"
                  placeholder="DNI o Número de Socio"
                  value={formData.dni}
                  onChange={(e) =>
                    setFormData({ ...formData, dni: e.target.value })
                  }
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type={showLoginPassword ? "text" : "password"}
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-black focus:border-black focus:z-10 sm:text-sm pr-10"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
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
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-gray-600 hover:text-black hover:underline"
                >
                  ¿Olvidaste tu clave?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold uppercase rounded-lg text-white ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-black hover:bg-gray-800"
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors`}
              >
                {isLoading ? "Ingresando..." : "Ingresar"}
              </button>
            </div>
          </form>
        )}

        <div className="text-center mt-4">
          {isRegistering ? (
            <p className="text-xs text-gray-500">
              ¿Ya estás registrado?{" "}
              <button
                onClick={() => setIsRegistering(false)}
                className="text-black font-bold hover:underline"
              >
                Iniciá Sesión
              </button>
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              ¿No estás registrado?{" "}
              <button
                onClick={() => setIsRegistering(true)}
                className="text-black font-bold hover:underline"
              >
                Registrate acá
              </button>
            </p>
          )}
        </div>
      </div>
      <ImageCropperModal
        isOpen={cropModalOpen}
        onClose={() => setCropModalOpen(false)}
        imageSrc={selectedImageSrc}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
};

export default Socios;
