import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ReciboVenta = () => {
    const { id } = useParams(); // Capturamos el ID de la venta de la URL

    return (
        <div className="container mt-5 text-center">
            <div className="card shadow" style={{maxWidth: '500px', margin: '0 auto'}}>
                <div className="card-body">
                    <h1 className="text-success display-1"><i className="bi bi-check-circle"></i></h1>
                    <h3 className="card-title">¡Venta Exitosa!</h3>
                    <p className="text-muted">Folio de venta: {id}</p>
                    
                    <hr/>
                    
                    <div className="text-start px-4">
                        <p><strong>Producto:</strong> Huachinango (Ejemplo)</p>
                        <p><strong>Peso:</strong> 5.00 kg</p>
                        <p><strong>Total Pagado:</strong> $600.00</p>
                    </div>

                    <hr/>

                    <div className="d-grid gap-2">
                        <button className="btn btn-outline-dark">Imprimir Ticket</button>
                        <Link to="/compras/nueva" className="btn btn-primary">Nueva Venta</Link>
                        <Link to="/compras/reporte" className="btn btn-link">Ver Reporte del Día</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ReciboVenta;