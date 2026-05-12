import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [modal, setModal] = useState({ isOpen: false, message: '', type: 'info', onConfirm: null });

    const showAlert = (message, type = 'info') => {
        setModal({ isOpen: true, message, type, onConfirm: null });
    };

    const showConfirm = (message, onConfirmCallback) => {
        setModal({ isOpen: true, message, type: 'confirm', onConfirm: onConfirmCallback });
    };

    const closeModal = () => setModal({ isOpen: false, message: '', type: 'info', onConfirm: null });

    return (
        <ModalContext.Provider value={{ showAlert, showConfirm }}>
            {children}
            {modal.isOpen && (
                <div style={overlayStyle}>
                    <div style={modalStyle}>
                        <p>{modal.message}</p>
                        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            {modal.type === 'confirm' && (
                                <button onClick={() => { modal.onConfirm(); closeModal(); }}>Igen</button>
                            )}
                            <button onClick={closeModal}>{modal.type === 'confirm' ? 'Mégsem' : 'Rendben'}</button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
};

// Egyszerű inline CSS a demó kedvéért
const overlayStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalStyle = {
    background: '#fff', padding: '20px', borderRadius: '8px', minWidth: '300px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)', color: '#333'
};
