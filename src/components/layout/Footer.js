import React from 'react';

const Footer = () => {
    return (
        <footer className="text-center py-4 mt-5" style={{ 
            backgroundColor: 'var(--color-panel)', 
            borderTop: '1px solid var(--oro-oscuro)',
            color: 'var(--texto-gris)'
        }}>
            <div className="container">
                <p className="mb-0 font-monospace small" style={{letterSpacing: '1px'}}>
                    &copy; {new Date().getFullYear()} <span style={{color: 'var(--oro-principal)', fontWeight: 'bold'}}>LONJA VERACRUZ</span>
                    <span className="mx-2">|</span>
                    Gestión de Ventas Pesqueras
                    <span className="mx-2">|</span>
                    Mariana Montejo Padilla, Alan Otzar Lopez Rivera
                </p>
            </div>
        </footer>
    );
}

export default Footer;