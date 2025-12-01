import clienteAxios from "../../config/axios.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CompraPescadoAzul = () => {
  const navigate = useNavigate();

  const PRECIO_CAJA = 30;

  // Estado del inventario (se llena desde la API)
  const [inventario, setInventario] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Imagen de fondo inicial
  const [imagenFondo, setImagenFondo] = useState("/img/fondoAzul.jpg");

  // Estado de la compra + Datos del Cliente
  const [compra, guardarCompra] = useState({
    id_lote: "",
    // --- NUEVOS CAMPOS PARA EL CLIENTE ---
    nombre_cliente: "",
    apellido_paterno: "",
    apellido_materno: "",
    direccion: "",
    correo: "",
    // -------------------------------------
    kilos: "",
    cajas: 0,
    precio_kilo: "",
    total_pescado: 0,
    total_cajas: 0,
    gran_total: 0,
    especieNombre: "",
    especieTipo: "",
  });

  // Función para actualizar cualquier campo del formulario (incluyendo cliente)
  const actualizarState = (e) => {
    guardarCompra({
      ...compra,
      [e.target.name]: e.target.value
    });
  };

  const seleccionarLote = (e) => {
    const idLote = e.target.value;
    const loteEncontrado = inventario.find((l) => l._id === idLote);

    if (loteEncontrado) {
      guardarCompra({
        ...compra,
        id_lote: idLote,
        kilos: loteEncontrado.disponible,
        cajas: loteEncontrado.cajas,
        precio_kilo: loteEncontrado.precio,
        especieNombre: loteEncontrado.especie,
        especieTipo: loteEncontrado.tipo,
      });
      setImagenFondo(loteEncontrado.imagen);
    } else {
      // Resetear datos del lote pero MANTENER datos del cliente
      guardarCompra(prev => ({
        ...prev,
        id_lote: "",
        kilos: "",
        cajas: 0,
        precio_kilo: "",
        especieNombre: "",
        especieTipo: "",
      }));
      setImagenFondo("https://images.unsplash.com/photo-1516683037151-9a17603a8ce4?q=80&w=1000&auto=format&fit=crop");
    }
  };

  // Cargar lotes desde la API al iniciar
  useEffect(() => {
    const cargarLotes = async () => {
      const tipoPescado = "Pescado Azul";

      try {
        setCargando(true);
        const respuesta = await clienteAxios.get(
          `/api/lote-especie/consulta-tpo/${encodeURIComponent(tipoPescado)}`
        );
        setInventario(respuesta.data);
      } catch (error) {
        console.error("Error al cargar lotes disponibles:", error);
        // Opcional: Poner datos dummy si falla la API para que no se vea vacío en pruebas
        /* setInventario([
             { _id: 'A1', especie: 'Atún (Offline)', tipo: 'Aleta Amarilla', precio: 180, disponible: 200.0, cajas: 8, imagen: '...' }
        ]); */
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

  // Recalcular totales cuando cambian kilos/cajas
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

  const procesarVenta = async (e) => {
    e.preventDefault();

    // Validación completa
    if (!compra.id_lote || !compra.nombre_cliente || !compra.apellido_paterno || !compra.direccion) {
      return Swal.fire(
        "Datos Incompletos",
        "Por favor complete la información del cliente y seleccione un producto.",
        "warning"
      );
    }

    const precio_kilo_final = parseFloat(compra.precio_kilo);
    const precio_total = parseFloat(compra.gran_total || 0);

    // Payload para tu API (ajustado para incluir datos del cliente si tu backend lo soporta así)
    // Nota: Si tu backend espera crear el cliente primero, la lógica sería un poco distinta.
    // Asumiremos que envías todo junto o que usas el código hardcodeado como tenías.
    
    const payload = {
      codigo_cpr: '691ea276ba79be1daaf7cb39', // Tu ID hardcodeado de prueba (cuidado con esto en prod)
      id_lte: compra.id_lote,
      precio_kilo_final,
      precio_total,
      // Si tu backend acepta guardar cliente al vuelo:
      // cliente: { ... } 
    };

    try {
      const respuesta = await clienteAxios.post(
        `/api/compra/registrar`,
        payload
      );

      const data = respuesta.data;

      if (data.compra && data.compra._id) {
        Swal.fire({
          title: "Venta Exitosa",
          text: `Total a cobrar: $${data.compra.precio_total}`,
          icon: "success",
          confirmButtonColor: "var(--oro-principal)",
          background: "#042B35",
          color: "#F0F0F0",
        }).then(() => {
          navigate(`/compras/recibo/${data.compra._id}`);
        });
      } else {
        Swal.fire("Error en el Registro", data.mensaje || "Respuesta inesperada", "error");
      }
    } catch (error) {
      console.error("Error de conexión:", error);
      Swal.fire("Error", "Problema con el servidor.", "error");
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
        style={{ zIndex: 2, minHeight: "80vh", paddingTop: "5vh", paddingBottom: "5vh" }}
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
              <i className="fas fa-water me-2"></i> Pescado Azul
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
                  {cargando ? "Cargando inventario..." : "Alta calidad en pescados azules, ricos en Omega-3."}
                </p>
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA */}
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
                      disabled={cargando}
                    >
                      <option value="">
                        {cargando ? "Cargando..." : "-- Seleccionar Azul --"}
                      </option>
                      {inventario.map((lote) => (
                        <option key={lote._id} value={lote._id}>
                          {lote.especie} - {lote.tipo} | ${lote.precio}/kg
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* FORMULARIO DE CLIENTE (INTEGRADO) */}
                  {compra.id_lote && (
                    <div className="animate__animated animate__fadeIn">
                      <h5 className="text-gold mb-4 border-bottom border-secondary pb-2" style={{fontFamily: "'Cinzel', serif"}}>Datos del Cliente</h5>
                      
                      <div className="mb-3">
                          <label className="form-label text-white-50 small text-uppercase">Nombre</label>
                          <input type="text" className="form-control bg-transparent text-white border-secondary" name="nombre_cliente" onChange={actualizarState} required />
                      </div>
                      
                      <div className="row mb-3">
                          <div className="col-6">
                              <label className="form-label text-white-50 small text-uppercase">Ap. Paterno</label>
                              <input type="text" className="form-control bg-transparent text-white border-secondary" name="apellido_paterno" onChange={actualizarState} required/>
                          </div>
                          <div className="col-6">
                              <label className="form-label text-white-50 small text-uppercase">Ap. Materno</label>
                              <input type="text" className="form-control bg-transparent text-white border-secondary" name="apellido_materno" onChange={actualizarState}/>
                          </div>
                      </div>

                      <div className="mb-3">
                          <label className="form-label text-white-50 small text-uppercase">Dirección</label>
                          <input type="text" className="form-control bg-transparent text-white border-secondary" name="direccion" onChange={actualizarState} required />
                      </div>

                      <div className="mb-4">
                          <label className="form-label text-white-50 small text-uppercase">Correo</label>
                          <input type="email" className="form-control bg-transparent text-white border-secondary" name="correo" onChange={actualizarState} />
                      </div>

                      <div
                        className="p-4 rounded mb-4"
                        style={{
                          background: "rgba(255,255,255,0.05)",
                          border: "1px solid var(--oro-oscuro)",
                        }}
                      >
                        <h5
                          className="text-gold mb-4 border-bottom border-secondary pb-2"
                          style={{ fontFamily: "'Cinzel', serif" }}
                        >
                          Desglose de Costos
                        </h5>

                        <div className="d-flex justify-content-between mb-2 text-white-50 text-premium-lg">
                          <span>
                            Producto ({compra.kilos}kg x ${compra.precio_kilo})
                          </span>
                          <span className="text-white">
                            ${compra.total_pescado}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between mb-3 text-white-50 text-premium-lg">
                          <span>
                            Envases ({compra.cajas} x ${PRECIO_CAJA})
                          </span>
                          <span className="text-white">
                            ${compra.total_cajas}
                          </span>
                        </div>

                        <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary mt-3">
                          <span className="text-gold fw-bold fs-4">
                            TOTAL A PAGAR
                          </span>
                          <span
                            className="display-4 fw-bold text-white"
                            style={{
                              textShadow: "0 0 15px rgba(212, 175, 55, 0.5)",
                            }}
                          >
                            ${compra.gran_total}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn-premium w-100 py-4 fs-4 fw-bold shadow-lg d-flex justify-content-between align-items-center px-5"
                      >
                        <span>CONFIRMAR COMPRA</span>
                        <i className="fas fa-arrow-right"></i>
                      </button>
                    </div>
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
                Pescado Azul
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
                Especies ricas en grasas saludables y sabor intenso. La mejor
                opción para parrilladas y platillos con carácter.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default CompraPescadoAzul;