require("dotenv").config();
const express = require("express");
const cors = require("cors");
const conexion = require("./db"); // Importamos la conexión creada en db.js

const app = express();

// Middlewares globales
app.use(cors()); // Permitir peticiones desde el frontend
app.use(express.json()); // Habilitar la lectura de datos en formato JSON

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// ==========================================
// RUTAS DE PRODUCTOS
// ==========================================

app.get("/productos", (req, res) => {
  const sql = "SELECT * FROM productos";
  conexion.query(sql, (error, resultados) => {
    if (error) {
      console.error("Error al consultar:", error);
      return res.status(500).json({ mensaje: "Error al consultar los productos" });
    }
    res.json(resultados);
  });
});

app.post("/productos", (req, res) => {
  const { nombre, precio, stock } = req.body;
  const sql = "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)";
  conexion.query(sql, [nombre, precio, stock], (error, resultado) => {
    if (error) {
      console.error("Error al insertar:", error);
      return res.status(500).json({ mensaje: "Error al crear el producto" });
    }
    res.status(201).json({ mensaje: "Producto creado correctamente", id: resultado.insertId });
  });
});

app.put("/productos/:id", (req, res) => {
  const id = req.params.id;
  const { nombre, precio, stock } = req.body;
  const sql = "UPDATE productos SET nombre = ?, precio = ?, stock = ? WHERE id = ?";
  conexion.query(sql, [nombre, precio, stock, id], (error) => {
    if (error) {
      console.error("Error al actualizar:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el producto" });
    }
    res.json({ mensaje: "Producto actualizado correctamente" });
  });
});

app.delete("/productos/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM productos WHERE id = ?";
  conexion.query(sql, [id], (error) => {
    if (error) {
      console.error("Error al eliminar:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el producto" });
    }
    res.json({ mensaje: "Producto eliminado correctamente" });
  });
});

// ==========================================
// RUTAS DE MENSAJES (CORREGIDAS A TU BD)
// ==========================================

// 1. Obtener todos los mensajes
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

// 2. Crear un nuevo mensaje
app.post("/mensajes", (req, res) => {
  const { nombre_comple, correo, mensaje } = req.body;

  if (!nombre_comple || !correo || !mensaje) {
    return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
  }

  const sql = "INSERT INTO mensaje (nombre_comple, correo, mensaje) VALUES (?, ?, ?)";
  conexion.query(sql, [nombre_comple, correo, mensaje], (error, resultado) => {
    if (error) {
      console.error("Error al guardar mensaje:", error);
      return res.status(500).json({ mensaje: "Error al registrar el mensaje" });
    }
    res.status(201).json({ mensaje: "Mensaje enviado con éxito", id: resultado.insertId });
  });
});

// 3. Actualizar un mensaje
app.put("/mensajes/:id", (req, res) => {
  const id = req.params.id;
  const { nombre_comple, correo, mensaje } = req.body;

  const sql = "UPDATE mensaje SET nombre_comple = ?, correo = ?, mensaje = ? WHERE id = ?";
  conexion.query(sql, [nombre_comple, correo, mensaje, id], (error) => {
    if (error) {
      console.error("Error al actualizar mensaje:", error);
      return res.status(500).json({ mensaje: "Error al actualizar el mensaje" });
    }
    res.json({ mensaje: "Mensaje actualizado correctamente" });
  });
});

// 4. Eliminar un mensaje
app.delete("/mensajes/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM mensaje WHERE id = ?";
  conexion.query(sql, [id], (error) => {
    if (error) {
      console.error("Error al eliminar mensaje:", error);
      return res.status(500).json({ mensaje: "Error al eliminar el mensaje" });
    }
    res.json({ mensaje: "Mensaje eliminado correctamente" });
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});