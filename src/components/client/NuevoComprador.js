import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios'; 

const NuevoComprador = () => {
    const navigate = useNavigate();

    const [comprador, guardarComprador] = useState({
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        direccion: '',
        correo: ''
    });

    const actualizarState = e => {
        guardarComprador({
            ...comprador,
            [e.target.name]: e.target.value
        });
    }

    const agregarComprador = async e => {
        e.preventDefault();

        if(!comprador.nombre || !comprador.apellido_paterno || !comprador.direccion || !comprador.correo) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos Incompletos',
                text: 'El nombre, apellido paterno, dirección y correo son obligatorios.',
                confirmButtonColor: 'var(--oro-principal)',
                background: '#042B35',
                color: '#F0F0F0'
            });
            return;
        }

        try {
            const res = await clienteAxios.post('/api/comprador/registrar', comprador);

            Swal.fire({
                title: 'Comprador Registrado',
                text: res.data.mensaje || 'El cliente se ha guardado correctamente',
                icon: 'success',
                confirmButtonColor: 'var(--oro-principal)',
                background: '#042B35',
                color: '#F0F0F0'
            }).then(() => {
                navigate('/'); 
            });

        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error de Registro',
                text: error.response?.data?.mensaje || 'Hubo un error al registrar el comprador',
                confirmButtonColor: 'var(--oro-principal)',
                background: '#042B35',
                color: '#F0F0F0'
            });
        }
    }

    return (
        <div className="container-fluid p-0 bg-animated" style={{minHeight: '100vh'}}>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
                        
                        <div className="card-premium shadow-lg border-gold">
                            <div className="card-header border-0 pb-0 text-center">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style={{width: '60px', height: '60px', border: '1px solid var(--oro-principal)', background: 'rgba(212, 175, 55, 0.1)'}}>
                                    <i className="fas fa-user-plus text-gold fs-4"></i>
                                </div>
                                <h2 className="text-gold mb-2" style={{fontFamily: "'Cinzel', serif"}}>Alta de Comprador</h2>
                                <p className="text-white-50 small text-uppercase letter-spacing-1">Registro de Nuevo Cliente en Sistema</p>
                                <div className="mx-auto my-3" style={{width: '60px', height: '3px', backgroundColor: 'var(--oro-principal)'}}></div>
                            </div>
                            
                            <div className="card-body p-4 p-lg-5">
                                <form onSubmit={agregarComprador}>
                                    
                                    <h5 className="text-gold mb-4 border-bottom border-secondary pb-2" style={{fontFamily: "'Cinzel', serif"}}>Datos Personales</h5>
                                    
                                    <div className="row mb-3">
                                        <div className="col-md-12 mb-3">
                                            <label className="form-label text-white-50 small text-uppercase fw-bold">Nombre(s)</label>
                                            <input 
                                                type="text" 
                                                className="form-control bg-transparent text-white border-secondary" 
                                                name="nombre" 
                                                placeholder="Ej. Juan Carlos"
                                                onChange={actualizarState} 
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-6 mb-3 mb-md-0">
                                            <label className="form-label text-white-50 small text-uppercase fw-bold">Apellido Paterno</label>
                                            <input 
                                                type="text" 
                                                className="form-control bg-transparent text-white border-secondary" 
                                                name="apellido_paterno" 
                                                placeholder="Ej. Pérez"
                                                onChange={actualizarState} 
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label text-white-50 small text-uppercase fw-bold">Apellido Materno</label>
                                            <input 
                                                type="text" 
                                                className="form-control bg-transparent text-white border-secondary" 
                                                name="apellido_materno" 
                                                placeholder="Ej. López"
                                                onChange={actualizarState} 
                                            />
                                        </div>
                                    </div>

                                    <h5 className="text-gold mb-4 border-bottom border-secondary pb-2 mt-4" style={{fontFamily: "'Cinzel', serif"}}>Datos de Contacto</h5>

                                    <div className="mb-3">
                                        <label className="form-label text-white-50 small text-uppercase fw-bold">Dirección Fiscal / Entrega</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-dark border-secondary text-gold"><i className="fas fa-map-marker-alt"></i></span>
                                            <input 
                                                type="text" 
                                                className="form-control bg-transparent text-white border-secondary" 
                                                name="direccion" 
                                                placeholder="Calle, Número, Colonia, Ciudad"
                                                onChange={actualizarState} 
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-white-50 small text-uppercase fw-bold">Correo Electrónico</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-dark border-secondary text-gold"><i className="fas fa-envelope"></i></span>
                                            <input 
                                                type="email" 
                                                className="form-control bg-transparent text-white border-secondary" 
                                                name="correo" 
                                                placeholder="cliente@empresa.com"
                                                onChange={actualizarState} 
                                            />
                                        </div>
                                        <div className="form-text text-white-50 small">Este correo servirá como identificador único del cliente.</div>
                                        <div className="form-text text-white-50 small">SELECCIONA DE NUEVO TU COMPRA Y COLOCA EL NUEVO CORREO</div>

                                    </div>

                                    <div className="d-flex gap-3 mt-5">
                                        <button 
                                            type="button" 
                                            className="btn btn-outline-light flex-grow-1 py-3" 
                                            onClick={() => navigate(-1)} // Volver atrás
                                        >
                                            Cancelar
                                        </button>
                                        <button 
                                            type="submit" 
                                            className="btn-premium flex-grow-1 py-3 fs-5 fw-bold shadow-lg"
                                        >
                                            <i className="fas fa-save me-2"></i> REGISTRAR CLIENTE
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
}

export default NuevoComprador;