import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        // Usamos la clase 'navbar-symbol' para el fondo azul y borde dorado
        <nav className="navbar navbar-expand-lg navbar-symbol sticky-top">
            <div className="container-fluid">
                
                {/* Logo con estilo premium */}
                <Link to="/" className="navbar-brand">
                    <i className="fas fa-anchor me-2"></i> LONJA VERACRUZ
                </Link>
                
                {/* Botón hamburguesa estilizado */}
                <button
                    className="navbar-toggler btn-premium" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                    style={{padding: '5px 10px', fontSize: '0.8rem'}} // Ajuste para que no sea gigante
                >
                    {/* Filtro para que el icono sea visible sobre fondo oscuro */}
                    <span className="navbar-toggler-icon" style={{filter: 'invert(1)'}}></span>
                </button>

                {/* ENLACES DE NAVEGACIÓN */}
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav align-items-center">
                        
                        <li className="nav-item">
                            <Link to="/" className="nav-link">Inicio</Link>
                        </li>

                        {/* Enlaces de Compra */}
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
                        
                        {/* Separador visual */}
                        <li className="nav-item d-none d-lg-block mx-3 text-muted">|</li>

                        {/* Enlaces Administrativos (Resaltados) */}
                        <li className="nav-item ms-lg-3">
                            {/* Usamos text-gold en lugar de text-danger para que combine mejor */}
                            <Link to="/lotes" className="nav-link text-gold">
                                <i className="fas fa-chart-line me-1"></i> Lotes
                            </Link>
                        </li>

                        <li className="nav-item ms-lg-3">
                            <Link to="/compras/reporte" className="nav-link text-gold">
                                <i className="fas fa-chart-pie me-1"></i> Ventas del Día
                            </Link>
                        </li>

                        {/* Botón de Acción */}
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