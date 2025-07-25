import React, { useState, useEffect } from 'react';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Imagina que estas son tus imágenes (en un proyecto real, podrías obtenerlas de una API)
  const images = [
    { id: 1, src: '/placeholder-pos-1.jpg', alt: 'Punto de venta moderno' },
    { id: 2, src: '/placeholder-pos-2.jpg', alt: 'Interfaz fácil de usar' },
    { id: 3, src: '/placeholder-pos-3.jpg', alt: 'Reportes detallados' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative h-64 md:h-96 overflow-hidden bg-gray-100">
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        >
          <img 
            src={image.src} 
            alt={image.alt}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-white/50'}`}
            aria-label={`Ir a la imagen ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;