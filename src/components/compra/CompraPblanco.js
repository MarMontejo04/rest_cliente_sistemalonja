import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios.js";

const CompraPescadoBlanco = () => {
  const navigate = useNavigate();
  const PRECIO_CAJA = 30;

  // Estados de Búsqueda de Cliente
  const [correoBusqueda, setCorreoBusqueda] = useState("");
  // null = no buscado, true = existe, false = no existe (y debe redirigir)
  const [clienteEncontrado, setClienteEncontrado] = useState(null); 
  const [datosCliente, setDatosCliente] = useState(null); // Almacena el objeto comprador si se encuentra

  // Inventario y Carga
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [imagenFondo, setImagenFondo] = useState(
    "https://images.unsplash.com/photo-1580910530099-e55c327801f6?q=80&w=1000&auto=format&fit=crop"
  ); 

  const [compra, guardarCompra] = useState({
    codigo_cpr: "", // ID del comprador que se llena después de la búsqueda exitosa
    id_lote: "",
    kilos: "",
    cajas: 0,
    precio_kilo: "",
    total_pescado: 0,
    total_cajas: 0,
    gran_total: 0,
    especieNombre: "",
    especieTipo: "",
  });

  const actualizarState = (e) => {
    guardarCompra({
      ...compra,
      [e.target.name]: e.target.value,
    });
  };

  const seleccionarLote = (e) => {
    const idLote = e.target.value;
    const loteEncontrado = inventario.find((l) => l._id === idLote);

    if (loteEncontrado) {
      guardarCompra((prev) => ({
        ...prev,
        id_lote: idLote,
        kilos: loteEncontrado.disponible,
        cajas: loteEncontrado.cajas,
        precio_kilo: loteEncontrado.precio,
        especieNombre: loteEncontrado.especie,
        especieTipo: loteEncontrado.tipo,
      }));
      setImagenFondo(loteEncontrado.imagen);
    } else {
      guardarCompra((prev) => ({
        ...prev,
        id_lote: "",
        kilos: "",
        cajas: 0,
        precio_kilo: "",
        especieNombre: "",
        especieTipo: "",
        total_pescado: 0,
        total_cajas: 0,
        gran_total: 0,
      }));
      setImagenFondo(
        "https://images.unsplash.com/photo-1580910530099-e55c327801f6?q=80&w=1000&auto=format&fit=crop"
      );
    }
    // Al cambiar de lote, se resetea la búsqueda de cliente
    setClienteEncontrado(null);
    setDatosCliente(null);
    guardarCompra((prev) => ({ ...prev, codigo_cpr: "" }));
  };

  useEffect(() => {
    const cargarLotes = async () => {
      const tipoPescado = "Pescado Blanco";

      try {
        setCargando(true);
        const respuesta = await clienteAxios.get(
          `/api/lote-especie/consulta-tpo/${encodeURIComponent(tipoPescado)}`
        );
        setInventario(respuesta.data);
      } catch (error) {
        console.error("Error al cargar lotes disponibles:", error);
        Swal.fire(
          "Aviso",
          "No se pudo conectar con el inventario en tiempo real.",
          "info"
        );
      } finally {
        setCargando(false);
      }
    };

    cargarLotes();
  }, []);

  // ----------------------------
  //  CÁLCULOS AUTOMÁTICOS
  // ----------------------------
  useEffect(() => {
    const { kilos, cajas, precio_kilo } = compra;
    if (kilos && precio_kilo) {
      const costoPescado = parseFloat(kilos) * parseFloat(precio_kilo);
      const costoEnvases = parseFloat(cajas) * PRECIO_CAJA;
      const totalFinal = costoPescado + costoEnvases;
      guardarCompra((prev) => ({
        ...prev,
        total_pescado: costoPescado.toFixed(2),
        total_cajas: costoEnvases.toFixed(2),
        gran_total: totalFinal.toFixed(2),
      }));
    }
  }, [compra.kilos, compra.cajas, compra.precio_kilo]);

  // ----------------------------
  //  BUSCAR CLIENTE POR CORREO (IMPLEMENTACIÓN)
  // ----------------------------
  const buscarCliente = async () => {
    if (!correoBusqueda) {
      Swal.fire({
        icon: "warning",
        title: "Correo requerido",
        text: "Escribe un correo para buscar.",
        confirmButtonColor: "var(--oro-principal)",
      });
      return;
    }

    try {
      // Intentar encontrar al comprador
      const res = await clienteAxios.get(
        `/api/comprador/consulta/${correoBusqueda}`
      );
      
      const data = res.data;
      
      // Si el backend devuelve el objeto del comprador (éxito)
      if (data && data._id) { 
        setClienteEncontrado(true);
        setDatosCliente(data);
        guardarCompra((prev) => ({
          ...prev,
          codigo_cpr: data._id, // Almacenar el ID del comprador encontrado
        }));
        
        Swal.fire({
          icon: "success",
          title: "Cliente encontrado",
          text: `Bienvenido ${data.nombre} ${data.apellido_paterno}`,
          timer: 1500,
          showConfirmButton: false,
        });
        return;
      }
      
      // Si la API responde OK pero sin datos (debería ser 404, pero cubrimos el caso)
      throw new Error("Cliente no encontrado.");
      
    } catch (err) {
      // Manejo de error (404 Not Found, fallo de API) -> Redireccionar
      console.error("Error al buscar comprador:", err);
      
      setClienteEncontrado(false);
      setDatosCliente(null);
      guardarCompra((prev) => ({ ...prev, codigo_cpr: "" }));
      
      // REDIRECCIÓN A VISTA DE CREACIÓN DE CLIENTE
      Swal.fire({
        icon: "info",
        title: "Cliente no registrado",
        text: `El correo ${correoBusqueda} no fue encontrado. Será redirigido para registrarlo.`,
        confirmButtonColor: "var(--oro-principal)",
      }).then(() => {
        // Redirigir y pasar el correo para precargar el formulario
        navigate(`/crearCliente`, { state: { correo: correoBusqueda } });
      });
    }
  };

  // ----------------------------
  //  PROCESAR VENTA (Solo si cliente encontrado)
  // ----------------------------
  const procesarVenta = async (e) => {
    e.preventDefault();

    if (!compra.id_lote) {
      Swal.fire({
        icon: "error",
        title: "Seleccione lote",
        text: "Debes seleccionar un lote antes de continuar.",
        confirmButtonColor: "var(--oro-principal)",
      });
      return;
    }
    
    // Validación CRUCIAL: Solo procesar si el cliente fue encontrado
    if (clienteEncontrado !== true || !compra.codigo_cpr) {
         Swal.fire({
            icon: "error",
            title: "Cliente no verificado",
            text: "Busque y verifique el correo del cliente antes de procesar la venta.",
            confirmButtonColor: "var(--oro-principal)",
          });
          return;
    }

    try {
      const payloadCompra = {
        codigo_cpr: compra.codigo_cpr, // ID del cliente encontrado
        id_lte: compra.id_lote,
        precio_kilo_final: parseFloat(compra.precio_kilo),
        precio_total: parseFloat(compra.gran_total),
      };

      const resCompra = await clienteAxios.post(
        "/api/compra/registrar",
        payloadCompra
      );

      Swal.fire({
        title: "Venta registrada",
        text: `Total: $${resCompra.data.compra.precio_total}`,
        icon: "success",
        confirmButtonColor: "var(--oro-principal)",
        background: "#042B35",
        color: "#F0F0F0",
      });

      // Redirigir a ReciboVenta
      const folioGenerado = resCompra.data.compra._id;
      navigate(`/compras/recibo/${folioGenerado}`, {
        state: {
          folio: folioGenerado,
          datosVenta: {
             ...compra,
             nombre_cliente: datosCliente.nombre,
             apellido_paterno: datosCliente.apellido_paterno
          }
        },
      });
    } catch (error) {
      console.error("Error procesando venta:", error);
      const mensaje =
        error.response?.data?.mensaje || "Error al procesar la venta";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: mensaje,
        confirmButtonColor: "var(--oro-principal)",
      });
    }
  };

  return (
    <div
      className="container-fluid p-0 position-relative"
      style={{ backgroundColor: "var(--color-fondo)" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "80vh",
          backgroundImage: `linear-gradient(to right, rgba(2, 30, 38, 0.95) 0%, rgba(2, 30, 38, 0.85) 40%, rgba(2, 30, 38, 0.4) 100%), url("${imagenFondo}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image 0.6s ease-in-out",
          backgroundAttachment: "fixed",
          zIndex: 0,
        }}
      ></div>

      <div
        className="container position-relative"
        style={{
          zIndex: 2,
          minHeight: "80vh",
          paddingTop: "5vh",
          paddingBottom: "5vh",
        }}
      >
        <div className="row h-100 align-items-center justify-content-between">
          {/* COLUMNA IZQUIERDA */}
          <div className="col-lg-5 mb-5 mb-lg-0 text-white animate__animated animate__fadeInLeft">
            <h4
              className="text-gold text-uppercase letter-spacing-2 mb-4"
              style={{
                borderBottom: "2px solid var(--oro-oscuro)",
                display: "inline-block",
                paddingBottom: "10px",
              }}
            >
              <i className="fas fa-fish me-2"></i> Pescado Blanco
            </h4>

            {compra.id_lote ? (
              <div>
                <h1
                  className="display-2 fw-bold mb-2 text-white"
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    textShadow: "0 4px 10px rgba(0,0,0,0.5)",
                  }}
                >
                  {compra.especieNombre}
                </h1>
                <h2
                  className="display-5 text-gold mb-4 fst-italic"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  {compra.especieTipo}
                </h2>

                <div className="d-flex gap-4 mt-5">
                  <div
                    className="text-center px-4 py-3 border border-gold rounded"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    <i className="fas fa-weight-hanging fs-2 text-gold mb-2"></i>
                    <div className="small text-uppercase text-white-50 text-premium-lg">
                      Peso Neto
                    </div>
                    <div className="text-value-lg text-white">
                      {compra.kilos} kg
                    </div>
                  </div>
                  <div
                    className="text-center px-4 py-3 border border-gold rounded"
                    style={{
                      background: "rgba(0,0,0,0.3)",
                      backdropFilter: "blur(5px)",
                    }}
                  >
                    <i className="fas fa-box-open fs-2 text-gold mb-2"></i>
                    <div className="small text-uppercase text-white-50 text-premium-lg">
                      Cajas
                    </div>
                    <div className="text-value-lg text-white">
                      {compra.cajas} pzas
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-top border-secondary w-75">
                  <div className="text-white-50 text-uppercase text-premium-lg mb-1">
                    Precio por Kilo
                  </div>
                  <div className="text-gold display-5 fw-bold">
                    ${compra.precio_kilo}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h1
                  className="display-3 fw-bold mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Seleccione su Producto
                </h1>
                <p className="lead text-white-50 fs-4">
                  Explore nuestro inventario fresco disponible para comenzar la
                  venta del día.
                </p>
              </div>
            )}
          </div>
          {/* COLUMNA DERECHA: FORMULARIO COMPLETO */}
          <div className="col-lg-6 animate__animated animate__fadeInRight">
            <div
              className="card-premium shadow-lg border-gold"
              style={{ background: "rgba(4, 43, 53, 0.95)" }}
            >
              <div className="card-body p-4 p-xl-5">
                <form onSubmit={procesarVenta}>
                  <div className="mb-5">
                    <label className="form-label text-gold fw-bold text-uppercase small mb-2">
                      Producto Disponible
                    </label>
                    <select
                      className="form-select form-select-lg text-white border-gold"
                      style={{
                        backgroundColor: "rgba(0,0,0,0.5)",
                        height: "60px",
                        fontSize: "1.3rem",
                      }}
                      name="id_lote"
                      onChange={seleccionarLote}
                      required
                    >
                      <option value="">-- Catálogo de Pescado Blanco --</option>
                      {inventario.map((lote) => (
                        <option key={lote._id} value={lote._id}>
                          {lote.especie} - {lote.tipo} | {lote.disponible}kg
                          disp.
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* PASO 2: VERIFICAR COMPRADOR */}
                  {compra.id_lote && (
                    <div className="animate__animated animate__fadeIn">
                      <label className="form-label text-gold fw-bold text-uppercase small mb-2">
                        2. Identificar Cliente (Correo)
                      </label>
                      <div className="input-group mb-4">
                        <input
                          type="email"
                          className="form-control bg-transparent text-white border-secondary"
                          placeholder="correo@cliente.com"
                          value={correoBusqueda}
                          onChange={(e) => setCorreoBusqueda(e.target.value)}
                          // Deshabilitar después de encontrar el cliente
                          disabled={clienteEncontrado === true}
                        />
                        <button
                          className="btn btn-outline-warning"
                          type="button"
                          onClick={buscarCliente}
                          disabled={clienteEncontrado === true}
                        >
                          <i className="fas fa-search me-2"></i> Verificar
                        </button>

                        {/* Botón para resetear búsqueda */}
                        {clienteEncontrado !== null && (
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => {
                              setClienteEncontrado(null);
                              setDatosCliente(null);
                              setCorreoBusqueda("");
                              guardarCompra((prev) => ({
                                ...prev,
                                codigo_cpr: "",
                              }));
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        )}
                      </div>
                      
                      {/* ESTADO DEL CLIENTE */}
                      {clienteEncontrado === true && datosCliente && (
                        <div className="alert alert-success bg-transparent border-success text-success small">
                          <i className="fas fa-check-circle me-2"></i> Cliente
                          registrado:{" "}
                          <strong>
                            {datosCliente.nombre} {datosCliente.apellido_paterno}
                          </strong>
                          .
                        </div>
                      )}
                      {clienteEncontrado === false && (
                         <div className="alert alert-info bg-transparent border-info text-info small">
                          <i className="fas fa-info-circle me-2"></i> Cliente
                          no encontrado. 
                        </div>
                      )}

                      {/* PASO 3: CAMPOS DE COMPRA (solo si el cliente fue encontrado) */}
                      {clienteEncontrado === true && (
                        <>
                          <div className="mb-3 mt-4">
                            <label className="form-label text-white-50 small text-uppercase">
                              3. Kilos
                            </label>
                            <input
                              type="number"
                              className="form-control bg-transparent text-white border-secondary"
                              name="kilos"
                              value={compra.kilos}
                              onChange={actualizarState}
                              required
                            />
                          </div>

                          <div className="mb-3">
                            <label className="form-label text-white-50 small text-uppercase">
                              Cajas
                            </label>
                            <input
                              type="number"
                              className="form-control bg-transparent text-white border-secondary"
                              name="cajas"
                              value={compra.cajas}
                              onChange={actualizarState}
                              required
                            />
                          </div>
                          <div className="mt-3"></div>
                        </>
                      )}
                    </div>
                  )}
                  {/* BOTÓN FINAL */}
                  {compra.id_lote && clienteEncontrado === true && (
                    <button
                      type="submit"
                      className="btn-premium w-100 py-4 fs-4 fw-bold shadow-lg d-flex justify-content-between align-items-center px-5"
                    >
                      <span>CONFIRMAR COMPRA</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECCIÓN INFO */}
      <section
        className="py-5 bg-animated"
        style={{
          borderTop: "4px solid var(--oro-principal)",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="container text-center">
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <h2
                className="text-gold mb-3 display-4"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Pescado Blanco
              </h2>
              <div
                className="mx-auto mb-4"
                style={{
                  width: "150px",
                  height: "3px",
                  backgroundColor: "var(--oro-principal)",
                }}
              ></div>
              <p className="lead text-white-50 fs-5">
                Variedad de pescado bajo en grasa y sabor suave, ideal para la
                cocina diaria y gourmet. Capturado en aguas profundas del Golfo.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default CompraPescadoBlanco;