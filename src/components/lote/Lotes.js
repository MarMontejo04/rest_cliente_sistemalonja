import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Lotes = () => {

    const [lotes] = useState([
        { 
            _id: 1, 
            especie: 'Huachinango', 
            proveedor: 'Cooperativa "El Faro"', 
            kilos: 50.5, 
            cajas: 5, 
            precio: 120.00, 
            fecha: '2025-11-25',
            estado: 'Disponible' 
        },
        { 
            _id: 2, 
            especie: 'Mojarra', 
            proveedor: 'Pesquera del Golfo', 
            kilos: 100, 
            cajas: 10, 
            precio: 85.50, 
            fecha: '2025-11-25',
            estado: 'Disponible' 
        },
        { 
            _id: 3, 
            especie: 'Camarón', 
            proveedor: 'Mariscos Veracruzanos SA', 
            kilos: 0, 
            cajas: 0, 
            precio: 250.00, 
            fecha: '2025-11-24',
            estado: 'Agotado' 
        },
    ]);

    return (
        <div className="container-fluid p-0 bg-animated" style={{minHeight: '100vh'}}>
            <div className="container py-5">
                
                <div className="d-flex flex-wrap justify-content-between align-items-end mb-5 border-bottom border-secondary pb-4">
                    <div className="mb-3 mb-md-0">
                        <h4 className="text-gold text-uppercase letter-spacing-2 mb-0 small">Administración</h4>
                        <h1 className="display-4 text-white mb-0" style={{fontFamily: "'Cinzel', serif"}}>
                            Inventario de Lotes
                        </h1>
                    </div>
                    
                    <Link to="/lotes/nuevo" className="btn btn-symbol-primary shadow-lg px-4 py-2">
                        <span className="me-2">+</span> Registrar Lote
                    </Link>
                </div>

                <div className="card border-0 shadow-lg" style={{backgroundColor: 'rgba(4, 43, 53, 0.95)', backdropFilter: 'blur(10px)', border: '1px solid var(--oro-oscuro)'}}>
                    <div className="table-responsive">
                        <table className="table table-premium align-middle mb-0" style={{color: '#eee'}}>
                            <thead>
                                <tr>
                                    <th className="py-4 ps-5" style={{minWidth: '250px'}}>Producto / Origen</th>
                                    <th className="py-4 text-center">Stock Actual</th>
                                    <th className="py-4 text-center">Cajas</th>
                                    <th className="py-4 text-end">Precio Salida</th>
                                    <th className="py-4 text-center">Estado</th>
                                    <th className="py-4 text-end pe-5" style={{minWidth: '150px'}}>Acciones</th>
                                </tr>
                            </thead>
                            
                            <tbody>
                                {lotes.length > 0 ? (
                                    lotes.map(lote => (
                                        <tr key={lote._id}>
                                            
                                            <td className="ps-5 py-4">
                                                <div className="d-flex align-items-center">
                                                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3" 
                                                         style={{width: '45px', height: '45px', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '1px solid var(--oro-oscuro)', color: 'var(--oro-principal)'}}>
                                                        <i className="fas fa-fish fs-5"></i>
                                                    </div>
                                                    <div>
                                                        <div className="fw-bold fs-5 text-white">{lote.especie}</div>
                                                        <small className="text-white-50" style={{fontSize: '0.75rem'}}>
                                                            Prov: <span className="text-gold">{lote.proveedor}</span> • {lote.fecha}
                                                        </small>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="text-center py-4">
                                                <span className={`badge fs-6 px-3 py-2 rounded-1 shadow-sm fw-bold ${lote.kilos > 0 ? 'bg-white text-dark' : 'bg-danger text-white'}`}>
                                                    {lote.kilos} kg
                                                </span>
                                            </td>

                                            <td className="text-center py-4 text-white-50 fw-bold fs-5">
                                                {lote.cajas}
                                            </td>

                                            <td className="text-end py-4">
                                                <span className="text-gold fw-bold fs-5">${lote.precio.toFixed(2)}</span>
                                                <small className="text-muted d-block" style={{fontSize: '0.7rem'}}>/ kg</small>
                                            </td>

                                            <td className="text-center py-4">
                                                {lote.estado === 'Disponible' ? (
                                                    <span className="text-success small text-uppercase fw-bold"><i className="fas fa-check-circle me-1"></i> Activo</span>
                                                ) : (
                                                    <span className="text-danger small text-uppercase fw-bold"><i className="fas fa-times-circle me-1"></i> Agotado</span>
                                                )}
                                            </td>

                                            <td className="text-end py-4 pe-5">
                                                <div className="d-flex justify-content-end gap-2">
                                                    {lote.kilos > 0 && (
                                                        <Link to="/compras/nueva" className="btn btn-sm btn-outline-light px-3 d-flex align-items-center gap-2" style={{borderColor: 'rgba(255,255,255,0.3)'}}>
                                                            <i className="fas fa-shopping-cart small"></i> Vender
                                                        </Link>
                                                    )}
                                                    
                                                    <Link 
                                                        to={`/lotes/editar/${lotes._id}`} 
                                                        className="btn btn-sm btn-outline-warning px-3 d-flex align-items-center gap-2" 
                                                        style={{borderColor: 'var(--oro-oscuro)', color: 'var(--oro-principal)'}}
                                                    >
                                                        <i className="fas fa-edit small"></i> Editar
                                                    </Link>
                                                    
                                                    <button className="btn btn-sm btn-outline-danger px-3 d-flex align-items-center gap-2" style={{borderColor: 'rgba(220, 53, 69, 0.5)'}}>
                                                        <i className="fas fa-trash small"></i> Borrar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5 text-muted">
                                            <div className="opacity-50 mb-3">
                                                <i className="fas fa-box-open fa-4x"></i>
                                            </div>
                                            <h5 className="text-white-50 fw-light">No hay lotes registrados en el sistema.</h5>
                                            <Link to="/lotes/nuevo" className="btn btn-outline-gold btn-sm mt-3">
                                                Registrar el primero
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Lotes;