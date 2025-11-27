import React, { Fragment } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from "./components/layout/Header";
import Navegacion from "./components/layout/Navegacion";
import Footer from "./components/layout/Footer";

import Inicio from "./components/inicio/Inicio";

import Login from "./components/auth/Login";

import Lotes from "./components/lote/Lotes";
import NuevoLote from "./components/lote/NuevoLote";

import Compra from "./components/compra/Compra";
import ReporteDiario from "./components/compra/ReporteDiario";
import ReciboVenta from "./components/compra/ReciboVenta";

function App() {
  return (
    <BrowserRouter>
      <Fragment>
        <Header />
        <Navegacion />

        <main>
            <Routes>
                <Route path="/" element={<Inicio />} />

                <Route path="/login" element={<Login />} />

                <Route path="/lotes" element={<Lotes />} />
                <Route path='/lotes/nuevo' element={<NuevoLote />} />

                <Route path="/compras/nueva" element={<Compra />} />
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