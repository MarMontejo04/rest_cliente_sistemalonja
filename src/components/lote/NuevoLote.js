import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios.js";

const NuevoLote = () => {
  const navigate = useNavigate();

  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    const obtenerTipos = async () => {
      const respuesta = await clienteAxios.get("/api/tipo/consulta");
      setTipos(respuesta.data);
    };

    obtenerTipos();
  }, []);

  const infoCajas = {
    chica: { capacidad: 10, precio: 55 }, // Caja de Unicel 10kg
    estandar: { capacidad: 25, precio: 193 }, // Caja Plastico/Calada 25kg
    tina: { capacidad: 500, precio: 500 }, // Bin/Tina (Costo por uso/fianza)
  };

  const [lote, guardarLote] = useState({
    tipo_especie: "",
    nombre_especie: "",
    imagen_especie: "",
    kilos: "",
    precio_kilo_salida: "",
    numero_cajas: 0,
    tipo_caja_seleccionada: "estandar",
    costo_cajas_total: 0,
    valor_total_lote: 0,
  });

  useEffect(() => {
    const peso = parseFloat(lote.kilos) || 0;
    const precioKilo = parseFloat(lote.precio_kilo_salida) || 0;

    const datosCaja = infoCajas[lote.tipo_caja_seleccionada];

    if (peso > 0) {
      const cajasNecesarias = Math.ceil(peso / datosCaja.capacidad);

      const costoTotalCajas = cajasNecesarias * datosCaja.precio;
      const costoTotalPeces = peso * precioKilo;

      const granTotal = costoTotalPeces + costoTotalCajas;

      guardarLote((prev) => ({
        ...prev,
        numero_cajas: cajasNecesarias,
        costo_cajas_total: costoTotalCajas.toFixed(2),
        valor_total_lote: granTotal.toFixed(2),
      }));
    } else {
      guardarLote((prev) => ({
        ...prev,
        numero_cajas: 0,
        costo_cajas_total: 0,
        valor_total_lote: 0,
      }));
    }
  }, [lote.kilos, lote.precio_kilo_salida, lote.tipo_caja_seleccionada]);

  const actualizarState = (e) => {
    guardarLote({
      ...lote,
      [e.target.name]: e.target.value,
    });
  };

  const agregarLote = async (e) => {
    e.preventDefault();

    if (
      !lote.tipo_especie ||
      !lote.nombre_especie ||
      parseFloat(lote.kilos) <= 0 ||
      parseFloat(lote.precio_kilo_salida) <= 0
    ) {
      Swal.fire({
        icon: "error",
        title: "Campos Incompletos",
        text: "Por favor llena todos los campos obligatorios.",
        confirmButtonColor: "var(--oro-principal)",
        background: "#042B35",
        color: "#F0F0F0",
      });
      return;
    }
    const datos = {
      nombre: lote.nombre_especie,
      id_tpo: lote.tipo_especie,
      id_lte: lote._id,
      imagen: lote.imagen_especie,
      kilos: lote.kilos,
      numero_cajas: lote.numero_cajas,
      precio_kilo_salida: lote.precio_kilo_salida,
      fecha: new Date(),
      id_cmp: null,
    };

    try {
      const respuesta = await clienteAxios.post(
        "/api/lote-especie/registrar",
        datos
      );
      guardarLote(respuesta.data);

      Swal.fire({
        title: "Lote Registrado",
        text: `Inventario actualizado: ${lote.numero_cajas} cajas (${lote.kilos} kg)`,
        icon: "success",
        confirmButtonColor: "var(--oro-principal)",
        background: "#042B35",
        color: "#F0F0F0",
      }).then(() => {
        navigate("/lotes");
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error al guardar",
        text: "No se pudo registrar el lote.",
      });
    }
  };

  return (
    <div
      className="container-fluid p-0 bg-animated"
      style={{ minHeight: "100vh" }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            {/* TARJETA PREMIUM */}
            <div className="card-premium shadow-lg border-gold">
              <div className="card-header border-0 pb-0 text-center">
                <h2
                  className="text-gold mb-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <i className="fas fa-dolly-flatbed me-3"></i>Recepción de Lote
                </h2>
                <p className="text-white-50 small text-uppercase letter-spacing-1">
                  Registro de Mercancía Entrante
                </p>
                <div
                  className="mx-auto my-3"
                  style={{
                    width: "60px",
                    height: "3px",
                    backgroundColor: "var(--oro-principal)",
                  }}
                ></div>
              </div>

              <div className="card-body p-4 p-lg-5">
                <form onSubmit={agregarLote}>
                  {/* 1. DATOS ESPECIE */}
                  <h5
                    className="text-gold mb-4 border-bottom border-secondary pb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Datos del Producto
                  </h5>
                  <div className="row mb-3 g-3">
                    <div className="col-md-4">
                      <label className="form-label text-white-50 small text-uppercase fw-bold">
                        Clasificación
                      </label>
                      <select
                        name="tipo_especie"
                        value={lote.tipo_especie}
                        onChange={(e) =>
                          guardarLote((prev) => ({
                            ...prev,
                            tipo_especie: e.target.value,
                          }))
                        }
                        className="form-select bg-dark text-white border-secondary"
                      >
                        <option value="">-- Seleccionar --</option>
                        {tipos.map((t) => (
                          <option key={t._id} value={t._id}>
                            {t.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-8">
                      <label className="form-label text-white-50 small text-uppercase fw-bold">
                        Nombre Especie
                      </label>
                      <input
                        type="text"
                        className="form-control bg-transparent text-white border-secondary"
                        name="nombre_especie"
                        placeholder="Ej. Robalo"
                        onChange={actualizarState}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label text-white-50 small text-uppercase fw-bold">
                      URL de Imagen
                    </label>
                    <input
                      type="text"
                      className="form-control bg-transparent text-white border-secondary"
                      name="imagen_especie"
                      placeholder="http://..."
                      onChange={actualizarState}
                    />
                  </div>

                  {/* 2. CALCULADORA DE LOTE */}
                  <h5
                    className="text-gold mb-4 border-bottom border-secondary pb-2 mt-5"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Cálculo de Carga
                  </h5>

                  <div className="row mb-4 g-3 align-items-end">
                    <div className="col-md-3">
                      <label className="form-label text-white-50 small text-uppercase fw-bold">
                        Kilos Totales
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg bg-transparent text-white border-gold"
                        name="kilos"
                        placeholder="0"
                        step="0.01"
                        onChange={actualizarState}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label text-white-50 small text-uppercase fw-bold">
                        Precio Salida ($/Kg)
                      </label>
                      <input
                        type="number"
                        className="form-control form-control-lg bg-transparent text-white border-gold"
                        name="precio_kilo_salida"
                        placeholder="0.00"
                        step="0.50"
                        onChange={actualizarState}
                        required
                      />
                    </div>

                    <div className="col-md-3">
                      <label className="form-label text-white-50 small text-uppercase fw-bold">
                        Tipo de Envase
                      </label>
                      <select
                        className="form-select bg-dark text-white border-secondary"
                        name="tipo_caja_seleccionada"
                        onChange={actualizarState}
                        value={lote.tipo_caja_seleccionada}
                      >
                        <option value="chica">Caja Chica (10kg)</option>
                        <option value="estandar">Estándar (25kg)</option>
                        <option value="tina">Tina Jumbo (500kg)</option>
                      </select>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label text-gold small text-uppercase fw-bold">
                        Cajas (Auto)
                      </label>
                      <input
                        type="text"
                        className="form-control bg-transparent text-gold text-center fw-bold border-gold"
                        value={lote.numero_cajas}
                        readOnly
                      />
                    </div>
                  </div>

                  {/* 3. RESUMEN DE COSTOS */}
                  <div
                    className="p-3 rounded mb-4"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid var(--oro-oscuro)",
                    }}
                  >
                    <div className="row text-center align-items-center">
                      <div className="col-4">
                        <small
                          className="text-white-50 d-block text-uppercase"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Valor Pescado
                        </small>
                        <span className="fw-bold fs-5 text-white">
                          $
                          {(lote.kilos * lote.precio_kilo_salida || 0).toFixed(
                            2
                          )}
                        </span>
                      </div>
                      <div className="col-4 border-start border-end border-secondary">
                        <small
                          className="text-white-50 d-block text-uppercase"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Costo Cajas
                        </small>
                        <span className="fw-bold fs-5 text-danger">
                          + ${lote.costo_cajas_total}
                        </span>
                      </div>
                      <div className="col-4">
                        <small
                          className="text-gold d-block text-uppercase fw-bold"
                          style={{ fontSize: "0.7rem" }}
                        >
                          Valor Total Lote
                        </small>
                        <span className="fw-bold fs-4 text-gold">
                          ${lote.valor_total_lote}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-premium w-100 py-3 fs-5 fw-bold shadow-lg mt-2"
                  >
                    <i className="fas fa-save me-2"></i> GUARDAR EN INVENTARIO
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevoLote;
