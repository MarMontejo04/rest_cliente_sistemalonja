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

    // Estilo para el menú desplegable
    const dropdownStyle = {
        backgroundColor: 'rgba(4, 43, 53, 0.98)', 
        border: '1px solid var(--oro-oscuro)',
        padding: '12px 0',
        backdropFilter: 'blur(10px)',
        minWidth: '240px' 
    };

    // Estilo para los items del menú
    const itemStyle = {
        color: '#eee',
        padding: '12px 25px', 
        fontSize: '1.1rem',   
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        width: '100%',     // Asegura que el botón o link ocupe todo el ancho
        textAlign: 'left', // Alineación para botones
        background: 'transparent', // Para botones
        border: 'none'     // Para botones
    };

    // Estilo para los títulos pequeños
    const headerStyle = {
        fontSize: '0.85rem',
        letterSpacing: '1px',
        fontWeight: 'bold',
        padding: '5px 25px'
    };

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
                            <Link to="/" className="nav-link" style={{fontSize: '1.1rem'}}>Inicio</Link>
                        </li>

                        {/* --- DROPDOWN CATÁLOGO (Corregido: Button en vez de A) --- */}
                        <li className="nav-item dropdown mx-2">
                            <button 
                                className="nav-link dropdown-toggle text-gold bg-transparent border-0" 
                                type="button" 
                                data-bs-toggle="dropdown" 
                                aria-expanded="false" 
                                style={{fontSize: '1.1rem', cursor: 'pointer'}}
                            >
                                <i className="fas fa-fish me-1"></i> Catálogo
                            </button>
                            
                            <ul className="dropdown-menu shadow-lg border-0 mt-2" style={dropdownStyle}>
                                
                                <li>
                                    <Link to="/crearCliente" className="dropdown-item hover-gold" style={itemStyle}>
                                        <i className="fas fa-user-circle me-2"></i> REGISTRATE
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider bg-secondary opacity-25 my-2" /></li>

                                <li>
                                    <Link to="/compras/azul" className="dropdown-item hover-gold" style={itemStyle}>
                                        <i className="fas fa-water me-3 text-info fa-lg"></i> Pescado Azul
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/compras/blanco" className="dropdown-item hover-gold" style={itemStyle}>
                                        <i className="fas fa-snowflake me-3 text-white fa-lg"></i> Pescado Blanco
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/compras/semigraso" className="dropdown-item hover-gold" style={itemStyle}>
                                        <i className="fas fa-adjust me-3 text-warning fa-lg"></i> Semigraso
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider bg-secondary opacity-25 my-2" /></li>
                                <li>
                                    <Link to="/compras/marisco" className="dropdown-item hover-gold" style={itemStyle}>
                                        <i className="fas fa-shrimp me-3 text-danger fa-lg"></i> Mariscos
                                    </Link>
                                </li>
                            </ul>
                        </li>

                        <li className="nav-item d-none d-lg-block mx-2 text-muted">|</li>

                        {/* --- DROPDOWN ADMINISTRACIÓN (Corregido: Button en vez de A) --- */}
                        
                        {rol ? (
                            <>
                                <li className="nav-item dropdown">
                                    <button 
                                        className="nav-link dropdown-toggle text-gold fw-bold bg-transparent border-0" 
                                        type="button" 
                                        data-bs-toggle="dropdown" 
                                        aria-expanded="false" 
                                        style={{fontSize: '1.1rem', cursor: 'pointer'}}
                                    >
                                        <i className="fas fa-user-shield me-1"></i> Administración
                                    </button>

                                    <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 mt-2" style={dropdownStyle}>
                                        
                                        <li><span className="dropdown-header text-white-50 text-uppercase" style={headerStyle}>Gestión Diaria</span></li>
                                        
                                        <li>
                                            <Link to="/lotes" className="dropdown-item hover-gold" style={itemStyle}>
                                                <i className="fas fa-boxes me-3 fa-lg"></i> Inventario de Lotes
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/compras/reporte" className="dropdown-item hover-gold" style={itemStyle}>
                                                <i className="fas fa-cash-register me-3 fa-lg"></i> Ventas del Día
                                            </Link>
                                        </li>

                                        {rol === 'admin' && (
                                            <>
                                                <li><hr className="dropdown-divider bg-secondary opacity-25 my-2" /></li>
                                                <li><span className="dropdown-header text-white-50 text-uppercase" style={headerStyle}>Personal</span></li>
                                                <li>
                                                    <Link to="/vendedores" className="dropdown-item hover-gold" style={itemStyle}>
                                                        <i className="fas fa-users-cog me-3 text-info fa-lg"></i> Gestionar Vendedores
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/nuevoVendedor" className="dropdown-item hover-gold" style={itemStyle}>
                                                        <i className="fas fa-user-plus me-3 text-success fa-lg"></i> Nuevo Vendedor
                                                    </Link>
                                                </li>
                                            </>
                                        )}
                                        
                                        <li><hr className="dropdown-divider bg-secondary opacity-25 my-2" /></li>
                                        
                                        <li>
                                            <button 
                                                onClick={cerrarSesion} 
                                                className="dropdown-item hover-gold text-danger fw-bold" 
                                                style={itemStyle}
                                            >
                                                <i className="fas fa-sign-out-alt me-3 fa-lg"></i> Cerrar Sesión
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item ms-lg-3 mt-3 mt-lg-0">
                                    <Link to="/login" className="btn btn-symbol-primary fs-5 px-4">
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