import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios.js";

const EditarLote = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtenemos el ID de la URL

  const [loading, setLoading] = useState(true);

  const infoCajas = {
    chica: { capacidad: 10, precio: 55 },
    estandar: { capacidad: 25, precio: 193 },
    tina: { capacidad: 500, precio: 500 },
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

  // 1. EFECTO PARA CARGAR DATOS DEL LOTE (Simulación)
  useEffect(() => {
    const obtenerLote = async () => {
      try {
        const res = await clienteAxios.get(`/api/lote-especie/consulta/${id}`);
        const data = res.data;

        if (!data || data.activo === false) {
          Swal.fire("Error", "Lote no encontrado o inactivo.", "error");
          navigate("/lotes");
          return;
        }

        guardarLote({
          tipo_especie: data.tipo,
          nombre_especie: data.nombre,
          imagen_especie: data.imagen,
          // Datos del Lote
          kilos: data.kilos.toString(),
          precio_kilo_salida: data.precio_kilo_salida.toString(),
          tipo_caja_seleccionada: "estandar",
          numero_cajas: data.numero_cajas,
          costo_cajas_total: 0,
          valor_total_lote: 0,
        });
      } catch (error) {
        Swal.fire(
          "Error",
          "No se pudieron cargar los datos del lote.",
          "error"
        );
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    obtenerLote();
  }, [id, navigate]);

  useEffect(() => {
    const peso = parseFloat(lote.kilos) || 0;
    const precioKilo = parseFloat(lote.precio_kilo_salida) || 0;
    const datosCaja =
      infoCajas[lote.tipo_caja_seleccionada] || infoCajas["estandar"];

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
    }
  }, [lote.kilos, lote.precio_kilo_salida, lote.tipo_caja_seleccionada]);

  const actualizarState = (e) => {
    guardarLote({
      ...lote,
      [e.target.name]: e.target.value,
    });
  };

  const actualizarLote = async (e) => {
    e.preventDefault();

    const id_tpo_real = lote.id_tpo_real;

    const payload = {
      kilos: parseFloat(lote.kilos),
      numero_cajas: parseFloat(lote.numero_cajas), // Enviamos el valor recalculado
      precio_kilo_salida: parseFloat(lote.precio_kilo_salida),

      nombre: lote.nombre_especie,
      imagen: lote.imagen_especie,
      id_tpo: id_tpo_real,
    };

 

    try {
      await clienteAxios.put(`/api/lote-especie/actualizar/${id}`, payload);

      Swal.fire({
        title: "Lote Actualizado",
        text: "Los cambios se guardaron correctamente",
        icon: "success",
        confirmButtonColor: "var(--oro-principal)",
        background: "#042B35",
        color: "#F0F0F0",
      }).then(() => {
        navigate("/lotes");
      });
    } catch (error) {
      console.error("Error actualizando lote:", error.response || error);
      const msg =
        error.response?.data?.mensaje || "Hubo un error al actualizar";
      Swal.fire({
        icon: "error",
        title: "Error",
        text: msg,
        background: "#042B35",
        color: "#FFF",
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
            <div className="card-premium shadow-lg border-gold">
              <div className="card-header border-0 pb-0 text-center">
                <h2
                  className="text-gold mb-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <i className="fas fa-edit me-3"></i>Editar Lote #{id}
                </h2>
                <p className="text-white-50 small text-uppercase letter-spacing-1">
                  Modificación de Inventario
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
                <form onSubmit={actualizarLote}>
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
                        className="form-select text-white border-secondary bg-dark"
                        name="tipo_especie"
                        onChange={actualizarState}
                        value={lote.tipo_especie} // Value controlado para mostrar dato actual
                        required
                      >
                        <option value="Blanco">Pescado Blanco</option>
                        <option value="Azul">Pescado Azul</option>
                        <option value="Marisco">Marisco</option>
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
                        value={lote.nombre_especie}
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
                      value={lote.imagen_especie}
                      onChange={actualizarState}
                    />
                  </div>

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
                        step="0.01"
                        value={lote.kilos}
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
                        step="0.50"
                        value={lote.precio_kilo_salida}
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

                  <div className="d-flex gap-3 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-light flex-grow-1 py-3"
                      onClick={() => navigate("/lotes")}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-premium flex-grow-1 py-3 fs-5 fw-bold shadow-lg"
                    >
                      <i className="fas fa-save me-2"></i> GUARDAR CAMBIOS
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarLote;
