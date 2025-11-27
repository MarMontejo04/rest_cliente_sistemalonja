import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const NuevaCompra = () => {
    const navigate = useNavigate();

    const PRECIO_CAJA = 30; // fALTA INVESTIGAR ELPRECIO DE ESSAS CAJAS

    // DATOS DE PRUEBA
    const [inventario] = useState([
        { _id: 'L1', especie: 'Huachinango', tipo: 'Primera', precio: 120, disponible: 50.5, cajas: 2 },
        { _id: 'L2', especie: 'Huachinango', tipo: 'Segunda', precio: 100, disponible: 20.0, cajas: 1 },
        { _id: 'L3', especie: 'Mojarra', tipo: 'Grande', precio: 85, disponible: 100.0, cajas: 4 },
        { _id: 'L4', especie: 'Robalo', tipo: 'Mediano', precio: 150, disponible: 15.0, cajas: 1 },
    ]);

    const [especieSeleccionada, setEspecie] = useState('');
    const [lotesFiltrados, setLotesFiltrados] = useState([]);
    
    const [compra, guardarCompra] = useState({
        id_lote: '',
        id_comprador: 'Publico General',
        kilos: '',      
        cajas: 0,       
        precio_kilo: '', 
        total_pescado: 0,
        total_cajas: 0,
        gran_total: 0
    });

    useEffect(() => {
        if(especieSeleccionada) {
            const filtrados = inventario.filter(l => l.especie === especieSeleccionada);
            setLotesFiltrados(filtrados);
        } else {
            setLotesFiltrados([]);
        }
    }, [especieSeleccionada, inventario]);

    const seleccionarLote = (e) => {
        const idLote = e.target.value;
        const loteEncontrado = inventario.find(l => l._id === idLote);

        if (loteEncontrado) {
            guardarCompra({
                ...compra,
                id_lote: idLote,
                kilos: loteEncontrado.disponible, 
                cajas: loteEncontrado.cajas,
                precio_kilo: loteEncontrado.precio 
            });
        } else {
            guardarCompra({ ...compra, id_lote: '', kilos: '', cajas: 0, precio_kilo: '' });
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
        
        // qweqweqweqweqweqwe aqui recibo datos xd
        Swal.fire('Venta Exitosa', `Cobrar: $${compra.gran_total}`, 'success');
        navigate('/compras/recibo/V-999'); 
    }

    const listaEspecies = [...new Set(inventario.map(item => item.especie))];

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Venta de Lote Completo</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={procesarVenta}>
                        
                        <div className="mb-3">
                            <label className="form-label fw-bold">1. Filtro por Especie</label>
                            <select 
                                className="form-select"
                                value={especieSeleccionada}
                                onChange={e => setEspecie(e.target.value)}
                            >
                                <option value="">-- Seleccionar Especie --</option>
                                {listaEspecies.map(esp => (
                                    <option key={esp} value={esp}>{esp}</option>
                                ))}
                            </select>
                        </div>

                        {especieSeleccionada && (
                            <div className="mb-3 animate__animated animate__fadeIn">
                                <label className="form-label fw-bold">2. Seleccionar Lote Disponible</label>
                                <select 
                                    className="form-select form-select-lg border-primary" 
                                    name="id_lote" 
                                    onChange={seleccionarLote}
                                    required
                                >
                                    <option value="">-- Ver opciones --</option>
                                    {lotesFiltrados.map(lote => (
                                        <option key={lote._id} value={lote._id}>
                                            {lote.tipo} | ${lote.precio}/kg | {lote.disponible} Kg Totales
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <hr />

                        {compra.id_lote && (
                            <div className="animate__animated animate__fadeIn">
                                <div className="alert alert-light border">
                                    <h5 className="alert-heading"><i className="bi bi-receipt me-2"></i>Resumen de Venta</h5>
                                    <p className="mb-0 text-muted">Revisa los costos desglosados antes de confirmar.</p>
                                </div>

                                <div className="row mb-3">
                                    <div className="col-md-4">
                                        <label className="form-label text-muted small">Peso Neto</label>
                                        <div className="input-group">
                                            <input type="text" className="form-control bg-light" value={compra.kilos} readOnly />
                                            <span className="input-group-text bg-light">Kg</span>
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label text-muted small">Precio Unitario</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">$</span>
                                            <input 
                                                type="text" 
                                                className="form-control bg-light fw-bold" 
                                                value={compra.precio_kilo} 
                                                readOnly 
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-4">
                                        <label className="form-label text-muted small">Importe Pescado</label>
                                        <input type="text" className="form-control bg-light" value={`$${compra.total_pescado}`} readOnly />
                                    </div>
                                </div>

                                <div className="row mb-4 align-items-end">
                                    <div className="col-md-8">
                                        <label className="form-label text-muted small">Costo Adicional: Envases / Cajas</label>
                                        <div className="input-group">
                                            <span className="input-group-text bg-light">{compra.cajas} pzas</span>
                                            <span className="input-group-text bg-light">x ${PRECIO_CAJA}</span>
                                            <input type="text" className="form-control bg-light text-end" value={`$${compra.total_cajas}`} readOnly />
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold text-success">TOTAL A PAGAR</label>
                                        <div className="input-group input-group-lg">
                                            <span className="input-group-text bg-success text-white">$</span>
                                            <input 
                                                type="text" 
                                                className="form-control bg-white text-success fw-bold" 
                                                value={compra.gran_total} 
                                                readOnly 
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-success w-100 btn-lg py-3 shadow">
                                    Confirmar Compra
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
export default NuevaCompra;