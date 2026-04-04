import React, { useState, useEffect } from 'react';
import {
    CCard,
    CCardBody,
    CForm,
    CFormInput,
    CButton,
    CFormSelect,
    CBadge,
} from '@coreui/react';
import './Buscador.scss';

export default function Buscador() {
    const [componentes, setComponentes] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [ubicaciones, setUbicaciones] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        tipo_id: '',
        ubicacion_id: '',
        interfaz: '',
        capacidad: '',
        minCantidad: '',
        maxCantidad: '',
        onlyStock: false,
    });
    const [resultados, setResultados] = useState([]);
    const [hasSearched, setHasSearched] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [componentesRes, tiposRes, ubicacionesRes] = await Promise.all([
                    fetch('http://localhost:5000/api/componentes'),
                    fetch('http://localhost:5000/api/tipos-componentes'),
                    fetch('http://localhost:5000/api/ubicaciones'),
                ]);

                if (!componentesRes.ok || !tiposRes.ok || !ubicacionesRes.ok) {
                    throw new Error('No se pudieron cargar los datos del servidor.');
                }

                const [componentesData, tiposData, ubicacionesData] = await Promise.all([
                    componentesRes.json(),
                    tiposRes.json(),
                    ubicacionesRes.json(),
                ]);

                setComponentes(componentesData);
                setTipos(tiposData);
                setUbicaciones(ubicacionesData);
                setError(null);
            } catch (err) {
                setError(err.message || 'Error al cargar los datos.');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const normalize = (value) => (value || '').toString().toLowerCase();

    const applyFilters = () => {
        const query = normalize(searchText.trim());

        return componentes.filter((comp) => {
            const ubicacionLabel = comp.pasillo
                ? `${comp.pasillo} ${comp.estante} ${comp.caja}`
                : `${comp.ubicacion_id || ''}`;

            const matchesSearch =
                !query ||
                [comp.marca_modelo, comp.tipo, comp.interfaz, comp.capacidad, ubicacionLabel]
                    .some((value) => normalize(value).includes(query));

            const matchesTipo =
                !filters.tipo_id || comp.tipo_id?.toString() === filters.tipo_id;
            const matchesUbicacion =
                !filters.ubicacion_id || comp.ubicacion_id?.toString() === filters.ubicacion_id;
            const matchesInterfaz =
                !filters.interfaz || normalize(comp.interfaz).includes(normalize(filters.interfaz));
            const matchesCapacidad =
                !filters.capacidad || normalize(comp.capacidad).includes(normalize(filters.capacidad));
            const quantity = Number(comp.cantidad || 0);
            const minCheck =
                !filters.minCantidad || quantity >= Number(filters.minCantidad);
            const maxCheck =
                !filters.maxCantidad || quantity <= Number(filters.maxCantidad);
            const stockCheck = !filters.onlyStock || quantity > 0;

            return (
                matchesSearch &&
                matchesTipo &&
                matchesUbicacion &&
                matchesInterfaz &&
                matchesCapacidad &&
                minCheck &&
                maxCheck &&
                stockCheck
            );
        });
    };

    const handleSearch = (event) => {
        event.preventDefault();
        setResultados(applyFilters());
        setHasSearched(true);
    };

    const handleFilterChange = (event) => {
        const { name, value, type, checked } = event.target;
        setFilters((current) => ({
            ...current,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const clearFilters = () => {
        setFilters({
            tipo_id: '',
            ubicacion_id: '',
            interfaz: '',
            capacidad: '',
            minCantidad: '',
            maxCantidad: '',
            onlyStock: false,
        });
    };

    return (
        <div className="buscador-page">
            <section className="buscador-hero">
                <div>
                    <h1>Busca tu componente</h1>
                    <p className="buscador-description">
                        Escribe lo que necesitas, abre filtros si quieres y presiona Buscar.
                        El resultado se carga al instante desde los datos del frontend.
                    </p>
                </div>
            </section>

            <CCard className="buscador-card">
                <div className="buscador-grid">
                    {Array.from({ length: 64 }).map((_, index) => (
                        <span key={index} />
                    ))}
                </div>
                <CCardBody>
                    <CForm className="buscador-form" onSubmit={handleSearch}>
                        <div className="buscador-row">
                            <div className="search-input-group">
                                <CFormInput
                                    type="search"
                                    name="searchText"
                                    value={searchText}
                                    onChange={(event) => setSearchText(event.target.value)}
                                    placeholder="Buscar componente, marca, interfaz, ubicación..."
                                    className="search-input"
                                />
                                <button type="submit" className="search-button">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 21L16.5 16.5M19 11C19 15.4183 15.4183 19 11 19S3 15.4183 3 11 6.58172 3 11 3 19 6.58172 19 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>

                            <CButton
                                color={showFilters ? 'secondary' : 'outline-secondary'}
                                type="button"
                                className="filter-toggle"
                                onClick={() => setShowFilters((open) => !open)}
                            >
                                {showFilters ? 'Cerrar filtros' : 'Filtrar'}
                            </CButton>
                        </div>

                        {showFilters && (
                            <div className="filter-panel">
                                <div className="filter-grid">
                                    <div>
                                        <CFormSelect
                                            name="tipo_id"
                                            value={filters.tipo_id}
                                            onChange={handleFilterChange}
                                            label="Tipo de componente"
                                        >
                                            <option value="">Todos los tipos</option>
                                            {tipos.map((tipo) => (
                                                <option key={tipo.id} value={tipo.id}>
                                                    {tipo.nombre}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </div>

                                    <div>
                                        <CFormSelect
                                            name="ubicacion_id"
                                            value={filters.ubicacion_id}
                                            onChange={handleFilterChange}
                                            label="Ubicación"
                                        >
                                            <option value="">Todas las ubicaciones</option>
                                            {ubicaciones.map((ubicacion) => (
                                                <option key={ubicacion.id} value={ubicacion.id}>
                                                    {ubicacion.pasillo} &gt; {ubicacion.estante} &gt; {ubicacion.caja}
                                                </option>
                                            ))}
                                        </CFormSelect>
                                    </div>

                                    <div className="filter-checkbox-row">
                                        <input
                                            type="checkbox"
                                            id="onlyStock"
                                            name="onlyStock"
                                            checked={filters.onlyStock}
                                            onChange={handleFilterChange}
                                        />
                                        <label htmlFor="onlyStock">Solo stock disponible</label>
                                    </div>

                                    <div>
                                        <CFormInput
                                            name="interfaz"
                                            value={filters.interfaz}
                                            onChange={handleFilterChange}
                                            label="Interfaz"
                                            placeholder="Ej. SATA, NVMe"
                                        />
                                    </div>

                                    <div>
                                        <CFormInput
                                            name="capacidad"
                                            value={filters.capacidad}
                                            onChange={handleFilterChange}
                                            label="Capacidad"
                                            placeholder="Ej. 240GB, 8GB"
                                        />
                                    </div>

                                    <div className="quantity-inputs">
                                        <div>
                                            <CFormInput
                                                type="number"
                                                min="0"
                                                name="minCantidad"
                                                value={filters.minCantidad}
                                                onChange={handleFilterChange}
                                                label="Cantidad mínima"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <CFormInput
                                                type="number"
                                                min="0"
                                                name="maxCantidad"
                                                value={filters.maxCantidad}
                                                onChange={handleFilterChange}
                                                label="Cantidad máxima"
                                                placeholder="99"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="filter-actions">
                                    <CButton color="secondary" type="button" onClick={clearFilters}>
                                        Limpiar filtros
                                    </CButton>
                                    <span className="filter-helper">
                                        Los filtros se aplican cuando presionas Buscar.
                                    </span>
                                </div>
                            </div>
                        )}
                    </CForm>
                </CCardBody>
            </CCard>

            {error && (
                <CCard className="results-card">
                    <div className="buscador-grid">
                        {Array.from({ length: 64 }).map((_, index) => (
                            <span key={index} />
                        ))}
                    </div>
                    <CCardBody>
                        <p className="error-message">{error}</p>
                    </CCardBody>
                </CCard>
            )}

            {hasSearched && (
                <CCard className="results-card">
                    <div className="buscador-grid">
                        {Array.from({ length: 64 }).map((_, index) => (
                            <span key={index} />
                        ))}
                    </div>
                    <CCardBody>
                        {loading ? (
                            <p>Cargando resultados...</p>
                        ) : resultados.length === 0 ? (
                            <p className="empty-results">No se encontraron componentes con esos criterios.</p>
                        ) : (
                            <div className="results-table-wrapper">
                                <table className="results-table">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Tipo</th>
                                            <th>Marca / Modelo</th>
                                            <th>Especificación</th>
                                            <th>Cant.</th>
                                            <th>Ubicación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {resultados.map((comp) => (
                                            <tr key={comp.id}>
                                                <td>#{comp.id}</td>
                                                <td>
                                                    <CBadge color="secondary">{comp.tipo}</CBadge>
                                                </td>
                                                <td>{comp.marca_modelo}</td>
                                                <td>
                                                    <small className="text-muted">
                                                        {comp.interfaz} | {comp.capacidad}
                                                    </small>
                                                </td>
                                                <td>
                                                    <CBadge color={comp.cantidad > 0 ? 'success' : 'danger'}>
                                                        {comp.cantidad} un.
                                                    </CBadge>
                                                </td>
                                                <td>
                                                    {comp.pasillo
                                                        ? `${comp.pasillo} > ${comp.estante} > ${comp.caja}`
                                                        : `ID Ubicación: ${comp.ubicacion_id}`}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CCardBody>
                </CCard>
            )}
        </div>
    );
}
