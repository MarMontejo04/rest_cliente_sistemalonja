import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from '../../config/axios'; 

const Vendedores = () => {
  const [vendedores, setVendedores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerVendedores = async () => {
      try {
        const respuesta = await clienteAxios.get("/api/auth/consulta");

        setVendedores(respuesta.data);
      } catch (error) {
        console.error("Error al cargar personal:", error.response || error);
        Swal.fire(
          "Error",
          error.response?.data?.mensaje ||
            "No se pudo cargar la lista de personal. Acceso denegado.",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };
    obtenerVendedores();
  }, []);

  const eliminarVendedor = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "El usuario será DESACTIVADO y no podrá acceder al sistema.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      background: "#042B35",
      color: "#F0F0F0",
    }).then(async (result) => {
      // <-- HACER ASÍNCRONA LA FUNCIÓN
      if (result.isConfirmed) {
        try {
          // LLAMAR AL BACKEND para el Soft Delete
          // RUTA ASUMIDA: DELETE /api/auth/eliminar/:id
          await clienteAxios.delete(`/api/auth/eliminar/${id}`);

          // Actualizar el estado local (filtrar el ID desactivado)
          const nuevosVendedores = vendedores.filter((v) => v._id !== id);
          setVendedores(nuevosVendedores);

          Swal.fire({
            title: "¡Desactivado!",
            text: "El usuario ha sido dado de baja (borrado lógico).",
            icon: "success",
            confirmButtonColor: "var(--oro-principal)",
            background: "#042B35",
            color: "#F0F0F0",
          });
        } catch (error) {
          const msg =
            error.response?.data?.mensaje ||
            "Error al procesar la baja del usuario.";
          Swal.fire("Error", msg, "error");
        }
      }
    });
  };

  if (loading)
    return (
      <h3 className="text-center text-white py-5">Cargando personal...</h3>
    );

  return (
    <div
      className="container-fluid p-0 bg-animated"
      style={{ minHeight: "100vh" }}
    >
      <div className="container py-5">
        <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 border-bottom border-secondary pb-4">
          <div className="mb-3 mb-md-0">
            <h4 className="text-gold text-uppercase letter-spacing-2 mb-0 small">
              Control de Acceso
            </h4>
            <h1
              className="display-4 text-white mb-0"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Personal Autorizado
            </h1>
          </div>

          <Link
            to="/nuevoVendedor"
            className="btn btn-symbol-primary shadow-lg px-4 py-2"
          >
            <span className="me-2">
              <i className="fas fa-user-plus"></i>
            </span>{" "}
            Nuevo Vendedor
          </Link>
        </div>

        <div
          className="card border-0 shadow-lg"
          style={{
            backgroundColor: "rgba(4, 43, 53, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid var(--oro-oscuro)",
          }}
        >
          <div className="table-responsive">
            <table
              className="table table-premium align-middle mb-0"
              style={{ color: "#eee" }}
            >
              <thead>
                <tr>
                  <th className="py-4 ps-5">Nombre Completo</th>
                  <th className="py-4">Credenciales</th>
                  <th className="py-4 text-center">Rol</th>
                  <th className="py-4 text-center">Estado</th>
                  <th className="py-4 text-end pe-5">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {vendedores.length > 0 ? (
                  vendedores.map((vendedor) => (
                    <tr key={vendedor._id}>
                      <td className="ps-5 py-4">
                        <div className="d-flex align-items-center">
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{
                              width: "45px",
                              height: "45px",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid var(--oro-oscuro)",
                              color: "white",
                            }}
                          >
                            <span className="fw-bold">
                              {vendedor.nombre.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="fw-bold text-white fs-5">
                              {vendedor.nombre} {vendedor.ap_paterno}{" "}
                              {vendedor.ap_materno}
                            </div>
                            <small className="text-white-50">
                              ID: {vendedor._id}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td className="py-4">
                        <div className="d-flex align-items-center text-white-50">
                          <i className="fas fa-envelope me-2 text-gold"></i>
                          {vendedor.correo}
                        </div>
                      </td>

                      <td className="text-center py-4">
                        {vendedor.rol === "admin" ? (
                          <span className="badge bg-gold text-dark px-3 py-2 shadow-sm">
                            <i className="fas fa-crown me-1"></i> ADMIN
                          </span>
                        ) : (
                          <span className="badge bg-secondary text-white px-3 py-2">
                            <i className="fas fa-user-tag me-1"></i> VENDEDOR
                          </span>
                        )}
                      </td>

                      {/* ESTADO */}
                      <td className="text-center py-4">
                        <span className="text-success small fw-bold">
                          <i
                            className="fas fa-circle me-1"
                            style={{ fontSize: "8px" }}
                          ></i>{" "}
                          Activo
                        </span>
                      </td>

                      {/* ACCIONES */}
                      <td className="text-end py-4 pe-5">
                        <div className="d-flex justify-content-end gap-2">
                          <Link
                            to={`/vendedores/editar/${vendedor._id}`}
                            className="btn btn-sm btn-outline-warning px-3 d-flex align-items-center gap-2"
                            style={{
                              borderColor: "var(--oro-oscuro)",
                              color: "var(--oro-principal)",
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </Link>

                          <button
                            onClick={() => eliminarVendedor(vendedor._id)}
                            className="btn btn-sm btn-outline-danger px-3 d-flex align-items-center gap-2"
                            style={{ borderColor: "rgba(220, 53, 69, 0.5)" }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <h5 className="text-white-50 fw-light">
                        No hay personal registrado.
                      </h5>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vendedores;
