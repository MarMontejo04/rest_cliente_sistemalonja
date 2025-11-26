import React from 'react';
import { Link } from 'react-router-dom';

const Inicio = () => {
    return (
        <div>
            <h1>Bienvenido al Sistema Lonja</h1>
            <p>dos mas dos es igual a pez</p>
            
            <div>
                <h3>Lo que pueds hacer aqui</h3>
                <ul>
                    <li>Gestionar el inventario de Lotes</li>
                    <li>Registrar Ventas diarias</li>
                    <li>Generar Reportes automáticos</li>
                </ul>
            </div>

            <Link to="/login">
                <button>Ingresar al Sistema</button>
            </Link>
        </div>
    );
}

export default Inicio;