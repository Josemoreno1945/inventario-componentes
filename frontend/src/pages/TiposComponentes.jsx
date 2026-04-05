import React, { useState, useEffect } from 'react';
import { 
    CCard, CCardBody, CForm, CFormInput, CButton, 
    CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, 
    CAlert, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react' ;   
import { cilPencil, cilTrash } from '@coreui/icons';


import './TiposComponentes.scss';

export default function TiposComponentes() {
    const [tipos, setTipos] = useState([]);
    const [nombre, setNombre] = useState('');
    const [editingId, setEditingId] = useState(null);
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


    const handleEdit = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/api/tipos-componentes/${id}`);
            const tipo = await response.json();
            setEditingId(id);
            setNombre(tipo.nombre);
            setVisible(true);
        } catch (error) {
            console.error('Error al cargar tipo:', error);
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(null);

        const existe = tipos.some(t => t.nombre.toLowerCase() === nombre.toLowerCase() && t.id !== editingId);
        if (existe) {
            setMensaje({ tipo: 'danger', texto: 'Este nombre ya existe.', details: [] });
            setTimeout(() => setMensaje(null), 3000);
            return;
        }
        
        try {
            const url = editingId 
                ? `http://localhost:5000/api/tipos-componentes/${editingId}`
                : 'http://localhost:5000/api/tipos-componentes';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre }),
            });

            const result = await response.json().catch(() => null);

            if (!response.ok) {
                setMensaje({
                    tipo: 'danger',
                    texto: result?.error || 'Error al guardar.',
                    details: result?.details || [],
                });
                return;
            }

            setMensaje({ tipo: 'success', texto: editingId ? 'Tipo actualizado!' : 'Tipo guardado!', details: [] });
            setNombre('');
            setEditingId(null);
            setVisible(false);
            fetchTipos();
            setTimeout(() => setMensaje(null), 3000);
        } catch (error) {
            setMensaje({ tipo: 'danger', texto: 'No se pudo conectar con el servidor.', details: [] });
        }
    };

    const handleCancelEdit = () => {
        setNombre('');
        setEditingId(null);
        setVisible(false);
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
            <CTableHeaderCell style={{ width: '50%' }}>Nombre</CTableHeaderCell>
            <CTableHeaderCell style={{ width: '40%' }}>Acciones</CTableHeaderCell>
        </CTableRow>
    </CTableHead>



                                <CTableBody>
                                {tipos.length === 0 ? (
                                    <CTableRow>
                                        <CTableDataCell colSpan="3" className="text-center text-muted py-4">
                                            No hay categorías registradas. Ej: GPU, RAM, Almacenamiento.
                                        </CTableDataCell>
                                    </CTableRow>
                                ) : (
                                    tipos.map((t) => (
                                        <CTableRow key={t.id}>
                                            <CTableDataCell><strong>#{t.id}</strong></CTableDataCell>
                                            <CTableDataCell>{t.nombre}</CTableDataCell>
                                            <CTableDataCell className="d-flex gap-1">
                                                <CButton 
                                                    size="sm" 
                                                    color="warning" 
                                                    variant="ghost"
                                                    onClick={() => handleEdit(t.id)}
                                                    title="Editar"
                                                >
                                                    <CIcon icon={cilPencil} />
                                                </CButton>

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

            <CModal visible={visible} onClose={() => setVisible(false)}>
                <CModalHeader onClose={() => setVisible(false)}>
                    <CModalTitle>{editingId ? 'Editar Tipo de Componente' : 'Agregar Nuevo Tipo'}</CModalTitle>
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
                        <CButton color="secondary" onClick={editingId ? handleCancelEdit : () => setVisible(false)}>
                            {editingId ? 'Cancelar' : 'Cancelar'}
                        </CButton>
                        <CButton color="primary" type="submit">
                            {editingId ? 'Actualizar' : 'Guardar'}
                        </CButton>
                    </CModalFooter>
                </CForm>
            </CModal>

        </div>
    );
}