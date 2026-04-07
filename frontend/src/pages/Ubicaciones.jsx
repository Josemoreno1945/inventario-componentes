import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config.js';
import { 
    CCard, CCardBody, CForm, CFormInput, CButton, 
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, 
    CAlert, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';
import './Ubicaciones.scss';

export default function Ubicaciones() {
    // Estados
    const [ubicaciones, setUbicaciones] = useState([]);
    const [formData, setFormData] = useState({ pasillo: '', estante: '', caja: '' });
    const [mensaje, setMensaje] = useState(null);
    const [visible, setVisible] = useState(false); // Estado para controlar el Modal

    // Obtener ubicaciones
    const fetchUbicaciones = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/ubicaciones`);
            const data = await response.json();
            setUbicaciones(data);
        } catch (error) {
            console.error('Error al cargar ubicaciones:', error);
        }
    };

    useEffect(() => {
        fetchUbicaciones();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);

        try {
            const response = await fetch(`${API_BASE_URL}/api/ubicaciones`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                setMensaje({
                    tipo: 'danger',
                    texto: result?.error || 'Error al guardar la ubicación.',
                    details: result?.details || [],
                });
                return;
            }

            setMensaje({ tipo: 'success', texto: 'Ubicación guardada con éxito.', details: [] });
            setFormData({ pasillo: '', estante: '', caja: '' });
            setVisible(false);
            fetchUbicaciones();
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            setMensaje({
                tipo: 'danger',
                texto: 'No se pudo conectar con el servidor.',
                details: [],
            });
        }
    };

    return (
        <div className="container p-4 clase-ubicaciones">
            <div className="row justify-content-center ">
                <div className="col-lg-10 ">
                    {/* Cabecera con Título y Botón */}
                    <div className="d-flex justify-content-between align-items-center mb-4 ">
                        <h2>📍 Gestión de Ubicaciones</h2>
                        <CButton color="primary" onClick={() => setVisible(true)}>
                            + Agregar Ubicación
                        </CButton>
                    </div>

                    {mensaje && (
                        <CAlert color={mensaje.tipo} dismissible onClose={() => setMensaje(null)}>
                            <div>{mensaje.texto}</div>
                            {mensaje.details?.length > 0 && (
                                <ul className="mb-0 mt-2">
                                    {mensaje.details.map((item, index) => (
                                        <li key={index}>
                                            <strong>{item.path}:</strong> {item.message}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CAlert>
                    )}

                    {/* Tabla ocupando todo el ancho */}
                    <CCard className="shadow-sm ">
                        <CCardBody>
                            <CTable hover responsive align="middle">
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell>ID</CTableHeaderCell>
                                        <CTableHeaderCell>Pasillo</CTableHeaderCell>
                                        <CTableHeaderCell>Estante</CTableHeaderCell>
                                        <CTableHeaderCell>Caja</CTableHeaderCell>
                                        <CTableHeaderCell>Ruta Completa</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {ubicaciones.length === 0 ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan="5" className="text-center text-muted py-4">
                                                No hay ubicaciones registradas aún. Haz clic en "Agregar Ubicación".
                                            </CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        ubicaciones.map((ub) => (
                                            <CTableRow key={ub.id}>
                                                <CTableDataCell><strong>#{ub.id}</strong></CTableDataCell>
                                                <CTableDataCell>{ub.pasillo}</CTableDataCell>
                                                <CTableDataCell>{ub.estante}</CTableDataCell>
                                                <CTableDataCell>{ub.caja}</CTableDataCell>
                                                <CTableDataCell>
                                                    <span className="text-primary font-monospace">
                                                        {ub.pasillo} &gt; {ub.estante} &gt; {ub.caja}
                                                    </span>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </div>
            </div>

            {/* Modal para el Formulario */}
            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Nueva Ubicación Física</CModalTitle>
                </CModalHeader>
                {/* El form envuelve el Body y el Footer para poder enviar con Enter */}
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <div className="mb-3">
                            <CFormInput 
                                type="text" 
                                name="pasillo" 
                                label="Pasillo / Área" 
                                placeholder="Ej. Pasillo 2" 
                                value={formData.pasillo}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <CFormInput 
                                type="text" 
                                name="estante" 
                                label="Estante / Vitrina" 
                                placeholder="Ej. Estante B" 
                                value={formData.estante}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <CFormInput 
                                type="text" 
                                name="caja" 
                                label="Caja / Contenedor" 
                                placeholder="Ej. Caja 4" 
                                value={formData.caja}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Cancelar
                        </CButton>
                        <CButton color="primary" type="submit">
                            Guardar
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        </div>
    );
}