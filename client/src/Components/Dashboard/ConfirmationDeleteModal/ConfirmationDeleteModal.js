import React from 'react';
import StylesCard from './ConfirmationDeleteModal.module.css'; // Adjust the import based on your structure

const ConfirmationDeleteModal = ({ isVisible, onConfirm, onCancel }) => {
    if (!isVisible) return null;

    return (
        <div className={StylesCard.modalOverlay}>
            <div className={StylesCard.modal}>
                <h2>Are you sure you want to Delete?</h2>
                <div className={StylesCard.modalButtons}>
                    <button onClick={onConfirm} className={StylesCard.modalDelete}>Yes, Delete</button>
                    <button onClick={onCancel} className={StylesCard.modalCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDeleteModal;
