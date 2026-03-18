import React, { useState, useRef } from "react";
import { Share2, Download, Loader2 } from "lucide-react";
import { getTeamLogo } from "../utils/teamLogos";

const ShareResultsButton = ({ matchday, matches, predictions }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const canvasRef = useRef(null);

    // Helper to load an image from a URL
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            if (!src) return resolve(null);
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.onload = () => resolve(img);
            img.onerror = () => {
                console.warn(`Could not load image: ${src}`);
                resolve(null); // Resolve to null instead of rejecting, to continue rendering
            };
            img.src = src;
        });
    };

    const drawLogo = (ctx, img, centerX, centerY, maxBoxSize) => {
        if (!img) return;
        const ratio = img.width / img.height;
        let drawWidth, drawHeight;
        if (ratio > 1) {
            drawWidth = maxBoxSize;
            drawHeight = maxBoxSize / ratio;
        } else {
            drawHeight = maxBoxSize;
            drawWidth = maxBoxSize * ratio;
        }
        ctx.drawImage(img, centerX - drawWidth / 2, centerY - drawHeight / 2, drawWidth, drawHeight);
    };

    const generateImage = async () => {
        if (!matches || matches.length === 0) {
            alert("No hay partidos para mostrar.");
            return null;
        }

        try {
            setIsGenerating(true);
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Load background
            const bgImg = await loadImage("/resultadosxfecha.png");
            if (!bgImg) throw new Error("No se pudo cargar la imagen de fondo.");

            // Set canvas size to match background
            const width = bgImg.width;   // 1080
            const height = bgImg.height; // 1920
            canvas.width = width;
            canvas.height = height;

            // Draw background
            ctx.drawImage(bgImg, 0, 0, width, height);

            // Calibrated positions for the 1080x1920 template based on visual feedback from previous steps
            // Slot 1 (Title): Centro horizontal del cuadro negro superior
            const titleY = 160;
            // Slots 2-7 (Matches): Centered in each of the 6 remaining match slots
            // Calibrated average Y centers for the ovals based on template
            const matchYPositions = [360, 625, 890, 1155, 1420, 1685];

            // Draw Matchday Title
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "#ffffff";
            ctx.font = "bold 75px 'Inter', sans-serif";
            ctx.strokeStyle = "rgba(0, 0, 0, 0.5)";
            ctx.lineWidth = 5;
            ctx.strokeText(matchday.toUpperCase(), width / 2, titleY);
            ctx.fillText(matchday.toUpperCase(), width / 2, titleY);

            // Pre-load all team logos
            const logoPromises = [];
            // Max 6 matches as per template slots
            const matchesToShow = matches.slice(0, 6);

            for (const match of matchesToShow) {
                logoPromises.push(loadImage(getTeamLogo(match.home_team)));
                logoPromises.push(loadImage(getTeamLogo(match.away_team)));
            }
            const loadedLogos = await Promise.all(logoPromises);

            // Draw each match
            matchesToShow.forEach((match, index) => {
                const y = matchYPositions[index];

                const homeLogoImg = loadedLogos[index * 2];
                const awayLogoImg = loadedLogos[index * 2 + 1];

                // Find user prediction for this match
                const prediction = predictions?.find(p => p.match_id === match.id);

                const logoSize = 165; // Slightly smaller logos
                const homeLogoCenterX = 230;
                const awayLogoCenterX = 850;

                // Draw Logos using helper to fix aspect ratio/deformation
                if (homeLogoImg) {
                    drawLogo(ctx, homeLogoImg, homeLogoCenterX, y, logoSize);
                } else {
                    ctx.fillStyle = "#333333";
                    ctx.font = "bold 55px sans-serif";
                    ctx.fillText(match.home_team.substring(0, 3).toUpperCase(), homeLogoCenterX, y);
                }

                if (awayLogoImg) {
                    drawLogo(ctx, awayLogoImg, awayLogoCenterX, y, logoSize);
                } else {
                    ctx.fillStyle = "#333333";
                    ctx.font = "bold 55px sans-serif";
                    ctx.fillText(match.away_team.substring(0, 3).toUpperCase(), awayLogoCenterX, y);
                }

                // Center Text: Scores or "VS"
                ctx.textAlign = "center";
                ctx.font = "bold 110px sans-serif"; // Reduced large font
                ctx.fillStyle = "#ffffff";
                ctx.strokeStyle = "rgba(0, 0, 0, 0.8)";
                ctx.lineWidth = 6;

                let centerText = "V  S";
                let isPrediction = false;

                if (match.status === "finished") {
                    centerText = `${match.home_score}   ${match.away_score}`;
                } else if (prediction) {
                    centerText = `${prediction.home_score}   ${prediction.away_score}`;
                    isPrediction = true;
                }

                ctx.strokeText(centerText, width / 2, y);
                ctx.fillText(centerText, width / 2, y);

                if (isPrediction) {
                    ctx.font = "bold 30px sans-serif";
                    ctx.fillStyle = "#a8f5ba"; // light green to indicate it's user's prediction
                    ctx.fillText("(PREDICCIÓN)", width / 2, y + 90);
                }
            });

            return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                    resolve(blob);
                }, "image/png");
            });

        } catch (error) {
            console.error("Error generating image:", error);
            alert("Hubo un error al generar la imagen.");
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    const handleShare = async () => {
        const blob = await generateImage();
        if (!blob) return;

        const file = new File([blob], `prode_${matchday.replace(/\s+/g, "_").toLowerCase()}.png`, { type: "image/png" });

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
            try {
                await navigator.share({
                    title: `Resultados - ${matchday}`,
                    text: `Resultados ${matchday}`,
                    files: [file],
                });
            } catch (error) {
                if (error.name !== "AbortError") {
                    console.error("Error sharing:", error);
                    downloadBlob(blob, file.name);
                }
            }
        } else {
            // Fallback to download
            downloadBlob(blob, file.name);
        }
    };

    const downloadBlob = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <>
            <button
                onClick={handleShare}
                disabled={isGenerating || !matchday || matches.length === 0}
                className="flex items-center gap-2 bg-club-blue hover:bg-blue-700 text-black font-bold py-2 px-4 rounded-md transition-colors border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
                title="Compartir resultados de la jornada"
            >
                {isGenerating ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <Share2 size={20} />
                )}
                <span className="hidden sm:inline">Compartir</span>
            </button>

            {/* Hidden canvas for off-screen rendering */}
            <canvas ref={canvasRef} style={{ display: "none" }} />
        </>
    );
};

export default ShareResultsButton;
