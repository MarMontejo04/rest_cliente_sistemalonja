import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import clienteAxios from "../../config/axios.js";

const CompraMarisco = () => {
    const navigate = useNavigate();
    const PRECIO_CAJA = 30; 

    // Estados (flujo correo / cliente)
    const [correoBusqueda, setCorreoBusqueda] = useState("");
    const [clienteEncontrado, setClienteEncontrado] = useState(null); // null = no buscado, true = existe, false = no existe
    const [datosCliente, setDatosCliente] = useState(null);

    // Inventario (desde DB)
    const [inventario, setInventario] = useState([]);
      const [cargando, setCargando] = useState(true);
    const [imagenFondo, setImagenFondo] = useState('https://images.unsplash.com/photo-1615141982880-1313d87a7409?q=80&w=2070&auto=format&fit=crop');
    
    const [compra, guardarCompra] = useState({
        nombre_cliente: '', apellido_paterno: '', apellido_materno: '', direccion: '', correo: '',
        id_lote: '', kilos: '', cajas: 0, precio_kilo: '', 
        total_pescado: 0, total_cajas: 0, gran_total: 0,
        especieNombre: '', especieTipo: ''
    });

    // ----------------------------
    //  CARGAR TIPOS / ESPECIES / LOTES (ARMAR INVENTARIO)
    // ----------------------------
    useEffect(() => {
          const cargarLotes = async () => {
            const tipoPescado = "Marisco";
      
            try {
              setCargando(true);
              const respuesta = await clienteAxios.get(
                `/api/lote-especie/consulta-tpo/${encodeURIComponent(tipoPescado)}`
              );
              setInventario(respuesta.data);
            } catch (error) {
              console.error("Error al cargar lotes disponibles:", error);
              // Opcional: Poner datos dummy si falla la API para que no se vea vacío en pruebas
              /* setInventario([
                     { _id: 'A1', especie: 'Atún (Offline)', tipo: 'Aleta Amarilla', precio: 180, disponible: 200.0, cajas: 8, imagen: '...' }
                ]); */
              Swal.fire(
                "Aviso",
                "No se pudo conectar con el inventario en tiempo real.",
                "info"
              );
            } finally {
              setCargando(false);
            }
          };
      
          cargarLotes();
        }, []);

    // ----------------------------
    //  SELECCIONAR LOTE (usa inventario real)
    // ----------------------------
    const seleccionarLote = (e) => {
        const idLote = e.target.value;
        const loteEncontrado = inventario.find(l => l._id === idLote);
        if (loteEncontrado) {
            guardarCompra(prev => ({
                ...prev,
                id_lote: idLote,
                kilos: loteEncontrado.disponible,
                cajas: loteEncontrado.cajas,
                precio_kilo: loteEncontrado.precio,
                especieNombre: loteEncontrado.especie,
                especieTipo: loteEncontrado.tipo
            }));
            setImagenFondo(loteEncontrado.imagen);
        } else {
            guardarCompra(prev => ({ ...prev, id_lote: '', kilos: '', cajas: 0, precio_kilo: '', especieNombre: '', especieTipo: '', total_pescado: 0, total_cajas: 0, gran_total: 0 }));
            setImagenFondo('https://images.unsplash.com/photo-1615141982880-1313d87a7409?q=80&w=2070&auto=format&fit=crop');
        }

        // resetear estado cliente cuando cambias lote
        setCorreoBusqueda("");
        setClienteEncontrado(null);
        setDatosCliente(null);
    };

    // ----------------------------
    //  CÁLCULOS AUTOMÁTICOS
    // ----------------------------
    useEffect(() => {
        const { kilos, cajas, precio_kilo } = compra;
        if(kilos && precio_kilo) {
            const costoPescado = parseFloat(kilos) * parseFloat(precio_kilo);
            const costoEnvases = parseFloat(cajas) * PRECIO_CAJA;
            const totalFinal = costoPescado + costoEnvases;
            guardarCompra(prev => ({ ...prev, total_pescado: costoPescado.toFixed(2), total_cajas: costoEnvases.toFixed(2), gran_total: totalFinal.toFixed(2) }));
        }
    }, [compra.kilos, compra.cajas, compra.precio_kilo]);

    const actualizarState = e => { guardarCompra({ ...compra, [e.target.name]: e.target.value }); }

    // ----------------------------
    //  BUSCAR CLIENTE POR CORREO (BOTÓN)
    // ----------------------------
    const buscarCliente = async () => {
        if (!correoBusqueda) {
            Swal.fire({ icon: 'warning', title: 'Correo requerido', text: 'Escribe un correo para buscar.', confirmButtonColor: 'var(--oro-principal)'});
            return;
        }

        try {
            const res = await clienteAxios.get(`/api/comprador/consulta/${correoBusqueda}`);
            // backend: debe devolver [] o comprador en array
            const data = res.data;
            if (!data || (Array.isArray(data) && data.length === 0)) {
                setClienteEncontrado(false);
                setDatosCliente(null);
                // rellenar correo en compra para cuando se cree
                guardarCompra(prev => ({ ...prev, correo: correoBusqueda }));
                return;
            }

            // si devolvió un array con comprador
            const found = Array.isArray(data) ? data[0] : data;
            setClienteEncontrado(true);
            setDatosCliente(found);

            // autocompletar fields y bloquear/usar para crear compra
            guardarCompra(prev => ({
                ...prev,
                nombre_cliente: found.nombre,
                apellido_paterno: found.apellido_paterno,
                apellido_materno: found.apellido_materno || '',
                direccion: found.direccion || '',
                correo: found.correo
            }));
            Swal.fire({ icon: 'success', title: 'Cliente encontrado', text: `Bienvenido ${found.nombre}`, timer: 1200, showConfirmButton: false });
        } catch (err) {
            console.error("Error al buscar comprador:", err);
            // si 404 o error, asumimos no existe
            setClienteEncontrado(false);
            setDatosCliente(null);
            guardarCompra(prev => ({ ...prev, correo: correoBusqueda }));
        }
    };

    // ----------------------------
    //  PROCESAR VENTA: si cliente existe -> crear compra con codigo_cpr; si no existe -> crear comprador primero
    // ----------------------------
    const procesarVenta = async (e) => {
        e.preventDefault();

        if (!compra.id_lote) {
            Swal.fire({ icon: 'error', title: 'Seleccione lote', text: 'Debes seleccionar un lote antes de continuar.', confirmButtonColor: 'var(--oro-principal)' });
            return;
        }

        try {
            let compradorId = null;

            if (clienteEncontrado === true && datosCliente && datosCliente._id) {
                // comprador ya existe
                compradorId = datosCliente._id;
            } else {
                // Cliente nuevo -> validar campos
                if (!compra.nombre_cliente || !compra.apellido_paterno || !compra.direccion) {
                    Swal.fire({ icon: 'error', title: 'Faltan Datos', text: 'Complete los datos del cliente.', confirmButtonColor: 'var(--oro-principal)' });
                    return;
                }

                // Crear comprador en backend
                const nuevo = {
                    nombre: compra.nombre_cliente,
                    apellido_paterno: compra.apellido_paterno,
                    apellido_materno: compra.apellido_materno,
                    direccion: compra.direccion,
                    correo: compra.correo || correoBusqueda
                };

                const resCrear = await clienteAxios.post('/api/comprador/registrar', nuevo);
                // tu controlador responde { mensaje: "Se creó el comprador", data: compradores }
                compradorId = resCrear.data?.data?._id || resCrear.data?.data;
            }

            // Crear compra en backend
            const payloadCompra = {
                codigo_cpr: compradorId,
                id_lte: compra.id_lote,
                precio_kilo_final: compra.precio_kilo,
                precio_total: compra.gran_total
            };

            const resCompra = await clienteAxios.post('/api/compra/registrar', payloadCompra);

            Swal.fire({
                title: 'Venta registrada',
                text: `Total: $${compra.gran_total}`,
                icon: 'success',
                confirmButtonColor: 'var(--oro-principal)',
                background: '#042B35',
                color: '#F0F0F0'
            });

            // redirigir a ReciboVenta manteniendo datos (igual que en tu ReciboVenta)
            const folioGenerado = `V-${Math.floor(Math.random() * 100000)}`;
            navigate(`/compras/recibo/${folioGenerado}`, {
                state: {
                    folio: folioGenerado,
                    datosVenta: compra
                }
            });

        } catch (error) {
            console.error("Error procesando venta:", error);
            const mensaje = error.response?.data?.mensaje || 'Error al procesar la venta';
            Swal.fire({ icon: 'error', title: 'Error', text: mensaje, confirmButtonColor: 'var(--oro-principal)' });
        }
    };

    // ----------------------------
    //  RENDER (manteniendo TODO tu UI y fondo)
    // ----------------------------
    return (
        <div className="container-fluid p-0 bg-animated" style={{minHeight: '100vh'}}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0, backgroundImage: `linear-gradient(to right, rgba(2, 30, 38, 0.95), rgba(2, 30, 38, 0.85) 40%, rgba(2, 30, 38, 0.4) 100%), url("${imagenFondo}")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', transition: 'background-image 0.6s ease-in-out' }}></div>
          
            <div className="container position-relative" style={{zIndex: 2, minHeight: '80vh', paddingTop: '5vh', paddingBottom: '5vh'}}>
                <div className="row h-100 align-items-center justify-content-between">
                  
                    {/* COLUMNA IZQUIERDA: INFO VISUAL */}
                    <div className="col-lg-5 mb-5 mb-lg-0 text-white animate__animated animate__fadeInLeft">
                        <h4 className="text-gold text-uppercase letter-spacing-2 mb-4" style={{borderBottom: '2px solid var(--oro-oscuro)', display: 'inline-block', paddingBottom: '10px'}}>
                            <i className="fas fa-utensils me-2"></i> Mariscos y Crustáceos
                        </h4>
                      
                        {compra.id_lote ? (
                            <div>
                                <h1 className="display-2 fw-bold mb-2 text-white" style={{fontFamily: "'Playfair Display', serif", textShadow: '0 4px 10px rgba(0,0,0,0.5)'}}>
                                    {compra.especieNombre}
                                </h1>
                                <h2 className="display-5 text-gold mb-4 fst-italic" style={{fontFamily: "'Cinzel', serif"}}>
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
                              
                                <div className="mt-5 pt-4 border-top border-secondary w-75">
                                    <div className="text-white-50 text-uppercase text-premium-lg mb-1">Precio por Kilo</div>
                                    <div className="text-gold display-5 fw-bold">${compra.precio_kilo}</div>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <h1 className="display-3 fw-bold mb-4" style={{fontFamily: "'Playfair Display', serif"}}>Seleccione su Producto</h1>
                                <p className="lead text-white-50 fs-4">Explore nuestro inventario fresco disponible para comenzar la venta del día.</p>
                            </div>
                        )}
                    </div>
                    {/* COLUMNA DERECHA: FORMULARIO COMPLETO */}
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
                                            <option value="">-- Catálogo de Mariscos --</option>
                                            {inventario.map(lote => (
                                                <option key={lote._id} value={lote._id}>
                                                    {lote.especie} - {lote.tipo} | {lote.disponible}kg disp.
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {/* PASO 2: VERIFICAR COMPRADOR (Solo si hay lote seleccionado) */}
                                    {compra.id_lote && (
                                        <div className="animate__animated animate__fadeIn">
                                           
                                            <label className="form-label text-gold fw-bold text-uppercase small mb-2">2. Identificar Cliente</label>
                                            <div className="input-group mb-4">
                                                <input
                                                    type="email"
                                                    className="form-control bg-transparent text-white border-secondary"
                                                    placeholder="correo@cliente.com"
                                                    value={correoBusqueda}
                                                    onChange={e => setCorreoBusqueda(e.target.value)}
                                                />
                                                <button
                                                    className="btn btn-outline-warning"
                                                    type="button"
                                                    onClick={buscarCliente}
                                                >
                                                    <i className="fas fa-search me-2"></i> Verificar
                                                </button>
                                               
                                                {/* Botón para resetear búsqueda si te equivocaste */}
                                                {clienteEncontrado !== null && (
                                                    <button className="btn btn-outline-secondary" type="button" onClick={() => {
                                                        setClienteEncontrado(null);
                                                        setDatosCliente(null);
                                                        setCorreoBusqueda('');
                                                        guardarCompra({...compra, nombre_cliente: '', direccion: ''});
                                                    }}>
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                                )}
                                            </div>
                                            {/* PASO 3: FORMULARIO CONDICIONAL */}
                                            {clienteEncontrado === true && (
                                                <div className="alert alert-success bg-transparent border-success text-success small">
                                                    <i className="fas fa-check-circle me-2"></i> Cliente registrado. Confirme la venta o edite datos si es necesario.
                                                </div>
                                            )}
                                            {clienteEncontrado === false && (
                                                <div className="alert alert-info bg-transparent border-info text-info small">
                                                    <i className="fas fa-info-circle me-2"></i> Cliente nuevo. Complete el registro.
                                                </div>
                                            )}

                                            {/* FORMULARIO (solo cuando NO existe) */}
                                            {clienteEncontrado === false && (
                                                <div className="animate__animated animate__fadeIn">
                                                    <h5 className="text-gold mb-4 border-bottom border-secondary pb-2" style={{fontFamily: "'Cinzel', serif"}}>Datos del Cliente</h5>
                                                  
                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50 small text-uppercase">Nombre</label>
                                                        <input type="text" className="form-control bg-transparent text-white border-secondary" name="nombre_cliente" onChange={actualizarState} required />
                                                    </div>
                                                  
                                                    <div className="row mb-3">
                                                        <div className="col-6">
                                                            <label className="form-label text-white-50 small text-uppercase">Ap. Paterno</label>
                                                            <input type="text" className="form-control bg-transparent text-white border-secondary" name="apellido_paterno" onChange={actualizarState} required/>
                                                        </div>
                                                        <div className="col-6">
                                                            <label className="form-label text-white-50 small text-uppercase">Ap. Materno</label>
                                                            <input type="text" className="form-control bg-transparent text-white border-secondary" name="apellido_materno" onChange={actualizarState}/>
                                                        </div>
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50 small text-uppercase">Dirección</label>
                                                        <input type="text" className="form-control bg-transparent text-white border-secondary" name="direccion" onChange={actualizarState} required />
                                                    </div>

                                                </div>
                                            )}
                                            {/* PASO 4: CAMPOS DE COMPRA (si ya se buscó) */}
                                            {clienteEncontrado !== null && (
                                                <>
                                                    <div className="mb-3 mt-4">
                                                        <label className="form-label text-white-50 small text-uppercase">Kilos</label>
                                                        <input 
                                                            type="number"
                                                            className="form-control bg-transparent text-white border-secondary"
                                                            name="kilos"
                                                            value={compra.kilos}
                                                            onChange={actualizarState}
                                                            required
                                                            readOnly
                                                        />
                                                    </div>

                                                    <div className="mb-3">
                                                        <label className="form-label text-white-50 small text-uppercase">Cajas</label>
                                                        <input 
                                                            type="number"
                                                            className="form-control bg-transparent text-white border-secondary"
                                                            name="cajas"
                                                            value={compra.cajas}
                                                            onChange={actualizarState}
                                                            required
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {/* BOTÓN */}
                                            {clienteEncontrado !== null && (
                                                <div className="mt-3"></div>
                                            )}
                                        </div>
                                    )}
                                    {/* BOTÓN FINAL */}
                                    {compra.id_lote && clienteEncontrado !== null && (
                                        <button type="submit" className="btn-premium w-100 py-4 fs-4 fw-bold shadow-lg d-flex justify-content-between align-items-center px-5">
                                            <span>CONFIRMAR COMPRA</span>
                                            <i className="fas fa-arrow-right"></i>
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* SECCIÓN INFO */}
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
