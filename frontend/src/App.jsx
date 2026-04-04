import { useState } from 'react';
import Nav from './components/Nav';
import Welcome from './components/Welcome';
import Loader from './components/Loader';

// Componentes temporales para que no tire error al importar pantallas vacías
import Buscador from './pages/Buscador';
import Ubicaciones from './pages/Ubicaciones';
import Componentes from './pages/Componentes';
import TiposComponentes from './pages/TiposComponentes';

export default function App() {
    const [currentModule, setCurrentModule] = useState('welcome');
    const [loading, setLoading] = useState(false);

    const navigateTo = (module) => {
        setLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
            setCurrentModule(module);
            setLoading(false);
        }, 650);
    };

    return (
        <div className="app-shell" style={{ minHeight: '100vh' }}>
            {loading && <Loader />}

            {!loading && currentModule !== 'welcome' && (
                <Nav currentModule={currentModule} setModule={navigateTo} />
            )}

            {!loading && currentModule === 'welcome' && (
                <Welcome onStart={() => navigateTo('buscador')} />
            )}

            {!loading && currentModule === 'buscador' && <Buscador />}
            {!loading && currentModule === 'componentes' && <Componentes />}
            {!loading && currentModule === 'tipos-componentes' && <TiposComponentes />}
            {!loading && currentModule === 'ubicaciones' && <Ubicaciones />}
        </div>
    );
}