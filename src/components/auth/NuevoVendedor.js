import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NuevoVendedor = () => {
    const navigate = useNavigate();

    const [vendedor, guardarVendedor] = useState({
        nombre: '',
        correo: '',
        password: '',
        confirmar: ''
    });

    const actualizarState = e => {
        guardarVendedor({
            ...vendedor,
            [e.target.name]: e.target.value
        });
    }

    const agregarVendedor = e => {
        e.preventDefault();

        // Validaciones básicas
        if(!vendedor.nombre || !vendedor.correo || !vendedor.password || !vendedor.confirmar) {
            Swal.fire({
                icon: 'error',
                title: 'Campos Incompletos',
                text: 'Todos los campos son obligatorios.',
                confirmButtonColor: 'var(--oro-principal)',
                background: '#042B35',
                color: '#F0F0F0'
            });
            return;
        }

        if(vendedor.password !== vendedor.confirmar) {
            Swal.fire({
                icon: 'error',
                title: 'Error de Contraseña',
                text: 'Las contraseñas no coinciden.',
                confirmButtonColor: 'var(--oro-principal)',
                background: '#042B35',
                color: '#F0F0F0'
            });
            return;
        }

        // Aquí iría la petición al backend para crear el usuario con rol 'vendedor'
        // const res = await clienteAxios.post('/usuarios', { ...vendedor, rol: 'vendedor' });
        
        console.log("Registrando Vendedor:", vendedor);

        Swal.fire({
            title: 'Vendedor Registrado',
            text: `El usuario ${vendedor.nombre} ha sido dado de alta correctamente.`,
            icon: 'success',
            confirmButtonColor: 'var(--oro-principal)',
            background: '#042B35',
            color: '#F0F0F0'
        }).then(() => {
            navigate('/'); // O redirigir a una lista de usuarios si la tuvieras
        });
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
                                    
                                    <div className="mb-4">
                                        <label className="form-label text-gold small text-uppercase fw-bold">Nombre Completo</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-dark border-secondary text-gold"><i className="fas fa-id-card"></i></span>
                                            <input 
                                                type="text" 
                                                className="form-control bg-transparent text-white border-secondary" 
                                                name="nombre" 
                                                placeholder="Ej. Juan Pérez" 
                                                onChange={actualizarState}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label text-gold small text-uppercase fw-bold">Correo Electrónico (Usuario)</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-dark border-secondary text-gold"><i className="fas fa-envelope"></i></span>
                                            <input 
                                                type="email" 
                                                className="form-control bg-transparent text-white border-secondary" 
                                                name="correo" 
                                                placeholder="usuario@lonja.com" 
                                                onChange={actualizarState}
                                                autoComplete="off"
                                            />
                                        </div>
                                    </div>

                                    <div className="row mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label text-gold small text-uppercase fw-bold">Contraseña</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-dark border-secondary text-gold"><i className="fas fa-lock"></i></span>
                                                <input 
                                                    type="password" 
                                                    className="form-control bg-transparent text-white border-secondary" 
                                                    name="password" 
                                                    placeholder="••••••" 
                                                    onChange={actualizarState}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6 mt-3 mt-md-0">
                                            <label className="form-label text-gold small text-uppercase fw-bold">Confirmar</label>
                                            <div className="input-group">
                                                <span className="input-group-text bg-dark border-secondary text-gold"><i className="fas fa-check-double"></i></span>
                                                <input 
                                                    type="password" 
                                                    className="form-control bg-transparent text-white border-secondary" 
                                                    name="confirmar" 
                                                    placeholder="••••••" 
                                                    onChange={actualizarState}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="alert alert-warning d-flex align-items-center p-2 mb-4" role="alert" style={{fontSize: '0.75rem', backgroundColor: 'rgba(255, 193, 7, 0.1)', border: '1px solid #ffecb5', color: '#ffecb5'}}>
                                        <i className="fas fa-info-circle me-2"></i>
                                        <div>
                                            Este usuario tendrá permisos para registrar ventas y consultar inventario.
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-premium w-100 py-3 fs-5 fw-bold shadow-lg">
                                        <i className="fas fa-save me-2"></i> REGISTRAR ACCESO
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