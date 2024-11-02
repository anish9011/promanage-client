import React, { useState } from 'react';
import { Modal } from 'react-responsive-modal';
import axios from 'axios'; // Make sure to import axios
import StylesAddBoard from './AddBoardModal.module.css';
import { toast } from 'react-toastify'; // Assuming you're using react-toastify for notifications

const AddBoardModal = ({ open, onClose }) => {
    const [boardName, setBoardName] = useState('');
    const [emailList, setEmailList] = useState([]); // State for email list
    const [showDropdown, setShowDropdown] = useState(false); // Manage dropdown visibility
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false); // State for confirmation modal
    const [addedEmail, setAddedEmail] = useState(''); // State to store the email that was added

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        const uId = localStorage.getItem('id');

        const data = {
            userId: uId,
            boardUser: boardName,
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/api/boarduser',
                data,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status >= 200 && response.status < 300) {
                setEmailList(response.data.tasks);
                setAddedEmail(boardName); // Store the added email
                setConfirmationModalOpen(true); // Open confirmation modal
                setBoardName(''); // Clear the input field
            } else {
                console.error('Unexpected response:', response);
                toast.error('Unexpected response from server');
            }
        } catch (error) {
            console.error('Error adding email:', error);
            toast.error('Error adding email'); 
        }
    };

    const handleCancel = () => {
        setBoardName('');
        onClose();
    };

    const handleConfirmationClose = () => {
        setConfirmationModalOpen(false);
        onClose(); // Close the main modal after confirmation
    };

    return (
        <>
            <Modal open={open} onClose={onClose} center classNames={{ modal: StylesAddBoard.modal }} showCloseIcon={false}>
                <div className={StylesAddBoard.container}>
                    <h2>Add people to the board</h2>
                    <input
                        type="text"
                        placeholder="Enter the email"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                    />
                    <div className={StylesAddBoard.buttonContainer}>
                        <button onClick={handleCancel} className={StylesAddBoard.cancelButton}>Cancel</button>
                        <button onClick={handleSubmit} className={StylesAddBoard.addButton}>Add Email</button>
                    </div>
                </div>
            </Modal>

            {/* Confirmation Modal */}
            <Modal open={confirmationModalOpen} onClose={handleConfirmationClose} center classNames={{ modal: StylesAddBoard.secondModal }} showCloseIcon={false}>
                <div className={StylesAddBoard.secondContainer}>
                    <h2>{addedEmail}  added to the board</h2>
                    <button onClick={handleConfirmationClose}>Okay, got it!</button>
                </div>
            </Modal>
        </>
    );
};

export default AddBoardModal;
