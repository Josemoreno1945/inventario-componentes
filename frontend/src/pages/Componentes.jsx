import React, { useState, useEffect } from 'react';
import { 
    CCard, CCardBody, CForm, CFormInput, CButton, CFormSelect,
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, 
    CAlert, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
    CBadge
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import './Componentes.scss';

export default function Componentes() {
    // Estados para datos
    const [componentes, setComponentes] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [tipos, setTipos] = useState([]);
    
    // Estado para el formulario de creación
    const [formData, setFormData] = useState({
        tipo_id: '',
        marca_modelo: '',
        interfaz: '',
        capacidad: '',
        cantidad: '',
        ubicacion_id: ''
    });

    // Estado para ajuste de cantidad
    const [visibleAdjust, setVisibleAdjust] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [deltaInput, setDeltaInput] = useState(1);
    const [loadingAdjust, setLoadingAdjust] = useState(false);

    // Edit/Delete states
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    const [loading, setLoading] = useState(false);

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

    // Edit modal
    const openEditModal = (comp) => {
        setFormData({
            tipo_id: comp.tipo_id.toString(),
            marca_modelo: comp.marca_modelo,
            interfaz: comp.interfaz || '',
            capacidad: comp.capacidad || '',
            cantidad: comp.cantidad.toString(),
            ubicacion_id: comp.ubicacion_id.toString()
        });
        setEditId(comp.id);
        setEditMode(true);
        setVisible(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editId) return;
        setMensaje(null);
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/api/componentes/${editId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                setMensaje({ tipo: 'danger', texto: result.error || 'Error al actualizar' });
                return;
            }

            setMensaje({ tipo: 'success', texto: 'Componente actualizado' });
            setVisible(false);
            setEditMode(false);
            setEditId(null);
            fetchComponentes();
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            setMensaje({ tipo: 'danger', texto: 'Error de conexión' });
        } finally {
            setLoading(false);
        }
    };

    // Delete
    // No delete functionality

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editMode) {
            await handleUpdate(e);
            return;
        }
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

    // Funciones para ajustar cantidad
    const openAdjustModal = (id) => {
        setSelectedId(id);
        setDeltaInput(1);
        setVisibleAdjust(true);
    };

    const handleAdjust = async (operation) => {
        if (!selectedId) return;
        
        const delta = operation === 'increase' ? Math.abs(deltaInput) : -Math.abs(deltaInput);
        setLoadingAdjust(true);
        setMensaje(null);

        try {
            const response = await fetch(`http://localhost:5000/api/componentes/${selectedId}/cantidad`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ delta }),
            });

            const result = await response.json();

            if (!response.ok) {
                setMensaje({
                    tipo: 'danger',
                    texto: result.error || 'Error al ajustar cantidad.',
                });
                return;
            }

            setMensaje({ 
                tipo: 'success', 
                texto: `Cantidad ${operation === 'increase' ? 'aumentada' : 'restada'}: ${result.componente.cantidad} un.` 
            });
            setVisibleAdjust(false);
            fetchComponentes(); // Refresh list
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            setMensaje({
                tipo: 'danger',
                texto: 'No se pudo conectar con el servidor.',
            });
        } finally {
            setLoadingAdjust(false);
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
                                                    <div className="d-flex align-items-center gap-2">
                                                        <CBadge color={comp.cantidad > 0 ? 'success' : 'danger'}>
                                                            {comp.cantidad} un.
                                                        </CBadge>
                                                        <div className="btn-group btn-group-sm" role="group">
                                                            <CButton 
                                                                color="success" 
                                                                size="sm" 
                                                                onClick={() => openAdjustModal(comp.id)}
                                                                title="Aumentar cantidad"
                                                            >
                                                                ➕
                                                            </CButton>
                                                            {comp.cantidad > 0 && (
                                                                <CButton 
                                                                    color="danger" 
                                                                    size="sm" 
                                                                    onClick={() => openAdjustModal(comp.id)}
                                                                    title="Restar cantidad"
                                                                >
                                                                    ➖
                                                                </CButton>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CTableDataCell>
                                                <CTableDataCell>
{comp.pasillo ? `${comp.pasillo} > ${comp.estante} > ${comp.caja}` : `ID Ubicación: ${comp.ubicacion_id}`}
                                                </CTableDataCell>
                                                <CTableDataCell className="text-end">
                                                    <div className="d-flex gap-1">
                                                        <CButton 
                                                            size="sm" 
                                                            color="warning" 
                                                            variant="ghost"
                                                            onClick={() => openEditModal(comp)}
                                                            title="Editar"
                                                        >
                                                            <CIcon icon={cilPencil} />
                                                        </CButton>
                                                    </div>
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
{editMode ? `Editar Componente #${editId}` : 'Registrar Nuevo Componente'}
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
                                            {`${ub.pasillo} > ${ub.estante} > ${ub.caja}`}
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
                        <CButton color="primary" type="submit" disabled={loading}>
                            {editMode ? 'Actualizar' : 'Registrar Componente'}
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>



            {/* Modal de Ajuste de Cantidad */}
            <CModal visible={visibleAdjust} onClose={() => setVisibleAdjust(false)}>
                <CModalHeader onClose={() => setVisibleAdjust(false)}>
                    <CModalTitle>Ajustar Cantidad - Componente #{selectedId}</CModalTitle>
                </CModalHeader>
                <CModalBody className="text-center">
                    <div className="mb-4">
                        <CButton 
                            color="success" 
                            size="lg" 
                            className="me-3"
                            onClick={() => handleAdjust('increase')}
                            disabled={loadingAdjust}
                        >
                            ➕ Aumentar
                        </CButton>
                        <CButton 
                            color="danger" 
                            size="lg"
                            onClick={() => handleAdjust('decrease')}
                            disabled={loadingAdjust}
                        >
                            ➖ Restar
                        </CButton>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Cantidad a ajustar:</label>
                        <CFormInput 
                            type="number" 
                            value={deltaInput}
                            onChange={(e) => setDeltaInput(Math.abs(parseInt(e.target.value) || 1))}
                            min="1"
                            max="999"
                            className="w-25 mx-auto"
                            disabled={loadingAdjust}
                        />
                    </div>
                    <small className="text-muted">Usa los botones ➕/➖ o ajusta el número arriba.</small>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisibleAdjust(false)} disabled={loadingAdjust}>
                        Cancelar
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
}
