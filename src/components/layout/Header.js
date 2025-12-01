import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
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
                        
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Inicio</Link>
                        </li>

                        <li className="nav-item">
                            <Link to="/compras/azul" className="nav-link">Pescado Azul</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/compras/blanco" className="nav-link">Pescado Blanco</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/compras/semigraso" className="nav-link">Pescado Semigraso</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/compras/marisco" className="nav-link">Mariscos</Link>
                        </li>
                        
                        <li className="nav-item d-none d-lg-block mx-3 text-muted">|</li>

                        <li className="nav-item ms-lg-3">
                            <Link to="/lotes" className="nav-link text-gold">
                                <i className="fas fa-chart-line me-1"></i> Lotes
                            </Link>
                        </li>

                        <li className="nav-item ms-lg-3">
                            <Link to="/compras/reporte" className="nav-link text-gold">
                                <i className="fas fa-chart-pie me-1"></i> Ventas del Día
                            </Link>
                        </li>

                        <li className="nav-item ms-lg-4 mt-3 mt-lg-0">
                            <Link to="/login" className="btn btn-symbol-primary text-decoration-none">
                                <i className="fas fa-user-circle me-2"></i> Vendedor
                            </Link>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;