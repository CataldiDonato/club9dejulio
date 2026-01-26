import React, { useState } from 'react';

const ImageCarousel = ({ images, altText, caption, maxWidth = 'max-w-3xl', onImageClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className={`relative w-full ${maxWidth} mx-auto`}>
      {/* Imagen */}
      <div 
        className={`relative overflow-hidden rounded-lg shadow-xl ${onImageClick ? 'cursor-pointer' : ''}`}
        onClick={() => onImageClick && onImageClick(images[currentIndex].src)}
      >
        <img
          src={images[currentIndex].src}
          alt={`${altText} - ${images[currentIndex].label}`}
          className="w-full h-auto rounded-lg"
        />
        
        {/* Indicador de versión */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-center font-semibold">
            {images[currentIndex].label}
          </p>
        </div>
      </div>

      {/* Controles */}
      <div className="flex items-center justify-between mt-4">
        {/* Botón Anterior */}
        <button
          onClick={goToPrevious}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
          aria-label="Imagen anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Anterior</span>
        </button>

        {/* Indicadores de puntos */}
        <div className="flex gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-black w-8' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ir a imagen ${index + 1}`}
            />
          ))}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={goToNext}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
          aria-label="Imagen siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Leyenda */}
      {caption && (
        <p className="text-sm text-gray-600 text-center mt-3 italic">
          {caption}
        </p>
      )}
    </div>
  );
};

export default ImageCarousel;
