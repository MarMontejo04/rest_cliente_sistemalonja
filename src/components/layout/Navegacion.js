import React from 'react';
import { Link } from 'react-router-dom';

const Navegacion = () =>{
    return (
        
         <aside className="sidebar col-3">
            <h2>Navegacion</h2>
            <nav className="navegacion">
                <Link to={""} className="">1</Link>
                <Link to={""} className="">2</Link>
                <Link to={""} className="">3</Link>
            </nav>
        </aside>
    )
}

export default Navegacion