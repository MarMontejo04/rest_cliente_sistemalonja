import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import clienteAxios from "../../config/axios";

const EditarVendedor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [usuario, guardarUsuario] = useState({
    nombre: "",
    ap_paterno: "",
    ap_materno: "",
    correo: "",
    rol: "vendedor",
    password: "", // Se manda vacío; si el usuario escribe, se actualiza.
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const obtenerUsuario = async () => {
      try {
        const res = await clienteAxios.get(`/api/auth/consulta/${id}`);
        const usuarioEncontrado = res.data;

        if (usuarioEncontrado) {
          guardarUsuario({
            ...usuarioEncontrado,
            password: "",
          });
        } else {
          Swal.fire("Error", "Usuario no encontrado", "error");
          navigate("/vendedores");
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        Swal.fire(
          "Error",
          "No se pudieron cargar los datos del usuario.",
          "error"
        );
        setLoading(false);
      }
    };
    obtenerUsuario();
  }, [id, navigate]);

  const actualizarState = (e) => {
    guardarUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const enviarEdicion = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!usuario.nombre || !usuario.correo || !usuario.rol) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Nombre, Correo y Rol son obligatorios",
        confirmButtonColor: "var(--oro-principal)",
      });
      return;
    }

    try {
      await clienteAxios.put(`/api/auth/actualizar/${id}`, usuario);
      console.log("Enviando actualización al backend:", usuario);

      Swal.fire({
        title: "Perfil Actualizado",
        text: `Los datos de ${usuario.nombre} se guardaron correctamente.`,
        icon: "success",
        confirmButtonColor: "var(--oro-principal)",
        background: "#042B35",
        color: "#F0F0F0",
      }).then(() => {
        navigate("/vendedores"); // Regresa a la lista
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al actualizar",
        background: "#042B35",
        color: "#FFF",
      });
    }
  };

  if (loading)
    return <h3 className="text-center text-white py-5">Cargando datos...</h3>;

  return (
    <div
      className="container-fluid p-0 bg-animated"
      style={{ minHeight: "100vh" }}
    >
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            {/* TARJETA ESTILO PREMIUM */}
            <div className="card-premium shadow-lg border-gold">
              <div className="card-header border-0 pb-0 text-center">
                <h2
                  className="text-gold mb-2"
                  style={{ fontFamily: "'Cinzel', serif" }}
                >
                  <i className="fas fa-user-edit me-3"></i>Editar Vendedor
                </h2>
                <p className="text-white-50 small text-uppercase letter-spacing-1">
                  Modificando a:{" "}
                  <span className="text-white fw-bold">
                    {usuario.nombre} {usuario.ap_paterno}
                  </span>
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
                <form onSubmit={enviarEdicion}>
                  {/* SECCIÓN 1: DATOS PERSONALES */}
                  <h5
                    className="text-gold mb-4 border-bottom border-secondary pb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Información Personal
                  </h5>

                  <div className="mb-3">
                    <label className="form-label text-white-50 small text-uppercase fw-bold">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control bg-transparent text-white border-secondary"
                      name="nombre"
                      value={usuario.nombre}
                      onChange={actualizarState}
                      required
                    />
                  </div>

                  <div className="row mb-3">
                    <div className="col-6">
                      <label className="form-label text-white-50 small text-uppercase fw-bold">
                        Ap. Paterno
                      </label>
                      <input
                        type="text"
                        className="form-control bg-transparent text-white border-secondary"
                        name="ap_paterno"
                        value={usuario.ap_paterno}
                        onChange={actualizarState}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label text-white-50 small text-uppercase fw-bold">
                        Ap. Materno
                      </label>
                      <input
                        type="text"
                        className="form-control bg-transparent text-white border-secondary"
                        name="ap_materno"
                        value={usuario.ap_materno}
                        onChange={actualizarState}
                      />
                    </div>
                  </div>

                  {/* SECCIÓN 2: DATOS DE CUENTA */}
                  <h5
                    className="text-gold mb-4 border-bottom border-secondary pb-2 mt-4"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Credenciales de Acceso
                  </h5>

                  <div className="mb-3">
                    <label className="form-label text-white-50 small text-uppercase fw-bold">
                      Correo Electrónico
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-dark border-secondary text-gold">
                        <i className="fas fa-envelope"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control bg-transparent text-white border-secondary"
                        name="correo"
                        value={usuario.correo}
                        onChange={actualizarState}
                        required
                      />
                    </div>
                  </div>

                  <div className="row mb-4">
                    <div className="col-md-6 mb-3 mb-md-0">
                      <label className="form-label text-white-50 small text-uppercase fw-bold">
                        Rol de Usuario
                      </label>
                      <select
                        className="form-select bg-dark text-white border-secondary"
                        name="rol"
                        value={usuario.rol}
                        onChange={actualizarState}
                      >
                        <option value="vendedor">Vendedor</option>
                        <option value="admin">Administrador</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label text-white-50 small text-uppercase fw-bold">
                        Nueva Contraseña
                      </label>
                      <input
                        type="password"
                        className="form-control bg-transparent text-white border-secondary"
                        name="password"
                        placeholder="(Mantener actual)"
                        onChange={actualizarState}
                      />
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Solo llena si deseas cambiarla
                      </small>
                    </div>
                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div className="d-flex gap-3 mt-5">
                    <button
                      type="button"
                      className="btn btn-outline-light flex-grow-1 py-3"
                      onClick={() => navigate("/vendedores")}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="btn-premium flex-grow-1 py-3 fs-5 fw-bold shadow-lg"
                    >
                      <i className="fas fa-save me-2"></i> GUARDAR
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

export default EditarVendedor;
