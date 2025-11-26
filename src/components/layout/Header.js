import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <nav>
            <h1>Sistema Lonja</h1>
            <ul>
                <li><Link to="/">Inicio</Link></li>
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/lotes">Lotes</Link></li>
                <li><Link to="/compras/nueva">Ventas</Link></li>
                <li><Link to="/compras/reporte">Reportes</Link></li>
            </ul>
            <hr/>
        </nav>
    );
}
export default Header;