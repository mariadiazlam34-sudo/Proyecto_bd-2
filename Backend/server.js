require('dotenv').config();
const express = require("express");
const cors = require("cors");
const conexion = require("./db"); // Importamos la conexión creada en db.js

const app = express();

// Middlewares globales
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Habilitar la lectura de datos en formato JSON en el cuerpo (req.body)

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// 1. Obtener todos los productos (READ)
app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    // Retornamos el array de productos como JSON al cliente
    res.json(resultados);
  });
});

// 2. Crear un nuevo producto (CREATE)
app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;

  // Consulta parametrizada con '?' para prevenir inyección SQL
  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  const valores = [nombre, precio, stock];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }

    res.status(201).json({
      mensaje: "Producto creado correctamente",
      id: resultado.insertId,
    });
  });
});

// 3. Actualizar un producto existente (UPDATE)
app.put("/productos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;

  const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  const valores = [nombre, precio, stock, id];

  conexion.query(sql, valores, (error, resultado) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

// 4. Eliminar un producto (DELETE)
app.delete("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE id = ?";

  conexion.query(sql, [id], (error, resultado) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

//  MENSAJES DE CONTACTO
// 5. READ
app.get("/mensajes", (req, res) => {
  const sql = "SELECT * FROM mensaje ORDER BY fecha_mensaje DESC";

  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar mensajes:", error);
      return res.status(500).json({ mensaje: "Error al consultar los mensajes" });
    }
    res.json(resultados);
  });
});

// 6. CREATE
app.post("/mensajes", (req, res) => {
  const { nombre_comple, correo, mensaje } = req.body;

  if (!nombre_comple || !correo || !mensaje) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO mensaje (nombre_comple, correo, mensaje) VALUES (?, ?, ?)";

  conexion.query(sql, [nombre_comple, correo, mensaje], (error, resultado) => {
    if (error) {
      //para correos duplicados
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ mensaje: "Ese correo ya envió un mensaje" });
      }
      console.error("Error al insertar mensaje:", error);
      return res.status(500).json({ mensaje: "Error al guardar el mensaje" });
    }

    res.status(201).json({
      mensaje: "Mensaje guardado correctamente",
      id: resultado.insertId,
    });
  });
});

// 7. UPDATE
app.put("/mensajes/:id", (req, res) => {
  const id = req.params.id;
  const { nombre_comple, correo, mensaje } = req.body;

  if (!nombre_comple || !correo || !mensaje) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }
  const sql = "UPDATE mensaje SET nombre_comple = ?, correo = ?, mensaje = ? WHERE id = ?";

  conexion.query(sql, [nombre_comple, correo, mensaje, id], (error) => {
    if (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ mensaje: "Ese correo ya está registrado" });
      }
      console.error("Error al actualizar mensaje:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el mensaje" });
    }
    res.json({ mensaje: "Mensaje actualizado correctamente" });
  });
});

// 8. DELETE
app.delete("/mensajes/:id", (req, res) => {
  const sql = "DELETE FROM mensaje WHERE id = ?";

  conexion.query(sql, [req.params.id], (error) => {
    if (error) {
      console.error("Error al eliminar mensaje:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el mensaje" });
    }
    res.json({ mensaje: "Mensaje eliminado correctamente" });
  });
});

// Iniciar servidor en el puerto 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

