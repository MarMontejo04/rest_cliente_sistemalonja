import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
// import clienteAxios from '../../config/axios';

const NuevoLote = () => {

    const [lote, guardarLote] = useState({
        especie: '',
        kilos: '',
        cajas: '',
        precio: ''
    });

    const navigate = useNavigate();

    const actualizarEstado = e => {
        guardarLote({
            ...lote,
            [e.target.name]: e.target.value
        })
    }

    const agregarLote = async e => {
        e.preventDefault();

        if(lote.especie === '' || lote.kilos === '' || lote.precio === ''){
            Swal.fire('Error', 'Todos los campos son obligatorios', 'error');
            return;
        }
            // simulacion xd
        // await clienteAxios.post('/lotes', lote);

        Swal.fire(
            '¡Agregado!',
            'El lote se registró correctamente',
            'success'
        );
        navigate('/lotes');
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body">
                            <h2 className="text-center mb-4 font-weight-bold">Registrar Nuevo Lote</h2>

                            <form onSubmit={agregarLote}>
                                
                                <div className="form-group mb-3">
                                    <label>Especie de Pescado</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        placeholder="Ej. Huachinango, Camarón..." 
                                        name="especie"
                                        onChange={actualizarEstado}
                                    />
                                </div>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Peso Total (Kg)</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                placeholder="0.00" 
                                                name="kilos"
                                                step="0.01"
                                                onChange={actualizarEstado}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className="form-group mb-3">
                                            <label>Número de Cajas</label>
                                            <input 
                                                type="number" 
                                                className="form-control" 
                                                placeholder="0" 
                                                name="cajas"
                                                onChange={actualizarEstado}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group mb-4">
                                    <label>Precio de Salida (Por Kilo)</label>
                                    <div className="input-group">
                                        <span className="input-group-text">$</span>
                                        <input 
                                            type="number" 
                                            className="form-control" 
                                            placeholder="0.00" 
                                            name="precio"
                                            step="0.01"
                                            onChange={actualizarEstado}
                                        />
                                    </div>
                                </div>

                                <button type="submit" className="btn btn-primary w-100 text-uppercase font-weight-bold">
                                    Guardar Lote
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NuevoLote;