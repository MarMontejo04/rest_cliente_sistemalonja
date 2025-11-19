import React,{Fragment,useState,useEffect} from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2'
import { useNavigate,useParams } from 'react-router-dom';

function EditarCliente(props){
    const navigate = useNavigate();
    const {id}=useParams()
    const [cliente,datosCliente]=useState([{
        nombre:'',
        empresa:'',
        correo:'',
        telefono:''
    }])
    
    //useEffect
    useEffect(()=>{
         //Query para API
        const consultar_API=async ()=>{
        const clienteConsulta=await clienteAxios.get(`/api/consulta/${id}`)
        //Agregar en el state
        datosCliente(clienteConsulta.data)
        
        }
        consultar_API();
    },[id])
    //enviar por axios para actualizar cliente
    const actializarCliente= e =>{
         e.preventDefault();

         //enviar el axios

         clienteAxios.put(`/api/encontrar/${cliente._id}`,cliente)
         .then(res=>{
                         //errores de mongodb
                         if(res.data.code===11000){
                              Swal.fire({
                                 type:"error",
                                 title: "Hubo un problema",
                                 text: "Cliente no registrado",
                                 icon: "error"
                             });
                         }else{
                             Swal.fire({
                                 title: "Se actualzo el cliente",
                                 text: res.data.mensaje,
                                 icon: "success"
                             });
                         }
                        navigate("/")
                     })         

    }

    //leer datos del formulario
    const actualizarState= e=>{
        //almacenando lo que el usuario escribe
        datosCliente({
            //copiar del state actual
            ...cliente,
            [e.target.name] : e.target.value
        })        
    }
    const validarFormulario=()=>{
        const {nombre,empresa,correo,telefono}=cliente
        let validar=!nombre?.length>0 || !empresa?.length>0 || !correo?.length>0 || !telefono?.length>0;
        return validar

    }
    
    return (
        <Fragment>
        <h2>Editar Cliente</h2>
            <form 
                onSubmit={actializarCliente}
            >
                    <legend>Llena todos los campos</legend>

                    <div className="campo">
                        <label>Nombre:</label>
                        <input type="text" placeholder="Nombre Cliente" name="nombre"
                        onChange={actualizarState}
                        value={cliente.nombre}/>
                    </div>
                
                    <div className="campo">
                        <label>Empresa:</label>
                        <input type="text" placeholder="Empresa Cliente" name="empresa"
                          onChange={actualizarState}
                          value={cliente.empresa}/>
                    </div>

                    <div className="campo">
                        <label>Correo:</label>
                        <input type="correo" placeholder="Correo Cliente" name="correo"
                          onChange={actualizarState}
                          value={cliente.correo}/>
                    </div>

                    <div className="campo">
                        <label>Teléfono:</label>
                        <input type="tel" placeholder="Teléfono Cliente" name="telefono"
                        onChange={actualizarState}
                        value={cliente.telefono}/>
                    </div>

                    <div className="enviar">
                            <input type="submit" className="btn btn-azul" value="Modificar Cliente"
                            disabled={validarFormulario()}/>
                    </div>

                </form>
            </Fragment>
    )
}

//función que toma un componente y retorna otro componente

export default EditarCliente