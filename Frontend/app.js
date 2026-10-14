const API_URL = "http://localhost:3000";

// Elementos del DOM
const listaProductos = document.getElementById("listaProductos");
const formulario = document.getElementById("formularioProducto");
const productoId = document.getElementById("productoId");
const nombreInput = document.getElementById("nombre");
const precioInput = document.getElementById("precio");
const stockInput = document.getElementById("stock");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tituloFormulario = document.getElementById("tituloFormulario");
const formContacto = document.getElementById("formularioContacto");
const listaMensajes = document.getElementById("listaMensajes");

// 1. Función para consultar los productos y mostrarlos en el DOM (READ)
async function cargarProductos() {
  if (!listaProductos) return;

  try {
    const respuesta = await fetch(`${API_URL}/productos`);
    const productos = await respuesta.json();

    listaProductos.innerHTML = "";

    if (productos.length === 0) {
      listaProductos.innerHTML = "<p style='color: #64748b;'>No hay productos registrados.</p>";
      return;
    }

    productos.forEach((producto) => {
      const elemento = document.createElement("div");
      elemento.classList.add("producto");

      elemento.innerHTML = `
        <div>
          <h3>${producto.nombre}</h3>
          <p class="producto-precio">Precio: $${producto.precio}</p>
          <p>Stock: ${producto.stock} unidades</p>
        </div>
        <div class="acciones">
          <button class="btn-editar" onclick="cargarEnFormulario(${producto.id}, '${producto.nombre}', ${producto.precio}, ${producto.stock})">Editar</button>
          <button class="btn-eliminar" onclick="eliminarProducto(${producto.id})">Eliminar</button>
        </div>
      `;

      listaProductos.appendChild(elemento);
    });
  } catch (error) {
    console.error("Error al cargar productos:", error);
  }
}

// 2. Cargar datos del producto en el formulario para editar (UPDATE - Paso 1)
function cargarEnFormulario(id, nombre, precio, stock) {
  productoId.value = id;
  nombreInput.value = nombre;
  precioInput.value = precio;
  stockInput.value = stock;

  tituloFormulario.textContent = "Editar Producto";
  btnGuardar.textContent = "Actualizar Producto";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

// Cancelar edición y restaurar formulario
function cancelarEdicion() {
  formulario.reset();
  productoId.value = "";
  tituloFormulario.textContent = "Registrar Producto";
  btnGuardar.textContent = "Guardar Producto";
  btnCancelar.style.display = "none";
}

if (btnCancelar && formulario) {
  btnCancelar.addEventListener("click", cancelarEdicion);
}

// 3. Guardar o Actualizar según si hay un ID seleccionado (CREATE o UPDATE)
if (formulario) {
  formulario.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que la página se recargue

    const id = productoId.value;
    const nombre = nombreInput.value;
    const precio = precioInput.value;
    const stock = stockInput.value;

    try {
      if (id) {
        // MODO ACTUALIZAR (PUT)
        await fetch(`${API_URL}/productos/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      } else {
        // MODO CREAR (POST)
        await fetch(`${API_URL}/productos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nombre, precio, stock }),
        });
      }

      cancelarEdicion(); // Limpiar formulario y restaurar botones
      cargarProductos(); // Refrescar la lista en pantalla
    } catch (error) {
      console.error("Error al guardar el producto:", error);
    }
  });
}

// 4. Eliminar un producto (DELETE)
async function eliminarProducto(id) {
  const confirmar = confirm("¿Deseas eliminar este producto de la base de datos?");
  if (!confirmar) return;

  try {
    await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });

    // Si estábamos editando ese mismo producto, cancelamos la edición
    if (productoId.value == id) {
      cancelarEdicion();
    }

    cargarProductos(); // Refrescar la lista en pantalla
  } catch (error) {
    console.error("Error al eliminar producto:", error);
  }
}

// MENSAJES DE CONTACTO 
const mensajeIdInput = document.getElementById("mensajeId");
const correoInput = document.getElementById("correo");
const mensajeInput = document.getElementById("mensaje");

