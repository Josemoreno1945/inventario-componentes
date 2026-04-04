import React, { useState, useEffect } from 'react';
import { 
    CCard, CCardBody, CForm, CFormInput, CButton, 
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, 
    CAlert, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';
import './TiposComponentes.scss';

export default function TiposComponentes() {
    const [tipos, setTipos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [mensaje, setMensaje] = useState(null);
    const [visible, setVisible] = useState(false);

    const fetchTipos = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tipos-componentes');
            const data = await response.json();
            setTipos(data);
        } catch (error) {
            console.error('Error al cargar tipos:', error);
        }
    };

    useEffect(() => {
        fetchTipos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);

        // Verificar si el nombre ya existe
        const existe = tipos.some(t => t.nombre.toLowerCase() === nombre.toLowerCase());
        if (existe) {
            setMensaje({ tipo: 'danger', texto: 'Este tipo de componente ya existe.', details: [] });
            setTimeout(() => setMensaje(null), 3000);
            return;
        }
        
        try {
            const response = await fetch('http://localhost:5000/api/tipos-componentes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre }),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                setMensaje({
                    tipo: 'danger',
                    texto: result?.error || 'Error al guardar el tipo.',
                    details: result?.details || [],
                });
                return;
            }

            setMensaje({ tipo: 'success', texto: 'Tipo de componente guardado!', details: [] });
            setNombre('');
            setVisible(false);
            fetchTipos();
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
        <div className="container p-4 clase-tipos">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>🔌 Categorías / Tipos de Componentes</h2>
                        <CButton color="primary" onClick={() => setVisible(true)}>
                            + Nuevo Tipo
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

                    <CCard className="shadow-sm">
                        <CCardBody>
                            <CTable hover responsive align="middle">
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell style={{ width: '10%' }}>ID</CTableHeaderCell>
                                        <CTableHeaderCell>Nombre de la Categoría</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {tipos.length === 0 ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan="2" className="text-center text-muted py-4">
                                                No hay categorías registradas. Ej: GPU, RAM, Almacenamiento.
                                            </CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        tipos.map((t) => (
                                            <CTableRow key={t.id}>
                                                <CTableDataCell><strong>#{t.id}</strong></CTableDataCell>
                                                <CTableDataCell>{t.nombre}</CTableDataCell>
                                            </CTableRow>
                                        ))
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </div>
            </div>

            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Agregar Tipo de Componente</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <CFormInput 
                            type="text" 
                            label="Nombre de la categoría" 
                            placeholder="Ej. RAM, SSD, Fuente de Poder, GPU" 
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            required
                        />
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>Cancelar</CButton>
                        <CButton color="primary" type="submit">Guardar</CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        </div>
    );
}