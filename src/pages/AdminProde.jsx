import React, { useState, useEffect } from "react";
import { TEAMS } from "../data/teams";
import ConfirmationModal from "../components/ConfirmationModal";
import { API_URL } from "../config";

const AdminProde = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    home_team: TEAMS[0],
    away_team: TEAMS[1],
    start_time: "",
    matchday: "Fecha 1",
  });

  // Modal State
  const [modal, setModal] = useState({ isOpen: false, type: null, data: null });
  const [editingMatch, setEditingMatch] = useState(null);
  const [editFormData, setEditFormData] = useState({
    home_team: "",
    away_team: "",
    start_time: "",
    matchday: "Fecha 1",
    season: new Date().getFullYear(),
  });

  // Auth check should be here or handled by a higher-level component/router, but basic check:
  const token = localStorage.getItem("token");

  const fetchMatches = async () => {
    try {
      const res = await fetch(`${API_URL}/matches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) {
        alert(
          "Tu sesión como administrador ha expirado o no tienes permisos. Redirigiendo..."
        );
        window.location.href = "/socios";
        return;
      }
      if (!res.ok) throw new Error("Error al cargar partidos");

      const data = await res.json();
      setMatches(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert("Error al cargar datos: " + err.message);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Pre-Request Triggers
  const requestCreateMatch = (e) => {
    e.preventDefault();
    setModal({
      isOpen: true,
      type: "CREATE",
      title: "Crear Partido",
      message: `¿Crear partido ${formData.home_team} vs ${formData.away_team} para la ${formData.matchday}?`,
    });
  };

  const requestDeleteMatch = (match) => {
    setModal({
      isOpen: true,
      type: "DELETE_MATCH",
      data: { matchId: match.id },
      title: "Eliminar Partido",
      message: `¿Estás seguro de eliminar el partido ${match.home_team} vs ${match.away_team}? Se borrarán todas las predicciones asociadas.`,
      isDestructive: true,
    });
  };

  const requestSetResult = (matchId, homeScore, awayScore) => {
    if (homeScore === undefined || awayScore === undefined) return;
    setModal({
      isOpen: true,
      type: "RESULT",
      data: { matchId, homeScore, awayScore },
      title: "Finalizar Partido",
      message: `¿Confirmar resultado ${homeScore} - ${awayScore} y calcular puntos para TODOS los usuarios? Esta acción es importante.`,
      isDestructive: true,
    });
  };

  const requestEditMatch = (match) => {
    setEditingMatch(match);
    setEditFormData({
      home_team: match.home_team,
      away_team: match.away_team,
      start_time: match.start_time,
      matchday: match.matchday,
      season: match.season || new Date().getFullYear(),
    });
  };

  // Action Executors
  const executeAction = async () => {
    if (modal.type === "CREATE") {
      await handleCreateMatch();
    } else if (modal.type === "RESULT") {
      await handleSetResult();
    } else if (modal.type === "DELETE_MATCH") {
      await handleDeleteMatch();
    }
  };

  const handleEditMatch = async () => {
    if (!editingMatch) return;
    try {
      const res = await fetch(`${API_URL}/matches/${editingMatch.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        fetchMatches();
        setEditingMatch(null);
      } else {
        alert("Error al editar partido");
      }
    } catch (err) {
      console.error(err);
      alert("Error al editar");
    }
  };

  const handleCreateMatch = async () => {
    try {
      const res = await fetch(`${API_URL}/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // alert('Partido creado'); // Modal auto-close implies success or we can toast
        fetchMatches();
        setFormData((prev) => ({ ...prev, start_time: "" }));
      } else {
        alert("Error al crear partido");
      }
    } catch (err) {
      console.error(err);
      alert("Error al crear");
    }
  };

  const handleSetResult = async () => {
    const { matchId, homeScore, awayScore } = modal.data;
    try {
      const res = await fetch(`${API_URL}/matches/${matchId}/result`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ home_score: homeScore, away_score: awayScore }),
      });

      if (res.ok) {
        // alert('Resultado guardado y puntos calculados');
        fetchMatches();
      } else {
        alert("Error al guardar resultado");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMatch = async () => {
    const { matchId } = modal.data;
    try {
      const res = await fetch(`${API_URL}/matches/${matchId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchMatches();
      } else {
        alert("Error al eliminar el partido");
      }
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={executeAction}
        title={modal.title}
        message={modal.message}
        isDestructive={modal.isDestructive}
      />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">Administrar Prode</h1>
        <button
          onClick={() => (window.location.href = "/socios")}
          className="bg-gray-200 px-4 py-2 rounded font-bold hover:bg-gray-300 uppercase text-sm"
        >
          Volver
        </button>
      </div>

      {/* Create Match Form - Protected for Admin Only on Frontend too */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
        <p className="font-bold text-blue-700">Gestión de Temporadas</p>
        <p className="text-sm text-blue-600">
          El sistema detecta automáticamente la temporada actual basada en los
          partidos creados. Para <strong>finalizar la temporada actual</strong>{" "}
          e iniciar una nueva (ej: 2026), simplemente cree el primer partido
          asignándole el año nuevo en el campo "Temporada". La vista de "Jugar"
          cambiará automáticamente a mostrar solo los partidos del nuevo año.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4">Crear Nuevo Partido</h2>
        <form
          onSubmit={requestCreateMatch}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end"
        >
          <div>
            <label className="block text-sm font-bold mb-1">Local</label>
            <select
              name="home_team"
              value={formData.home_team}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Visitante</label>
            <select
              name="away_team"
              value={formData.away_team}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              {TEAMS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Fecha y Hora</label>
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">Jornada</label>
            <select
              name="matchday"
              value={formData.matchday}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="Fecha 1">Fecha 1</option>
              <option value="Fecha 2">Fecha 2</option>
              <option value="Fecha 3">Fecha 3</option>
              <option value="Fecha 4">Fecha 4</option>
              <option value="Fecha 5">Fecha 5</option>
              <option value="Fecha 6">Fecha 6</option>
              <option value="Fecha 7">Fecha 7</option>
              <option value="Fecha 8">Fecha 8</option>
              <option value="Fecha 9">Fecha 9</option>
              <option value="Fecha 10">Fecha 10</option>
              <option value="Fecha 11">Fecha 11</option>
              <option value="Cuartos de Final Ida">Cuartos de Final Ida</option>
              <option value="Cuartos de Final Vuelta">
                Cuartos de Final Vuelta
              </option>
              <option value="Semifinal Ida">Semifinal Ida</option>
              <option value="Semifinal Vuelta">Semifinal Vuelta</option>
              <option value="Final Ida">Final Ida</option>
              <option value="Final Vuelta">Final Vuelta</option>
              <option value="Tercer Partido">Final Tercer Partido</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold mb-1">
              Temporada (Año)
            </label>
            <input
              type="number"
              name="season"
              value={formData.season || new Date().getFullYear()}
              onChange={handleChange}
              placeholder="2025"
              min="2024"
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
          >
            Crear Partido
          </button>
        </form>
      </div>

      {/* Match List */}
      <h2 className="text-xl font-bold mb-4">Partidos Existentes</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">ID</th>
                  <th className="px-4 py-2 text-left">Partido</th>
                  <th className="px-4 py-2 text-left">Jornada</th>
                  <th className="px-4 py-2 text-left">Fecha</th>
                  <th className="px-4 py-2 text-left">Estado</th>
                  <th className="px-4 py-2 text-left">Resultado</th>
                  <th className="px-4 py-2 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((m) => (
                  <tr key={m.id} className="border-t">
                    <td className="px-4 py-2">{m.id}</td>
                    <td className="px-4 py-2 font-bold whitespace-nowrap">
                      {m.home_team} vs {m.away_team}
                    </td>
                    <td className="px-4 py-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        {m.matchday}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {new Date(m.start_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          m.status === "finished"
                            ? "bg-gray-800 text-white"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {m.status === "finished" ? "Finalizado" : "Programado"}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {m.status === "finished" ? (
                        <span className="font-bold text-lg">
                          {m.home_score} - {m.away_score}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => requestEditMatch(m)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold border border-blue-200 rounded px-2 py-1 bg-blue-50"
                        >
                          Editar Partido
                        </button>
                        <ResultForm
                          matchId={m.id}
                          onSave={requestSetResult}
                          initialHome={m.home_score}
                          initialAway={m.away_score}
                        />
                        <button
                          onClick={() => requestDeleteMatch(m)}
                          className="text-red-600 hover:text-red-800 text-xs font-bold border border-red-200 rounded px-2 py-1 bg-red-50"
                        >
                          Eliminar Partido
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

      {/* Modal de Edición de Partido */}
      {editingMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 uppercase">Editar Partido</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditMatch();
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Local
                </label>
                <select
                  value={editFormData.home_team}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      home_team: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                  {TEAMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Visitante
                </label>
                <select
                  value={editFormData.away_team}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      away_team: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                  {TEAMS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Fecha y Hora
                </label>
                <input
                  type="datetime-local"
                  value={editFormData.start_time}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      start_time: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Jornada
                </label>
                <select
                  value={editFormData.matchday}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      matchday: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                >
                  <option value="Fecha 1">Fecha 1</option>
                  <option value="Fecha 2">Fecha 2</option>
                  <option value="Fecha 3">Fecha 3</option>
                  <option value="Fecha 4">Fecha 4</option>
                  <option value="Fecha 5">Fecha 5</option>
                  <option value="Fecha 6">Fecha 6</option>
                  <option value="Fecha 7">Fecha 7</option>
                  <option value="Fecha 8">Fecha 8</option>
                  <option value="Fecha 9">Fecha 9</option>
                  <option value="Fecha 10">Fecha 10</option>
                  <option value="Fecha 11">Fecha 11</option>
                  <option value="Cuartos de Final Ida">
                    Cuartos de Final Ida
                  </option>
                  <option value="Cuartos de Final Vuelta">
                    Cuartos de Final Vuelta
                  </option>
                  <option value="Semifinal Ida">Semifinal Ida</option>
                  <option value="Semifinal Vuelta">Semifinal Vuelta</option>
                  <option value="Final Ida">Final Ida</option>
                  <option value="Final Vuelta">Final Vuelta</option>
                  <option value="Tercer Partido">Tercer Partido</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Temporada (Año)
                </label>
                <input
                  type="number"
                  value={editFormData.season}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      season: parseInt(e.target.value),
                    })
                  }
                  min="2024"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingMatch(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-bold"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Mini component for result input
const ResultForm = ({ matchId, onSave, initialHome, initialAway }) => {
  const [h, setH] = useState(
    initialHome !== undefined && initialHome !== null ? initialHome : ""
  );
  const [a, setA] = useState(
    initialAway !== undefined && initialAway !== null ? initialAway : ""
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(matchId, parseInt(h), parseInt(a));
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="number"
        placeholder="L"
        className="w-12 border rounded p-1 text-center"
        value={h}
        onChange={(e) => setH(e.target.value)}
        required
      />
      <span>-</span>
      <input
        type="number"
        placeholder="V"
        className="w-12 border rounded p-1 text-center"
        value={a}
        onChange={(e) => setA(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white text-xs px-2 py-1 rounded"
      >
        Finalizar
      </button>
    </form>
  );
};

export default AdminProde;
