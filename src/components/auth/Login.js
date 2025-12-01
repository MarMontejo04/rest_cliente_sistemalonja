import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Login = () => {
    const navigate = useNavigate();
    
    const [credenciales, guardarCredenciales] = useState({ 
        email: '', 
        password: '' 
    });

    const leerDatos = (e) => {
        guardarCredenciales({ 
            ...credenciales, 
            [e.target.name]: e.target.value 
        })
    }

    const iniciarSesion = async (e) => {
        e.preventDefault();
        
        if(credenciales.email === '' || credenciales.password === '') {
            Swal.fire({ 
                icon: 'error', 
                title: 'Campos Incompletos', 
                text: 'Por favor ingresa tu correo y contraseña.',
                confirmButtonColor: 'var(--oro-principal)',
                background: '#042B35',
                color: '#F0F0F0'
            });
            return;
        }

        // Simulación de login exitoso
        Swal.fire({
            title: '¡Bienvenido!',
            text: 'Iniciando sesión en el sistema...',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
            background: '#042B35',
            color: '#F0F0F0'
        }).then(() => {
            navigate('/lotes'); // Redirige al dashboard de administración/lotes
        });
    }

    return (
        <div className="container-fluid p-0 position-relative" style={{minHeight: '100vh', overflow: 'hidden'}}>
            
            {/* FONDO PARALLAX (Imagen de Mar/Puerto elegante) */}
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: `linear-gradient(rgba(2, 30, 38, 0.7), rgba(2, 30, 38, 0.8)), url("https://images.unsplash.com/photo-1498654200943-1088dd4438ae?q=80&w=2070&auto=format&fit=crop")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0
                }}
            ></div>

            <div className="container position-relative h-100 d-flex align-items-center justify-content-center" style={{zIndex: 2, minHeight: '100vh'}}>
                <div className="row justify-content-center w-100">
                    <div className="col-md-8 col-lg-5">
                        
                        {/* TARJETA DE LOGIN */}
                        <div className="card-premium shadow-lg border-gold p-5" style={{background: 'rgba(4, 43, 53, 0.95)'}}>
                            
                            <div className="text-center mb-5">
                                <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4" style={{width: '80px', height: '80px', border: '2px solid var(--oro-principal)', background: 'rgba(212, 175, 55, 0.1)'}}>
                                    <i className="fas fa-anchor fa-2x text-gold"></i>
                                </div>
                                <h2 className="text-white mb-1" style={{fontFamily: "'Cinzel', serif", letterSpacing: '2px'}}>ACCESO VENDEDOR</h2>
                                <div className="mx-auto my-3" style={{width: '60px', height: '3px', backgroundColor: 'var(--oro-principal)'}}></div>
                                <p className="text-white-50 small text-uppercase letter-spacing-1">Sistema de Gestión Lonja Veracruz</p>
                            </div>

                            <form onSubmit={iniciarSesion}>
                                <div className="mb-4">
                                    <label className="form-label text-gold small text-uppercase fw-bold mb-2">Correo Electrónico</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-gold text-gold"><i className="fas fa-envelope"></i></span>
                                        <input 
                                            type="email"
                                            className="form-control bg-transparent text-white border-gold"
                                            style={{height: '50px'}}
                                            name="email"
                                            placeholder="usuario@lonja.com"
                                            onChange={leerDatos}
                                            autoComplete="off"
                                        />
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <label className="form-label text-gold small text-uppercase fw-bold mb-2">Contraseña</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-transparent border-gold text-gold"><i className="fas fa-lock"></i></span>
                                        <input 
                                            type="password"
                                            className="form-control bg-transparent text-white border-gold"
                                            style={{height: '50px'}}
                                            name="password"
                                            placeholder="••••••••"
                                            onChange={leerDatos}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn-premium w-100 py-3 fs-5 fw-bold shadow-lg letter-spacing-1">
                                    INGRESAR AL SISTEMA
                                </button>
                            </form>

                            <div className="text-center mt-4 pt-3 border-top border-secondary">
                                <a href="/" className="text-white-50 text-decoration-none small hover-gold transition">
                                    <i className="fas fa-arrow-left me-2"></i> Volver al Inicio
                                </a>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;