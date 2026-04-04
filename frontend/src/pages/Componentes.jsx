import React, { useState, useEffect } from 'react';
import { 
    CCard, CCardBody, CForm, CFormInput, CButton, CFormSelect,
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, 
    CAlert, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CBadge
} from '@coreui/react';
import './Componentes.scss';

export default function Componentes() {
    // Estados para datos
    const [componentes, setComponentes] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]); // Para el select
    const [tipos, setTipos] = useState([]); // Para el select de tipos
    
    // Estado para el formulario
    const [formData, setFormData] = useState({
        tipo_id: '',
        marca_modelo: '',
        interfaz: '',
        capacidad: '',
        cantidad: '',
        ubicacion_id: ''
    });

    const [mensaje, setMensaje] = useState(null);
    const [visible, setVisible] = useState(false);

    // Cargar componentes y ubicaciones al entrar
    useEffect(() => {
        fetchComponentes();
        fetchUbicaciones();
        fetchTipos();
    }, []);

    const fetchComponentes = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/componentes');
            const data = await response.json();
            setComponentes(data);
        } catch (error) {
            console.error('Error al cargar componentes:', error);
        }
    };

    const fetchUbicaciones = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/ubicaciones');
            const data = await response.json();
            setUbicaciones(data);
        } catch (error) {
            console.error('Error al cargar ubicaciones:', error);
        }
    };

    const fetchTipos = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/tipos-componentes');
            const data = await response.json();
            setTipos(data);
        } catch (error) {
            console.error('Error al cargar tipos:', error);
        }
    };

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
            const response = await fetch('http://localhost:5000/api/componentes', {
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
                    texto: result?.error || 'Error al registrar el componente.',
                    details: result?.details || [],
                });
                return;
            }

            setMensaje({ tipo: 'success', texto: 'Componente registrado con éxito.', details: [] });
            setFormData({ tipo_id: '', marca_modelo: '', interfaz: '', capacidad: '', cantidad: '', ubicacion_id: '' });
            setVisible(false);
            fetchComponentes();
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
        <div className="container p-4 clase-componentes">
            <div className="row justify-content-center">
                <div className="col-lg-10">
                    {/* Cabecera */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2>💾 Registro de Componentes</h2>
                        <CButton color="primary" onClick={() => setVisible(true)}>
                            + Nuevo Componente
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

                    {/* Tabla de componentes */}
                    <CCard className="shadow-sm">
                        <CCardBody>
                            <CTable hover responsive align="middle">
                                <CTableHead color="light">
                                    <CTableRow>
                                        <CTableHeaderCell>ID</CTableHeaderCell>
                                        <CTableHeaderCell>Tipo</CTableHeaderCell>
                                        <CTableHeaderCell>Marca/Modelo</CTableHeaderCell>
                                        <CTableHeaderCell>Especif.</CTableHeaderCell>
                                        <CTableHeaderCell>Cant.</CTableHeaderCell>
                                        <CTableHeaderCell>Ubicación</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {componentes.length === 0 ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan="6" className="text-center text-muted py-4">
                                                No hay componentes registrados. Haz clic en "Nuevo Componente".
                                            </CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        componentes.map((comp) => (
                                            <CTableRow key={comp.id}>
                                                <CTableDataCell><strong>#{comp.id}</strong></CTableDataCell>
                                                <CTableDataCell><CBadge color="secondary">{comp.tipo}</CBadge></CTableDataCell>
                                                <CTableDataCell>{comp.marca_modelo}</CTableDataCell>
                                                <CTableDataCell>
                                                    <small className="text-muted">
                                                        {comp.interfaz} | {comp.capacidad}
                                                    </small>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <CBadge color={comp.cantidad > 0 ? 'success' : 'danger'}>
                                                        {comp.cantidad} un.
                                                    </CBadge>
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    {comp.pasillo ? `${comp.pasillo} > ${comp.estante} > ${comp.caja}` : `ID Ubicación: ${comp.ubicacion_id}`}
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

            {/* Modal de Registro */}
            <CModal visible={visible} onClose={() => setVisible(false)} size="lg">
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>Registrar Nuevo Componente</CModalTitle>
                </CModalHeader>
                <CForm onSubmit={handleSubmit}>
                    <CModalBody>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <CFormSelect 
                                    name="tipo_id" 
                                    label="Tipo de Componente" 
                                    value={formData.tipo_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona un tipo...</option>
                                    {tipos.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.nombre}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </div>
                            <div className="col-md-6">
                                <CFormInput 
                                    type="text" 
                                    name="marca_modelo" 
                                    label="Marca y Modelo" 
                                    placeholder="Ej. Kingston A400" 
                                    value={formData.marca_modelo}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-4">
                                <CFormInput 
                                    type="text" 
                                    name="interfaz" 
                                    label="Interfaz / Tipo específico" 
                                    placeholder="Ej. SATA, NVMe, DDR4" 
                                    value={formData.interfaz}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <CFormInput 
                                    type="text" 
                                    name="capacidad" 
                                    label="Capacidad" 
                                    placeholder="Ej. 240GB, 8GB" 
                                    value={formData.capacidad}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-4">
                                <CFormInput 
                                    type="number" 
                                    name="cantidad" 
                                    label="Cantidad inicial" 
                                    placeholder="Ej. 5" 
                                    value={formData.cantidad}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="col-md-12">
                                <CFormSelect 
                                    name="ubicacion_id" 
                                    label="Ubicación Física" 
                                    value={formData.ubicacion_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Selecciona dónde se guardará...</option>
                                    {ubicaciones.map((ub) => (
                                        <option key={ub.id} value={ub.id}>
                                            {ub.pasillo} &gt; {ub.estante} &gt; {ub.caja}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </div>
                        </div>
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => setVisible(false)}>
                            Cancelar
                        </CButton>
                        <CButton color="primary" type="submit">
                            Registrar Componente
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>
        </div>
    );
}