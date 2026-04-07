import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './background.scss'
import '@coreui/coreui/dist/css/coreui.min.css' // <-- Estilos de CoreUI

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)