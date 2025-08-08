-- Tabla: Categorías
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla: Marcas
CREATE TABLE marcas (
    id_marca SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla: Productos
CREATE TABLE productos (
    id_producto SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_base DECIMAL(10, 2) NOT NULL,
    sku VARCHAR(50) UNIQUE,
    codigo_barras VARCHAR(50) UNIQUE,
    id_categoria INT,
    id_marca INT,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria),
    FOREIGN KEY (id_marca) REFERENCES marcas(id_marca)
);

-- Tabla: Inventario
CREATE TABLE inventario (
    id_inventario SERIAL PRIMARY KEY,
    id_producto INT,
    cantidad INT NOT NULL DEFAULT 0,
    ubicacion VARCHAR(100),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

-- Tabla: Imágenes del producto
CREATE TABLE imagenes_producto (
    id_imagen SERIAL PRIMARY KEY,
    id_producto INT,
    url_imagen TEXT NOT NULL,
    descripcion TEXT,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);
