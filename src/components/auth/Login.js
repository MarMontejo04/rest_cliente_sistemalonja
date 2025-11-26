import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Importamos las alertas bonitas
import Swal from 'sweetalert2'; 

const Login = () => {

    // 1. State para guardar los datos del usuario
    const [credenciales, guardarCredenciales] = useState({
        email: '',
        password: ''
    });

    // Hook para redireccionar
    const navigate = useNavigate();

    // 2. Función para leer lo que el usuario escribe
    const leerDatos = (e) => {
        guardarCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        })
    }

    // 3. Función para enviar el formulario (Login)
    const iniciarSesion = (e) => {
        e.preventDefault();

        // Validación simple (Simulada por ahora)
        if(credenciales.email === '' || credenciales.password === '') {
            // Alerta de Error (ff)
            Swal.fire({
                type: 'error',
                title: 'Hubo un error',
                text: 'Todos los campos son obligatorios',
            });
            return;
        }

        // Si todo sale bien (gg)
        Swal.fire(
            'Login Correcto',
            'Has iniciado sesión',
            'success'
        );

        // Redireccionar a la página de Ventas
        navigate('/ventas');
    }

    return (
        <div>
            <h2>Iniciar Sesión</h2>

            <form onSubmit={iniciarSesion}>
                <div>
                    <label>Email: </label>
                    <input 
                        type="email"
                        name="email"
                        placeholder="Email de Usuario"
                        required
                        onChange={leerDatos}
                    />
                </div>

                <div>
                    <label>Password: </label>
                    <input 
                        type="password"
                        name="password"
                        placeholder="Password"
                        required
                        onChange={leerDatos}
                    />
                </div>

                <input type="submit" value="Iniciar Sesión" />
            </form>
        </div>
    );
}

export default Login;