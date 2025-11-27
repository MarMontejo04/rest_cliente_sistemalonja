import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Lotes = () => {

    // EJEMPLO SE BORRA DESPUES 
    const [lotes] = useState([
        { _id: 1, especie: 'Huachinango', kilos: 50.5, cajas: 5, precio: 120.00, fecha: '2025-11-25' },
        { _id: 2, especie: 'Mojarra', kilos: 100, cajas: 10, precio: 85.50, fecha: '2025-11-25' },
        { _id: 3, especie: 'Camarón', kilos: 30, cajas: 2, precio: 250.00, fecha: '2025-11-24' },
    ]);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Inventario de Lotes</h2>
                
                {/* Solo para admin */}
                <Link to="/lotes/nuevo" className="btn btn-success">
                    + Nuevo Lote
                </Link>
            </div>

            <div className="table-responsive">
                <table className="table table-striped table-hover shadow-sm">
                    <thead className="table-dark">
                        <tr>
                            <th>Especie</th>
                            <th>Kilos</th>
                            <th>Cajas</th>
                            <th>Precio Salida (Kg)</th>
                            <th>Fecha Entrada</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lotes.map(lote => (
                            <tr key={lote._id}>
                                <td className="fw-bold">{lote.especie}</td>
                                <td>{lote.kilos} kg</td>
                                <td>{lote.cajas}</td>
                                <td>${lote.precio}</td>
                                <td>{lote.fecha}</td>
                                <td>
                                    <button className="btn btn-primary btn-sm me-2">
                                        Editar
                                    </button>
                                    <button className="btn btn-danger btn-sm">
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {/* /* SI no hay datos */}
                        {lotes.length === 0 && (
                            <tr>
                                <td colSpan="6" className="text-center p-4">
                                    No hay lotes registrados aún.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Lotes;