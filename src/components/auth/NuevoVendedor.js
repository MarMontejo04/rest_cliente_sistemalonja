import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from '../../config/axios';

const NuevoVendedor = () => {
    const navigate = useNavigate();

    const [vendedor, guardarVendedor] = useState({
        nombre: '',
        ap_paterno: '',
        ap_materno: '',
        correo: '',
        password: '',
        confirmar: '',
        rol: 'vendedor'
    });

    const actualizarState = e => {
        guardarVendedor({
            ...vendedor,
            [e.target.name]: e.target.value
        });
    }

    const agregarVendedor = async e => {
        e.preventDefault();

        if(!vendedor.nombre || !vendedor.correo || !vendedor.password) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Faltan campos obligatorios', confirmButtonColor: 'var(--oro-principal)' });
            return;
        }

        if(vendedor.password !== vendedor.confirmar) {
            Swal.fire({ icon: 'error', title: 'Error', text: 'Las contraseñas no coinciden', confirmButtonColor: 'var(--oro-principal)' });
            return;
        }

        try {
            // Petición al Backend
            const res = await clienteAxios.post('/api/auth/registrar', vendedor);

            Swal.fire({
                title: 'Vendedor Registrado',
                text: res.data.mensaje || 'Vendedor registrado con éxito',
                icon: 'success',
                confirmButtonColor: 'var(--oro-principal)',
                background: '#042B35',
                color: '#F0F0F0'
            }).then(() => {
                navigate('/lotes'); // Volver al panel principal o a donde prefieras
            });
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al registrar el usuario',
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
                    <div className="col-md-8 col-lg-6">
                        
                        {/* TARJETA PREMIUM */}
                        <div className="card-premium shadow-lg border-gold">
                            <div className="card-header border-0 pb-0 text-center">
                                <h2 className="text-gold mb-2" style={{fontFamily: "'Cinzel', serif"}}>
                                    <i className="fas fa-user-plus me-3"></i>Nuevo Vendedor
                                </h2>
                                <p className="text-white-50 small text-uppercase letter-spacing-1">Alta de Personal Autorizado</p>
                                <div className="mx-auto my-3" style={{width: '60px', height: '3px', backgroundColor: 'var(--oro-principal)'}}></div>
                            </div>
                            
                            <div className="card-body p-4 p-lg-5">
                                <form onSubmit={agregarVendedor}>
                                    
                                    {/* NOMBRE Y APELLIDOS */}
                                    <div className="mb-3">
                                        <label className="form-label text-white-50 small text-uppercase fw-bold">Nombre</label>
                                        <input type="text" className="form-control bg-transparent text-white border-secondary" name="nombre" onChange={actualizarState} required />
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6">
                                            <label className="form-label text-white-50 small text-uppercase fw-bold">Ap. Paterno</label>
                                            <input type="text" className="form-control bg-transparent text-white border-secondary" name="ap_paterno" onChange={actualizarState} required />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label text-white-50 small text-uppercase fw-bold">Ap. Materno</label>
                                            <input type="text" className="form-control bg-transparent text-white border-secondary" name="ap_materno" onChange={actualizarState} required />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label text-white-50 small text-uppercase fw-bold">Correo</label>
                                        <input type="email" className="form-control bg-transparent text-white border-secondary" name="correo" onChange={actualizarState} required />
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-6">
                                            <label className="form-label text-white-50 small text-uppercase fw-bold">Contraseña</label>
                                            <input type="password" className="form-control bg-transparent text-white border-secondary" name="password" onChange={actualizarState} required />
                                        </div>
                                        <div className="col-6">
                                            <label className="form-label text-white-50 small text-uppercase fw-bold">Confirmar</label>
                                            <input type="password" className="form-control bg-transparent text-white border-secondary" name="confirmar" onChange={actualizarState} required />
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-premium w-100 py-3 fs-5 fw-bold shadow-lg hover-scale">
                                        REGISTRAR
                                    </button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NuevoVendedor;