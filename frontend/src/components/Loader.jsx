import React from 'react';

export default function Loader() {
  return (
    <div className="loader-screen">
      <div className="loader-box">
        <div className="loader-spinner" />
        <div className="loader-text">Cargando...</div>
      </div>
    </div>
  );
}
