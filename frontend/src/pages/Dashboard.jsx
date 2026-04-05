import { useState, useEffect } from 'react';
import './Dashboard.scss';

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/dashboard/stats');
            if (!response.ok) throw new Error('Error fetching stats');
            const data = await response.json();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="dashboard-loading">Cargando estadísticas...</div>;
    if (error) return <div className="dashboard-error">Error: {error}. <button onClick={fetchStats}>Reintentar</button></div>;

    const { totals, byTipo, byUbicacion, topComponentes, lowStock } = stats || {};

    return (
        <div className="dashboard-page">
            <div className="dashboard-hero">
                <h1>Dashboard de Inventario</h1>
                <p>Resumen, estadísticas y tops en tiempo real</p>
            </div>

            <div className="dashboard-card card">
                <div className="dashboard-totals-grid">
                    <div className="total-card">
                        <h3>Total Componentes</h3>
                        <div className="total-value">{totals?.totalComponentes || 0}</div>
                    </div>
                    <div className="total-card">
                        <h3>Total Cantidad</h3>
                        <div className="total-value">{totals?.totalCantidad || 0}</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid">
                <div className="stats-card card">
                    <h2>Top 5 Tipos</h2>
                    <div className="stats-list">
                        {byTipo?.map((item, idx) => (
                            <div key={idx} className="stat-item">
                                <span>{item.nombre}</span>
                                <div className="stat-numbers">
                                    <strong>{item.count}</strong> ({item.totalCantidad} unds)
                                </div>
                                <div className="bar" style={{width: `${Math.min(item.count * 20, 100)}%`}}></div>
                            </div>
                        )) || <p>Sin datos</p>}
                    </div>
                </div>

                <div className="stats-card card">
                    <h2>Top 5 Ubicaciones</h2>
                    <div className="stats-list">
                        {byUbicacion?.map((item, idx) => (
                            <div key={idx} className="stat-item">
                                <span>{item.ubicacion}</span>
                                <div className="stat-numbers">
                                    <strong>{item.count}</strong>
                                </div>
                                <div className="bar" style={{width: `${Math.min(item.count * 20, 100)}%`}}></div>
                            </div>
                        )) || <p>Sin datos</p>}
                    </div>
                </div>

                <div className="table-card card">
                    <h2>Top 10 Componentes</h2>
                    <table className="top-table">
                        <thead>
                            <tr>
                                <th>Marca/Modelo</th>
                                <th>Tipo</th>
                                <th>Cant.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topComponentes?.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.marca_modelo}</td>
                                    <td>{item.tipo}</td>
                                    <td><strong>{item.cantidad}</strong></td>
                                </tr>
                            )) || <tr><td colSpan="3">Sin datos</td></tr>}
                        </tbody>
                    </table>
                </div>

                <div className="low-stock-card card">
                    <h2>Stock Bajo (menos de 5 unds)</h2>
                    {lowStock?.length > 0 ? (
                        <ul className="low-stock-list">
                            {lowStock.map((item, idx) => (
                                <li key={idx}>
                                    <span>{item.marca_modelo}</span>
                                    <span className="stock-qty">{item.cantidad} unds</span>
                                    <span className="stock-type">({item.tipo})</span>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="no-low-stock">¡Todo en buen stock!</p>}
                </div>
            </div>
        </div>
    );
}