function formatearFecha(valor) {
  const fecha = new Date(valor);
  if (!valor || isNaN(fecha)) return "sin fecha";
  return fecha.toLocaleString("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// READ: consultar y mostrar mensajes
async function cargarMensajes() {
  if (!listaMensajes) return;

  try {
    const respuesta = await fetch(`${API_URL}/mensajes`);
    const mensajes = await respuesta.json();
    mostrarMensajes(mensajes);
  } catch (error) {
    console.error("Error al cargar mensajes:", error);
    listaMensajes.innerHTML = "<p class='vacio'>No se pudo conectar con el servidor.</p>";
  }
}

function mostrarMensajes(mensajes) {
  listaMensajes.innerHTML = "";

  if (mensajes.length === 0) {
    listaMensajes.innerHTML = "<p class='vacio'>Aún no hay mensajes.</p>";
    return;
  }

  mensajes.forEach((m) => {
    const tarjeta = document.createElement("div");
    tarjeta.className = "mensaje-item";

    const nombre = document.createElement("h3");
    nombre.textContent = m.nombre_comple;

    const correo = document.createElement("span");
    correo.className = "correo";
    correo.textContent = m.correo;

    const texto = document.createElement("p");
    texto.textContent = m.mensaje;

    const fecha = document.createElement("p");
    fecha.className = "fecha";
    fecha.textContent = "Enviado: " + formatearFecha(m.fecha_mensaje);

    const acciones = document.createElement("div");
    acciones.className = "acciones-mensaje";

    const btnEditar = document.createElement("button");
    btnEditar.className = "btn-editar";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => editarMensaje(m));

    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn-eliminar";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarMensaje(m.id));

    acciones.append(btnEditar, btnEliminar);
    tarjeta.append(nombre, correo, texto, fecha, acciones);
    listaMensajes.appendChild(tarjeta);
  });
}

// Cargar un mensaje en el formulario para editarlo
function editarMensaje(m) {
  mensajeIdInput.value = m.id;
  nombreInput.value = m.nombre_comple;
  correoInput.value = m.correo;
  mensajeInput.value = m.mensaje;

  tituloFormulario.textContent = "Editar mensaje";
  btnGuardar.textContent = "Actualizar mensaje";
  btnCancelar.style.display = "block";
  nombreInput.focus();
}

function cancelarEdicionMensaje() {
  formContacto.reset();
  mensajeIdInput.value = "";
  tituloFormulario.textContent = "Contacto";
  btnGuardar.textContent = "Enviar mensaje";
  btnCancelar.style.display = "none";
}

// CREATE / UPDATE
if (formContacto) {
  btnCancelar.addEventListener("click", cancelarEdicionMensaje);

  formContacto.addEventListener("submit", async (event) => {
    event.preventDefault();

    const id = mensajeIdInput.value;
    const datos = {
      nombre_comple: nombreInput.value.trim(),
      correo: correoInput.value.trim(),
      mensaje: mensajeInput.value.trim(),
    };

    try {
      const respuesta = await fetch(id ? `${API_URL}/mensajes/${id}` : `${API_URL}/mensajes`, {
        method: id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        alert(resultado.mensaje || "No se pudo guardar el mensaje");
        return;
      }

      cancelarEdicionMensaje();
      cargarMensajes();
    } catch (error) {
      console.error("Error al guardar el mensaje:", error);
      alert("No se pudo conectar con el servidor");
    }
  });
}

// DELETE
async function eliminarMensaje(id) {
  if (!confirm("¿Eliminar este mensaje?")) return;

  try {
    const respuesta = await fetch(`${API_URL}/mensajes/${id}`, { method: "DELETE" });
    if (!respuesta.ok) {
      alert("No se pudo eliminar el mensaje");
      return;
    }
    cargarMensajes();
  } catch (error) {
    console.error("Error al eliminar mensaje:", error);
  }
}

// Llamado inicial al cargar la página
cargarProductos();
cargarMensajes();