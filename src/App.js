import React, { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Inicio from "./components/inicio/Inicio";

import Login from "./components/auth/Login";

import Lotes from "./components/lote/Lotes";
import NuevoLote from "./components/lote/NuevoLote";
import EditarLote from "./components/lote/EditarLote.js";

import CompraMarisco from "./components/compra/CompraMarisco.js";
import CompraPazul from "./components/compra/CompraPazul.js";
import CompraPblanco from "./components/compra/CompraPblanco.js";
import CompraPsemigraso from "./components/compra/CompraPsemigraso.js";

import ReporteDiario from "./components/compra/ReporteDiario";
import ReciboVenta from "./components/compra/ReciboVenta";

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <Header />

        <main>
            <Routes>
                <Route path="/" element={<Inicio />} />

                <Route path="/login" element={<Login />} />

                <Route path="/lotes" element={<Lotes />} />
                <Route path='/lotes/nuevo' element={<NuevoLote />} />
                <Route path='/lotes/editar' element={<EditarLote />} />

                <Route path="/compras/marisco" element={<CompraMarisco/>} />
                <Route path="/compras/azul" element={<CompraPazul/>} />
                <Route path="/compras/blanco" element={<CompraPblanco/>} />
                <Route path="/compras/semigraso" element={<CompraPsemigraso/>} />
                
                <Route path="/compras/reporte" element={<ReporteDiario />} />
                <Route path="/compras/recibo/:id" element={<ReciboVenta />} />
            </Routes>
        </main>

        <Footer />
      </Fragment>
    </BrowserRouter>
  );
}

export default App;