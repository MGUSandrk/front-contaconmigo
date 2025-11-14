import React, { useState } from 'react';
import SidebarCuentasComponent from './SidebarCuentasComponent';
import SideBarComponent from './SideBarComponent';
import InfoCuentasComponent from './InfoCuentasComponent';

const PlanDeCuentasComponent = () => {
  // Estado que mantiene el ID de la cuenta actualmente seleccionada.
  const [selectedAccountId, setSelectedAccountId] = useState(null);

  // 1. Definimos la función que resetea la cuenta seleccionada.
  const handleDeselectAccount = () => {
    // Esto establece el estado a null, forzando a InfoCuentasComponent
    // a mostrar la vista de "Seleccione una cuenta".
    setSelectedAccountId(null);
  };

  return (
    <div className='d-flex'>
        <SideBarComponent />
        {/* SidebarCuentasComponent actualiza selectedAccountId cuando el usuario hace clic */}
        <SidebarCuentasComponent onSelectAccount={setSelectedAccountId} />
        
        {/* 2. Pasamos la función de deselección al InfoCuentasComponent. */}
        <InfoCuentasComponent 
            id={selectedAccountId} 
            onDeselect={handleDeselectAccount} // <--- ¡Ajuste clave aquí!
        />
    </div>
  );
};

export default PlanDeCuentasComponent;