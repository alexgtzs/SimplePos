import React, { useState, useEffect } from 'react';

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);
  
  // Configuración del carrusel (puedes ajustar estos valores)
  const config = {
    interval: 5000, // 5 segundos entre transiciones
    transitionDuration: 1000 // 1 segundo de duración de la animación
  };

  // Cargar imágenes dinámicamente
  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageModules = import.meta.glob('../../assets/images/*.{jpg,jpeg,png}');
        const imagePaths = Object.keys(imageModules);
        
        const loadedImages = await Promise.all(
          imagePaths.map(async (path) => {
            const fileName = path.split('/').pop().replace(/\.[^/.]+$/, '');
            const imageModule = await imageModules[path]();
            return {
              id: fileName,
              src: imageModule.default,
              alt: `Imagen ${fileName.replace(/-/g, ' ')}`
            };
          })
        );
        
        setImages(loadedImages);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadImages();
  }, []);

  // Auto-rotación de imágenes
  useEffect(() => {
    if (images.length <= 1) return; // No rotar si hay 1 o menos imágenes
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, config.interval);

    return () => clearInterval(interval); // Limpieza al desmontar
  }, [images.length]); // Se reinicia cuando cambia el número de imágenes

  if (images.length === 0) {
    return (
      <div className="h-64 md:h-96 bg-gray-100 flex items-center justify-center">
        <span className="text-gray-500">Cargando imágenes...</span>
      </div>
    );
  }

  return (
    <div className="relative h-64 md:h-96 overflow-hidden bg-gray-100">
      {/* Contenedor de imágenes */}
      {images.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-${config.transitionDuration} ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDuration: `${config.transitionDuration}ms` }}
        >
          <img 
            src={image.src} 
            alt={image.alt}
            className="w-full h-full object-cover"
            draggable="false" // Mejora la experiencia en móviles
          />
        </div>
      ))}

      {/* Indicadores/puntos */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
              aria-label={`Mostrar imagen ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;