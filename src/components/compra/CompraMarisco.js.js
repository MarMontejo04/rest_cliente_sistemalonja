import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CompraMarisco = () => {
    const navigate = useNavigate();

    const PRECIO_CAJA = 30; 

    // 1. DATOS DUMMY (MARISCOS)
    const [inventario] = useState([
        { 
            _id: 'M1', 
            especie: 'Camarón', 
            tipo: 'Jumbo', 
            precio: 250, 
            disponible: 30.5, 
            cajas: 3, 
            imagen: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?q=80&w=1000&auto=format&fit=crop' 
        },
        { 
            _id: 'M2', 
            especie: 'Camarón', 
            tipo: 'Pacotilla', 
            precio: 180, 
            disponible: 50.0, 
            cajas: 5, 
            imagen: 'https://images.unsplash.com/photo-1623962540777-27b3b0205106?q=80&w=1000&auto=format&fit=crop' 
        },
        { 
            _id: 'M3', 
            especie: 'Pulpo', 
            tipo: 'Grande', 
            precio: 220, 
            disponible: 15.0, 
            cajas: 1, 
            imagen: 'https://images.unsplash.com/photo-1545688562-b5a29454e759?q=80&w=1000&auto=format&fit=crop' 
        },
        { 
            _id: 'M4', 
            especie: 'Jaiba', 
            tipo: 'Entera', 
            precio: 90, 
            disponible: 40.0, 
            cajas: 2, 
            imagen: 'https://images.unsplash.com/photo-1539683255143-73a6b838b106?q=80&w=1000&auto=format&fit=crop' 
        },
    ]);

    // Fondo inicial temático
    const [imagenFondo, setImagenFondo] = useState('/img/fondoMarisco.png'); 
    
    const [compra, guardarCompra] = useState({
        id_lote: '',
        id_comprador: 'Publico General',
        kilos: '',      
        cajas: 0,       
        precio_kilo: '', 
        total_pescado: 0,
        total_cajas: 0,
        gran_total: 0,
        especieNombre: '',
        especieTipo: ''
    });

    const seleccionarLote = (e) => {
        const idLote = e.target.value;
        const loteEncontrado = inventario.find(l => l._id === idLote);

        if (loteEncontrado) {
            guardarCompra({
                ...compra,
                id_lote: idLote,
                kilos: loteEncontrado.disponible, 
                cajas: loteEncontrado.cajas,
                precio_kilo: loteEncontrado.precio,
                especieNombre: loteEncontrado.especie,
                especieTipo: loteEncontrado.tipo
            });
            setImagenFondo(loteEncontrado.imagen);
        } else {
            guardarCompra({ ...compra, id_lote: '', kilos: '', cajas: 0, precio_kilo: '', especieNombre: '', especieTipo: '' });
            setImagenFondo('https://images.unsplash.com/photo-1615141982880-1313d87a7409?q=80&w=2070&auto=format&fit=crop'); 
        }
    }

    useEffect(() => {
        const { kilos, cajas, precio_kilo } = compra;
        if(kilos && precio_kilo) {
            const costoPescado = parseFloat(kilos) * parseFloat(precio_kilo);
            const costoEnvases = parseFloat(cajas) * PRECIO_CAJA;
            const totalFinal = costoPescado + costoEnvases;

            guardarCompra(prev => ({ 
                ...prev, 
                total_pescado: costoPescado.toFixed(2),
                total_cajas: costoEnvases.toFixed(2),
                gran_total: totalFinal.toFixed(2) 
            }));
        }
    }, [compra.kilos, compra.cajas, compra.precio_kilo]);

    const procesarVenta = e => {
        e.preventDefault();
        Swal.fire({
            title: 'Venta Exitosa',
            text: `Total a cobrar: $${compra.gran_total}`,
            icon: 'success',
            confirmButtonColor: 'var(--oro-principal)',
            background: '#042B35',
            color: '#F0F0F0'
        }).then(() => {
             navigate('/compras/recibo/V-999'); 
        });
    }

    return (
        <div className="container-fluid p-0 position-relative" style={{backgroundColor: 'var(--color-fondo)'}}>
            
            <div 
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '80vh',
                    backgroundImage: `linear-gradient(to right, rgba(2, 30, 38, 0.95) 0%, rgba(2, 30, 38, 0.85) 40%, rgba(2, 30, 38, 0.4) 100%), url("${imagenFondo}")`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed', // Efecto Parallax
                    transition: 'background-image 0.6s ease-in-out',
                    zIndex: 0
                }}
            ></div>

            {/* CONTENIDO PRINCIPAL (Flotando sobre el parallax) */}
            <div className="container position-relative" style={{zIndex: 2, minHeight: '80vh', paddingTop: '5vh'}}>
                <div className="row h-100 align-items-center justify-content-between">
                    
                    {/* COLUMNA IZQUIERDA */}
                    <div className="col-lg-5 mb-5 mb-lg-0 text-white animate__animated animate__fadeInLeft">
                        <h4 className="text-gold text-uppercase letter-spacing-2 mb-4" style={{borderBottom: '2px solid var(--oro-oscuro)', display: 'inline-block', paddingBottom: '10px'}}>
                            <i className="fas fa-utensils me-2"></i> Mariscos y Crustáceos
                        </h4>
                        
                        {compra.id_lote ? (
                            <div>
                                <h1 className="display-1 fw-bold mb-2 text-white" style={{fontFamily: "'Playfair Display', serif", textShadow: '0 4px 10px rgba(0,0,0,0.5)'}}>
                                    {compra.especieNombre}
                                </h1>
                                <h2 className="display-6 text-gold mb-4 fst-italic" style={{fontFamily: "'Cinzel', serif"}}>
                                    {compra.especieTipo}
                                </h2>
                                
                                <div className="d-flex gap-4 mt-5">
                                    <div className="text-center px-4 py-3 border border-gold rounded" style={{background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(5px)'}}>
                                        <i className="fas fa-weight-hanging fs-2 text-gold mb-2"></i>
                                        <div className="small text-uppercase text-white-50 text-premium-lg">Peso Neto</div>
                                        <div className="text-value-lg text-white">{compra.kilos} kg</div>
                                    </div>
                                    <div className="text-center px-4 py-3 border border-gold rounded" style={{background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(5px)'}}>
                                        <i className="fas fa-box-open fs-2 text-gold mb-2"></i>
                                        <div className="small text-uppercase text-white-50 text-premium-lg">Cajas</div>
                                        <div className="text-value-lg text-white">{compra.cajas} pzas</div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h1 className="display-3 fw-bold mb-4" style={{fontFamily: "'Playfair Display', serif"}}>Seleccione su Producto</h1>
                                <p className="lead text-white-50 fs-4">Explore nuestro inventario fresco disponible para comenzar la venta del día.</p>
                            </div>
                        )}
                    </div>

                    {/* COLUMNA DERECHA */}
                    <div className="col-lg-6 animate__animated animate__fadeInRight">
                        <div className="card-premium shadow-lg border-gold" style={{background: 'rgba(4, 43, 53, 0.95)'}}>
                            <div className="card-body p-4 p-xl-5">
                                <form onSubmit={procesarVenta}>
                                    
                                    <div className="mb-5">
                                        <label className="form-label text-gold fw-bold text-uppercase small mb-2">Producto Disponible</label>
                                        <select 
                                            className="form-select form-select-lg text-white border-gold" 
                                            style={{backgroundColor: 'rgba(0,0,0,0.5)', height: '60px', fontSize: '1.3rem'}}
                                            name="id_lote" 
                                            onChange={seleccionarLote}
                                            required
                                        >
                                            <option value="">-- Seleccionar Marisco --</option>
                                            {inventario.map(lote => (
                                                <option key={lote._id} value={lote._id}>
                                                    {lote.especie} - {lote.tipo} | ${lote.precio}/kg
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {compra.id_lote && (
                                        <div className="animate__animated animate__fadeInUp">
                                            <div className="p-4 rounded mb-4" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid var(--oro-oscuro)'}}>
                                                <h5 className="text-gold mb-4 border-bottom border-secondary pb-2" style={{fontFamily: "'Cinzel', serif"}}>Desglose de Costos</h5>
                                                
                                                <div className="d-flex justify-content-between mb-2 text-white-50 text-premium-lg">
                                                    <span>Producto ({compra.kilos}kg x ${compra.precio_kilo})</span>
                                                    <span className="text-white">${compra.total_pescado}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-3 text-white-50 text-premium-lg">
                                                    <span>Envases ({compra.cajas} x ${PRECIO_CAJA})</span>
                                                    <span className="text-white">${compra.total_cajas}</span>
                                                </div>
                                                
                                                <div className="d-flex justify-content-between align-items-center pt-3 border-top border-secondary mt-3">
                                                    <span className="text-gold fw-bold fs-4">TOTAL A PAGAR</span>
                                                    <span className="display-4 fw-bold text-white" style={{textShadow: '0 0 15px rgba(212, 175, 55, 0.5)'}}>${compra.gran_total}</span>
                                                </div>
                                            </div>

                                            <button type="submit" className="btn-premium w-100 py-4 fs-4 fw-bold shadow-lg d-flex justify-content-between align-items-center px-5">
                                                <span>CONFIRMAR COMPRA</span>
                                                <i className="fas fa-arrow-right"></i>
                                            </button>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <section className="py-5 bg-animated" style={{borderTop: '4px solid var(--oro-principal)', position: 'relative', zIndex: 2}}>
                <div className="container text-center">
                    <div className="row justify-content-center mb-5">
                        <div className="col-lg-8">
                            <h2 className="text-gold mb-3 display-4" style={{fontFamily: "'Cinzel', serif"}}>Mariscos</h2>
                            <div className="mx-auto mb-4" style={{width: '150px', height: '3px', backgroundColor: 'var(--oro-principal)'}}></div>
                            <p className="lead text-white-50 fs-5">
                                Capturados diariamente en las costas de Veracruz, nuestros mariscos y crustáceos representan la frescura y calidad que nos distingue. Seleccionados cuidadosamente para garantizar el mejor sabor en cada platillo.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
export default CompraMarisco;