import React from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2'
import clienteAxios from '../../config/axios';
const eliminarCliente= id=>{
        console.log(id)
        Swal.fire({
        title: "Estas seguro de eliminar el dato?",
        text: "Una vez eliminado ya no se puede recuperar",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, borrar el dato!"
        }).then((result) => {
            if (result.isConfirmed) {
                clienteAxios.delete(`/api/borrar/${id}`)
                    .then(res=>{
                        Swal.fire({
                            title: "Eleminado!",
                            text: "El registro a sido eliminado.",
                            icon: "success"
                    });

                })
            }
        });
   
}
function Cliente({cliente}){
 const {_id,nombre,empresa,correo,telefono}=cliente
   return(
     <li className="cliente">
        <div className="info-cliente">
            <p className="nombre">Nombre:{nombre}</p>
            <p className="empresa">Empresa:{empresa}</p>
            <p className="correo">Correo:{correo}</p>
            <p className="telefono">Telefono:{telefono}</p>
        </div>
        <div className="acciones">
            <Link to={`/clientes/editar/${_id}`} className="btn btn-azul">
                <i className="fas fa-pen-alt"></i>
                Editar Cliente
            </Link>
            <button type="button" className="btn btn-rojo btn-eliminar"
                    onClick={()=>eliminarCliente(_id)}>
                <i className="fas fa-times"></i>
                Eliminar Cliente
            </button>
        </div>
    </li>
   )
}
export default Cliente	