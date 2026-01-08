import React, { useState } from "react";
import ImageViewer from "./ImageViewer";

const ChampionshipModal = ({ isOpen, onClose, championship }) => {
  const [activeTab, setActiveTab] = useState("resumen");
  const [expandedImage, setExpandedImage] = useState(null);

  if (!isOpen || !championship) return null;

  const tabs = [
    { id: "resumen", label: "Historia", icon: "📖" },
    { id: "campania", label: "Campaña", icon: "⚽" },
    { id: "plantel", label: "Plantel", icon: "👥" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex flex-col relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-club-dark text-white p-4 flex justify-between items-center border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-500 text-black px-3 py-1 rounded font-black text-xl">
              {championship.year}
            </div>
            <div>
              <span className="text-yellow-400 font-bold text-xs tracking-wider uppercase">
                CAMPEÓN
              </span>
              <h2 className="text-lg md:text-xl font-bold truncate max-w-[200px] md:max-w-none">
                {championship.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-gray-50 border-b flex overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                                flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all border-b-2 whitespace-nowrap
                                ${
                                  activeTab === tab.id
                                    ? "border-club-blue text-club-blue bg-white"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                }
                            `}
            >
              <span className="text-lg">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {activeTab === "resumen" && (
            <div className="max-w-4xl mx-auto animate-fadeIn">
              <div className="grid md:grid-cols-5 gap-8">
                <div className="md:col-span-2 space-y-4">
                  {championship.image ? (
                    <div
                      className="rounded-lg overflow-hidden shadow-md border-4 border-white cursor-pointer hover:shadow-xl transition-shadow"
                      onClick={() => setExpandedImage(championship.image)}
                      title="Toca para agrandar"
                    >
                      <img
                        src={championship.image}
                        alt={`Plantel ${championship.year}`}
                        className="w-full h-auto"
                      />
                      <p className="text-[10px] text-center text-gray-400 italic p-3 bg-gray-50 leading-relaxed">
                        {championship.photoCaption ||
                          `Foto histórica del plantel ${championship.year}`}
                      </p>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 border-2 border-dashed">
                      <span className="text-4xl">📷</span>
                      <p className="text-sm">Sin imagen disponible</p>
                    </div>
                  )}

                  {championship.stats && (
                    <div className="bg-blue-900 text-white p-4 rounded-xl shadow-lg">
                      <h4 className="font-black text-center mb-3 text-yellow-500 uppercase tracking-widest text-xs">
                        Números Finales
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-white/10 p-2 rounded">
                          <p className="text-2xl font-black">
                            {championship.stats.pj || "-"}
                          </p>
                          <p className="text-[10px] uppercase">Partidos</p>
                        </div>
                        <div className="bg-white/10 p-2 rounded">
                          <p className="text-2xl font-black">
                            {championship.stats.gf || "-"}
                          </p>
                          <p className="text-[10px] uppercase">GF</p>
                        </div>
                        {championship.stats.pg !== undefined && (
                          <div className="bg-white/10 p-2 rounded col-span-2 flex justify-around items-center">
                            <div>
                              <p className="text-lg font-bold text-green-400">
                                {championship.stats.pg}
                              </p>
                              <p className="text-[8px] uppercase">Ganados</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-yellow-400">
                                {championship.stats.pe}
                              </p>
                              <p className="text-[8px] uppercase">Empatados</p>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-red-400">
                                {championship.stats.pp}
                              </p>
                              <p className="text-[8px] uppercase">Perdidos</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-3">
                  <h3 className="text-2xl font-black text-club-blue mb-4 leading-tight italic">
                    "{championship.title}"
                  </h3>
                  <div className="prose prose-sm md:prose-base text-gray-700 leading-relaxed text-justify space-y-4">
                    {championship.fullText.split("\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "campania" && (
            <div className="max-w-6xl mx-auto animate-fadeIn">
              <h3 className="text-xl font-bold text-club-dark mb-4 border-b-2 border-club-blue inline-block pb-1">
                El Camino al Título
              </h3>
              <div className="space-y-3">
                {championship.campaign.map((match, idx) => (
                  <div
                    key={idx}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:bg-blue-50/50 transition-all"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-2">
                      <div>
                        <p className="text-[10px] uppercase text-gray-400 font-bold">
                          Fecha
                        </p>
                        <p className="font-semibold text-gray-800">
                          {match.date || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-gray-400 font-bold">
                          Rival
                        </p>
                        <p className="font-bold text-sm text-gray-800 uppercase tracking-tight">
                          {match.rival}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-gray-400 font-bold">
                          Condición
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                            match.cond === "L"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {match.cond === "L"
                            ? "Local"
                            : match.cond === "V"
                            ? "Visitante"
                            : "Neutro"}
                        </span>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-gray-400 font-bold">
                          Resultado
                        </p>
                        <p className="font-black text-lg text-club-blue">
                          {match.result}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase text-gray-400 font-bold">
                          Estadio
                        </p>
                        <p className="text-xs text-gray-700">
                          {match.stadium || "-"}
                        </p>
                      </div>
                    </div>

                    {match.scorers && match.scorers !== "Ninguno" && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                          ⚽ Goleadores
                        </p>
                        <p className="text-sm italic text-gray-700">
                          {match.scorers}
                        </p>
                      </div>
                    )}

                    {match.cards && match.cards !== "Ninguna" && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                          🚩 Tarjetas
                        </p>
                        <p className="text-sm text-red-700 font-semibold">
                          {match.cards}
                        </p>
                      </div>
                    )}

                    {match.notes && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">
                          📝 Detalles
                        </p>
                        <p className="text-sm text-gray-700 italic bg-yellow-50 p-2 rounded">
                          {match.notes}
                        </p>
                      </div>
                    )}

                    {match.referee && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-[10px] uppercase text-gray-400 font-bold">
                          🏁 Árbitro:{" "}
                          <span className="text-gray-700">{match.referee}</span>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "plantel" && (
            <div className="max-w-3xl mx-auto animate-fadeIn">
              <h3 className="text-xl font-bold text-club-dark mb-6 border-b-2 border-club-blue inline-block pb-1">
                Los Héroes del Campeón
              </h3>
              <div className="grid sm:grid-cols-2 gap-x-12 gap-y-2">
                {Array.isArray(championship.squad) ? (
                  championship.squad.map((player, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center py-2 border-b border-gray-50 group hover:bg-gray-50 px-2 rounded transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {player.number && (
                          <span className="w-6 h-6 flex items-center justify-center bg-club-blue text-white rounded-full text-[10px] font-bold">
                            {player.number}
                          </span>
                        )}
                        <div>
                          <p className="font-bold text-gray-800 text-sm group-hover:text-club-blue transition-colors">
                            {player.name}
                          </p>
                          {player.pos && (
                            <p className="text-[10px] text-gray-400 font-semibold uppercase">
                              {player.pos}
                            </p>
                          )}
                        </div>
                      </div>
                      {player.goals && (
                        <div className="flex items-center gap-1.5 bg-yellow-100 px-2 py-0.5 rounded-full">
                          <span className="text-xs">⚽</span>
                          <span className="text-xs font-black text-yellow-800">
                            {player.goals}
                          </span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic col-span-2">
                    {championship.squad}
                  </p>
                )}
              </div>

              {/* DT Info if available would go here */}
              <div className="mt-12 p-6 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-center">
                <p className="text-sm text-gray-400 font-medium">
                  "La gloria es eterna, el plantel de {championship.year} vivirá
                  por siempre en el corazón lanudo."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Caption */}
        <div className="bg-gray-50 p-4 text-center border-t shrink-0">
          <p className="text-[10px] text-gray-400 uppercase tracking-tighter font-bold">
            Archivo Histórico Oficial - Club Atlético 9 de Julio - Berabevú
          </p>
        </div>

        {/* Image Viewer for expanded photo */}
        <ImageViewer
          imageUrl={expandedImage}
          onClose={() => setExpandedImage(null)}
        />
      </div>
    </div>
  );
};

export default ChampionshipModal;
