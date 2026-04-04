import { CNavbar, CContainer, CNavbarBrand } from '@coreui/react';
import { useState } from 'react';
import './nav.scss';

export default function Nav({ currentModule, setModule }) {
    const [showDropdown, setShowDropdown] = useState(false);

    return (
        <CNavbar colorScheme="dark" className="app-nav shadow-sm">
            <CContainer fluid className="app-nav-container">
                <CNavbarBrand href="#" className="app-nav-brand" onClick={() => setModule('welcome')}>
                     Inventario 
                </CNavbarBrand>

                <div className="app-nav-links">
                    <button
                        type="button"
                        className={`app-nav-link ${currentModule === 'buscador' ? 'active' : ''}`}
                        onClick={() => setModule('buscador')}
                    >
                        Buscador
                    </button>
                    <div
                        className="app-nav-dropdown-wrapper"
                        onMouseEnter={() => setShowDropdown(true)}
                        onMouseLeave={() => setShowDropdown(false)}
                    >
                        <button
                            type="button"
                            className={`app-nav-link ${currentModule === 'componentes' || currentModule === 'tipos-componentes' ? 'active' : ''}`}
                        >
                            Componentes
                        </button>
                        {showDropdown && (
                            <div className="app-nav-dropdown-menu">
                                <button type="button" className="app-nav-dropdown-item" onClick={() => setModule('componentes')}>
                                    Componentes
                                </button>
                                <button type="button" className="app-nav-dropdown-item" onClick={() => setModule('tipos-componentes')}>
                                    Tipo de Componentes
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        type="button"
                        className={`app-nav-link ${currentModule === 'ubicaciones' ? 'active' : ''}`}
                        onClick={() => setModule('ubicaciones')}
                    >
                        Ubicaciones
                    </button>
                </div>
            </CContainer>
        </CNavbar>
    );
}