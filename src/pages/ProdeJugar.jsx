import React, { useState, useEffect } from "react";
import MatchCard from "../components/MatchCard";
import ConfirmationModal from "../components/ConfirmationModal";
import AlertModal from "../components/AlertModal";
import ProdeRulesModal from "../components/ProdeRulesModal";
import SponsorList from "../components/SponsorList";
import { API_URL } from "../config";
import { HelpCircle } from "lucide-react";

const ProdeJugar = () => {
  const [matches, setMatches] = useState([]);
  const [myPredictions, setMyPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch Matches and Predictions
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        // 0. Get Latest Season
        const seasonsRes = await fetch(`${API_URL}/seasons`);
        const seasons = await seasonsRes.json();
        const currentSeason =
          seasons.length > 0 ? seasons[0] : new Date().getFullYear().toString();

        // 1. Get Matches for Current Season
        const matchesRes = await fetch(
          `${API_URL}/matches?season=${currentSeason}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!matchesRes.ok) {
          if (matchesRes.status === 401 || matchesRes.status === 403) {
            throw new Error(
              "Sesión expirada. Por favor, iniciá sesión nuevamente."
            );
          }
          throw new Error("Error al cargar partidos");
        }
        const matchesData = await matchesRes.json();

        // 2. Get My Predictions
        const predsRes = await fetch(`${API_URL}/predictions/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!predsRes.ok) {
          if (predsRes.status === 401 || predsRes.status === 403) {
            throw new Error(
              "Sesión expirada. Por favor, iniciá sesión nuevamente."
            );
          }
          throw new Error("Error al cargar pronósticos");
        }
        const predsData = await predsRes.json();

        setMatches(matchesData);
        setMyPredictions(predsData);
      } catch (err) {
        console.error(err);
        setError(err.message);
        if (err.message.includes("Sesión expirada")) {
          // Optional: Auto redirect after few seconds or provide a button
          setTimeout(() => (window.location.href = "/socios"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [modal, setModal] = useState({ isOpen: false, data: null });
  const [alertData, setAlertData] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [rulesOpen, setRulesOpen] = useState(false);
  const [selectedMatchday, setSelectedMatchday] = useState("");

  const showAlert = (title, message) => {
    setAlertData({ isOpen: true, title, message });
  };

  const handlePredictRequest = (matchId, homeScore, awayScore) => {
    setModal({
      isOpen: true,
      data: { matchId, homeScore, awayScore },
      title: "Confirmar Pronóstico",
      message: `¿Estás seguro que quieres guardar este resultado: ${homeScore} - ${awayScore}?`,
    });
  };

  const confirmPredict = () => {
    if (!modal.data) return;
    const { matchId, homeScore, awayScore } = modal.data;
    // Logic from previous handlePredict

    const save = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/predictions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            match_id: matchId,
            home_score: homeScore,
            away_score: awayScore,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          showAlert("Error", errorData.error || "Error al guardar");
          return;
        }

        const newTx = await res.json();

        // Update local state
        setMyPredictions((prev) => {
          const existing = prev.find((p) => p.match_id === matchId);
          if (existing) {
            return prev.map((p) => (p.match_id === matchId ? newTx : p));
          } else {
            return [...prev, newTx];
          }
        });

        // alert('¡Pronóstico guardado!'); // Optional if modal success needed, but maybe notification is enough or just close
      } catch (err) {
        console.error(err);
        showAlert("Error", "Error de conexión");
      }
    };
    save();
  };

  if (loading) return <div className="p-8 text-center">Cargando Prode...</div>;
  if (error)
    return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  const activeMatches = matches.filter((m) => m.status !== "finished");
  const finishedMatches = matches.filter((m) => m.status === "finished");

  // Get unique matchdays and sort them
  const allMatchdays = [...new Set(matches.map((m) => m.matchday))].sort(
    (a, b) => {
      const order = [
        "Fecha 1",
        "Fecha 2",
        "Fecha 3",
        "Fecha 4",
        "Fecha 5",
        "Fecha 6",
        "Fecha 7",
        "Fecha 8",
        "Fecha 9",
        "Fecha 10",
        "Fecha 11",
        "Cuartos de Final Ida",
        "Cuartos de Final Vuelta",
        "Semifinal Ida",
        "Semifinal Vuelta",
        "Final Ida",
        "Final Vuelta",
        "Tercer Partido",
      ];
      return order.indexOf(a) - order.indexOf(b);
    }
  );

  // Filter matches by selected matchday
  const filteredActiveMatches = selectedMatchday
    ? activeMatches.filter((m) => m.matchday === selectedMatchday)
    : activeMatches;
  const filteredFinishedMatches = selectedMatchday
    ? finishedMatches.filter((m) => m.matchday === selectedMatchday)
    : finishedMatches;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({ ...modal, isOpen: false })}
        onConfirm={confirmPredict}
        title={modal.title}
        message={modal.message}
      />

      <AlertModal
        isOpen={alertData.isOpen}
        onClose={() => setAlertData({ ...alertData, isOpen: false })}
        title={alertData.title}
        message={alertData.message}
      />

      <ProdeRulesModal isOpen={rulesOpen} onClose={() => setRulesOpen(false)} />

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-club-dark border-l-4 border-club-blue pl-4">
                Jugar Prode
              </h1>
            </div>
            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => setRulesOpen(true)}
                className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded-full transition-colors"
              >
                <HelpCircle size={16} />
                Cómo Jugar
              </button>
              <div className="text-sm text-gray-500">
                <span className="font-bold">{myPredictions.length}</span>{" "}
                pronósticos realizados
              </div>
            </div>
          </div>

          {/* Filtro por Jornada */}
          {allMatchdays.length > 0 && (
            <div className="mb-6 bg-white p-4 rounded-lg shadow-md border border-gray-200">
              <label className="block text-sm font-bold mb-2 text-gray-700">
                Filtrar por Jornada:
              </label>
              <select
                value={selectedMatchday}
                onChange={(e) => setSelectedMatchday(e.target.value)}
                className="w-full md:w-64 border-2 border-club-blue rounded px-3 py-2 font-bold text-club-dark bg-white"
              >
                <option value="">Todas las Jornadas</option>
                {allMatchdays.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Partidos por Jugar */}
          <h2 className="text-xl font-bold mb-4 text-gray-700">
            Próximos Partidos
          </h2>
          {filteredActiveMatches.length === 0 ? (
            <p className="text-gray-500 italic mb-8">
              No hay partidos programados.
            </p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {filteredActiveMatches.map((match) => (
                <MatchCard
                  key={match.id}
                  match={match}
                  prediction={myPredictions.find((p) => p.match_id === match.id)}
                  onPredict={handlePredictRequest}
                />
              ))}
            </div>
          )}

          {/* Partidos Finalizados */}
          {filteredFinishedMatches.length > 0 && (
            <>
              <h2 className="text-xl font-bold mb-4 text-gray-700 border-t pt-8">
                Resultados Anteriores
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredFinishedMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    match={match}
                    prediction={myPredictions.find((p) => p.match_id === match.id)}
                    onPredict={handlePredictRequest}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
             <SponsorList location="prode" isSidebar={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProdeJugar;
