import React from 'react';
import { Link, useParams } from 'react-router-dom';

const ReciboVenta = () => {
    const { id } = useParams(); 

    const venta = {
        folio: id || 'V-999',
        fecha: new Date().toLocaleDateString(),
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        cliente: 'Restaurante "El Jarocho"',
        producto: 'Camarón Cristal',
        peso: '30.5 kg',
        cajas: 3,
        total: 7715.00
    };

    return (
        <div className="container-fluid p-0 d-flex align-items-center justify-content-center bg-animated" style={{minHeight: '100vh'}}>
            
            <div className="container py-4"> 
                <div className="row justify-content-center align-items-center"> 
                    
                    <div className="col-md-6 col-lg-5 mb-4 mb-md-0">
                        <div className="card border-0 shadow-lg" style={{backgroundColor: '#FFF', color: '#000', borderRadius: '0'}}>
                            
                            <div className="card-header bg-white border-bottom-0 pt-4 pb-0 text-center">
                                <h2 className="mb-0 text-uppercase h4" style={{fontFamily: "'Cinzel', serif", color: 'var(--color-panel)', letterSpacing: '1px'}}>Lonja Veracruz</h2>
                                <p className="small text-muted text-uppercase letter-spacing-1 mt-1">Comprobante de Operación</p>
                                <div className="my-3" style={{borderBottom: '1px dashed #ccc'}}></div>
                            </div>

                            <div className="card-body px-4 pb-4">
                                <div className="text-center mb-3">
                                    <div className="d-inline-flex align-items-center justify-content-center rounded-circle mb-2" style={{width: '50px', height: '50px', backgroundColor: 'rgba(46, 213, 115, 0.1)', color: '#2ED573'}}>
                                        <i className="fas fa-check fa-lg"></i>
                                    </div>
                                    <h5 className="mb-0" style={{fontFamily: "'Playfair Display', serif"}}>Venta Registrada</h5>
                                    <p className="text-muted small mb-0">Folio: <span className="fw-bold text-dark">{venta.folio}</span></p>
                                </div>

                                <div className="small"> 
                                    <div className="row mb-1">
                                        <div className="col-6 text-muted text-uppercase">Fecha</div>
                                        <div className="col-6 text-end fw-bold">{venta.fecha} {venta.hora}</div>
                                    </div>
                                    <div className="row mb-1">
                                        <div className="col-6 text-muted text-uppercase">Cliente</div>
                                        <div className="col-6 text-end fw-bold">{venta.cliente}</div>
                                    </div>
                                    <hr className="my-2" style={{borderColor: '#eee'}} />
                                    <div className="row mb-1">
                                        <div className="col-6 text-muted text-uppercase">Producto</div>
                                        <div className="col-6 text-end fw-bold">{venta.producto}</div>
                                    </div>
                                    <div className="row mb-1">
                                        <div className="col-6 text-muted text-uppercase">Peso Neto</div>
                                        <div className="col-6 text-end fw-bold">{venta.peso}</div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-6 text-muted text-uppercase">Envases</div>
                                        <div className="col-6 text-end fw-bold">{venta.cajas} pzas</div>
                                    </div>
                                </div>

                                <div className="p-3 rounded text-center mb-3" style={{backgroundColor: 'var(--color-panel)', color: 'var(--oro-principal)'}}>
                                    <div className="small text-uppercase mb-0 text-white-50" style={{fontSize: '0.7rem'}}>Total a Pagar</div>
                                    <h2 className="mb-0 fw-bold">${venta.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</h2>
                                </div>

                                <div className="alert alert-warning d-flex align-items-start mb-0 p-2" role="alert" style={{fontSize: '0.75rem', border: '1px solid #ffecb5', backgroundColor: '#fff3cd', color: '#664d03'}}>
                                    <i className="fas fa-exclamation-triangle me-2 mt-1"></i>
                                    <div>
                                        <strong>IMPORTANTE:</strong> Conserve este ticket para el pago y retiro.
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{
                                height: '15px', 
                                backgroundImage: 'radial-gradient(circle, transparent 70%, #fff 75%)', 
                                backgroundSize: '20px 20px', 
                                backgroundPosition: '0 10px',
                                marginTop: '-15px'
                            }}></div>
                        </div>
                    </div>

                    <div className="col-md-5 col-lg-4 ps-md-5">
                        <div className="d-flex flex-column gap-3">
                            
                            <h4 className="text-white text-uppercase mb-3" style={{fontFamily: "'Cinzel', serif", textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>
                                Siguientes Pasos
                            </h4>

                            <button className="btn btn-outline-light btn-lg w-100 py-3 text-start d-flex align-items-center justify-content-between hover-scale" onClick={() => window.print()}>
                                <span><i className="fas fa-print me-3"></i>Imprimir Ticket</span>
                                <i className="fas fa-chevron-right small"></i>
                            </button>

                            <Link to="/" className="btn btn-premium btn-lg w-100 py-3 text-start d-flex align-items-center justify-content-between hover-scale text-decoration-none text-dark">
                                <span><i className="fas fa-cart-plus me-3"></i>Nueva Venta</span>
                                <i className="fas fa-chevron-right small"></i>
                            </Link>

                            <Link to="/" className="btn btn-outline-warning btn-lg w-100 py-3 text-start d-flex align-items-center justify-content-between hover-scale text-decoration-none">
                                <span><i className="fas fa-home me-3"></i>Ir al Inicio</span>
                                <i className="fas fa-chevron-right small"></i>
                            </Link>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default ReciboVenta;