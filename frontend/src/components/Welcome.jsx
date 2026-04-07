
import { CContainer, CButton, CCard, CCardBody } from '@coreui/react';

const titleText = '¡Bienvenido!';

export default function Welcome({ onStart }) {
    return (
        <div className="welcome-scene">
            <div className="welcome-card">
                <div className="welcome-grid">
                    {Array.from({ length: 64 }).map((_, index) => (
                        <span key={index} />
                    ))}
                </div>

                <CCardBody className="welcome-card-content">
                    <div className="welcome-copy">
                        <h1 className="welcome-title">
                            {titleText.split('').map((letter, index) => (
                                <span
                                    key={index}
                                    style={{ transitionDelay: `${index * 25}ms` }}
                                >
                                    {letter === ' ' ? '\u00A0' : letter}
                                </span>
                            ))}
                        </h1>
                        <p className="welcome-description">
                            Explora tu inventario con una interfaz suave, cargada de luz y movimientos sutiles.
                            Pasa el cursor sobre el texto y deja que las letras fluyan.
                        </p>
                    </div>

                    <CButton className="welcome-cta" onClick={onStart}>
                        Continuar
                        <span className="welcome-arrow">➜</span>
                    </CButton>
                </CCardBody>
            </div>
        </div>
    );
}