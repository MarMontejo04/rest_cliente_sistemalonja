import React from 'react';
import { Link } from 'react-router-dom';

const Inicio = () => {
    return (
        <div className="container-fluid p-0">

            <div 
                className="d-flex align-items-center justify-content-center text-center"
                style={{
                    minHeight: '80vh',
                    background: 'linear-gradient(rgba(2, 30, 38, 0.5), rgba(2, 30, 38, 0.5)), url("/img/fondo.png")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                    position: 'relative'
                }}
            >
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-xl-9">                            
                            <div className="card-premium p-4 p-md-5 shadow-lg border-gold" 
                                 style={{
                                     background: 'rgba(2, 30, 38, 0.85)',
                                     backdropFilter: 'blur(10px)',
                                     border: '1px solid var(--oro-oscuro)'
                                 }}>
                                
                                <div className="mb-5">
                                    <h1 className="display-3 fw-bold text-gold mb-3" style={{fontFamily: "'Cinzel', serif", textShadow: '0 2px 10px rgba(0,0,0,0.5)'}}>
                                        SISTEMA LONJA DE VERACRUZ
                                    </h1>
                                
                                    <div className="d-flex justify-content-center align-items-center mb-4">
                                        <div style={{height: '1px', width: '100px', background: 'linear-gradient(90deg, transparent, var(--oro-principal))'}}></div>
                                        <i className="fas fa-anchor mx-3 text-gold fs-5"></i>
                                        <div style={{height: '1px', width: '100px', background: 'linear-gradient(90deg, var(--oro-principal), transparent)'}}></div>
                                    </div>
                                    
                                    <p className="lead text-white fw-light fs-4" style={{letterSpacing: '0.5px'}}>
                                        Pescado Fresco y de Calidad. <br/> 
                                        <span className="text-gold fw-normal">Directo del Golfo de México.</span>
                                    </p>
                                </div>
                                
                                <div className="py-4 mb-5 rounded" style={{backgroundColor: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(212, 175, 55, 0.2)', borderBottom: '1px solid rgba(212, 175, 55, 0.2)'}}>
                                    <div className="row justify-content-center">
                                        <div className="col-4 col-md-3">
                                            <div className="mb-2"><i className="fas fa-fish fa-2x text-gold"></i></div>
                                            <h5 className="text-white small text-uppercase letter-spacing-2 mb-0">Fresco</h5>
                                        </div>
                                        <div className="col-4 col-md-3 border-start border-end border-secondary">
                                            <div className="mb-2"><i className="fas fa-ship fa-2x text-gold"></i></div>
                                            <h5 className="text-white small text-uppercase letter-spacing-2 mb-0">Directo</h5>
                                        </div>
                                        <div className="col-4 col-md-3">
                                            <div className="mb-2"><i className="fas fa-utensils fa-2x text-gold"></i></div>
                                            <h5 className="text-white small text-uppercase letter-spacing-2 mb-0">Calidad</h5>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="h4 text-gold mb-4 text-uppercase letter-spacing-2" style={{fontFamily: "'Cinzel', serif"}}>
                                        — Catálogo de Venta —
                                    </h2>

                                    <div className="row g-3 justify-content-center">
                                        <div className="col-sm-6 col-md-5">
                                            <Link to="/compras/azul" className="btn btn-outline-light w-100 py-3 text-uppercase fw-bold hover-gold" style={{border: '1px solid var(--oro-oscuro)'}}>
                                                Pescado Azul
                                            </Link>
                                        </div>
                                        <div className="col-sm-6 col-md-5">
                                            <Link to="/compras/blanco" className="btn btn-outline-light w-100 py-3 text-uppercase fw-bold hover-gold" style={{border: '1px solid var(--oro-oscuro)'}}>
                                                Pescado Blanco
                                            </Link>
                                        </div>
                                        <div className="col-sm-6 col-md-5">
                                            <Link to="/compras/semigraso" className="btn btn-outline-light w-100 py-3 text-uppercase fw-bold hover-gold" style={{border: '1px solid var(--oro-oscuro)'}}>
                                                Semigrasos
                                            </Link>
                                        </div>
                                        <div className="col-sm-6 col-md-5">
                                            <Link to="/compras/marisco" className="btn btn-outline-light w-100 py-3 text-uppercase fw-bold hover-gold" style={{border: '1px solid var(--oro-oscuro)'}}>
                                                Mariscos
                                            </Link>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
            
            <section className="py-5 bg-animated" style={{borderTop: '4px solid var(--oro-principal)'}}>
                <div className="container text-center position-relative" style={{zIndex: 2}}>
                    
                    <div className="mb-5">
                        <h2 className="text-gold mb-2 display-4" style={{fontFamily: "'Cinzel', serif"}}>NUESTROS SERVICIOS</h2>
                        <div className="mx-auto" style={{width: '150px', height: '3px', backgroundColor: 'var(--oro-principal)'}}></div>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="service-card">
                                <div className="service-icon-wrapper">
                                    <i className="fas fa-boxes fa-2x"></i>
                                </div>
                                <h4 className="text-gold mb-3">GESTIÓN DE LOTES</h4>
                                <p className="text-white-50">
                                    Control total del inventario que llega del mar. Monitoreo preciso de kilos, cajas y precios de salida.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="service-card">
                                <div className="service-icon-wrapper">
                                    <i className="fas fa-hand-holding-dollar fa-2x"></i>
                                </div>
                                <h4 className="text-gold mb-3">VENTAS MAYORISTAS</h4>
                                <p className="text-white-50">
                                    Precios competitivos por caja o volumen. Negociación directa y transparente para nuestros clientes.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="service-card">
                                <div className="service-icon-wrapper">
                                    <i className="fas fa-chart-pie fa-2x"></i>
                                </div>
                                <h4 className="text-gold mb-3">REPORTES DIARIOS</h4>
                                <p className="text-white-50">
                                    Transparencia total en cada operación. Generación automática de informes de ventas y stock.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}

export default Inicio;