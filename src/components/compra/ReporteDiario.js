import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios.js";

const ReporteDiario = () => {
  const fechaHoy = new Date().toISOString().split("T")[0];
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaHoy);
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resumen, setResumen] = useState({
    ingresoTotal: 0,
    kilosTotales: 0,
    ventasCount: 0,
  });

  useEffect(() => {
    const obtenerReporte = async () => {
      setLoading(true);
      setError(null);
      setVentas([]);

      setResumen({ ingresoTotal: 0, kilosTotales: 0, ventasCount: 0 });

      try {
        const respuesta = await clienteAxios.get(`/api/reporte/ventas?fecha=${fechaSeleccionada}`);

        const ventasDelDia =  respuesta.data;

        const totalDinero = ventasDelDia.reduce(
          (acc, curr) => acc + parseFloat(curr.total || 0),
          0
        );
        const totalKilos = ventasDelDia.reduce(
          (acc, curr) => acc + parseFloat(curr.kilos || 0),
          0
        );

        setVentas(ventasDelDia);

        setResumen({
          ingresoTotal: totalDinero,
          kilosTotales: totalKilos,
          ventasCount: ventasDelDia.length,
        });
      } catch (err) {
        console.error("Error al cargar el reporte:", err);
        setError("Error al obtener datos. Verifica la conexión y la fecha.");
      } finally {
        setLoading(false);
      }
    };

    obtenerReporte();
  }, [fechaSeleccionada]);

  return (
    <div
      className="container-fluid p-0 bg-animated"
      style={{ minHeight: "100vh", paddingBottom: "5rem" }}
    >
      <div className="container pt-5 pb-4">
        <div className="d-flex justify-content-between align-items-end border-bottom border-secondary pb-3 mb-5">
          <div>
            <h4 className="text-gold text-uppercase letter-spacing-2 mb-0 small">
              Administración
            </h4>
            <h1
              className="display-4 text-white mb-0"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Reporte Diario de Operaciones
            </h1>
          </div>

          <div className="text-end">
            <label className="text-white-50 small text-uppercase d-block mb-1">
              Fecha de Consulta
            </label>
            <input
              type="date"
              className="form-control bg-transparent text-gold border-gold fw-bold text-center"
              style={{ maxWidth: "180px", fontSize: "1.1rem" }}
              value={fechaSeleccionada}
              max={fechaHoy}
              onChange={(e) => setFechaSeleccionada(e.target.value)}
            />
          </div>
        </div>

        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div
              className="p-4 rounded h-100 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #042B35 0%, #021E26 100%)",
                border: "1px solid var(--oro-oscuro)",
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-white-50 text-uppercase small mb-1 letter-spacing-1">
                    Ingreso Neto
                  </p>
                  <h2 className="text-gold display-5 fw-bold mb-0">
                    ${resumen.ingresoTotal.toLocaleString("es-MX")}
                  </h2>
                </div>
                <div
                  className="p-3 rounded-circle"
                  style={{
                    background: "rgba(212, 175, 55, 0.1)",
                    color: "var(--oro-principal)",
                  }}
                >
                  <i className="fas fa-coins fa-2x"></i>
                </div>
              </div>
              <div className="text-white-50 small">Acumulado del día</div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 rounded h-100 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #042B35 0%, #021E26 100%)",
                border: "1px solid var(--oro-oscuro)",
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-white-50 text-uppercase small mb-1 letter-spacing-1">
                    Volumen Vendido
                  </p>
                  <h2 className="text-white display-5 fw-bold mb-0">
                    {resumen.kilosTotales}{" "}
                    <span className="fs-4 text-muted">kg</span>
                  </h2>
                </div>
                <div
                  className="p-3 rounded-circle"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-weight-hanging fa-2x"></i>
                </div>
              </div>
              <div className="text-white-50 small">
                Total de producto desplazado
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div
              className="p-4 rounded h-100 position-relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #042B35 0%, #021E26 100%)",
                border: "1px solid var(--oro-oscuro)",
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <p className="text-white-50 text-uppercase small mb-1 letter-spacing-1">
                    Operaciones
                  </p>
                  <h2 className="text-white display-5 fw-bold mb-0">
                    {resumen.ventasCount}
                  </h2>
                </div>
                <div
                  className="p-3 rounded-circle"
                  style={{
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#fff",
                  }}
                >
                  <i className="fas fa-receipt fa-2x"></i>
                </div>
              </div>
              <div className="text-white-50 small">Tickets generados hoy</div>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-lg bg-transparent">
          <div className="card-header bg-transparent text-start border-0 px-0">
            <h3
              className="text-white mb-0"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Bitácora de Transacciones
            </h3>
          </div>

          <div className="table-responsive">
            <table
              className="table table-dark table-hover align-middle"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              <thead style={{ backgroundColor: "#02181E" }}>
                <tr className="text-uppercase small text-muted letter-spacing-1">
                  <th className="py-3 ps-4">Folio / Hora</th>
                  <th className="py-3">Cliente</th>
                  <th className="py-3">Producto</th>
                  <th className="py-3 text-end">Peso (Kg)</th>
                  <th className="py-3 text-end pe-4">Total</th>
                </tr>
              </thead>
              <tbody>
                {ventas.length > 0 ? (
                  ventas.map((venta) => (
                    <tr key={venta._id} style={{ cursor: "pointer" }}>
                      <td className="ps-4 border-secondary">
                        <div className="fw-bold text-white">{venta._id}</div>
                        <small className="text-muted">{venta.hora}</small>
                      </td>
                      <td className="border-secondary">
                        <span className="text-white-50">{venta.cliente}</span>
                      </td>
                      <td className="border-secondary">
                        <span className="text-gold fw-bold">
                          {venta.especie}
                        </span>
                        <span className="text-muted ms-2 small">
                          ({venta.tipo})
                        </span>
                      </td>
                      <td className="text-end border-secondary font-monospace text-white">
                        {venta.kilos.toFixed(1)}
                      </td>
                      <td className="text-end pe-4 border-secondary">
                        <span className="text-gold fw-bold">
                          ${venta.total.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-5 text-muted border-secondary"
                    >
                      <i className="fas fa-folder-open fa-2x mb-3 d-block"></i>
                      No hay movimientos registrados en esta fecha.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <button
              className="btn btn-outline-light btn-sm"
              onClick={() => window.print()}
            >
              <i className="fas fa-print me-2"></i> Imprimir Reporte Fiscal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReporteDiario;
