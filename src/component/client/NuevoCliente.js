import React,{Fragment,useState} from 'react';
import clienteAxios from '../../config/axios';
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom';

function NuevoCliente(props){
    const navigate = useNavigate();
  
    const [cliente,guardarCliente]=useState({
        nombre:'',
        empresa:'',
        corre:'',
        telefono:''
    })
    //leer datos del formulario
    const actualizarState= e=>{
        //almacenando lo que el usuario escribe
        guardarCliente({
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
    //agregar a api_rest
    const agregarCliente=e=>{
        e.preventDefault()
        clienteAxios.post("/api/crear",cliente)
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
                        title: "Se agrego el cliente",
                        text: res.data.mensaje,
                        icon: "success"
                    });
                }
               navigate("/")
            })
    }
    return (
        <Fragment>
        <h2>Nuevo Cliente</h2>
            <form onSubmit={agregarCliente}>
                    <legend>Llena todos los campos</legend>

                    <div className="campo">
                        <label>Nombre:</label>
                        <input type="text" placeholder="Nombre Cliente" name="nombre"
                        onChange={actualizarState}/>
                    </div>
                
                    <div className="campo">
                        <label>Empresa:</label>
                        <input type="text" placeholder="Empresa Cliente" name="empresa"
                          onChange={actualizarState}/>
                    </div>

                    <div className="campo">
                        <label>Correo:</label>
                        <input type="correo" placeholder="Correo Cliente" name="correo"
                          onChange={actualizarState}/>
                    </div>

                    <div className="campo">
                        <label>Teléfono:</label>
                        <input type="tel" placeholder="Teléfono Cliente" name="telefono"
                        onChange={actualizarState}/>
                    </div>

                    <div className="enviar">
                            <input type="submit" className="btn btn-azul" value="Agregar Cliente"
                            disabled={validarFormulario()}/>
                    </div>

                </form>
            </Fragment>
    )
}

//función que toma un componente y retorna otro componente

export default NuevoCliente