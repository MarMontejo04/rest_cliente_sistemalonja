import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    
    const rol = localStorage.getItem('rol'); 

    const cerrarSesion = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('rol');
        navigate('/');
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-symbol sticky-top">
            <div className="container-fluid">
                
                <Link to="/" className="navbar-brand">
                    <i className="fas fa-anchor me-2"></i> LONJA VERACRUZ
                </Link>
                
                <button
                    className="navbar-toggler btn-premium" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{padding: '5px 10px', fontSize: '0.8rem'}} 
                >
                    <span className="navbar-toggler-icon" style={{filter: 'invert(1)'}}></span>
                </button>

                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav align-items-center">
                        
                        <li className="nav-item"><Link to="/" className="nav-link">Inicio</Link></li>
                        <li className="nav-item"><Link to="/compras/azul" className="nav-link">Pescado Azul</Link></li>
                        <li className="nav-item"><Link to="/compras/blanco" className="nav-link">Pescado Blanco</Link></li>
                        <li className="nav-item"><Link to="/compras/semigraso" className="nav-link">Pescado Semigraso</Link></li>
                        <li className="nav-item"><Link to="/compras/marisco" className="nav-link">Mariscos</Link></li>
                        
                        <li className="nav-item d-none d-lg-block mx-2 text-muted">|</li>

                        
                        {rol ? (
                            // SI HAY SESIÓN (Común para Admin y Vendedor)
                            <>
                                <li className="nav-item">
                                    <Link to="/lotes" className="nav-link text-gold fw-bold">Lotes</Link>
                                </li>

                                <li className="nav-item">
                                    <Link to="/compras/reporte" className="nav-link text-gold fw-bold">Ventas del Día</Link>
                                </li>
                                
                                {/* EXCLUSIVO ADMIN */}
                    {rol === 'admin' && (
                        <>
                           <li className="nav-item">
                                <Link to="/Vendedores" className="nav-link text-info fw-bold">
                                    <i className="fas fa-users-cog me-1"></i> Gestionar Vendedores
                                </Link>
                           </li>
        
                            <li className="nav-item">
                                <Link to="/nuevoVendedor" className="nav-link text-gold fw-bold">
                                    <i className="fas fa-user-plus me-1"></i> Nuevo Vendedor
                                </Link>
                            </li>
                        </>
                        )}
                                <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                                    <button 
                                        onClick={cerrarSesion} 
                                        className="btn btn-outline-warning btn-sm text-uppercase fw-bold px-4"
                                    >
                                        <i className="fas fa-sign-out-alt me-2"></i> Salir
                                    </button>
                                </li>
                            </>
                        ) : (
                            <>

                                <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                                    <Link to="/login" className="btn btn-symbol-primary">
                                        <i className="fas fa-user-circle me-2"></i> Ingresar
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;